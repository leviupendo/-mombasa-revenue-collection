import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const res = await axios.post('http://localhost:5000/api/auth/login',
      { email, password }
    );
    localStorage.setItem('token', res.data.token);
    window.location.href = '/dashboard';
  };

  return (
    <div style={{padding:'40px',maxWidth:'400px',margin:'auto'}}>
      <h2>Mombasa Revenue - Admin Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)}
        style={{display:'block',width:'100%',margin:'10px 0',padding:'8px'}} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)}
        style={{display:'block',width:'100%',margin:'10px 0',padding:'8px'}} />
      <button onClick={handleLogin}
        style={{padding:'10px 24px',background:'#1D9E75',color:'#fff',border:'none',borderRadius:'6px',cursor:'pointer'}}>
        Login
      </button>
    </div>
  );
}