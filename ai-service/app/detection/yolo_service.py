"""YOLO service for loading and managing the YOLOv8n model."""

import logging
from typing import Optional
from ultralytics import YOLO
import torch

logger = logging.getLogger(__name__)


class YOLOService:
    """Service for managing YOLOv8n model lifecycle."""

    _instance: Optional["YOLOService"] = None
    _model: Optional[YOLO] = None

    def __new__(cls):
        """Singleton pattern to ensure only one model instance."""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        """Initialize YOLO service."""
        self.model = None
        self.device = None
        self.confidence_threshold = 0.5

    def load_model(
        self,
        model_name: str = "yolov8n.pt",
        device: str = "cpu",
        confidence: float = 0.5,
    ) -> YOLO:
        """
        Load YOLOv8n model.

        Args:
            model_name: Model name (default: yolov8n.pt)
            device: Device to use (cpu/cuda)
            confidence: Confidence threshold for detections

        Returns:
            Loaded YOLO model
        """
        try:
            # Check if CUDA is available
            if device == "cuda" and not torch.cuda.is_available():
                logger.warning("CUDA not available, falling back to CPU")
                device = "cpu"

            logger.info(f"Loading YOLOv8n model on {device}...")
            self.model = YOLO(model_name)
            self.model.to(device)
            self.device = device
            self.confidence_threshold = confidence

            logger.info(f"Model loaded successfully on {device}")
            return self.model

        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            raise

    def get_model(self) -> YOLO:
        """
        Get the loaded model.

        Returns:
            Loaded YOLO model

        Raises:
            RuntimeError: If model is not loaded
        """
        if self.model is None:
            raise RuntimeError("Model not loaded. Call load_model() first.")
        return self.model

    def is_loaded(self) -> bool:
        """Check if model is loaded."""
        return self.model is not None

    def set_confidence(self, confidence: float) -> None:
        """Set confidence threshold."""
        if not 0 <= confidence <= 1:
            raise ValueError("Confidence must be between 0 and 1")
        self.confidence_threshold = confidence
        logger.info(f"Confidence threshold set to {confidence}")

    def get_device(self) -> str:
        """Get current device."""
        return self.device or "cpu"


# Singleton instance
yolo_service = YOLOService()
