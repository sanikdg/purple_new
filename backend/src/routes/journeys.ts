import express, { Router, Request, Response } from 'express'
import journeyService from '../services/journey.service.js'

const router: Router = express.Router()

/**
 * GET /api/journeys
 * Get all journeys
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const journeys = await journeyService.getAllJourneys()

    res.json({
      success: true,
      data: journeys,
      count: journeys.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch journeys'
    })
  }
})

/**
 * GET /api/journeys/:visitorId
 * Get journey for specific visitor
 */
router.get('/:visitorId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { visitorId } = req.params
    const journey = await journeyService.getJourneyByVisitor(visitorId)

    res.json({
      success: true,
      data: journey,
      visitorId
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch visitor journey'
    })
  }
})

/**
 * GET /api/journeys/camera/:cameraId
 * Get journeys for specific camera
 */
router.get('/camera/:cameraId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { cameraId } = req.params
    const journeys = await journeyService.getJourneysByCamera(cameraId)

    res.json({
      success: true,
      data: journeys,
      count: journeys.length,
      cameraId
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch camera journeys'
    })
  }
})

/**
 * GET /api/journeys/stats
 * Get journey statistics
 */
router.get('/stats', async (req: Request, res: Response) => {
  try {
    const { cameraId } = req.query
    const stats = await journeyService.getJourneyStats(cameraId as string)

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch journey statistics'
    })
  }
})

/**
 * GET /api/journeys/zones/frequency
 * Get zone visit frequency
 */
router.get('/zones/frequency', async (req: Request, res: Response) => {
  try {
    const { cameraId } = req.query
    const frequency = await journeyService.getZoneVisitFrequency(cameraId as string)

    res.json({
      success: true,
      data: frequency
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch zone frequency'
    })
  }
})

/**
 * GET /api/journeys/paths/common
 * Get most common journey paths
 */
router.get('/paths/common', async (req: Request, res: Response) => {
  try {
    const { cameraId, limit } = req.query
    const paths = await journeyService.getMostCommonPaths(
      cameraId as string,
      parseInt(limit as string) || 10
    )

    res.json({
      success: true,
      data: paths
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch common paths'
    })
  }
})

export default router
