import React, { useEffect, useState } from "react";
import axios from "axios";
import Comment from "./Comment";
import styles from "./Comments.module.css";
import CommentFrom from "./CommentForm";

export default function Comments({ currentUserId, username, movieId }) {
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
    try {
      const addNewComment = await axios.post(
        "http://localhost:8000/comments/",
        {
          movieId,
          userId,
          body,
          username,
          parentId,
        }
      );
      setbackendComments([addNewComment.data, ...backendComments]);
    } catch (e) {
      console.log(e);
    }
  };

  //Function to handle add Comment
  const addComment = (text, parentId) => {
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
    try {
      const response = await axios.get("http://localhost:8000/comments/", {
        params: {
          movieId: movieId,
          userId: userId,
        },
      });
      setbackendComments(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setData();
  }, [movieId]);

  return (
    <div className={styles.comments}>
      <h2>Comments</h2>
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
