"""ByteTrack service for multi-object tracking."""

import logging
from typing import List, Dict, Any, Optional
import numpy as np
from collections import defaultdict

logger = logging.getLogger(__name__)


class Track:
    """Represents a single tracked object."""

    def __init__(self, track_id: int, bbox: np.ndarray, confidence: float):
        """
        Initialize track.

        Args:
            track_id: Unique track identifier
            bbox: Bounding box [x1, y1, x2, y2]
            confidence: Detection confidence
        """
        self.track_id = track_id
        self.bbox = bbox
        self.confidence = confidence
        self.age = 1
        self.time_since_update = 0
        self.history = [bbox]

    def update(self, bbox: np.ndarray, confidence: float) -> None:
        """Update track with new detection."""
        self.bbox = bbox
        self.confidence = confidence
        self.age += 1
        self.time_since_update = 0
        self.history.append(bbox)

    def mark_missed(self) -> None:
        """Mark track as not updated in current frame."""
        self.time_since_update += 1

    def to_dict(self) -> Dict[str, Any]:
        """Convert track to dictionary."""
        x1, y1, x2, y2 = self.bbox
        return {
            "trackId": f"T{self.track_id:06d}",
            "bbox": {
                "x1": int(x1),
                "y1": int(y1),
                "x2": int(x2),
                "y2": int(y2),
            },
            "confidence": round(float(self.confidence), 4),
            "age": self.age,
            "timeSinceUpdate": self.time_since_update,
        }


class ByteTrackService:
    """ByteTrack implementation for multi-object tracking."""

    def __init__(self, max_age: int = 30, min_hits: int = 3):
        """
        Initialize ByteTrack service.

        Args:
            max_age: Maximum frames to keep track without update
            min_hits: Minimum hits before track is confirmed
        """
        self.max_age = max_age
        self.min_hits = min_hits
        self.tracks: Dict[int, Track] = {}
        self.next_track_id = 1
        self.frame_count = 0

    def update(self, detections: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Update tracks with new detections.

        Args:
            detections: List of detection objects with bbox and confidence

        Returns:
            List of active tracks
        """
        self.frame_count += 1

        # Convert detections to numpy arrays
        detection_bboxes = []
        detection_confidences = []

        for det in detections:
            bbox = det["bbox"]
            x1, y1, x2, y2 = bbox["x1"], bbox["y1"], bbox["x2"], bbox["y2"]
            detection_bboxes.append(np.array([x1, y1, x2, y2]))
            detection_confidences.append(det["confidence"])

        # Match detections to existing tracks
        matched_tracks = self._match_detections(detection_bboxes)

        # Update matched tracks
        for track_id, det_idx in matched_tracks:
            if track_id in self.tracks:
                self.tracks[track_id].update(
                    detection_bboxes[det_idx],
                    detection_confidences[det_idx],
                )

        # Create new tracks for unmatched detections
        unmatched_dets = set(range(len(detections))) - set(
            det_idx for _, det_idx in matched_tracks
        )
        for det_idx in unmatched_dets:
            self._create_track(
                detection_bboxes[det_idx],
                detection_confidences[det_idx],
            )

        # Mark unmatched tracks as missed
        matched_track_ids = set(tid for tid, _ in matched_tracks)
        for track_id in list(self.tracks.keys()):
            if track_id not in matched_track_ids:
                self.tracks[track_id].mark_missed()

        # Remove old tracks
        self.tracks = {
            tid: track
            for tid, track in self.tracks.items()
            if track.time_since_update < self.max_age
        }

        # Return confirmed tracks
        active_tracks = [
            track.to_dict()
            for track in self.tracks.values()
            if track.age >= self.min_hits
        ]

        logger.debug(
            f"Frame {self.frame_count}: {len(active_tracks)} active tracks"
        )
        return active_tracks

    def _match_detections(
        self, detection_bboxes: List[np.ndarray]
    ) -> List[tuple]:
        """
        Match detections to existing tracks using IoU.

        Args:
            detection_bboxes: List of detection bounding boxes

        Returns:
            List of (track_id, detection_idx) tuples
        """
        matched = []
        used_dets = set()

        # Sort tracks by age (prefer older tracks)
        sorted_tracks = sorted(
            self.tracks.items(), key=lambda x: x[1].age, reverse=True
        )

        for track_id, track in sorted_tracks:
            best_iou = 0
            best_det_idx = -1

            for det_idx, det_bbox in enumerate(detection_bboxes):
                if det_idx in used_dets:
                    continue

                iou = self._compute_iou(track.bbox, det_bbox)

                if iou > best_iou and iou > 0.5:  # IoU threshold
                    best_iou = iou
                    best_det_idx = det_idx

            if best_det_idx >= 0:
                matched.append((track_id, best_det_idx))
                used_dets.add(best_det_idx)

        return matched

    def _compute_iou(self, bbox1: np.ndarray, bbox2: np.ndarray) -> float:
        """
        Compute Intersection over Union (IoU) between two bboxes.

        Args:
            bbox1: First bounding box [x1, y1, x2, y2]
            bbox2: Second bounding box [x1, y1, x2, y2]

        Returns:
            IoU score (0-1)
        """
        x1_min, y1_min, x1_max, y1_max = bbox1
        x2_min, y2_min, x2_max, y2_max = bbox2

        # Compute intersection
        inter_xmin = max(x1_min, x2_min)
        inter_ymin = max(y1_min, y2_min)
        inter_xmax = min(x1_max, x2_max)
        inter_ymax = min(y1_max, y2_max)

        if inter_xmax < inter_xmin or inter_ymax < inter_ymin:
            return 0.0

        inter_area = (inter_xmax - inter_xmin) * (inter_ymax - inter_ymin)

        # Compute union
        bbox1_area = (x1_max - x1_min) * (y1_max - y1_min)
        bbox2_area = (x2_max - x2_min) * (y2_max - y2_min)
        union_area = bbox1_area + bbox2_area - inter_area

        if union_area == 0:
            return 0.0

        return inter_area / union_area

    def _create_track(self, bbox: np.ndarray, confidence: float) -> None:
        """Create a new track."""
        track_id = self.next_track_id
        self.tracks[track_id] = Track(track_id, bbox, confidence)
        self.next_track_id += 1
        logger.debug(f"Created track {track_id}")

    def get_tracks(self) -> List[Dict[str, Any]]:
        """Get all confirmed tracks."""
        return [
            track.to_dict()
            for track in self.tracks.values()
            if track.age >= self.min_hits
        ]

    def reset(self) -> None:
        """Reset tracker state."""
        self.tracks.clear()
        self.next_track_id = 1
        self.frame_count = 0
        logger.info("Tracker reset")


# Singleton instance
bytetrack_service = ByteTrackService()
