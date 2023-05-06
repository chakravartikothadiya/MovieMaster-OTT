import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../UserContext";
import "../static/css/HomeBanner.css";
import YouTube from "react-youtube";
import axios from "axios";
import io from "socket.io-client";
import "../static/css/MovieDetails.css";
import Chatroom from "./Chatroom";

import { Link, useNavigate, useParams, Location } from "react-router-dom";

import RecommenderMovies from "./RecommenderMovies";
import { withTheme } from "@emotion/react";
const API_KEY = process.env.REACT_APP_TMDC_API_KEY;

const socket = io.connect("http://localhost:8000");

export default function Detail(props) {
  const params = useParams();
  console.log(params, "pararms");
  const [currentUser] = useContext(AuthContext);
  const login = currentUser && currentUser.login;
  const uid = currentUser && currentUser.uid;
  const emailID = currentUser && currentUser.emailID;
  let username = emailID?.split("@")[0]?.split('"')[1]?.toString();
  let mvId = props.id?.toString();
  let usrId = uid?.toString();
  setTimeout(() => {
    if (username == undefined || localStorage.getItem("session_auth") == null) {
      window.location.reload();
    }
  }, 0);
  const navigate = useNavigate();

  const API_URL = "https://api.themoviedb.org/3";
  const [chat, setChat] = useState(false);
  const [roomName, setroomName] = useState("");
  const [chatclosecounter, setChatclosecounter] = useState(1);

  const [recommenderData, setRecommenderData] = useState([]);

  const [trailer, setTrailer] = useState(null);

  const [playtrailer, setplaytrailer] = useState(false);

  const [likes, setLikes] = useState(100);
  const [dislikes, setDislikes] = useState(20);

  const [isLiked, setisLiked] = useState(false);
  const [isDisliked, setisDisliked] = useState(false);

  const [listdataX, setlistdataX] = useState(null);
  const [currentmovieName, setcurrentmovieName] = useState(false);

  const handlesave = async () => {
    try {
      const mylistresponse = await axios.post(
        `http://localhost:8000/profilepage`,
        {
          movieId: mvId,
          moviePoster: props.poster,
          movieName: props.title,
          userId: usrId.split('"')[1],
        }
      );
      setcurrentmovieName(
        mylistresponse?.data[0]?.mylist?.map((e) => {
          if (e.name == props.title) {
            return true;
          }
        })
      );
    } catch (e) {
      console.log(e);
    }
  };

  const handleremove = async () => {
    try {
      const remove = await axios.delete("http://localhost:8000/profilepage", {
        data: { movieId: props.id.toString(), userId: usrId.split('"')[1] },
      });
      if (remove?.data?.myList?.length != 0) {
        setcurrentmovieName(
          remove?.data?.myList?.map((e) => {
            if (e.name == props.title) {
              return false;
            }
          })
        );
      } else {
        setcurrentmovieName(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handlelike = async () => {
    if (isLiked) {
      setisLiked(false);
      setLikes(likes - 1);
      setDBLikesDislike(mvId, usrId, null);
    } else {
      if (isDisliked) {
        setisDisliked(false);
        setDislikes(dislikes - 1);
      }
      setisLiked(true);
      setLikes(likes + 1);
      setDBLikesDislike(mvId, usrId, "like");
    }
  };

  const handledislike = async () => {
    if (isDisliked) {
      setisDisliked(false);
      setDislikes(dislikes - 1);
      setDBLikesDislike(mvId, usrId, null);
    } else {
      if (isLiked) {
        setisLiked(false);
        setLikes(likes - 1);
      }
      setisDisliked(true);
      setDislikes(dislikes + 1);
      setDBLikesDislike(mvId, usrId, "dislike");
    }
  };

  const fetchMovieVideo = async (id) => {
    try {
      const { data } = await axios.get(`${API_URL}/movie/${id}`, {
        params: {
          api_key: API_KEY,
          append_to_response: "videos",
        },
      });

      return data;
    } catch (e) {
      console.log(e);
    }
  };

  const selectMovie = async () => {
    try {
      const data = await fetchMovieVideo(props.id);
      let trl = data.videos.results.find((vid) => vid.name.includes("Trailer"));
      if (!trl) {
        trl = data?.videos?.results[0];
      }
      setTrailer(trl);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchRecommendedMovies = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/recommend/movies/${props.title}/5`
      );
      if (!response.data) setRecommenderData([]);
      setRecommenderData(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchLikesDislikes = async () => {
    try {
      const response = await axios.get("http://localhost:8000/likes/", {
        params: {
          movieId: mvId,
          userId: usrId,
        },
      });
      let status = response.data;
      if (status === "like") {
        setisLiked(true);
        setisDisliked(false);
      } else if (status === "dislike") {
        setisDisliked(true);
        setisLiked(false);
      } else {
        setisLiked(false);
        setisDisliked(false);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const setDBLikesDislike = async (movieId, userId, value) => {
    try {
      const response = await axios.post("http://localhost:8000/likes/", {
        movieId,
        userId,
        value,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getDBTotalLikesDislikes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/likes/totallikes",
        {
          params: {
            movieId: mvId,
          },
        }
      );
      let result = response.data;
      setLikes(result.likes);
      setDislikes(result.dislikes);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchlistdata = async () => {
    try {
      console.log("in list data");
      const list = await axios.get("http://localhost:8000/profilepage", {
        params: {
          userId: usrId.toString().split('"')[1],
        },
      });
      console.log("after axios", list);
      setlistdataX(list.data);
      console.log("in list", listdataX);
    } catch (e) {
      console.log(e);
    }
  };

  const checksave = () => {
    listdataX?.map((e) => {
      if (e.name == props.title) {
        setcurrentmovieName(true);
      }
    });

    let result = response.data;

    setLikes(result.likes);
    setDislikes(result.dislikes);
  };

  // join room function
  const join_room = (e, MovieName) => {
    e.preventDefault();
    setChatclosecounter(chatclosecounter + 1);
    if (chatclosecounter % 2 == 0) {
      setChat(false);
    } else {
      setroomName(MovieName);
      socket.emit("join_room", MovieName);
      setChat(true);
    }
  };

  useEffect(() => {
    checksave();
  }, [listdataX]);

  useEffect(() => {
    selectMovie();
    fetchLikesDislikes();
    getDBTotalLikesDislikes();
    fetchRecommendedMovies();
    fetchlistdata();
  }, [props.id, isLiked, isDisliked, currentmovieName, params.id]);

  useEffect(() => {
    if (localStorage.getItem("session_auth") == null) {
      navigate("/login", { state: { session_expired: true } });
    }
  }, [chatclosecounter, playtrailer, isLiked, isDisliked, chatclosecounter]);

  const renderTrailer = () => {
    const opts = {
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
      },
      origin: "http://localhost:3000", // set the origin to the URL of your app
      width: "100%",
      height: "100%",
      position: "absolute",
      top: 0,
      left: 0,
    };

    if (trailer) {
      return (
        <YouTube
          videoId={trailer.key}
          containerClassName={"youtube-container amru"}
          opts={opts}
          style={{ width: "100%", height: "750px" }}
        />
      );
    }
    return (
      <h1 style={{ color: "white", marginTop: "300px" }}>No Video Available</h1>
    );
  };

  return (
    <div className="detail-container">
      {playtrailer ? (
        <div className="detail-container" style={{ position: "relative" }}>
          {renderTrailer()}
          <button
            className="player-close-button"
            onClick={() => {
              setplaytrailer(false);
            }}
          >
            Close
          </button>
        </div>
      ) : null}
      {!playtrailer && (
        <div className="movie-thumbnail">
          {/* https://image.tmdb.org/t/p/w500/kqjL17yufvn9OVLyXYpvtyrFfak.jpg */}
          <img src={props.poster} alt={props.title} />
          <h1 className="movie-title">{props.title}</h1>
          <button
            className="movie-play-button bannerButton"
            onClick={() => {
              setplaytrailer(true);
            }}
          >
            Play
          </button>

          {currentmovieName == false ? (
            <button
              className="movie-save-button bannerButton"
              onClick={handlesave}
            >
              Save
            </button>
          ) : (
            <button
              className="movie-save-button bannerButton"
              onClick={handleremove}
            >
              UnSave
            </button>
          )}

          <button
            className={
              isLiked
                ? "movie-like-button-on bannerButton"
                : "movie-like-button bannerButton"
            }
            onClick={handlelike}
          >
            Like {likes}
          </button>
          <button
            className={
              isDisliked
                ? "movie-dislike-button-on bannerButton"
                : "movie-dislike-button bannerButton"
            }
            onClick={handledislike}
          >
            Dislike {dislikes}
          </button>
          <button
            className={
              isDisliked
                ? "movie-dislike-button-on bannerButton"
                : "movie-dislike-button bannerButton"
            }
            onClick={(e) => join_room(e, props.title)}
          >
            CHAT
          </button>
          <div className="movie-thumbnail-bottom-fade"></div>
        </div>
      )}
      <div className="movie-details">
        <div className="left-container">
          <div className="movie-description">{props.description}</div>
          <div className="movie-rating">
            Rating: <span className="rating-value">{props.rating}</span>
          </div>
        </div>
        <div className="right-container">
          <div className="movie-genre">Genre: {props.genre}</div>
          <div className="movie-cast">Cast: {props.cast}</div>
          <div className="movie-director">Director: {props.director}</div>
          <div className="movie-season">Release Date: {props.release}</div>
        </div>
      </div>
      <div>
        {recommenderData.length != 0 ? (
          <RecommenderMovies movies={recommenderData} />
        ) : null}
      </div>
      {chat && (
        <Chatroom
          socket={socket}
          username={username}
          room={roomName}
          toggle={true}
        />
      )}
    </div>
  );
}
