// Add Express
const express = require("express");

// Initialize Express
const app = express();

// Create GET request
app.get("/", (_, res) => {
  res.send("Express on Vercel");
});

app.get("/api", (_, res) => {
  res.json({ sample: {json:{}}});
});

app.post("/api", (_, res) => {
  res.json({ sample: {json:{}}});
});

// Initialize server
app.listen(5000, () => {
  console.log("Running on port 5000.");
});

module.exports = app;