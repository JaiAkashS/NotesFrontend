import { useState } from "react"

const noteForm = ({createNote}) => {
    const [newNote,setNewNote] = useState('')

    const addNote = (event)=>{
        event.preventDefault()
        createNote({
                content: newNote,
                important: true
            })
        setNewNote('')
    }
    return(
        <div>
            <h2>Create a New Note</h2>
            <form onSubmit={addNote}>
                <input
                value={newNote}
                onChange={(event) =>{setNewNote(event.target.value)}}
                />
                <button type="submit">save</button>
            </form>
        </div>
    )
}

export default noteForm