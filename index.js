require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(express.json());
app.use(cors());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bidfx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const database = client.db('movieDB');
    const dataCollection = database.collection('movies');

    // movie post
    app.post('/addmovie', async(req,res)=>{
        const movie = req.body;
        console.log(movie);
        const result = await dataCollection.insertOne(movie);
        res.send(result);
    });

    // get feater data
    app.get('/feature', async(req,res)=>{
        const feature = dataCollection.find({ rating: 10 }).limit(6);
        const result = await feature.toArray();
        res.send(result);
    })

    // get all movies
    app.get('/allmovies', async(req,res)=>{
        const allMovie = dataCollection.find();
        const result = await allMovie.toArray();
        res.send(result);
    })

  } catch {
    // await client.close();
    console.log(error);
  }
}
run();


app.get('/', (req, res) => {
    res.send('Welcome to assignment ten server');
})

app.listen(port,(req,res)=>{
    console.log(`app is running on PORT : ${port}`);
})