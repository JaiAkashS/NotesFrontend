import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import notesService from '../services/notesService'
import Footer from '../components/Footer'

const CollectionDetailPage = ({ user }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [collection, setCollection] = useState(null)
  const [allNotes, setAllNotes] = useState([])
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [addingPost, setAddingPost] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState('')

  useEffect(() => {
    notesService.getCollection(id).then(col => {
      setCollection(col); setEditName(col.name); setEditDesc(col.description || '')
    })
    notesService.getAll(1, 100).then(data => setAllNotes(data.notes || []))
  }, [id])

  const isOwner = user && collection?.author?.username === user.username
  const postsInCollection = collection?.posts?.map(p => p.id) || []
  const availablePosts = allNotes.filter(n => !postsInCollection.includes(n.id))

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    await notesService.updateCollection(id, { name: editName, description: editDesc })
    setCollection({ ...collection, name: editName, description: editDesc })
    setEditing(false)
  }

  const handleRemovePost = async (postId) => {
    await notesService.removePostFromCollection(id, postId)
    setCollection({ ...collection, posts: collection.posts.filter(p => p.id !== postId) })
  }

  const handleAddPost = async (e) => {
    e.preventDefault()
    if (!selectedPostId) return
    await notesService.addPostToCollection(id, selectedPostId)
    const fresh = await notesService.getCollection(id)
    setCollection(fresh); setSelectedPostId(''); setAddingPost(false)
  }

  const inputCls = 'w-full px-3 py-2 border border-[#eaeaea] rounded-md text-[13px] text-[#111] bg-white focus:outline-none focus:border-[#111] transition-colors'

  if (!collection) return <div className="px-6 pt-8"><p className="text-[#999]">Loading...</p></div>

  return (
    <div className="px-6 pt-8 pb-24">
      <Helmet>
        <title>{collection.name} — LiminalPress</title>
        <meta name="description" content={collection.description || 'A curated collection on LiminalPress'} />
      </Helmet>

      <button className="back-button mb-6" onClick={() => navigate('/collections')}>← Collections</button>

      {editing ? (
        <form onSubmit={handleSaveEdit} className="bg-white border border-[#eaeaea] rounded-xl p-5 mb-6">
          <input value={editName} onChange={e => setEditName(e.target.value)} required minLength={3} className={`${inputCls} mb-3`} />
          <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={2}
            placeholder="Description" className={`${inputCls} mb-3`} />
          <div className="flex gap-2">
            <button type="submit" className="btn btn-sm">Save</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="mb-7">
          <h1 className="font-serif text-2xl font-bold text-[#111] mb-1">{collection.name}</h1>
          {collection.description && (
            <p className="text-[14px] text-[#666] mb-2">{collection.description}</p>
          )}
          <p className="text-[12px] text-[#999]">
            By{' '}
            <Link to={`/profile/${collection.author?.username}`}
              className="font-medium text-[#111] hover:text-[#FF6719] transition-colors">
              {collection.author?.name || collection.author?.username}
            </Link>
            {' '}· {collection.posts?.length ?? 0} posts
          </p>
          {isOwner && (
            <button className="btn btn-ghost btn-sm mt-3" onClick={() => setEditing(true)}>Edit Collection</button>
          )}
        </div>
      )}

      {isOwner && !addingPost && availablePosts.length > 0 && (
        <button className="btn btn-ghost btn-sm mb-5" onClick={() => setAddingPost(true)}>+ Add Post</button>
      )}

      {addingPost && (
        <div className="bg-white border border-[#eaeaea] rounded-xl p-4 mb-5">
          <form onSubmit={handleAddPost} className="flex gap-2 flex-wrap">
            <select value={selectedPostId} onChange={e => setSelectedPostId(e.target.value)}
              required className={`${inputCls} flex-1`}>
              <option value="">Select a post...</option>
              {availablePosts.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
            <button type="submit" className="btn btn-sm">Add</button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAddingPost(false)}>Cancel</button>
          </form>
        </div>
      )}

      {collection.posts?.length === 0 ? (
        <p className="text-[13px] text-[#999]">No posts in this collection yet.</p>
      ) : (
        <ul>
          {collection.posts?.map((post, i) => (
            <li key={post.id} className="flex items-start gap-4 border-b border-[#eaeaea] py-4 first:border-t">
              <span className="text-[1.1rem] font-bold text-[#eaeaea] font-serif w-6 flex-shrink-0 pt-0.5">{i + 1}</span>
              <div className="flex-1 cursor-pointer" onClick={() => navigate(`/notes/${post.id}`)}>
                <h3 className="font-serif text-[1.05rem] font-bold text-[#111] hover:text-[#FF6719] transition-colors mb-1">
                  {post.title}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {post.category && (
                    <span className="text-[#FF6719] text-[11px] font-semibold uppercase tracking-wider">{post.category}</span>
                  )}
                  {post.tags?.map(tag => (
                    <span key={tag} className="bg-[#f3f3f3] text-[#999] px-2 py-0.5 rounded text-[11px]">{tag}</span>
                  ))}
                </div>
              </div>
              {isOwner && (
                <button
                  className="text-[#999] hover:text-red-500 transition-colors text-[12px] border-0 bg-transparent cursor-pointer flex-shrink-0"
                  onClick={() => handleRemovePost(post.id)}>
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      <Footer />
    </div>
  )
}

export default CollectionDetailPage
