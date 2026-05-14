import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/tiendaosvaldo'

// Singleton para Next.js: sobrevive hot reloads en desarrollo
declare global {
  var _mongoConn: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined
}

if (!global._mongoConn) {
  global._mongoConn = { conn: null, promise: null }
}

export async function dbConnect(): Promise<typeof mongoose> {
  if (global._mongoConn!.conn) return global._mongoConn!.conn

  if (!global._mongoConn!.promise) {
    global._mongoConn!.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    })
  }

  global._mongoConn!.conn = await global._mongoConn!.promise
  return global._mongoConn!.conn
}
