import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
// import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import './HomePage.scss'; // Import the SCSS file
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import './LandingPage.css'; // Import the SCSS file

const LandingPage = ({handleLogin}) => {
    console.log("LandingPage props:");
    const navigate = useNavigate();

    const { loginWithRedirect, user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

    // const handleLogin = async () => {
    //     try {
    //         await loginWithRedirect();
    //     } catch (error) {
    //         console.error("Login failed:", error);
    //     } finally {
    //         debugger
    //     }
    // }

    useEffect(() => {
        const getToken = async () => {
          try {
            const token = await getAccessTokenSilently();
            console.log('Access Token:', token);
            // You can now use this token to call your API
          } catch (e) {
            console.error('Error getting token', e);
          }
        };
    
        if (isAuthenticated) {
          getToken();
          navigate("/home");
        }
      }, [getAccessTokenSilently, isAuthenticated, navigate]);

    // useEffect(() => { 
    //     if (isAuthenticated) {
    //         navigate("/home");
    //     }
    // }
    // , [isAuthenticated, navigate]);
console.log("isLoading:---------", isLoading);
    // if(isLoading) {
    //     return (
    //     <Box sx={{ display: 'flex' }}>
    //         <CircularProgress />
    //       </Box>
    //     )

    // }
    if(isLoading) {
        return (
        <div className="loading">
            <CircularProgress />
        </div>
        )

    }

    if(user) {
        console.log("user:---------", user);
    }

    // if(isLoading) {
    //     return (
    //         <div className="loading">
    //             Loading...
    //         </div>
    //     )
    // }
    console.log("after isloading---------");
    return (
        <div className="container">
        {
            !isAuthenticated && (
                <>
                    <h1 className="title">Welcome to Donezy</h1>
                    <p className="subtitle">
                        Easily upload and showcase your <strong>before</strong> and <strong>after</strong> pictures to impress your customers.
                    </p>
                    {!isAuthenticated && (
                        <button className="login-button" onClick={handleLogin}>
                            Login with Auth0
                        </button>
                    )}
                </>
            )
        }

        </div>
    );
};

export default LandingPage;