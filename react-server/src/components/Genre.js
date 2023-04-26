import React, { useEffect, useState, useCallback } from 'react'
import Navbar from './Navbar';
import axios from 'axios';
import HomeBanner from './HomeBanner';
import { useParams } from 'react-router-dom';
import GenreMovies from './GenreMovies';
const API_KEY = process.env.REACT_APP_TMDC_API_KEY

function Genre() {
  const { id } = useParams();
  const [genreData, setGenreData] = useState()

  const fetchData = useCallback(
      async() => {
        try {
          const request = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${id}`)
          setGenreData(request.data.results)
          return request;
        } catch (e) {
          console.log(e)
        }
      },
      [id]
    ) 

  useEffect(()=>{
    fetchData();
  }, [id])

  return (
    <div>
        <HomeBanner fetchURL = {`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${id}`} />
        <GenreMovies movies={genreData} />
    </div>
  )
}

export default Genre;