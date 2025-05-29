// File: client/src/components/BottomNav/BottomNav.js
// Description: This file contains the BottomNav component which is used to navigate between different pages in the app.

import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import HistoryIcon from "@mui/icons-material/History";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BottomNav.css"; 

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Map routes to nav values
  const routeToNavValue = {
    "/home": "home",
    "/history": "history",
    "/create": "create",
  };

  // Determine current selected tab based on URL path
  // Handle default as 'home'
  // Also handle if location.pathname is exactly '/', treat as '/home'
  let currentValue = routeToNavValue[location.pathname];
  if (!currentValue) {
    if (location.pathname === "/") {
      currentValue = "home";
    } else if (location.pathname.startsWith("/post")) {
      // hide BottomNav on /post pages
      return null;
    } else {
      currentValue = "home";
    }
  }

  const handleChange = (event, newValue) => {
    switch (newValue) {
      case "home":
        navigate("/home");
        break;
      case "history":
        navigate("/history");
        break;
      case "create":
        navigate("/create");
        break;
      default:
        navigate("/home");
    }
  };

  return (
    <Box className="bottom-nav-container">
      <BottomNavigation showLabels value={currentValue} onChange={handleChange}>
        <BottomNavigationAction label="Home" icon={<HomeRoundedIcon />} value="home" />
        <BottomNavigationAction label="History" icon={<HistoryIcon />} value="history" />
        <BottomNavigationAction label="Create" icon={<CreateRoundedIcon />} value="create" />
      </BottomNavigation>
    </Box>
  );
};

export default BottomNav;
