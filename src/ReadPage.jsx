import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Button, Spinner } from 'react-bootstrap';

function ReadPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const article = location.state?.article;
  const [album, setAlbum] = useState(null);
  const [releaseDate, setReleaseDate] = useState(null);
  const [isSearching, setIsSearching] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setErrorMessage('Connect to Spotify to get the music. You should log in on the home page.');
      setIsSearching(false);
      return;
    }
    setAccessToken(token);

    if (!article) {
      setErrorMessage('Invalid article data. Please go back and select a new date.');
      setIsSearching(false);
      return;
    }

    const publicationDate = article.pub_date ? article.pub_date.slice(0, 10) : null;
    const publicationYear = article.pub_date ? article.pub_date.slice(0, 4) : null;
    const publicationMonth = article.pub_date ? article.pub_date.slice(5, 7) : null;

    if (!publicationYear) {
      setErrorMessage('Invalid publication date.');
      setIsSearching(false);
      return;
    }

    const fetchAlbum = async () => {
      try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            q: `year:${publicationYear}`,
            type: 'album',
            limit: 10,
          },
        });

        const albums = response.data.albums.items;
        let foundAlbum = false;

        for (let albumData of albums) {
          const albumId = albumData.id;
          const albumResponse = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const albumReleaseDate = albumResponse.data.release_date;
          const albumYear = albumReleaseDate.slice(0, 4);
          const albumMonth = albumReleaseDate.slice(5, 7);

          if (albumYear === publicationYear && albumMonth === publicationMonth) {
            setAlbum(albumData);
            setReleaseDate(albumResponse.data.release_date);
            setIsSearching(false);
            foundAlbum = true;
            return;
          }
        }

        if (!foundAlbum) {
          for (let albumData of albums) {
            const albumId = albumData.id;
            const albumResponse = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            const albumReleaseDate = albumResponse.data.release_date;
            const albumYear = albumReleaseDate.slice(0, 4);

            if (albumYear === publicationYear) {
              setAlbum(albumData);
              setReleaseDate(albumResponse.data.release_date);
              setIsSearching(false);
              return;
            }
          }
        }

        setErrorMessage('No album found for the selected period.');
        setIsSearching(false);
      } catch (error) {
        console.error('Error while searching for albums:', error);
        setErrorMessage('An error occurred while searching for albums.');
        setIsSearching(false);
      }
    };

    fetchAlbum();
  }, [article]);

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  if (!article) {
    return (
      <div className="text-center">
        <p>No article selected. Go back to the search page.</p>
        <Button className="custom-button" onClick={() => navigate('/')}>
          Back to Search
        </Button>
      </div>
    );
  }

  return (
    <div className="read-page-container">
      <h1 className="read-page-title">Melod'in Time</h1>

      <Row>
        {/* Left Column - Article Information */}
        <Col md={6} className="article-info">
          <h2>{article.headline?.main || 'Title not available'}</h2>
          <p>
            <strong>Publication Date:</strong>{' '}
            {article.pub_date ? article.pub_date.slice(0, 10) : 'Date not available'}
          </p>
          <p>{article.lead_paragraph || 'Main paragraph not available'}</p>
          <a href={article.web_url} target="_blank" rel="noopener noreferrer">
            Read the full article
          </a>
        </Col>

        {/* Right Column - Music Information */}
        <Col md={6} className="music-info">
          {isSearching ? (
            <div className="text-center">
              <Spinner animation="border" role="status" />
              <p>Searching for music related to this period...</p>
            </div>
          ) : errorMessage ? (
            <p className="error-container">{errorMessage}</p>
          ) : album ? (
            <div>
              <h2>Album of the Period: {album.name}</h2>
              <p>
                <strong>By:</strong> {album.artists.map((artist) => artist.name).join(', ')}
              </p>
              {releaseDate && (
                <p>
                  <strong>Release Date:</strong> {releaseDate}
                </p>
              )}
              <iframe
                src={`https://open.spotify.com/embed/album/${album.id}`}
                className="spotify-embed"
                title="Spotify Album Player"
              ></iframe>
              <Button
                className="custom-button" id='other-button'
                onClick={() => navigate('/other-music', { state: { album, releaseDate, accessToken } })}
              >
                Other Tracks
              </Button>
            </div>
          ) : null}
        </Col>
      </Row>

      <div className="question-icon" id="question-read" onClick={toggleInstructions}>
        <i className="fa-solid fa-question"></i>
      </div>

      {showInstructions && (
        <div className="instructions-card" id="instructions-read">
          <div className="card">
            <h2>Instructions</h2>
            <p>To enjoy your experience you should start the music with the Spotify integration. <br />Then, if you are interested in this article, you should read it on the NYT Website, by clicking on the link. <br />You can also find other similar sounds by clicking on the button.</p>
            <button onClick={toggleInstructions} className="btn-secondary">Close</button>
          </div>
        </div>
      )}

      <div className="text-center mt-4">
        <Button className="custom-button" onClick={() => navigate('/')}>
          Back to Search
        </Button>
      </div>
    </div>
  );
}

export default ReadPage;
