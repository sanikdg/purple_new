import mongoose, { Schema, Document } from 'mongoose'

export interface IDataset extends Document {
  datasetId: string
  cameraId: string
  fileName: string
  filePath: string
  status: 'pending' | 'registered' | 'processing' | 'completed' | 'failed'
  duration: number
  fps: number
  resolution: string
  fileSize: number
  createdAt: Date
  updatedAt: Date
}

const DatasetSchema = new Schema<IDataset>(
  {
    datasetId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    cameraId: {
      type: String,
      required: true,
      index: true
    },
    fileName: {
      type: String,
      required: true
    },
    filePath: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'registered', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    duration: {
      type: Number,
      default: 0
    },
    fps: {
      type: Number,
      default: 30
    },
    resolution: {
      type: String,
      default: '1920x1080'
    },
    fileSize: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model<IDataset>('Dataset', DatasetSchema)
