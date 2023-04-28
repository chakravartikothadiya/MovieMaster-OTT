import logo from "./logo.svg";
import "./App.css";
import RegistrationForm from "./components/RegistrationForm";
import Login from "./components/Login";
import Passreset from "./components/Passreset";
import Chatroom from "./components/Chatroom";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Redirect } from "react-router-dom";
import Home from "./components/Home";

function App() {
  let session_data = localStorage.getItem("session_auth");
  console.log(session_data);
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/register" element={<RegistrationForm />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/resetpass" element={<Passreset />} />
        {/* <Route exact path="/chatroom" element={<Chatroom />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
