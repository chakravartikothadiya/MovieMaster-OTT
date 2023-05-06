import React, { Component, useContext, useEffect, useState } from "react";
import "../App.css";
import axios from "axios";
import Home from "./Home";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { AuthContext } from "../UserContext";

const Login = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [user_session, setUsersession] = useState({});
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [auth, setAuth] = useState(false);
  const [session_exists, setSessionExists] = useState(false);
  const location = useLocation();
  let expired = location.state && location.state.expired;
  let session_expired = location.state && location.state.session_expired;
  const msg_exp =
    "All your current sessions has been expired on this browser. Please Logout and Login again";

  const msg = useLocation().state;

  // console.log(typeof window.location.pathname);
  // console.log(localStorage.getItem("session_auth"));
  if (localStorage.getItem("session_auth") == "true") {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register" ||
      window.location.pathname === "/resetpass"
    ) {
      <Navigate to="/" />;
    }
  }
  // console.log(msg);
  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log(event);
    try {
      setInvalidEmail(false);
      setAuth(false);
      setRedirect(false);

      if (localStorage.getItem("session_auth") == "true") {
        setSessionExists(true);
      }

      // response will have a session containing emailID and "login" key with a boolean value.
      const response = await axios.post("http://localhost:8000/LoginForm", {
        email,
        password,
      });
      // check!
      if (response && !response.data.code) {
        // console.log(response);
        const { login, emailID, uid } = response.data && response.data;

        // console.log("EMAIL FROM HOME", emailID);
        // emailID = emailID.split('"')[1];
        const obj = { login, emailID, uid };

        localStorage.setItem(
          "session_auth",
          JSON.stringify(response.data.login)
        );
        localStorage.setItem(
          "session_email",
          JSON.stringify(response.data.emailID)
        );
        localStorage.setItem(
          "session_userID",
          JSON.stringify(response.data.uid)
        );
        setCurrentUser(obj);
        setUsersession(currentUser);
        // console.log("Current User", currentUser);
        // console.log("= User_SESSION", user_session);
        // console.log(response.data);
        setRedirect(true);
        navigate("/", { state: { user_session: response.data } });
      } else {
        if (response.data.code == "auth/invalid-email") setInvalidEmail(true);
        if (
          response.data.code == "auth/wrong-password" ||
          response.data.code == "auth/user-not-found"
        )
          setAuth(true);
        // console.log(response.data.code);
      }

      // setUsersession(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {
  //   setCurrentUser(currentUser);
  // }, []);
  // useEffect(() => {
  //   if (redirect) {
  //     navigate("/", { state: { user_session: user_session } });
  //   }
  // }, [redirect]);

  const theme = createTheme({ palette: { mode: "dark" } });

  return localStorage.getItem("session_auth") ? (
    // (window.location.pathname = "/")
    <div></div>
  ) : // <Home />
  expired && expired ? (
    <div style={{ color: "white" }}>{msg_exp}</div>
  ) : (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" className="Label">
            Login
          </Typography>
          {session_expired && session_expired
            ? "Your session was expired"
            : null}
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              value={email}
              name="email"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            {invalidEmail && invalidEmail ? "Invalid EmailID" : null}
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              value={password}
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {auth && auth ? "wrong email or password" : null}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              color="error"
            >
              Login
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/resetpass" variant="body2" className="Link">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2" className="Link">
                  Do not have an account? Sign Up?
                </Link>
              </Grid>
            </Grid>
          </Box>
          {msg && msg ? msg.msg : null}
          {/* {redirect ? (
            <Navigate to={{ pathname: "/home" }} />
          ) : null} */}
          {/* {redirect && navigate("/home", { state: { username: user_session } })} */}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
