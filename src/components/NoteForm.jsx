import { useState } from 'react'

const noteForm = ({ createNote }) => {
  const [newNote,setNewNote] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tagsarray, setTags] = useState([])
  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      tags:tagsarray
    })
    setNewNote('')
  }
  const handleTagKeyDown = (e) => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()

    const tag = tagInput.trim().toLowerCase()
    if (tag === '') return
    if (tagsarray.includes(tag)) return

    setTags([...tagsarray, tag])
    setTagInput('')
  }
}
  const removeTag = (tagToRemove) => {
    setTags(tagsarray.filter(tag => tag !== tagToRemove))
  }
  return(
    <div className='formDiv'>
      <h2>Create a New Note</h2>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={(event) => {setNewNote(event.target.value)}}
        />
        <div className="tags">
            {tagsarray.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
                <button onClick={() => removeTag(tag)}>×</button>
              </span>
            ))}
        </div>
        <input
          type="text"
          placeholder="Add a tag and press Enter"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
        />

        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default noteForm