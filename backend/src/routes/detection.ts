import express, { Router, Request, Response } from 'express'
import detectionService from '../services/detection.service.js'

const router: Router = express.Router()

/**
 * POST /api/detection/run
 * Start detection for a camera
 */
router.post('/run', async (req: Request, res: Response): Promise<void> => {
  try {
    const { cameraId } = req.body

    if (!cameraId) {
      res.status(400).json({
        success: false,
        error: 'cameraId is required'
      })
      return
    }

    // TODO: Call AI service to run detection
    res.json({
      success: true,
      message: `Detection started for ${cameraId}`,
      cameraId
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to start detection'
    })
  }
})

/**
 * GET /api/detection/status
 * Get detection status
 */
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const stats = await detectionService.getDetectionStats()

    res.json({
      success: true,
      data: {
        status: 'ready',
        ...stats
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch detection status'
    })
  }
})

/**
 * GET /api/detection/results
 * Get all detection results
 */
router.get('/results', async (_req: Request, res: Response) => {
  try {
    const detections = await detectionService.getAllDetections()

    res.json({
      success: true,
      data: detections,
      count: detections.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch detection results'
    })
  }
})

/**
 * GET /api/detection/results/:cameraId
 * Get detection results for a specific camera
 */
router.get(
  '/results/:cameraId',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { cameraId } = req.params
      const detections = await detectionService.getDetectionsByCamera(cameraId)

      res.json({
        success: true,
        data: detections,
        count: detections.length,
        cameraId
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch detection results'
      })
    }
  }
)

/**
 * GET /api/detection/stats
 * Get detection statistics
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const { cameraId } = req.query
    const stats = await detectionService.getDetectionStats(
      cameraId as string
    )

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch detection statistics'
    })
  }
})

/**
 * GET /api/detection/stats/by-camera
 * Get detection count by camera
 */
router.get('/stats/by-camera', async (_req: Request, res: Response) => {
  try {
    const stats = await detectionService.getDetectionCountByCamera()

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch camera statistics'
    })
  }
})

/**
 * GET /api/detection/stats/confidence
 * Get average confidence by camera
 */
router.get('/stats/confidence', async (_req: Request, res: Response) => {
  try {
    const stats = await detectionService.getAverageConfidenceByCamera()

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch confidence statistics'
    })
  }
})

export default router
