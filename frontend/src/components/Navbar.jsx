import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export default function Navbar(){
  const { user, logout } = useContext(AuthContext)
  return (
    <div className="nav">
      <div className="container header">
        <div>
          <Link to="/auctions"><strong>RealTime Auction</strong></Link>
          <span style={{marginLeft:12}} className="small">Live bidding</span>
        </div>
        <div>
          {user ? (
            <>
              <span className="small" style={{marginRight:12}}>Hi, {user.name || user.email}</span>
              <button className="btn" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" style={{marginLeft:8}} className="btn btn-primary">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}