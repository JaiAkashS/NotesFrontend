import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import {
  FaThumbsUp, FaThumbsDown, FaRegThumbsUp, FaRegThumbsDown,
  FaBookmark, FaRegBookmark, FaTwitter, FaFacebook, FaLinkedin, FaEye
} from 'react-icons/fa'
import notesService from '../services/notesService'
import CommentSection from './CommentSection'

const NoteDetail = ({ note, user }) => {
  const navigate = useNavigate()
  const [reaction, setReaction] = useState(null)
  const [isSaved, setIsSaved] = useState(false)
  const [likesCount, setLikesCount] = useState(note.likes?.length || 0)
  const [dislikesCount, setDislikesCount] = useState(note.dislikes?.length || 0)
  const [progress, setProgress] = useState(0)

  const pageUrl = encodeURIComponent(window.location.href)
  const pageTitle = encodeURIComponent(note.title || '')
  const plainContent = note.content?.replace(/<[^>]+>/g, '').slice(0, 160) || ''
  const canonicalUrl = window.location.href
  const wordCount = note.content?.replace(/<[^>]+>/g, '').split(/\s+/).length || 0
  const readingTime = Math.max(1, Math.round(wordCount / 200))

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? (el.scrollTop / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUser && note.likes && note.dislikes) {
      const u = JSON.parse(loggedUser)
      if (note.likes.includes(u.id)) setReaction('like')
      else if (note.dislikes.includes(u.id)) setReaction('dislike')
    }
  }, [note])

  const handleLike = async () => {
    try {
      const r = await notesService.makeReaction(note.id, 'like')
      if (r) { setLikesCount(r.likes); setDislikesCount(r.dislikes); setReaction(r.userReaction === 'like' ? 'like' : null) }
    } catch (e) { console.error(e) }
  }

  const handleDislike = async () => {
    try {
      const r = await notesService.makeReaction(note.id, 'dislike')
      if (r) { setLikesCount(r.likes); setDislikesCount(r.dislikes); setReaction(r.userReaction === 'dislike' ? 'dislike' : null) }
    } catch (e) { console.error(e) }
  }

  const handleSaveNote = async () => {
    try {
      const r = await notesService.saveNote(note.id)
      if (r) setIsSaved(r.isSaved)
    } catch (e) { console.error(e) }
  }

  return (
    <div className="px-6 pt-8 pb-16">
      <Helmet>
        <title>{note.title} — LiminalPress</title>
        <meta name="description" content={plainContent} />
        <meta property="og:title" content={note.title} />
        <meta property="og:description" content={plainContent} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="LiminalPress" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={note.title} />
        <meta name="twitter:description" content={plainContent} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>

      <div className="reading-progress" style={{ width: `${progress}%` }} />

      <button className="back-button mb-9" onClick={() => navigate('/')}>← Back</button>

      <article className="fade-up">
        {note.category && (
          <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#FF6719] mb-3.5">
            {note.category}
          </span>
        )}

        <h1 className="font-serif text-[2.7rem] font-extrabold leading-[1.1] tracking-tight text-[#111] mb-7">
          {note.title}
        </h1>

        {note.user && (
          <div className="flex items-center gap-3 mb-5">
            <Link
              to={`/profile/${note.user.username}`}
              className="w-9 h-9 rounded-full bg-[#111] text-white text-[0.9rem] font-semibold flex items-center justify-center flex-shrink-0 no-underline"
            >
              {(note.user.name || note.user.username)[0].toUpperCase()}
            </Link>
            <div className="flex flex-col gap-px">
              <Link
                to={`/profile/${note.user.username}`}
                className="text-[13.5px] font-medium text-[#111] hover:text-[#FF6719] transition-colors no-underline"
              >
                {note.user.name || note.user.username}
              </Link>
              <span className="text-xs text-[#999]">{readingTime} min read</span>
            </div>
          </div>
        )}

        <hr className="border-0 border-t border-[#eaeaea] mb-9" />

        {note.coverImage && (
          <img
            src={note.coverImage}
            alt="cover"
            className="w-full max-h-72 object-cover rounded-xl mb-8 border border-[#eaeaea]"
          />
        )}

        <div className="article-prose" dangerouslySetInnerHTML={{ __html: note.content }} />

        {/* Article footer: reactions + share */}
        <div className="border-t border-[#eaeaea] pt-5 flex items-center justify-between flex-wrap gap-3.5 mb-12">
          <div className="flex gap-2 items-center flex-wrap">
            <button className={`reaction-btn ${reaction === 'like' ? 'liked' : ''}`} onClick={handleLike} aria-label="Like">
              {reaction === 'like' ? <FaThumbsUp /> : <FaRegThumbsUp />}
              <span className="font-semibold text-xs">{likesCount}</span>
            </button>
            <button className={`reaction-btn ${reaction === 'dislike' ? 'disliked' : ''}`} onClick={handleDislike} aria-label="Dislike">
              {reaction === 'dislike' ? <FaThumbsDown /> : <FaRegThumbsDown />}
              <span className="font-semibold text-xs">{dislikesCount}</span>
            </button>
            <button className={`reaction-btn ${isSaved ? 'saved' : ''}`} onClick={handleSaveNote} aria-label="Save">
              {isSaved ? <FaBookmark /> : <FaRegBookmark />}
              <span className="font-semibold text-xs">{isSaved ? 'Saved' : 'Save'}</span>
            </button>
            <span className="inline-flex items-center gap-1 text-[#999] text-xs">
              <FaEye /> {note.views ?? 0}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-medium text-[#999] uppercase tracking-wider">Share</span>
            <a href={`https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`}
              target="_blank" rel="noreferrer" aria-label="Share on Twitter"
              className="w-7 h-7 rounded-full flex items-center justify-center text-[13px] text-white bg-[#1da1f2] hover:opacity-75 transition-opacity">
              <FaTwitter />
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`}
              target="_blank" rel="noreferrer" aria-label="Share on Facebook"
              className="w-7 h-7 rounded-full flex items-center justify-center text-[13px] text-white bg-[#1877f2] hover:opacity-75 transition-opacity">
              <FaFacebook />
            </a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`}
              target="_blank" rel="noreferrer" aria-label="Share on LinkedIn"
              className="w-7 h-7 rounded-full flex items-center justify-center text-[13px] text-white bg-[#0a66c2] hover:opacity-75 transition-opacity">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </article>

      <CommentSection noteId={note.id} user={user} />
    </div>
  )
}

export default NoteDetail
