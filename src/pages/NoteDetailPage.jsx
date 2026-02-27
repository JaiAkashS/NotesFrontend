import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import NoteDetail from '../components/NoteDetail'
import Footer from '../components/Footer'
import notesService from '../services/notesService'

const NoteDetailPage = ({ user }) => {
  const { id } = useParams()
  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    notesService.getNote(id)
      .then(data => { setNote(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="px-6 pt-8"><p className="text-[#999]">Loading...</p></div>
  }

  if (!note) {
    return (
      <div className="px-6 pt-8">
        <p className="text-[#999]">Note not found.</p>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <NoteDetail note={note} user={user} />
      <Footer />
    </div>
  )
}

export default NoteDetailPage
