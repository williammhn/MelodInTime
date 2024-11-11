import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 4000;

app.use(cors());

app.get('/nyt-articles', async (req, res) => {
  const apiNYTkey = process.env.API_NYT_KEY; // Utiliser la clé API depuis les variables d'environnement
  const url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
  
  // Les paramètres pour la requête
  const params = {
    facet: 'false',
    facet_filter: 'false',
    q: 'Pokemon',
    sort: 'oldest',
    'api-key': apiNYTkey
  };

  try {
    // Faire la requête avec axios en passant l'URL et les paramètres
    const response = await axios.get(url, { params });
    res.send(response.data); // Envoyer les données JSON au frontend
  } catch (error) {
    console.error('Erreur lors de la requête API :', error);
    res.status(500).send('Erreur lors de la requête API');
  }
});

app.listen(port, () => {
  console.log(`Serveur proxy en écoute sur http://localhost:${port}`);
});
