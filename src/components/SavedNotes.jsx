import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import notesService from '../services/notesService'
import Note from './Note'

function SavedNotes({ user }) {
  const navigate = useNavigate()
  const [savedNotes, setSavedNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/'); return }
    notesService.getSavedNotes()
      .then(setSavedNotes)
      .catch(e => console.error(e))
      .finally(() => setLoading(false))
  }, [user, navigate])

  return (
    <div className="px-6 pt-8 pb-24">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl font-bold">Saved Posts</h1>
        <button className="back-button" onClick={() => navigate('/')}>← Back</button>
      </div>

      {loading ? (
        <p className="text-[13px] text-[#999]">Loading...</p>
      ) : savedNotes.length === 0 ? (
        <p className="text-center text-[#999] text-sm mt-10">
          No saved posts yet. Bookmark posts to read later!
        </p>
      ) : (
        <ul>
          {savedNotes.map(note => <Note key={note.id} note={note} />)}
        </ul>
      )}
    </div>
  )
}

export default SavedNotes
