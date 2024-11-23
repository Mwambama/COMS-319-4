
// Author: Alislaa Mwamba
// ISU-Id: mwambama@iastate.edu
// Date: 11/11/2024 


var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();
app.use(cors());
app.use(bodyParser.json());
const port = "8081";
const host = "localhost";

// MongoDB connection
const { MongoClient } = require("mongodb");
const url = "mongodb://127.0.0.1:27017";
const dbName = "secoms3190";
const client = new MongoClient(url);
const db = client.db(dbName);

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
connectToDatabase();

// Get method to get the data from the database
app.get("/robot", async (req, res) => {
  try {

    await client.connect();
    console.log("Node connected successfully to GET MongoDB");
    const query = {};
    const results = await db.collection("robot").find(query).limit(100).toArray();console.log(results);

    res.status(200);
    res.send(results);



   // const db = client.db(dbName);
   // const collection = db.collection("robot");
    //const results = await collection.find({}).limit(100).toArray();console.log(results);
   // res.status(200).json(results);
  } 
  
  catch (error) {
    console.error("Error fetching robots:", error);
    res.status(500).send({ error: "An internal server error occurred" });
  }
});

app.post("/robot", async (req, res) => {
  try {
    const db = client.db(dbName);
    const newDocument = {
      id: req.body.id,
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
    };

    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).send({ error: "Bad request: No data provided." });
    }

      // Assuming 'id' should be unique
         const existingDoc = await db
               .collection("robot").findOne({ id: newDocument.id });
               if (existingDoc) {
                    return res
                  .status(409)
                     .send({ error: "Conflict: A robot with this ID already exists." });
}

    const results = await db.collection("robot").insertOne(newDocument);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error adding robot:", error);
    res.status(500).send({ error: "An internal server error occurred" });
  }
});

app.get("/robot/:id", async (req, res) => {
  try {
    const db = client.db(dbName);
    const id = Number(req.params.id);
    const query = { id: id };
    const results = await db.collection("robot").findOne(query);

    if (!results) {
      res.status(404).send("Not Found");
    } else {
      res.status(200).json(results);
    }
  } catch (error) {
    console.error("Error fetching robot by ID:", error);
    res.status(500).send({ error: "An internal server error occurred" });
  }
});

// Delete a robot by ID
app.delete("/robot/:id", async (req, res) => {
  try {
    const db = client.db(dbName);
    const id = Number(req.params.id);
    const query = { id: id };

    const results = await db.collection("robot").deleteOne(query);
    
    res.status(200).json(results);
  } catch (error) {
    console.error("Error deleting robot:", error);
    res.status(500).send({ error: "An internal server error occurred" });
  }
});

app.put("/robot/:id", async (req, res) => {
  try {
    const db = client.db(dbName);
    const id = Number(req.params.id);
    const query = { id: id };
    const updateData = {
      $set: {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
      },
    };
    const results = await db.collection("robot").updateOne(query, updateData);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error updating robot:", error);
    res.status(500).send({ error: "An internal server error occurred" });
  }
});

app.listen(port, () => {
  console.log("App listening at http://%s:%s", host, port);
});
