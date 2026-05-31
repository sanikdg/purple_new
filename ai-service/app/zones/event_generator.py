"""Event generator for zone and visitor events."""

import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
from enum import Enum

logger = logging.getLogger(__name__)


class EventType(Enum):
    """Event types."""

    ZONE_ENTER = "ZONE_ENTER"
    ZONE_EXIT = "ZONE_EXIT"
    DWELL_TIME_UPDATE = "DWELL_TIME_UPDATE"
    VISITOR_SESSION_START = "VISITOR_SESSION_START"
    VISITOR_SESSION_END = "VISITOR_SESSION_END"
    ZONE_TRANSITION = "ZONE_TRANSITION"


class Event:
    """Represents a business event."""

    def __init__(
        self,
        event_id: str,
        visitor_id: str,
        track_id: str,
        camera_id: str,
        event_type: EventType,
        timestamp: datetime,
        zone_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ):
        """
        Initialize event.

        Args:
            event_id: Unique event identifier
            visitor_id: Visitor identifier
            track_id: Track identifier
            camera_id: Camera identifier
            event_type: Type of event
            timestamp: Event timestamp
            zone_id: Zone identifier (if applicable)
            metadata: Additional event metadata
        """
        self.event_id = event_id
        self.visitor_id = visitor_id
        self.track_id = track_id
        self.camera_id = camera_id
        self.event_type = event_type
        self.timestamp = timestamp
        self.zone_id = zone_id
        self.metadata = metadata or {}

    def to_dict(self) -> Dict[str, Any]:
        """Convert event to dictionary."""
        return {
            "eventId": self.event_id,
            "visitorId": self.visitor_id,
            "trackId": self.track_id,
            "cameraId": self.camera_id,
            "eventType": self.event_type.value,
            "timestamp": self.timestamp.isoformat() + "Z",
            "zoneId": self.zone_id,
            "metadata": self.metadata,
        }


class EventGenerator:
    """Generates business events from tracking data."""

    def __init__(self):
        """Initialize event generator."""
        self.events: List[Event] = []
        self.next_event_id = 1
        self.visitor_events: Dict[str, List[Event]] = {}

    def generate_zone_enter_event(
        self,
        visitor_id: str,
        track_id: str,
        camera_id: str,
        zone_id: str,
        timestamp: datetime,
    ) -> Event:
        """Generate zone enter event."""
        event_id = f"E{self.next_event_id:08d}"
        self.next_event_id += 1

        event = Event(
            event_id=event_id,
            visitor_id=visitor_id,
            track_id=track_id,
            camera_id=camera_id,
            event_type=EventType.ZONE_ENTER,
            timestamp=timestamp,
            zone_id=zone_id,
        )

        self._store_event(event)
        logger.debug(f"Generated ZONE_ENTER event: {visitor_id} → {zone_id}")
        return event

    def generate_zone_exit_event(
        self,
        visitor_id: str,
        track_id: str,
        camera_id: str,
        zone_id: str,
        timestamp: datetime,
        dwell_time: float,
    ) -> Event:
        """Generate zone exit event."""
        event_id = f"E{self.next_event_id:08d}"
        self.next_event_id += 1

        event = Event(
            event_id=event_id,
            visitor_id=visitor_id,
            track_id=track_id,
            camera_id=camera_id,
            event_type=EventType.ZONE_EXIT,
            timestamp=timestamp,
            zone_id=zone_id,
            metadata={"dwellTime": round(dwell_time, 2)},
        )

        self._store_event(event)
        logger.debug(
            f"Generated ZONE_EXIT event: {visitor_id} ← {zone_id} "
            f"(dwell: {dwell_time:.2f}s)"
        )
        return event

    def generate_zone_transition_event(
        self,
        visitor_id: str,
        track_id: str,
        camera_id: str,
        from_zone: str,
        to_zone: str,
        timestamp: datetime,
    ) -> Event:
        """Generate zone transition event."""
        event_id = f"E{self.next_event_id:08d}"
        self.next_event_id += 1

        event = Event(
            event_id=event_id,
            visitor_id=visitor_id,
            track_id=track_id,
            camera_id=camera_id,
            event_type=EventType.ZONE_TRANSITION,
            timestamp=timestamp,
            zone_id=to_zone,
            metadata={"fromZone": from_zone, "toZone": to_zone},
        )

        self._store_event(event)
        logger.debug(f"Generated ZONE_TRANSITION event: {visitor_id} {from_zone} → {to_zone}")
        return event

    def generate_session_start_event(
        self,
        visitor_id: str,
        track_id: str,
        camera_id: str,
        timestamp: datetime,
    ) -> Event:
        """Generate visitor session start event."""
        event_id = f"E{self.next_event_id:08d}"
        self.next_event_id += 1

        event = Event(
            event_id=event_id,
            visitor_id=visitor_id,
            track_id=track_id,
            camera_id=camera_id,
            event_type=EventType.VISITOR_SESSION_START,
            timestamp=timestamp,
        )

        self._store_event(event)
        logger.debug(f"Generated SESSION_START event: {visitor_id}")
        return event

    def generate_session_end_event(
        self,
        visitor_id: str,
        track_id: str,
        camera_id: str,
        timestamp: datetime,
        total_dwell_time: float,
        zones_visited: int,
    ) -> Event:
        """Generate visitor session end event."""
        event_id = f"E{self.next_event_id:08d}"
        self.next_event_id += 1

        event = Event(
            event_id=event_id,
            visitor_id=visitor_id,
            track_id=track_id,
            camera_id=camera_id,
            event_type=EventType.VISITOR_SESSION_END,
            timestamp=timestamp,
            metadata={
                "totalDwellTime": round(total_dwell_time, 2),
                "zonesVisited": zones_visited,
            },
        )

        self._store_event(event)
        logger.debug(
            f"Generated SESSION_END event: {visitor_id} "
            f"(dwell: {total_dwell_time:.2f}s, zones: {zones_visited})"
        )
        return event

    def _store_event(self, event: Event) -> None:
        """Store event in memory."""
        self.events.append(event)

        if event.visitor_id not in self.visitor_events:
            self.visitor_events[event.visitor_id] = []
        self.visitor_events[event.visitor_id].append(event)

    def get_all_events(self) -> List[Dict[str, Any]]:
        """Get all events."""
        return [event.to_dict() for event in self.events]

    def get_visitor_events(self, visitor_id: str) -> List[Dict[str, Any]]:
        """Get events for specific visitor."""
        events = self.visitor_events.get(visitor_id, [])
        return [event.to_dict() for event in events]

    def get_recent_events(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get recent events."""
        recent = self.events[-limit:] if len(self.events) > limit else self.events
        return [event.to_dict() for event in recent]

    def reset(self) -> None:
        """Reset generator."""
        self.events.clear()
        self.visitor_events.clear()
        self.next_event_id = 1
        logger.info("Event generator reset")


# Singleton instance
event_generator = EventGenerator()
