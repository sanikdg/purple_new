import mongoose, { Schema, Document } from 'mongoose'

export interface IEvent extends Document {
  eventId: string
  visitorId: string
  trackId: string
  cameraId: string
  zoneId?: string
  eventType: 'ZONE_ENTER' | 'ZONE_EXIT' | 'DWELL_TIME_UPDATE' | 'VISITOR_SESSION_START' | 'VISITOR_SESSION_END' | 'ZONE_TRANSITION'
  timestamp: Date
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

const EventSchema = new Schema<IEvent>(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    visitorId: {
      type: String,
      required: true,
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
    zoneId: {
      type: String,
      index: true
    },
    eventType: {
      type: String,
      enum: [
        'ZONE_ENTER',
        'ZONE_EXIT',
        'DWELL_TIME_UPDATE',
        'VISITOR_SESSION_START',
        'VISITOR_SESSION_END',
        'ZONE_TRANSITION'
      ],
      required: true,
      index: true
    },
    timestamp: {
      type: Date,
      required: true,
      index: true
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
)

// Compound indexes for efficient queries
EventSchema.index({ visitorId: 1, timestamp: 1 })
EventSchema.index({ cameraId: 1, timestamp: 1 })
EventSchema.index({ eventType: 1, timestamp: 1 })
EventSchema.index({ zoneId: 1, timestamp: 1 })

export default mongoose.model<IEvent>('Event', EventSchema)
