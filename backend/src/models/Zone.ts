import mongoose, { Schema, Document } from 'mongoose'

export interface ICoordinates {
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface IZone extends Document {
  zoneId: string
  zoneName: string
  zoneType: 'entrance' | 'counter' | 'fragrance' | 'makeup' | 'brand'
  coordinates: ICoordinates
  description: string
  brandName?: string
  createdAt: Date
  updatedAt: Date
}

const CoordinatesSchema = new Schema({
  x1: { type: Number, required: true },
  y1: { type: Number, required: true },
  x2: { type: Number, required: true },
  y2: { type: Number, required: true }
})

const ZoneSchema = new Schema<IZone>(
  {
    zoneId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    zoneName: {
      type: String,
      required: true
    },
    zoneType: {
      type: String,
      enum: ['entrance', 'counter', 'fragrance', 'makeup', 'brand'],
      required: true
    },
    coordinates: {
      type: CoordinatesSchema,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    brandName: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model<IZone>('Zone', ZoneSchema)
