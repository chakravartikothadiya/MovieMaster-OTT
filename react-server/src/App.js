import React from "react";
import "./App.css";
import RegistrationForm from "./components/RegistrationForm";
import Login from "./components/Login";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Home from "./components/Home";
import Genre from "./components/Genre";
import Navbar from "./components/Navbar";
import LoadMovie from "./components/LoadMovie";

function App() {
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
