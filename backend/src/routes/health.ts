import { Router, Request, Response } from 'express'
import mongoose from 'mongoose'
import axios from 'axios'

const router = Router()

interface HealthResponse {
  status: string
  timestamp: string
  services?: {
    backend: {
      status: string
      timestamp: string
    }
    database: {
      status: string
      timestamp: string
    }
    aiService?: {
      status: string
      timestamp: string
    }
  }
}

// Basic health check
router.get('/', (_req: Request, res: Response) => {
  const response: HealthResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString()
  }
  res.json(response)
})

// Detailed health check
router.get('/detailed', async (_req: Request, res: Response) => {
  const timestamp = new Date().toISOString()
  const response: HealthResponse = {
    status: 'healthy',
    timestamp,
    services: {
      backend: {
        status: 'healthy',
        timestamp
      },
      database: {
        status: mongoose.connection.readyState === 1 ? 'healthy' : 'unhealthy',
        timestamp
      }
    }
  }

  // Check AI service
  try {
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000'
    await axios.get(`${aiServiceUrl}/health`, { timeout: 5000 })
    response.services!.aiService = {
      status: 'healthy',
      timestamp
    }
  } catch (error) {
    response.services!.aiService = {
      status: 'unhealthy',
      timestamp
    }
    response.status = 'degraded'
  }

  res.json(response)
})

export default router
