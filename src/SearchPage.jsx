import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Button, Spinner } from 'react-bootstrap';
import SearchBar from './SearchBar';

function SearchPage() {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const navigate = useNavigate();

  // Sync token from URL parameters or localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access_token');
    if (token) {
      setAccessToken(token);
      localStorage.setItem('accessToken', token);
    }
  }, []);

  // Ensure token stays synced with localStorage
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
  }, [accessToken]);

  const isValidDate = (dateString) => {
    const year = parseInt(dateString.slice(0, 4));
    const month = parseInt(dateString.slice(4, 6)) - 1;
    const day = parseInt(dateString.slice(6, 8));
    const date = new Date(year, month, day);

    return (
      date &&
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day
    );
  };

  const handleSpotifyLogin = () => {
    window.location.href = 'http://localhost:4000/spotify-login';
  };

  const handleLogout = () => {
    setAccessToken(null);
    localStorage.removeItem('accessToken');
  };

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  const handleSearch = async (formattedDate) => {
    if (!isValidDate(formattedDate)) {
      setError('Invalid date. Please enter a valid date.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.get(`http://localhost:4000/nyt-most-complete-article`, {
        params: { date: formattedDate },
      });

      if (response.data && Object.keys(response.data).length > 0) {
        navigate('/article', { state: { article: response.data } });
      } else {
        setError('No article found for this date.');
      }
    } catch (error) {
      console.error('Error during API request:', error);
      setError('An error occurred during the search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
        <div className='login-container'>
            <i className="fa-brands fa-spotify spotify-icon"></i>
            {!accessToken ? (
                <button onClick={handleSpotifyLogin} className="custom-button">
                Connect to Spotify
                </button>
            ) : (
                <button onClick={handleLogout} className="custom-button">
                Logout
                </button>
            )}
        </div>
        <div className='titles-container'>
            <h1 className="text-center">Melod'in Time</h1>
            <h2 className="text-center">Dive into the Soundtrack of Every Story</h2>
        </div>
        <div className='search-bar-container'>
            <SearchBar onSearch={handleSearch} />
        </div>
      
        {loading && (
        <div className="loading-container">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
        {error && <p className="error-container">{error}</p>}

        <div className="question-icon" onClick={toggleInstructions}>
            <i className="fa-solid fa-question" style={{ color: '#000000', fontSize: '1.8rem', cursor: 'pointer' }}></i>
        </div>

        {showInstructions && (
            <div className="instructions-card">
              <Card>
                <Card.Body>
                  <Card.Title>Instructions</Card.Title>
                  <Card.Text>
                    Connect to Spotify with your own account. Then, enter a date in the search bar to find matching music and articles. If there are somme issues with loading the album, make sure that you're connected to Spotify.
                  </Card.Text>
                  <Button variant="secondary" onClick={toggleInstructions}>Close</Button>
                </Card.Body>
              </Card>
            </div>
        )}
    </div>
  );
}

export default SearchPage;
