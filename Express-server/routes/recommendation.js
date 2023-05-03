const express = require("express");
const router = express.Router();
const axios = require("axios");

// Redis Client Connection
const redis = require("redis");
const client = redis.createClient();
(async () => {
  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.connect();
})();

router.route("/genres/:genre/:number").get(async (req, res) => {
    const { genre, number } = req.params;
    const url = `http://localhost:5000/predict/genre/${genre}/${number}`;
    try {
      const { data } = await axios.get(url);
      if (data.movies.length === 0) {
        return res.status(404).json("No Related Movies Found");
      } else {
        allRecommendedMovies = [];
        await Promise.all(
          data.movies.map(async (movie) => {
            let exists = await client.exists(movie);
            let movieObject = undefined;
            if (exists) {
              let resultFromCache = await client.get(movie);
              movieObject = JSON.parse(resultFromCache);
            } else {
              const requestToGetMovie = await axios.get(
                `https://api.themoviedb.org/3/search/movie?api_key=d7acb997073d8ac06467543852351ad1&language=en-US&page=1&include_adult=false&query=${movie}`
              );
              if (requestToGetMovie.data.results.length != 0) {
                movieObject = {
                  id: requestToGetMovie.data.results[0].id,
                  title: requestToGetMovie.data.results[0].original_title,
                  image: requestToGetMovie.data.results[0].backdrop_path,
                };
                await client.set(movie, JSON.stringify(movieObject));
              }
            }
            if (movieObject != null && movieObject.image != null) {
                allRecommendedMovies.push(movieObject);
            }
          })
        );
        return res.json(allRecommendedMovies);
      }
    } catch (err) {
        if (err){
            return res.status(404).json("No Related Movies Found");
        }
        else {
            return res.status(500).json("Internal Server Error")
        }
    }
});

router.route("/movies/:movie/:number").get(async (req, res) => {
  const { movie, number } = req.params;
  const url = `http://localhost:5000/predict/movie/${movie}/${number}`;
  try {
    const { data } = await axios.get(url);
    if (data.movies.length === 0) {
      return res.status(404).json("No Related Movies Found");
    } else {
      allRecommendedMovies = [];
      await Promise.all(
        data.movies.map(async (movie) => {
          let exists = await client.exists(movie);
          let movieObject = undefined;
          if (exists) {
            let resultFromCache = await client.get(movie);
            movieObject = JSON.parse(resultFromCache);
          } else {
            const requestToGetMovie = await axios.get(
              `https://api.themoviedb.org/3/search/movie?api_key=d7acb997073d8ac06467543852351ad1&language=en-US&page=1&include_adult=false&query=${movie}`
            );
            if (requestToGetMovie.data.results.length != 0) {
              movieObject = {
                id: requestToGetMovie.data.results[0].id,
                title: requestToGetMovie.data.results[0].original_title,
                image: requestToGetMovie.data.results[0].backdrop_path,
              };
              await client.set(movie, JSON.stringify(movieObject));
            }
          }
          if (movieObject != null && movieObject.image != null) {
              allRecommendedMovies.push(movieObject);
          }
        })
      );
      return res.json(allRecommendedMovies);
    }
  } catch (err) {
      if (err){
          return res.status(404).json("No Related Movies Found");
      }
      else {
          return res.status(500).json("Internal Server Error")
      }
  }
});

module.exports = router;