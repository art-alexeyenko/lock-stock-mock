// Add Express
const express = require("express");

// Initialize Express
const app = express();

// Create GET request
app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

app.get("/api/graphql/v1", (req, res) => {
    res.json({ site: { siteInfo: { redirects: {} }}});
});

const redirectDetails = [];

const sampleReply = {
  site: {
    siteInfo: {
      redirects: {
        redirectDetails
      }
    }
  }
}

app.post("/api/graphql/v1", (req, res) => {
  res.json(sampleReply);
})

// Initialize server
app.listen(5000, () => {
  console.log("Running on port 5000.");
});

module.exports = app;