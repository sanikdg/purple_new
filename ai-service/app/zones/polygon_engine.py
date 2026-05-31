"""Polygon engine for point-in-polygon detection."""

import logging
from typing import List, Tuple, Dict, Any, Optional

logger = logging.getLogger(__name__)


class Point:
    """Represents a 2D point."""

    def __init__(self, x: float, y: float):
        """Initialize point."""
        self.x = x
        self.y = y

    def __repr__(self) -> str:
        return f"Point({self.x}, {self.y})"


class Polygon:
    """Represents a polygon zone."""

    def __init__(self, zone_id: str, vertices: List[Tuple[float, float]]):
        """
        Initialize polygon.

        Args:
            zone_id: Unique zone identifier
            vertices: List of (x, y) tuples defining polygon vertices
        """
        self.zone_id = zone_id
        self.vertices = [Point(x, y) for x, y in vertices]
        self.bounds = self._compute_bounds()

    def _compute_bounds(self) -> Dict[str, float]:
        """Compute bounding box for polygon."""
        if not self.vertices:
            return {"min_x": 0, "max_x": 0, "min_y": 0, "max_y": 0}

        xs = [v.x for v in self.vertices]
        ys = [v.y for v in self.vertices]

        return {
            "min_x": min(xs),
            "max_x": max(xs),
            "min_y": min(ys),
            "max_y": max(ys),
        }

    def contains_point(self, point: Point) -> bool:
        """
        Check if point is inside polygon using ray casting algorithm.

        Args:
            point: Point to check

        Returns:
            True if point is inside polygon, False otherwise
        """
        # Quick bounding box check
        if (
            point.x < self.bounds["min_x"]
            or point.x > self.bounds["max_x"]
            or point.y < self.bounds["min_y"]
            or point.y > self.bounds["max_y"]
        ):
            return False

        # Ray casting algorithm
        inside = False
        n = len(self.vertices)

        p1 = self.vertices[0]
        for i in range(1, n + 1):
            p2 = self.vertices[i % n]

            if point.y > min(p1.y, p2.y):
                if point.y <= max(p1.y, p2.y):
                    if point.x <= max(p1.x, p2.x):
                        if p1.y != p2.y:
                            xinters = (point.y - p1.y) * (p2.x - p1.x) / (
                                p2.y - p1.y
                            ) + p1.x
                        if p1.x == p2.x or point.x <= xinters:
                            inside = not inside

            p1 = p2

        return inside

    def get_centroid(self) -> Point:
        """Get polygon centroid."""
        if not self.vertices:
            return Point(0, 0)

        x_sum = sum(v.x for v in self.vertices)
        y_sum = sum(v.y for v in self.vertices)
        n = len(self.vertices)

        return Point(x_sum / n, y_sum / n)

    def to_dict(self) -> Dict[str, Any]:
        """Convert polygon to dictionary."""
        return {
            "zoneId": self.zone_id,
            "vertices": [(v.x, v.y) for v in self.vertices],
            "bounds": self.bounds,
            "centroid": (self.get_centroid().x, self.get_centroid().y),
        }


class PolygonEngine:
    """Engine for polygon-based zone detection."""

    def __init__(self):
        """Initialize polygon engine."""
        self.polygons: Dict[str, Polygon] = {}

    def add_zone(self, zone_id: str, vertices: List[Tuple[float, float]]) -> None:
        """
        Add a zone polygon.

        Args:
            zone_id: Unique zone identifier
            vertices: List of (x, y) tuples defining polygon vertices
        """
        polygon = Polygon(zone_id, vertices)
        self.polygons[zone_id] = polygon
        logger.debug(f"Added zone {zone_id} with {len(vertices)} vertices")

    def get_zone_at_point(self, x: float, y: float) -> Optional[str]:
        """
        Get zone containing point.

        Args:
            x: X coordinate
            y: Y coordinate

        Returns:
            Zone ID if point is in a zone, None otherwise
        """
        point = Point(x, y)

        for zone_id, polygon in self.polygons.items():
            if polygon.contains_point(point):
                return zone_id

        return None

    def get_zone_at_bbox(self, x1: float, y1: float, x2: float, y2: float) -> Optional[str]:
        """
        Get zone containing bounding box center.

        Args:
            x1: Top-left x coordinate
            y1: Top-left y coordinate
            x2: Bottom-right x coordinate
            y2: Bottom-right y coordinate

        Returns:
            Zone ID if center is in a zone, None otherwise
        """
        center_x = (x1 + x2) / 2
        center_y = (y1 + y2) / 2

        return self.get_zone_at_point(center_x, center_y)

    def get_all_zones(self) -> List[Dict[str, Any]]:
        """Get all zones."""
        return [polygon.to_dict() for polygon in self.polygons.values()]

    def get_zone(self, zone_id: str) -> Optional[Dict[str, Any]]:
        """Get specific zone."""
        if zone_id in self.polygons:
            return self.polygons[zone_id].to_dict()
        return None

    def reset(self) -> None:
        """Reset engine."""
        self.polygons.clear()
        logger.info("Polygon engine reset")


# Singleton instance
polygon_engine = PolygonEngine()
