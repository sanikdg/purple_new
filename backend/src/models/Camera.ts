import mongoose, { Schema, Document } from 'mongoose'

export interface ICamera extends Document {
  cameraId: string
  cameraName: string
  cameraLocation: string
  status: 'active' | 'inactive' | 'offline'
  streamType: 'rtsp' | 'http' | 'file' | 'mock'
  streamUrl?: string
  createdAt: Date
  updatedAt: Date
}

const CameraSchema = new Schema<ICamera>(
  {
    cameraId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    cameraName: {
      type: String,
      required: true
    },
    cameraLocation: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'offline'],
      default: 'active'
    },
    streamType: {
      type: String,
      enum: ['rtsp', 'http', 'file', 'mock'],
      default: 'file'
    },
    streamUrl: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model<ICamera>('Camera', CameraSchema)
