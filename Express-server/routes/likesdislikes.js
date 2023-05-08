const express = require("express");
const router = express.Router();
const likesData = require("../data/likes");

router
  .route("/")
  .get(async (req, res) => {
    try {
      const { movieId, userId } = req.query;
      const getLikesDislikes = await likesData.getLikeDislike(movieId, userId);
      res.json(getLikesDislikes);
    } catch (e) {
      // res.status(e.statusCode || 500).json(e);
      res.json(e);
    }
  })
  .post(async (req, res) => {
    try {
      const { movieId, userId, value } = req.body;
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
    const { movieId } = req.query;
    const result = await likesData.getTotalLikesDislikes(movieId);
    res.json(result);
  } catch (e) {
    res.json(e);
  }
});

module.exports = router;
