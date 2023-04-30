import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";
import axios from "axios";
import "../static/css/MovieDetails.css";
const API_KEY = process.env.REACT_APP_TMDC_API_KEY;

export default function Detail(props) {
  let mvId = props.id.toString();
  let userId;
  const API_URL = "https://api.themoviedb.org/3";

  // const [selectedData, setselectedData] = useState(null);
  const [trailer, setTrailer] = useState(null);

  const [playtrailer, setplaytrailer] = useState(false);

  const [likes, setLikes] = useState(100);
  const [dislikes, setDislikes] = useState(20);

  const [isLiked, setisLiked] = useState(false);
  const [isDisliked, setisDisliked] = useState(false);

  const handlelike = async () => {
    if (isLiked) {
      setisLiked(false);
      setLikes(likes - 1);
      setDBLikesDislike(mvId, "6397bd1144507f75ce38a1a5", null);
    } else {
      if (isDisliked) {
        setisDisliked(false);
        setDislikes(dislikes - 1);
      }
      setisLiked(true);
      setLikes(likes + 1);
      setDBLikesDislike(mvId, "6397bd1144507f75ce38a1a5", "like");
    }
  };

  const handledislike = async () => {
    if (isDisliked) {
      setisDisliked(false);
      setDislikes(dislikes - 1);
      setDBLikesDislike(mvId, "6397bd1144507f75ce38a1a5", null);
    } else {
      if (isLiked) {
        setisLiked(false);
        setLikes(likes - 1);
      }
      setisDisliked(true);
      setDislikes(dislikes + 1);
      setDBLikesDislike(mvId, "6397bd1144507f75ce38a1a5", "dislike");
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

  const fetchLikesDislikes = async () => {
    userId = "6397bd1144507f75ce38a1a5";
    const response = await axios.get("http://localhost:8000/likes/", {
      params: {
        movieId: mvId,
        userId: userId,
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

  useEffect(
    () => {
      selectMovie();
      fetchLikesDislikes();
      getDBTotalLikesDislikes();
    },
    [props.id],
    isLiked,
    isDisliked
  );

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
          <button className="movie-save-button">Save</button>
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
    </div>
  );
}
