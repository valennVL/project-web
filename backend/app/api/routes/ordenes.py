from fastapi import APIRouter, HTTPException, Response, Query, status
from typing import Dict, List, Union
from app.models.schemas import Orden, CrearOrden, UpdateOrden
from app.api.routes.clientes import db_cliente

router = APIRouter(prefix="", tags=["ordenes"])

# Simple in-memory store
db_orden: Dict[int, Orden] = {}

# asigna CONSECUTIVO de la entidad ORDEN
_next_consecutivo: int = 1
def _get_next_consecutivo() -> int:
    global _next_consecutivo
    nid = _next_consecutivo
    _next_consecutivo += 1
    return nid

# creacion de instancia de la clase ORDEN
@router.post("/orden", response_model=Orden, status_code=201)
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
    return orden

# encontrar ORDEN mediante su CONSECUTIVO
@router.get("/orden/{orden_consecutivo}", response_model=Orden)
def get_orden(orden_consecutivo: int) -> Orden:
    orden = db_orden.get(orden_consecutivo)
    if not orden:
        raise HTTPException(status_code=404, detail="ORDEN no encontrada, revise el CONSECUTIVO")
    return orden

# Actualizar ORDEN mediante su CONSECUTIVO
@router.put("/orden/{orden_consecutivo}")
def actualizar_orden(orden_consecutivo: int, orden_data: UpdateOrden):
    for orden_id, orden in db_orden.items():
        if orden_id == orden_consecutivo:
            actualizar = orden_data.model_dump(exclude_unset=True)
            if not actualizar:
                return Response(status_code=304)
            if 'id_cliente' in actualizar:
                id_cliente_a_validar = actualizar['id_cliente']
                if id_cliente_a_validar not in db_cliente:
                    raise HTTPException(status_code=404, detail=f"El Cliente con ID '{id_cliente_a_validar}' no fue encontrado")
            for campo, valor in actualizar.items():
                setattr(orden, campo, valor)
            return orden
    raise HTTPException(status_code=404, detail="Orden no encontrada")


# Eliminar ORDEN mediante su CONSECUTIVO
@router.delete("/orden/{orden_consecutivo}", status_code=204)
def eliminar_orden_con_dict(orden_consecutivo: int):
    global db_orden
    if orden_consecutivo in db_orden:
        del db_orden[orden_consecutivo]
        return None
    else:
        raise HTTPException(status_code=404, detail="Orden no encontrada")