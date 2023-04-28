import React from "react";
import "./App.css";
import RegistrationForm from "./components/RegistrationForm";
import Login from "./components/Login";
import Passreset from "./components/Passreset";
import Chatroom from "./components/Chatroom";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Home from "./components/Home";
import Genre from "./components/Genre";
import Navbar from "./components/Navbar";
import LoadMovie from "./components/LoadMovie";

function App() {
  let session_data = localStorage.getItem("session_auth");
  console.log(session_data);
  return (
    <Router>

      <div className="app">
        <Navbar />
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<RegistrationForm />} />

          {/* The Routes from here on will be protected Routes. All routes expect Login and Register and in futuer Forgot password will be only non protected routes */}
          <Route exact path="/" element={<Home />} />
          <Route exact path="/genre/:id" element={<Genre />} />
          <Route exact path="/movie/:id" element={<LoadMovie />} />
          <Route exact path="/resetpass" element={<Passreset />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
