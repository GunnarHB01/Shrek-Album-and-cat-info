import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 4000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/shrek-image', async (req, res) => {
  try {
    const response = await fetch('https://shreks.corneroftheinter.net/?img=url');
    const imageUrl = await response.text();
    if (!imageUrl) {
      throw new Error("Failed to retrieve image URL.");
    }
    res.json({ url: imageUrl });
  } catch (error) {
    console.error("Error fetching Shrek image:", error);
    res.status(500).json({ error: "Failed to fetch Shrek image" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://127.0.0.1:${PORT}`);
});
