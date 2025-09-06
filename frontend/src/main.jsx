import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './styles.css'
import { Clientes } from './pages/Clientes'
import { Ordenes } from './pages/Ordenes'

function App(){
  const [tab, setTab] = useState('clientes')
  const [kpi, setKpi] = useState({clientes:0, ordenes:'—'})
  const base = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  useEffect(()=>{(async()=>{try{const c=await fetch(`${base}/cliente`).then(r=>r.json());setKpi(s=>({...s, clientes:c.length||0}))}catch(e){}})()},[])
  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">Radiadores Alejo</div>
        <div className="tabbar">
          <button className="btn btn-secondary" onClick={()=>setTab('clientes')}>Clientes</button>
          <button className="btn btn-secondary" onClick={()=>setTab('ordenes')}>Órdenes</button>
        </div>
      </header>
      <div className="container">
        <section className="hero">
          <div>
            <h1 style={{margin:0,color:'#f1dcc8'}}>Gestión conectada al backend</h1>
            <p style={{margin:0,color:'#bfaea0',fontSize:14}}>API {base}</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12}}>
            <div className="card"><h4>Clientes</h4><p>{kpi.clientes}</p></div>
            <div className="card"><h4>Órdenes</h4><p>{kpi.ordenes}</p></div>
          </div>
        </section>
        <section className="panel">
          <div className="panel-head"></div>
          <div className="panel-body">
            {tab==='clientes' && <Clientes />}
            {tab==='ordenes' && <Ordenes />}
          </div>
        </section>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
