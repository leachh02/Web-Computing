import React from "react";
import { Link } from "react-router-dom";

// navigation links
export default function Nav({token}, {setToken}) {
  return (
    <nav>
      <ul>
        <li>
          <Link to = "/">Home</Link>
        </li>
        <li>
          <Link to = "/list?country=Algeria">Volcano List</Link>
        </li>
        <li>
          {(token) && (<Link to = "/login" onClick={ () =>{
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            setToken()}}>Logout</Link>)}
        </li>
        <li>
          {!(token) && (<Link to = "/register">Register</Link>)}
        </li>
        <li>
          {!(token) && (<Link to = "/login">Login</Link>)}
        </li>
      </ul>
    </nav>
  );
}
