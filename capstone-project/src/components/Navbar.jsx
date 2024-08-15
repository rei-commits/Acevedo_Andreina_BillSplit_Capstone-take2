import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Ensure this path is correct

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/auth">Register/Sign up</Link></li>
        <li><Link to="/split">Split Bill</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
