import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import Chatroom from "./Chatroom";
import Navbar from "./Navbar";
import HomeBanner from "./HomeBanner";
import CategoryRows from "./CategoryRows";
import Genre from "./Genre";
import Footer from "./Footer/Footer";
import Login from "./Login";
import Expire from "./Expire";
const API_KEY = process.env.REACT_APP_TMDC_API_KEY;

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  let session = location.state && location.state.user_session;
  console.log(session);
  let userId = session && session.uid;
  let email = session && session.emailID;
  let username = email && email.split("@").shift();
  console.log("Inside HOME", username);
  userId = userId && userId.toString();

  useEffect(() => {
    if (session === null || localStorage.getItem("session_auth") == null) {
      localStorage.clear();
      navigate("/login", { state: { expired: true } });
    }
  }, [session, localStorage.getItem("session_auth")]);

  return (
    <div>
      <div>
        <br />
        <br />
        <div className="home">
          <HomeBanner
            fetchURL={`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_networks=213`}
          />
          <CategoryRows
            userId={userId}
            username={username}
            title="MovieMaster Originals"
            fetchUrl={`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_networks=213`}
            isOriginalRow
          />
          <CategoryRows
            userId={userId}
            username={username}
            title="Trending Now"
            fetchUrl={`https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US`}
            isOriginalRow
          />
          <CategoryRows
            userId={userId}
            username={username}
            title="Top Rated"
            fetchUrl={`https://api.themoviedb.org/3//movie/top_rated?api_key=${API_KEY}&language=en-US`}
            isOriginalRow
          />
          <CategoryRows
            userId={userId}
            username={username}
            title="Action Movies"
            fetchUrl={`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28`}
            isOriginalRow={false}
          />
          <CategoryRows
            userId={userId}
            username={username}
            title="Comedy Movies"
            fetchUrl={`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=35`}
            isOriginalRow={true}
          />
          <CategoryRows
            userId={userId}
            username={username}
            title="Horror Movies"
            fetchUrl={`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=27`}
            isOriginalRow={false}
          />
          <CategoryRows
            userId={userId}
            username={username}
            title="Romance Movies"
            fetchUrl={`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=10749`}
            isOriginalRow={false}
          />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Home;
