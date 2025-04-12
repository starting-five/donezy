import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage'; // Import the new landing page
import Upload from './Upload';
import DisplayPage from './DisplayPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing page route */}
          <Route path="/" element={<LandingPage />} />

          {/* Upload page */}
          <Route path="/upload" element={<Upload />} />

          {/* Route with a unique ID */}
          <Route path="/:uniqueID" element={<DisplayPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
