import React, { createContext, useState, useEffect } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(token){
      api.setToken(token)
      // Optionally: call /me to verify and get user info
      api.get('/auth/me').then(res => setUser(res.data)).catch(() => {
        localStorage.removeItem('token')
        setUser(null)
      })
    }
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const token = res.data.token
    localStorage.setItem('token', token)
    api.setToken(token)
    // fetch user
    const me = await api.get('/auth/me')
    setUser(me.data)
    navigate('/auctions')
    return res.data
  }

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password })
    // may auto-login depending on backend
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    api.setToken(null)
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}