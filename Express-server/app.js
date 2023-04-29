const express = require("express");
const app = express();
const configRoutes = require("./routes");
const cors = require("cors");
const session = require("express-session");

// app.use(cors());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log("session created");
app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

app.set("socketio", io);

app.use("/LoginForm", (req, res, next) => {
  // console.log(req.session.id);
  next();
});

app.use("/Logout", (req, res, next) => {
  // console.log(req.session);
  next();
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
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

//
io.on("connection", (socket) => {
  console.log("new client connected", socket.id);

  socket.on("join_room", (name) => {
    // socket.leave(name);
    const rooms = socket.rooms;
    // const rooms = Object.keys(socket.rooms);
    // console.log(rooms.values());
    rooms.forEach((room) => {
      socket.leave(room);
    });
    console.log("A user joined, ChatRoom name is " + name);
    socket.join(name);
  });

  // socket.on("leave_room", (name) => {
  //   socket.leave(name);
  // });

  socket.on("message", (data) => {
    console.log(data);
    // socket.to(data.room).emit("recieve_message", data);
    socket.to(data.room).emit("recieve_message", data);
  });

  socket.on("disconnect", () => {
    console.log("Disconnect Fired");
  });
});
//
// io.origins("*:*");

server.listen(8000, () => {
  console.log("We've now got a NODE server!");
  console.log("Your routes will be running on http://localhost:8000");
  console.log(`Socket.io is listening on *:${8000}`);
});
