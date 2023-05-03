import React, { useContext } from "react";
import HomeBanner from "./HomeBanner";
import CategoryRows from "./CategoryRows";
import Footer from "./Footer/Footer";
import { AuthContext } from "../UserContext";

const API_KEY = process.env.REACT_APP_TMDC_API_KEY;

function Home() {
  const [currentUser] = useContext(AuthContext);
  console.log({ currentUser });
  const login = currentUser && currentUser.login;
  const uid = currentUser && currentUser.uid;
  const emailID = currentUser && currentUser.emailId;
  let userId = uid;
  let username = emailID;
  return (
    <div>
      <div>
        <br />
        <br />
        <div className="home">
          <HomeBanner
            fetchURL={`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_networks=213`}
          />
          <CategoryRows
            userId={userId}
            username={username}
            title="MovieMaster Originals"
            fetchUrl={`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_networks=213`}
            isOriginalRow
          />
          <CategoryRows
            userId={userId}
            username={username}
            title="Trending Now"
            fetchUrl={`https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US`}
            isOriginalRow
          />
          <CategoryRows
            userId={userId}
            username={username}
            title="Top Rated"
            fetchUrl={`https://api.themoviedb.org/3//movie/top_rated?api_key=${API_KEY}&language=en-US`}
            isOriginalRow
          />
          <CategoryRows
            userId={userId}
            username={username}
            title="Action Movies"
            fetchUrl={`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28`}
            isOriginalRow={false}
          />
          <CategoryRows
            userId={userId}
            username={username}
            title="Comedy Movies"
            fetchUrl={`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=35`}
            isOriginalRow={true}
          />
          <CategoryRows
            userId={userId}
            username={username}
            title="Horror Movies"
            fetchUrl={`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=27`}
            isOriginalRow={false}
          />
          <CategoryRows
            userId={userId}
            username={username}
            title="Romance Movies"
            fetchUrl={`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=10749`}
            isOriginalRow={false}
          />
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Home;
