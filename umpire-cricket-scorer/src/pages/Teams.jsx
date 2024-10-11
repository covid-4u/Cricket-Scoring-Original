import React, { useEffect, useState } from "react";
import api, { fetchTeamStats } from "../services/api";
import "../styles/Teams.css";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [showAddTeamInput, setShowAddTeamInput] = useState(false); // State to toggle add team input bar
  const route = "teamstats/";

  useEffect(() => {
    fetchTeamStats().then((response) => setTeams(response.data));
  }, []);

  const handleDeleteTeam = (id) => {
    if (window.confirm("Are you sure you want to delete this match?")) {
      api
        .delete(`${route}${id}/`)
        .then(() => setTeams(teams.filter((team) => team.id !== id)))
        .catch((error) => console.error("Error deleting team:", error));
    }
  };

  const handleAddTeam = () => {
    // Check if a team with the same name already exists
    const teamExists = teams.some(
      (team) => team.name.toLowerCase() === newTeam.toLowerCase()
    );

    if (teamExists) {
      alert("Team with this name already exists.");
      return;
    }

    if (newTeam.trim() === "") {
      alert("Please Enter Team Name");
      return;
    }

    alert("Please add 11 players in recently added team");
    api
      .post(route, { name: newTeam })
      .then((response) => {
        setTeams([...teams, response.data]);
        setNewTeam("");
        setShowAddTeamInput(false);
      })
      .catch((error) => {
        console.error("Error adding team:", error);
      });
  };

  // Filtered teams based on search term
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="teams-container">
        <Navbar />
        <header className="teams-header">
          <h1>Teams</h1>
          <div className="teams-header-controls">
            <input
              type="text"
              className="teams-search-bar"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="add-team-button"
              onClick={() => setShowAddTeamInput(!showAddTeamInput)}
            >
              +Add Team
            </button>
          </div>
        </header>
        {showAddTeamInput && (
          <div className="teams-addteam">
            <input
              type="text"
              value={newTeam}
              onChange={(e) => setNewTeam(e.target.value)}
              placeholder="New team name"
            />
            <button onClick={handleAddTeam}>Submit</button>
          </div>
        )}
        <main className="teams-main">
          <div className="teams-list">
            <ul>
              {filteredTeams.map((team) => (
                <li key={team.id}>
                  <div className="faq-container">
                    <div className="faq-item">
                      <input
                        type="checkbox"
                        id={team.id}
                        className="faq-checkbox"
                      />
                      <label htmlFor={team.id} className="faq-question">
                        {team.name}
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteTeam(team.id)}
                        >
                          Delete
                        </button>
                      </label>
                      <div className="faq-answer">
                        <div className="stat-box">
                          <b> Matches: </b> {team.matches_played}
                        </div>
                        <div className="stat-box">
                          <b> Won: </b> {team.wins}
                        </div>
                        <div className="stat-box">
                          <b> Lost: </b> {team.losses}
                        </div>
                        <div className="stat-box">
                          <b> Win : </b> {team.win_percentage}%
                        </div>
                        <div className="stat-box">
                          <Link
                            to={{
                              pathname: `/players`,
                            }}
                            state={{ teamId: team.id }}
                          >
                            <b>Players</b>
                          </Link>
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
    </>
  );
};

export default Teams;
