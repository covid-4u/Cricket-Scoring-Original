import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Inning.css";

function Inning() {
  const location = useLocation();
  const { inning1Id } = location.state || { inning1Id: 24 };
  const navigate = useNavigate();

  const [firstInning, setFirstInning] = useState(null);
  const [firstInningBatsmen, setFirstInningBatsmen] = useState([]);
  const [firstInningBowler, setFirstInningBowler] = useState([]);
  const [secondInning, setSecondInning] = useState(null);
  const [secondInningBatsmen, setSecondInningBatsmen] = useState([]);
  const [secondInningBowler, setSecondInningBowler] = useState([]);
  const [winnerTeam, setWinnerTeam] = useState(null);
  const [winnerTeamData, setWinnerTeamData] = useState(null);

  // Team 1 State Variables
  const [team1, setTeam1] = useState({ name: "" });
  const [team1TotalScore, setTeam1TotalScore] = useState(0);
  const [team1TotalWickets, setTeam1TotalWickets] = useState(0);
  const [team1Over, setTeam1Over] = useState(0);
  const [team1Date, setTeam1Date] = useState("");
  const [team1TotalOvers, setTeam1TotalOvers] = useState(0);
  const [team1ExtraRuns, setTeam1ExtraRuns] = useState(0);

  // Team 2 State Variables
  const [team2, setTeam2] = useState({ name: "" });
  const [team2TotalScore, setTeam2TotalScore] = useState(0);
  const [team2TotalWickets, setTeam2TotalWickets] = useState(0);
  const [team2Over, setTeam2Over] = useState(0);
  const [team2ExtraRuns, setTeam2ExtraRuns] = useState(0);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch innings data
        const response = await api.get(`innings/${inning1Id}`);
        const firstInningId = response.data.inning_1;
        const secondInningId = response.data.inning_2;

        // Set inning IDs and winner team
        setFirstInning(firstInningId);
        setSecondInning(secondInningId);
        const winner = response.data.result; // Get the winner team ID
        setWinnerTeam(winner);

        // Fetch statistics for both innings
        const [batsmen1, bowlers1, batsmen2, bowlers2, match1, match2] =
          await Promise.all([
            api.get(`batsmanstats/?match=${firstInningId}`),
            api.get(`bowlerstats/?match=${firstInningId}`),
            api.get(`batsmanstats/?match=${secondInningId}`),
            api.get(`bowlerstats/?match=${secondInningId}`),
            api.get(`matches/${firstInningId}/`),
            api.get(`matches/${secondInningId}/`),
          ]);

        // Set statistics data
        setFirstInningBatsmen(batsmen1.data);
        setFirstInningBowler(bowlers1.data);
        setSecondInningBatsmen(batsmen2.data);
        setSecondInningBowler(bowlers2.data);

        // Extract team IDs from match data
        const team1Id = match1.data.batting_team;
        const team2Id = match1.data.bowling_team;

        // Set team stats
        setTeam1TotalScore(match1.data.batting_team_score);
        setTeam1TotalWickets(match1.data.batting_team_wicket);
        setTeam1Over(match1.data.over_done);
        setTeam1Date(match1.data.date);
        setTeam1TotalOvers(match1.data.total_overs);
        setTeam1ExtraRuns(match1.data.batting_team_extra_runs);

        setTeam2TotalScore(match2.data.batting_team_score);
        setTeam2TotalWickets(match2.data.batting_team_wicket);
        setTeam2Over(match2.data.over_done);
        setTeam2ExtraRuns(match2.data.batting_team_extra_runs);

        // Fetch team stats using the extracted team IDs
        const [team1Response, team2Response, winnerTeamResponse] =
          await Promise.all([
            api.get(`teamstats/${team1Id}/`),
            api.get(`teamstats/${team2Id}/`),
            winner
              ? api.get(`teamstats/${winner}/`)
              : Promise.resolve({ data: {} }), // Check if winner exists
          ]);

        // Set team data
        setTeam1(team1Response.data);
        setTeam2(team2Response.data);
        setWinnerTeamData(winnerTeamResponse.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDetails();
  }, [inning1Id]);

  return (
    <>
      <div className="scoreboard-container">
        <div className="header">
          <button className="back-button" onClick={() => navigate("/")}>
            Home
          </button>
          <h2>
            {team1.name} v/s {team2.name}
          </h2>
        </div>
        <div className="winner-container">
          <div className="winner-name">
            Winner: {winnerTeamData ? winnerTeamData.name : "Loading..."}
          </div>
        </div>
        <div className="score-summary">
          <div className="team-name">{team1.name}</div>
          <div className="score">
            {team1TotalScore}-{team1TotalWickets} ({team1Over}/{team1TotalOvers}
            ){(team1TotalScore / team1Over).toFixed(2)}
          </div>
        </div>
        <div className="grid-row">
          <div className="grid-column">
            <table className="score-table">
              <thead>
                <tr>
                  <th>Batsman</th>
                  <th>R</th>
                  <th>B</th>
                  <th>4s</th>
                  <th>6s</th>
                  <th>SR</th>
                </tr>
              </thead>
              <tbody>
                {firstInningBatsmen.map((player) => (
                  <React.Fragment key={player.id}>
                    <tr>
                      <td>
                        {player.name}
                        <br />
                        <div className="out-player">
                          {player.isOut && (
                            <>
                              {` b ${player.outBy} ${
                                player.outType === "hit_wicket"
                                  ? "hit wicket"
                                  : player.outType === "retired"
                                  ? "retired"
                                  : player.outType === "obstructing_the_field"
                                  ? "obstructing the field"
                                  : player.outType === "handled_the_ball"
                                  ? "handled the ball"
                                  : player.outType === "hit_the_ball_twice"
                                  ? "hit the ball twice"
                                  : player.outType === "timed_out"
                                  ? "timed out"
                                  : player.outType === "caught"
                                  ? `c ${player.caughtBy}`
                                  : player.outType === "run_out"
                                  ? `run out ${player.caughtBy}`
                                  : player.outType === "stumped"
                                  ? `stumped ${player.caughtBy}`
                                  : player.outType === "LBW"
                                  ? "lbw"
                                  : ""
                              }`}
                            </>
                          )}
                        </div>
                      </td>
                      <td>{player.runs}</td>
                      <td>{player.balls_faced}</td>
                      <td>{player.fours}</td>
                      <td>{player.sixes}</td>
                      <td>{player.strike_rate.toFixed(2)}</td>
                    </tr>
                  </React.Fragment>
                ))}
                <tr>
                  <td>Total:</td>
                  <td colSpan={2}>{team1TotalScore}</td>
                  <td>Extras:</td>
                  <td colSpan={2}>{team1ExtraRuns}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid-column">
            <table className="score-table">
              <thead>
                <tr>
                  <th>Bowler</th>
                  <th>O</th>
                  <th>M</th>
                  <th>R</th>
                  <th>W</th>
                  <th>ER</th>
                </tr>
              </thead>
              <tbody>
                {firstInningBowler.map((player) => (
                  <tr key={player.id}>
                    <td>{player.name}</td>
                    <td>{player.over}</td>
                    <td>{player.dot_balls}</td>
                    <td>{player.runs_given}</td>
                    <td>{player.wickets}</td>
                    <td>{player.economy_rate.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="score-summary">
          <div className="team-name">{team2.name}</div>
          <div className="score">
            {team2TotalScore}-{team2TotalWickets} ({team2Over}/{team1TotalOvers}
            ){(team2TotalScore / team2Over).toFixed(2)}
          </div>
        </div>
        <div className="grid-row">
          <div className="grid-column">
            <table className="score-table">
              <thead>
                <tr>
                  <th>Batsman</th>
                  <th>R</th>
                  <th>B</th>
                  <th>4s</th>
                  <th>6s</th>
                  <th>SR</th>
                </tr>
              </thead>
              <tbody>
                {secondInningBatsmen.map((player) => (
                  <tr key={player.id}>
                    <td>
                      {player.name}
                      <br />
                      <div className="out-player">
                        {player.isOut && (
                          <>
                            {` b ${player.outBy} ${
                              player.outType === "hit_wicket"
                                ? "hit wicket"
                                : player.outType === "retired"
                                ? "retired"
                                : player.outType === "obstructing_the_field"
                                ? "obstructing the field"
                                : player.outType === "handled_the_ball"
                                ? "handled the ball"
                                : player.outType === "hit_the_ball_twice"
                                ? "hit the ball twice"
                                : player.outType === "timed_out"
                                ? "timed out"
                                : player.outType === "caught"
                                ? `c ${player.caughtBy}`
                                : player.outType === "run_out"
                                ? `run out ${player.caughtBy}`
                                : player.outType === "stumped"
                                ? `stumped ${player.caughtBy}`
                                : player.outType === "LBW"
                                ? "lbw"
                                : ""
                            }`}
                          </>
                        )}
                      </div>
                    </td>
                    <td>{player.runs}</td>
                    <td>{player.balls_faced}</td>
                    <td>{player.fours}</td>
                    <td>{player.sixes}</td>
                    <td>{player.strike_rate.toFixed(2)}</td>
                  </tr>
                ))}
                <tr>
                  <td>Total:</td>
                  <td colSpan={2}>{team2TotalScore}</td>
                  <td>Extras:</td>
                  <td colSpan={2}>{team2ExtraRuns}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="grid-column">
            <table className="score-table">
              <thead>
                <tr>
                  <th>Bowler</th>
                  <th>O</th>
                  <th>M</th>
                  <th>R</th>
                  <th>W</th>
                  <th>ER</th>
                </tr>
              </thead>
              <tbody>
                {secondInningBowler.map((player) => (
                  <tr key={player.id}>
                    <td>{player.name}</td>
                    <td>{player.over}</td>
                    <td>{player.dot_balls}</td>
                    <td>{player.runs_given}</td>
                    <td>{player.wickets}</td>
                    <td>{player.economy_rate.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Inning;
