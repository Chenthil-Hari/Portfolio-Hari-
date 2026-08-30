import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI as string
const dbName = process.env.MONGODB_DB || 'portfolio'

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside Vercel or local config')
}

// Global cached connection
let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  // If the database connection is already established, reuse it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  // Set the connection options
  const client = new MongoClient(uri)

  // Connect the client
  await client.connect()
  const db = client.db(dbName)

  // Cache client and db
  cachedClient = client
  cachedDb = db

  return { client, db }
}
