import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import HistoryIcon from "@mui/icons-material/History";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Box from "@mui/material/Box";
import React from "react";
import { useNavigate } from "react-router-dom";

const BottomNav = () => {
  const [value, setValue] = React.useState(0);
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%", position: "fixed", bottom: 0 }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<HomeRoundedIcon />}
          onClick={() => navigate("/home")}
        />
        <BottomNavigationAction
          label="History"
          icon={<HistoryIcon />}
          onClick={() => navigate("/history")}
        />
        <BottomNavigationAction
          label="Create"
          icon={<CreateRoundedIcon />}
          onClick={() => navigate("/create")}
        />
      </BottomNavigation>
    </Box>
  );
};

export default BottomNav;
