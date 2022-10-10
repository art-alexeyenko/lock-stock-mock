const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Use POST to /api for tests");
});

app.post("/api", (req, res) => {
  res.send('Wow, what a response!');
})

app.listen(5000, () => {
  console.log("Running on port 5000.");
});

module.exports = app;