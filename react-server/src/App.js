import logo from "./logo.svg";
import "./App.css";
import RegistrationForm from "./components/RegistrationForm";
import Login from "./components/Login";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Redirect } from "react-router-dom";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/register" element={<RegistrationForm />} />
        <Route exact path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
