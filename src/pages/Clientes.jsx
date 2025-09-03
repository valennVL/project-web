import React, { useEffect, useState } from 'react'
import { listClientes, crearCliente } from '../api'

export function Clientes(){
  const [rows, setRows] = useState([])
  const [q, setQ] = useState('')
  const [form, setForm] = useState({ id:'', nombre:'', email:'', contacto:'', direccion:'' })
  async function load(){ try{ const data = await listClientes(); setRows(data) }catch(e){} }
  useEffect(()=>{ load() },[])
  const filtered = rows.filter(x=>`${x.id} ${x.nombre} ${x.email} ${x.contacto} ${x.direccion||''}`.toLowerCase().includes(q.toLowerCase()))
  async function submit(e){ e.preventDefault(); const payload={...form, id: Number(form.id), contacto: Number(form.contacto)||0}; const saved = await crearCliente(payload); setForm({ id:'', nombre:'', email:'', contacto:'', direccion:'' }); setRows([...rows, saved]) }
  return (
    <div>
      <div className="toolbar">
        <input className="input" placeholder="Buscar" value={q} onChange={e=>setQ(e.target.value)} />
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Nombre</th><th>Email</th><th>Contacto</th><th>Dirección</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(x=> (
            <tr key={x.id}>
              <td>{x.id}</td><td>{x.nombre}</td><td>{x.email}</td><td>{x.contacto}</td><td>{x.direccion||'—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{marginTop:16}}>
        <form onSubmit={submit} style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:8}}>
          <input className="input" placeholder="ID" value={form.id} onChange={e=>setForm({...form,id:e.target.value})} />
          <input className="input" placeholder="Nombre" value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} />
          <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
          <input className="input" placeholder="Contacto" value={form.contacto} onChange={e=>setForm({...form,contacto:e.target.value})} />
          <input className="input" placeholder="Dirección" value={form.direccion} onChange={e=>setForm({...form,direccion:e.target.value})} />
          <div style={{gridColumn:'1 / -1',display:'flex',justifyContent:'flex-end'}}>
            <button className="btn btn-primary" type="submit">Crear cliente</button>
          </div>
        </form>
      </div>
    </div>
  )
}
