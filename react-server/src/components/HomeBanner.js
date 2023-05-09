import React, { useEffect, useState } from "react";
import "../static/css/HomeBanner.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import YouTube from "react-youtube";
import PlayIcon from "./Play";
import InfoIcon from "./Info";
import { AiOutlineClose } from "react-icons/ai";

const API_KEY = process.env.REACT_APP_TMDC_API_KEY;

function HomeBanner({ fetchURL }) {
  const navigate = useNavigate();
  const [movie, setMovie] = useState([]);
  const API_URL = "https://api.themoviedb.org/3";
  const [trailer, setTrailer] = useState(null);
  const [playtrailer, setplaytrailer] = useState(false);

  const truncate = (string, n) => {
    return string?.length > n ? string.substr(0, n - 1) + "..." : string;
  };

  useEffect(() => {
    fetchData();
  }, [fetchURL]);

  useEffect(() => {
    selectMovie();
  }, [movie]);

  async function fetchData() {
    const request = await axios.get(fetchURL);
    setMovie(
      request?.data?.results[
        Math.floor(Math.random() * request.data.results.length - 1)
      ]
    );
    return request;
  }

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
    try {
      const data = await fetchMovieVideo(movie?.id);
      let trl = data?.videos?.results?.find((vid) =>
        vid.name.includes("Trailer")
      );
      if (!trl) {
        trl = data?.videos?.results[0];
      }
      setTrailer(trl);
    } catch (e) {
      console.error(e);
      setTrailer({});
    }
  };

  const renderTrailer = () => {
    const opts = {
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
        showinfo: 0,
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
          style={{
            width: "100%",
            height: "750px",
            overflow: "hidden",
            marginTop: "50px",
          }}
        />
      );
    }
    return (
      <h1 style={{ color: "white", marginTop: "300px" }}>No Video Available</h1>
    );
  };

  return (
    <>
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
      ) : (
        <header
          className="mainBanner"
          style={{
            backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
            backgroundPosition: "center center",
            backgroundSize: "cover",
          }}
        >
          <div className="bannerContent">
            <h1 className="title">
              {movie?.title || movie?.name || movie?.original_name}
            </h1>
            <>
              <button
                className="bannerButton"
                onClick={() => {
                  setplaytrailer(true);
                }}
              >
                <PlayIcon />
                <span> Play</span>
              </button>
              <button
                className="bannerButton2"
                onClick={() => {
                  navigate("/profile");
                }}
              >
                <InfoIcon />
                {"  "} My List
              </button>
            </>
            <h1 className="description">{truncate(movie?.overview, 200)}</h1>
          </div>

          <div className="fadedBottom" />
        </header>
      )}
    </>
  );
}

export default HomeBanner;
