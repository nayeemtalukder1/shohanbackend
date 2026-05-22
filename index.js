require('dotenv').config();
const express = require('express');
const app = express();

const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(express.json());

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// cache connection
let db;
let portfolioCollection;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("shohanur");
    portfolioCollection = db.collection("portfolio");

    console.log("✅ MongoDB connected");
  }
}

app.get('/', (req, res) => {
  res.send('Server Running');
});

app.get('/portfolio', async (req, res) => {
  try {
    await connectDB();

    const result = await portfolioCollection.find({}).toArray();
    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).send("DB Error: " + err.message);
  }
});

module.exports = app;