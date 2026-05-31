"""Track manager for managing visitor sessions and track lifecycle."""

import logging
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from collections import defaultdict

logger = logging.getLogger(__name__)


class VisitorSession:
    """Represents a visitor session across frames."""

    def __init__(self, visitor_id: str, track_id: str, camera_id: str):
        """
        Initialize visitor session.

        Args:
            visitor_id: Unique visitor identifier
            track_id: Associated track ID
            camera_id: Camera identifier
        """
        self.visitor_id = visitor_id
        self.track_id = track_id
        self.camera_id = camera_id
        self.first_seen = datetime.utcnow()
        self.last_seen = datetime.utcnow()
        self.frame_count = 0
        self.detections = []
        self.status = "active"

    def update(self, frame_number: int, bbox: Dict[str, int], confidence: float) -> None:
        """Update session with new detection."""
        self.last_seen = datetime.utcnow()
        self.frame_count += 1
        self.detections.append({
            "frameNumber": frame_number,
            "bbox": bbox,
            "confidence": confidence,
        })

    def to_dict(self) -> Dict[str, Any]:
        """Convert session to dictionary."""
        duration = (self.last_seen - self.first_seen).total_seconds()
        return {
            "visitorId": self.visitor_id,
            "trackId": self.track_id,
            "cameraId": self.camera_id,
            "firstSeen": self.first_seen.isoformat() + "Z",
            "lastSeen": self.last_seen.isoformat() + "Z",
            "duration": round(duration, 2),
            "frameCount": self.frame_count,
            "status": self.status,
            "detectionCount": len(self.detections),
        }


class TrackManager:
    """Manages track lifecycle and visitor sessions."""

    def __init__(self, session_timeout: int = 300):
        """
        Initialize track manager.

        Args:
            session_timeout: Seconds before session is considered ended
        """
        self.session_timeout = session_timeout
        self.sessions: Dict[str, VisitorSession] = {}
        self.track_to_visitor: Dict[str, str] = {}
        self.next_visitor_id = 1
        self.camera_sessions: Dict[str, List[str]] = defaultdict(list)

    def process_tracks(
        self,
        tracks: List[Dict[str, Any]],
        camera_id: str,
        frame_number: int,
    ) -> List[Dict[str, Any]]:
        """
        Process tracks and manage visitor sessions.

        Args:
            tracks: List of active tracks
            camera_id: Camera identifier
            frame_number: Current frame number

        Returns:
            List of active visitor sessions
        """
        active_sessions = []

        for track in tracks:
            track_id = track["trackId"]

            # Get or create visitor session
            if track_id not in self.track_to_visitor:
                visitor_id = self._create_visitor(track_id, camera_id)
            else:
                visitor_id = self.track_to_visitor[track_id]

            session = self.sessions[visitor_id]
            session.update(frame_number, track["bbox"], track["confidence"])
            active_sessions.append(session.to_dict())

        # Check for ended sessions
        self._cleanup_sessions()

        logger.debug(
            f"Camera {camera_id}: {len(active_sessions)} active sessions"
        )
        return active_sessions

    def _create_visitor(self, track_id: str, camera_id: str) -> str:
        """Create a new visitor session."""
        visitor_id = f"V{self.next_visitor_id:06d}"
        self.next_visitor_id += 1

        session = VisitorSession(visitor_id, track_id, camera_id)
        self.sessions[visitor_id] = session
        self.track_to_visitor[track_id] = visitor_id
        self.camera_sessions[camera_id].append(visitor_id)

        logger.debug(f"Created visitor {visitor_id} from track {track_id}")
        return visitor_id

    def _cleanup_sessions(self) -> None:
        """Remove ended sessions."""
        now = datetime.utcnow()
        ended_sessions = []

        for visitor_id, session in list(self.sessions.items()):
            time_since_update = (now - session.last_seen).total_seconds()

            if time_since_update > self.session_timeout:
                session.status = "ended"
                ended_sessions.append(visitor_id)

        # Keep ended sessions for a while, then remove
        self.sessions = {
            vid: session
            for vid, session in self.sessions.items()
            if (now - session.last_seen).total_seconds() < self.session_timeout * 2
        }

        if ended_sessions:
            logger.debug(f"Ended {len(ended_sessions)} sessions")

    def get_active_sessions(self, camera_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get active visitor sessions."""
        sessions = []
        for session in self.sessions.values():
            if session.status == "active":
                if camera_id is None or session.camera_id == camera_id:
                    sessions.append(session.to_dict())
        return sessions

    def get_all_sessions(self, camera_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all visitor sessions (active and ended)."""
        sessions = []
        for session in self.sessions.values():
            if camera_id is None or session.camera_id == camera_id:
                sessions.append(session.to_dict())
        return sessions

    def get_session_stats(self, camera_id: Optional[str] = None) -> Dict[str, Any]:
        """Get session statistics."""
        sessions = self.get_all_sessions(camera_id)

        active_count = sum(1 for s in sessions if s["status"] == "active")
        ended_count = sum(1 for s in sessions if s["status"] == "ended")
        total_duration = sum(s["duration"] for s in sessions)
        avg_duration = (
            total_duration / len(sessions) if sessions else 0
        )

        return {
            "totalSessions": len(sessions),
            "activeSessions": active_count,
            "endedSessions": ended_count,
            "totalDuration": round(total_duration, 2),
            "averageDuration": round(avg_duration, 2),
            "totalFrames": sum(s["frameCount"] for s in sessions),
        }

    def reset(self) -> None:
        """Reset manager state."""
        self.sessions.clear()
        self.track_to_visitor.clear()
        self.camera_sessions.clear()
        self.next_visitor_id = 1
        logger.info("Track manager reset")


# Singleton instance
track_manager = TrackManager()
