from fastapi import APIRouter, HTTPException, Response, Query, status
from typing import Dict, List, Union
from app.models.schemas import Cliente, CrearCliente

router = APIRouter(prefix="", tags=["clientes"])

# Simple in-memory store
db_cliente: Dict[int, Cliente] = {}

# creacion de instacia de la clase CLIENTE
@router.post("/cliente", response_model=Cliente, status_code=201)
def crear_cliente(payload: CrearCliente) -> Cliente:
    if payload.id in db_cliente:
        raise HTTPException(status_code=409, detail="CLIENTE ya existe en la BD")
    cliente = Cliente(id=payload.id, nombre=payload.nombre, email=payload.email, contacto=payload.contacto, direccion=payload.direccion)
    db_cliente[cliente.id] = cliente
    return cliente
    
# listar todos los CLIENTES
@router.get("/cliente", response_model=List[Cliente])
def list_clientes() -> List[Cliente]:
    return list(db_cliente.values())