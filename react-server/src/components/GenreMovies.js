import React from 'react'
import '../static/css/GenreMovies.css'

function GenreMovies({movies}) {
    console.log(movies)
    return (
        <div className='cardLayout'>
        {movies?.map(movie => (
          <img
          className={`thumbnail`}
          key = {movie.id}
          src={`https://image.tmdb.org/t/p/original/${movie?.backdrop_path}`} 
          alt={movie?.title || movie?.name || movie?.original_name} />
        ))}
      </div>
    )
}

export default GenreMovies