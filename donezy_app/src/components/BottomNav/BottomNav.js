import React from "react";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import HistoryIcon from '@mui/icons-material/History';
import AddBoxRounded from '@mui/icons-material/AddBoxRounded';

const BottomNav = () => {
    const [value, setValue] = React.useState(0);
    const navigate = useNavigate();

    return (
        <Box sx={{ width: '100%', position: 'fixed', bottom: 0 }}>
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
                    onClick={() => navigate('/dashboard')} 
                />
                <BottomNavigationAction 
                    label="History" 
                    icon={<HistoryIcon />} 
                    onClick={() => navigate('/history')} 
                />
                <BottomNavigationAction 
                    label="Add" 
                    icon={<AddBoxRounded />} 
                    onClick={() => navigate('/upload')} 
                />
            </BottomNavigation>
        </Box>
    );
};

export default BottomNav;