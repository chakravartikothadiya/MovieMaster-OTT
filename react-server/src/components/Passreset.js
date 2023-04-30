import React, { Component, useEffect, useState } from "react";
import "../App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Box,
  Typography,
  Container,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Passreset = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [nouser, setNouser] = useState(false);
  const [invalide, setInvalide] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setNouser(false);
    setInvalide(false);
    try {
      if (email !== "") {
        const response = await axios.post(
          "http://localhost:8000/ResetPassword",
          {
            email,
          }
        );
        if (response.data.code == "auth/invalid-email") setInvalide(true);
        if (response.data.code == "auth/user-not-found") setNouser(true);
        if (!response.data.code) setRedirect(true);
        // console.log(response.data.code);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (redirect) {
      navigate("/login", { state: { msg: "Password reset link sent" } });
    }
  }, [redirect]);

  const theme = createTheme({ palette: { mode: "dark" } });

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
          <Typography component="h1" variant="h5" className="Label">
            Reset Password
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
            {invalide && invalide ? "emailID is invalid" : null}
            {nouser && nouser ? "no user found by this emailID" : null}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              color="error"
            >
              Send Link
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Passreset;
