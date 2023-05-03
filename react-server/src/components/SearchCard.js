import React from 'react'
import { Link, useNavigate } from "react-router-dom";

export default function SearchCard({movie, userId, username}) {
    const navigate = useNavigate();
    console.log("Inside SearchCard");
    console.log(userId);
    console.log(username);
  return (
    <div>
        <img
          width={135}
          height={200}
          src={`https://image.tmdb.org/t/p/original/${movie?.poster_path}`}
          alt={movie?.title || movie?.name || movie?.original_name}
          onClick={() =>
            navigate(`/movie/${movie.id}/`, {
              state: { userId: userId, username: username },
            })
          }
        />
      </div>
    )
}
