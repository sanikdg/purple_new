import VisitorJourney, { IVisitorJourney } from '../models/VisitorJourney.js'

export class JourneyService {
  /**
   * Store visitor journeys
   */
  async storeJourneys(journeys: any[]): Promise<IVisitorJourney[]> {
    try {
      const storedJourneys = await VisitorJourney.insertMany(journeys)
      return storedJourneys as IVisitorJourney[]
    } catch (error) {
      throw new Error(`Failed to store journeys: ${error}`)
    }
  }

  /**
   * Get all journeys
   */
  async getAllJourneys(): Promise<IVisitorJourney[]> {
    return await VisitorJourney.find().sort({ entryTime: -1 })
  }

  /**
   * Get journey by visitor
   */
  async getJourneyByVisitor(visitorId: string): Promise<IVisitorJourney | null> {
    return await VisitorJourney.findOne({ visitorId }).sort({ entryTime: -1 })
  }

  /**
   * Get journeys by camera
   */
  async getJourneysByCamera(cameraId: string): Promise<IVisitorJourney[]> {
    return await VisitorJourney.find({ cameraId }).sort({ entryTime: -1 })
  }

  /**
   * Get journeys by date range
   */
  async getJourneysByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<IVisitorJourney[]> {
    return await VisitorJourney.find({
      entryTime: { $gte: startDate, $lte: endDate }
    }).sort({ entryTime: -1 })
  }

  /**
   * Get journey statistics
   */
  async getJourneyStats(cameraId?: string): Promise<{
    totalJourneys: number
    averageZonesVisited: number
    averageDwellTime: number
    totalDwellTime: number
  }> {
    const query = cameraId ? { cameraId } : {}
    const journeys = await VisitorJourney.find(query)

    const totalZones = journeys.reduce((sum, j) => sum + j.visitedZones.length, 0)
    const totalDwell = journeys.reduce((sum, j) => sum + j.totalDwellTime, 0)

    const avgZones = journeys.length > 0 ? totalZones / journeys.length : 0
    const avgDwell = journeys.length > 0 ? totalDwell / journeys.length : 0

    return {
      totalJourneys: journeys.length,
      averageZonesVisited: Math.round(avgZones * 100) / 100,
      averageDwellTime: Math.round(avgDwell * 100) / 100,
      totalDwellTime: Math.round(totalDwell * 100) / 100
    }
  }

  /**
   * Get zone visit frequency
   */
  async getZoneVisitFrequency(cameraId?: string): Promise<
    Array<{ zoneId: string; visitCount: number; averageDwell: number }>
  > {
    const query = cameraId ? { cameraId } : {}
    const journeys = await VisitorJourney.find(query)

    const zoneStats: Record<string, { count: number; totalDwell: number }> = {}

    for (const journey of journeys) {
      for (const zone of journey.zoneSequence) {
        if (!zoneStats[zone.zoneId]) {
          zoneStats[zone.zoneId] = { count: 0, totalDwell: 0 }
        }
        zoneStats[zone.zoneId].count++
        zoneStats[zone.zoneId].totalDwell += zone.dwellTime
      }
    }

    return Object.entries(zoneStats).map(([zoneId, stats]) => ({
      zoneId,
      visitCount: stats.count,
      averageDwell: Math.round((stats.totalDwell / stats.count) * 100) / 100
    }))
  }

  /**
   * Get visitor journey path
   */
  async getVisitorJourneyPath(visitorId: string): Promise<string[]> {
    const journey = await VisitorJourney.findOne({ visitorId })
    if (!journey) return []
    return journey.zoneSequence.map(z => z.zoneId)
  }

  /**
   * Get most common journey paths
   */
  async getMostCommonPaths(cameraId?: string, limit: number = 10): Promise<
    Array<{ path: string; count: number }>
  > {
    const query = cameraId ? { cameraId } : {}
    const journeys = await VisitorJourney.find(query)

    const pathCounts: Record<string, number> = {}

    for (const journey of journeys) {
      const path = journey.zoneSequence.map(z => z.zoneId).join(' → ')
      if (!pathCounts[path]) {
        pathCounts[path] = 0
      }
      pathCounts[path]++
    }

    return Object.entries(pathCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  /**
   * Delete journeys by visitor
   */
  async deleteJourneyByVisitor(visitorId: string): Promise<number> {
    const result = await VisitorJourney.deleteMany({ visitorId })
    return result.deletedCount || 0
  }

  /**
   * Delete journeys by camera
   */
  async deleteJourneysByCamera(cameraId: string): Promise<number> {
    const result = await VisitorJourney.deleteMany({ cameraId })
    return result.deletedCount || 0
  }
}

export default new JourneyService()
