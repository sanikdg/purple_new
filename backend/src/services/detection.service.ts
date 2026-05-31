import Detection, { IDetection } from '../models/Detection.js'

export class DetectionService {
  /**
   * Store detection results
   */
  async storeDetections(detections: any[]): Promise<IDetection[]> {
    try {
      const storedDetections = await Detection.insertMany(detections)
      return storedDetections as IDetection[]
    } catch (error) {
      throw new Error(`Failed to store detections: ${error}`)
    }
  }

  /**
   * Get all detections
   */
  async getAllDetections(): Promise<IDetection[]> {
    return await Detection.find().sort({ timestamp: -1 })
  }

  /**
   * Get detections by camera
   */
  async getDetectionsByCamera(cameraId: string): Promise<IDetection[]> {
    return await Detection.find({ cameraId }).sort({ timestamp: -1 })
  }

  /**
   * Get detections by camera and date range
   */
  async getDetectionsByDateRange(
    cameraId: string,
    startDate: Date,
    endDate: Date
  ): Promise<IDetection[]> {
    return await Detection.find({
      cameraId,
      timestamp: { $gte: startDate, $lte: endDate }
    }).sort({ timestamp: -1 })
  }

  /**
   * Get detection statistics
   */
  async getDetectionStats(cameraId?: string): Promise<{
    totalDetections: number
    totalFrames: number
    camerasWithDetections: number
    averageConfidence: number
  }> {
    const query = cameraId ? { cameraId } : {}

    const detections = await Detection.find(query)
    const uniqueFrames = new Set(
      detections.map(d => `${d.cameraId}-${d.frameNumber}`)
    )
    const uniqueCameras = new Set(detections.map(d => d.cameraId))

    const totalConfidence = detections.reduce(
      (sum, d) => sum + d.confidence,
      0
    )
    const averageConfidence =
      detections.length > 0 ? totalConfidence / detections.length : 0

    return {
      totalDetections: detections.length,
      totalFrames: uniqueFrames.size,
      camerasWithDetections: uniqueCameras.size,
      averageConfidence: Math.round(averageConfidence * 10000) / 10000
    }
  }

  /**
   * Get detections by frame
   */
  async getDetectionsByFrame(
    cameraId: string,
    frameNumber: number
  ): Promise<IDetection[]> {
    return await Detection.find({ cameraId, frameNumber }).sort({
      confidence: -1
    })
  }

  /**
   * Get high confidence detections
   */
  async getHighConfidenceDetections(
    minConfidence: number = 0.8
  ): Promise<IDetection[]> {
    return await Detection.find({ confidence: { $gte: minConfidence } }).sort({
      confidence: -1
    })
  }

  /**
   * Delete detections by camera
   */
  async deleteDetectionsByCamera(cameraId: string): Promise<number> {
    const result = await Detection.deleteMany({ cameraId })
    return result.deletedCount || 0
  }

  /**
   * Get detection count by camera
   */
  async getDetectionCountByCamera(): Promise<
    Array<{ cameraId: string; count: number }>
  > {
    const results = await Detection.aggregate([
      {
        $group: {
          _id: '$cameraId',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          cameraId: '$_id',
          count: 1,
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
   * Get average confidence by camera
   */
  async getAverageConfidenceByCamera(): Promise<
    Array<{ cameraId: string; avgConfidence: number }>
  > {
    const results = await Detection.aggregate([
      {
        $group: {
          _id: '$cameraId',
          avgConfidence: { $avg: '$confidence' }
        }
      },
      {
        $project: {
          cameraId: '$_id',
          avgConfidence: { $round: ['$avgConfidence', 4] },
          _id: 0
        }
      },
      {
        $sort: { avgConfidence: -1 }
      }
    ])

    return results
  }
}

export default new DetectionService()
