import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../UserContext";
import YouTube from "react-youtube";
import axios from "axios";
import io from "socket.io-client";
import "../static/css/MovieDetails.css";
import Chatroom from "./Chatroom";
import { Link, useNavigate } from "react-router-dom";
import RecommenderMovies from "./RecommenderMovies";
const API_KEY = process.env.REACT_APP_TMDC_API_KEY;

const socket = io.connect("http://localhost:8000");

export default function Detail(props) {
  const [currentUser] = useContext(AuthContext);
  const login = currentUser && currentUser.login;
  const uid = currentUser && currentUser.uid;
  const emailID = currentUser && currentUser.emailID;
  let username = emailID?.split("@")[0]?.split('"')[1]?.toString();
  let mvId = props.id?.toString();
  let usrId = uid?.toString();
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

  const handlesave = async () => {
    const mylistresponse = await axios.post(
      `http://localhost:8000/profilepage`,
      {
        movieId: mvId,
        moviePoster: props.poster,
        movieName: props.title,
        userId: usrId,
      }
    );
  };
  console.log("props", props);
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
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos",
      },
    });

    return data;
  };

  const selectMovie = async () => {
    const data = await fetchMovieVideo(props.id);
    // setselectedData(data.videos.results);
    const trl = data.videos.results.find(
      (vid) => vid.name === "Official Trailer"
    );
    setTrailer(trl);
  };

  const fetchRecommendedMovies = async () => {
    const response = await axios.get(
      `http://localhost:8000/recommend/movies/${props.title}/5`
    );
    if (!response.data) setRecommenderData([]);
    setRecommenderData(response.data);
  };

  const fetchLikesDislikes = async () => {
    const response = await axios.get("http://localhost:8000/likes/", {
      params: {
        movieId: mvId,
        userId: usrId,
      },
    });
    console.log(response.data);
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
  };

  const setDBLikesDislike = async (movieId, userId, value) => {
    console.log("Inside HEr");
    console.log(movieId);
    console.log(userId);
    console.log(value);
    const response = await axios.post("http://localhost:8000/likes/", {
      movieId,
      userId,
      value,
    });
  };

  const getDBTotalLikesDislikes = async () => {
    const response = await axios.get("http://localhost:8000/likes/totallikes", {
      params: {
        movieId: mvId,
      },
    });
    let result = response.data;
    console.log(result);
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
      console.log("inside Onclick");
      // session = session;
      setroomName(MovieName);
      socket.emit("join_room", MovieName);
      setChat(true);
    }
  };

  useEffect(
    () => {
      selectMovie();
      fetchLikesDislikes();
      getDBTotalLikesDislikes();
      fetchRecommendedMovies();
    },
    [props.id],
    isLiked,
    isDisliked
  );

  useEffect(() => {
    if (localStorage.getItem("session_auth") == null) {
      console.log("in here");
      navigate("/login", { state: { session_expired: true } });
    }
  }, [chatclosecounter, playtrailer, isLiked, isDisliked, chat]);

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
    return null;
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
            className="movie-play-button"
            onClick={() => {
              setplaytrailer(true);
            }}
          >
            Play
          </button>
          <button className="movie-save-button" onClick={handlesave}>
            Save
          </button>
          <button
            className={isLiked ? "movie-like-button-on" : "movie-like-button"}
            onClick={handlelike}
          >
            Like {likes}
          </button>
          <button
            className={
              isDisliked ? "movie-dislike-button-on" : "movie-dislike-button"
            }
            onClick={handledislike}
          >
            Dislike {dislikes}
          </button>
          <button
            className={
              isDisliked ? "movie-dislike-button-on" : "movie-dislike-button"
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
