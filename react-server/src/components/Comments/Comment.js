import React from "react";
import styles from "./Comments.module.css";
import profile from "../Comments/logo.png";
import CommentFrom from "./CommentForm";

export default function Comment({
  comment,
  replies,
  currentUserId,
  addComment,
  deleteComment,
  updateComment,
  activeComment,
  setactiveComment,
  parentId = null,
}) {
  console.log("currentUserId", currentUserId);
  console.log("comment.userId", comment.userId);

  const canReply = Boolean(currentUserId);
  const canEdit = currentUserId === comment.userId;
  const canDelete = currentUserId === comment.userId;

  const createdAt = new Date(comment.createdAt).toLocaleDateString();

  const isReply =
    activeComment &&
    activeComment.type === "replying" &&
    activeComment._id === comment._id;
  const isEdit =
    activeComment &&
    activeComment.type === "editing" &&
    activeComment._id === comment._id;

  const replyId = parentId ? parentId : comment._id;
  return (
    <div key={comment._id} className={styles.comment}>
      <div className={styles.comment_image_container}>
        <img src={profile} className={styles.profile_image} alt="abc" />
      </div>
      <div className={styles.comment_right_part}>
        <div className={styles.comment_content}>
          <div className={styles.comment_author}>{comment.username}</div>
          <div className={styles.comment_date}>{createdAt}</div>
        </div>
        {!isEdit && <div className={styles.comment_text}>{comment.body}</div>}
        {isEdit && (
          <CommentFrom
            submitLable="Update"
            hasCancelButton
            initialText={comment.body}
            handleSubmit={(text) => updateComment(text, comment._id)}
            handleCancel={() => setactiveComment(null)}
            comment={comment}
          />
        )}
        {!isEdit && !isReply && (
          <div className={styles.comment_actions}>
            {canReply && (
              <div
                className={styles.comment_action}
                onClick={() =>
                  setactiveComment({ _id: comment._id, type: "replying" })
                }
              >
                Relpy
              </div>
            )}
            {canEdit && (
              <div
                className={styles.comment_action}
                onClick={() =>
                  setactiveComment({ _id: comment._id, type: "editing" })
                }
              >
                Edit
              </div>
            )}
            {canDelete && (
              <div
                className={styles.comment_action}
                onClick={() => deleteComment(comment._id)}
              >
                Delete
              </div>
            )}
          </div>
        )}
        {isReply && (
          <CommentFrom
            submitLable="Reply"
            handleSubmit={(text) => addComment(text, replyId)}
            hasCancelButton
            handleCancel={() => setactiveComment(null)}
            comment={comment}
          />
        )}
        {replies.length > 0 && (
          <div className={styles.replies}>
            {replies.map((reply) => (
              <Comment
                comment={reply}
                key={reply._id}
                activeComment={activeComment}
                setactiveComment={setactiveComment}
                deleteComment={deleteComment}
                addComment={addComment}
                updateComment={updateComment}
                parentId={comment._id}
                replies={[]}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
