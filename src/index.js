const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();

const users = [];

app.use(express.json());

app.post("/signup", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // Hash the password using bcrypt
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    } else {
      // Store the hashed password and email in the users array
      const user = { email, password: hash };
      users.push(user);
      res.status(200).json({
        message: "Sign up successful",
      });
    }
  });
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

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
