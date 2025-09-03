import React, { useState } from 'react'
import { crearOrden, obtenerOrden, actualizarOrden, eliminarOrden } from '../api'

export function Ordenes(){
  const [tipo, setTipo] = useState('Mantenimiento')
  const [idCliente, setIdCliente] = useState('')
  const [consultaId, setConsultaId] = useState('')
  const [orden, setOrden] = useState(null)
  async function crear(){ const payload={ tipo: tipo, id_cliente: Number(idCliente) }; const o = await crearOrden(payload); setOrden(o) }
  async function consultar(){ const o = await obtenerOrden(consultaId); setOrden(o) }
  async function actualizar(){ if(!orden) return; const o = await actualizarOrden(orden.consecutivo, { id_cliente: orden.id_cliente }); setOrden(o) }
  async function eliminar(){ if(!orden) return; await eliminarOrden(orden.consecutivo); setOrden(null) }
  return (
    <div>
      <div className="toolbar">
        <select className="input" value={tipo} onChange={e=>setTipo(e.target.value)}>
          <option>Mantenimiento</option>
          <option>Venta</option>
          <option>Mixto</option>
        </select>
        <input className="input" placeholder="ID cliente" value={idCliente} onChange={e=>setIdCliente(e.target.value)} />
        <button className="btn btn-primary" onClick={crear}>Crear orden</button>
      </div>
      <div className="toolbar">
        <input className="input" placeholder="Consecutivo" value={consultaId} onChange={e=>setConsultaId(e.target.value)} />
        <button className="btn btn-secondary" onClick={consultar}>Consultar</button>
        <button className="btn btn-secondary" onClick={actualizar} disabled={!orden}>Actualizar</button>
        <button className="btn btn-secondary" onClick={eliminar} disabled={!orden}>Eliminar</button>
      </div>
      <div className="card" style={{marginTop:12}}>
        <h4>Detalle</h4>
        <pre style={{whiteSpace:'pre-wrap'}}>{orden? JSON.stringify(orden,null,2):'—'}</pre>
      </div>
    </div>
  )
}
