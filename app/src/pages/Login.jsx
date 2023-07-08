import React, { useState } from "react";
import {Button} from "reactstrap";

const API_URL = "http://sefdb02.qut.edu.au:3001"

// login page
export default function Login({token}, {setToken}) {
  const [user, setUser] = useState(localStorage.getItem("username"));
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [logIn, setLogIn] = useState(false);

  function post(){
    const url = `${API_URL}/user/login`

    return fetch(url, {
      method: "POST",
      headers: {accept: "application/json", "Content-Type": "application/json"},
      body: JSON.stringify({email: name, password: password})
    })
    .then(res => res.json())
    .then(res => {
      if (res.token_type === "Bearer"){
        setLogIn(true);
        localStorage.setItem("username", name);   
        localStorage.setItem("token", res.token);  
        setUser(localStorage.getItem("username")); 
        setToken(localStorage.getItem("token"));
      } else {
        setError(res.message);
      }
    });
  }

  return (
    <div className="login">
      <h2>Login</h2>
      <label htmlFor={name}>Email: </label>
      <input
        className="log-email"
        type="text"
        name="name"
        id="name"
        placeholder="jane.doe@example.com"
        value={name}
        onChange={(event) => {
          const { value } = event.target;
          setName(value);
        }}
      />
      <br />
      <label htmlFor={password}>Password: </label>
      <input
        className="log-password"
        type="password"
        name="password"
        id="password"
        placeholder="Password"
        value={password}
        onChange={(event) => {
          const { value } = event.target;
          setPassword(value);
        }}
      />
      <br />
      {error ? <p>Error: {error}</p> : null}
      {logIn ? <p>Logged in as: {user}</p> : null}
      <Button onClick={() =>{
        if (logIn &&  ((name !== user) && (user !== null && user !== 'undefined')) && (token !== null && token !== 'undefined')){
          setError(`Already logged in as: ${user}`);
        }else{
          setError(null)
          post()
        }
          }}>Login</Button>
      
    </div>
  );
}
