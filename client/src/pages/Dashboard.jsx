import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

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
    if (!form.payer_id || !form.amount) return alert('Please select a payer and enter an amount');
    await axios.post('http://localhost:5000/api/payments', form, { headers });
    const res = await axios.get('http://localhost:5000/api/payments', { headers });
    setPayments(res.data);
    setForm({ payer_id:'', amount:'', method:'cash', reference:'', category:'market' });
  };

  // Chart data — by category
  const categoryData = ['market','parking','land','permit'].map(cat => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    total: payments.filter(p => p.category === cat).reduce((sum, p) => sum + parseFloat(p.amount), 0)
  }));

  // Chart data — by method
  const methodData = ['cash','mpesa','bank'].map(m => ({
    name: m === 'mpesa' ? 'M-Pesa' : m.charAt(0).toUpperCase() + m.slice(1),
    value: payments.filter(p => p.method === m).reduce((sum, p) => sum + parseFloat(p.amount), 0)
  })).filter(m => m.value > 0);

  const COLORS = ['#1D9E75','#3B82F6','#F59E0B','#EF4444'];

  return (
    <div style={{padding:'24px', fontFamily:'sans-serif', maxWidth:'1200px', margin:'auto'}}>

      {/* Header */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
        <h2 style={{fontSize:'24px', fontWeight:'600'}}>Mombasa Revenue Dashboard</h2>
        <span style={{fontSize:'14px', color:'#6b7280'}}>{new Date().toLocaleDateString('en-KE', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</span>
      </div>

      {/* Stats cards */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'16px', marginBottom:'24px'}}>
        {[
          { label:'Total Collected', value:'KES ' + total.toLocaleString(), color:'#1D9E75' },
          { label:'Total Payments', value: payments.length, color:'#3B82F6' },
          { label:'Market & Parking', value:'KES ' + payments.filter(p=>['market','parking'].includes(p.category)).reduce((s,p)=>s+parseFloat(p.amount),0).toLocaleString(), color:'#F59E0B' },
          { label:'Land & Permits', value:'KES ' + payments.filter(p=>['land','permit'].includes(p.category)).reduce((s,p)=>s+parseFloat(p.amount),0).toLocaleString(), color:'#EF4444' }
        ].map((card, i) => (
          <div key={i} style={{background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', padding:'16px', borderTop:'4px solid ' + card.color}}>
            <div style={{fontSize:'12px', color:'#6b7280', marginBottom:'6px'}}>{card.label}</div>
            <div style={{fontSize:'20px', fontWeight:'600', color: card.color}}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'24px'}}>

        {/* Bar chart — by category */}
        <div style={{background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', padding:'16px'}}>
          <h3 style={{fontSize:'14px', fontWeight:'600', marginBottom:'16px', color:'#374151'}}>Revenue by Category (KES)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" tick={{fontSize:12}} />
              <YAxis tick={{fontSize:12}} />
              <Tooltip formatter={v => 'KES ' + v.toLocaleString()} />
              <Bar dataKey="total" fill="#1D9E75" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart — by payment method */}
        <div style={{background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', padding:'16px'}}>
          <h3 style={{fontSize:'14px', fontWeight:'600', marginBottom:'16px', color:'#374151'}}>Revenue by Payment Method</h3>
          {methodData.length === 0 ? (
            <div style={{height:'220px', display:'flex', alignItems:'center', justifyContent:'center', color:'#9ca3af'}}>No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={methodData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({name, percent}) => name + ' ' + (percent*100).toFixed(0) + '%'}>
                  {methodData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={v => 'KES ' + v.toLocaleString()} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Record Payment Form */}
      <div style={{background:'#f9fafb', border:'1px solid #e5e7eb', borderRadius:'10px', padding:'20px', marginBottom:'24px'}}>
        <h3 style={{fontSize:'16px', fontWeight:'600', marginBottom:'16px'}}>Record New Payment</h3>
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

      {/* Payments Table */}
      <div style={{background:'#fff', border:'1px solid #e5e7eb', borderRadius:'10px', overflow:'hidden'}}>
        <div style={{padding:'16px', borderBottom:'1px solid #e5e7eb'}}>
          <h3 style={{fontSize:'16px', fontWeight:'600'}}>Payment Records</h3>
        </div>
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead style={{background:'#f9fafb'}}>
            <tr>
              {['Payer','Amount','Method','Category','Date'].map(h => (
                <th key={h} style={{padding:'12px 16px', textAlign:'left', fontSize:'13px', color:'#6b7280', fontWeight:'500'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr><td colSpan="5" style={{padding:'24px', textAlign:'center', color:'#9ca3af'}}>No payments recorded yet</td></tr>
            ) : payments.map(p => (
              <tr key={p.id} style={{borderBottom:'1px solid #f3f4f6'}}>
                <td style={{padding:'12px 16px', fontSize:'14px'}}>{p.payer_name}</td>
                <td style={{padding:'12px 16px', fontSize:'14px', fontWeight:'500'}}>KES {parseFloat(p.amount).toLocaleString()}</td>
                <td style={{padding:'12px 16px', fontSize:'14px'}}>
                  <span style={{padding:'2px 8px', borderRadius:'12px', fontSize:'12px', background: p.method==='mpesa'?'#dcfce7': p.method==='bank'?'#dbeafe':'#f3f4f6', color: p.method==='mpesa'?'#166534': p.method==='bank'?'#1e40af':'#374151'}}>
                    {p.method === 'mpesa' ? 'M-Pesa' : p.method.charAt(0).toUpperCase() + p.method.slice(1)}
                  </span>
                </td>
                <td style={{padding:'12px 16px', fontSize:'14px'}}>{p.category.charAt(0).toUpperCase() + p.category.slice(1)}</td>
                <td style={{padding:'12px 16px', fontSize:'14px', color:'#6b7280'}}>{new Date(p.paid_at).toLocaleDateString('en-KE')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}