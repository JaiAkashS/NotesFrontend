import { useParams } from 'react-router-dom'
import NoteDetail from '../components/NoteDetail'
import Footer from '../components/Footer'

const NoteDetailPage = ({ notes }) => {
  const { id } = useParams()
  const note = notes.find(n => n.id === id)

  if (!note) {
    return <div><p>Note not found</p><Footer /></div>
  }

  return (
    <div>
      <NoteDetail note={note} />
      <Footer />
    </div>
  )
}

export default NoteDetailPage
