import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <header className="home-header">
        <h1>Welcome to CricketScorer</h1>
        <p>
          Your go-to place for managing cricket matches, teams, and history.
        </p>
      </header>
      <section className="home-card-container">
        <div className="home-card">
          <Link to="/matches">
            <h2>Start a New Match</h2>
            <p>
              Set up your teams and start scoring your matches in real-time with
              ease.
            </p>
          </Link>
        </div>
        <div className="home-card">
          <Link to="/teamstats">
            <h2>Teams Overview</h2>
            <p>
              Manage and view detailed stats for all your cricket teams in one
              place.
            </p>
          </Link>
        </div>
        <div className="home-card">
          <Link to="/history">
            <h2>Match History</h2>
            <p>
              Review detailed statistics and historical data for past cricket
              matches.
            </p>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;
