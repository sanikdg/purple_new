"""Inference module for running YOLO detections."""

import logging
from typing import List, Dict, Any
import cv2
import numpy as np
from .yolo_service import yolo_service

logger = logging.getLogger(__name__)


class Detection:
    """Represents a single detection result."""

    def __init__(
        self,
        class_name: str,
        confidence: float,
        x1: int,
        y1: int,
        x2: int,
        y2: int,
    ):
        """
        Initialize detection.

        Args:
            class_name: Class name (e.g., 'person')
            confidence: Confidence score (0-1)
            x1: Top-left x coordinate
            y1: Top-left y coordinate
            x2: Bottom-right x coordinate
            y2: Bottom-right y coordinate
        """
        self.class_name = class_name
        self.confidence = confidence
        self.x1 = int(x1)
        self.y1 = int(y1)
        self.x2 = int(x2)
        self.y2 = int(y2)

    def to_dict(self) -> Dict[str, Any]:
        """Convert detection to dictionary."""
        return {
            "class": self.class_name,
            "confidence": round(self.confidence, 4),
            "bbox": {
                "x1": self.x1,
                "y1": self.y1,
                "x2": self.x2,
                "y2": self.y2,
            },
        }


class InferenceEngine:
    """Engine for running YOLO inference on frames."""

    def __init__(self):
        """Initialize inference engine."""
        self.model = None

    def initialize(self) -> None:
        """Initialize the inference engine with loaded model."""
        self.model = yolo_service.get_model()
        logger.info("Inference engine initialized")

    def detect_persons(self, frame: np.ndarray) -> List[Detection]:
        """
        Detect persons in a frame.

        Args:
            frame: Input frame (numpy array)

        Returns:
            List of Detection objects for persons only
        """
        if self.model is None:
            raise RuntimeError("Inference engine not initialized")

        try:
            # Run inference
            results = self.model(
                frame,
                conf=yolo_service.confidence_threshold,
                verbose=False,
            )

            detections = []

            # Extract person detections only
            for result in results:
                if result.boxes is not None:
                    for box in result.boxes:
                        # Get class name
                        class_id = int(box.cls[0])
                        class_name = result.names[class_id]

                        # Only keep person detections
                        if class_name.lower() == "person":
                            confidence = float(box.conf[0])
                            x1, y1, x2, y2 = box.xyxy[0]

                            detection = Detection(
                                class_name="person",
                                confidence=confidence,
                                x1=x1,
                                y1=y1,
                                x2=x2,
                                y2=y2,
                            )
                            detections.append(detection)

            return detections

        except Exception as e:
            logger.error(f"Error during inference: {str(e)}")
            raise

    def detect_persons_batch(
        self, frames: List[np.ndarray]
    ) -> List[List[Detection]]:
        """
        Detect persons in multiple frames.

        Args:
            frames: List of input frames

        Returns:
            List of detection lists, one per frame
        """
        batch_results = []
        for frame in frames:
            detections = self.detect_persons(frame)
            batch_results.append(detections)
        return batch_results


# Singleton instance
inference_engine = InferenceEngine()
