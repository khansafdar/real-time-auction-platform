import React, { useState, useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const { register } = useContext(AuthContext)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(name, email, password)
      alert('Registered. Please login.')
      navigate('/login')
    } catch (err) {
      alert(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card" style={{maxWidth:480, margin:'24px auto'}}>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <div className="form-group">
          <input className="input" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <div className="form-group">
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div>
          <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        </div>
      </form>
    </div>
  )
}