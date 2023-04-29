const express = require("express");
const router = express.Router();
const commentsData = require("../data/comments");

router
  .route("/")
  .get(async (req, res) => {
    try {
      console.log("Inside get comments");
      const { movieId } = req.query;
      console.log(movieId);
      const AllComments = await commentsData.getAllComments(movieId);
      console.log(AllComments);
      res.json(AllComments);
    } catch (e) {
      res.json(e);
    }
  })
  .post(async (req, res) => {
    try {
      console.log("Inside post comments");
      const { movieId, userId, username, body, parentId } = req.body;
      console.log(movieId, userId, username, body);
      const insertComment = await commentsData.createParentComment(
        movieId,
        userId,
        username,
        body,
        parentId
      );
      res.json(insertComment);
    } catch (e) {
      res.json(e);
    }
  });

router.route("/edit").post(async (req, res) => {
  try {
    console.log("Inside edit post route");
    const { commentId, text } = req.body;
    console.log(commentId);
    console.log(text);
    const updateComment = await commentsData.editComments(commentId, text);
    console.log(updateComment);
    res.json(updateComment);
  } catch (e) {
    res.json(e);
  }
});

router.route("/remove").post(async (req, res) => {
  try {
    console.log("Inside Remove Route");
    const { commentId } = req.body;
    const deleteComment = await commentsData.removeComment(commentId);
  } catch (e) {
    res.json(e);
  }
});

module.exports = router;
