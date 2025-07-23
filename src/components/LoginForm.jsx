import { useState } from "react"
import loginService from '../services/loginService.js'
import notesService from '../services/notesService.js'


const LoginForm = ({user,setUser,errorMessage,setErrorMessage}) => {
              const [username,setUsername] = useState('')
              const [password,setPassword] = useState('')
              const handleSubmit = async (event)=>{
                event.preventDefault()
            
                try {
                  const user = await loginService.login({username,password})
            
                  window.localStorage.setItem('loggedNoteAppUser',JSON.stringify(user))
                  notesService.setToken(user.token)
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
            return(
            <div>
                <h2>Login</h2>

                <form onSubmit={handleSubmit}>
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
            </div>
        )}


export default LoginForm