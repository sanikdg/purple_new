import mongoose, { Schema, Document } from 'mongoose'

export interface IMetricSnapshot extends Document {
  metricType: 'footfall' | 'zone' | 'journey' | 'operational' | 'summary'
  value: number | Record<string, any>
  timestamp: Date
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

const MetricSnapshotSchema = new Schema<IMetricSnapshot>(
  {
    metricType: {
      type: String,
      enum: ['footfall', 'zone', 'journey', 'operational', 'summary'],
      required: true,
      index: true
    },
    value: {
      type: Schema.Types.Mixed,
      required: true
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
MetricSnapshotSchema.index({ metricType: 1, timestamp: 1 })

export default mongoose.model<IMetricSnapshot>('MetricSnapshot', MetricSnapshotSchema)
