from fastapi import APIRouter, HTTPException, Response, Query, status
from typing import Dict, List, Union
from app.models.schemas import Orden, CrearOrden, UpdateOrden
from app.api.routes.bases import db_cliente
from app.api.routes.bases import db_orden

router = APIRouter(prefix="", tags=["ordenes"])

# asigna CONSECUTIVO de la entidad ORDEN
_next_consecutivo: int = 1
def _get_next_consecutivo() -> int:
    global _next_consecutivo
    nid = _next_consecutivo
    _next_consecutivo += 1
    return nid

# creacion de instancia de la clase ORDEN
@router.post("/ordenes", response_model=Orden, status_code=201)
def crear_orden(payload: CrearOrden) -> Orden:
    # Validamos existecia del CLIENTE
    if payload.id_cliente not in db_cliente:
        raise HTTPException(
            status_code=404,
            detail=f"Cliente con id {payload.id_cliente} no existe en la BD."
        )
    # CLIENTE sí existe, se crea la ORDEN
    orden = Orden(
        consecutivo=_get_next_consecutivo(),
        tipo=payload.tipo,
        id_cliente=payload.id_cliente
    )
    db_orden[orden.consecutivo] = orden
    cliente_existente = db_cliente[payload.id_cliente]
    cliente_existente.ordenes.append(orden)
    return orden

# encontrar ORDEN mediante su CONSECUTIVO
@router.get("/ordenes/{orden_consecutivo}", response_model=Orden)
def get_orden(orden_consecutivo: int) -> Orden:
    orden = db_orden.get(orden_consecutivo)
    if not orden:
        raise HTTPException(status_code=404, detail="ORDEN no encontrada, revise el CONSECUTIVO")
    return orden

# Actualizar ORDEN mediante su CONSECUTIVO
@router.put("/ordenes/{orden_consecutivo}")
def actualizar_orden(orden_consecutivo: int, orden_data: UpdateOrden):
    orden = db_orden.get(orden_consecutivo)
    if not orden:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    cliente_anterior = orden.id_cliente
    actualizar = orden_data.model_dump(exclude_unset=True)
    if not actualizar:
        return Response(status_code=304)
    if 'id_cliente' in actualizar:
        id_cliente_a_validar = actualizar['id_cliente']
        if id_cliente_a_validar != cliente_anterior:
            cliente_nuevo = db_cliente.get(id_cliente_a_validar)
            if not cliente_nuevo:
                raise HTTPException(status_code=404, detail=f"El Cliente con ID '{id_cliente_a_validar}' no fue encontrado")
            cliente_original = db_cliente.get(cliente_anterior)
            if cliente_original:
                cliente_original.ordenes = [o for o in cliente_original.ordenes if o.consecutivo != orden_consecutivo]
            orden.id_cliente = id_cliente_a_validar
            cliente_nuevo.ordenes.append(orden)
    for campo, valor in actualizar.items():
        setattr(orden, campo, valor)
    return orden

# Eliminar ORDEN mediante su CONSECUTIVO
@router.delete("/ordenes/{orden_consecutivo}", status_code=204)
def eliminar_orden(orden_consecutivo: int):
    orden = db_orden.get(orden_consecutivo)
    if not orden:
        raise HTTPException(status_code=404, detail="Orden no encontrada")
    id_cliente_asociado = orden.id_cliente
    del db_orden[orden_consecutivo]
    cliente = db_cliente.get(id_cliente_asociado)
    if cliente:
        cliente.ordenes = [o for o in cliente.ordenes if o.consecutivo != orden_consecutivo]
    return Response(status_code=204)
