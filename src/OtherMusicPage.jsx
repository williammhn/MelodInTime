import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';

function OtherMusicPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { album, releaseDate, accessToken } = location.state || {};
  const [otherAlbums, setOtherAlbums] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    if (!album || !accessToken) {
      setErrorMessage('Missing data. Please return to the previous page.');
      setLoading(false);
      return;
    }

    const fetchOtherMusic = async () => {
      try {
        const sameArtistAlbums = await axios.get(
          `https://api.spotify.com/v1/artists/${album.artists[0].id}/albums`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { limit: 1 },
          }
        );

        const sameYearAlbums = await axios.get('https://api.spotify.com/v1/search', {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: {
            q: `year:${releaseDate.slice(0, 4)}`,
            type: 'album',
            limit: 2,
          },
        });

        setOtherAlbums([
          ...sameYearAlbums.data.albums.items.slice(0, 1), // Left embed
          ...sameArtistAlbums.data.items.slice(0, 1), // Center embed
          ...sameYearAlbums.data.albums.items.slice(1, 2), // Right embed
        ]);
      } catch (error) {
        console.error('Error while fetching music:', error);
        setErrorMessage('Unable to load additional music.');
      } finally {
        setLoading(false);
      }
    };

    fetchOtherMusic();
  }, [album, accessToken, releaseDate]);

  return (
    <div className="other-music-container">
      <h1 className="app-title">Melod'in Time</h1>
      <h2 className="page-subtitle">Did you like the previous tracks? So here are other similar albums</h2>
      {errorMessage ? (
        <p style={{ color: 'red' }}>{errorMessage}</p>
      ) : loading ? ( 
        <div className="loading-container" id="other-load">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <div className="embed-row">
          {otherAlbums.map((otherAlbum, index) => (
            <div key={otherAlbum.id} className={`embed-container ${index === 1 ? 'center-embed' : ''}`}>
              <p className="embed-title">
                {index === 1 ? 'Same Author' : 'Released the Same Year'}
              </p>
              <iframe
                src={`https://open.spotify.com/embed/album/${otherAlbum.id}`}
                className="spotify-embed"
                allow="encrypted-media"
                title={`Spotify Album ${otherAlbum.name}`}
              ></iframe>
            </div>
          ))}
        </div>
      )}
      <button className="custom-button" onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
}

export default OtherMusicPage;
