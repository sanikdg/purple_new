import express, { Router, Request, Response } from 'express'
import trackingService from '../services/tracking.service.js'

const router: Router = express.Router()

/**
 * POST /api/tracking/run
 * Start tracking for a camera
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

    // TODO: Call AI service to run tracking
    res.json({
      success: true,
      message: `Tracking started for ${cameraId}`,
      cameraId
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to start tracking'
    })
  }
})

/**
 * GET /api/tracking/status
 * Get tracking status
 */
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const stats = await trackingService.getVisitorStats()

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
      error: 'Failed to fetch tracking status'
    })
  }
})

/**
 * GET /api/tracking/results
 * Get all tracking results
 */
router.get('/results', async (_req: Request, res: Response) => {
  try {
    const visitors = await trackingService.getAllVisitors()

    res.json({
      success: true,
      data: visitors,
      count: visitors.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tracking results'
    })
  }
})

/**
 * GET /api/tracking/results/:cameraId
 * Get tracking results for a specific camera
 */
router.get(
  '/results/:cameraId',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { cameraId } = req.params
      const visitors = await trackingService.getVisitorsByCamera(cameraId)

      res.json({
        success: true,
        data: visitors,
        count: visitors.length,
        cameraId
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch tracking results'
      })
    }
  }
)

/**
 * GET /api/tracking/visitors
 * Get all visitors
 */
router.get('/visitors', async (_req: Request, res: Response) => {
  try {
    const visitors = await trackingService.getAllVisitors()

    res.json({
      success: true,
      data: visitors,
      count: visitors.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch visitors'
    })
  }
})

/**
 * GET /api/tracking/visitors/active
 * Get active visitors
 */
router.get('/visitors/active', async (req: Request, res: Response) => {
  try {
    const { cameraId } = req.query
    const visitors = await trackingService.getActiveVisitors(
      cameraId as string
    )

    res.json({
      success: true,
      data: visitors,
      count: visitors.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch active visitors'
    })
  }
})

/**
 * GET /api/tracking/stats
 * Get tracking statistics
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const { cameraId } = req.query
    const stats = await trackingService.getVisitorStats(
      cameraId as string
    )

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tracking statistics'
    })
  }
})

/**
 * GET /api/tracking/stats/by-camera
 * Get visitor count by camera
 */
router.get('/stats/by-camera', async (_req: Request, res: Response) => {
  try {
    const stats = await trackingService.getVisitorCountByCamera()

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
 * GET /api/tracking/stats/duration
 * Get average session duration by camera
 */
router.get('/stats/duration', async (_req: Request, res: Response) => {
  try {
    const stats = await trackingService.getAverageSessionDurationByCamera()

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch duration statistics'
    })
  }
})

/**
 * GET /api/tracking/tracks/:cameraId
 * Get tracks for a specific camera
 */
router.get(
  '/tracks/:cameraId',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { cameraId } = req.params
      const tracks = await trackingService.getTracksByCamera(cameraId)

      res.json({
        success: true,
        data: tracks,
        count: tracks.length,
        cameraId
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch tracks'
      })
    }
  }
)

export default router
