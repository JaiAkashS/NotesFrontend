import { useNavigate, Link } from 'react-router-dom'

const Note = ({ note, handleNotInterested }) => {
  const navigate = useNavigate()
  const excerpt = note.content
    ? note.content.replace(/<[^>]+>/g, '').slice(0, 140).trim()
    : ''

  return (
    <li className="border-b border-[#eaeaea] py-5 first:border-t">
      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            {note.user && (
              <Link to={`/profile/${note.user.username}`} className="text-xs text-[#999] font-medium hover:text-[#111] transition-colors">
                {note.user.name || note.user.username}
              </Link>
            )}
            {note.category && note.category !== 'General' && (
              <span className="text-[#FF6719] text-[11px] font-semibold uppercase tracking-wider">
                {note.category}
              </span>
            )}
          </div>

          <h3
            className="font-serif text-[1.1rem] font-bold text-[#111] cursor-pointer leading-snug mb-1 hover:text-[#FF6719] transition-colors"
            onClick={() => navigate(`/notes/${note.id}`)}
          >
            {note.title}
          </h3>

          {excerpt && (
            <p className="text-[13.5px] text-neutral-500 leading-relaxed mb-2.5 line-clamp-2">
              {excerpt}{note.content?.replace(/<[^>]+>/g, '').length > 140 ? '\u2026' : ''}
            </p>
          )}

          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-1.5 flex-wrap">
              {note.tags?.map(tag => (
                <span key={tag} className="bg-[#f3f3f3] text-[#999] px-2 py-0.5 rounded text-[11px] font-medium">
                  {tag}
                </span>
              ))}
            </div>
            {handleNotInterested && (
              <button
                className="bg-transparent border-0 p-0 text-[11.5px] text-[#999] cursor-pointer hover:text-red-500 transition-colors"
                onClick={() => handleNotInterested(note.id)}
              >
                Not interested
              </button>
            )}
          </div>
        </div>

        {note.coverImage && (
          <img
            src={note.coverImage}
            alt="cover"
            className="w-24 h-16 object-cover rounded-md flex-shrink-0 border border-[#eaeaea] cursor-pointer"
            onClick={() => navigate(`/notes/${note.id}`)}
          />
        )}
      </div>
    </li>
  )
}

export default Note