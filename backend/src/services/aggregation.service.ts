import Event, { IEvent } from '../models/Event.js'
import VisitorJourney, { IVisitorJourney } from '../models/VisitorJourney.js'
import Visitor, { IVisitor } from '../models/Visitor.js'

export class AggregationService {
  /**
   * Aggregate events by type
   */
  async aggregateEventsByType(): Promise<Record<string, number>> {
    try {
      const result = await Event.aggregate([
        {
          $group: {
            _id: '$eventType',
            count: { $sum: 1 }
          }
        }
      ])

      const aggregated: Record<string, number> = {}
      result.forEach(item => {
        aggregated[item._id] = item.count
      })
      return aggregated
    } catch (error) {
      throw new Error(`Failed to aggregate events by type: ${error}`)
    }
  }

  /**
   * Aggregate events by camera
   */
  async aggregateEventsByCamera(): Promise<Record<string, number>> {
    try {
      const result = await Event.aggregate([
        {
          $group: {
            _id: '$cameraId',
            count: { $sum: 1 }
          }
        }
      ])

      const aggregated: Record<string, number> = {}
      result.forEach(item => {
        aggregated[item._id] = item.count
      })
      return aggregated
    } catch (error) {
      throw new Error(`Failed to aggregate events by camera: ${error}`)
    }
  }

  /**
   * Aggregate events by zone
   */
  async aggregateEventsByZone(): Promise<Record<string, number>> {
    try {
      const result = await Event.aggregate([
        { $match: { zoneId: { $ne: null } } },
        {
          $group: {
            _id: '$zoneId',
            count: { $sum: 1 }
          }
        }
      ])

      const aggregated: Record<string, number> = {}
      result.forEach(item => {
        aggregated[item._id] = item.count
      })
      return aggregated
    } catch (error) {
      throw new Error(`Failed to aggregate events by zone: ${error}`)
    }
  }

  /**
   * Aggregate visitor statistics
   */
  async aggregateVisitorStats(): Promise<{
    totalVisitors: number
    activeVisitors: number
    endedVisitors: number
    averageSessionDuration: number
  }> {
    try {
      const visitors = await Visitor.find()

      const totalVisitors = visitors.length
      const activeVisitors = visitors.filter(v => v.status === 'active').length
      const endedVisitors = visitors.filter(v => v.status === 'ended').length

      const avgSessionDuration = visitors.length > 0
        ? visitors.reduce((sum, v) => {
            const duration = v.lastSeen.getTime() - v.firstSeen.getTime()
            return sum + duration
          }, 0) / visitors.length / 1000
        : 0

      return {
        totalVisitors,
        activeVisitors,
        endedVisitors,
        averageSessionDuration: Math.round(avgSessionDuration)
      }
    } catch (error) {
      throw new Error(`Failed to aggregate visitor stats: ${error}`)
    }
  }

  /**
   * Aggregate journey statistics
   */
  async aggregateJourneyStats(): Promise<{
    totalJourneys: number
    averageZonesVisited: number
    averageDwellTime: number
    totalDwellTime: number
  }> {
    try {
      const journeys = await VisitorJourney.find()

      const totalJourneys = journeys.length
      const avgZones = journeys.length > 0
        ? journeys.reduce((sum, j) => sum + j.visitedZones.length, 0) / journeys.length
        : 0
      const avgDwell = journeys.length > 0
        ? journeys.reduce((sum, j) => sum + j.totalDwellTime, 0) / journeys.length
        : 0
      const totalDwell = journeys.reduce((sum, j) => sum + j.totalDwellTime, 0)

      return {
        totalJourneys,
        averageZonesVisited: Math.round(avgZones * 100) / 100,
        averageDwellTime: Math.round(avgDwell),
        totalDwellTime: Math.round(totalDwell)
      }
    } catch (error) {
      throw new Error(`Failed to aggregate journey stats: ${error}`)
    }
  }

  /**
   * Aggregate zone performance
   */
  async aggregateZonePerformance(): Promise<
    Array<{
      zoneId: string
      visits: number
      uniqueVisitors: number
      averageDwellTime: number
    }>
  > {
    try {
      const zoneStats = await Event.aggregate([
        { $match: { zoneId: { $ne: null } } },
        {
          $group: {
            _id: '$zoneId',
            visits: { $sum: 1 },
            visitors: { $addToSet: '$visitorId' },
            avgDwell: {
              $avg: {
                $cond: [
                  { $eq: ['$eventType', 'ZONE_EXIT'] },
                  '$metadata.dwellTime',
                  0
                ]
              }
            }
          }
        },
        {
          $project: {
            zoneId: '$_id',
            visits: 1,
            uniqueVisitors: { $size: '$visitors' },
            averageDwellTime: { $round: ['$avgDwell', 2] },
            _id: 0
          }
        },
        { $sort: { visits: -1 } }
      ])

      return zoneStats
    } catch (error) {
      throw new Error(`Failed to aggregate zone performance: ${error}`)
    }
  }

  /**
   * Aggregate time-based metrics
   */
  async aggregateTimeBasedMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<{
    eventCount: number
    visitorCount: number
    journeyCount: number
    averageDwellTime: number
  }> {
    try {
      const eventCount = await Event.countDocuments({
        timestamp: { $gte: startDate, $lte: endDate }
      })

      const visitorCount = await Visitor.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate }
      })

      const journeyCount = await VisitorJourney.countDocuments({
        entryTime: { $gte: startDate, $lte: endDate }
      })

      const journeys = await VisitorJourney.find({
        entryTime: { $gte: startDate, $lte: endDate }
      })

      const avgDwell = journeys.length > 0
        ? journeys.reduce((sum, j) => sum + j.totalDwellTime, 0) / journeys.length
        : 0

      return {
        eventCount,
        visitorCount,
        journeyCount,
        averageDwellTime: Math.round(avgDwell)
      }
    } catch (error) {
      throw new Error(`Failed to aggregate time-based metrics: ${error}`)
    }
  }

  /**
   * Generate comprehensive report
   */
  async generateComprehensiveReport(): Promise<{
    timestamp: Date
    visitors: Record<string, any>
    events: Record<string, any>
    journeys: Record<string, any>
    zones: Array<Record<string, any>>
  }> {
    try {
      const [visitors, events, journeys, zones] = await Promise.all([
        this.aggregateVisitorStats(),
        this.aggregateEventsByType(),
        this.aggregateJourneyStats(),
        this.aggregateZonePerformance()
      ])

      return {
        timestamp: new Date(),
        visitors,
        events,
        journeys,
        zones
      }
    } catch (error) {
      throw new Error(`Failed to generate comprehensive report: ${error}`)
    }
  }
}

export default new AggregationService()
