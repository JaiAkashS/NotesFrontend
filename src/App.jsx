import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import noteService from './services/notesService.js'
import notesService from './services/notesService.js'
import NotesListPage from './pages/NotesListPage'
import NoteDetailPage from './pages/NoteDetailPage'
import SavedNotes from './components/SavedNotes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUser) {
      let user = JSON.parse(loggedUser)
      setUser(user)
      notesService.setToken(user.token)
    }
  }, [])

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <NotesListPage 
            notes={notes} 
            setNotes={setNotes} 
            user={user} 
            setUser={setUser}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        } 
      />
      <Route 
        path="/notes/saved"
        element={<SavedNotes user={user} />}
      />
      <Route 
        path="/notes/:id" 
        element={<NoteDetailPage notes={notes} />} 
      />
      
    </Routes>
  )
}

export default App