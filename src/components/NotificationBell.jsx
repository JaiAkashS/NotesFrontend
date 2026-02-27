import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaBell } from 'react-icons/fa'
import notesService from '../services/notesService'

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef()
  const navigate = useNavigate()

  // Poll unread count every 30s
  useEffect(() => {
    const fetchCount = () => {
      notesService.getUnreadCount()
        .then(data => setUnreadCount(data.count || 0))
        .catch(() => {})
    }
    fetchCount()
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleToggle = async () => {
    if (!open) {
      setLoading(true)
      try {
        const data = await notesService.getNotifications()
        setNotifications(data)
        setUnreadCount(0)
      } catch (e) { console.error(e) } finally { setLoading(false) }
    }
    setOpen(prev => !prev)
  }

  const handleMarkAllRead = async () => {
    try {
      await notesService.markAllRead()
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
    } catch (e) { console.error(e) }
  }

  const typeLabel = (type) => type === 'reply' ? 'replied to your comment on' : 'commented on'

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative btn btn-ghost btn-sm p-1.5"
        onClick={handleToggle}
        aria-label="Notifications"
      >
        <FaBell className="text-[1rem]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-[#FF6719] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#eaeaea] rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#eaeaea]">
            <span className="text-[12px] font-semibold text-[#111]">Notifications</span>
            {notifications.some(n => !n.read) && (
              <button
                className="text-[11px] text-[#FF6719] hover:underline"
                onClick={handleMarkAllRead}
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading && (
              <p className="text-[12px] text-[#999] text-center py-6">Loading...</p>
            )}
            {!loading && notifications.length === 0 && (
              <p className="text-[12px] text-[#999] text-center py-6">No notifications yet.</p>
            )}
            {!loading && notifications.map(notif => (
              <div
                key={notif.id}
                className={`px-4 py-3 border-b border-[#f3f3f3] cursor-pointer hover:bg-[#fafafa] transition-colors ${!notif.read ? 'bg-[#fff8f5]' : ''}`}
                onClick={() => {
                  setOpen(false)
                  if (notif.note?.id) navigate(`/notes/${notif.note.id}`)
                }}
              >
                <p className="text-[12px] text-[#333] leading-snug">
                  <span className="font-semibold">{notif.actor?.name || notif.actor?.username || 'Someone'}</span>
                  {' '}{typeLabel(notif.type)}{' '}
                  <span className="text-[#FF6719] font-medium">
                    "{notif.note?.title || 'a post'}"
                  </span>
                </p>
                {!notif.read && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF6719] mt-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
