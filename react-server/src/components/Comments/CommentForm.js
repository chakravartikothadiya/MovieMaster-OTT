import React, { useState } from "react";
import styles from "./Comments.module.css";

export default function CommentFrom({
  submitLable,
  handleSubmit,
  hasCancelButton = false,
  initialText = "",
  handleCancel,
  comment = false,
}) {
  const [text, setText] = useState(initialText);

  //Check if the text is Empty to disable the submit button
  const isTextDisabled = text.length === 0;
  let isParent;
  if (comment.parentId === null) {
    isParent = true;
  } else {
    isParent = false;
  }
  console.log(isParent);

  //Function for handling the Submit form
  const onSubmit = (event) => {
    event.preventDefault();
    handleSubmit(text);
    setText("");
  };

  return (
    <form onSubmit={onSubmit}>
      <div className={styles.comment_form_section}>
        <label for="my-input" hidden>
          Enter Comments
        </label>
        <textarea
          placeholder={isParent ? "Add a Comment..." : "Add a Comment..."}
          className={styles.comment_form_textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          id="my-input"
        />
        <div className={styles.comment_editing_buttons}>
          <label for="comment-button" hidden>
            Comment Button
          </label>
          <button
            className={styles.comment_form_button}
            disabled={isTextDisabled}
            id="comment-button"
          >
            {submitLable}
          </button>

          {hasCancelButton && (
            <>
              <label for="cancel-button" hidden>
                Cancel Button
              </label>
              <button
                type="button"
                className={styles.comment_form_cancel_button}
                onClick={handleCancel}
                id="cancel-button"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
