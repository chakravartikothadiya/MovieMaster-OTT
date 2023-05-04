import axios from "axios";
import { AuthContext } from "../UserContext";
import { useContext } from "react";
import { useEffect, useState } from "react";
import GenreMovies from "./GenreMovies";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Profilepage() {
  const navigate = useNavigate();
  const [currentUser] = useContext(AuthContext);
  const [data, setdata] = useState(null);
  const uid = currentUser && currentUser.uid;
  let userId = uid?.toString();
  console.log("user", currentUser);
  const getdata = async () => {
    const response = await axios.get("http://localhost:8000/profilepage", {
      params: {
        userId: userId,
      },
    });
    console.log("response", response);

    let arr = response.data.map((e) => {
      return e;
    });
    console.log("arr", arr, typeof arr);
    setdata(arr);
  };

  useEffect(() => {
    console.log("in useEffect");
    getdata();
  }, [currentUser]);

  return (
    <div className="Profilepage">
      <br></br>
      <br></br>
      <br></br>
      <h1 className="Mylistheading">
        Email: {currentUser.emailID.split('"')[1]}
      </h1>
      <div className="mylistcontainer">
        <h1 className="Mylistheading">My list</h1>

        {data &&
          data.map((movie) => {
            return (
              <div onClick={() => navigate(`/movie/${movie.id}/`)}>
                <img
                  className={`thumbnail`}
                  key={movie.id}
                  src={`https://image.tmdb.org/t/p/original/${movie.moviePoster}`}
                  alt={movie?.title || movie?.name || movie?.original_name}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
