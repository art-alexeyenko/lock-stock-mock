// Add Express
const express = require("express");

// Initialize Express
const app = express();
app.use((req, res, next) => {
  setTimeout(() => next(), 2000);
});

// Create GET request
app.get("/", (_, res) => {
  res.send("Express on Vercel");
});

app.get("/api", (_, res) => {
  setInterval(function () {
    res.json({ site: { siteInfo: { redirects: {} }}})
  }, 2000);
});

const redirects = [];

const sampleReply = {
  data: {
    site: {
      siteInfo: {
        redirects
      }
    }
  }
}

app.post("/api", (_, res) => {
  res.json(sampleReply);
});

// Initialize server
app.listen(5000, () => {
  console.log("Running on port 5000.");
});

module.exports = app;