import Note from './components/Note'
import { useState,useEffect } from 'react'
import noteService from './services/notes.js'


const App = () => {
  const [notes,setNotes] = useState([])
  const [newNote,setNewNote] = useState("")
  const [showAll,setshowAll] = useState(true)
  
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {        
        setNotes(initialNotes)      })
  }, [])

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
  
    noteService
      .update(id, changedNote).then(returnedNote => {
        setNotes(notes.map(note => note.id === id ? returnedNote : note))
      })
  
      .catch(error => {
        console.log(error)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {  
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  console.log('render',notes.length)


    

  const handleNewNote = (event) =>{
    // console.log(event.target.value ,"has been entered!")
    setNewNote(event.target.value)
  }

  const notesToShow = showAll? notes : notes.filter(note => note.important === true)



  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={()=>{setshowAll(!showAll)}} >
            show {showAll? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
            <Note key = {note.id} note={note} toggleImportance={()=>toggleImportanceOf(note.id)}></Note>
        )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote}  onChange={handleNewNote}/>
        <button type='Submit'>save</button>
      </form>

    </div>
  )
}

export default App