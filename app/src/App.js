import React, {useState, useEffect} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
//components
import Header from "./components/Header";
import Footer from "./components/Footer";
//pages
import Home from './pages/Home';
import List from './pages/List';
import Login from './pages/Login';
import Register from './pages/Register';
import Volcano from "./pages/Volcano";
//styling
import './App.css';

//Main App
export default function App() {
  const [token, setToken] = useState(null)

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, [])

  return (
    <div className="App">
      <BrowserRouter>     
      <Header token={token} setToken={setToken}/> 
      <Routes>
        <Route path = "/" element = {<Home/>} />
        <Route path = "/list" element = {<List/>} />
        <Route path = "/login" element = {<Login token={token} setToken={setToken}/>} />
        <Route path = "/register" element = {<Register/>} />
        <Route path = "/volcano" element = {<Volcano token={token}/>} />
      </Routes>
      <Footer/>
    </BrowserRouter>
    </div>
  );
}
