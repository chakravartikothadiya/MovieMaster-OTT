const express = require("express");
const router = express.Router();
const likesData = require("../data/likes");

router
  .route("/")
  .get(async (req, res) => {
    try {
      console.log("Inside the get of likes");
      console.log(req.query);
      const { movieId, userId } = req.query;
      console.log("MovieId", movieId);
      console.log("userId", userId);
      const getLikesDislikes = await likesData.getLikeDislike(movieId, userId);
      res.json(getLikesDislikes);
    } catch (e) {
      // res.status(e.statusCode || 500).json(e);
      res.json(e);
    }
  })
  .post(async (req, res) => {
    try {
      console.log("Inside Post");
      console.log(req.body);
      const { movieId, userId, value } = req.body;
      console.log("MovieId", movieId);
      console.log("userId", userId);
      console.log("value", value);
      const createUpdateLikes = await likesData.createlike(
        movieId,
        userId,
        value
      );
      res.json({ status: "Created" });
    } catch (e) {
      res.json(e);
    }
  });

router.route("/totallikes").get(async (req, res) => {
  try {
    console.log("Inside counts");
    const { movieId } = req.query;
    console.log(movieId);
    const result = await likesData.getTotalLikesDislikes(movieId);
    console.log(result);
    res.json(result);
  } catch (e) {
    res.json(e);
  }
});

module.exports = router;
