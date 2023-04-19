import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [user_session, setUsersession] = useState("");
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [auth, setAuth] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log(event);
    try {
      setInvalidEmail(false);
      setAuth(false);
      // response will have a session containing emailID and "login" key with a boolean value.
      const response = await axios.post("http://localhost:8080/LoginForm", {
        email,
        password,
      });
      if (!response.data.code) {
        console.log(response);
        setUsersession(response.data);
        console.log(response.data);
        setRedirect(true);
      } else {
        if (response.data.code == "auth/invalid-email") setInvalidEmail(true);
        if (
          response.data.code == "auth/wrong-password" ||
          response.data.code == "auth/user-not-found"
        )
          setAuth(true);
        console.log(response.data.code);
      }

      // setUsersession(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (redirect) {
      navigate("/home", { state: { user_session: user_session } });
    }
  }, [redirect]);

  const theme = createTheme();

  return (
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
          <Typography component="h1" variant="h5">
            Login
          </Typography>
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
            >
              Login
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  Do not have an account? Sign Up?
                </Link>
              </Grid>
            </Grid>
          </Box>
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