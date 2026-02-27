import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import notesService from '../services/notesService'
import Footer from '../components/Footer'

const CollectionListPage = ({ user }) => {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    notesService.getCollections().then(setCollections).finally(() => setLoading(false))
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    const col = await notesService.createCollection({ name: newName, description: newDesc })
    setCollections([col, ...collections])
    setNewName(''); setNewDesc(''); setCreating(false)
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    await notesService.deleteCollection(id)
    setCollections(collections.filter(c => c.id !== id))
  }

  const inputCls = 'w-full px-3 py-2 border border-[#eaeaea] rounded-md text-[13px] text-[#111] bg-white focus:outline-none focus:border-[#111] transition-colors'

  return (
    <div className="px-6 pt-8 pb-24">
      <Helmet>
        <title>Collections — LiminalPress</title>
        <meta name="description" content="Browse curated post collections on LiminalPress." />
      </Helmet>

      <button className="back-button mb-6" onClick={() => navigate('/')}>← Back</button>
      <h1 className="font-serif text-2xl font-bold mb-1">Collections</h1>
      <p className="text-[13px] text-[#999] mb-7">Curated series and groups of posts</p>

      {user && !creating && (
        <button className="btn btn-ghost btn-sm mb-6" onClick={() => setCreating(true)}>+ New Collection</button>
      )}

      {creating && (
        <div className="bg-white border border-[#eaeaea] rounded-xl p-5 mb-6">
          <h3 className="font-serif text-lg font-bold mb-4">New Collection</h3>
          <form onSubmit={handleCreate} className="flex flex-col gap-3">
            <input type="text" placeholder="Collection name" value={newName}
              onChange={e => setNewName(e.target.value)} required minLength={3} className={inputCls} />
            <textarea placeholder="Description (optional)" value={newDesc}
              onChange={e => setNewDesc(e.target.value)} rows={2} className={inputCls} />
            <div className="flex gap-2">
              <button type="submit" className="btn btn-sm">Create</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setCreating(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-[13px] text-[#999]">Loading...</p>
      ) : collections.length === 0 ? (
        <p className="text-[13px] text-[#999]">No collections yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {collections.map(col => (
            <div
              key={col.id}
              className="bg-white border border-[#eaeaea] rounded-xl p-5 cursor-pointer hover:border-[#ccc] transition-colors"
              onClick={() => navigate(`/collections/${col.id}`)}
            >
              <h3 className="font-serif text-[1.05rem] font-bold text-[#111] mb-1">{col.name}</h3>
              {col.description && (
                <p className="text-[13px] text-[#666] mb-3 line-clamp-2">{col.description}</p>
              )}
              <div className="flex items-center justify-between mt-2 text-[12px] text-[#999]">
                <span>{col.posts?.length ?? 0} posts</span>
                <div className="flex items-center gap-2">
                  {col.author && (
                    <Link to={`/profile/${col.author.username}`}
                      className="hover:text-[#111] transition-colors"
                      onClick={e => e.stopPropagation()}>
                      {col.author.name || col.author.username}
                    </Link>
                  )}
                  {user && col.author?.username === user.username && (
                    <button
                      className="text-red-400 hover:text-red-600 transition-colors text-[11px] border-0 bg-transparent p-0 cursor-pointer"
                      onClick={e => handleDelete(col.id, e)}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <Footer />
    </div>
  )
}

export default CollectionListPage
