import React from "react";
import { useState } from "react";
import { Navigate } from 'react-router-dom'

const Registerpage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false)


  const register = async (ev) => {
    ev.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setRedirect(true);
        alert("Registration successful");
      } else {
        alert("Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed. Please try again later.");
    }
  };
  
  if (redirect) {
    return <Navigate to={"/login"} />
}

// const alertregister = () => {
//   alert("Registration successful");
// };


  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        required
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        required
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button>Register</button>
    </form>
  );
};

export default Registerpage;
