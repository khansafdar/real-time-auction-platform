import React, { useEffect, useState, useContext } from 'react'
import api from '../services/api'
import AuctionCard from '../components/AuctionCard'
import { AuthContext } from '../contexts/AuthContext'

export default function Auctions(){
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    fetchAuctions()
    // optionally setup polling or socket subscription for live list updates
  }, [])

  async function fetchAuctions() {
    try {
      setLoading(true)
      const res = await api.get('/auctions')
      setAuctions(res.data)
    } catch (err) {
      console.error(err)
      alert('Could not load auctions.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="header">
        <h1>Auctions</h1>
        <div>
          <span className="small">Logged in as: {user?.email}</span>
        </div>
      </div>

      <div>
        {loading ? <div className="card">Loading...</div> : (
          <div className="auction-grid">
            {auctions.map(a => <AuctionCard key={a.id} auction={a} />)}
          </div>
        )}
      </div>
    </>
  )
}