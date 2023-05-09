import React, { useContext } from "react";
import axios from "axios";
import Detail from "./MovieDetails";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Comments from "./Comments/Comments";
import { AuthContext } from "../UserContext";
import Footer from "./Footer/Footer";

const API_KEY = process.env.REACT_APP_TMDC_API_KEY;

export default function LoadMovie() {
  const [currentUser] = useContext(AuthContext);
  const uid = currentUser?.uid;
  const emailID = currentUser?.emailID;
  let usrId = uid?.toString();
  let username = emailID?.split("@")[0];
  const { id } = useParams();
  const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=en-US`;
  const url_movie_cast = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=en-US`;
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState(null);
  const [director, setDirector] = useState(null);
  const [genre, setGenre] = useState(null);
  const [error, setError] = useState(false);
  const [runtime, setRuntime] = useState(null);

  //d7acb997073d8ac06467543852351ad1
  const fetc_data = async () => {
    try {
      const data = await axios.get(url);
      setMovie(data.data);

      //setting runtime
      let run_time = converRuntime(data.data.runtime);
      setRuntime(run_time);

      //Setting Genres
      const genre_arr = data.data.genres.map((person) => person.name);
      const final_genres_string = genre_arr.join(", ");
      setGenre(final_genres_string);
    } catch (e) {
      setError(true);
      console.log(e);
    }
  };

  const converRuntime = (runtime) => {
    if (runtime < 60) {
      return `${runtime}m`;
    } else if (runtime % 60 === 0) {
      const hours = runtime / 60;
      return `${hours}h`;
    } else {
      const hours = Math.floor(runtime / 60);
      const minutes = runtime % 60;
      return `${hours}h ${minutes}m`;
    }
  };

  const fecth_cast = async () => {
    try {
      const cast_data = await axios.get(url_movie_cast);
      const cast_list = cast_data.data.cast
        .filter((person) => person.known_for_department === "Acting")
        .sort((a, b) => a.order - b.order)
        .slice(0, 4)
        .map((person) => person.name);
      const final_cast_string = cast_list.join(", ");
      setCast(final_cast_string);

      //Setting Director
      const director_list = cast_data.data.crew
        .filter((person) => person.department === "Directing")
        .map((person) => person.name);
      const final_crew_string = director_list.join(", ");
      setDirector(final_crew_string);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetc_data();
    fecth_cast();
  }, [id]);

  return (
    <div className="Load-Movie">
      {!error && movie && (
        <Detail
          id={movie.id}
          title={movie.title}
          rating={movie.popularity}
          runtime={runtime}
          genre={genre}
          cast={cast}
          director={director}
          poster={"https://image.tmdb.org/t/p/original" + movie.backdrop_path}
          release={movie.release_date}
          description={movie.overview}
          userId={usrId}
          username={username}
        />
      )}
      {!error && movie && (
        <Comments
          currentUserId={usrId}
          username={username}
          movieId={movie.id}
        />
      )}
      {error && (
        <h1
          style={{
            color: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            margin: "0",
          }}
        >
          Error 404: Not Found
        </h1>
      )}
    </div>
  );
}
