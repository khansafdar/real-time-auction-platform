import React, { useState } from 'react'

export default function BidForm({ onBid, minBid }) {
  const [amount, setAmount] = useState(minBid || '')

  const submit = (e) => {
    e.preventDefault()
    const val = Number(amount)
    if (isNaN(val) || val <= 0) return alert('Enter valid amount')
    onBid(val)
  }

  return (
    <form onSubmit={submit}>
      <div className="form-group">
        <input className="input" type="number" value={amount} onChange={e=>setAmount(e.target.value)} min={minBid||0} />
      </div>
      <div>
        <button className="btn btn-primary" type="submit">Place Bid</button>
      </div>
    </form>
  )
}