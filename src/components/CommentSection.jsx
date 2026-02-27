import { useState, useEffect } from 'react'
import notesService from '../services/notesService'

const CommentItem = ({ comment, noteId, user, onDelete, onReply }) => {
  const [showReply, setShowReply] = useState(false)
  const [replyContent, setReplyContent] = useState('')

  const handleReplySubmit = async (e) => {
    e.preventDefault()
    if (!replyContent.trim()) return
    await onReply(replyContent, comment.id)
    setReplyContent('')
    setShowReply(false)
  }

  const isOwner = user && comment.author?.username === user.username

  return (
    <div className={`border-l-2 border-[#eaeaea] pl-3.5 py-2.5 ${comment.parentComment ? 'ml-6 border-[#f0f0f0]' : ''}`}>
      <div className="flex items-center gap-2 mb-1">
        <a href={`/profile/${comment.author?.username}`}
          className="text-[13px] font-semibold text-[#111] hover:text-[#FF6719] transition-colors no-underline">
          {comment.author?.name || comment.author?.username}
        </a>
        <span className="text-[11px] text-[#999]">
          {new Date(comment.createdAt).toLocaleDateString()}
        </span>
      </div>
      <p className="text-[13.5px] text-[#444] leading-relaxed mb-2">{comment.content}</p>
      <div className="flex gap-1">
        {user && !comment.parentComment && (
          <button className="comment-action-btn" onClick={() => setShowReply(!showReply)}>
            {showReply ? 'Cancel' : 'Reply'}
          </button>
        )}
        {isOwner && (
          <button className="comment-action-btn danger" onClick={() => onDelete(comment.id)}>Delete</button>
        )}
      </div>
      {showReply && (
        <form onSubmit={handleReplySubmit} className="flex gap-2 mt-2">
          <input type="text" value={replyContent}
            onChange={e => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
            required
            className="flex-1 px-3 py-1.5 border border-[#eaeaea] rounded-md text-[13px] text-[#111] focus:outline-none focus:border-[#111] transition-colors" />
          <button type="submit" className="btn btn-sm">Post</button>
        </form>
      )}
    </div>
  )
}

const CommentSection = ({ noteId, user }) => {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    notesService.getComments(noteId)
      .then(setComments)
      .finally(() => setLoading(false))
  }, [noteId])

  const topLevel = comments.filter(c => !c.parentComment)
  const replies = (parentId) => comments.filter(c => c.parentComment === parentId)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    const added = await notesService.addComment(noteId, newComment)
    setComments([...comments, added])
    setNewComment('')
  }

  const handleReply = async (content, parentComment) => {
    const added = await notesService.addComment(noteId, content, parentComment)
    setComments([...comments, added])
  }

  const handleDelete = async (commentId) => {
    await notesService.deleteComment(noteId, commentId)
    setComments(comments.filter(c => c.id !== commentId && c.parentComment !== commentId))
  }

  return (
    <div className="border-t border-[#eaeaea] pt-8 mt-2">
      <h3 className="font-serif text-[1.4rem] font-bold mb-6 text-[#111]">
        Discussion ({comments.length})
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            required
            className="w-full px-3 py-2 border border-[#eaeaea] rounded-md text-[13px] text-[#111] resize-y focus:outline-none focus:border-[#111] transition-colors mb-2"
          />
          <div className="flex justify-end">
            <button type="submit" className="btn btn-sm">Post Comment</button>
          </div>
        </form>
      ) : (
        <p className="text-[13px] text-[#999] mb-6">Log in to leave a comment.</p>
      )}

      {loading ? (
        <p className="text-[13px] text-[#999]">Loading comments...</p>
      ) : topLevel.length === 0 ? (
        <p className="text-[13px] text-[#999]">No comments yet. Be the first!</p>
      ) : (
        <div className="flex flex-col gap-4">
          {topLevel.map(comment => (
            <div key={comment.id}>
              <CommentItem comment={comment} noteId={noteId} user={user}
                onDelete={handleDelete} onReply={handleReply} />
              {replies(comment.id).map(reply => (
                <CommentItem key={reply.id} comment={reply} noteId={noteId} user={user}
                  onDelete={handleDelete} onReply={handleReply} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentSection
