import Note from './components/Note'
import { useState,useEffect } from 'react'
import noteService from './services/notes.js'
import loginService from './services/login.js'
import Notification from './components/Notification'
import Footer from './components/Footer'

const App = () => {
  const [notes,setNotes] = useState([])
  const [newNote,setNewNote] = useState("")
  const [showAll,setshowAll] = useState(true)
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [user,setUser] = useState(null)
  const [errorMessage,setErrorMessage] = useState(null)
  
  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {        
        setNotes(initialNotes)      })
  }, [])

  const handleLogin = async (event)=>{
    event.preventDefault()

    try {
      const user = await loginService.login({username,password})
      setUser(user)
      setUsername('')
      setPassword('') }
    catch(error) {
      setErrorMessage('Wrong credentials')
      setTimeout(() =>{
        setErrorMessage(null)
      },5000)
  }
  }

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



  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
          <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>      
  )

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input
        value={newNote}
        onChange={handleNewNote}
      />
      <button type="submit">save</button>
    </form>  
  )


  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>

      
      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged-in</p>
          {noteForm()}
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