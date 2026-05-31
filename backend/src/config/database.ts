import mongoose from 'mongoose'

export const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/store-intelligence'
    
    await mongoose.connect(mongoUri, {
      retryWrites: true,
      w: 'majority'
    })
    
    console.log('Database connected successfully')
  } catch (error) {
    console.error('Database connection failed:', error)
    throw error
  }
}

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect()
    console.log('Database disconnected')
  } catch (error) {
    console.error('Database disconnection failed:', error)
    throw error
  }
}
