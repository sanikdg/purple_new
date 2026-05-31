import mongoose, { Schema, Document } from 'mongoose'

export interface IBoundingBox {
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface ITrack extends Document {
  trackId: string
  cameraId: string
  frameNumber: number
  timestamp: Date
  boundingBox: IBoundingBox
  confidence: number
  createdAt: Date
  updatedAt: Date
}

const BoundingBoxSchema = new Schema({
  x1: { type: Number, required: true },
  y1: { type: Number, required: true },
  x2: { type: Number, required: true },
  y2: { type: Number, required: true }
})

const TrackSchema = new Schema<ITrack>(
  {
    trackId: {
      type: String,
      required: true,
      index: true
    },
    cameraId: {
      type: String,
      required: true,
      index: true
    },
    frameNumber: {
      type: Number,
      required: true,
      index: true
    },
    timestamp: {
      type: Date,
      required: true,
      index: true
    },
    boundingBox: {
      type: BoundingBoxSchema,
      required: true
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    }
  },
  {
    timestamps: true
  }
)

// Compound indexes for efficient queries
TrackSchema.index({ trackId: 1, timestamp: 1 })
TrackSchema.index({ cameraId: 1, timestamp: 1 })
TrackSchema.index({ cameraId: 1, frameNumber: 1 })

export default mongoose.model<ITrack>('Track', TrackSchema)
