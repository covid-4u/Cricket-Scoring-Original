import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>&copy; 2024 CricketScorer. All rights reserved.</p>
      <p>
        <a href="/about" className="footer-link">
          About Us
        </a>{" "}
        |{" "}
        <a href="/contact" className="footer-link">
          Contact
        </a>
      </p>
    </footer>
  );
};

export default Footer;
