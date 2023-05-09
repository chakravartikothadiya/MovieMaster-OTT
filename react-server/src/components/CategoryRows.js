import React, { useEffect, useState } from "react";
import "../static/css/CategoryRows.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function CategoryRows({ title, fetchUrl }) {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await axios.get(fetchUrl);
        setMovies(request.data.results);
        return request;
      } catch (e) {
        console.error(e);
        setMovies([]);
      }
    }
    fetchData();
  }, [fetchUrl]);

  return (
    <div className="categoryRows">
      <h2>{title}</h2>
      <div className="categoryRowsthumbnails">
        {movies.map((movie) => {
          if (!movie.poster_path && !movie.backdrop_path) {
            return null; // Skip rendering the movie if both poster_path and backdrop_path are null
          }
          return (
            <div
              className="OriginalThumbnail"
              onClick={() => navigate(`/movie/${movie.id}/`)}
              key={movie.id}
            >
              <img
                width={135}
                height={200}
                src={`https://image.tmdb.org/t/p/original/${
                  movie?.poster_path || movie?.backdrop_path
                }`}
                alt={movie?.title || movie?.name || movie?.original_name}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryRows;
