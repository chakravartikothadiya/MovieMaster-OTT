import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import Chatroom from "./Chatroom";

const socket = io.connect("http://localhost:8080");

const Home = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  let session = location.state && location.state.user_session;
  const [chat, setChat] = useState(false);
  const [roomName, setroomName] = useState("");

  const handleClick = async () => {
    try {
      const response = await axios.post("http://localhost:8080/Logout");
      console.log(response);
      localStorage.setItem("session_auth", false);
    } catch (error) {
      console.error(error);
    }
  };

  //join room
  const join_room = (e, MovieName) => {
    e.preventDefault();
    console.log("inside Onclick");
    session = session;
    setroomName(MovieName);
    socket.emit("join_room", MovieName);
    setChat(true);
  };

  return (
    <div>
      {/* {a && <h1>Welcome, {a}!</h1>} */}
      Welcome!
      {/* <button onClick={handleClick}>Logout</button> */}
      <br />
      <br />
      <Link onClick={(e) => join_room(e, "MovieName 1")}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              MovieName 1
            </Typography>
            <Typography variant="body2" component="p">
              This is the description of the movie.
            </Typography>
          </CardContent>
        </Card>
      </Link>
      <Link onClick={(e) => join_room(e, "MovieName 2")}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              MovieName 2
            </Typography>
            <Typography variant="body2" component="p">
              This is the description of the movie.
            </Typography>
          </CardContent>
        </Card>
      </Link>
      <Link onClick={(e) => join_room(e, "MovieName 3")}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              MovieName 3
            </Typography>
            <Typography variant="body2" component="p">
              This is the description of the movie.
            </Typography>
          </CardContent>
        </Card>
      </Link>
      <h1>Welcome</h1>
      {session && session.emailID ? session.emailID : null}
      <button
        onClick={() => {
          handleClick();
          navigate("/");
        }}
      >
        Logout
      </button>
      {chat && (
        <Chatroom
          socket={socket}
          username={session.emailID.split("@")[0]}
          room={roomName}
          toggle={true}
        />
      )}
    </div>
  );
};
export default Home;
