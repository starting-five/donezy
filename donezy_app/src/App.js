import { useAuth0 } from "@auth0/auth0-react";
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import DisplayPage from './components/DisplayPage/DisplayPage';
import Header from './components/Header/Header';
import HomePage from './components/HomePage/HomePage';
import UploadPage from './components/UploadPage/UploadPage';

function App() {

  const { isAuthenticated } = useAuth0();
  // const navigate = useNavigate();

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="App">
        <Header /> {/* Header is displayed on every page */}
        <Routes>
          {/* Landing page route */}
          <Route path="/" element={<HomePage />} />

          {/* Upload page */}
          <Route path="/upload" element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
            } 
          />

          {/* Route with a unique ID */}
          <Route path="/:uniqueID" element={<DisplayPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
