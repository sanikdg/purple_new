import Dataset, { IDataset } from '../models/Dataset.js'
import Camera from '../models/Camera.js'

export class DatasetService {
  /**
   * Register a new dataset
   */
  async registerDataset(data: {
    datasetId: string
    cameraId: string
    fileName: string
    filePath: string
    duration?: number
    fps?: number
    resolution?: string
    fileSize?: number
  }): Promise<IDataset> {
    const dataset = new Dataset({
      ...data,
      status: 'registered'
    })
    return await dataset.save()
  }

  /**
   * Get all datasets
   */
  async getAllDatasets(): Promise<IDataset[]> {
    return await Dataset.find().sort({ createdAt: -1 })
  }

  /**
   * Get dataset by ID
   */
  async getDatasetById(datasetId: string): Promise<IDataset | null> {
    return await Dataset.findOne({ datasetId })
  }

  /**
   * Get datasets by camera ID
   */
  async getDatasetsByCamera(cameraId: string): Promise<IDataset[]> {
    return await Dataset.find({ cameraId }).sort({ createdAt: -1 })
  }

  /**
   * Get dataset statistics
   */
  async getDatasetStats(): Promise<{
    totalDatasets: number
    totalCameras: number
    totalDuration: number
    averageFps: number
    statusBreakdown: Record<string, number>
  }> {
    const datasets = await Dataset.find()
    const cameras = await Camera.find()

    const statusBreakdown: Record<string, number> = {
      pending: 0,
      registered: 0,
      processing: 0,
      completed: 0,
      failed: 0
    }

    let totalDuration = 0
    let totalFps = 0

    datasets.forEach((dataset) => {
      statusBreakdown[dataset.status]++
      totalDuration += dataset.duration || 0
      totalFps += dataset.fps || 0
    })

    return {
      totalDatasets: datasets.length,
      totalCameras: cameras.length,
      totalDuration,
      averageFps: datasets.length > 0 ? totalFps / datasets.length : 0,
      statusBreakdown
    }
  }

  /**
   * Update dataset status
   */
  async updateDatasetStatus(
    datasetId: string,
    status: 'pending' | 'registered' | 'processing' | 'completed' | 'failed'
  ): Promise<IDataset | null> {
    return await Dataset.findOneAndUpdate(
      { datasetId },
      { status },
      { new: true }
    )
  }

  /**
   * Delete dataset
   */
  async deleteDataset(datasetId: string): Promise<boolean> {
    const result = await Dataset.deleteOne({ datasetId })
    return result.deletedCount > 0
  }

  /**
   * Validate dataset structure
   */
  validateDatasetStructure(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!data.datasetId) errors.push('datasetId is required')
    if (!data.cameraId) errors.push('cameraId is required')
    if (!data.fileName) errors.push('fileName is required')
    if (!data.filePath) errors.push('filePath is required')

    if (data.fps && (data.fps < 1 || data.fps > 120)) {
      errors.push('fps must be between 1 and 120')
    }

    if (data.duration && data.duration < 0) {
      errors.push('duration must be positive')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }
}

export default new DatasetService()
