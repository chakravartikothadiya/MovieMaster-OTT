import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "../static/css/Navbar.css";
import logo from "../logo.png";
import { Link, redirect, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineLogout } from "react-icons/ai";

function Navbar() {
  const location = useLocation();
  let session;
  let userId;
  let email;
  let username;
  if (location.pathname === "/") {
    session = location.state && location.state.user_session;
    userId = session && session.uid;
    email = session && session.emailID;
    username = email && email.split("@").shift();
  }

  const [showBlack, setShowDark] = useState(false);
  const [serKey, setSearchKey] = useState("");

  const [displaySearchbar, setDisplaySearchbar] = useState(false);
  const [displayAvtSdBar, setdisplayAvtSdBar] = useState(true);
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
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setLogoutButton(localStorage.getItem("session_auth"));
  }, [localStorage.getItem("session_auth")]);

  useEffect(() => {
    window.addEventListener("scroll", navbartransition);
    return () => window.removeEventListener("scroll", navbartransition);
  }, []);

  useEffect(() => {
    geturl();
  }, [location.pathname]);

  const geturl = async () => {
    if (location.pathname === "/" || location.pathname === "/search") {
      setDisplaySearchbar(true);
    } else {
      setDisplaySearchbar(false);
    }

    if (location.pathname === "/login" || location.pathname === "/register") {
      setdisplayAvtSdBar(false);
    } else {
      setdisplayAvtSdBar(true);
    }
  };

  const handleSearch = (event) => {
    setSearchKey(event.currentTarget.value);
    if (event.currentTarget.value) {
      navigate("/search", {
        state: {
          skey: event.currentTarget.value,
          userId: userId,
          username: username,
        },
      });
    } else {
      navigate("/");
    }
  };

  return (
    <div className={`nav ${showBlack && "navBlack"}`}>
      {displayAvtSdBar && <Sidebar />}
      <div className="navContent">
        <img
          className="logo"
          src={logo}
          alt="MovieMaster"
          onClick={() => navigate(`/`)}
        />
        {displaySearchbar && (
          <div className="searchBox">
            <label
              hidden
              htmlFor="searchInput"
              style={{ color: "white", backgroundColor: "#747474" }}
            >
              Search:
            </label>
            <input
              type="text"
              placeholder="Search..."
              onChange={handleSearch}
              id="searchInput"
            />
          </div>
        )}
        {logoutButton == "true" ? (
          <button
            className="logoutButton"
            onClick={() => {
              handleClick();
              setLogoutButton(false);
              navigate("/login");
            }}
          >
            <AiOutlineLogout />{" "}
            <span style={{ marginLeft: "5px" }}>Logout</span>
          </button>
        ) : null}
        {displayAvtSdBar && (
          <Link to={"/profile"}>
            <img
              className="avatar"
              src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
              alt="Avatar"
            />
          </Link>
        )}
      </div>
    </div>
  );
}

export default Navbar;
