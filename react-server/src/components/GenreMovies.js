import React from "react";
import "../static/css/GenreMovies.css";
import { Link, useNavigate } from "react-router-dom";

function GenreMovies({ movies }) {
  console.log("props", movies, typeof movies);
  const navigate = useNavigate();
  return (
    <div className="cardLayout">
      {movies?.map((movie) => {
        if (!movie.backdrop_path) {
          return null; // Skip rendering the movie if backdrop_path is null
        }
        return (
          <div onClick={() => navigate(`/movie/${movie.id}/`)}>
            <img
              className={`thumbnail`}
              key={movie.id}
              src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
              alt={movie?.title || movie?.name || movie?.original_name}
            />
          </div>
        );
      })}
    </div>
  );
}

export default GenreMovies;
