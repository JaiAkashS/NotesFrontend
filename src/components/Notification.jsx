const Notification = ({ message }) => {
  if (!message) return null
  return (
    <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-[14px] font-medium mb-4">
      {message}
    </div>
  )
}

export default Notification