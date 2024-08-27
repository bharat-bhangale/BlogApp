import React, { useState } from "react";
import {Navigate} from "react-router-dom";
import Editor from "./Editor";


const Createpost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false)

  const data = new FormData();
  data.set("title", title);
  data.set("summary", summary);
  data.set("content", content);
  data.set("files", files[0]);
 async function createNewPost(ev) {
    ev.preventDefault();

    console.log(files);
    const response = await fetch("http://localhost:8080/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });
    if(response.ok)
    {
      setRedirect(true);
    }
  }

  if(redirect)
  {
    return <Navigate to={"/"} />
  }
  return (
    <form onSubmit={createNewPost}>
      <div className="mb-3 ">
      <label htmlFor="title">Title:</label>
      <input
        type="title"
        placeholder="title"
        value={title}
        required
        onChange={(ev) => setTitle(ev.target.value)
          }
      />
      </div>
      <div className="mb-3 ">
      <label htmlFor="summary">Summary:</label>
      <input
        type="summary"
        placeholder="summary"
        value={summary}
        required
        onChange={(ev) => setSummary(ev.target.value)}
      />
      </div>
      <div className="mb-3 ">
      <input type="file" onChange={(ev) => setFiles(ev.target.files)} required />
      </div>
      <div className="mb-3 ">
      <label htmlFor="content">Content</label>
      <Editor value={content} onChange={setContent} required/>
      </div>
      <button style={{ marginTop: "5px" }}>Create Post</button>
    </form>
  );
};

export default Createpost;
