import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 4000;

app.use(cors());

// Spotify API credentials
const client_id = process.env.CLIENT_ID; // Spotify Client ID
const client_secret = process.env.CLIENT_SECRET; // Spotify Client Secret
const redirect_uri = 'http://localhost:4000/spotify-callback'; // Redirect URI set in Spotify dashboard

// Route for redirecting the user to Spotify for authorization
app.get('/spotify-login', (req, res) => {
  const scope = 'user-read-private user-read-email streaming user-read-playback-state';
  const authURL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirect_uri)}`;
  res.redirect(authURL);
});

// Route to handle Spotify callback and exchange code for access token
app.get('/spotify-callback', async (req, res) => {
  const code = req.query.code || null;

  try {
    // Exchange authorization code for an access token
    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri,
        client_id: client_id,
        client_secret: client_secret,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const accessToken = response.data.access_token;
    const refreshToken = response.data.refresh_token;

    // Send tokens as JSON or store them for user session
    res.redirect(`http://localhost:5173/?access_token=${accessToken}`);
  } catch (error) {
    console.error('Error during Spotify token exchange:', error);
    res.status(500).json({ error: 'Failed to exchange token with Spotify' });
  }
});

// New York Times API route (remains the same)
app.get('/nyt-most-complete-article', async (req, res) => {
  const apiNYTkey = process.env.API_NYT_KEY;
  const date = req.query.date;

  if (!date) {
    return res.status(400).send('Please provide a date in YYYYMMDD format.');
  }

  const url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
  const params = {
    'begin_date': date,
    'end_date': date,
    'api-key': apiNYTkey
  };

  try {
    const response = await axios.get(url, { params });
    const articles = response.data.response.docs;

    if (articles.length === 0) {
      return res.send({ message: 'No article found for this date.' });
    }

    const mostCompleteArticle = articles.reduce((max, article) =>
      article.word_count > (max.word_count || 0) ? article : max, {});

    res.send(mostCompleteArticle);
  } catch (error) {
    console.error('Error during API request:', error);
    res.status(500).send('Error during API request');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
