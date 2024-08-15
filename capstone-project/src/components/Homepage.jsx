import React from 'react';
import './Homepage.css';

function Homepage() {
  return (
    <div className="homepage">
      <h1>Welcome to Bill-Split</h1>
      <img
       src="/receipt.png" // Path to the PNG in the public directory
        alt="Bill Splitter Logo"
        className="logo"
      />
      <p className="homepage-tagline">Simplify your bill splitting with ease.</p>
      <footer className="homepage-footer">
        &copy; {new Date().getFullYear()} Bill-Split. All rights reserved.
      </footer>
    </div>
  );
}

export default Homepage;
