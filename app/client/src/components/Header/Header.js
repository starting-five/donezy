// src/components/Header.js
import { useAuth0 } from "@auth0/auth0-react";
import LogoutIcon from '@mui/icons-material/Logout'; // Import the Logout icon
import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import React from 'react';
import './Header.css'; // Import the CSS file for styling

const Header = ({ productName, onLogout }) => {
  const { user, isAuthenticated, isLoading } = useAuth0();


  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div">
            {productName}
          </Typography>
        </Box>
        { isAuthenticated && 
          <Tooltip title="Logout" arrow>
            <IconButton>
              <LogoutIcon className="logout-btn" onClick={onLogout}/>
            </IconButton>
          </Tooltip>
        }
      </Toolbar>
    </AppBar>
  );
};

export default Header;
