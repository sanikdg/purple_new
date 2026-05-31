"""Dwell time engine for calculating visitor dwell times."""

import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
from collections import defaultdict

logger = logging.getLogger(__name__)


class DwellTimeRecord:
    """Records dwell time for a visitor in a zone."""

    def __init__(self, visitor_id: str, zone_id: str, entry_time: datetime):
        """
        Initialize dwell time record.

        Args:
            visitor_id: Visitor identifier
            zone_id: Zone identifier
            entry_time: Entry timestamp
        """
        self.visitor_id = visitor_id
        self.zone_id = zone_id
        self.entry_time = entry_time
        self.exit_time: Optional[datetime] = None
        self.dwell_time: float = 0.0

    def finalize(self, exit_time: datetime) -> None:
        """Finalize dwell time record."""
        self.exit_time = exit_time
        self.dwell_time = (exit_time - self.entry_time).total_seconds()

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            "visitorId": self.visitor_id,
            "zoneId": self.zone_id,
            "entryTime": self.entry_time.isoformat() + "Z",
            "exitTime": self.exit_time.isoformat() + "Z" if self.exit_time else None,
            "dwellTime": round(self.dwell_time, 2),
        }


class DwellTimeEngine:
    """Calculates and tracks dwell times."""

    def __init__(self):
        """Initialize dwell time engine."""
        self.active_records: Dict[str, DwellTimeRecord] = {}
        self.completed_records: List[DwellTimeRecord] = []
        self.visitor_dwell_times: Dict[str, Dict[str, float]] = defaultdict(dict)
        self.visitor_total_dwell: Dict[str, float] = {}

    def record_zone_entry(
        self, visitor_id: str, zone_id: str, timestamp: datetime
    ) -> None:
        """
        Record visitor entering zone.

        Args:
            visitor_id: Visitor identifier
            zone_id: Zone identifier
            timestamp: Entry timestamp
        """
        record_key = f"{visitor_id}:{zone_id}"
        record = DwellTimeRecord(visitor_id, zone_id, timestamp)
        self.active_records[record_key] = record
        logger.debug(f"Started dwell time tracking: {visitor_id} in {zone_id}")

    def record_zone_exit(
        self, visitor_id: str, zone_id: str, timestamp: datetime
    ) -> float:
        """
        Record visitor exiting zone.

        Args:
            visitor_id: Visitor identifier
            zone_id: Zone identifier
            timestamp: Exit timestamp

        Returns:
            Dwell time in seconds
        """
        record_key = f"{visitor_id}:{zone_id}"

        if record_key not in self.active_records:
            logger.warning(f"No active record for {record_key}")
            return 0.0

        record = self.active_records[record_key]
        record.finalize(timestamp)

        # Store in completed records
        self.completed_records.append(record)

        # Update visitor dwell times
        if visitor_id not in self.visitor_dwell_times:
            self.visitor_dwell_times[visitor_id] = {}

        if zone_id not in self.visitor_dwell_times[visitor_id]:
            self.visitor_dwell_times[visitor_id][zone_id] = 0.0

        self.visitor_dwell_times[visitor_id][zone_id] += record.dwell_time

        # Update total dwell time
        if visitor_id not in self.visitor_total_dwell:
            self.visitor_total_dwell[visitor_id] = 0.0

        self.visitor_total_dwell[visitor_id] += record.dwell_time

        # Remove from active records
        del self.active_records[record_key]

        logger.debug(
            f"Completed dwell time: {visitor_id} in {zone_id} "
            f"({record.dwell_time:.2f}s)"
        )

        return record.dwell_time

    def get_visitor_dwell_times(self, visitor_id: str) -> Dict[str, float]:
        """
        Get dwell times per zone for visitor.

        Args:
            visitor_id: Visitor identifier

        Returns:
            Dictionary of zone_id -> dwell_time
        """
        dwell_times = self.visitor_dwell_times.get(visitor_id, {})
        return {zone: round(time, 2) for zone, time in dwell_times.items()}

    def get_visitor_total_dwell_time(self, visitor_id: str) -> float:
        """
        Get total dwell time for visitor.

        Args:
            visitor_id: Visitor identifier

        Returns:
            Total dwell time in seconds
        """
        total = self.visitor_total_dwell.get(visitor_id, 0.0)
        return round(total, 2)

    def get_zone_dwell_times(self, zone_id: str) -> Dict[str, float]:
        """
        Get average dwell time in zone across all visitors.

        Args:
            zone_id: Zone identifier

        Returns:
            Dictionary with statistics
        """
        dwell_times = []

        for visitor_dwell in self.visitor_dwell_times.values():
            if zone_id in visitor_dwell:
                dwell_times.append(visitor_dwell[zone_id])

        if not dwell_times:
            return {
                "zone": zone_id,
                "count": 0,
                "totalDwell": 0.0,
                "averageDwell": 0.0,
                "minDwell": 0.0,
                "maxDwell": 0.0,
            }

        total = sum(dwell_times)
        avg = total / len(dwell_times)
        min_dwell = min(dwell_times)
        max_dwell = max(dwell_times)

        return {
            "zone": zone_id,
            "count": len(dwell_times),
            "totalDwell": round(total, 2),
            "averageDwell": round(avg, 2),
            "minDwell": round(min_dwell, 2),
            "maxDwell": round(max_dwell, 2),
        }

    def get_all_dwell_statistics(self) -> Dict[str, Any]:
        """Get overall dwell time statistics."""
        if not self.visitor_total_dwell:
            return {
                "totalVisitors": 0,
                "totalDwellTime": 0.0,
                "averageDwellTime": 0.0,
                "minDwellTime": 0.0,
                "maxDwellTime": 0.0,
            }

        dwell_times = list(self.visitor_total_dwell.values())
        total = sum(dwell_times)
        avg = total / len(dwell_times)
        min_dwell = min(dwell_times)
        max_dwell = max(dwell_times)

        return {
            "totalVisitors": len(dwell_times),
            "totalDwellTime": round(total, 2),
            "averageDwellTime": round(avg, 2),
            "minDwellTime": round(min_dwell, 2),
            "maxDwellTime": round(max_dwell, 2),
        }

    def reset(self) -> None:
        """Reset engine."""
        self.active_records.clear()
        self.completed_records.clear()
        self.visitor_dwell_times.clear()
        self.visitor_total_dwell.clear()
        logger.info("Dwell time engine reset")


# Singleton instance
dwell_time_engine = DwellTimeEngine()
