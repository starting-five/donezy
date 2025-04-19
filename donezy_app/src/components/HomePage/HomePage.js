import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.scss'; // Import the SCSS file

const HomePage = () => {
    const navigate = useNavigate();
    const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

    const handleLogin = async () => {
        await loginWithRedirect(); // Trigger the login process
    };

    useEffect(() => {
        if (isAuthenticated) {
            // navigate('/upload');
            navigate('/dashboard'); // Redirect to the dashboard page after successful login
        }
    }, [isAuthenticated, navigate]);

    if (isLoading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="container">
            <h1 className="title">Welcome to Donezy</h1>
            <p className="subtitle">
                Easily upload and showcase your <strong>before</strong> and <strong>after</strong> pictures to impress your customers.
            </p>
            {!isAuthenticated && (
                <button className="button" onClick={handleLogin}>
                    Get Started
                </button>
            )}
        </div>
    );
};

export default HomePage;