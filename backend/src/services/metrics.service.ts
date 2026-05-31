import Event, { IEvent } from '../models/Event.js'
import VisitorJourney, { IVisitorJourney } from '../models/VisitorJourney.js'
import Visitor, { IVisitor } from '../models/Visitor.js'
import MetricSnapshot, { IMetricSnapshot } from '../models/MetricSnapshot.js'

export class MetricsService {
  /**
   * Get overview metrics
   */
  async getOverviewMetrics(): Promise<{
    totalVisitors: number
    activeVisitors: number
    averageVisitDuration: number
    mostVisitedZone: string | null
    completedVisits: number
  }> {
    try {
      // Total visitors
      const totalVisitors = await Visitor.countDocuments()

      // Active visitors
      const activeVisitors = await Visitor.countDocuments({ status: 'active' })

      // Average visit duration
      const journeys = await VisitorJourney.find()
      const avgDuration = journeys.length > 0
        ? journeys.reduce((sum, j) => sum + j.totalDwellTime, 0) / journeys.length
        : 0

      // Most visited zone
      const zoneVisits = await Event.aggregate([
        { $match: { eventType: 'ZONE_ENTER' } },
        { $group: { _id: '$zoneId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ])
      const mostVisitedZone = zoneVisits.length > 0 ? zoneVisits[0]._id : null

      // Completed visits
      const completedVisits = await Visitor.countDocuments({ status: 'ended' })

      return {
        totalVisitors,
        activeVisitors,
        averageVisitDuration: Math.round(avgDuration),
        mostVisitedZone,
        completedVisits
      }
    } catch (error) {
      throw new Error(`Failed to get overview metrics: ${error}`)
    }
  }

  /**
   * Get footfall metrics
   */
  async getFootfallMetrics(): Promise<{
    totalVisitors: number
    uniqueVisitors: number
    visitorsPerHour: Record<string, number>
    visitorsPerDay: Record<string, number>
  }> {
    try {
      const totalVisitors = await Visitor.countDocuments()
      const uniqueVisitors = await Visitor.distinct('visitorId').then(ids => ids.length)

      // Visitors per hour
      const hourlyData = await Event.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d %H:00', date: '$timestamp' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])

      const visitorsPerHour: Record<string, number> = {}
      hourlyData.forEach(item => {
        visitorsPerHour[item._id] = item.count
      })

      // Visitors per day
      const dailyData = await Event.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])

      const visitorsPerDay: Record<string, number> = {}
      dailyData.forEach(item => {
        visitorsPerDay[item._id] = item.count
      })

      return {
        totalVisitors,
        uniqueVisitors,
        visitorsPerHour,
        visitorsPerDay
      }
    } catch (error) {
      throw new Error(`Failed to get footfall metrics: ${error}`)
    }
  }

  /**
   * Get zone metrics
   */
  async getZoneMetrics(): Promise<{
    zoneVisits: Record<string, number>
    uniqueZoneVisitors: Record<string, number>
    averageZoneDwellTime: Record<string, number>
    mostVisitedZones: Array<{ zone: string; visits: number }>
    leastVisitedZones: Array<{ zone: string; visits: number }>
  }> {
    try {
      // Zone visits
      const zoneVisitsData = await Event.aggregate([
        { $match: { eventType: 'ZONE_ENTER' } },
        { $group: { _id: '$zoneId', count: { $sum: 1 } } }
      ])

      const zoneVisits: Record<string, number> = {}
      zoneVisitsData.forEach(item => {
        zoneVisits[item._id] = item.count
      })

      // Unique zone visitors
      const uniqueVisitorsData = await Event.aggregate([
        { $match: { eventType: 'ZONE_ENTER' } },
        { $group: { _id: '$zoneId', visitors: { $addToSet: '$visitorId' } } },
        { $project: { _id: 1, count: { $size: '$visitors' } } }
      ])

      const uniqueZoneVisitors: Record<string, number> = {}
      uniqueVisitorsData.forEach(item => {
        uniqueZoneVisitors[item._id] = item.count
      })

      // Average dwell time per zone
      const dwellTimeData = await Event.aggregate([
        { $match: { eventType: 'ZONE_EXIT' } },
        {
          $group: {
            _id: '$zoneId',
            avgDwell: { $avg: '$metadata.dwellTime' }
          }
        }
      ])

      const averageZoneDwellTime: Record<string, number> = {}
      dwellTimeData.forEach(item => {
        averageZoneDwellTime[item._id] = Math.round(item.avgDwell * 100) / 100
      })

      // Most visited zones
      const mostVisitedZones = Object.entries(zoneVisits)
        .map(([zone, visits]) => ({ zone, visits }))
        .sort((a, b) => b.visits - a.visits)
        .slice(0, 10)

      // Least visited zones
      const leastVisitedZones = Object.entries(zoneVisits)
        .map(([zone, visits]) => ({ zone, visits }))
        .sort((a, b) => a.visits - b.visits)
        .slice(0, 10)

      return {
        zoneVisits,
        uniqueZoneVisitors,
        averageZoneDwellTime,
        mostVisitedZones,
        leastVisitedZones
      }
    } catch (error) {
      throw new Error(`Failed to get zone metrics: ${error}`)
    }
  }

  /**
   * Get journey metrics
   */
  async getJourneyMetrics(): Promise<{
    averageVisitDuration: number
    averageZonesVisited: number
    mostCommonPaths: Array<{ path: string; count: number }>
    storeEntryCount: number
    storeExitCount: number
  }> {
    try {
      const journeys = await VisitorJourney.find()

      // Average visit duration
      const avgDuration = journeys.length > 0
        ? journeys.reduce((sum, j) => sum + j.totalDwellTime, 0) / journeys.length
        : 0

      // Average zones visited
      const avgZones = journeys.length > 0
        ? journeys.reduce((sum, j) => sum + j.visitedZones.length, 0) / journeys.length
        : 0

      // Most common paths
      const pathCounts: Record<string, number> = {}
      journeys.forEach(journey => {
        const path = journey.zoneSequence.map(z => z.zoneId).join(' → ')
        pathCounts[path] = (pathCounts[path] || 0) + 1
      })

      const mostCommonPaths = Object.entries(pathCounts)
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      // Store entry/exit counts
      const entryCount = await Event.countDocuments({
        eventType: 'VISITOR_SESSION_START'
      })
      const exitCount = await Event.countDocuments({
        eventType: 'VISITOR_SESSION_END'
      })

      return {
        averageVisitDuration: Math.round(avgDuration),
        averageZonesVisited: Math.round(avgZones * 100) / 100,
        mostCommonPaths,
        storeEntryCount: entryCount,
        storeExitCount: exitCount
      }
    } catch (error) {
      throw new Error(`Failed to get journey metrics: ${error}`)
    }
  }

  /**
   * Get operational metrics
   */
  async getOperationalMetrics(): Promise<{
    activeVisitors: number
    completedVisits: number
    averageSessionLength: number
  }> {
    try {
      const activeVisitors = await Visitor.countDocuments({ status: 'active' })
      const completedVisits = await Visitor.countDocuments({ status: 'ended' })

      const visitors = await Visitor.find()
      const avgSessionLength = visitors.length > 0
        ? visitors.reduce((sum, v) => {
            const duration = v.lastSeen.getTime() - v.firstSeen.getTime()
            return sum + duration
          }, 0) / visitors.length / 1000
        : 0

      return {
        activeVisitors,
        completedVisits,
        averageSessionLength: Math.round(avgSessionLength)
      }
    } catch (error) {
      throw new Error(`Failed to get operational metrics: ${error}`)
    }
  }

  /**
   * Store metric snapshot
   */
  async storeMetricSnapshot(
    metricType: 'footfall' | 'zone' | 'journey' | 'operational' | 'summary',
    value: number | Record<string, any>,
    metadata?: Record<string, any>
  ): Promise<IMetricSnapshot> {
    try {
      const snapshot = new MetricSnapshot({
        metricType,
        value,
        timestamp: new Date(),
        metadata
      })
      return await snapshot.save()
    } catch (error) {
      throw new Error(`Failed to store metric snapshot: ${error}`)
    }
  }

  /**
   * Get metric history
   */
  async getMetricHistory(
    metricType: string,
    limit: number = 100
  ): Promise<IMetricSnapshot[]> {
    try {
      return await MetricSnapshot.find({ metricType })
        .sort({ timestamp: -1 })
        .limit(limit)
    } catch (error) {
      throw new Error(`Failed to get metric history: ${error}`)
    }
  }
}

export default new MetricsService()
