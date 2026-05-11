from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.menu import router as menu_router

app = FastAPI(title="Restaurant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(menu_router)