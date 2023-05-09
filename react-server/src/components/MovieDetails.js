import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../UserContext";
import "../static/css/HomeBanner.css";
import YouTube from "react-youtube";
import axios from "axios";
import io from "socket.io-client";
import "../static/css/MovieDetails.css";
import Chatroom from "./Chatroom";
import PlayIcon from "./Play";
import { BsChatDotsFill, BsChatDots } from "react-icons/bs";
import {
  AiFillLike,
  AiOutlineLike,
  AiOutlineDislike,
  AiFillDislike,
  AiOutlinePlus,
  AiOutlineClose,
} from "react-icons/ai";
import { FiCheck } from "react-icons/fi";

import { Link, useNavigate, useParams, Location } from "react-router-dom";

import RecommenderMovies from "./RecommenderMovies";
import { withTheme } from "@emotion/react";
import Footer from "./Footer/Footer";
const API_KEY = process.env.REACT_APP_TMDC_API_KEY;

const socket = io.connect("http://localhost:8000");

export default function Detail(props) {
  const [currentUser] = useContext(AuthContext);
  const params = useParams();
  const [closeChat, setCloseChat] = useState(true);
  const [isChatOn, setisChatOn] = useState(false);
  const login = currentUser?.login;
  const uid = currentUser?.uid;
  const emailID = currentUser?.emailID;
  let username = emailID?.split("@")[0];
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
          userId: usrId,
        }
      );
      setcurrentmovieName(true);
    } catch (e) {
      console.log(e);
    }
  };

  const handleremove = async () => {
    try {
      const remove = await axios.delete("http://localhost:8000/profilepage", {
        data: { movieId: props.id.toString(), userId: usrId },
      });
      setcurrentmovieName(false);
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
      const list = await axios.get("http://localhost:8000/profilepage", {
        params: {
          userId: usrId,
        },
      });
      setlistdataX(list.data);
      let isSaved = false;
      list.data?.map((e) => {
        if (e.name == props.title) {
          isSaved = true;
        }
      });
      setcurrentmovieName(isSaved);
    } catch (e) {
      console.log(e);
    }
  };

  // join room function
  const join_room = (e, MovieName) => {
    setCloseChat(false);
    e.preventDefault();
    setChatclosecounter(chatclosecounter + 1);
    if (chatclosecounter % 2 == 0) {
      setisChatOn(false);
      setChat(false);
    } else {
      setroomName(MovieName);
      socket.emit("join_room", MovieName);
      setisChatOn(true);
      setChat(true);
    }
  };

  useEffect(() => {
    selectMovie();
    fetchLikesDislikes();
    getDBTotalLikesDislikes();
    fetchRecommendedMovies();
    fetchlistdata();
  }, [props.id, isLiked, isDisliked, currentmovieName, params.id, props.title]);

  useEffect(() => {
    if (localStorage.getItem("session_auth") == null) {
      navigate("/login", { state: { session_expired: true } });
    }
  }, [chatclosecounter, playtrailer, isLiked, isDisliked, chatclosecounter]);

  const renderTrailer = () => {
    const opts = {
      playerVars: {
        autoplay: 1,
        cc_load_policy: 0,
        fs: 0,
        iv_load_policy: 0,
        modestbranding: 0,
        rel: 0,
        showInfo: 0,
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
          style={{ width: "100%", height: "750px", overflow: "hidden" }}
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
            <AiOutlineClose />
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
            <PlayIcon />
            <span>Play</span>
          </button>

          {currentmovieName == false ? (
            <>
              <label for="save-button" hidden>
                Save Button
              </label>
              <button id="save-button" className="movie-save-button">
                <AiOutlinePlus
                  style={{ color: "white" }}
                  onClick={handlesave}
                />
              </button>
            </>
          ) : (
            <>
              <label for="save-button" hidden>
                Save Button
              </label>
              <button className="movie-save-button" id="save-button">
                <FiCheck style={{ color: "white" }} onClick={handleremove} />
              </button>
            </>
          )}

          <label for="like-button" hidden>
            Like Button
          </label>
          <button
            className={isLiked ? "movie-like-button-on" : "movie-like-button"}
            onClick={handlelike}
            id="like-button"
          >
            {isLiked ? (
              <AiFillLike style={{ fill: "white" }} />
            ) : (
              <AiOutlineLike style={{ fill: "white" }} />
            )}
          </button>

          <label for="dislike-button" hidden>
            DisLike Button
          </label>
          <button
            className={
              isDisliked ? "movie-dislike-button-on" : "movie-dislike-button"
            }
            onClick={handledislike}
            id="dislike-button"
          >
            {isDisliked ? (
              <AiFillDislike style={{ fill: "white" }} />
            ) : (
              <AiOutlineDislike style={{ fill: "white" }} />
            )}
          </button>

          <label for="chat-button" hidden>
            DisLike Button
          </label>
          <button
            className={
              isChatOn ? "movie-dislike-button-on" : "movie-dislike-button"
            }
            onClick={(e) => join_room(e, props.title)}
            id="chat-button"
          >
            {isChatOn ? (
              <BsChatDotsFill style={{ fill: "white" }} />
            ) : (
              <BsChatDots style={{ fill: "white" }} />
            )}
          </button>
          <div className="movie-thumbnail-bottom-fade"></div>
        </div>
      )}
      <div className="movie-details">
        <div className="left-container">
          <div className="movie-description">{props.description}</div>
          <div className="movie-rating">
            Popularity: <span className="rating-value">{props.rating}</span>
          </div>
          <div className="movie-rating">
            Likes: <span className="rating-value">{likes}</span>
          </div>
          <div className="movie-rating">
            Dislikes: <span className="rating-value">{dislikes}</span>
          </div>
          <div className="movie-rating">
            Duration: <span className="rating-value">{props.runtime}</span>
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
      {chat && !closeChat && (
        <Chatroom
          socket={socket}
          username={username}
          room={roomName}
          toggle={true}
          setCloseChat={setCloseChat}
          setChatclosecounter={setChatclosecounter}
          chatclosecounter={chatclosecounter}
          setisChatOn={setisChatOn}
        />
      )}
    </div>
  );
}
