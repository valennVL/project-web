import React, { useState } from 'react';
import { obtenerOrden, actualizarOrden, eliminarOrden } from '../api';

export function Ordenes() {
  const [consultaId, setConsultaId] = useState('');
  const [orden, setOrden] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function consultarOrden() {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerOrden(consultaId);
      setOrden(data);
    } catch (e) {
      setError('Error al consultar la orden.');
    } finally {
      setLoading(false);
    }
  }

  async function actualizarOrden() {
    setLoading(true);
    setError(null);
    try {
      const updatedOrder = await actualizarOrden(orden.consecutivo, orden);
      setOrden(updatedOrder);
    } catch (e) {
      setError('Error al actualizar la orden.');
    } finally {
      setLoading(false);
    }
  }

  async function eliminarOrden() {
    setLoading(true);
    setError(null);
    try {
      await eliminarOrden(orden.consecutivo);
      setOrden(null);
    } catch (e) {
      setError('Error al eliminar la orden.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="toolbar">
        <input
          className="input"
          placeholder="Consecutivo"
          value={consultaId}
          onChange={(e) => setConsultaId(e.target.value)}
        />
        <button className="btn btn-secondary" onClick={consultarOrden} disabled={loading}>
          Consultar
        </button>
        <button
          className="btn btn-secondary"
          onClick={actualizarOrden}
          disabled={!orden || loading}
        >
          Actualizar
        </button>
        <button
          className="btn btn-secondary"
          onClick={eliminarOrden}
          disabled={!orden || loading}
        >
          Eliminar
        </button>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}

      {orden && (
        <div>
          <h4>Detalles de la Orden:</h4>
          <pre>{JSON.stringify(orden, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
