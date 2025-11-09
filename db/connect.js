const { MongoClient } = require('mongodb');

let db;

async function initDb() {
  try {
    const client = new MongoClient(process.env.MONGO_DB_URI);
    
    await client.connect();
    db = client.db('Project_2');
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.');
  }
  return db;
}

module.exports = { initDb, getDb };
