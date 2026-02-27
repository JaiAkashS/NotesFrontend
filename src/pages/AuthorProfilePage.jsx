import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaTwitter, FaFacebook, FaLinkedin, FaGlobe } from 'react-icons/fa'
import notesService from '../services/notesService'

const AuthorProfilePage = ({ currentUser }) => {
  const { username } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState('')
  const [socialLinks, setSocialLinks] = useState({ twitter: '', facebook: '', linkedin: '', website: '' })
  const [error, setError] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [followersCount, setFollowersCount] = useState(0)
  const [followLoading, setFollowLoading] = useState(false)

  const isOwner = currentUser?.username === username

  useEffect(() => {
    notesService.getProfile(username)
      .then(data => {
        setProfile(data)
        setBio(data.bio || '')
        setSocialLinks(data.socialLinks || { twitter: '', facebook: '', linkedin: '', website: '' })
        setIsFollowing(data.isFollowing || false)
        setFollowersCount(data.followersCount || 0)
      })
      .catch(() => setError('Profile not found'))
  }, [username])

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    const updated = await notesService.updateProfile(username, { bio, socialLinks })
    setProfile(updated)
    setEditing(false)
  }

  const handleFollow = async () => {
    if (!currentUser) return
    setFollowLoading(true)
    try {
      const r = await notesService.followUser(username)
      setIsFollowing(r.following)
      setFollowersCount(r.followersCount)
    } catch (e) { console.error(e) } finally { setFollowLoading(false) }
  }

  const inputCls = 'w-full px-3 py-2 border border-[#eaeaea] rounded-md text-[13px] text-[#111] bg-white focus:outline-none focus:border-[#111] transition-colors'
  const labelCls = 'block text-[11px] font-semibold text-[#999] uppercase tracking-wider mb-1 mt-3'

  if (error) return <div className="px-6 pt-8"><p className="text-[#999]">{error}</p></div>
  if (!profile) return <div className="px-6 pt-8"><p className="text-[#999]">Loading...</p></div>

  return (
    <div className="px-6 pt-8 pb-24">
      <button className="back-button mb-8" onClick={() => navigate('/')}>← Back</button>

      {/* Profile header */}
      <div className="flex items-center gap-5 mb-6">
        <div className="w-16 h-16 rounded-full bg-[#111] text-white text-2xl font-bold flex items-center justify-center flex-shrink-0 font-serif">
          {profile.name?.charAt(0).toUpperCase() || profile.username?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#111]">{profile.name}</h1>
          <p className="text-[13px] text-[#999] mt-0.5">@{profile.username}</p>
          <p className="text-[12px] text-[#999] mt-1">{followersCount} followers</p>
        </div>
      </div>

      {/* Follow button */}
      {currentUser && !isOwner && (
        <button
          className={`btn btn-sm mb-6 ${isFollowing ? 'btn-ghost' : ''}`}
          onClick={handleFollow}
          disabled={followLoading}
        >
          {followLoading ? '...' : isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      )}

      {editing ? (
        <form onSubmit={handleSaveProfile} className="bg-white border border-[#eaeaea] rounded-xl p-5 mb-8">
          <label className={labelCls}>Bio</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
            placeholder="Tell readers about yourself..." className={inputCls} />
          <label className={labelCls}>Twitter URL</label>
          <input type="url" value={socialLinks.twitter}
            onChange={e => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
            placeholder="https://twitter.com/..." className={inputCls} />
          <label className={labelCls}>Facebook URL</label>
          <input type="url" value={socialLinks.facebook}
            onChange={e => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
            placeholder="https://facebook.com/..." className={inputCls} />
          <label className={labelCls}>LinkedIn URL</label>
          <input type="url" value={socialLinks.linkedin}
            onChange={e => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
            placeholder="https://linkedin.com/in/..." className={inputCls} />
          <label className={labelCls}>Website</label>
          <input type="url" value={socialLinks.website}
            onChange={e => setSocialLinks({ ...socialLinks, website: e.target.value })}
            placeholder="https://yoursite.com" className={inputCls} />
          <div className="flex gap-2 mt-4">
            <button type="submit" className="btn">Save</button>
            <button type="button" className="btn btn-ghost" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="mb-8">
          <p className="text-[14px] text-[#444] leading-relaxed mb-4">{profile.bio || 'No bio yet.'}</p>
          <div className="flex gap-3 mb-4">
            {profile.socialLinks?.twitter && (
              <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer"
                className="text-[#1da1f2] text-lg hover:opacity-75 transition-opacity"><FaTwitter /></a>
            )}
            {profile.socialLinks?.facebook && (
              <a href={profile.socialLinks.facebook} target="_blank" rel="noreferrer"
                className="text-[#1877f2] text-lg hover:opacity-75 transition-opacity"><FaFacebook /></a>
            )}
            {profile.socialLinks?.linkedin && (
              <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer"
                className="text-[#0a66c2] text-lg hover:opacity-75 transition-opacity"><FaLinkedin /></a>
            )}
            {profile.socialLinks?.website && (
              <a href={profile.socialLinks.website} target="_blank" rel="noreferrer"
                className="text-[#999] text-lg hover:text-[#111] transition-colors"><FaGlobe /></a>
            )}
          </div>
          {isOwner && <button className="btn btn-ghost btn-sm" onClick={() => setEditing(true)}>Edit Profile</button>}
        </div>
      )}

      {/* Posts */}
      <div>
        <h2 className="font-serif text-xl font-bold mb-5">Posts by {profile.name || profile.username}</h2>
        {profile.notes?.length === 0 ? (
          <p className="text-[13px] text-[#999]">No posts yet.</p>
        ) : (
          <ul>
            {profile.notes?.map(note => (
              <li
                key={note.id}
                className="border-b border-[#eaeaea] py-4 cursor-pointer first:border-t hover:bg-white/60 transition-colors"
                onClick={() => navigate(`/notes/${note.id}`)}
              >
                <h3 className="font-serif text-[1.05rem] font-bold text-[#111] mb-1 hover:text-[#FF6719] transition-colors">
                  {note.title}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {note.category && (
                    <span className="text-[#FF6719] text-[11px] font-semibold uppercase tracking-wider">{note.category}</span>
                  )}
                  {note.tags?.map(tag => (
                    <span key={tag} className="bg-[#f3f3f3] text-[#999] px-2 py-0.5 rounded text-[11px]">{tag}</span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default AuthorProfilePage
