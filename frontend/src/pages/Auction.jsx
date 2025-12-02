import React, { useEffect, useState, useContext, useRef } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import { connectSocket, disconnectSocket, getSocket } from '../services/socket'
import { AuthContext } from '../contexts/AuthContext'
import BidForm from '../components/BidForm'

export default function Auction(){
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const [auction, setAuction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bids, setBids] = useState([])
  const socketRef = useRef(null)

  useEffect(() => {
    load()
    return () => {
      disconnectSocket()
    }
  }, [id])

  async function load() {
    try {
      setLoading(true)
      const res = await api.get(`/auctions/${id}`)
      setAuction(res.data)
      // fetch bids
      const br = await api.get(`/auctions/${id}/bids`)
      setBids(br.data || [])
      // connect socket for live updates
      const token = localStorage.getItem('token')
      socketRef.current = connectSocket(token)
      // listen to auction-specific events (change event names to match server)
      socketRef.current.on(`auction:${id}:bid`, (payload) => {
        // payload: { auctionId, bid }
        setAuction(prev => ({ ...prev, currentBid: payload.bid.amount, highestBidder: payload.bid.bidder }))
        setBids(prev => [payload.bid, ...prev])
      })
      socketRef.current.on(`auction:${id}:closed`, (payload) => {
        setAuction(prev => ({ ...prev, status: 'closed' }))
      })
    } catch (err) {
      console.error(err)
      alert('Failed to load auction.')
    } finally {
      setLoading(false)
    }
  }

  const handlePlaceBid = async (amount) => {
    try {
      // Simple REST call to place a bid
      const res = await api.post(`/auctions/${id}/bids`, { amount })
      // server will broadcast via socket; but update local state for instant feedback
      setBids(prev => [res.data, ...prev])
      setAuction(prev => ({ ...prev, currentBid: res.data.amount, highestBidder: res.data.bidder }))
    } catch (err) {
      alert(err?.response?.data?.message || 'Could not place bid')
    }
  }

  if (loading) return <div className="card">Loading...</div>
  if (!auction) return <div className="card">Auction not found</div>

  return (
    <div>
      <div className="card">
        <div style={{display:'flex', gap:16}}>
          <div style={{flex:'0 0 320px'}}>
            {auction.image ? <img src={auction.image} alt={auction.title} style={{width:'100%', borderRadius:6}} /> : <div style={{height:180, background:'#f3f4f8', borderRadius:6}} />}
          </div>
          <div className="col">
            <h2>{auction.title}</h2>
            <p className="small">{auction.description}</p>
            <div style={{marginTop:12}}>
              <div className="small">Current bid: <span className="badge">{auction.currentBid ?? '—'}</span></div>
              <div className="small">Ends: {auction.endsAt ? new Date(auction.endsAt).toLocaleString() : '—'}</div>
              <div className="small">Status: {auction.status || 'open'}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns: '1fr 340px', gap:16}}>
        <div>
          <div className="card">
            <h3>Bid history</h3>
            {bids.length === 0 ? <div className="small">No bids yet</div> : (
              <ul>
                {bids.map(b => (
                  <li key={b.id} style={{padding:'8px 0', borderBottom:'1px solid #f0f0f0'}}>
                    <div><strong>{b.bidderName || b.bidder}</strong> — {b.amount}</div>
                    <div className="small">{new Date(b.createdAt || b.ts || Date.now()).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div>
          <div className="card">
            <h3>Place a bid</h3>
            {auction.status === 'closed' ? <div className="small">Auction closed</div> : (
              <BidForm onBid={handlePlaceBid} minBid={(auction.currentBid || 0) + (auction.minIncrement || 1)} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}