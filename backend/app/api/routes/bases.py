from typing import Dict
from app.models.schemas import Cliente, Orden

# Simple in-memory store
db_cliente: Dict[int, Cliente] = {}
db_orden: Dict[int, Orden] = {}