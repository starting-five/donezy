// File: client/src/App.js
// Description: This file contains the main application component that sets up routing and authentication using Auth0.

import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Provider } from "react-redux";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import BottomNav from "./components/BottomNav/BottomNav";
import Header from "./components/Header/Header"; // Assuming you have the Header component
import CreatePage from "./pages/CreatePage/CreatePage";
import DisplayPage from "./pages/DisplayPage/DisplayPage";
import HistoryPage from "./pages/HistoryPage/HistoryPage";
import HomePage from "./pages/HomePage/HomePage";
import LandingPage from "./pages/LandingPage/LandingPage"; // Assuming you have the LandingPage component
import SettingsPage from "./pages/SettingsPage/SettingsPage"; // Assuming you have the SettingsPage component
import store from "./redux/store"; // Assuming you have the Redux store set up

const App = () => {
  const { loginWithRedirect, isAuthenticated, logout } =
    useAuth0();

  const handleLogin = async () => {
    try {
      await loginWithRedirect();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      debugger;
    }
  };

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/" replace />; // Redirect to the landing page if not authenticated
    }

    return children; // Render the protected component if authenticated
  };

  return (
    <Provider store={store}>
      <Router>
        <Header productName="Donezy" onLogout={handleLogout} />{" "}
        {/* Header component with product name and logout function */}
        <Routes>
          <Route
            path="/"
            element={<LandingPage handleLogin={handleLogin}></LandingPage>}
          />{" "}
          {/* Display the LandingPage */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/post/:uniqueID" element={<DisplayPage />} />
        </Routes>
        {isAuthenticated && <BottomNav />}
      </Router>
    </Provider>
  );
  // Return the Router component with Header and Routes
};

export default App;
