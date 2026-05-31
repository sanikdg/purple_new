"""Video processor for reading frames and running detection."""

import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
import cv2
import numpy as np
from .inference import inference_engine, Detection

logger = logging.getLogger(__name__)


class FrameProcessor:
    """Processes video frames and generates detection results."""

    def __init__(self):
        """Initialize frame processor."""
        self.current_video_path: Optional[str] = None
        self.total_frames: int = 0
        self.fps: float = 0
        self.frame_count: int = 0

    def open_video(self, video_path: str) -> bool:
        """
        Open video file.

        Args:
            video_path: Path to video file

        Returns:
            True if successful, False otherwise
        """
        try:
            cap = cv2.VideoCapture(video_path)

            if not cap.isOpened():
                logger.error(f"Failed to open video: {video_path}")
                return False

            self.current_video_path = video_path
            self.total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            self.fps = cap.get(cv2.CAP_PROP_FPS)
            self.frame_count = 0

            logger.info(
                f"Video opened: {video_path} ({self.total_frames} frames, {self.fps} fps)"
            )
            cap.release()
            return True

        except Exception as e:
            logger.error(f"Error opening video: {str(e)}")
            return False

    def process_video(
        self,
        video_path: str,
        camera_id: str,
        max_frames: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        Process video and detect persons.

        Args:
            video_path: Path to video file
            camera_id: Camera identifier
            max_frames: Maximum frames to process (None = all)

        Returns:
            Dictionary with detection results
        """
        try:
            cap = cv2.VideoCapture(video_path)

            if not cap.isOpened():
                raise ValueError(f"Cannot open video: {video_path}")

            # Get video properties
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            fps = cap.get(cv2.CAP_PROP_FPS)
            frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

            logger.info(
                f"Processing video: {camera_id} ({total_frames} frames, {fps} fps)"
            )

            all_detections = []
            frame_number = 0
            processed_frames = 0

            while True:
                ret, frame = cap.read()

                if not ret:
                    break

                # Check max frames limit
                if max_frames and processed_frames >= max_frames:
                    break

                try:
                    # Run detection
                    detections = inference_engine.detect_persons(frame)

                    # Create frame result
                    frame_timestamp = datetime.utcnow().isoformat() + "Z"
                    frame_result = {
                        "cameraId": camera_id,
                        "frameNumber": frame_number,
                        "timestamp": frame_timestamp,
                        "detections": [d.to_dict() for d in detections],
                        "personCount": len(detections),
                    }

                    all_detections.append(frame_result)
                    processed_frames += 1

                    if processed_frames % 30 == 0:
                        logger.info(
                            f"Processed {processed_frames} frames for {camera_id}"
                        )

                except Exception as e:
                    logger.error(
                        f"Error processing frame {frame_number}: {str(e)}"
                    )

                frame_number += 1

            cap.release()

            # Calculate statistics
            total_persons_detected = sum(
                d["personCount"] for d in all_detections
            )
            frames_with_persons = sum(
                1 for d in all_detections if d["personCount"] > 0
            )

            result = {
                "cameraId": camera_id,
                "videoPath": video_path,
                "totalFrames": total_frames,
                "processedFrames": processed_frames,
                "fps": fps,
                "resolution": f"{frame_width}x{frame_height}",
                "totalPersonsDetected": total_persons_detected,
                "framesWithPersons": frames_with_persons,
                "detectionRate": (
                    round(frames_with_persons / processed_frames * 100, 2)
                    if processed_frames > 0
                    else 0
                ),
                "detections": all_detections,
            }

            logger.info(
                f"Video processing complete: {processed_frames} frames, "
                f"{total_persons_detected} persons detected"
            )

            return result

        except Exception as e:
            logger.error(f"Error processing video: {str(e)}")
            raise
        finally:
            cap.release()

    def process_frame(
        self, frame: np.ndarray, camera_id: str, frame_number: int
    ) -> Dict[str, Any]:
        """
        Process a single frame.

        Args:
            frame: Input frame
            camera_id: Camera identifier
            frame_number: Frame number

        Returns:
            Dictionary with detection results
        """
        try:
            detections = inference_engine.detect_persons(frame)

            frame_timestamp = datetime.utcnow().isoformat() + "Z"
            result = {
                "cameraId": camera_id,
                "frameNumber": frame_number,
                "timestamp": frame_timestamp,
                "detections": [d.to_dict() for d in detections],
                "personCount": len(detections),
            }

            return result

        except Exception as e:
            logger.error(f"Error processing frame: {str(e)}")
            raise


# Singleton instance
frame_processor = FrameProcessor()
