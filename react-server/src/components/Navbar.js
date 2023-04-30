import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "../static/css/Navbar.css";
import logo from "../logo.png";
import { redirect, useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const [showBlack, setShowDark] = useState(false);
  const navigate = useNavigate();
  const [logoutButton, setLogoutButton] = useState("false");
  const navbartransition = () => {
    if (window.scrollY > 100) {
      setShowDark(true);
    } else {
      setShowDark(false);
    }
  };

  const handleClick = async () => {
    try {
      const response = await axios.post("http://localhost:8000/Logout");
      console.log(response);
      localStorage.clear();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setLogoutButton(localStorage.getItem("session_auth"));
    // console.log(logoutButton, typeof logoutButton);
  }, [localStorage.getItem("session_auth")]);

  useEffect(() => {
    window.addEventListener("scroll", navbartransition);
    return () => window.removeEventListener("scroll", navbartransition);
  }, []);

  return (
    <div className={`nav ${showBlack && "navBlack"}`}>
      <Sidebar />
      <div className="navContent">
        <img className="logo" src={logo} alt="MovieMaster" />
        <img
          className="avatar"
          src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
          alt="Avatar"
        />
        {logoutButton == "true" ? (
          <button
            onClick={() => {
              handleClick();
              setLogoutButton(false);
              navigate("/login");
            }}
          >
            Logout
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default Navbar;
