import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/upload'); // Navigate to the upload page
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Welcome to Donezy</h1>
            <p style={styles.subtitle}>
                Easily upload and showcase your <strong>before</strong> and <strong>after</strong> pictures to impress your customers.
            </p>
            <button style={styles.button} onClick={handleGetStarted}>
                Get Started
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f9f9f9',
        textAlign: 'center',
        padding: '20px',
    },
    title: {
        fontSize: '3rem',
        color: '#333',
        marginBottom: '16px',
    },
    subtitle: {
        fontSize: '1.5rem',
        color: '#555',
        marginBottom: '32px',
    },
    button: {
        padding: '12px 24px',
        fontSize: '1.2rem',
        color: '#fff',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#0056b3',
    },
};

export default LandingPage;