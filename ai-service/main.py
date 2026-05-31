from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
import logging
from dotenv import load_dotenv
from datetime import datetime
from app.detection.detector import person_detector

load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("AI Service starting up...")
    
    # Initialize person detector
    if not person_detector.initialize():
        logger.error("Failed to initialize person detector")
    else:
        logger.info("Person detector initialized successfully")
    
    yield
    
    # Shutdown
    logger.info("AI Service shutting down...")

app = FastAPI(
    title="Store Intelligence AI Service",
    description="AI-Powered Retail CCTV Analytics",
    version="2.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("BACKEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.get("/health/detailed")
async def health_detailed():
    """Detailed health check"""
    detector_status = person_detector.get_status()
    
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "ai-service",
        "version": "2.0.0",
        "detector": detector_status
    }

@app.post("/api/detection/detect")
async def detect_video(request: dict):
    """
    Run detection on a video.
    
    Request body:
    {
        "cameraId": "CAM1",
        "videoPath": "/path/to/video.mp4",
        "maxFrames": 100 (optional)
    }
    """
    try:
        camera_id = request.get("cameraId")
        video_path = request.get("videoPath")
        max_frames = request.get("maxFrames")
        
        if not camera_id or not video_path:
            raise HTTPException(
                status_code=400,
                detail="cameraId and videoPath are required"
            )
        
        logger.info(f"Starting detection for {camera_id}: {video_path}")
        
        result = person_detector.detect_video(
            video_path=video_path,
            camera_id=camera_id,
            max_frames=max_frames
        )
        
        return {
            "success": True,
            "data": result
        }
    
    except Exception as e:
        logger.error(f"Detection error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Detection failed: {str(e)}"
        )

@app.get("/api/detection/status")
async def detection_status():
    """Get detector status"""
    try:
        status = person_detector.get_status()
        return {
            "success": True,
            "data": status
        }
    except Exception as e:
        logger.error(f"Status error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get status: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
