import { useAuth0 } from "@auth0/auth0-react";
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import DisplayPage from './components/DisplayPage/DisplayPage';
import Header from './components/Header/Header';
import HomePage from './components/HomePage/HomePage';
import UploadPage from './components/UploadPage/UploadPage';
import DashboardPage from "./components/DashboardPage/DashboardPage";
import BottomNav from "./components/BottomNav/BottomNav";
import HistoryPage from "./components/HistoryPage/HistoryPage";
import AddPage from "./components/AddPage/AddPage";

function App() {
  const { isAuthenticated } = useAuth0();
  // const location = useLocation(); // Get the current route

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  // Define routes where BottomNav should not appear
  const hideBottomNavRoutes = ['/'];

  return (
    <Router>
      <div className="App">
        <Header /> {/* Header is displayed on every page */}
        <Routes>

          <Route path="/index.html" element={<Navigate to="/" replace />} />
          
          {/* Landing page route */}
          <Route path="/" element={<HomePage />} />

          {/* Dashboard page */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />

          {/* History page */}
          <Route path="/history" element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          } />

          {/* Add page */}
          <Route path="/add" element={
            <ProtectedRoute>
              <AddPage />
            </ProtectedRoute>
          } />

          {/* Upload page */}
          <Route path="/upload" element={
            <ProtectedRoute>
              <UploadPage />
            </ProtectedRoute>
          } />

          {/* Route with a unique ID */}
          <Route path="/:uniqueID" element={<DisplayPage />} />
        </Routes>

        { /* Conditionally render BottomNav */}
        {isAuthenticated && <BottomNav />}
      </div>
    </Router>
  );
}

export default App;
