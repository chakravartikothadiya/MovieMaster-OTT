import React, { useEffect, useState } from "react";
import { Button, Box } from "@mui/material";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";

const Home = (props) => {
  const navigate = useNavigate();
  const session = useLocation().state.user_session;

  const handleClick = async () => {
    try {
      const response = await axios.post("http://localhost:8080/Logout");
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };
  // useEffect(() => {
  //   if (a) {
  //     setUsername(a);
  //   }
  // }, [a]);

  // if (!username) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div>
      {/* {a && <h1>Welcome, {a}!</h1>} */}
      Welcome!
      {/* <button onClick={handleClick}>Logout</button> */}
      <h1>Welcome</h1>
      {session.emailID}
      <button
        onClick={() => {
          handleClick();
          navigate("/");
        }}
      >
        Logout
      </button>
    </div>
  );
};
export default Home;
