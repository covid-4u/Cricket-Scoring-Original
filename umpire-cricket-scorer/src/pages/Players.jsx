import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useLocation } from "react-router-dom";
import "../styles/Players.css";
import Navbar from "../components/Navbar";

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [newPlayer, setNewPlayer] = useState("");
  const [newPlayerRole, setNewPlayerRole] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddPlayer, setShowAddPlayer] = useState(false); // New state for toggling add player form

  const location = useLocation();
  const teamId = location.state?.teamId;
  const route = "players/";

  useEffect(() => {
    if (teamId) {
      api
        .get(`/players/?team=${teamId}`) // Pass teamId as query parameter
        .then((response) => {
          setPlayers(response.data);
        })
        .catch((error) => console.error("Error fetching players:", error));
    }
  }, [teamId]);

  const handleAddPlayer = () => {
    // Check if a player with the same name already exists
    const playerExists = players.some(
      (player) => player.name.toLowerCase() === newPlayer.toLowerCase()
    );

    if (playerExists) {
      alert("Player with this name already exists.");
      return;
    }

    if (newPlayer.trim() === "" || newPlayerRole === "") {
      alert("Please Enter Name and Select Role");
      return;
    }

    api
      .post(route, {
        name: newPlayer,
        role: newPlayerRole,
        team: teamId, // Assign the player to the current team
      })
      .then((response) => {
        setPlayers([...players, response.data]);
        setNewPlayer("");
        setNewPlayerRole("");
        setShowAddPlayer(false); // Hide the form after adding
      })
      .catch((error) => {
        console.error("Error adding player:", error);
      });
  };

  const handleDeletePlayer = (id) => {
    if (window.confirm("Are you sure you want to delete this player?")) {
      api
        .delete(`${route}${id}/`)
        .then(() => setPlayers(players.filter((player) => player.id !== id)))
        .catch((error) => console.error("Error deleting player:", error));
    }
  };

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="players-container">
      <Navbar />
      <header className="players-header">
        <h1>Players</h1>
        <div className="header-actions">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search player by name"
            className="search-input"
          />
          <button
            onClick={() => setShowAddPlayer(!showAddPlayer)}
            className="add-player-button"
          >
            + Add Player
          </button>
        </div>
      </header>
      {showAddPlayer && (
        <div className="players-addplayer">
          <input
            type="text"
            value={newPlayer}
            onChange={(e) => setNewPlayer(e.target.value)}
            placeholder="New player name"
          />
          <div className="player-roles">
            <label htmlFor="batsman">
              <input
                type="radio"
                value="Batsman"
                name="newplayerrole"
                id="batsman"
                onChange={(e) => setNewPlayerRole(e.target.value)}
              />
              Batsman
            </label>
            <label htmlFor="bowler">
              <input
                type="radio"
                value="Bowler"
                name="newplayerrole"
                id="bowler"
                onChange={(e) => setNewPlayerRole(e.target.value)}
              />
              Bowler
            </label>
            <label htmlFor="allrounder">
              <input
                type="radio"
                value="All Rounder"
                name="newplayerrole"
                id="allrounder"
                onChange={(e) => setNewPlayerRole(e.target.value)}
              />
              All Rounder
            </label>
          </div>
          <button onClick={handleAddPlayer} className="submit-button">
            Add Player
          </button>
        </div>
      )}
      <main className="players-main">
        <div className="players-list">
          <ul>
            {filteredPlayers.map((player) => (
              <li key={player.id}>
                <div className="faq-container">
                  <div className="faq-item">
                    <input
                      type="checkbox"
                      id={player.id}
                      className="faq-checkbox"
                    />
                    <label htmlFor={player.id} className="faq-question">
                      {player.name}
                      <button
                        className="delete-button"
                        onClick={() => handleDeletePlayer(player.id)}
                      >
                        Delete
                      </button>
                    </label>
                    <div className="faq-answer">
                      {/* Player stats */}
                      <div className="stat-box">
                        <b>{player.role}</b>
                      </div>
                      <div className="stat-box">
                        <b>Matches : </b> {player.matches_played}
                      </div>
                      <div className="stat-box">
                        <b>Runs Scored : </b> {player.total_runs}
                      </div>
                      <div className="stat-box">
                        <b>4's : </b>
                        {player.total_4s}
                      </div>
                      <div className="stat-box">
                        <b>6's : </b>
                        {player.total_6s}
                      </div>
                      <div className="stat-box">
                        <b>Best Score : </b>
                        {player.best_score}
                      </div>
                      <div className="stat-box">
                        <b>30's : </b>
                        {player.total_30s}
                      </div>
                      <div className="stat-box">
                        <b>50's : </b>
                        {player.total_50s}
                      </div>
                      <div className="stat-box">
                        <b>Overs : </b>
                        {player.total_overs_bowled}
                      </div>
                      <div className="stat-box">
                        <b>Runs Given : </b>
                        {player.total_runs_given}
                      </div>
                      <div className="stat-box">
                        <b>Wickets : </b>
                        {player.total_wickets}
                      </div>
                      <div className="stat-box">
                        <b>Eco. : </b>
                        {player.economy_rate}
                      </div>
                      <div className="stat-box">
                        <b>Dot  balls : </b>
                        {player.total_dot_balls}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Players;
