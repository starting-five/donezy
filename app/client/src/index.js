// File: client/src/index.js
// Description: This is the entry point of the React application. It sets up the Apollo Client, Auth0 Provider, and renders the main App component.

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import ApolloProviderWithAuth from "./graphql/ApolloProviderWithAuth";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#2774AE' }, // UCLA Blue
    secondary: { main: '#FFD100' }, // UCLA Gold (optional, for accents)
    background: { default: '#f5f5f5' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Montserrat, Arial, sans-serif',
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      }}
    >
      <ApolloProviderWithAuth>
        <ThemeProvider theme={theme}>
        <App />
        </ThemeProvider>
      </ApolloProviderWithAuth>
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
