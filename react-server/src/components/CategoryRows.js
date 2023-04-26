import React, { useEffect, useState } from 'react'
import '../static/css/CategoryRows.css';
import axios from 'axios';

function CategoryRows({title, fetchUrl, isOriginalRow = false}) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
      async function fetchData() {
          const request = await axios.get(fetchUrl);
          setMovies(request.data.results);
          return request;
      }
      fetchData();
  }, [fetchUrl]);

  return (
    <div className='categoryRows'>
      <h2>{title}</h2>
      <div className='categoryRowsthumbnails'>
        {movies.map(movie => (
          <img
          className={`categoryRowsthumbnail ${isOriginalRow && 'OriginalThumbnail'}`}
          key = {movie.id}
          src={`https://image.tmdb.org/t/p/original/${movie?.poster_path}`} 
          alt={movie?.title || movie?.name || movie?.original_name} />
        ))}
      </div>
    </div>
  );
}

export default CategoryRows