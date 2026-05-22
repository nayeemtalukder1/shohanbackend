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

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error(error);
  }
}

connectDB();

app.get('/', (req, res) => {
  res.send('Server Running');
});

app.get('/test-db', async (req, res) => {
  try {
    await client.db("admin").command({ ping: 1 });

    res.send("✅ MongoDB Connected Successfully!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = app;