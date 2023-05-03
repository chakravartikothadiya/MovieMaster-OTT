import React, { useContext, useEffect } from "react";
import "./App.css";
import RegistrationForm from "./components/RegistrationForm";
import Login from "./components/Login";
import Passreset from "./components/Passreset";
import ProtectedRoutes from "./ProtectedRoutes";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Genre from "./components/Genre";
import Navbar from "./components/Navbar";
import LoadMovie from "./components/LoadMovie";
import SearchPage from "./components/SearchPage";
import UserContext, { AuthContext } from "./UserContext";
import { useLocation, useNavigate } from "react-router-dom";

//Gloabal Variable
window.myGlobalUserId = null;

function App() {
  const [currentUser] = useContext(AuthContext);
  useEffect(() => {
    console.log({ currentUser });
    const access = () => {
      if (currentUser === null) {
        return true;
      } else {
        return false;
      }
    };
  }, []);

  const access = () => {
    if (currentUser === null) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegistrationForm />} />
          {/* The Routes from here on will be protected Routes. All routes expect Login and Register and in futuer Forgot password will be only non protected routes */}

          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/genre/:id" element={<Genre />} />
            <Route path="/movie/:id" element={<LoadMovie />} />
            <Route path="/search" element={<SearchPage />} />
          </Route>
          <Route exact path="/resetpass" element={<Passreset />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
