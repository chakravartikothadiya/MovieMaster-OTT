const express = require("express");
const router = express.Router();
const commentsData = require("../data/comments");

router
  .route("/")
  .get(async (req, res) => {
    try {
      const { movieId } = req.query;
      const AllComments = await commentsData.getAllComments(movieId);
      res.json(AllComments);
    } catch (e) {
      res.json(e);
    }
  })
  .post(async (req, res) => {
    try {
      const { movieId, userId, username, body, parentId } = req.body;
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
    const { commentId, text } = req.body;
    const updateComment = await commentsData.editComments(commentId, text);
    res.json(updateComment);
  } catch (e) {
    res.json(e);
  }
});

router.route("/remove").post(async (req, res) => {
  try {
    const { commentId } = req.body;
    const deleteComment = await commentsData.removeComment(commentId);
  } catch (e) {
    res.json(e);
  }
});

module.exports = router;
