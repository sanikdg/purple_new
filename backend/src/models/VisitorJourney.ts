import mongoose, { Schema, Document } from 'mongoose'

export interface IVisitorJourney extends Document {
  visitorId: string
  cameraId: string
  visitedZones: string[]
  totalDwellTime: number
  entryTime: Date
  exitTime?: Date
  zoneSequence: Array<{
    zoneId: string
    entryTime: Date
    exitTime?: Date
    dwellTime: number
  }>
  createdAt: Date
  updatedAt: Date
}

const ZoneVisitSchema = new Schema({
  zoneId: { type: String, required: true },
  entryTime: { type: Date, required: true },
  exitTime: { type: Date },
  dwellTime: { type: Number, required: true }
})

const VisitorJourneySchema = new Schema<IVisitorJourney>(
  {
    visitorId: {
      type: String,
      required: true,
      index: true
    },
    cameraId: {
      type: String,
      required: true,
      index: true
    },
    visitedZones: {
      type: [String],
      default: []
    },
    totalDwellTime: {
      type: Number,
      default: 0
    },
    entryTime: {
      type: Date,
      required: true,
      index: true
    },
    exitTime: {
      type: Date,
      index: true
    },
    zoneSequence: {
      type: [ZoneVisitSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
)

// Compound indexes for efficient queries
VisitorJourneySchema.index({ visitorId: 1, entryTime: 1 })
VisitorJourneySchema.index({ cameraId: 1, entryTime: 1 })

export default mongoose.model<IVisitorJourney>('VisitorJourney', VisitorJourneySchema)
