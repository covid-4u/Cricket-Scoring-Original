import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/SetPlayer.css";

const SetPlayer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { matchId, inning1Id, target = null } = location.state || {};
  const [battingTeam, setBattingTeam] = useState(null);
  const [bowlingTeam, setBowlingTeam] = useState(null);
  const [battingPlayers, setBattingPlayers] = useState([]);
  const [bowlingPlayers, setBowlingPlayers] = useState([]);
  const [strikeBatsman, setStrikeBatsman] = useState(null); // Initialize as null
  const [nonStrikeBatsman, setNonStrikeBatsman] = useState(null); // Initialize as null
  const [bowler, setBowler] = useState(null); // Initialize as null

  useEffect(() => {
    if (matchId) {
      api
        .get(`matches/${matchId}/`)
        .then((response) => {
          const battingTeam = response.data.batting_team;
          const bowlingTeam = response.data.bowling_team;

          console.log(battingTeam);
          console.log(bowlingTeam);

          setBattingTeam(battingTeam);
          setBowlingTeam(bowlingTeam);

          return Promise.all([
            api.get(`/players/?team=${battingTeam}`),
            api.get(`/players/?team=${bowlingTeam}`),
          ]);
        })
        .then(([battingPlayersResponse, bowlingPlayersResponse]) => {
          setBattingPlayers(battingPlayersResponse.data);
          setBowlingPlayers(bowlingPlayersResponse.data);
          console.log(battingPlayersResponse.data);
          console.log(bowlingPlayersResponse.data);
          console.log(inning1Id);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [matchId]);

  const getFilteredPlayer = (selectedPlayer) => {
    return battingPlayers.filter((player) => player.id !== selectedPlayer?.id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (strikeBatsman && nonStrikeBatsman && bowler) {
      navigate(`/update-score/`, {
        state: {
          battingTeam: battingTeam,
          bowlingTeam: bowlingTeam,
          matchId: matchId,
          inning1Id: inning1Id || null,
          strikeBatsman: strikeBatsman,
          nonStrikeBatsman: nonStrikeBatsman,
          bowler: bowler,
          target: target,
        },
      });
    } else {
      alert("Please fill out all fields!");
    }
  };

  return (
    <>
      <div className="container">
        <div>
          <h2 className="title">Set Players</h2>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label className="label">Select Strike Batsman</label>
              <select
                name="striker"
                id="striker"
                value={strikeBatsman?.id || ""} // Controlled value
                onChange={(e) => {
                  const selectedPlayer = battingPlayers.find(
                    (player) => player.id === parseInt(e.target.value)
                  );
                  setStrikeBatsman(selectedPlayer);

                  if (
                    selectedPlayer &&
                    selectedPlayer.id === nonStrikeBatsman?.id
                  ) {
                    setNonStrikeBatsman(null);
                  }
                }}
              >
                <option value="">Select a striker</option>
                {getFilteredPlayer(nonStrikeBatsman).map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="label">Select Non-Strike Batsman</label>
              <select
                name="non-striker"
                id="non-striker"
                value={nonStrikeBatsman?.id || ""} // Controlled value
                onChange={(e) => {
                  const selectedPlayer = battingPlayers.find(
                    (player) => player.id === parseInt(e.target.value)
                  );
                  setNonStrikeBatsman(selectedPlayer);

                  if (
                    selectedPlayer &&
                    selectedPlayer.id === strikeBatsman?.id
                  ) {
                    setStrikeBatsman(null);
                  }
                }}
              >
                <option value="">Select a non-striker</option>
                {getFilteredPlayer(strikeBatsman).map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="label">Select Opening Bowler</label>
              <select
                name="bowler"
                id="bowler"
                value={bowler?.id || ""}
                onChange={(e) => {
                  const selectedPlayer = bowlingPlayers.find(
                    (player) => player.id === parseInt(e.target.value)
                  );
                  setBowler(selectedPlayer);
                }}
              >
                <option value="">Select a bowler</option>
                {bowlingPlayers.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="button">
              Set Players
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SetPlayer;
