import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, Response

from backend.database import engine, Base, SessionLocal
from backend.seed_data import seed_database
from backend.routes_api import router as api_router

# Initialize database schema
Base.metadata.create_all(bind=engine)

# Seed database on start
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(
    title="TRAVORA — Dynamic Tour Intelligence Platform",
    description="Plan Freely. Travel Personally. Adapt Instantly.",
    version="1.0.0"
)

# Enable CORS for flexible local development and API access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router)

# Mount static folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DIR = os.path.join(BASE_DIR, "static")

if not os.path.exists(STATIC_DIR):
    os.makedirs(STATIC_DIR, exist_ok=True)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

js_dir = os.path.join(STATIC_DIR, "js")
if os.path.exists(js_dir):
    app.mount("/js", StaticFiles(directory=js_dir), name="js")

css_dir = os.path.join(STATIC_DIR, "css")
if os.path.exists(css_dir):
    app.mount("/css", StaticFiles(directory=css_dir), name="css")

assets_dir = os.path.join(STATIC_DIR, "assets")
if os.path.exists(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

@app.get("/favicon.ico")
def serve_favicon():
    favicon_path = os.path.join(STATIC_DIR, "assets", "logo", "travora_emblem.png")
    if os.path.exists(favicon_path):
        return FileResponse(favicon_path, media_type="image/png")
    return Response(status_code=204)

@app.get("/")
@app.get("/traveller")
@app.get("/operator")
@app.get("/corporate")
@app.get("/admin")
@app.get("/weather-twin")
def serve_index():
    index_path = os.path.join(STATIC_DIR, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "TRAVORA API is running. Static frontend assets are loading."}

@app.get("/mobile")
@app.get("/mobile-view")
def serve_mobile_view():
    mobile_path = os.path.join(STATIC_DIR, "mobile.html")
    if os.path.exists(mobile_path):
        return FileResponse(mobile_path)
    index_path = os.path.join(STATIC_DIR, "index.html")
    return FileResponse(index_path)

@app.get("/api/system/network-info")
def get_network_info():
    import socket
    local_ip = "127.0.0.1"
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        local_ip = s.getsockname()[0]
        s.close()
    except Exception:
        pass
    return {
        "local_ip": local_ip,
        "desktop_port": 8000,
        "mobile_port": 8001,
        "desktop_url": f"http://{local_ip}:8000",
        "mobile_url": f"http://{local_ip}:8001",
        "mobile_localhost": "http://localhost:8001",
        "desktop_localhost": "http://localhost:8000",
    }

@app.get("/db-view")
@app.get("/database")
def serve_database_view():
    db_html_path = os.path.join(BASE_DIR, "DATABASE_VIEW.html")
    if os.path.exists(db_html_path):
        return FileResponse(db_html_path)
    return {"message": "Database view not generated yet. Run export_database_view.py"}

