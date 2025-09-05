const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
export async function listClientes(){ const r = await fetch(`${BASE}/clientes`); if(!r.ok) throw new Error('Error'); return r.json() }
export async function crearCliente(data){ const r = await fetch(`${BASE}/clientes`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) }); if(!r.ok) throw new Error('Error'); return r.json() }
export async function crearOrden(data){ const r = await fetch(`${BASE}/ordenes`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) }); if(!r.ok) throw new Error('Error'); return r.json() }
export async function obtenerOrden(id){ const r = await fetch(`${BASE}/ordenes/${id}`); if(!r.ok) throw new Error('Error'); return r.json() }
export async function actualizarOrden(id,data){ const r = await fetch(`${BASE}/ordenes/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) }); if(!r.ok) throw new Error('Error'); return r.json() }
export async function eliminarOrden(id){ const r = await fetch(`${BASE}/ordenes/${id}`, { method:'DELETE' }); if(!r.ok && r.status!==204) throw new Error('Error'); return true }
