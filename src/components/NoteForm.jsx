import { useState, useRef } from 'react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import notesService from '../services/notesService'

const CATEGORIES = ['General','Technology','Science','Arts','Culture','Politics','Health','Travel','Food','Other']

const NoteForm = ({ createNote }) => {
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])
  const [category, setCategory] = useState('General')
  const [coverImage, setCoverImage] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef()

  const resetForm = () => {
    setContent(''); setTitle(''); setTags([]); setCategory('General')
    setCoverImage(null); setTagInput('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingImage(true)
    try {
      const { url } = await notesService.uploadImage(file)
      setCoverImage(url)
    } catch (err) {
      console.error('Image upload failed', err)
    } finally {
      setUploadingImage(false)
    }
  }

  const addNote = (e) => {
    e.preventDefault()
    createNote({ title, content, tags, category, coverImage, isDraft: false })
    resetForm()
  }

  const saveAsDraft = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    createNote({ title, content, tags, category, coverImage, isDraft: true })
    resetForm()
  }

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const t = tagInput.trim().toLowerCase()
      if (t && !tags.includes(t)) { setTags([...tags, t]); setTagInput('') }
    }
  }

  const inputCls = 'w-full px-3 py-2 border border-[#eaeaea] rounded-md text-[13px] text-[#111] bg-white focus:outline-none focus:border-[#111] transition-colors'

  return (
    <div>
      <h2 className="font-serif text-xl font-bold mb-4">Create a New Post</h2>
      <form className="flex flex-col gap-3.5">
        <input type="text" placeholder="Post Title" value={title}
          onChange={e => setTitle(e.target.value)} required className={inputCls} />

        <ReactQuill theme="snow" value={content} onChange={setContent}
          placeholder="Write your post content here..." />

        <select value={category} onChange={e => setCategory(e.target.value)} className={inputCls}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <div className="flex flex-col gap-2">
          {tags.length > 0 && (
            <div className="flex gap-1.5 flex-wrap">
              {tags.map((tag, i) => (
                <span key={i} className="inline-flex items-center gap-1 bg-[#f3f3f3] text-[#666] px-2 py-0.5 rounded text-[11px] font-medium">
                  {tag}
                  <button type="button" onClick={() => setTags(tags.filter(t => t !== tag))}
                    className="bg-transparent border-0 p-0 text-[#999] hover:text-[#111] cursor-pointer leading-none text-base">
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <input type="text" placeholder="Add a tag and press Enter"
            value={tagInput} onChange={e => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown} className={inputCls} />
        </div>

        {/* Cover image upload */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-[#999] uppercase tracking-wider">Cover Image</label>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange}
            className="text-[12px] text-[#666]" />
          {uploadingImage && <p className="text-[12px] text-[#FF6719]">Uploading...</p>}
          {coverImage && (
            <img src={coverImage} alt="cover preview"
              className="h-32 w-full object-cover rounded-md border border-[#eaeaea]" />
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <button type="submit" onClick={addNote} className="btn self-start">Publish Post</button>
          <button type="button" onClick={saveAsDraft}
            className="btn btn-ghost self-start">Save as Draft</button>
        </div>
      </form>
    </div>
  )
}

export default NoteForm
