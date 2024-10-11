import React from "react";
import "../styles/About.css";
import Navbar from "../components/Navbar";
import owner from "../images/owner.jpg";
import anaysis from "../images/analysis.jpg";
import developer from "../images/developer.jpg";

const About = () => {
  return (
    <div className="about-us-container">
      <Navbar />
      <h1>About Us</h1>
      <p>
        Welcome to Cricket Scorer, your one-stop destination for all things
        cricket! Our team is passionate about the game and dedicated to
        providing you with the most accurate and up-to-date scores, stats, and
        analysis.
      </p>
      <p>
        Our mission is to make cricket more accessible and enjoyable for fans
        around the world. We believe that cricket has the power to bring people
        together, and we're committed to helping you stay connected to the game
        you love.
      </p>
      <h2>Our Team</h2>
      <ul>
        <li>
          <img src={owner} alt="Team Member 1" />
          <h3>John Doe</h3>
          <p>Founder & CEO</p>
        </li>
        <li>
          <img src={developer} alt="Team Member 2" />
          <h3>Jane Smith</h3>
          <p>Lead Developer</p>
        </li>
        <li>
          <img src={anaysis} alt="Team Member 3" />
          <h3>Bob Johnson</h3>
          <p>Cricket Analyst</p>
        </li>
      </ul>
    </div>
  );
};

export default About;
