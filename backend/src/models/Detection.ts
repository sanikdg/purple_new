import mongoose, { Schema, Document } from 'mongoose'

export interface IBoundingBox {
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface IDetectionObject {
  class: string
  confidence: number
  bbox: IBoundingBox
}

export interface IDetection extends Document {
  cameraId: string
  frameNumber: number
  timestamp: Date
  className: string
  confidence: number
  boundingBox: IBoundingBox
  createdAt: Date
  updatedAt: Date
}

const BoundingBoxSchema = new Schema({
  x1: { type: Number, required: true },
  y1: { type: Number, required: true },
  x2: { type: Number, required: true },
  y2: { type: Number, required: true }
})

const DetectionSchema = new Schema<IDetection>(
  {
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
    className: {
      type: String,
      required: true,
      default: 'person'
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    },
    boundingBox: {
      type: BoundingBoxSchema,
      required: true
    }
  },
  {
    timestamps: true
  }
)

// Compound index for efficient queries
DetectionSchema.index({ cameraId: 1, timestamp: 1 })
DetectionSchema.index({ cameraId: 1, frameNumber: 1 })

export default mongoose.model<IDetection>('Detection', DetectionSchema)
