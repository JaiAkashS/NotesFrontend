import Note from './components/Note'
import { useState,useEffect,useRef } from 'react'
import noteService from './services/notesService.js'
import loginService from './services/loginService.js'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import Footer from './components/Footer'
import notesService from './services/notesService.js'
import Togglable from './components/Togglable.jsx'



const App = () => {
  const [notes,setNotes] = useState([])
  const [newNote,setNewNote] = useState("")
  const [showAll,setshowAll] = useState(true)
  const [user,setUser] = useState(null)
  const [errorMessage,setErrorMessage] = useState(null)

  const noteFormRef = useRef()

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {        
        setNotes(initialNotes)      })
  }, [])

  useEffect(()=>{
    const loggedUser = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUser){
      let user = JSON.parse(loggedUser)
      setUser(user)
      notesService.setToken(user.token)
    }
  },[])


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

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(noteObject)
      .then(returnedNote => {  
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  console.log('render',notes.length)

  const notesToShow = showAll? notes : notes.filter(note => note.important === true)


  const noteForm = ()=>{
    <Togglable buttonLabel='New Note' ref={noteFormRef}>
      <NoteForm 
        createNote={addNote}
      />
    </Togglable>
  }

  const loginForm = ()=>{
    return (
          <Togglable buttonLabel='Login'>
            <LoginForm
              user={user}
              setUser={setUser}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          </Togglable>
    )
  }


  const handleLogout = ()=>{
            console.log('clicked')
            window.localStorage.removeItem('loggedNoteAppUser')
            setUser(null)
  }
            

  return (
      <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user && loginForm()}
      {user && <div>
       <p>{user.name} logged in</p>
       <button onClick={handleLogout}>Log out</button>
       <Togglable buttonLabel='new note' ref={noteFormRef}>
        <NoteForm
          createNote={addNote}
        />
      </Togglable>
      </div>
     } 
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
    <Footer />
    </div>
  )
}

export default App