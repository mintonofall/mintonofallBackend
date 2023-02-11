const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://treebird1982:ZnPh7eLOMEWgpnvm@cluster0.vqq8hhk.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect((err) => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
  console.log("MongoDN Connect");
});

MongoClient.connect(uri)
  .then((client) => {
    console.log("DB connect");
    console.log(client);
  })
  .then(
    app.listen(4002, () => {
      console.log("lisen at 4002");
    })
  );

console.log("execute this");
