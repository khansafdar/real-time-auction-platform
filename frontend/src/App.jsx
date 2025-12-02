import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Auctions from './pages/Auctions'
import Auction from './pages/Auction'
import PrivateRoute from './components/PrivateRoute'

export default function App(){
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/auctions" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auctions" element={<PrivateRoute><Auctions /></PrivateRoute>} />
          <Route path="/auctions/:id" element={<PrivateRoute><Auction /></PrivateRoute>} />
        </Routes>
      </div>
    </>
  )
}