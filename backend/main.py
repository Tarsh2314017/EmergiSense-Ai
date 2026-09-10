from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="EmergeSense AI API",
    description="Backend API for the EmergeSense AI Emergency Response System",
    version="1.0.0",
)

# Allow the React frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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