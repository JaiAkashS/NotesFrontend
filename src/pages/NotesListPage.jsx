import Note from '../components/Note'
import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import noteService from '../services/notesService.js'
import Notification from '../components/Notification'
import LoginForm from '../components/LoginForm'
import NoteForm from '../components/NoteForm'
import Togglable from '../components/Togglable.jsx'
import Footer from '../components/Footer'
import NotificationBell from '../components/NotificationBell'

const CATEGORIES = ['General','Technology','Science','Arts','Culture','Politics','Health','Travel','Food','Other']

const NotesListPage = ({ user, setUser, errorMessage, setErrorMessage }) => {
  const navigate = useNavigate()
  const [notes, setNotes] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [activeTab, setActiveTab] = useState('latest')
  const [history, setHistory] = useState([])
  const [query, setQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterAuthor, setFilterAuthor] = useState('')
  const [filterTag, setFilterTag] = useState('')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const noteFormRef = useRef()

  // Load initial notes for active tab
  useEffect(() => {
    setNotes([])
    setPage(1)
    setHasMore(false)
    setSearchResults(null)
    loadNotes(1, true)
  }, [activeTab])

  // Load reading history when user logs in
  useEffect(() => {
    if (user) {
      noteService.getHistory().then(setHistory).catch(() => {})
    } else {
      setHistory([])
    }
  }, [user])

  const loadNotes = async (pageNum, replace = false) => {
    setLoadingMore(true)
    try {
      let data
      if (activeTab === 'following' && user) {
        data = await noteService.getFollowingFeed(pageNum)
      } else {
        data = await noteService.getAll(pageNum)
      }
      const newNotes = data.notes || []
      setNotes(prev => replace ? newNotes : [...prev, ...newNotes])
      setPage(data.page || pageNum)
      setHasMore(data.hasMore || false)
    } catch (e) { console.error(e) } finally { setLoadingMore(false) }
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    loadNotes(nextPage, false)
  }

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService.create(noteObject).then(returnedNote => {
      if (!returnedNote.isDraft) {
        setNotes(prev => [returnedNote, ...prev])
      }
    })
  }

  const notesToShow = searchResults !== null ? searchResults : notes

  const hasActiveFilters = filterCategory || filterAuthor || filterTag || filterFrom || filterTo

  const handleAdvancedSearch = async (e) => {
    e.preventDefault()
    const params = {}
    if (query.trim()) params.q = query.trim()
    if (filterAuthor.trim()) params.author = filterAuthor.trim()
    if (filterCategory) params.category = filterCategory
    if (filterTag.trim()) params.tag = filterTag.trim()
    if (filterFrom) params.from = filterFrom
    if (filterTo) params.to = filterTo
    setSearchResults(await noteService.search(params))
  }

  const handleClearSearch = () => {
    setQuery(''); setFilterCategory(''); setFilterAuthor('')
    setFilterTag(''); setFilterFrom(''); setFilterTo('')
    setSearchResults(null)
  }

  const handleNotInterested = async (noteId) => {
    try {
      await noteService.makeReaction(noteId, 'not-interested')
      setNotes(notes.filter(n => n.id !== noteId))
    } catch (e) { console.error(e) }
  }

  const inputCls = 'px-3 py-[7px] border border-[#eaeaea] rounded-md text-[13px] text-[#111] bg-white focus:outline-none focus:border-[#111] transition-colors'

  return (
    <div>
      {/* Topbar */}
      <header className="sticky top-0 z-50 h-[52px] bg-[#f8f8f8]/95 backdrop-blur-sm border-b border-[#eaeaea] flex items-center px-8 gap-0">
        <a href="/" className="font-serif text-[1.05rem] font-bold text-[#111] no-underline flex-shrink-0 mr-6">
          Liminal<span className="text-[#FF6719]">Press</span>
        </a>
        <nav className="flex gap-0.5 flex-1 items-center">
          <button
            onClick={() => setActiveTab('latest')}
            className={`feed-nav-link ${activeTab === 'latest' ? 'active' : ''}`}
          >Latest</button>
          {user && (
            <button
              onClick={() => setActiveTab('following')}
              className={`feed-nav-link ${activeTab === 'following' ? 'active' : ''}`}
            >Following</button>
          )}
          <Link to="/trending" className="feed-nav-link">🔥 Trending</Link>
          <Link to="/collections" className="feed-nav-link">📚 Collections</Link>
        </nav>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          {!user && (
            <Togglable buttonLabel="Login">
              <LoginForm user={user} setUser={setUser}
                errorMessage={errorMessage} setErrorMessage={setErrorMessage} />
            </Togglable>
          )}
          {user && (
            <>
              <NotificationBell token={user.token} />
              <span className="text-xs text-[#999] font-medium">{user.name}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/notes/saved')}>Saved</button>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/drafts')}>Drafts</button>
              <button className="btn btn-ghost btn-sm" onClick={() => { window.localStorage.removeItem('loggedNoteAppUser'); setUser(null) }}>Log out</button>
            </>
          )}
        </div>
      </header>

      <div className="px-6 pt-7 pb-24">
        <Notification message={errorMessage} />

        {/* Reading history */}
        {user && history.length > 0 && (
          <div className="mb-6 p-4 bg-white border border-[#eaeaea] rounded-xl">
            <h3 className="text-[11px] font-semibold text-[#999] uppercase tracking-wider mb-3">Continue Reading</h3>
            <div className="flex gap-3 flex-wrap">
              {history.slice(0, 5).map(item => {
                const n = item.note || item
                if (!n || !n.id) return null
                return (
                  <button key={n.id}
                    className="text-[12px] text-[#444] bg-[#f3f3f3] px-2.5 py-1.5 rounded hover:bg-[#eaeaea] transition-colors text-left line-clamp-1 max-w-[180px]"
                    onClick={() => navigate(`/notes/${n.id}`)}>
                    {n.title}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Search bar */}
        <form onSubmit={handleAdvancedSearch} className="flex gap-2 mb-3 flex-wrap">
          <input type="text" name="search" placeholder="Search posts..."
            value={query} onChange={e => setQuery(e.target.value)}
            className={`${inputCls} flex-1 min-w-[180px]`} />
          <button type="submit" className="btn btn-sm">Search</button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? 'Hide Filters' : 'Filters'}
          </button>
          {(searchResults !== null || hasActiveFilters) && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={handleClearSearch}>Clear</button>
          )}
        </form>

        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-4 p-4 bg-white border border-[#eaeaea] rounded-xl">
            <input type="text" placeholder="Author" value={filterAuthor}
              onChange={e => setFilterAuthor(e.target.value)} className={inputCls} />
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className={inputCls}>
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="text" placeholder="Tag" value={filterTag}
              onChange={e => setFilterTag(e.target.value)} className={inputCls} />
            <label className="flex items-center gap-1.5 text-[12px] text-[#999]">
              From: <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} className={inputCls} />
            </label>
            <label className="flex items-center gap-1.5 text-[12px] text-[#999]">
              To: <input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)} className={inputCls} />
            </label>
          </div>
        )}

        {user && (
          <div className="mb-4">
            <Togglable buttonLabel="✍️ New Post" ref={noteFormRef}>
              <NoteForm createNote={addNote} />
            </Togglable>
          </div>
        )}

        {/* Tab label */}
        {searchResults !== null && (
          <p className="text-[12px] text-[#999] mb-3">{searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found</p>
        )}

        <ul>
          {notesToShow.map(note =>
            <Note key={note.id} note={note} handleNotInterested={user ? handleNotInterested : null} />
          )}
        </ul>

        {notesToShow.length === 0 && !loadingMore && (
          <p className="text-[13px] text-[#999] py-8 text-center">
            {activeTab === 'following' ? 'Follow some authors to see their posts here.' : 'No posts yet.'}
          </p>
        )}

        {/* Load more */}
        {searchResults === null && hasMore && (
          <div className="flex justify-center mt-8">
            <button
              className="btn btn-ghost"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading...' : 'Load more'}
            </button>
          </div>
        )}

        {loadingMore && notes.length === 0 && (
          <p className="text-[13px] text-[#999] py-8 text-center">Loading...</p>
        )}

        <Footer />
      </div>
    </div>
  )
}

export default NotesListPage
