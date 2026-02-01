import { useNavigate } from 'react-router-dom'
import { useState} from 'react'
import {
  FaThumbsUp,
  FaThumbsDown,
  FaRegThumbsUp,
  FaRegThumbsDown,
  FaBookmark,
  FaRegBookmark
} from "react-icons/fa";
import { useEffect } from 'react';
import notesService from "../services/notesService"


const NoteDetail = ({ note }) => {
  const navigate = useNavigate()
  const [reaction, setReaction] = useState(null);
  const [isSaved, setIsSaved] = useState(false)
  const [likesCount, setLikesCount] = useState(note.likes?.length || 0);
  const [dislikesCount, setDislikesCount] = useState(note.dislikes?.length || 0);

  // Check if the current user has already reacted to this note
  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUser && note.likes && note.dislikes) {
      const user = JSON.parse(loggedUser)
      const userId = user.id
      
      if (note.likes.includes(userId)) {
        setReaction('like')
      } else if (note.dislikes.includes(userId)) {
        setReaction('dislike')
      }
    }
  }, [note])

  const handleLike = async () => {
    try {
      const response = await notesService.makeReaction(note.id, "like")
      if (response) {
        setLikesCount(response.likes)
        setDislikesCount(response.dislikes)
        setReaction(response.userReaction === 'like' ? 'like' : null)
      }
    } catch (error) {
      console.error('Failed to like:', error)
    }
  };
  
  const handleDislike = async () => {
    try {
      const response = await notesService.makeReaction(note.id, "dislike")
      if (response) {
        setLikesCount(response.likes)
        setDislikesCount(response.dislikes)
        setReaction(response.userReaction === 'dislike' ? 'dislike' : null)
      }
    } catch (error) {
      console.error('Failed to dislike:', error)
    }
  };

  const handleSaveNote = async () => {
    try {
      const response = await notesService.saveNote(note.id)
      if (response) {
        setIsSaved(response.isSaved)
      }
    } catch (error) {
      console.error('Failed to save note:', error)
    }
  };

  const handleBack = () => {
    navigate('/')
  }
  
  

  return (
    <div className="note-detail-container">
      <button onClick={handleBack} className="back-button">
        ← Back to Notes
      </button>

      <article className="note-detail-article">
        <h1 className="note-detail-title">{note.title}</h1>
        <div className="reaction-container">
          <button
            className={`reaction-btn ${reaction === "like" ? "liked" : ""}`}
            onClick={handleLike}
            aria-label="Like" 
          >
            {reaction === "like" ? <FaThumbsUp /> : <FaRegThumbsUp />}
            <span className="reaction-count">{likesCount}</span>
          </button>

          <button
            className={`reaction-btn ${reaction === "dislike" ? "disliked" : ""}`}
            onClick={handleDislike}
            aria-label="Dislike"
          >
            {reaction === "dislike" ? <FaThumbsDown /> : <FaRegThumbsDown />}
            <span className="reaction-count">{dislikesCount}</span>
          </button>

          <button
            className={`reaction-btn ${isSaved ? "saved" : ""}`}
            onClick={handleSaveNote}
            aria-label="Save Note"
          >
            {isSaved ? <FaBookmark /> : <FaRegBookmark />}
            <span className="save-label">{isSaved ? "Saved" : "Save"}</span>
          </button>
          
        </div>
        <div className="note-detail-content">
            <p>{note.content}</p>
        </div>
      </article>
    </div>
  )
}

export default NoteDetail
