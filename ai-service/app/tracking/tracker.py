"""Main tracker module coordinating tracking pipeline."""

import logging
import os
from typing import Dict, Any, Optional
from .bytetrack_service import bytetrack_service
from .track_manager import track_manager
from .tracking_processor import tracking_processor

logger = logging.getLogger(__name__)


class VisitorTracker:
    """Main tracker class for visitor tracking pipeline."""

    def __init__(self):
        """Initialize visitor tracker."""
        self.is_initialized = False
        self.max_age = int(os.getenv("TRACKER_MAX_AGE", "30"))
        self.min_hits = int(os.getenv("TRACKER_MIN_HITS", "3"))
        self.session_timeout = int(os.getenv("SESSION_TIMEOUT", "300"))

    def initialize(self) -> bool:
        """
        Initialize the tracker.

        Returns:
            True if successful, False otherwise
        """
        try:
            logger.info("Initializing VisitorTracker...")

            # Configure ByteTrack
            bytetrack_service.max_age = self.max_age
            bytetrack_service.min_hits = self.min_hits

            # Configure track manager
            track_manager.session_timeout = self.session_timeout

            self.is_initialized = True
            logger.info("VisitorTracker initialized successfully")
            return True

        except Exception as e:
            logger.error(f"Failed to initialize VisitorTracker: {str(e)}")
            return False

    def track_video(
        self,
        video_path: str,
        camera_id: str,
        max_frames: Optional[int] = None,
    ) -> Dict[str, Any]:
        """
        Track visitors in a video.

        Args:
            video_path: Path to video file
            camera_id: Camera identifier
            max_frames: Maximum frames to process

        Returns:
            Tracking results
        """
        if not self.is_initialized:
            raise RuntimeError("Tracker not initialized")

        try:
            logger.info(f"Starting tracking for {camera_id}: {video_path}")
            result = tracking_processor.process_video(
                video_path=video_path,
                camera_id=camera_id,
                max_frames=max_frames,
            )
            logger.info(f"Tracking complete for {camera_id}")
            return result

        except Exception as e:
            logger.error(f"Error tracking video: {str(e)}")
            raise

    def get_status(self) -> Dict[str, Any]:
        """
        Get tracker status.

        Returns:
            Status information
        """
        return {
            "initialized": self.is_initialized,
            "maxAge": self.max_age,
            "minHits": self.min_hits,
            "sessionTimeout": self.session_timeout,
            "activeTracksCount": len(bytetrack_service.tracks),
            "activeSessions": len(track_manager.get_active_sessions()),
        }

    def get_active_sessions(self, camera_id: Optional[str] = None) -> Dict[str, Any]:
        """Get active visitor sessions."""
        sessions = track_manager.get_active_sessions(camera_id)
        stats = track_manager.get_session_stats(camera_id)

        return {
            "sessions": sessions,
            "stats": stats,
        }

    def get_all_sessions(self, camera_id: Optional[str] = None) -> Dict[str, Any]:
        """Get all visitor sessions."""
        sessions = track_manager.get_all_sessions(camera_id)
        stats = track_manager.get_session_stats(camera_id)

        return {
            "sessions": sessions,
            "stats": stats,
        }

    def reset(self) -> None:
        """Reset tracker state."""
        bytetrack_service.reset()
        track_manager.reset()
        logger.info("Tracker reset")


# Singleton instance
visitor_tracker = VisitorTracker()
