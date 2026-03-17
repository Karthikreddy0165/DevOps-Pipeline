import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  throw new Error('Missing env var: MONGODB_URI')
}
const MONGODB_URI_STR: string = MONGODB_URI

type Cached = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: Cached | undefined
}

const cached: Cached = global._mongoose ?? { conn: null, promise: null }
global._mongoose = cached

export async function connectToMongoDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    const dbName = process.env.MONGODB_DB_NAME
    cached.promise = mongoose.connect(MONGODB_URI_STR, {
      ...(dbName ? { dbName } : {}),
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}

