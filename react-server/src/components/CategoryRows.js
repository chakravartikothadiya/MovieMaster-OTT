import React, { useEffect, useState } from "react";
import "../static/css/CategoryRows.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function CategoryRows({
  userId,
  username,
  title,
  fetchUrl,
  isOriginalRow = true,
}) {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  return (
    <div className="categoryRows">
      <h2>{title}</h2>
      <div className="categoryRowsthumbnails">
        {movies.map((movie) => (
          <div
            className={`${isOriginalRow && "OriginalThumbnail"}`}
            onClick={() =>
              navigate(`/movie/${movie.id}/`, {
                state: { userId: userId, username: username },
              })
            }
          >
            <img
              width={135}
              height={200}
              key={movie.id}
              src={`https://image.tmdb.org/t/p/original/${movie?.poster_path}`}
              alt={movie?.title || movie?.name || movie?.original_name}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryRows;
