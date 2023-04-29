import React from "react";
import axios from "axios";
import Detail from "./MovieDetails";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Comments from "./Comments/Comments";
import Footer from "./Footer/Footer";

const API_KEY = process.env.REACT_APP_TMDC_API_KEY;

export default function LoadMovie() {
  const { id } = useParams();
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`;
  const [movie, setMovie] = useState(null);

  const fetc_data = async () => {
    const data = await axios.get(url);
    setMovie(data.data);
    console.log(movie);
  };

  useEffect(() => {
    fetc_data();
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
        />
      )}
      <Comments currentUserId="6397bd1144507f75ce38a1a5" />
      {/* <Footer /> */}
    </div>
  );
}
