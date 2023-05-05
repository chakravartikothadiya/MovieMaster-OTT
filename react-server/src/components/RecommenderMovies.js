import React from 'react'
import "../static/css/CategoryRows.css";
import { useNavigate } from "react-router-dom";
function RecommenderMovies({movies}) {
  const navigate = useNavigate();
  return (
    <>
      <div className='categoryRows'>
        <h2>Recommended Movies</h2>
      </div>
      <div className='categoryRowsthumbnails'>
        {movies?.map(movie => (
          <div
            className='OriginalThumbnail thumbnaildiv'
            onClick={() => navigate(`/movie/${movie.id}/`)}
          >
            <img
            className={`thumbnail`}
            key = {movie.id}
            src={`https://image.tmdb.org/t/p/original/${movie?.image}`} 
            alt={movie?.title || movie?.name || movie?.original_name} />
            <p className='titleBackdrop'>{movie.title}</p>
          </div>
        ))}
        {movies ? null : <p>No Recommendation</p>}
      </div>
    </>
  )
}

export default RecommenderMovies