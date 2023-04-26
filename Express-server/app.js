const express = require("express");
const app = express();
const configRoutes = require("./routes");
const cors = require("cors");
const session = require("express-session");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log("session created");
app.use(
  session({
    name: "AuthCookie",
    secret: "login session",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/LoginForm", (req, res, next) => {
  // console.log(req.session);
  next();
});

app.use("/Logout", (req, res, next) => {
  next();
});

configRoutes(app);

app.listen(8000, () => {
  console.log("We've now got a NODE server!");
  console.log("Your routes will be running on http://localhost:8000");
});
