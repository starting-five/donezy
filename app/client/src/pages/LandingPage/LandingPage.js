// File: client/src/pages/LandingPage/LandingPage.js
// Description: This file contains the LandingPage component, which is the landing page of the application.

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import "./LandingPage.css"; // Import the SCSS file

const LandingPage = ({ handleLogin }) => {
  const navigate = useNavigate();

  const {
    isAuthenticated,
    isLoading,
    getAccessTokenSilently,
  } = useAuth0();

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await getAccessTokenSilently();
        console.log("Access Token:", token);
        // You can now use this token to call your API
      } catch (e) {
        console.error("Error getting token", e);
      }
    };

    if (isAuthenticated) {
      getToken();
      navigate("/home");
    }
  }, [getAccessTokenSilently, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="loading">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="container">
      {!isAuthenticated && (
        <>
          <h1 className="title">Welcome to Donezy</h1>
          <p className="subtitle">
            Easily upload and showcase your <strong>before</strong> and{" "}
            <strong>after</strong> pictures to impress your customers.
          </p>
          {!isAuthenticated && (
            <button className="login-button" onClick={handleLogin}>
              Login with Auth0
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default LandingPage;
