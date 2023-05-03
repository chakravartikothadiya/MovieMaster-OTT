import React, { useContext } from "react";
import axios from "axios";
import Detail from "./MovieDetails";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Comments from "./Comments/Comments";
import { AuthContext } from "../UserContext";

const API_KEY = process.env.REACT_APP_TMDC_API_KEY;

export default function LoadMovie() {
  const [currentUser] = useContext(AuthContext);
  const uid = currentUser && currentUser.uid;
  const emailID = currentUser && currentUser.emailID;
  let usrId = uid?.toString();
  let username = emailID?.split("@")[0]?.split('"')[1]?.toString();
  const { id } = useParams();
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`;
  const [movie, setMovie] = useState(null);

  const fetc_data = async () => {
    const data = await axios.get(url);
    setMovie(data.data);
  };

  useEffect(() => {
    fetc_data();
    console.log("moviessssssss:", movie);
  }, []);

  return (
    <div className="Load-Movie">
      {movie && (
        <Detail
          id={movie.id}
          title={movie.title}
          rating={movie.popularity}
          genre="Thriller"
          cast="Chakravarti Kothadiya"
          Director="Chuks"
          poster={"https://image.tmdb.org/t/p/original" + movie.backdrop_path}
          release={movie.release_date}
          description={movie.overview}
          userId={usrId}
          username={username}
        />
      )}
      {movie && (
        <Comments
          currentUserId={usrId}
          username={username}
          movieId={movie.id}
        />
      )}
      {/* <Footer /> */}
    </div>
  );
}
