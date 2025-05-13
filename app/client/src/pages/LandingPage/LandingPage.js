// File: client/src/pages/LandingPage/LandingPage.js
// Description: This file contains the LandingPage component, which is the landing page of the application.

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import "./LandingPage.css";

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
    <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
      {!isAuthenticated && (
        <>
          <Typography variant="h3" component="h1" className="title">
            Welcome to Donezy
          </Typography>
          <Typography variant="h6" className="subtitle" gutterBottom>
            Because done deserves to be seen!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            className="login-button"
            onClick={handleLogin}
            sx={{ mt: 4, minWidth: 200 }}
          >
            Login with Auth0
          </Button>
        </>
      )}
    </div>
  );
};

export default LandingPage;
