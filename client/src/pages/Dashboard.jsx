import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [payments, setPayments] = useState([]);
  const [payers, setPayers] = useState([]);
  const [form, setForm] = useState({ payer_id:'', amount:'', method:'cash', reference:'', category:'market' });
  const token = localStorage.getItem('token');
  const headers = { Authorization: 'Bearer ' + token };

  useEffect(() => {
    axios.get('http://localhost:5000/api/payments', { headers }).then(res => setPayments(res.data));
    axios.get('http://localhost:5000/api/payers', { headers }).then(res => setPayers(res.data));
  }, [token]);

  const total = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const handleSubmit = async () => {
    await axios.post('http://localhost:5000/api/payments', form, { headers });
    const res = await axios.get('http://localhost:5000/api/payments', { headers });
    setPayments(res.data);
    setForm({ payer_id:'', amount:'', method:'cash', reference:'', category:'market' });
  };

  return (
    <div style={{padding:'24px', fontFamily:'sans-serif'}}>
      <h2>Mombasa Revenue Dashboard</h2>
      <p style={{fontSize:'18px', margin:'12px 0'}}>
        Total Collected: <strong>KES {total.toLocaleString()}</strong>
      </p>
      <div style={{background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:'8px', padding:'20px', marginBottom:'24px'}}>
        <h3 style={{marginBottom:'16px'}}>Record New Payment</h3>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px'}}>
          <select value={form.payer_id} onChange={e => setForm({...form, payer_id: e.target.value})}
            style={{padding:'8px', borderRadius:'6px', border:'1px solid #d1d5db'}}>
            <option value="">Select Payer</option>
            {payers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <input placeholder="Amount (KES)" value={form.amount}
            onChange={e => setForm({...form, amount: e.target.value})}
            style={{padding:'8px', borderRadius:'6px', border:'1px solid #d1d5db'}} />
          <select value={form.method} onChange={e => setForm({...form, method: e.target.value})}
            style={{padding:'8px', borderRadius:'6px', border:'1px solid #d1d5db'}}>
            <option value="cash">Cash</option>
            <option value="mpesa">M-Pesa</option>
            <option value="bank">Bank Transfer</option>
          </select>
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
            style={{padding:'8px', borderRadius:'6px', border:'1px solid #d1d5db'}}>
            <option value="market">Market Stall</option>
            <option value="parking">Parking</option>
            <option value="land">Land Rates</option>
            <option value="permit">Business Permit</option>
          </select>
          <input placeholder="Reference No. (optional)" value={form.reference}
            onChange={e => setForm({...form, reference: e.target.value})}
            style={{padding:'8px', borderRadius:'6px', border:'1px solid #d1d5db'}} />
          <button onClick={handleSubmit}
            style={{padding:'8px', background:'#1D9E75', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'500'}}>
            Record Payment
          </button>
        </div>
      </div>
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead style={{background:'#f3f4f6'}}>
          <tr>
            <th style={{padding:'10px', textAlign:'left'}}>Payer</th>
            <th style={{padding:'10px', textAlign:'left'}}>Amount</th>
            <th style={{padding:'10px', textAlign:'left'}}>Method</th>
            <th style={{padding:'10px', textAlign:'left'}}>Category</th>
            <th style={{padding:'10px', textAlign:'left'}}>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id} style={{borderBottom:'1px solid #e5e7eb'}}>
              <td style={{padding:'10px'}}>{p.payer_name}</td>
              <td style={{padding:'10px'}}>KES {p.amount}</td>
              <td style={{padding:'10px'}}>{p.method}</td>
              <td style={{padding:'10px'}}>{p.category}</td>
              <td style={{padding:'10px'}}>{new Date(p.paid_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}