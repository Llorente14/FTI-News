// server.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/api/news', async (req, res) => {
  const response = await fetch('https://berita-indo-api-next.vercel.app/api/cnn-news/teknologi');
  const data = await response.json();
  res.json(data);
});

app.listen(3000, () => console.log('Proxy running at http://localhost:3000'));
