import { useState } from 'react'
import loginService from '../services/loginService.js'
import notesService from '../services/notesService.js'

const LoginForm = ({ user, setUser, errorMessage, setErrorMessage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const u = await loginService.login({ username, password })
      window.localStorage.setItem('loggedNoteAppUser', JSON.stringify(u))
      notesService.setToken(u.token)
      setUser(u)
      setUsername(''); setPassword('')
    } catch {
      setErrorMessage('Wrong credentials')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const inputCls = 'w-full px-3 py-[7px] border border-[#eaeaea] rounded-md text-[13px] text-[#111] bg-white focus:outline-none focus:border-[#111] transition-colors'
  const labelCls = 'block text-[11px] font-semibold text-[#999] uppercase tracking-wider mb-1'

  return (
    <div className="bg-white border border-[#eaeaea] rounded-xl p-5 my-2 min-w-[220px]">
      <h2 className="font-serif text-lg font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <label className={labelCls}>Username</label>
          <input type="text" value={username} name="Username"
            onChange={({ target }) => setUsername(target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Password</label>
          <input type="password" value={password} name="Password"
            onChange={({ target }) => setPassword(target.value)} className={inputCls} />
        </div>
        <button type="submit" className="btn">Login</button>
      </form>
    </div>
  )
}

export default LoginForm
