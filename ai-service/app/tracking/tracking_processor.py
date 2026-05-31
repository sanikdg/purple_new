"""Tracking processor for video processing with tracking."""

import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
import cv2
import numpy as np
from ..detection.inference import inference_engine
from .bytetrack_service import bytetrack_service
from .track_manager import track_manager

logger = logging.getLogger(__name__)


class TrackingProcessor:
    """Processes video with detection and tracking."""

    def __init__(self):
        """Initialize tracking processor."""
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
        Process video with detection and tracking.

        Args:
            video_path: Path to video file
            camera_id: Camera identifier
            max_frames: Maximum frames to process (None = all)

        Returns:
            Dictionary with tracking results
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
                f"Processing video with tracking: {camera_id} ({total_frames} frames, {fps} fps)"
            )

            # Reset tracking state
            bytetrack_service.reset()
            track_manager.reset()

            all_tracks = []
            frame_number = 0
            processed_frames = 0
            max_concurrent_tracks = 0

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

                    # Convert detections to ByteTrack format
                    detection_list = [d.to_dict() for d in detections]

                    # Update tracks
                    active_tracks = bytetrack_service.update(detection_list)

                    # Process tracks and manage sessions
                    sessions = track_manager.process_tracks(
                        active_tracks, camera_id, frame_number
                    )

                    # Create frame result
                    frame_timestamp = datetime.utcnow().isoformat() + "Z"
                    frame_result = {
                        "cameraId": camera_id,
                        "frameNumber": frame_number,
                        "timestamp": frame_timestamp,
                        "detectionCount": len(detections),
                        "trackCount": len(active_tracks),
                        "sessionCount": len(sessions),
                        "tracks": active_tracks,
                        "sessions": sessions,
                    }

                    all_tracks.append(frame_result)
                    processed_frames += 1
                    max_concurrent_tracks = max(
                        max_concurrent_tracks, len(active_tracks)
                    )

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

            # Get final statistics
            final_sessions = track_manager.get_all_sessions(camera_id)
            session_stats = track_manager.get_session_stats(camera_id)

            result = {
                "cameraId": camera_id,
                "videoPath": video_path,
                "totalFrames": total_frames,
                "processedFrames": processed_frames,
                "fps": fps,
                "resolution": f"{frame_width}x{frame_height}",
                "maxConcurrentTracks": max_concurrent_tracks,
                "totalVisitors": len(final_sessions),
                "sessionStats": session_stats,
                "trackingResults": all_tracks,
                "visitorSessions": final_sessions,
            }

            logger.info(
                f"Video processing complete: {processed_frames} frames, "
                f"{len(final_sessions)} visitors tracked"
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
        Process a single frame with tracking.

        Args:
            frame: Input frame
            camera_id: Camera identifier
            frame_number: Frame number

        Returns:
            Dictionary with tracking results
        """
        try:
            # Run detection
            detections = inference_engine.detect_persons(frame)

            # Convert detections to ByteTrack format
            detection_list = [d.to_dict() for d in detections]

            # Update tracks
            active_tracks = bytetrack_service.update(detection_list)

            # Process tracks and manage sessions
            sessions = track_manager.process_tracks(
                active_tracks, camera_id, frame_number
            )

            frame_timestamp = datetime.utcnow().isoformat() + "Z"
            result = {
                "cameraId": camera_id,
                "frameNumber": frame_number,
                "timestamp": frame_timestamp,
                "detectionCount": len(detections),
                "trackCount": len(active_tracks),
                "sessionCount": len(sessions),
                "tracks": active_tracks,
                "sessions": sessions,
            }

            return result

        except Exception as e:
            logger.error(f"Error processing frame: {str(e)}")
            raise


# Singleton instance
tracking_processor = TrackingProcessor()
