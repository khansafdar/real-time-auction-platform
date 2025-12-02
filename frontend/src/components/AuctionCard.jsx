import React from 'react'
import { Link } from 'react-router-dom'

export default function AuctionCard({ auction }){
  const { id, title, currentBid, endsAt, image, highestBidder } = auction
  const ends = endsAt ? new Date(endsAt).toLocaleString() : 'N/A'
  return (
    <div className="card">
      <div style={{height:140, background:'#f3f4f8', borderRadius:8, marginBottom:12, display:'flex',alignItems:'center',justifyContent:'center'}}>
        {image ? <img src={image} alt={title} style={{maxHeight:'100%', maxWidth:'100%', objectFit:'cover'}}/> : <div className="small">No image</div>}
      </div>
      <h3 style={{marginBottom:6}}>{title}</h3>
      <div className="small">Current bid: <span className="badge">{currentBid ?? '—'}</span></div>
      <div className="small" style={{marginTop:6}}>Ends: {ends}</div>
      <div style={{marginTop:12}}>
        <Link to={`/auctions/${id}`} className="btn btn-primary">View / Bid</Link>
      </div>
    </div>
  )
}