import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Match.css";
import Navbar from "../components/Navbar";

const Match = () => {
  const [teams, setTeams] = useState([]);
  const [team1, setTeam1] = useState(0);
  const [team2, setTeam2] = useState(0);
  const [overs, setOvers] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch teams from API
    api
      .get("/teamstats/")
      .then((response) => setTeams(response.data))
      .catch((error) => console.error("Error fetching teams:", error));
  }, []);

  const handleStartMatch = () => {
    if (!team1 || !team2 || !overs) {
      alert("Please fill in all fields");
      return;
    }
    api
      .post("/matches/", {
        total_overs: overs,
        total_balls: 0,
        batting_team: team1.id,
        bowling_team: team2.id,
      })
      .then((response) => {
        const updatedMatch = response.data;

        api
          .post("/innings/", { inning_1: updatedMatch.id })
          .then((response) => {
            const inning_1 = response.data;
            console.log(inning_1.id);
            navigate(`/setplayer/`, {
              state: {
                matchId: updatedMatch.id,
                inning1Id: inning_1.id || null,
              },
            });
          });
      })
      .catch((error) => console.error("Error submitting match:", error));
  };

  const getFilteredTeams = (selectedTeam) => {
    return teams.filter((team) => team.id !== selectedTeam.id);
  };

  return (
    <div className="match-container">
      <Navbar />
      <header className="match-header">
        <h1>Start Your Cricket Match</h1>
        <p>Select the teams and configure the match settings to begin.</p>
      </header>

      <div className="match-form">
        <div className="form-group">
          <label htmlFor="team1">Choose Team 1 (Batting First):</label>
          <select
            id="team1"
            value={team1?.id || ""}
            onChange={(e) => {
              const selectedTeam1 = teams.find(
                (team) => team.id === parseInt(e.target.value)
              );
              setTeam1(selectedTeam1);
              if (selectedTeam1 && selectedTeam1.id === team2?.id) {
                setTeam2(null);
              }
            }}
          >
            <option value="">Select a team</option>
            {getFilteredTeams(team2).map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="team2">Choose Team 2 (Bowling First):</label>
          <select
            id="team2"
            value={team2?.id || ""}
            onChange={(e) => {
              const selectedTeam2 = teams.find(
                (team) => team.id === parseInt(e.target.value)
              );
              setTeam2(selectedTeam2);
              if (selectedTeam2 && selectedTeam2.id === team1?.id) {
                setTeam1(null);
              }
            }}
          >
            <option value="">Select a team</option>
            {getFilteredTeams(team1).map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="overs">Enter Total Overs:</label>
          <input
            type="number"
            id="overs"
            value={overs}
            onChange={(e) => setOvers(e.target.value)}
            min="1"
            placeholder="Set number of overs"
          />
        </div>

        <button className="start-button" onClick={handleStartMatch}>
          Start Match
        </button>
      </div>
    </div>
  );
};

export default Match;
