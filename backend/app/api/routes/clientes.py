from fastapi import APIRouter, HTTPException, Response, Query, status
from typing import Dict, List, Union
from app.models.schemas import Cliente, CrearCliente, Orden
from app.api.routes.bases import db_cliente, db_orden

router = APIRouter(prefix="", tags=["clientes"])

# creacion de instacia de la clase CLIENTE
@router.post("/clientes", response_model=Cliente, status_code=201)
def crear_cliente(payload: CrearCliente) -> Cliente:
    if payload.id in db_cliente:
        raise HTTPException(status_code=409, detail="CLIENTE ya existe en la BD")
    cliente = Cliente(id=payload.id, nombre=payload.nombre, email=payload.email, contacto=payload.contacto, direccion=payload.direccion)
    db_cliente[cliente.id] = cliente
    return cliente
    
# listar todos los CLIENTES
@router.get("/clientes", response_model=List[Cliente])
def list_clientes() -> List[Cliente]:
    return list(db_cliente.values())

# listar todos los Clientes y sus ORDENES
@router.get("/clientes/{cliente_id}/ordenes", response_model=List[Orden])
def get_ordenes_cliente(cliente_id: int) -> List[Orden]:
    cliente = db_cliente.get(cliente_id)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado en la BD")
    if not hasattr(cliente, 'ordenes') or not cliente.ordenes:
        return []
    return cliente.ordenes
