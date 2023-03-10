const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
//middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jfl1bty.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const channelsCollection = client.db("discord").collection("channels");
    const messageCollection = client.db("discord").collection("messages");

    app.post("/channels", async (req, res) => {
      const channel = req.body;
      const result = await channelsCollection.insertOne(channel);
      res.send(result);
    });

    app.get("/channels", async (req, res) => {
      const query = {};
      const result = await channelsCollection.find(query).toArray();
      res.send(result);
    });

    //create a messages using this api
    app.post("/message", async (req, res) => {
      const message = req.body;
      const result = await messageCollection.insertOne(message);
      res.send(result);
    });

    app.get("/messages/:id", async (req, res) => {
      // const { channelId, channelName } = req.query;
      const id = req.params.id;
      const query = { channelId: id };
      const result = await messageCollection
        .find(query)
        .sort({ _id: 1 })
        .toArray();
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("discord server in runing");
});

app.listen(port, () => {
  console.log(`discord server running on port ${port}`);
});
