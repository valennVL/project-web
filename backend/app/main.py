from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import ALLOWED_ORIGINS
from app.api.routes import ordenes as ordenes_router
from app.api.routes import clientes as clientes_router

app = FastAPI(title="Library API")

# CORS (para que React pueda llamar a la API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rutas
app.include_router(ordenes_router.router)
app.include_router(clientes_router.router)