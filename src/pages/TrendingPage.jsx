import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FaThumbsUp, FaEye, FaFire } from 'react-icons/fa'
import notesService from '../services/notesService'
import Footer from '../components/Footer'

const TrendingPage = ({ user }) => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    notesService.getTrending().then(setPosts).finally(() => setLoading(false))
  }, [])

  return (
    <div className="px-6 pt-8 pb-24">
      <Helmet>
        <title>Trending — LiminalPress</title>
        <meta name="description" content="The most-liked posts on LiminalPress this week." />
      </Helmet>

      <button className="back-button mb-6" onClick={() => navigate('/')}>← Back</button>

      <h1 className="font-serif text-2xl font-bold mb-1 flex items-center gap-2">
        <FaFire className="text-red-500" /> Trending This Week
      </h1>
      <p className="text-[13px] text-[#999] mb-8">The most liked posts from the last 7 days</p>

      {loading ? (
        <p className="text-[13px] text-[#999]">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-[13px] text-[#999]">No trending posts yet. Check back soon!</p>
      ) : (
        <ol className="flex flex-col gap-0">
          {posts.map((post, index) => (
            <li
              key={post.id}
              className="flex items-start gap-4 border-b border-[#eaeaea] py-4 cursor-pointer hover:bg-white/60 transition-colors px-2 -mx-2 rounded-lg first:border-t"
              onClick={() => navigate(`/notes/${post.id}`)}
            >
              <span className="text-[1.5rem] font-bold text-[#eaeaea] font-serif w-8 text-right flex-shrink-0 pt-0.5">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-[1.05rem] font-bold text-[#111] leading-snug mb-1 hover:text-[#FF6719] transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center gap-3 flex-wrap">
                  {post.user && (
                    <Link to={`/profile/${post.user.username}`}
                      className="text-xs text-[#999] hover:text-[#111] transition-colors"
                      onClick={e => e.stopPropagation()}>
                      {post.user.name || post.user.username}
                    </Link>
                  )}
                  {post.category && (
                    <span className="text-[#FF6719] text-[11px] font-semibold uppercase tracking-wider">{post.category}</span>
                  )}
                  <span className="inline-flex items-center gap-1 text-[12px] text-[#999]">
                    <FaThumbsUp className="text-[10px]" /> {post.likes?.length ?? 0}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[12px] text-[#999]">
                    <FaEye className="text-[10px]" /> {post.views ?? 0}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
      <Footer />
    </div>
  )
}

export default TrendingPage
