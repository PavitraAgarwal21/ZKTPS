require("dotenv").config();
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const multer = require("multer");
const apiUrl = process.env.URL;
const CONNECTION_STRING = apiUrl;
const dbName = "AllowResaleInfo";
const collectionName = "allows";
let collection;
const app = express();
app.use(cors());

app.listen(5038, async () => {
  const uri = apiUrl;
  const client = new MongoClient(uri);
  await client.connect();
  const database = client.db(dbName);
  collection = database.collection(collectionName);
  console.log(`Server running on port 5038`);
});

app.get("/get", async (request, response) => {
  const cursor = await collection.find({});
  const results = await cursor.toArray();
  response.send(results);
});

// app post or add the nullifier and commitment hash
app.post("/", multer().none(), async (request, response) => {
  let nullifier = request.body.nullifier;
  let commitment = request.body.commitment;
  const allowTicket = {
    old_nullifier: `${nullifier}`,
    old_commitment: `${commitment}`,
  };
  try {
    const insertManyResult = await collection.insertOne(allowTicket);
    console.log(`documents successfully inserted.\n`);
  } catch (err) {
    console.error(
      `Something went wrong trying to insert the new documents: ${err}\n`
    );
  }
});

// delete the nullifier and commitment hash
app.delete("/", multer().none(), async (request, response) => {
  // console.log(`delete query information ${request.body}`) ;
  let nullifier = request.body.nullifier;
  let commitment = request.body.commitment;

  const deleteQuery = {
    old_nullifier: `${nullifier}`,
    old_commitment: `${commitment}`,
  };
  try {
    const deleteResult = await collection.deleteOne(deleteQuery);
    console.log(`Deleted ${deleteResult.deletedCount} documents\n`);
  } catch (err) {
    console.error(`Something went wrong trying to delete documents: ${err}\n`);
  }
});
