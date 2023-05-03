import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import '../static/css/SearchPage.css';
import axios from 'axios';
import SearchCard from './SearchCard';

export default function SearchPage() {
 
    const location = useLocation();
    let skey = location.state && location.state.skey;
    let userId = location.state && location.state.userId;
    let username = location.state && location.state.username;
    console.log("Inside SearchPage");
    console.log(userId);
    console.log(username);
    const [uId,setUId] = useState(null);
    const [uname, setUname] = useState(null);

    const [data, setData] = useState(null);
    const [searchKey, setSearchKey] = useState("");

    const fetchData = async() =>{
        const movie_data = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=d7acb997073d8ac06467543852351ad1&language=en-US&page=1&include_adult=false&query=${searchKey}`)
        setData(movie_data.data.results);

    }
    

    useEffect(()=>{
      skey = location.state && location.state.skey;
      userId = location.state && location.state.userId;
    username = location.state && location.state.username;
     setSearchKey(skey)
     console.log(searchKey);
     fetchData();
    },[skey])


  return (
    <div className='search-page'>
        <div className="outer-card-component">
            {data && data.map((item)=>(
            <SearchCard movie={item} userId={userId} username={username}/>
            ))}
        </div>
    </div>
  );
}
