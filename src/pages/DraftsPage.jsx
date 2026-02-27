import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import notesService from '../services/notesService'
import Footer from '../components/Footer'

const DraftsPage = ({ user }) => {
  const navigate = useNavigate()
  const [drafts, setDrafts] = useState([])
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(null)

  useEffect(() => {
    if (!user) { navigate('/'); return }
    notesService.getDrafts()
      .then(data => { setDrafts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [user])

  const handlePublish = async (id) => {
    setPublishing(id)
    try {
      await notesService.publishDraft(id)
      setDrafts(drafts.filter(d => d.id !== id))
    } catch (e) { console.error(e) } finally { setPublishing(null) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this draft?')) return
    try {
      await notesService.deleteNote(id)
      setDrafts(drafts.filter(d => d.id !== id))
    } catch (e) { console.error(e) }
  }

  return (
    <div className="px-6 pt-8 pb-24">
      <button className="back-button mb-8" onClick={() => navigate('/')}>← Back</button>
      <h1 className="font-serif text-2xl font-bold mb-6">My Drafts</h1>

      {loading && <p className="text-[#999] text-[13px]">Loading...</p>}
      {!loading && drafts.length === 0 && (
        <p className="text-[#999] text-[13px]">No drafts yet. Use "Save as Draft" when creating a post.</p>
      )}

      <ul>
        {drafts.map(draft => (
          <li key={draft.id} className="border-b border-[#eaeaea] py-5 first:border-t">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-serif text-[1.05rem] font-bold text-[#111] mb-1 line-clamp-2">
                  {draft.title || 'Untitled'}
                </h3>
                <p className="text-[12px] text-[#999]">
                  Last edited {new Date(draft.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  className="btn btn-sm"
                  onClick={() => handlePublish(draft.id)}
                  disabled={publishing === draft.id}
                >
                  {publishing === draft.id ? 'Publishing...' : 'Publish'}
                </button>
                <button
                  className="btn btn-ghost btn-sm text-red-400 hover:text-red-600"
                  onClick={() => handleDelete(draft.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <Footer />
    </div>
  )
}

export default DraftsPage
