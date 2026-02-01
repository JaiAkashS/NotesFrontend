import { useNavigate } from 'react-router-dom'

const Note = ({ note }) => {
  const navigate = useNavigate()

  const handleTitleClick = () => {
    navigate(`/notes/${note.id}`)
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
      </li>

    </>
  )
}


export default Note