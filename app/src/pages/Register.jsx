import React, { useState } from "react";
import {Button} from "reactstrap";

const API_URL = "http://sefdb02.qut.edu.au:3001"
// registration page
export default function Register() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const [error, setError] = useState(null);
  const [userCreated, setuserCreated] = useState(false);

  function post(){
    const url = `${API_URL}/user/register`

    return fetch(url, {
      method: "POST",
      headers: {accept: "application/json", "Content-Type": "application/json"},
      body: JSON.stringify({email: name, password: password})
    })
    .then(res => res.json())
    .then(res => {
      if (res.message === 'User created'){
        setuserCreated(true);
      } else {
        setError(res.message);
      }
    })
    .catch((e) => {
      console.log(e)
    });
  }

  return (
    <div className="late-registration">
      <h2>Register</h2>
      <label htmlFor={name}>Email: </label>
      <input
        className="reg-email"
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
        className="reg-password"
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
      <label htmlFor={checkPassword}>Re-enter Password: </label>
      <input
        className="reg-confirmPassword"
        type="password"
        name="checkPassword"
        id="checkPassword"
        placeholder="Confirm"
        value={checkPassword}
        onChange={(event) => {
          const { value } = event.target;
          setCheckPassword(value);
        }}
      />
      <br />
      {(error) ? <p>Error: {error}</p> : null}
      {(userCreated) ? <p>User Created!</p> : null}
      <Button onClick={() => {
          if (password !== checkPassword){
            setError("Passwords do not match");
          } else {
            setError(null)
            post()
          }
        }} >Register</Button>
    </div>
  );;
}
