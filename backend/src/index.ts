import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import dotenv from 'dotenv'
import { connectDatabase } from './config/database.js'
import { errorHandler } from './middleware/errorHandler.js'
import healthRoutes from './routes/health.js'
import datasetRoutes from './routes/dataset.js'
import cameraRoutes from './routes/camera.js'
import layoutRoutes from './routes/layout.js'
import detectionRoutes from './routes/detection.js'
import trackingRoutes from './routes/tracking.js'
import layoutService from './services/layout.service.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
})

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/health', healthRoutes)
app.use('/api/datasets', datasetRoutes)
app.use('/api/cameras', cameraRoutes)
app.use('/api/store-layout', layoutRoutes)
app.use('/api/detection', detectionRoutes)
app.use('/api/tracking', trackingRoutes)

// Socket.IO connection
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`)
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`)
  })
})

// Error handling
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 3000

const startServer = async () => {
  try {
    await connectDatabase()
    
    // Initialize store layout
    await layoutService.initializeLayout()
    console.log('Store layout initialized')
    
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

export { app, io }
