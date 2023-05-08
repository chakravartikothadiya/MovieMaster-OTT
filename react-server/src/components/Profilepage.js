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

  const getdata = async () => {
    const response = await axios.get("http://localhost:8000/profilepage", {
      params: {
        userId: uid,
      },
    });
    setdata(response.data);
  };

  const removemovie = async (id) => {
    const remove = await axios.delete("http://localhost:8000/profilepage", {
      data: { movieId: id, userId: uid },
    });
  };

  useEffect(() => {
    getdata();
  }, [currentUser, data]);

  return (
    <div className="Profilepage">
      <br></br>
      <br></br>
      <br></br>
      <h1 className="Mylistheading">Email: {currentUser?.emailID}</h1>
      <div className="mylistcontainer">
        <h1 className="Mylistheading">My list</h1>

        {data &&
          data.map((movie) => {
            return (
              <div>
                <img
                  className={`thumbnail`}
                  key={movie.id}
                  src={`https://image.tmdb.org/t/p/original/${movie.moviePoster}`}
                  alt={movie?.title || movie?.name || movie?.original_name}
                  onClick={() => navigate(`/movie/${movie.id}/`)}
                />
                <button
                  className="remove"
                  onClick={(e) => {
                    e.preventDefault();
                    removemovie(movie.id);
                  }}
                >
                  Remove movie
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
}
