import React from 'react';
import './FileDisplaySection.scss'; // Import the SCSS file

const FileDisplaySection = ({ images, title }) => {
    return (
        <div className="file-display-section">
            {/* Display the title as a header */}
            <h1 className="header">{title}</h1>
            <div className="container">
                {images && images.length > 0 ? (
                    images.map((image, index) => (
                        <div key={index} className="image-wrapper">
                            <img
                                src={image}
                                alt={`Display ${index}`}
                            />
                        </div>
                    ))
                ) : (
                    <p className="message">No images to display</p>
                )}
            </div>
        </div>
    );
};

export default FileDisplaySection;