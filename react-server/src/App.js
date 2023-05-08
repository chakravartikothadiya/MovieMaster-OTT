import React, { useContext, useEffect } from "react";
import "./App.css";
import RegistrationForm from "./components/RegistrationForm";
import Login from "./components/Login";
import Passreset from "./components/Passreset";
import ProtectedRoutes from "./ProtectedRoutes";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Home from "./components/Home";
import Genre from "./components/Genre";
import Navbar from "./components/Navbar";
import LoadMovie from "./components/LoadMovie";
import SearchPage from "./components/SearchPage";
import UserContext, { AuthContext } from "./UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import Profilepage from "./components/Profilepage";

//Gloabal Variable
window.myGlobalUserId = null;

function App() {
  const [currentUser] = useContext(AuthContext);
  useEffect(() => {
    console.log({ currentUser });
    access();
  }, []);

  const access = () => {
    if (currentUser === undefined) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/login" element={access() ? <Login /> : <Home />} />
          <Route
            path="/register"
            element={access() ? <RegistrationForm /> : <Navigate to="/" />}
          />
          {/* <Route path="/register" element={<RegistrationForm />} /> */}
          {/* The Routes from here on will be protected Routes. All routes expect Login and Register and in futuer Forgot password will be only non protected routes */}

          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<Home />} />
            <Route path="/genre/:id" element={<Genre />} />
            <Route path="/movie/:id" element={<LoadMovie />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/profile" element={<Profilepage />} />
          </Route>
          <Route
            exact
            path="/resetpass"
            element={access() ? <Passreset /> : <Navigate to="/" />}
          />
          <Route
            exact
            path="/*"
            element={<h1 style={{color:"white",marginTop:80,textAlign:"center",fontSize:"18vw"}}>404</h1>}
          />
        </Routes>
        <footer
          style={{
            fontSize: "12px",
            color: "white",
            marginLeft: "20px",
            padding: "10px",
            marginBottom: "20px",
          }}
        >
          © 2023 MovieMaster, Inc.
        </footer>
      </div>
    </Router>
  );
}

export default App;
