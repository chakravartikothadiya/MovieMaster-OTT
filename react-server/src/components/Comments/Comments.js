import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  getComments,
  createComment,
  deleteComment as deleteCommentApi,
  updateComment as updateCommentApi,
} from "./api";
import Comment from "./Comment";
import styles from "./Comments.module.css";
import CommentFrom from "./CommentForm";

export default function Comments({ currentUserId, username, movieId }) {
  console.log("username", username);
  let userId = currentUserId;
  movieId = movieId.toString();
  const [backendComments, setbackendComments] = useState([]);

  //For Reply and Editing of the Comments, Maintaing a state called activeComments
  const [activeComment, setactiveComment] = useState(null);
  const rootComments = backendComments.filter(
    (backendComment) => backendComment.parentId === null
  );

  //Function to the Replies for each parent comment
  const getReplies = (commentId) => {
    return backendComments
      .filter((backendComment) => backendComment.parentId === commentId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  };

  const getNewAddedComments = async (text, parentId) => {
    //Add new replys here
    let body = text;
    console.log(parentId);
    const addNewComment = await axios.post("http://localhost:8000/comments/", {
      movieId,
      userId,
      body,
      username,
      parentId,
    });
    //const getNewCommentsArray = await createComment(text, parentId);
    setbackendComments([addNewComment.data, ...backendComments]);
  };

  //Function to handle add Comment
  const addComment = (text, parentId) => {
    console.log("Add Comment", text, parentId);
    getNewAddedComments(text, parentId);
    setactiveComment(null);
  };

  //Function to handle delete comments
  const deleteComment = async (commentId) => {
    const updatedBackendComments = backendComments.filter(
      (backendComment) => backendComment._id !== commentId
    );
    setbackendComments(updatedBackendComments);
    const updatedComment = await axios.post(
      "http://localhost:8000/comments/remove",
      {
        commentId,
      }
    );
  };

  const updateComment = async (text, commentId) => {
    const updatedComment = await axios.post(
      "http://localhost:8000/comments/edit",
      {
        commentId,
        text,
      }
    );
    let updComtdata = updatedComment.data;
    console.log(updComtdata);

    const updatedBackendComments = backendComments.map((backendComment) => {
      if (backendComment._id === commentId) {
        return { ...backendComment, body: text };
      }
      return backendComment;
    });
    setbackendComments(updatedBackendComments);
    setactiveComment(null);
  };

  const setData = async () => {
    //trigger that API
    const response = await axios.get("http://localhost:8000/comments/", {
      params: {
        movieId: movieId,
        userId: userId,
      },
    });
    console.log(response.data);
    setbackendComments(response.data);
  };

  useEffect(() => {
    setData();
  }, []);

  return (
    <div className={styles.comments}>
      <h3>Comments</h3>
      {/* <div className={styles.comment_form_title}>Write Comment</div> */}
      <CommentFrom submitLable="Comment" handleSubmit={addComment} />
      <div className={styles.comments_container}>
        {rootComments.map((item) => (
          <Comment
            key={item._id}
            comment={item}
            replies={getReplies(item._id)}
            currentUserId={currentUserId}
            addComment={addComment}
            deleteComment={deleteComment}
            updateComment={updateComment}
            activeComment={activeComment}
            setactiveComment={setactiveComment}
          />
        ))}
      </div>
    </div>
  );
}
