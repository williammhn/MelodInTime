import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SearchPage from './SearchPage';
import ReadPage from './ReadPage';
import OtherMusicPage from './OtherMusicPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/article" element={<ReadPage />} /> 
        <Route path="/other-music" element={<OtherMusicPage />} />
      </Routes>
    </Router>
  );
}

export default App;
