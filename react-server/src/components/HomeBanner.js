import React, { useEffect, useState } from 'react'
import '../static/css/HomeBanner.css'
import axios from 'axios';
const API_KEY = process.env.REACT_APP_TMDC_API_KEY

function HomeBanner({fetchURL}) {

    const [movie, setMovie] = useState([]);

    const truncate = (string, n) => {
        return string?.length > n ? string.substr(0, n - 1) + '...' : string;
      }

    useEffect(() => {
        async function fetchData() {
          const request = await axios.get(fetchURL);
          setMovie(
            request.data.results[
              Math.floor(Math.random() * request.data.results.length - 1)
            ]
          );
          return request;
        }
        fetchData();
      }, [fetchURL]);

    return (
        <header className='mainBanner' style={{
            backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
            backgroundPosition: "center center",
            backgroundSize: "cover"
        }}>
            <div className='bannerContent'>
                <h1 className='title'>{movie?.title || movie?.name || movie?.original_name}</h1>
                <>
                    <button className='bannerButton'>Play</button>
                    <button className='bannerButton'>My List</button>
                </>
                <h1 className="description">
                    {truncate(movie?.overview, 200)}
                </h1>
            </div>

            <div className='fadedBottom' />
        </header>
        );
}

export default HomeBanner