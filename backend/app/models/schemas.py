from pydantic import BaseModel, EmailStr, Field
from typing import Literal, List

#Entidad ORDEN
class Orden(BaseModel):
    consecutivo: int
    tipo: str
    id_cliente: int 
    #mantenimientos: List[Mantenimiento] 

class CrearOrden(BaseModel):
    tipo: Literal["Mantenimiento", "Venta", "Mixto"]
    id_cliente: int

class UpdateOrden(BaseModel):
    id_cliente: int | None = None

    # Entidad CLIENTE
class Cliente(BaseModel):
    id: int
    nombre: str
    email: EmailStr
    contacto: int
    direccion:  str | None = None
    ordenes: List[Orden] = []

class CrearCliente(BaseModel):
    id: int = Field(..., ge=100000, description="El documento debe tener al menos 6 digitos")
    nombre: str = Field(..., min_length=1, description="Digitar un Nombre y/o Apellido")
    email: EmailStr = Field(description="Agregar correo electronico")
    contacto: int = Field(..., ge=300000000,description="Numero telefonico requerido")
    direccion:  str | None = None
