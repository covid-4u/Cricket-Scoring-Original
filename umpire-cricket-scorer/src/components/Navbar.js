import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-brand">CricketScorer</h1>
        <ul className="navbar-links">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/matches" className="navbar-link">
              Start a New Match
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/teamstats" className="navbar-link">
              Teams Overview
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/history" className="navbar-link">
              Match History
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
