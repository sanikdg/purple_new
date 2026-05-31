"""Main detector module coordinating YOLO detection pipeline."""

import logging
import os
from typing import Dict, Any, Optional
from .yolo_service import yolo_service
from .inference import inference_engine
from .video_processor import frame_processor

logger = logging.getLogger(__name__)


class PersonDetector:
    """Main detector class for person detection pipeline."""

    def __init__(self):
        """Initialize person detector."""
        self.is_initialized = False
        self.model_path = os.getenv("MODEL_PATH", "yolov8n.pt")
        self.confidence_threshold = float(os.getenv("CONFIDENCE_THRESHOLD", "0.5"))
        self.device = os.getenv("DEVICE", "cpu")

    def initialize(self) -> bool:
        """
        Initialize the detector.

        Returns:
            True if successful, False otherwise
        """
        try:
            logger.info("Initializing PersonDetector...")

            # Load YOLO model
            yolo_service.load_model(
                model_name=self.model_path,
                device=self.device,
                confidence=self.confidence_threshold,
            )

            # Initialize inference engine
            inference_engine.initialize()

            self.is_initialized = True
            logger.info("PersonDetector initialized successfully")
            return True

        except Exception as e:
            logger.error(f"Failed to initialize PersonDetector: {str(e)}")
            return False

    def detect_video(
        self,
        video_path: str,
        camera_id: str,
        max_frames: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        Detect persons in a video.

        Args:
            video_path: Path to video file
            camera_id: Camera identifier
            max_frames: Maximum frames to process

        Returns:
            Detection results
        """
        if not self.is_initialized:
            raise RuntimeError("Detector not initialized")

        try:
            logger.info(f"Starting detection for {camera_id}: {video_path}")
            result = frame_processor.process_video(
                video_path=video_path,
                camera_id=camera_id,
                max_frames=max_frames,
            )
            logger.info(f"Detection complete for {camera_id}")
            return result

        except Exception as e:
            logger.error(f"Error detecting video: {str(e)}")
            raise

    def get_status(self) -> Dict[str, Any]:
        """
        Get detector status.

        Returns:
            Status information
        """
        return {
            "initialized": self.is_initialized,
            "modelPath": self.model_path,
            "confidenceThreshold": self.confidence_threshold,
            "device": self.device,
            "modelLoaded": yolo_service.is_loaded(),
        }

    def set_confidence(self, confidence: float) -> None:
        """Set confidence threshold."""
        if not 0 <= confidence <= 1:
            raise ValueError("Confidence must be between 0 and 1")
        self.confidence_threshold = confidence
        yolo_service.set_confidence(confidence)
        logger.info(f"Confidence threshold updated to {confidence}")


# Singleton instance
person_detector = PersonDetector()
