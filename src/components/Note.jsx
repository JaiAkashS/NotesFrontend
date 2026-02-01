import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import {
  FaBookmark,
  FaRegBookmark
} from "react-icons/fa";
const Note = ({ note }) => {
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false);
  const handleTitleClick = () => {
    navigate(`/notes/${note.id}`)
  }
    const handleSaved = async ()=>{
    const response = await notesService.saveNote(note.id)
    try{
      if(response){
      setSaved(response.saved)
      }
    }catch(error){
      console.error("failed to save note",error)
    }

  }

  return(
    <>
      <li className="note">
        <h3 
          onClick={handleTitleClick}
          style={{ cursor: 'pointer', color: '#3498db', margin: 0 }}
        >
          {note.title}
        </h3>
        
        {/* <button
          className={`reaction-btn ${isSaved ? "saved" : ""}`}
          onClick={handleSaveNote}
          aria-label="Save Note"
        >
          {isSaved ? <FaBookmark /> : <FaRegBookmark />}
          <span className="save-label">{isSaved ? "Saved" : "Save"}</span>
        </button> */}
      </li>

    </>
  )
}


export default Note