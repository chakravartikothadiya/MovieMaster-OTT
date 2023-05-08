import React, { useEffect, useState, useContext } from "react";
import "../App.css";
import axios from "axios";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  InputLabel,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  createTheme,
  ThemeProvider,
  colors,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../UserContext";
import { authO, provider, provider1 } from "../GoogleSignIn/congif";
import { signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import google from "../Images/google.svg";
import facebook from "../Images/facebook.svg";

function RegistrationForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errore, setErrore] = useState(false);
  const [passlen, setPasslen] = useState(0);
  const [passe, setPasse] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [currentUser, setCurrentUser] = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setRedirect(false);
      setErrore(false);
      setPasse(false);
      if (passlen < 6) setPasse(true);

      const response = await axios.post(
        "http://localhost:8000/RegistrationForm",
        { email, password }
      );
      if (response.data.message == "email already exists") setErrore(true);
      if (response.data.code == "auth/invalid-email") setErrore(true);
      if (
        response.data.message !== "email already exists" &&
        response.data.code !== "auth/invalid-email" &&
        response.data.message !==
          "password length should be greater than or equal to 6"
      )
        setRedirect(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (redirect) {
      navigate("/");
    }
  }, [redirect]);

  const theme = createTheme({ palette: { mode: "dark" } });
  const linkStyle = {
    margin: "1rem",
    link: {
      color: "#red",
      "&:hover": {
        color: "#red",
        textDecoration: "underline #000000",
      },
    },
  };

  const googleSignin = async () => {
    const result = await signInWithPopup(authO, provider);

    if (result.user.emailVerified) {
      localStorage.setItem(
        "session_auth",
        JSON.stringify(result.user.emailVerified)
      );
      localStorage.setItem("session_email", JSON.stringify(result.user.email));
      localStorage.setItem("session_userID", JSON.stringify(result.user.uid));
      const login = result.user.emailVerified;
      const emailID = result.user.email;
      const uid = result.user.uid;
      const obj = { login, emailID, uid };
      setCurrentUser(obj);
      navigate("/", { state: { user_session: obj } });
    }
  };

  const facebookSignin = async () => {
    const result = await signInWithPopup(authO, provider1);
  };

  return localStorage.getItem("session_auth") ? (
    (window.location.pathname = "/")
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
            Register
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <InputLabel sx={{ color: "white" }} htmlFor="email">
              Email
            </InputLabel>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              value={email}
              name="email"
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            {errore && errore
              ? "email already exists or it is an invalid email"
              : null}
            <InputLabel sx={{ color: "white" }} htmlFor="Password">
              Password
            </InputLabel>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              value={password}
              type="password"
              id="password"
              onChange={(e) => {
                setPassword(e.target.value);
                setPasslen(e.target.value.length);
              }}
            />
            {passe && passe ? "length should be greater than 6" : null}
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              color="error"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Grid container>
              <Grid item xs={6}></Grid>
              <Grid item>
                <Link href="/" variant="body2" style={linkStyle}>
                  Already have an account? SIgn In?
                </Link>
              </Grid>
              <Grid sx={{ paddingTop: 1, marginTop: 0.5 }}>
                <Grid item xs={12} textAlign={"center"}>
                  <Link onClick={googleSignin} variant="body2" className="Link">
                    <img src={google} alt="google" className="loginIcon" />
                    Google
                  </Link>
                </Grid>
                <Grid item xs={12} textAlign={"center"} sx={{ padding: 1 }}>
                  <Link
                    onClick={facebookSignin}
                    variant="body2"
                    className="Link"
                  >
                    <img src={facebook} alt="google" className="loginIcon" />
                    Facebook
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    // }}
  );
}

export default RegistrationForm;
