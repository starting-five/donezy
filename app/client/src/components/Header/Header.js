// File: client/src/components/Header/Header.js
// Description: This file contains the Header component which is used to display the header of the app.

import { useAuth0 } from "@auth0/auth0-react";
import LogoutIcon from "@mui/icons-material/Logout"; // Import the Logout icon
import MenuIcon from "@mui/icons-material/Menu"; // Import the Menu icon
import SettingsIcon from "@mui/icons-material/Settings";
import {
  AppBar, Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar, Typography
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleSettingsModal } from "../../redux/actions/settingsAction";
import "./Header.css"; // Import the CSS file for styling

import SettingsPage from "../../pages/SettingsPage/SettingsPage";

const Header = ({ productName, onLogout }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { isAuthenticated } = useAuth0();

  const handleSettings = () => {
    handleClose(); // Close the menu after navigating
    dispatch(toggleSettingsModal()); // Dispatch the action to open the settings menu
    setIsSettingsOpen(true);
  };

  const handleLogout = () => {
    handleClose(); // Close the menu before logging out
    sessionStorage.removeItem("hasLoggedIn");
    onLogout(); // Call the onLogout function passed as a prop
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div">
            {productName}
          </Typography>
        </Box>

        {isAuthenticated && (
          <IconButton onClick={handleClick} color="inherit">
            <MenuIcon />
          </IconButton>
        )}

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem onClick={handleSettings}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
        {isSettingsOpen && <SettingsPage></SettingsPage>}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
