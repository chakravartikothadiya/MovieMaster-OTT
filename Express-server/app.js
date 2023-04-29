const express = require("express");
const app = express();
const configRoutes = require("./routes");
const cors = require("cors");
const session = require("express-session");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios")


// Redis Client Connection
const redis = require('redis');
const client = redis.createClient();
(async () => {
  client.on('error', (err) => console.log('Redis Client Error', err));
  await client.connect();
})();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/LoginForm", (req, res, next) => {
  // console.log(req.session);
  next();
});

app.use("/Logout", (req, res, next) => {
  next();
});

app.use("/Logout", (req, res, next) => {
  next();
});















































app.get('/:genre/:number', async (req, res, next) => {
  const { genre, number } = req.params;
  console.log(genre, number)
  const url = `http://localhost:5000/predict/${genre}/${number}`;
  try {
    const { data } = await axios.get(url);
    if (data.movies.length === 0) {
      res.status(404).send('Movies not found');
    } else {
      allRecommendedMovies = []
      await Promise.all(
        data.movies.map(async (movie)=>{
          let exists = await client.exists(movie);
          let movieObject = undefined;
          if(exists){
            let resultFromCache = await client.get(movie)
            movieObject = JSON.parse(resultFromCache)
          } else {
            const requestToGetMovie = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=d7acb997073d8ac06467543852351ad1&language=en-US&page=1&include_adult=false&query=${movie}`)
            if (requestToGetMovie.data.results.length != 0) {
              movieObject = {
                id: requestToGetMovie.data.results[0].id,
                title:requestToGetMovie.data.results[0].original_title,
                image: requestToGetMovie.data.results[0].backdrop_path
              }
              await client.set(movie, JSON.stringify(movieObject))
            }
          }
          allRecommendedMovies.push(movieObject)
        })
      )
      console.log(allRecommendedMovies)
      return res.json(allRecommendedMovies);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
  next();
});


configRoutes(app);

app.listen(8000, () => {
  console.log("We've now got a NODE server!");
  console.log("Your routes will be running on http://localhost:8000");
});
