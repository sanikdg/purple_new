import express, { Router, Request, Response } from 'express'
import layoutService from '../services/layout.service.js'

const router: Router = express.Router()

/**
 * GET /api/store-layout
 * Get store layout summary
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const summary = await layoutService.getLayoutSummary()
    res.json({
      success: true,
      data: summary
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch store layout'
    })
  }
})

/**
 * GET /api/zones
 * Get all zones
 */
router.get('/zones/all', async (_req: Request, res: Response) => {
  try {
    const zones = await layoutService.getAllZones()
    res.json({
      success: true,
      data: zones,
      count: zones.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch zones'
    })
  }
})

/**
 * GET /api/zones/:id
 * Get zone by ID
 */
router.get('/zones/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const zone = await layoutService.getZoneById(id)

    if (!zone) {
      res.status(404).json({
        success: false,
        error: 'Zone not found'
      })
      return
    }

    res.json({
      success: true,
      data: zone
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch zone'
    })
  }
})

/**
 * GET /api/zones/type/:type
 * Get zones by type
 */
router.get('/type/:type', async (req: Request, res: Response): Promise<void> => {
  try {
    const { type } = req.params
    const validTypes = ['entrance', 'counter', 'fragrance', 'makeup', 'brand']

    if (!validTypes.includes(type)) {
      res.status(400).json({
        success: false,
        error: `Invalid zone type. Must be one of: ${validTypes.join(', ')}`
      })
      return
    }

    const zones = await layoutService.getZonesByType(
      type as 'entrance' | 'counter' | 'fragrance' | 'makeup' | 'brand'
    )

    res.json({
      success: true,
      data: zones,
      count: zones.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch zones by type'
    })
  }
})

/**
 * GET /api/zones/brand/:brandName
 * Get zone by brand name
 */
router.get('/brand/:brandName', async (req: Request, res: Response): Promise<void> => {
  try {
    const { brandName } = req.params
    const zone = await layoutService.getZoneByBrand(brandName)

    if (!zone) {
      res.status(404).json({
        success: false,
        error: 'Brand zone not found'
      })
      return
    }

    res.json({
      success: true,
      data: zone
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch brand zone'
    })
  }
})

/**
 * GET /api/zones/brands/all
 * Get all brand zones
 */
router.get('/brands/all', async (_req: Request, res: Response) => {
  try {
    const brands = await layoutService.getBrandZones()
    res.json({
      success: true,
      data: brands,
      count: brands.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch brand zones'
    })
  }
})

export default router
