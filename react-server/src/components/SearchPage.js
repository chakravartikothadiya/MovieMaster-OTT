import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import '../static/css/SearchPage.css';
import axios from 'axios';
import GenreMovies from './GenreMovies';

export default function SearchPage() {
 
    const location = useLocation();
    let skey = location.state && location.state.skey;

    const [data, setData] = useState(null);
    const [searchKey, setSearchKey] = useState("");

    const fetchData = async() =>{
        const movie_data = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=d7acb997073d8ac06467543852351ad1&language=en-US&page=1&include_adult=false&query=${searchKey}`)
        setData(movie_data.data.results);

    }
    

    useEffect(()=>{
      skey = location.state && location.state.skey;
     setSearchKey(skey)
     console.log(searchKey);
     fetchData();
    },[skey])


  return (
    <div className='search-page'>
        <div className="outer-card-component">
            <GenreMovies movies={data} />
        </div>
    </div>
  );
}
