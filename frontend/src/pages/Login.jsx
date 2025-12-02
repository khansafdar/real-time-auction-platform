import React, { useState, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function Login(){
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      alert(err?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card" style={{maxWidth:480, margin:'24px auto'}}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div className="form-group">
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Logging...' : 'Login'}</button>
          <Link to="/register" style={{marginLeft:12}}>Create account</Link>
        </div>
      </form>
    </div>
  )
}