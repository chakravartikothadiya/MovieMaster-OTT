import React, { useEffect, useState } from "react";
import { getComments, createComment, deleteComment as deleteCommentApi, updateComment as updateCommentApi} from "./api";
import Comment from "./Comment";
import styles from './Comments.module.css';
import CommentFrom from "./CommentForm";

export default function Comments({currentUserId})
{
    const [backendComments, setbackendComments] = useState([]);

    //For Reply and Editing of the Comments, Maintaing a state called activeComments
    const [activeComment, setactiveComment] = useState(null);
    const rootComments = backendComments.filter((backendComment)=> backendComment.parentId === null);

    //Function to the Replies for each parent comment
    const getReplies = commentId => { 
        return backendComments
        .filter(backendComment=> backendComment.parentId===commentId)
        .sort(
            (a,b)=> 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
    };



    const getNewAddedComments = async(text, parentId) =>{
        const getNewCommentsArray = await createComment(text, parentId);
        setbackendComments([getNewCommentsArray, ...backendComments]);
    }

    //Function to handle add Comment
    const addComment = (text, parentId) =>{
        console.log('Add Comment',text, parentId);
        getNewAddedComments(text,parentId);
        setactiveComment(null);
    }

    //Function to handle delete comments
    const deleteComment = (commentId) =>{
        deleteCommentApi(commentId).then(()=>{
            const updatedBackendComments = backendComments.filter(
                (backendComment) => backendComment.id!==commentId
            );
            setbackendComments(updatedBackendComments);
        })
    }

    const updateComment = (text, commentId) =>{
        updateCommentApi(text,commentId).then(()=>{
            const updatedBackendComments = backendComments.map(backendComment => {
                if(backendComment.id === commentId)
                {
                    return {...backendComment, body:text};
                }   
                return backendComment;
            })
            setbackendComments(updatedBackendComments);
            setactiveComment(null);
        })
    }

    const setData = async()=>{
        const data = await getComments();
        setbackendComments(data);
    }

    useEffect(()=>{
        setData();
    },[])

    return(
        <div className={styles.comments}>
            <h3>Comments</h3>
            {/* <div className={styles.comment_form_title}>Write Comment</div> */}
            <CommentFrom submitLable="Comment" handleSubmit={addComment}/>
            <div className={styles.comments_container}>
            {
                rootComments.map((item)=> 
                <Comment 
                    key={item.id} 
                    comment={item} 
                    replies={getReplies(item.id)}
                    currentUserId = {currentUserId}
                    addComment = {addComment}
                    deleteComment = {deleteComment}
                    updateComment = {updateComment}
                    activeComment = {activeComment}
                    setactiveComment = {setactiveComment}
                    />
                )
            }
            </div>
        </div>
    );
}