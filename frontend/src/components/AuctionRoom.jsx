import { useState,useEffect } from "react";
import { io } from "socket.io-client";
import BidBox from "./BidBox.jsx";

const WS_URL = import.meta.env.VITE_WS_URL;

export default function AuctionRoom({token,user}) {
  const [auctionId,setAuctionId]=useState("auction-1");
  const [socket,setSocket]=useState(null);
  const [bids,setBids]=useState([]);

  const join=()=>{
    if(socket) socket.disconnect();
    const s=io(WS_URL,{auth:{token},path:"/socket.io"});
    s.on("new-bid",(b)=>setBids(prev=>[b,...prev]));
    s.emit("join-auction",{auctionId});
    setSocket(s);
  };

  return (
    <div>
      <h2>Auction</h2>
      <p>Logged in as {user?.email}</p>
      <input value={auctionId} onChange={e=>setAuctionId(e.target.value)}/>
      <button onClick={join}>Join</button>
      {socket && <BidBox auctionId={auctionId} user={user}/>}
      <ul>
        {bids.map((b,i)=><li key={i}>{b.bidderId}: ${b.amount}</li>)}
      </ul>
    </div>
  );
}
