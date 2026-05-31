import Event, { IEvent } from '../models/Event.js'

export class EventService {
  /**
   * Store events
   */
  async storeEvents(events: any[]): Promise<IEvent[]> {
    try {
      const storedEvents = await Event.insertMany(events)
      return storedEvents as IEvent[]
    } catch (error) {
      throw new Error(`Failed to store events: ${error}`)
    }
  }

  /**
   * Get all events
   */
  async getAllEvents(): Promise<IEvent[]> {
    return await Event.find().sort({ timestamp: -1 })
  }

  /**
   * Get events by visitor
   */
  async getEventsByVisitor(visitorId: string): Promise<IEvent[]> {
    return await Event.find({ visitorId }).sort({ timestamp: -1 })
  }

  /**
   * Get events by camera
   */
  async getEventsByCamera(cameraId: string): Promise<IEvent[]> {
    return await Event.find({ cameraId }).sort({ timestamp: -1 })
  }

  /**
   * Get events by zone
   */
  async getEventsByZone(zoneId: string): Promise<IEvent[]> {
    return await Event.find({ zoneId }).sort({ timestamp: -1 })
  }

  /**
   * Get events by type
   */
  async getEventsByType(eventType: string): Promise<IEvent[]> {
    return await Event.find({ eventType }).sort({ timestamp: -1 })
  }

  /**
   * Get recent events
   */
  async getRecentEvents(limit: number = 100): Promise<IEvent[]> {
    return await Event.find().sort({ timestamp: -1 }).limit(limit)
  }

  /**
   * Get events by date range
   */
  async getEventsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<IEvent[]> {
    return await Event.find({
      timestamp: { $gte: startDate, $lte: endDate }
    }).sort({ timestamp: -1 })
  }

  /**
   * Get event statistics
   */
  async getEventStats(): Promise<{
    totalEvents: number
    eventsByType: Record<string, number>
    uniqueVisitors: number
    uniqueZones: number
  }> {
    const events = await Event.find()
    const eventsByType: Record<string, number> = {}
    const uniqueVisitors = new Set(events.map(e => e.visitorId)).size
    const uniqueZones = new Set(events.map(e => e.zoneId).filter(z => z)).size

    for (const event of events) {
      if (!eventsByType[event.eventType]) {
        eventsByType[event.eventType] = 0
      }
      eventsByType[event.eventType]++
    }

    return {
      totalEvents: events.length,
      eventsByType,
      uniqueVisitors,
      uniqueZones
    }
  }

  /**
   * Get zone entry/exit events
   */
  async getZoneTransitionEvents(zoneId: string): Promise<IEvent[]> {
    return await Event.find({
      zoneId,
      eventType: { $in: ['ZONE_ENTER', 'ZONE_EXIT'] }
    }).sort({ timestamp: -1 })
  }

  /**
   * Delete events by visitor
   */
  async deleteEventsByVisitor(visitorId: string): Promise<number> {
    const result = await Event.deleteMany({ visitorId })
    return result.deletedCount || 0
  }

  /**
   * Delete events by camera
   */
  async deleteEventsByCamera(cameraId: string): Promise<number> {
    const result = await Event.deleteMany({ cameraId })
    return result.deletedCount || 0
  }
}

export default new EventService()
