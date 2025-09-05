# project-web
Web application for Radiadores Alejo, designed to manage inventory, sales, and maintenance services. The system supports product registration, tracking of spare parts (radiators, compressors, valves, hoses, condensers), and monitoring of repair and air conditioning maintenance services.
## Elevator pitch
Radiadores Alejo enfrenta dificultades en el control de inventarios y servicios de mantenimiento. Este proyecto desarrolla una aplicación web que permitirá gestionar repuestos, ventas y reparaciones de radiadores y aires acondicionados. La solución está orientada a optimizar la administración, reducir pérdidas y mejorar la trazabilidad del negocio.
## Usuarios y segmentos
Administradores internos: personal de la empresa encargado de gestionar inventario, registrar ventas, controlar repuestos y dar seguimiento a los mantenimientos.
## Casos de uso principales
-Registrar y actualizar inventario (radiadores, compresores, válvulas, mangueras, condensadores).
-Controlar ventas y salidas de repuestos.
-Agendar y registrar mantenimientos/reparaciones.
-Consultar stock en tiempo real.
## Objetivos 
-Centralizar la gestión de inventario y servicios.
-Reducir errores manuales en registros.
-Dar visibilidad en tiempo real de existencias.
## No objetivos
-No manejar facturación electrónica.
-No implementar pagos en línea en esta versión.

## Instalacion **uv** (fast Python packaging)
- Windows (PowerShell):
```powershell
powershell -ExecutionPolicy Bypass -c "irm https://astral.sh/uv/install.ps1 | iex"
uv --version
```
- macOS/Linux:
```bash
curl -Ls https://astral.sh/uv/install.sh | sh
# then restart your shell or:
source ~/.cargo/env 2>/dev/null || true
uv --version
```

## Instrucciones para ejecutar backend_FastAPI (port 8000)

```bash
Paso 1. (dirigirse al directorio ded backend).
cd backend

Paso 2. (creacion y gestión de entorno virtual).
uv venv .venv
En PowerShell: .venv\Scripts\Activate
# Para macOS/Linux:
# source .venv/bin/activate

Paso 3. Instalación de dependencias necesarias.
uv pip install -r requirements.txt

Paso 4. Ejecutar servicdor
uv run uvicorn app.main:app --reload --port 8000

Paso 5. Probar
http://127.0.0.1:8000/docs
```

## Instrucciones para ejecutar Frontend — React (Vite, port 5173)
```bash
cd frontend
npm install
npm run dev
# open http://localhost:5173
```

## MODELADO DE DATOS MRD

  +----------------+             +-----------+
  |     Orden      |             |  Cliente  |
  | consecutivo PK |  n        1 | id PK     |
  | tipo           |<------------| nombre    |
  | id_cliente FK  |             | email     |
  +----------------+             | Contacto  |
      1 |       | 1              | direccion |
        |       |                +-----------+
        |       | 
        |       |                +------------------+
        |       |                |   Mantenimiento  |       +---------------+
        |       |                | numero PK        |       |    Tecnico    |
        |       |             n  | tipo             | 1     | id            |
        |       | -------------->| descripcion      |------>| nombre        |
        |                        | finalizacion     |     n | especialidad  |
        |                        | precio           |       +---------------+
        |                        | consecutivo FK   |
        |                        +------------------+
        |  n
         >
  +-----------------+                                    +------------+
  |      Venta      |        +------------------+        |  Articulo  |
  | numero PK       | 1    n |      Detalle     |      n | id         |
  | consecutivo FK  |------->| numero_venta PK  |<-------| nombre     |
  | fecha           |        | id_articulo  PK  |1       | precio     |
  +-----------------+        +------------------+        | Existencia |
                                                         +------------+

## TABLA DE API
| Método | Ruta                 | Query/Body                                 | Respuestas (códigos)                       | Notas/Validaciones |
|-------:|----------------------|--------------------------------------------|--------------------------------------------|--------------------|
| POST   | /clientes            | `{id, nombre...}`                          | 201 (Location), 409 (duplicado), 422       | Regla unicidad     |
| PUT    | /clientes/{id}       | `{id, nombre...}`(parcial o completo)      | 200, 404, 409, 422 			  | Validaciones       |
| GET    | /clientes/{id}       | —                                          | 200, 404                                   | —                  |
| GET    | /clientes            | q, order, offset, limit                    | 200 (lista) + `Total-Count_clientes`       | Filtros y orden    |
| DELETE | /clientes/{id}       | —                                          | 204, 404                                   | —                  |
|        |                      |                                            |                                            |                    |
| POST   | /ordenes             | `{tipo...}`                                | 201 (Location), 422, 409 (conflicto)       | Regla unicidad     |
| PUT    | /ordenes/{id}        | `{id, nombre...}`(parcial o completo)      | 200, 404, 422     			  | Validaciones       |
| GET    | /ordenes/{id}        | —                                          | 200, 404                                   | —                  |
| GET    | /ordenes             | q, offset, limit                           | 200 (lista) + `Total-Count_ordenes`        | Filtros y orden    |
| DELETE | /ordenes/{id}        | —                                          | 204, 404                                   | —                  |
|        |                      |                                            |                                            |                    |
| POST   | /ventas              | `{...}`                                    | 201 (Location), 422, 409 (conflicto)       | Regla unicidad     |
| GET    | /ventas/{id}         | —                                          | 200, 404                                   | —                  |
| GET    | /ventas              | q, order, offset, limit                    | 200 (lista) + `Total-Count_ventas`         | Filtros y orden    |
| DELETE | /ventas/{id}         | —                                          | 204, 404                                   | —                  |
|        |                      |                                            |                                            |                    |
| POST   | /mantenimientos      | `{tipo, Descripcion...}`                   | 201 (Location), 409 (conflicto), 422       | Regla unicidad     |
| PUT    | /mantenimientos/{id} | `{...}` (parcial o completo)               | 200, 404, 409, 422 			  | Validaciones       |
| GET    | /mantenimientos/{id} | —                                          | 200, 404                                   | —                  |
| GET    | /mantenimientos      | q, order, offset, limit                    | 200 (lista) + `Total-Count_mantenimientos` | Filtros y orden    |
| DELETE | /mantenimientos/{id} | —                                          | 204, 404                                   | —                  |
|        |                      |                                            |                                            |                    |
| POST   | /articulos           | `{id, nombre...}`                          | 201 (Location), 409 (duplicado), 422       | Regla unicidad     |
| PUT    | /articulos/{id}      | `{id, nombre...}`(parcial o completo)      | 200, 404, 409, 422 			  | Validaciones       |
| GET    | /articulos/{id}      | —                                          | 200, 404                                   | —                  |
| GET    | /articulos           | q, order, offset, limit                    | 200 (lista) + `Total-Count_articulos`      | Filtros y orden    |
| DELETE | /articulos/{id}      | —                                          | 204, 404                                   | —                  |
