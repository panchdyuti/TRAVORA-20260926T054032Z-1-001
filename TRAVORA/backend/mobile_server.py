import os
import sys
import socket
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, Response

# Ensure root directory is in sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from backend.database import engine, Base, SessionLocal
from backend.seed_data import seed_database
from backend.routes_api import router as api_router

# Ensure database is initialized
Base.metadata.create_all(bind=engine)

STATIC_DIR = os.path.join(BASE_DIR, "static")

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

mobile_app = FastAPI(
    title="TRAVORA Mobile 9:16 Studio",
    description="Dedicated Mobile Localhost Server for TRAVORA with 9:16 Aspect Ratio Viewport",
    version="1.0.0"
)

# Enable CORS for flexible development and cross-port calls
mobile_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include core API routes so all DB/AI/Auth features work identically
mobile_app.include_router(api_router)

# Mount static folder
if not os.path.exists(STATIC_DIR):
    os.makedirs(STATIC_DIR, exist_ok=True)

mobile_app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@mobile_app.get("/favicon.ico")
def serve_favicon():
    favicon_path = os.path.join(STATIC_DIR, "assets", "logo", "travora_emblem.png")
    if os.path.exists(favicon_path):
        return FileResponse(favicon_path, media_type="image/png")
    return Response(status_code=204)

@mobile_app.get("/api/system/network-info")
def get_network_info():
    local_ip = get_local_ip()
    return {
        "local_ip": local_ip,
        "desktop_port": 8000,
        "mobile_port": 8001,
        "desktop_url": f"http://{local_ip}:8000",
        "mobile_url": f"http://{local_ip}:8001",
        "mobile_localhost": "http://localhost:8001",
        "desktop_localhost": "http://localhost:8000",
    }

# Root serves the Mobile 9:16 Studio Simulator
@mobile_app.get("/")
def serve_mobile_root():
    mobile_path = os.path.join(STATIC_DIR, "mobile.html")
    if os.path.exists(mobile_path):
        return FileResponse(mobile_path)
    index_path = os.path.join(STATIC_DIR, "index.html")
    return FileResponse(index_path)

# Direct standalone mobile app view without outer chassis (for physical devices or pure iframe)
@mobile_app.get("/app")
@mobile_app.get("/standalone")
@mobile_app.get("/traveller")
@mobile_app.get("/operator")
@mobile_app.get("/corporate")
@mobile_app.get("/admin")
@mobile_app.get("/weather-twin")
def serve_standalone_app():
    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "TRAVORA App is loading..."}

@mobile_app.get("/mobile")
@mobile_app.get("/mobile-view")
def serve_mobile_view():
    mobile_path = os.path.join(STATIC_DIR, "mobile.html")
    if os.path.exists(mobile_path):
        return FileResponse(mobile_path)
    index_path = os.path.join(STATIC_DIR, "index.html")
    return FileResponse(index_path)

@mobile_app.get("/db-view")
@mobile_app.get("/database")
def serve_database_view():
    db_html_path = os.path.join(BASE_DIR, "DATABASE_VIEW.html")
    if os.path.exists(db_html_path):
        return FileResponse(db_html_path)
    return {"message": "Database view not generated yet. Run export_database_view.py"}
