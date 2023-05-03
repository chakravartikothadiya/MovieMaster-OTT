const express = require("express");
const router = express.Router();
const profilepage = require("../data/profilepage");

router
  .route("/")
  .get(async (req, res) => {
    try {
      let body = req.body;
      let MovieList = await profilepage.getAllmovies(body.email);
      console.log(MovieList);
      return res.json(MovieList[0].myList).status(200);
    } catch (e) {
      console.log(e);
    }
  })
  .post(async (req, res) => {
    try {
      let body = req.body;
      let postedMovie = await profilepage.addmovietolist(
        body.movieId,
        body.movieName,
        body.moviePoster,
        body.email
      );
      if (postedMovie) {
        let foundMovie = await profilepage.getAllmovies(body.email);
        return res.json(foundMovie).status(200);
      } else {
        throw "unable to add movie to list";
      }
    } catch (e) {
      res.json(e);
    }
  })
  .delete(async (req, res) => {
    try {
      let body = req.body;
      let removedMovie = await profilepage.removemoviefromlist(
        body.movieId,
        body.email
      );
      if (removedMovie) {
        return res.json(removedMovie).status(200);
      } else {
        throw "unable to remove movie";
      }
    } catch (e) {
      res.json(e);
    }
  });

module.exports = router;
