import express, { Router, Request, Response } from 'express'
import eventService from '../services/event.service.js'

const router: Router = express.Router()

/**
 * GET /api/events
 * Get all events
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const events = await eventService.getAllEvents()

    res.json({
      success: true,
      data: events,
      count: events.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch events'
    })
  }
})

/**
 * GET /api/events/live
 * Get recent events (live feed)
 */
router.get('/live', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100
    const events = await eventService.getRecentEvents(limit)

    res.json({
      success: true,
      data: events,
      count: events.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch live events'
    })
  }
})

/**
 * GET /api/events/:visitorId
 * Get events for specific visitor
 */
router.get('/:visitorId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { visitorId } = req.params
    const events = await eventService.getEventsByVisitor(visitorId)

    res.json({
      success: true,
      data: events,
      count: events.length,
      visitorId
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch visitor events'
    })
  }
})

/**
 * GET /api/events/camera/:cameraId
 * Get events for specific camera
 */
router.get('/camera/:cameraId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { cameraId } = req.params
    const events = await eventService.getEventsByCamera(cameraId)

    res.json({
      success: true,
      data: events,
      count: events.length,
      cameraId
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch camera events'
    })
  }
})

/**
 * GET /api/events/zone/:zoneId
 * Get events for specific zone
 */
router.get('/zone/:zoneId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { zoneId } = req.params
    const events = await eventService.getEventsByZone(zoneId)

    res.json({
      success: true,
      data: events,
      count: events.length,
      zoneId
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch zone events'
    })
  }
})

/**
 * GET /api/events/stats
 * Get event statistics
 */
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await eventService.getEventStats()

    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch event statistics'
    })
  }
})

export default router
