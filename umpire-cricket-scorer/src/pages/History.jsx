import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/History.css";
import Navbar from "../components/Navbar";

function History() {
  const [matches, setMatches] = useState([]);
  const [winnerTeams, setWinnerTeams] = useState({});
  const [inningsData, setInningsData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await api.get("innings/");
        setMatches(response.data);

        // Fetch winner team names and innings data for each match
        response.data.forEach((match) => {
          handleWinnerTeamName(match.result);
          handleInnings(match.inning_1, match.inning_2);
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchMatches();
  }, []);

  const handleInnings = (inning1Id, inning2Id) => {
    if (inning1Id) {
      api.get(`matches/${inning1Id}`).then((response) => {
        setInningsData((prev) => ({
          ...prev,
          [inning1Id]: response.data,
        }));
      });
    }
    if (inning2Id) {
      api.get(`matches/${inning2Id}`).then((response) => {
        setInningsData((prev) => ({
          ...prev,
          [inning2Id]: response.data,
        }));
      });
    }
  };

  const handleWinnerTeamName = (winnerTeamId) => {
    if (winnerTeamId) {
      api
        .get(`teamstats/${winnerTeamId}`)
        .then((response) => {
          setWinnerTeams((prevTeams) => ({
            ...prevTeams,
            [winnerTeamId]: response.data.name,
          }));
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };
  const handleDeleteMatch = (matchId) => {
    if (window.confirm("Are you sure you want to delete this match?")) {
      api
        .delete(`innings/${matchId}/`)
        .then(() => {
          // Remove the deleted match from state
          setMatches((prevMatches) =>
            prevMatches.filter((match) => match.id !== matchId)
          );
        })
        .catch((err) => {
          console.error("Error deleting match: ", err);
        });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const handleMatchClick = (inning1Id) => {
    navigate(`/inning`, { state: { inning1Id } });
  };

  return (
    <div className="history-page">
        <Navbar />
      <header className="history-header">
        <h1>Match History</h1>
      </header>
      <div className="history-list">
        {matches
          .slice()
          .reverse()
          .map((match, index) => {
            const inning1Data = inningsData[match.inning_1] || {};
            const inning2Data = inningsData[match.inning_2] || {};

            return (
              <div key={index} className="match-card">
                <div className="match-header">
                  <span>{formatDate(inning1Data.date)}</span>
                </div>
                <div className="match-teams">
                  <div className="team">
                    <div className="team-icon">
                      {winnerTeams[inning1Data.batting_team] &&
                      typeof winnerTeams[inning1Data.batting_team] ===
                        "string" &&
                      winnerTeams[inning1Data.batting_team].trim() !== ""
                        ? winnerTeams[inning1Data.batting_team]
                            .charAt(0)
                            .toUpperCase()
                        : "Icon"}
                    </div>

                    <span className="team-name">
                      {winnerTeams[inning1Data.batting_team] || "Team 1"}
                    </span>
                  </div>
                  <div className="score-info">
                    <span className="team-score">
                      {inning1Data.batting_team_score}/
                      {inning1Data.batting_team_wicket || 0}
                    </span>
                    <span className="overs">
                      ({inning1Data.over_done || 0} overs)
                    </span>
                  </div>
                  <div className="team">
                    <div className="team-icon">
                      {winnerTeams[inning2Data.batting_team] &&
                      typeof winnerTeams[inning2Data.batting_team] ===
                        "string" &&
                      winnerTeams[inning2Data.batting_team].trim() !== ""
                        ? winnerTeams[inning2Data.batting_team]
                            .charAt(0)
                            .toUpperCase()
                        : "Icon"}
                    </div>

                    <span className="team-name">
                      {winnerTeams[inning2Data.batting_team] || "Team 2"}
                    </span>
                  </div>
                  <div className="score-info">
                    <span className="team-score">
                      {inning2Data.batting_team_score}/
                      {inning2Data.batting_team_wicket || 0}
                    </span>
                    <span className="overs">
                      ({inning2Data.over_done || 0} overs)
                    </span>
                  </div>
                </div>
                <div className="match-result">
                  <p>Winner: {winnerTeams[match.result] || "Fetching..."}</p>
                </div>
                <div className="match-actions">
                  <button
                    className="resume-btn"
                    onClick={() => handleMatchClick(match.id)}
                  >
                    Scoreboard
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteMatch(match.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default History;
