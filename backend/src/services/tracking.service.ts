import Visitor, { IVisitor } from '../models/Visitor.js'
import Track, { ITrack } from '../models/Track.js'

export class TrackingService {
  /**
   * Store visitor sessions
   */
  async storeVisitors(visitors: any[]): Promise<IVisitor[]> {
    try {
      const storedVisitors = await Visitor.insertMany(visitors)
      return storedVisitors as IVisitor[]
    } catch (error) {
      throw new Error(`Failed to store visitors: ${error}`)
    }
  }

  /**
   * Store track data
   */
  async storeTracks(tracks: any[]): Promise<ITrack[]> {
    try {
      const storedTracks = await Track.insertMany(tracks)
      return storedTracks as ITrack[]
    } catch (error) {
      throw new Error(`Failed to store tracks: ${error}`)
    }
  }

  /**
   * Get all visitors
   */
  async getAllVisitors(): Promise<IVisitor[]> {
    return await Visitor.find().sort({ firstSeen: -1 })
  }

  /**
   * Get visitors by camera
   */
  async getVisitorsByCamera(cameraId: string): Promise<IVisitor[]> {
    return await Visitor.find({ cameraId }).sort({ firstSeen: -1 })
  }

  /**
   * Get active visitors
   */
  async getActiveVisitors(cameraId?: string): Promise<IVisitor[]> {
    const query = cameraId ? { cameraId, status: 'active' } : { status: 'active' }
    return await Visitor.find(query).sort({ firstSeen: -1 })
  }

  /**
   * Get visitors by date range
   */
  async getVisitorsByDateRange(
    cameraId: string,
    startDate: Date,
    endDate: Date
  ): Promise<IVisitor[]> {
    return await Visitor.find({
      cameraId,
      firstSeen: { $gte: startDate, $lte: endDate }
    }).sort({ firstSeen: -1 })
  }

  /**
   * Get visitor statistics
   */
  async getVisitorStats(cameraId?: string): Promise<{
    totalVisitors: number
    activeVisitors: number
    endedVisitors: number
    averageFrameCount: number
    totalFrames: number
  }> {
    const query = cameraId ? { cameraId } : {}

    const visitors = await Visitor.find(query)
    const activeCount = visitors.filter(v => v.status === 'active').length
    const endedCount = visitors.filter(v => v.status === 'ended').length
    const totalFrames = visitors.reduce((sum, v) => sum + v.frameCount, 0)
    const avgFrames = visitors.length > 0 ? totalFrames / visitors.length : 0

    return {
      totalVisitors: visitors.length,
      activeVisitors: activeCount,
      endedVisitors: endedCount,
      averageFrameCount: Math.round(avgFrames * 100) / 100,
      totalFrames
    }
  }

  /**
   * Get tracks by camera
   */
  async getTracksByCamera(cameraId: string): Promise<ITrack[]> {
    return await Track.find({ cameraId }).sort({ timestamp: -1 })
  }

  /**
   * Get tracks by track ID
   */
  async getTracksByTrackId(trackId: string): Promise<ITrack[]> {
    return await Track.find({ trackId }).sort({ frameNumber: 1 })
  }

  /**
   * Get track statistics
   */
  async getTrackStats(cameraId?: string): Promise<{
    totalTracks: number
    uniqueTrackIds: number
    averageConfidence: number
    totalFrames: number
  }> {
    const query = cameraId ? { cameraId } : {}

    const tracks = await Track.find(query)
    const uniqueTrackIds = new Set(tracks.map(t => t.trackId)).size
    const totalConfidence = tracks.reduce((sum, t) => sum + t.confidence, 0)
    const avgConfidence = tracks.length > 0 ? totalConfidence / tracks.length : 0

    return {
      totalTracks: tracks.length,
      uniqueTrackIds,
      averageConfidence: Math.round(avgConfidence * 10000) / 10000,
      totalFrames: new Set(tracks.map(t => t.frameNumber)).size
    }
  }

  /**
   * Get visitor count by camera
   */
  async getVisitorCountByCamera(): Promise<
    Array<{ cameraId: string; count: number; activeCount: number }>
  > {
    const results = await Visitor.aggregate([
      {
        $group: {
          _id: '$cameraId',
          count: { $sum: 1 },
          activeCount: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          cameraId: '$_id',
          count: 1,
          activeCount: 1,
          _id: 0
        }
      },
      {
        $sort: { count: -1 }
      }
    ])

    return results
  }

  /**
   * Get average session duration by camera
   */
  async getAverageSessionDurationByCamera(): Promise<
    Array<{ cameraId: string; avgDuration: number }>
  > {
    const results = await Visitor.aggregate([
      {
        $addFields: {
          duration: {
            $divide: [
              { $subtract: ['$lastSeen', '$firstSeen'] },
              1000
            ]
          }
        }
      },
      {
        $group: {
          _id: '$cameraId',
          avgDuration: { $avg: '$duration' }
        }
      },
      {
        $project: {
          cameraId: '$_id',
          avgDuration: { $round: ['$avgDuration', 2] },
          _id: 0
        }
      },
      {
        $sort: { avgDuration: -1 }
      }
    ])

    return results
  }

  /**
   * Delete visitors by camera
   */
  async deleteVisitorsByCamera(cameraId: string): Promise<number> {
    const result = await Visitor.deleteMany({ cameraId })
    return result.deletedCount || 0
  }

  /**
   * Delete tracks by camera
   */
  async deleteTracksByCamera(cameraId: string): Promise<number> {
    const result = await Track.deleteMany({ cameraId })
    return result.deletedCount || 0
  }
}

export default new TrackingService()
