const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
let cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

app.use(cors());
app.use(express.json());

// Replace the uri string with your MongoDB deployment's connection string.
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.erhb9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("gnResturent");
    const foodsCollection = database.collection("foods");
    const offersCollection = database.collection("offers");
    const bookedCollection = database.collection("booked");

    app.get("/foods", async (req, res) => {
      const cursor = foodsCollection.find({});
      const food = await cursor.toArray();
      res.send(food);
    });

    // find with category
    app.get("/foods/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const fo = foodsCollection.find({
        "cetagory._id": ObjectId(id),
      });
      const food = await fo.toArray();

      res.send(food);
    });

    // get offers

    app.get("/offers", async (req, res) => {
      const cursor = offersCollection.find({});
      const offer = await cursor.toArray();
      res.send(offer);
    });

    // post booked data

    app.post("/booked", async (req, res) => {
      const booked = req.body;
      const result = await bookedCollection.insertOne(booked);
      res.send(result);
    });
    // get booked data
    app.get("/booked", async (req, res) => {
      const cursor = bookedCollection.find({});
      const book = await cursor.toArray();
      res.send(book);
    });

    // search booked data using user email

    app.get("/usingEmail", async (req, res) => {
      const email = req.query.email;

      const cursor = bookedCollection.find({
        email: email,
      });
      const result = await cursor.toArray();
      res.send(result);
    });
    // find data using id
    app.get("/booked/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookedCollection.findOne(query);
      res.send(result);
    });
    // delete booked table
    app.delete("/booked/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookedCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
