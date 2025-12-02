const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

let users = {};

app.post("/register", async (req,res)=>{
  const {email,password}=req.body;
  users[email]={email,passwordHash:await bcrypt.hash(password,8)};
  res.json({email});
});

app.post("/login", async (req,res)=>{
  const {email,password}=req.body;
  const u=users[email];
  if(!u) return res.status(400).send("invalid");
  const ok=await bcrypt.compare(password,u.passwordHash);
  if(!ok) return res.status(400).send("invalid");
  const token=jwt.sign({email},process.env.JWT_SECRET);
  res.json({token});
});

app.get("/me",(req,res)=>{
  try{
    const token=req.headers.authorization?.split(" ")[1];
    const data=jwt.verify(token,process.env.JWT_SECRET);
    res.json(data);
  }catch(e){res.status(401).end();}
});

app.listen(5003);
