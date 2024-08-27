require('dotenv').config();

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleWare = multer({ dest: "uploads/" });
const fs = require("fs");
const Post = require("./models/Post");
const path = require("path");

const saltRounds = 10;
const secret = process.env.SECRET;
const dburl = process.env.MONGO_URL;

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

mongoose.connect(
  dburl,
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userdoc = await User.create({
      username,
      password: bcrypt.hashSync(password, saltRounds),
    });
    res.json(userdoc);
  } catch (e) {
    console.error(e);
    res.status(400).json({ message: "Error creating user" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userdoc = await User.findOne({ username });
    if (!userdoc) return res.status(400).json("User not found");

    const passOk = bcrypt.compareSync(password, userdoc.password);
    if (passOk) {
      jwt.sign({ username, id: userdoc._id }, secret, {}, (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json({
          id: userdoc._id,
          username,
        });
      });
    } else {
      res.status(400).json("Wrong credentials");
    }
  } catch (e) {
    console.error(e);
    res.status(500).json("Server error");
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) return res.status(401).json("Unauthorized");
    res.json(info);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "", { expires: new Date(0) }).json("ok");
});

app.post("/post", uploadMiddleWare.single("files"), async (req, res) => {
  const { originalname, path: tempPath } = req.file;
  const ext = path.extname(originalname);
  const newPath = tempPath + ext;

  fs.rename(tempPath, newPath, async (err) => {
    if (err) return res.status(500).json("Error saving file");

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) return res.status(401).json("Unauthorized");

      const { title, summary, content } = req.body;
      const postdoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id,
      });
      res.json(postdoc);
    });
  });
});

app.get("/post", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (e) {
    console.error(e);
    res.status(500).json("Server error");
  }
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const postdoc = await Post.findById(id).populate("author", ["username"]);
    res.json(postdoc);
  } catch (e) {
    console.error(e);
    res.status(500).json("Server error");
  }
});

app.put("/post", uploadMiddleWare.single("files"), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path: tempPath } = req.file;
    const ext = path.extname(originalname);
    newPath = tempPath + ext;

    fs.rename(tempPath, newPath, async (err) => {
      if (err) return res.status(500).json("Error saving file");

      await updatePost();
    });
  } else {
    await updatePost();
  }

  async function updatePost() {
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) return res.status(401).json("Unauthorized");

      const { id, title, summary, content } = req.body;
      try {
        const postdoc = await Post.findById(id);
        const isAuthor = JSON.stringify(postdoc.author) === JSON.stringify(info.id);
        if (!isAuthor) return res.status(400).json("Not author of this post");

        await Post.updateOne(
          { _id: id },
          {
            $set: {
              title,
              summary,
              content,
              cover: newPath ? newPath : postdoc.cover,
            },
          }
        );

        const updatedPost = await Post.findById(id);
        res.json(updatedPost);
      } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json("Error updating post");
      }
    });
  }
});



app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", "index.html"));
});

app.listen(8080, () => {
  console.log(`Server is listening on http://localhost:8080`);
});
