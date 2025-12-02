import { useState } from "react";
import axios from "axios";

const AUTH_URL = import.meta.env.VITE_AUTH_URL;

export default function Login({ setToken,setUser }) {
  const [email,setEmail] = useState("a@b.com");
  const [password,setPassword] = useState("pass");

  const login = async ()=>{
    const res = await axios.post(`${AUTH_URL}/login`,{email,password});
    const token=res.data.token;
    localStorage.setItem("token",token);
    setToken(token);
    const me = await axios.get(`${AUTH_URL}/me`,{
      headers:{Authorization:`Bearer ${token}`}
    });
    localStorage.setItem("user",JSON.stringify(me.data));
    setUser(me.data);
  };

  return (
    <div>
      <h2>Login</h2>
      <input value={email} onChange={e=>setEmail(e.target.value)}/>
      <br/><br/>
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)}/>
      <br/><br/>
      <button onClick={login}>Login</button>
    </div>
  );
}
