import React from "react";
import Nav from "./Nav";

// the header
export default function Header({token}, {setToken}) {
  return (
    <header>
      <div id="icon">
        <img src="img/icon.png" alt="Icon" />
      </div>

      <Nav token={token} setToken={setToken}/>
    </header>
  );
}
