from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.emergency import router as emergency_router


app = FastAPI(
    title="EmergeSense AI API",
    description="Backend API for the EmergeSense AI Emergency Response System",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(emergency_router)


@app.get("/")
def root():
    return {
        "message": "EmergeSense AI Backend is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }