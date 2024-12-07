require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

    // await client.connect();
    // await client.db("admin").command({ ping: 1 });
    // console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const database = client.db('movieDB');
    const dataCollection = database.collection('movies');
    const favCollection = database.collection('favouriteMovie');

    // movie post
    app.post('/addmovie', async (req, res) => {
      const movie = req.body;
      const result = await dataCollection.insertOne(movie);
      res.send(result);
    });

    // get feature data
    app.get('/feature', async (req, res) => {
      const feature = dataCollection.find().sort({ rating: -1 }).limit(6);
      const result = await feature.toArray();
      res.send(result);
    })

    // get all movies
    app.get('/allmovies', async (req, res) => {
      const allMovie = dataCollection.find();
      const result = await allMovie.toArray();
      res.send(result);
    })

    // get movie by id
    app.get('/details/:id', async (req, res) => {
      const id = req.params.id;
      const selected = { _id: new ObjectId(id) };
      const result = await dataCollection.findOne(selected);
      res.send(result);
    })

    // update movie 
    app.put('/upsert/:id', async (req, res) => {
      const id = req.params.id;
      const update = req.body;
      console.log(update);
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      
      const updateDoc = {
        $set: {
          poster: update.poster,
          title: update.title,
          selectOption: update.selectOption,
          duration: update.duration,
          year: update.year,
          rating: update.rating,
          summary: update.summary
        },
      };
      console.log(updateDoc);
      const result = await dataCollection.updateOne(filter, option, updateDoc);
      res.send(result);
    })

    // delete movie
    app.delete('/movie/delete/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await dataCollection.deleteOne(filter);
      res.send(result);
    })

    // create favourite
    app.post('/favourite', async (req, res) => {
      const favourite = req.body;
      const result = await favCollection.insertOne(favourite);
      res.send(result);
    })

    // get favourite
    app.get('/favourite/:email', async (req, res) => {
      const email = req.params.email;
      const filter = { email };
      const allFav = favCollection.find(filter);
      const result = await allFav.toArray();
      res.send(result);
    })

    // delete favourite
    app.delete('/favourite/delete/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await favCollection.deleteOne(filter);
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

app.listen(port, (req, res) => {
  console.log(`app is running on PORT : ${port}`);
})