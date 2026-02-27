import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import notesService from './services/notesService.js'
import NotesListPage from './pages/NotesListPage'
import NoteDetailPage from './pages/NoteDetailPage'
import SavedNotes from './components/SavedNotes'
import AuthorProfilePage from './pages/AuthorProfilePage'
import TrendingPage from './pages/TrendingPage'
import CollectionListPage from './pages/CollectionListPage'
import CollectionDetailPage from './pages/CollectionDetailPage'
import DraftsPage from './pages/DraftsPage'

const App = () => {
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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
        element={<NoteDetailPage user={user} />} 
      />
      <Route
        path="/profile/:username"
        element={<AuthorProfilePage currentUser={user} />}
      />
      <Route
        path="/trending"
        element={<TrendingPage user={user} />}
      />
      <Route
        path="/collections"
        element={<CollectionListPage user={user} />}
      />
      <Route
        path="/collections/:id"
        element={<CollectionDetailPage user={user} />}
      />
      <Route
        path="/drafts"
        element={<DraftsPage user={user} />}
      />
    </Routes>
  )
}

export default App