import axios from "axios";
import { AuthContext } from "../UserContext";
import { useContext } from "react";
import { useEffect, useState } from "react";
import GenreMovies from "./GenreMovies";
import { useNavigate } from "react-router-dom";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import "../App.css";

export default function Profilepage() {
  const navigate = useNavigate();
  const [currentUser] = useContext(AuthContext);
  const [data, setdata] = useState([]);
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
    await axios.delete("http://localhost:8000/profilepage", {
      data: { movieId: id, userId: uid },
    });
    getdata();
  };

  useEffect(() => {
    getdata();
  }, [currentUser]);

  return (
    <div className="Profilepage">
      <h1 className="Mylistheading">User Email: {currentUser?.emailID}</h1>
      <div className="mylistcontainer">
        <h1
          className="Mylistheading"
          style={{ color: "white", fontSize: "35px" }}
        >
          My list
        </h1>

        {typeof data === "string" ? (
          <h1>{data}</h1>
        ) : (
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
                  <IoIosRemoveCircleOutline />{" "}
                  <span style={{ marginLeft: "5px" }}>Remove Movie</span>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
