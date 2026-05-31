import mongoose, { Schema, Document } from 'mongoose'

export interface IVisitor extends Document {
  visitorId: string
  trackId: string
  cameraId: string
  firstSeen: Date
  lastSeen: Date
  status: 'active' | 'ended'
  frameCount: number
  detectionCount: number
  createdAt: Date
  updatedAt: Date
}

const VisitorSchema = new Schema<IVisitor>(
  {
    visitorId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
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
    firstSeen: {
      type: Date,
      required: true,
      index: true
    },
    lastSeen: {
      type: Date,
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['active', 'ended'],
      default: 'active',
      index: true
    },
    frameCount: {
      type: Number,
      default: 0
    },
    detectionCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

// Compound indexes for efficient queries
VisitorSchema.index({ cameraId: 1, firstSeen: 1 })
VisitorSchema.index({ cameraId: 1, status: 1 })
VisitorSchema.index({ firstSeen: 1, lastSeen: 1 })

export default mongoose.model<IVisitor>('Visitor', VisitorSchema)
