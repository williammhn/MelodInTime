import { useEffect, useState } from 'react';
import axios from 'axios';

function NYT() {
  const [articles, setArticles] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:4000/nyt-articles'); // Utilise le proxy local
        console.log('API Response:', response.data);

        if (response.data.response && response.data.response.docs) {
          setArticles(response.data.response.docs);
        } else {
          setArticles([]);
        }
      } catch (error) {
        console.error('Erreur lors de la requête API:', error);
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <p>Chargement en cours...</p>;
  }

  return (
    <div>
      <h1>Articles du New York Times</h1>
      {articles && articles.length > 0 ? (
        <ul>
          {articles.map((article, index) => (
            <li key={index}>
              <h3>{article.headline.main}</h3>
              <p>{article.snippet}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun article trouvé.</p>
      )}
    </div>
  );
}

export default NYT;
