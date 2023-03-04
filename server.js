const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGO_DB_URL;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
mongoose.connect(uri).then(() => {
  console.log("mongoose is working");
});
const app = express();
const users = [];

// MongoClient.connect(uri)
//   .then((client) => {
//     console.log("DB connect");
//   })
//   .then(
//     app.listen(8080, () => {
//       console.log("lisen at 8080");
//     })
//   );

// app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  return res.send("sever is ok");
});

app.post("/signup", (req, res) => {
  const { email, username, password } = req.body;
  const hashPassword = bcrypt.hash(password, 5);
  MongoClient.connect(
    uri,
    { useUnifiedTopology: true },
    function (에러, client) {
      if (에러) return console.log(에러);
      db = client.db("mintonofall");
      db.collection("users").insertOne(
        { email: email, username: username, password: hashPassword },
        function (에러, 결과) {
          console.log("저장완료");
          console.log(username);
          console.log(hashPassword);
        }
      );
    }
  );
  return res.send("data ok");
});

app.post("/gamedatasend", (req, res) => {
  const data = req.body;
  console.log("data recive start");
  console.log(data);
  MongoClient.connect(
    uri,
    { useUnifiedTopology: true },
    function (에러, client) {
      if (에러) return console.log(에러);
      db = client.db("mintonofall");
      db.collection("gameResult").insertMany(data, function (에러, 결과) {
        console.log(data);
      });
    }
  );
  return res.send("recive OK!");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Check if the email exists in the users array
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({
      message: "Login failed",
    });
  }

  // Compare the password with the hashed password stored in the users array
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      return res.status(401).json({
        message: "Login failed",
      });
    }
    if (result) {
      // Generate a JWT token
      const token = jwt.sign({ email }, "secret_key", { expiresIn: "1h" });
      return res.status(200).json({
        message: "Login successful",
        token,
      });
    }
    return res.status(401).json({
      message: "Login failed",
    });
  });
});
