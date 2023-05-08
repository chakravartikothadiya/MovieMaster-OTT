import React, { useContext } from "react";
import HomeBanner from "./HomeBanner";
import CategoryRows from "./CategoryRows";
import Footer from "./Footer/Footer";
import { AuthContext } from "../UserContext";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const API_KEY = process.env.REACT_APP_TMDC_API_KEY;

function Home() {
  const [currentUser] = useContext(AuthContext);
  const login = currentUser?.login;
  const uid = currentUser?.uid;
  const emailID = currentUser?.emailId;
  const navigate = useNavigate();
  const location = useLocation();
  const verifiy_session = location?.state?.user_session;
  if (localStorage.getItem("session_auth") == null) {
    localStorage.clear();
    navigate("/login", { state: { session_expired: true } });
  }

  useEffect(() => {
    if (
      localStorage.getItem("session_auth") == null ||
      localStorage.getItem("session_email") == null ||
      localStorage.getItem("session_userID") == null
    ) {
      localStorage.clear();
      navigate("/login", { state: { session_expired: true } });
    }
  }, []);

  return (
    <div>
      <div>
        <div className="home">
          <HomeBanner
            fetchURL={`https://api.themoviedb.org/3//movie/top_rated?api_key=${API_KEY}&language=en-US`}
          />
          <CategoryRows
            title="Trending Now"
            fetchUrl={`https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US`}
          />
          <CategoryRows
            title="Top Rated"
            fetchUrl={`https://api.themoviedb.org/3//movie/top_rated?api_key=${API_KEY}&language=en-US`}
          />
          <CategoryRows
            title="Action Movies"
            fetchUrl={`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28`}
          />
          <CategoryRows
            title="Comedy Movies"
            fetchUrl={`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=35`}
          />
          <CategoryRows
            title="Horror Movies"
            fetchUrl={`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=27`}
          />
          <CategoryRows
            title="Romance Movies"
            fetchUrl={`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=10749`}
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
