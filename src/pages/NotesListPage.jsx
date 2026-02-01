import Note from '../components/Note'
import { useState, useEffect, useRef } from 'react'
import noteService from '../services/notesService.js'
import Notification from '../components/Notification'
import LoginForm from '../components/LoginForm'
import NoteForm from '../components/NoteForm'
import Togglable from '../components/Togglable.jsx'
import Footer from '../components/Footer'

const NotesListPage = ({ notes, setNotes, user, setUser, errorMessage, setErrorMessage }) => {
  const [query, setQuery] = useState('')
  const noteFormRef = useRef()

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }

  const notesToShow = notes.filter(
    (note) => {
      const q = query.trim().toLowerCase()
      if (q === "") {
        return true
      }
      return (
        note.title.toLowerCase().includes(q) ||
        note.tags.some(tag => tag.toLowerCase().includes(q))
      )
    }
  )

  const loginForm = () => {
    return (
      <Togglable buttonLabel='Login'>
        <LoginForm
          user={user}
          setUser={setUser}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      </Togglable>
    )
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedNoteAppUser')
    setUser(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Notes</h1>
        <div>
          {!user && loginForm()}
          {user && <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <p style={{ margin: 0 }}>{user.name}</p>
            <button onClick={handleLogout}>Log out</button>
          </div>
          }
        </div>
      </div>

      <Notification message={errorMessage} />

      <input type="text"
        name="search"
        placeholder="Search notes..."
        value={query}
        onChange={(event) => { setQuery(event.target.value) }}
      />

      {user && <Togglable buttonLabel='new note' ref={noteFormRef}>
        <NoteForm
          createNote={addNote}
        />
      </Togglable>
      }

      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note} />
        )}
      </ul>
      <Footer />
    </div>
  )
}

export default NotesListPage
