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
        <textarea
          placeholder={isParent ? "Add a Comment..." : "Add a Comment..."}
          className={styles.comment_form_textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className={styles.comment_editing_buttons}>
          <button
            className={styles.comment_form_button}
            disabled={isTextDisabled}
          >
            {submitLable}
          </button>

          {hasCancelButton && (
            <button
              type="button"
              className={styles.comment_form_cancel_button}
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
