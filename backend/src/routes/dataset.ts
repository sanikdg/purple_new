import express, { Router, Request, Response } from 'express'
import datasetService from '../services/dataset.service.js'

const router: Router = express.Router()

/**
 * GET /api/datasets
 * Get all datasets
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const datasets = await datasetService.getAllDatasets()
    res.json({
      success: true,
      data: datasets,
      count: datasets.length
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch datasets'
    })
  }
})

/**
 * GET /api/datasets/:id
 * Get dataset by ID
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const dataset = await datasetService.getDatasetById(id)

    if (!dataset) {
      res.status(404).json({
        success: false,
        error: 'Dataset not found'
      })
      return
    }

    res.json({
      success: true,
      data: dataset
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dataset'
    })
  }
})

/**
 * GET /api/datasets/stats
 * Get dataset statistics
 */
router.get('/stats/summary', async (_req: Request, res: Response) => {
  try {
    const stats = await datasetService.getDatasetStats()
    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dataset statistics'
    })
  }
})

export default router
