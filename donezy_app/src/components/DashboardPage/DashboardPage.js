import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import HistoryRounded from '@mui/icons-material/HistoryRounded';
import AddBoxRounded from '@mui/icons-material/AddBoxRounded';
import { useAuth0 } from "@auth0/auth0-react";

const DashboardPage = () => {
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate(); // Initialize useNavigate
    const { user } = useAuth0();
    console.log(user);

    return (
        <div>
        <h1>Dashboard</h1>
        <p>Welcome, {user.name}!</p>
        </div>
    );
}

export default DashboardPage;