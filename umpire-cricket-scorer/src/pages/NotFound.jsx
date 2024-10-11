import React from 'react';
import '../styles/NotFound.css';

const NotFound = () => {
    return (
        <div className="notfound-container">
            <h1 className="notfound-title">404</h1>
            <p className="notfound-message">Oops! The page you're looking for doesn't exist.</p>
            <a href="/" className="notfound-link">Go Back Home</a>
        </div>
    );
};

export default NotFound;
