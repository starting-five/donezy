import { useAuth0 } from "@auth0/auth0-react";
import React from 'react';
import './Header.scss'; // Import the SCSS file

const Header = () => {
    const { logout, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return (
            <header className="header">
                <h1 className="title">Donezy</h1>
                <p className="guest-message">Loading...</p>
            </header>
        );
    }

    return (
        <header className="header">
            <h1 className="title">Donezy</h1>
            {isAuthenticated ? (
                <button
                    className="logout-button"
                    onClick={() => logout({ returnTo: window.location.origin })}
                >
                    Logout
                </button>
            ) : (
                <p className="guest-message">Welcome, Guest</p>
            )}
        </header>
    );
};

export default Header;