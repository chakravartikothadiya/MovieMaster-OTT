import React from 'react'
import Navbar from './Navbar';
import HomeBanner from './HomeBanner';
import CategoryRows from './CategoryRows'
import Genre from './Genre';
const API_KEY = process.env.REACT_APP_TMDC_API_KEY

function Home() {
    return (
        <div className='home'>
          <HomeBanner fetchURL = {`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_networks=213`} />
          <CategoryRows title="MovieMaster Originals" fetchUrl = {`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_networks=213`} isOriginalRow />
          <CategoryRows title="Trending Now" fetchUrl = {`https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US`} isOriginalRow />
          <CategoryRows title="Top Rated" fetchUrl = {`https://api.themoviedb.org/3//movie/top_rated?api_key=${API_KEY}&language=en-US`} isOriginalRow />
          <CategoryRows title="Action Movies" fetchUrl = {`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28`} isOriginalRow={false} />
          <CategoryRows title="Comedy Movies" fetchUrl = {`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=35`} isOriginalRow={false} />
          <CategoryRows title="Horror Movies" fetchUrl = {`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=27`} isOriginalRow={false} />
          <CategoryRows title="Romance Movies" fetchUrl = {`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=10749`} isOriginalRow={false} />
          {/* <CategoryRows title="Science Fiction" fetchUrl = {`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=878`} isOriginalRow={false} />
          <CategoryRows title="Fantasy" fetchUrl = {`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=14`} isOriginalRow={false} />
          <CategoryRows title="Crime" fetchUrl = {`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=80`} isOriginalRow={false} />
          <CategoryRows title="Music" fetchUrl = {`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=10402`} isOriginalRow={false} />
          <CategoryRows title="Documentries" fetchUrl = {`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=99`} isOriginalRow={false} />  */}
        </div>
    );
  }

export default Home