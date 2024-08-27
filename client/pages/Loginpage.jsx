import React, { useContext } from "react";
import { useState } from "react";
import { Navigate } from 'react-router-dom'
import { UserContext } from "../componenets/Usercontext";

const Loginpage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext)

    const login = async (ev) => {
        ev.preventDefault();
        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',

        })
        if (response.ok) {
            response.json().then(userInfo => {
                setUserInfo(userInfo);
                setRedirect(true);
                alert("Login Successful");
            })
            setRedirect(true);
        }
        else {
            alert("Login Failed");
        }

    }

    if (redirect) {
        return <Navigate to={"/"} />
    }

    // const alertlogin = () => {
    //     alert("Login Successful");
    // };

    return (
        <form className="login" onSubmit={login}>
            <h1>Login</h1>
            <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(ev) => setUsername(ev.target.value)}
            />
            <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
            />
            <button>Login</button>
        </form>
    );
};

export default Loginpage;
