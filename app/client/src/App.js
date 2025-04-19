// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage"; // Assuming you have the LandingPage component
import HomePage from "./pages/HomePage/HomePage";
import Header from "./components/Header/Header"; // Assuming you have the Header component
import { useAuth0 } from "@auth0/auth0-react";
// import CreatePage from './pages/CreatePage/CreatePage';
import HistoryPage from "./pages/HistoryPage/HistoryPage";
import BottomNav from "./components/BottomNav/BottomNav";
import UploadPage from "./pages/UploadPage/UploadPage"; // Assuming you have the UploadPage component
import DisplayPage from "./pages/DisplayPage/DisplayPage";
import { Provider } from "react-redux";
import store from "./redux/store"; // Assuming you have the Redux store set up

const App = () => {
  const { loginWithRedirect, user, isAuthenticated, isLoading, logout } =
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
    // Handle logout logic here
    console.log("Logout clicked");
    logout({ returnTo: window.location.origin });
  };

  const ProtectedRoute = ({ children }) => {
    console.log("protected route");
    console.log("isAuthenticated:", isAuthenticated);
    console.log("isLoading:", isLoading);

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
          {/* <Route path="/create" element={
          <ProtectedRoute>
            <CreatePage />
          </ProtectedRoute>
        }
        /> */}
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />
          <Route path="/:uniqueID" element={<DisplayPage />} />
        </Routes>
        {isAuthenticated && <BottomNav />}
      </Router>
    </Provider>
  );
  // Return the Router component with Header and Routes
};

export default App;
