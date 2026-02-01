import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import notesService from '../services/notesService'
import Note from './Note'

function SavedNotes({ user }) {
  const navigate = useNavigate()
  const [savedNotes, setSavedNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }

    fetchSavedNotes()
  }, [user, navigate])

  const fetchSavedNotes = async () => {
    try {
      setLoading(true)
      const notes = await notesService.getSavedNotes()
      setSavedNotes(notes)
    } catch (error) {
      console.error('Failed to fetch saved notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Saved Notes</h1>
        <button onClick={handleBack}>← Back to Notes</button>
      </div>

      {loading ? (
        <p>Loading saved notes...</p>
      ) : savedNotes.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999', marginTop: '40px' }}>
          No saved notes yet. Bookmark notes to read later!
        </p>
      ) : (
        <ul>
          {savedNotes.map(note =>
            <Note key={note.id} note={note} />
          )}
        </ul>
      )}
    </div>
  )
}

export default SavedNotes
 