require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT;
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri =process.env.MONGO_URI;
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// let database, portfoliosCollection;
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();


//     database = client.db("shohanur");
//     portfoliosCollection = database.collection("portfolio");

//     app.get('/portfolio', async (req, res) => {
//       const cursor = portfoliosCollection.find({});
//       const result = await cursor.toArray();
//       res.json(result);
//     })
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);

let database, portfoliosCollection, statsData;

// connect once
async function connectDB() {
  if (!database) {
    await client.connect();

    database = client.db("shohanur");
    portfoliosCollection = database.collection("portfolio");
    statsData = database.collection("statsData");


    console.log("✅ MongoDB Connected");
  }
}



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/portfolio', async (req, res) => {
  try {
    await connectDB();

    const result = await portfoliosCollection.find({}).toArray();
    res.json(result);

  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.get("/stats", async (req, res) => {
  try {
    await connectDB();

    statsData = await statsData.find({}).toArray();
    res.json(statsData);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

module.exports = app;