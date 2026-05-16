import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, Legend, ResponsiveContainer
} from 'recharts';

const API = 'http://localhost:5000/api';
const COLORS = ['#16a34a','#2563eb','#d97706','#dc2626'];

export default function Dashboard() {
  const [payments, setPayments] = useState([]);
  const [payers, setPayers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [form, setForm] = useState({ payer_id:'', amount:'', method:'cash', reference:'', category:'market' });
  const [payerForm, setPayerForm] = useState({ name:'', phone:'', category:'market', location:'' });
  const [msg, setMsg] = useState(null);
  const token = localStorage.getItem('token');
  const headers = { Authorization: 'Bearer ' + token };

  const load = async () => {
    const [p, py] = await Promise.all([
      axios.get(API + '/payments', { headers }),
      axios.get(API + '/payers', { headers })
    ]);
    setPayments(p.data);
    setPayers(py.data);
  };

  useEffect(() => { load(); }, []);

  const notify = (text, ok=true) => {
    setMsg({ text, ok });
    setTimeout(() => setMsg(null), 3000);
  };

  const handlePayment = async () => {
    if (!form.payer_id || !form.amount) return notify('Please select a payer and enter an amount', false);
    try {
      await axios.post(API + '/payments', form, { headers });
      await load();
      setForm({ payer_id:'', amount:'', method:'cash', reference:'', category:'market' });
      notify('Payment recorded successfully!');
    } catch { notify('Failed to record payment', false); }
  };

  const handleAddPayer = async () => {
    if (!payerForm.name || !payerForm.phone) return notify('Please enter name and phone', false);
    try {
      await axios.post(API + '/payers', payerForm, { headers });
      await load();
      setPayerForm({ name:'', phone:'', category:'market', location:'' });
      notify('Payer registered successfully!');
    } catch { notify('Failed to register payer', false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const total = payments.reduce((s, p) => s + parseFloat(p.amount), 0);
  const todayTotal = payments
    .filter(p => new Date(p.paid_at).toDateString() === new Date().toDateString())
    .reduce((s, p) => s + parseFloat(p.amount), 0);

  const categoryData = ['market','parking','land','permit'].map(cat => ({
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    total: payments.filter(p => p.category === cat).reduce((s, p) => s + parseFloat(p.amount), 0)
  }));

  const methodData = ['cash','mpesa','bank'].map(m => ({
    name: m === 'mpesa' ? 'M-Pesa' : m.charAt(0).toUpperCase() + m.slice(1),
    value: payments.filter(p => p.method === m).reduce((s, p) => s + parseFloat(p.amount), 0)
  })).filter(m => m.value > 0);

  const tabs = ['overview', 'record payment', 'register payer', 'payers list'];

  const inp = { padding:'9px 12px', borderRadius:'7px', border:'1px solid #d1d5db', fontSize:'14px', width:'100%', outline:'none' };
  const btn = (bg) => ({ padding:'10px 20px', background:bg, color:'#fff', border:'none', borderRadius:'7px', cursor:'pointer', fontWeight:'600', fontSize:'14px', width:'100%' });

  return (
    <div style={{minHeight:'100vh', background:'#f1f5f9', fontFamily:'Georgia, serif'}}>

      {/* Toast */}
      {msg && (
        <div style={{position:'fixed', top:'20px', right:'20px', zIndex:999, padding:'12px 20px', borderRadius:'8px', background: msg.ok ? '#16a34a' : '#dc2626', color:'#fff', fontWeight:'500', fontSize:'14px', boxShadow:'0 4px 12px rgba(0,0,0,0.2)'}}>
          {msg.text}
        </div>
      )}

      {/* Top nav */}
      <div style={{background:'#14532d', padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', height:'60px'}}>
        <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
          <div style={{width:'36px', height:'36px', background:'#16a34a', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px'}}>🏛</div>
          <div>
            <div style={{color:'#fff', fontWeight:'700', fontSize:'15px'}}>Mombasa County</div>
            <div style={{color:'#86efac', fontSize:'11px'}}>Revenue Collection System</div>
          </div>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:'16px'}}>
          <span style={{color:'#86efac', fontSize:'13px'}}>{new Date().toLocaleDateString('en-KE',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</span>
          <button onClick={handleLogout} style={{padding:'6px 16px', background:'transparent', border:'1px solid #86efac', color:'#86efac', borderRadius:'6px', cursor:'pointer', fontSize:'13px'}}>Logout</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{background:'#fff', borderBottom:'1px solid #e2e8f0', padding:'0 24px', display:'flex', gap:'4px'}}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            style={{padding:'14px 20px', border:'none', background:'transparent', cursor:'pointer', fontSize:'13px', fontWeight:'600', textTransform:'capitalize', color: activeTab===t ? '#14532d' : '#64748b', borderBottom: activeTab===t ? '3px solid #16a34a' : '3px solid transparent', transition:'all .15s'}}>
            {t}
          </button>
        ))}
      </div>

      <div style={{padding:'24px', maxWidth:'1300px', margin:'auto'}}>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            {/* Stat cards */}
            <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'16px', marginBottom:'24px'}}>
              {[
                { label:'Total Collected', value:'KES ' + total.toLocaleString(), color:'#14532d', bg:'#f0fdf4', icon:'💰' },
                { label:"Today's Collection", value:'KES ' + todayTotal.toLocaleString(), color:'#1d4ed8', bg:'#eff6ff', icon:'📅' },
                { label:'Total Payments', value: payments.length + ' records', color:'#b45309', bg:'#fffbeb', icon:'🧾' },
                { label:'Registered Payers', value: payers.length + ' payers', color:'#7c3aed', bg:'#f5f3ff', icon:'👥' }
              ].map((c,i) => (
                <div key={i} style={{background:c.bg, borderRadius:'12px', padding:'20px', border:'1px solid #e2e8f0'}}>
                  <div style={{fontSize:'24px', marginBottom:'8px'}}>{c.icon}</div>
                  <div style={{fontSize:'12px', color:'#64748b', marginBottom:'4px', fontFamily:'sans-serif'}}>{c.label}</div>
                  <div style={{fontSize:'22px', fontWeight:'700', color:c.color}}>{c.value}</div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'24px'}}>
              <div style={{background:'#fff', borderRadius:'12px', padding:'20px', border:'1px solid #e2e8f0'}}>
                <h3 style={{fontSize:'14px', fontWeight:'700', marginBottom:'16px', color:'#1e293b', fontFamily:'sans-serif'}}>Revenue by Category (KES)</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={categoryData}>
                    <XAxis dataKey="name" tick={{fontSize:12, fontFamily:'sans-serif'}} />
                    <YAxis tick={{fontSize:12, fontFamily:'sans-serif'}} />
                    <Tooltip formatter={v => 'KES ' + v.toLocaleString()} />
                    <Bar dataKey="total" fill="#16a34a" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{background:'#fff', borderRadius:'12px', padding:'20px', border:'1px solid #e2e8f0'}}>
                <h3 style={{fontSize:'14px', fontWeight:'700', marginBottom:'16px', color:'#1e293b', fontFamily:'sans-serif'}}>Revenue by Payment Method</h3>
                {methodData.length === 0
                  ? <div style={{height:'220px', display:'flex', alignItems:'center', justifyContent:'center', color:'#94a3b8', fontFamily:'sans-serif'}}>No data yet</div>
                  : <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={methodData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({name,percent})=>name+' '+Math.round(percent*100)+'%'}>
                          {methodData.map((_,i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip formatter={v => 'KES ' + v.toLocaleString()} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                }
              </div>
            </div>

            {/* Recent payments table */}
            <div style={{background:'#fff', borderRadius:'12px', border:'1px solid #e2e8f0', overflow:'hidden'}}>
              <div style={{padding:'16px 20px', borderBottom:'1px solid #f1f5f9', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <h3 style={{fontSize:'15px', fontWeight:'700', color:'#1e293b', fontFamily:'sans-serif'}}>Recent Payments</h3>
                <span style={{fontSize:'12px', color:'#94a3b8', fontFamily:'sans-serif'}}>{payments.length} total records</span>
              </div>
              <table style={{width:'100%', borderCollapse:'collapse', fontFamily:'sans-serif'}}>
                <thead>
                  <tr style={{background:'#f8fafc'}}>
                    {['Payer','Amount','Method','Category','Date'].map(h => (
                      <th key={h} style={{padding:'12px 16px', textAlign:'left', fontSize:'12px', color:'#64748b', fontWeight:'600', textTransform:'uppercase', letterSpacing:'.04em'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0
                    ? <tr><td colSpan="5" style={{padding:'32px', textAlign:'center', color:'#94a3b8'}}>No payments recorded yet</td></tr>
                    : payments.slice(0,10).map(p => (
                      <tr key={p.id} style={{borderBottom:'1px solid #f1f5f9'}}>
                        <td style={{padding:'12px 16px', fontSize:'14px', fontWeight:'500', color:'#1e293b'}}>{p.payer_name}</td>
                        <td style={{padding:'12px 16px', fontSize:'14px', fontWeight:'700', color:'#16a34a'}}>KES {parseFloat(p.amount).toLocaleString()}</td>
                        <td style={{padding:'12px 16px'}}>
                          <span style={{padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'600',
                            background: p.method==='mpesa'?'#dcfce7': p.method==='bank'?'#dbeafe':'#f1f5f9',
                            color: p.method==='mpesa'?'#166534': p.method==='bank'?'#1e40af':'#475569'}}>
                            {p.method==='mpesa'?'M-Pesa': p.method.charAt(0).toUpperCase()+p.method.slice(1)}
                          </span>
                        </td>
                        <td style={{padding:'12px 16px', fontSize:'14px', color:'#475569', textTransform:'capitalize'}}>{p.category}</td>
                        <td style={{padding:'12px 16px', fontSize:'13px', color:'#94a3b8'}}>{new Date(p.paid_at).toLocaleDateString('en-KE')}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* RECORD PAYMENT TAB */}
        {activeTab === 'record payment' && (
          <div style={{maxWidth:'600px', margin:'auto'}}>
            <div style={{background:'#fff', borderRadius:'12px', padding:'32px', border:'1px solid #e2e8f0'}}>
              <h3 style={{fontSize:'20px', fontWeight:'700', marginBottom:'6px', color:'#1e293b'}}>Record New Payment</h3>
              <p style={{fontSize:'14px', color:'#64748b', marginBottom:'24px', fontFamily:'sans-serif'}}>Fill in the details below to record a payment</p>
              <div style={{display:'flex', flexDirection:'column', gap:'16px', fontFamily:'sans-serif'}}>
                <div>
                  <label style={{fontSize:'13px', fontWeight:'600', color:'#374151', display:'block', marginBottom:'6px'}}>Payer</label>
                  <select value={form.payer_id} onChange={e => setForm({...form, payer_id: e.target.value})} style={inp}>
                    <option value="">Select Payer</option>
                    {payers.map(p => <option key={p.id} value={p.id}>{p.name} — {p.location}</option>)}
                  </select>
                </div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
                  <div>
                    <label style={{fontSize:'13px', fontWeight:'600', color:'#374151', display:'block', marginBottom:'6px'}}>Amount (KES)</label>
                    <input placeholder="e.g. 500" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} style={inp} />
                  </div>
                  <div>
                    <label style={{fontSize:'13px', fontWeight:'600', color:'#374151', display:'block', marginBottom:'6px'}}>Payment Method</label>
                    <select value={form.method} onChange={e => setForm({...form, method: e.target.value})} style={inp}>
                      <option value="cash">Cash</option>
                      <option value="mpesa">M-Pesa</option>
                      <option value="bank">Bank Transfer</option>
                    </select>
                  </div>
                </div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
                  <div>
                    <label style={{fontSize:'13px', fontWeight:'600', color:'#374151', display:'block', marginBottom:'6px'}}>Category</label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inp}>
                      <option value="market">Market Stall</option>
                      <option value="parking">Parking</option>
                      <option value="land">Land Rates</option>
                      <option value="permit">Business Permit</option>
                    </select>
                  </div>
                  <div>
                    <label style={{fontSize:'13px', fontWeight:'600', color:'#374151', display:'block', marginBottom:'6px'}}>Reference No. (optional)</label>
                    <input placeholder="e.g. MPESA ref" value={form.reference} onChange={e => setForm({...form, reference: e.target.value})} style={inp} />
                  </div>
                </div>
                <button onClick={handlePayment} style={btn('#16a34a')}>Record Payment</button>
              </div>
            </div>
          </div>
        )}

        {/* REGISTER PAYER TAB */}
        {activeTab === 'register payer' && (
          <div style={{maxWidth:'600px', margin:'auto'}}>
            <div style={{background:'#fff', borderRadius:'12px', padding:'32px', border:'1px solid #e2e8f0'}}>
              <h3 style={{fontSize:'20px', fontWeight:'700', marginBottom:'6px', color:'#1e293b'}}>Register New Payer</h3>
              <p style={{fontSize:'14px', color:'#64748b', marginBottom:'24px', fontFamily:'sans-serif'}}>Add a new payer to the system</p>
              <div style={{display:'flex', flexDirection:'column', gap:'16px', fontFamily:'sans-serif'}}>
                <div>
                  <label style={{fontSize:'13px', fontWeight:'600', color:'#374151', display:'block', marginBottom:'6px'}}>Full Name</label>
                  <input placeholder="e.g. John Kamau" value={payerForm.name} onChange={e => setPayerForm({...payerForm, name: e.target.value})} style={inp} />
                </div>
                <div>
                  <label style={{fontSize:'13px', fontWeight:'600', color:'#374151', display:'block', marginBottom:'6px'}}>Phone Number</label>
                  <input placeholder="e.g. 0712345678" value={payerForm.phone} onChange={e => setPayerForm({...payerForm, phone: e.target.value})} style={inp} />
                </div>
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px'}}>
                  <div>
                    <label style={{fontSize:'13px', fontWeight:'600', color:'#374151', display:'block', marginBottom:'6px'}}>Category</label>
                    <select value={payerForm.category} onChange={e => setPayerForm({...payerForm, category: e.target.value})} style={inp}>
                      <option value="market">Market Stall</option>
                      <option value="parking">Parking</option>
                      <option value="land">Land Rates</option>
                      <option value="permit">Business Permit</option>
                    </select>
                  </div>
                  <div>
                    <label style={{fontSize:'13px', fontWeight:'600', color:'#374151', display:'block', marginBottom:'6px'}}>Location</label>
                    <input placeholder="e.g. Kongowea Market" value={payerForm.location} onChange={e => setPayerForm({...payerForm, location: e.target.value})} style={inp} />
                  </div>
                </div>
                <button onClick={handleAddPayer} style={btn('#2563eb')}>Register Payer</button>
              </div>
            </div>
          </div>
        )}

        {/* PAYERS LIST TAB */}
        {activeTab === 'payers list' && (
          <div style={{background:'#fff', borderRadius:'12px', border:'1px solid #e2e8f0', overflow:'hidden'}}>
            <div style={{padding:'16px 20px', borderBottom:'1px solid #f1f5f9', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h3 style={{fontSize:'15px', fontWeight:'700', color:'#1e293b', fontFamily:'sans-serif'}}>All Registered Payers</h3>
              <span style={{fontSize:'12px', color:'#94a3b8', fontFamily:'sans-serif'}}>{payers.length} payers</span>
            </div>
            <table style={{width:'100%', borderCollapse:'collapse', fontFamily:'sans-serif'}}>
              <thead>
                <tr style={{background:'#f8fafc'}}>
                  {['Name','Phone','Category','Location'].map(h => (
                    <th key={h} style={{padding:'12px 16px', textAlign:'left', fontSize:'12px', color:'#64748b', fontWeight:'600', textTransform:'uppercase', letterSpacing:'.04em'}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payers.length === 0
                  ? <tr><td colSpan="4" style={{padding:'32px', textAlign:'center', color:'#94a3b8'}}>No payers registered yet</td></tr>
                  : payers.map(p => (
                    <tr key={p.id} style={{borderBottom:'1px solid #f1f5f9'}}>
                      <td style={{padding:'12px 16px', fontSize:'14px', fontWeight:'500', color:'#1e293b'}}>{p.name}</td>
                      <td style={{padding:'12px 16px', fontSize:'14px', color:'#475569'}}>{p.phone}</td>
                      <td style={{padding:'12px 16px'}}>
                        <span style={{padding:'3px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'600', background:'#f0fdf4', color:'#166534', textTransform:'capitalize'}}>{p.category}</span>
                      </td>
                      <td style={{padding:'12px 16px', fontSize:'14px', color:'#475569'}}>{p.location}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}