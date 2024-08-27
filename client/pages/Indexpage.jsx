import React, { useEffect,useState } from "react";
import Post from "../componenets/Post";

const Indexpage = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8080/post").then((response) => {
      response.json().then((posts) => {
       setPosts(posts);
      });
    });
  }, []);
  return (
    <>
      {posts.length > 0 && posts.map(post => (
        <Post key={post._id} {...post} />
      ))}
    </>
  );
};

export default Indexpage;
