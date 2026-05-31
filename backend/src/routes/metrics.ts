import express, { Router, Request, Response } from 'express'
import metricsService from '../services/metrics.service.js'
import aggregationService from '../services/aggregation.service.js'

const router: Router = express.Router()

/**
 * GET /api/metrics/overview
 * Get overview metrics
 */
router.get('/overview', async (_req: Request, res: Response) => {
  try {
    const metrics = await metricsService.getOverviewMetrics()

    res.json({
      success: true,
      data: metrics
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch overview metrics'
    })
  }
})

/**
 * GET /api/metrics/footfall
 * Get footfall metrics
 */
router.get('/footfall', async (_req: Request, res: Response) => {
  try {
    const metrics = await metricsService.getFootfallMetrics()

    res.json({
      success: true,
      data: metrics
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch footfall metrics'
    })
  }
})

/**
 * GET /api/metrics/zones
 * Get zone metrics
 */
router.get('/zones', async (_req: Request, res: Response) => {
  try {
    const metrics = await metricsService.getZoneMetrics()

    res.json({
      success: true,
      data: metrics
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch zone metrics'
    })
  }
})

/**
 * GET /api/metrics/journeys
 * Get journey metrics
 */
router.get('/journeys', async (_req: Request, res: Response) => {
  try {
    const metrics = await metricsService.getJourneyMetrics()

    res.json({
      success: true,
      data: metrics
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch journey metrics'
    })
  }
})

/**
 * GET /api/metrics/operational
 * Get operational metrics
 */
router.get('/operational', async (_req: Request, res: Response) => {
  try {
    const metrics = await metricsService.getOperationalMetrics()

    res.json({
      success: true,
      data: metrics
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch operational metrics'
    })
  }
})

/**
 * GET /api/metrics/live
 * Get live metrics (all metrics combined)
 */
router.get('/live', async (_req: Request, res: Response) => {
  try {
    const [overview, footfall, zones, journeys, operational] = await Promise.all([
      metricsService.getOverviewMetrics(),
      metricsService.getFootfallMetrics(),
      metricsService.getZoneMetrics(),
      metricsService.getJourneyMetrics(),
      metricsService.getOperationalMetrics()
    ])

    res.json({
      success: true,
      data: {
        overview,
        footfall,
        zones,
        journeys,
        operational,
        timestamp: new Date()
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch live metrics'
    })
  }
})

/**
 * GET /api/metrics/report
 * Get comprehensive report
 */
router.get('/report', async (_req: Request, res: Response) => {
  try {
    const report = await aggregationService.generateComprehensiveReport()

    res.json({
      success: true,
      data: report
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate report'
    })
  }
})

/**
 * GET /api/metrics/aggregation/events
 * Get aggregated events
 */
router.get('/aggregation/events', async (_req: Request, res: Response) => {
  try {
    const [byType, byCamera, byZone] = await Promise.all([
      aggregationService.aggregateEventsByType(),
      aggregationService.aggregateEventsByCamera(),
      aggregationService.aggregateEventsByZone()
    ])

    res.json({
      success: true,
      data: {
        byType,
        byCamera,
        byZone
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch aggregated events'
    })
  }
})

/**
 * GET /api/metrics/aggregation/zones
 * Get zone performance aggregation
 */
router.get('/aggregation/zones', async (_req: Request, res: Response) => {
  try {
    const zones = await aggregationService.aggregateZonePerformance()

    res.json({
      success: true,
      data: zones
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch zone performance'
    })
  }
})

/**
 * GET /api/metrics/aggregation/time-range
 * Get time-based metrics
 */
router.get('/aggregation/time-range', async (req: Request, res: Response) => {
  try {
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(Date.now() - 24 * 60 * 60 * 1000)
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date()

    const metrics = await aggregationService.aggregateTimeBasedMetrics(startDate, endDate)

    res.json({
      success: true,
      data: metrics
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch time-based metrics'
    })
  }
})

export default router
