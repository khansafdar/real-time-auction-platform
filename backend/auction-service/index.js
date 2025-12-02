const express = require("express");
const app = express();
app.use(express.json());

let auctions = {};

app.post("/create",(req,res)=>{
  const id="auc-"+Date.now();
  auctions[id]={id,...req.body};
  res.json(auctions[id]);
});

app.get("/",(req,res)=>res.json(Object.values(auctions)));

app.listen(5002);
