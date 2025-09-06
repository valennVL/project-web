const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'
export async function listClientes(){ const r = await fetch(`${BASE}/cliente`); if(!r.ok) throw new Error('Error'); return r.json() }
export async function crearCliente(data){ const r = await fetch(`${BASE}/cliente`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) }); if(!r.ok) throw new Error('Error'); return r.json() }
export async function crearOrden(data){ const r = await fetch(`${BASE}/orden`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) }); if(!r.ok) throw new Error('Error'); return r.json() }
export async function obtenerOrden(id){ const r = await fetch(`${BASE}/orden/${id}`); if(!r.ok) throw new Error('Error'); return r.json() }
export async function actualizarOrden(id,data){ const r = await fetch(`${BASE}/orden/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) }); if(!r.ok) throw new Error('Error'); return r.json() }
export async function eliminarOrden(id){ const r = await fetch(`${BASE}/orden/${id}`, { method:'DELETE' }); if(!r.ok && r.status!==204) throw new Error('Error'); return true }
