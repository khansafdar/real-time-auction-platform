import { useState } from "react";
import axios from "axios";

const BIDDING_URL = import.meta.env.VITE_BIDDING_URL;

export default function BidBox({auctionId,user}) {
  const [amount,setAmount]=useState("");

  const place=async()=>{
    await axios.post(`${BIDDING_URL}/place-bid`,{
      auctionId,
      bidderId:user.email,
      amount:Number(amount)
    });
    setAmount("");
  };

  return (
    <div>
      <input value={amount} onChange={e=>setAmount(e.target.value)} type="number"/>
      <button onClick={place}>Bid</button>
    </div>
  );
}
