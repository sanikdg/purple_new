import express, { Router, Request, Response } from 'express'
import Camera from '../models/Camera.js'

const router: Router = express.Router()

/**
 * GET /api/cameras
 * Get all cameras
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const cameras = await Camera.find().sort({ createdAt: -1 })
    res.json({
      success: true,
      data: cameras,
      count: cameras.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cameras'
    })
  }
})

/**
 * GET /api/cameras/:id
 * Get camera by ID
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const camera = await Camera.findOne({ cameraId: id })

    if (!camera) {
      res.status(404).json({
        success: false,
        error: 'Camera not found'
      })
      return
    }

    res.json({
      success: true,
      data: camera
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch camera'
    })
  }
})

export default router
