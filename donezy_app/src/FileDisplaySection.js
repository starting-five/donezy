import React from 'react';

const FileDisplaySection = ({ images, title }) => {
    return (
        <div style={styles.wrapper}>
            {/* Display the title as a header */}
            <h1 style={styles.header}>{title}</h1>
            <div style={styles.container}>
                {images && images.length > 0 ? (
                    images.map((image, index) => (
                        <div key={index} style={styles.imageWrapper}>
                            <img
                                src={image}
                                alt={`Display ${index}`}
                                style={styles.image}
                            />
                        </div>
                    ))
                ) : (
                    <p style={styles.message}>No images to display</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        border: '2px solid #e0e0e0', // Softer border color
        borderRadius: '12px', // Slightly more rounded corners
        padding: '30px', // Add more padding for a spacious layout
        margin: '30px auto', // Center the component with more spacing
        maxWidth: '900px', // Increase the width for better visibility
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', // Stronger shadow for a modern look
        backgroundColor: '#ffffff', // Clean white background
    },
    header: {
        textAlign: 'center',
        marginBottom: '25px',
        fontSize: '28px', // Larger font size for the title
        fontWeight: 'bold', // Make the title bold
        color: '#333', // Darker text color for better contrast
        letterSpacing: '1px', // Add slight letter spacing
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px', // Increase the gap between images
        justifyContent: 'center',
        padding: '10px',
    },
    imageWrapper: {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '10px', // Rounded corners for images
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add shadow to image containers
        transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth hover effect
    },
    image: {
        width: '200px', // Slightly larger images
        height: '200px',
        objectFit: 'cover',
        borderRadius: '10px', // Match the wrapper's rounded corners
        transition: 'transform 0.3s ease', // Smooth zoom effect on hover
    },
    imageWrapperHover: {
        transform: 'scale(1.05)', // Slight zoom on hover
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)', // Stronger shadow on hover
    },
    message: {
        fontSize: '18px', // Slightly larger font size for the message
        color: '#888', // Softer text color
        textAlign: 'center',
        marginTop: '20px',
    },
};

export default FileDisplaySection;