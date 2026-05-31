"""Zone mapper for assigning visitors to zones."""

import logging
from typing import Dict, List, Optional, Any
from datetime import datetime
from .polygon_engine import polygon_engine

logger = logging.getLogger(__name__)


class ZoneAssignment:
    """Represents a visitor's zone assignment."""

    def __init__(self, visitor_id: str, zone_id: str, timestamp: datetime):
        """
        Initialize zone assignment.

        Args:
            visitor_id: Visitor identifier
            zone_id: Zone identifier
            timestamp: Assignment timestamp
        """
        self.visitor_id = visitor_id
        self.zone_id = zone_id
        self.timestamp = timestamp
        self.entry_time = timestamp
        self.exit_time: Optional[datetime] = None
        self.dwell_time: float = 0.0

    def exit_zone(self, timestamp: datetime) -> None:
        """Mark zone exit."""
        self.exit_time = timestamp
        self.dwell_time = (timestamp - self.entry_time).total_seconds()

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "visitorId": self.visitor_id,
            "zoneId": self.zone_id,
            "entryTime": self.entry_time.isoformat() + "Z",
            "exitTime": self.exit_time.isoformat() + "Z" if self.exit_time else None,
            "dwellTime": round(self.dwell_time, 2),
        }


class ZoneMapper:
    """Maps visitors to zones based on track positions."""

    def __init__(self):
        """Initialize zone mapper."""
        self.visitor_zones: Dict[str, Optional[str]] = {}
        self.zone_history: Dict[str, List[ZoneAssignment]] = {}
        self.current_assignments: Dict[str, ZoneAssignment] = {}

    def update_visitor_zone(
        self, visitor_id: str, x: float, y: float, timestamp: datetime
    ) -> Optional[str]:
        """
        Update visitor's current zone.

        Args:
            visitor_id: Visitor identifier
            x: X coordinate
            y: Y coordinate
            timestamp: Update timestamp

        Returns:
            Current zone ID or None
        """
        # Get zone at position
        new_zone = polygon_engine.get_zone_at_point(x, y)

        # Get previous zone
        prev_zone = self.visitor_zones.get(visitor_id)

        # If zone changed, handle transition
        if new_zone != prev_zone:
            if prev_zone is not None:
                # Exit previous zone
                if visitor_id in self.current_assignments:
                    assignment = self.current_assignments[visitor_id]
                    assignment.exit_zone(timestamp)

                    # Store in history
                    if visitor_id not in self.zone_history:
                        self.zone_history[visitor_id] = []
                    self.zone_history[visitor_id].append(assignment)

                    logger.debug(
                        f"Visitor {visitor_id} exited zone {prev_zone} "
                        f"(dwell: {assignment.dwell_time:.2f}s)"
                    )

            # Enter new zone
            if new_zone is not None:
                assignment = ZoneAssignment(visitor_id, new_zone, timestamp)
                self.current_assignments[visitor_id] = assignment
                logger.debug(f"Visitor {visitor_id} entered zone {new_zone}")

        # Update current zone
        self.visitor_zones[visitor_id] = new_zone

        return new_zone

    def get_visitor_zone(self, visitor_id: str) -> Optional[str]:
        """Get visitor's current zone."""
        return self.visitor_zones.get(visitor_id)

    def get_visitor_zone_history(self, visitor_id: str) -> List[Dict[str, Any]]:
        """Get visitor's zone visit history."""
        history = self.zone_history.get(visitor_id, [])
        return [assignment.to_dict() for assignment in history]

    def get_visitor_dwell_times(self, visitor_id: str) -> Dict[str, float]:
        """Get total dwell time per zone for visitor."""
        dwell_times: Dict[str, float] = {}

        history = self.zone_history.get(visitor_id, [])
        for assignment in history:
            zone_id = assignment.zone_id
            if zone_id not in dwell_times:
                dwell_times[zone_id] = 0.0
            dwell_times[zone_id] += assignment.dwell_time

        # Add current zone if visitor is in one
        if visitor_id in self.current_assignments:
            assignment = self.current_assignments[visitor_id]
            zone_id = assignment.zone_id
            current_dwell = (datetime.utcnow() - assignment.entry_time).total_seconds()

            if zone_id not in dwell_times:
                dwell_times[zone_id] = 0.0
            dwell_times[zone_id] += current_dwell

        return {zone: round(time, 2) for zone, time in dwell_times.items()}

    def get_total_dwell_time(self, visitor_id: str) -> float:
        """Get total dwell time for visitor."""
        dwell_times = self.get_visitor_dwell_times(visitor_id)
        return round(sum(dwell_times.values()), 2)

    def end_visitor_session(self, visitor_id: str, timestamp: datetime) -> None:
        """End visitor session and finalize zone assignments."""
        if visitor_id in self.current_assignments:
            assignment = self.current_assignments[visitor_id]
            assignment.exit_zone(timestamp)

            if visitor_id not in self.zone_history:
                self.zone_history[visitor_id] = []
            self.zone_history[visitor_id].append(assignment)

            del self.current_assignments[visitor_id]

        if visitor_id in self.visitor_zones:
            del self.visitor_zones[visitor_id]

        logger.debug(f"Ended session for visitor {visitor_id}")

    def reset(self) -> None:
        """Reset mapper."""
        self.visitor_zones.clear()
        self.zone_history.clear()
        self.current_assignments.clear()
        logger.info("Zone mapper reset")


# Singleton instance
zone_mapper = ZoneMapper()
