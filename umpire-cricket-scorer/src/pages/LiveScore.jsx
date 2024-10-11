import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api, { updateBallScore } from "../services/api";
import "../styles/LiveScore.css";
function LiveScore() {
  const location = useLocation();
  const {
    matchId,
    inning1Id,
    battingTeam,
    bowlingTeam,
    strikeBatsman,
    nonStrikeBatsman,
    bowler,
    target,
  } = location.state || {};
  const navigate = useNavigate();
  const [strikeBatsmanStats, setStrikeBatsmanStats] = useState(null);
  const [nonStrikeBatsmanStats, setNonStrikeBatsmanStats] = useState(null);
  const [bowlerStats, setBowlerStats] = useState(null);
  const [totalScore, setTotalScore] = useState(0);
  const [totalWickets, setTotalWickets] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [overs, setOver] = useState();
  const [status, setStatus] = useState();
  const [totalOvers, setTotalOvers] = useState();
  const [totalBalls, setTotalBalls] = useState();
  const [extraRuns, setExtraRuns] = useState();
  const [date, setDate] = useState();
  const [currentBatsman, setCurrentBatsman] = useState();
  const [runs, setRuns] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [summry, setIsSummry] = useState(false);
  const [batting_team, setBatingTeam] = useState();
  const [bowling_team, setBowlingTeam] = useState();

  const [wicket, setWicket] = useState(false);
  const [byes, setByes] = useState(false);
  const [noBall, setNoBall] = useState(false);
  const [wide, setWide] = useState(false);
  const [legByes, setLegByes] = useState(false);
  const [trackBall, setTrackBall] = useState([]);
  const [run, setRun] = useState(0);
  const [isScoring, setIsScoing] = useState(true);
  const [result, setResult] = useState(false);
  const [winner, setWinner] = useState(null);
  const [inning, setInning] = useState(1);
  const [overComplete, setOverCompele] = useState(false);

  const [allBowlers, setAllbowlers] = useState([]);
  const [goneBatsmen, setGoneBatsmen] = useState([]);
  const [allBatsmen, setAllBatsmen] = useState([]);
  const [goneBowler, setGoneBowler] = useState([]);

  const [isSelectingBowler, setIsSelectingBowler] = useState(false);
  const [nextBowler, setNextBowler] = useState(null);

  const [isReplacingStrikeBatsman, setIsReplacingStrikeBatsman] =
    useState(false);
  const [isSelectingBatsman, setIsSelectingBatsman] = useState(false);
  const [nextBatsman, setNextBatsman] = useState(null);
  const [outType, setOutType] = useState("");
  const [playerInvolved, setPlayerInvolved] = useState("");
  const [winnerTeam1, setWinnerTeam] = useState();
  const [allOut, setAllout] = useState(false);

  useEffect(() => {
    const postData = async () => {
      if (strikeBatsman && nonStrikeBatsman && bowler && matchId) {
        try {
          await api.post("batsmanstats/", {
            player: strikeBatsman.id,
            match: matchId,
            team: battingTeam,
            name: strikeBatsman.name,
          });

          await api.post("batsmanstats/", {
            player: nonStrikeBatsman.id,
            match: matchId,
            team: battingTeam,
            name: nonStrikeBatsman.name,
          });

          await api.post("bowlerstats/", {
            player: bowler.id,
            match: matchId,
            team: bowlingTeam,
            name: bowler.name,
          });

          await api.get(`matches/${matchId}`).then((response) => {
            setInning(response.data.inning);
          });

          // Fetch the stats after posting
          await initialFetchStats();
          await fatchList();
        } catch (err) {
          console.error("Error posting data:", err);
        }
      }
    };
    postData();
    api
      .get(`teamstats/${battingTeam}`)
      .then((response) => {
        setBatingTeam(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    api
      .get(`teamstats/${bowlingTeam}`)
      .then((response) => {
        setBowlingTeam(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [matchId]);

  const initialFetchStats = async () => {
    try {
      const batsmanStatsResponse = await api.get(
        `batsmanstats/?match=${matchId}`
      );
      const strikeStats = batsmanStatsResponse.data.find(
        (item) => item.player === strikeBatsman?.id
      );
      const nonStrikeStats = batsmanStatsResponse.data.find(
        (item) => item.player === nonStrikeBatsman?.id
      );

      setStrikeBatsmanStats(strikeStats);
      setNonStrikeBatsmanStats(nonStrikeStats);
      setCurrentBatsman(strikeStats);

      const bowlerStatsResponse = await api.get(
        `bowlerstats/?match=${matchId}`
      );
      const bowlerData = bowlerStatsResponse.data.find(
        (item) => item.player === bowler?.id
      );

      setBowlerStats(bowlerData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      fatchTeamStats();
      setIsLoading(false);
    }
  };

  const fatchList = async () => {
    api
      .get(`players/?team=${bowlingTeam}`)
      .then((response) => {
        setAllbowlers(response.data);
        api.get(`bowlerstats/?match=${matchId}`).then((response1) => {
          // const goneBatsmen = ;
          setGoneBowler(response1.data);
        });
      })
      .catch((err) => {
        console.error(err);
      });
    api
      .get(`players/?team=${battingTeam}`)
      .then((response) => {
        const allPlayers = response.data;
        api.get(`batsmanstats/?match=${matchId}`).then((response1) => {
          // const goneBatsmen = ;
          setGoneBatsmen(response1.data);
          const remainingPlayers = allPlayers.filter(
            (player) =>
              !goneBatsmen.some((batsman) => batsman.player === player.id)
          );
          setAllBatsmen(remainingPlayers);
        });
      })
      .catch((err) => {
        console.error(err);
      });
    setIsLoading(false);
  };

  const changeBowler = async (e) => {
    e.preventDefault();

    if (!nextBowler) {
      alert("Please select a bowler before submitting.");
      return;
    }

    try {
      await api
        .post("bowlerstats/", {
          player: nextBowler.id,
          match: matchId,
          team: bowlingTeam,
          name: nextBowler.name,
        })
        .then(() => {
          api
            .get(`bowlerstats/?player=${nextBowler.id}&match=${matchId}`)
            .then((response) => {
              setBowlerStats(response.data[0]);
              // console.log(response.data[0]);
            })
            .catch((err) => {
              console.error("next bowler " + err);
            });
        });

      // Update the state with the new bowler
      setNextBowler(null); // Clear the next bowler state
      setIsSelectingBowler(false);
      if (!isSelectingBatsman) {
        setIsScoing(true);
      }
    } catch (error) {
      console.error("Error changing bowler:", error);
    }
  };

  const changeBatsman = async () => {
    if (!nextBatsman) {
      alert("Please select a batsman before submitting.");
      return;
    }

    try {
      await api
        .post("batsmanstats/", {
          player: nextBatsman.id,
          match: matchId,
          team: battingTeam,
          name: nextBatsman.name,
        })
        .then(async () => {
          // Fetch the updated batsman stats for the new batsman
          const response = await api.get(
            `batsmanstats/?player=${nextBatsman.id}&match=${matchId}`
          );

          const newBatsmanStats = response.data[0];
          // Check if the new batsman should be the strike or non-strike batsman
          if (isReplacingStrikeBatsman) {
            try {
              const data = {
                outType: outType,
                outBy: bowlerStats.name,
                caughtBy: playerInvolved,
              };
              const response = await api.patch(
                `/batsmanstats/${strikeBatsmanStats.id}/`,
                data
              );
            } catch (err) {
              console.error("Error updating batsman stats:", err);
            }
            setStrikeBatsmanStats(newBatsmanStats);
            if (
              run === 1 ||
              run === 3 ||
              (totalBalls !== 0) & (totalBalls % 6 === 0)
            ) {
              setCurrentBatsman(nonStrikeBatsmanStats);
            } else {
              setCurrentBatsman(newBatsmanStats);
            }
          } else {
            try {
              const data = {
                outType: outType,
                outBy: bowlerStats.name,
                caughtBy: playerInvolved,
              };
              const response = await api.patch(
                `/batsmanstats/${nonStrikeBatsmanStats.id}/`,
                data
              );
            } catch (err) {
              console.error("Error updating batsman stats:", err);
            }
            setNonStrikeBatsmanStats(newBatsmanStats);
            if (
              run === 1 ||
              run === 3 ||
              (totalBalls !== 0) & (totalBalls % 6 === 0)
            ) {
              setCurrentBatsman(strikeBatsmanStats);
            } else {
              setCurrentBatsman(newBatsmanStats);
            }
          }
          // Reset the form and close it
          setNextBatsman(null);
          setIsSelectingBatsman(false);
          if (!isSelectingBowler) {
            setIsScoing(true);
          }
        })
        .catch((err) => {
          console.error("Error fetching batsman stats: ", err);
        });
    } catch (error) {
      console.error("Error changing batsman:", error);
    }
  };

  const fatchstrikeBatsmanStats = async () => {
    try {
      await api
        .get(
          `batsmanstats/?match=${matchId}&player=${strikeBatsmanStats.player}`
        )
        .then((response) => {
          setStrikeBatsmanStats(response.data[0]);
          fatchList();
        });
    } catch (error) {
      console.error("Error updating strike batsman stats:", error);
    }
  };

  const fatchNonStrikeBatsmanStats = async () => {
    try {
      await api
        .get(
          `batsmanstats/?match=${matchId}&player=${nonStrikeBatsmanStats.player}`
        )
        .then((response) => {
          setNonStrikeBatsmanStats(response.data[0]);
          fatchList();
        });
    } catch (error) {
      console.error("Error updating non strike batsman stats:", error);
    }
  };

  const fatchBowlerStats = async () => {
    try {
      await api
        .get(`bowlerstats/?match=${matchId}&player=${bowlerStats.player}`)
        .then((response) => {
          setBowlerStats(response.data[0]);
          fatchList();
          // console.log(response.data);
        });
    } catch (error) {
      console.error("Error updating non strike batsman stats:", error);
    }
  };

  const fatchTeamStats = async () => {
    try {
      await api.get(`matches/${matchId}/`).then((response) => {
        setTotalScore(response.data.batting_team_score);
        setTotalWickets(response.data.batting_team_wicket);
        setOver(response.data.over_done);
        setStatus(response.data.match_status);
        setDate(response.data.date);
        setTotalOvers(response.data.total_overs);
        setTotalBalls(response.data.total_balls + 1);
        setExtraRuns(response.data.batting_team_extra_runs);
      });
    } catch (error) {
      console.error("Error updating non strike batsman stats:", error);
    }
  };

  const handleNoBall = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setNoBall(true);
      setWide(false);
      setByes(false);
      setLegByes(false);
      setWicket(false);
    } else {
      setNoBall(false);
    }
  };

  const handleByes = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setByes(true);
      setLegByes(false);
      setWide(false);
      setNoBall(false);
    } else {
      setByes(false);
    }
  };

  const handleLegByes = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setLegByes(true);
      setByes(false);
      setWide(false);
      setNoBall(false);
    } else {
      setLegByes(false);
    }
  };

  const handleWicket = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setWicket(true);
      setNoBall(false);
    } else {
      setWicket(false);
    }
  };

  const handleWide = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setWide(true);
      setNoBall(false);
      setByes(false);
      setLegByes(false);
    } else {
      setWide(false);
    }
  };
  const swapBatsman = async () => {
    if (currentBatsman.id === strikeBatsmanStats.id) {
      setCurrentBatsman(nonStrikeBatsmanStats);
    } else {
      setCurrentBatsman(strikeBatsmanStats);
    }
  };

  const handleOverComplete = async () => {
    if (totalOvers - 0.5 <= overs) {
      setOverCompele(true);
      setIsScoing(false);
      return;
    } else {
      if ((totalBalls !== 0) & (totalBalls % 6 === 0)) {
        setTrackBall([]);
        setIsScoing(false);
        setIsSelectingBowler(true);
        swapBatsman();
      }
    }
  };

  const handleWinner = async () => {
    var winnerTeam;
    if (totalScore >= target - 1) {
      winnerTeam = battingTeam;
    } else if (totalScore === target) {
      winnerTeam = null;
    } else {
      winnerTeam = bowlingTeam;
    }
    api.get(`/teamstats/${winnerTeam}`).then((response1) => {
      setWinner(response1.data);
    });
    setWinnerTeam(winnerTeam);
    const goat = { result: winnerTeam };
    api
      .patch(`/innings/${inning1Id}/`, goat)
      .then((response) => {})
      .catch((err) => {
        console.log(err);
      });
  };

  const handleScoring = useCallback(
    async (runsScored) => {
      if (runsScored < 0) return;

      // Update runs
      await setRun(runsScored);

      // Prepare ball object
      const ball = {
        match: matchId,
        batting_team: battingTeam,
        bowling_team: bowlingTeam,
        batsman: currentBatsman.id,
        runs: runsScored,
        is_wicket: wicket,
        is_byes: byes,
        is_legbyes: legByes,
        is_noball: noBall,
        is_wide: wide,
        extra_runs: 0,
        bowler: bowlerStats.id,
      };
      await updateBallScore(ball);

      // Update track ball based on the type of delivery
      setTrackBall((prevTrackBall) => [
        ...prevTrackBall,
        wide
          ? "wd" + runsScored
          : noBall
          ? "nb" + runsScored
          : byes
          ? "by" + runsScored
          : legByes
          ? "lb" + runsScored
          : wicket
          ? "W" + runsScored
          : runsScored,
      ]);

      // Swap batsman if runs scored is 1 or 3
      if (runsScored === 1 || runsScored === 3) {
        await swapBatsman();
      }

      // Update wicket count and state
      if (wicket) {
        await handleWickets(wicket, totalWickets);
      }

      // Fetch updated stats
      await fatchTeamStats();
      await fatchstrikeBatsmanStats();
      await fatchBowlerStats();
      await fatchNonStrikeBatsmanStats();

      // Uncheck all checkboxes after ball update
      setWide(false);
      setNoBall(false);
      setByes(false);
      setLegByes(false);
      setWicket(false);
      if (inning === 2) {
        if (
          totalScore >= target - 1 ||
          overs >= totalOvers - 0.5 ||
          totalWickets > 9
        ) {
          handleWinner();
          setTimeout(() => {
            setResult(true);
            setIsScoing(false);
            setIsSelectingBatsman(false);
            setIsSelectingBowler(false);
            setIsSummry(false);
          }, 50);
        }
      }
      // Handle over completion
      await handleOverComplete();
      await fatchList();
    },
    [
      runs,
      totalScore,
      totalWickets,
      currentBatsman,
      strikeBatsmanStats,
      nonStrikeBatsmanStats,
      bowlerStats,
      wide,
      wicket,
      byes,
      legByes,
      noBall,
      totalBalls,
      isReplacingStrikeBatsman,
      allBatsmen,
      allBowlers,
      allOut,
      run,
      inning,
      result,
      winner,
      goneBatsmen,
      overComplete,
      isScoring,
      isSelectingBatsman,
      isSelectingBowler,
      target,
      overs,
      totalOvers,
      winnerTeam1,
    ]
  );

  const handleWickets = async (wicket, totalWickets) => {
    if (wicket) {
      // Increment the wickets count
      setWickets((prev) => prev + 1);

      if (totalWickets < 9) {
        // Check if the current batsman is the strike batsman
        setIsReplacingStrikeBatsman(
          currentBatsman.id === strikeBatsmanStats.id
        );

        // Update state to stop scoring and start selecting a new batsman
        await setIsScoing(false);
        await setIsSelectingBatsman(true);
        return;
      }
      // Set all out state and update other related states
      setAllout(true);
      setIsScoing(false);
      setNextBatsman(false);
      setNextBowler(false);
    }
  };

  const handleNextInnings = () => {
    // Logic to start the next innings
    // alert("Next innings started!");
    const targeetGivenConst = totalScore + 1;
    api
      .post("/matches/", {
        total_overs: totalOvers,
        total_balls: 0,
        batting_team: bowlingTeam,
        bowling_team: battingTeam,
        inning: 2,
      })
      .then((response) => {
        const updatedMatch = response.data;
        console.log(inning1Id);
        console.log(updatedMatch.id);
        const updatedData = {
          inning_2: updatedMatch.id,
        };
        api.patch(`/innings/${inning1Id}/`, updatedData).catch((err) => {
          console.error(err);
        });
        navigate(`/setplayer/`, {
          state: {
            matchId: updatedMatch.id,
            inning1Id: inning1Id,
            target: targeetGivenConst,
          },
        });
      })
      .catch((error) => console.error("Error submitting match:", error));
    console.log("Next innings started!");
  };

  const handleSummry = async () => {
    setIsSummry(true);
    if (isScoring) {
      setIsScoing(false);
    }
    setIsSelectingBatsman(false);
    setIsSelectingBowler(false);
  };

  if (isLoading) {
    return <p>Loading data...</p>;
  }

  return (
    <>
      {/* ScoreBoard Section */}
      {isScoring && (
        <div className="app-container">
          <div className="score-board">
            <div className="team-info">
              <span className="live-text">
                <div className="live-indicator"></div>
                {status}
              </span>
              <span>CRR {(totalScore / overs).toFixed(2)} </span>
              {target && (
                <>
                  <span>
                    RR{" "}
                    {((target - totalScore) / (totalOvers - overs)).toFixed(2)}{" "}
                  </span>
                  <span className="remain">
                    {target - totalScore} runs need in{" "}
                    {(totalOvers - overs - 0.4).toFixed(1)} overs
                  </span>
                </>
              )}
            </div>

            <div className="score-info">
              <span className="score">
                {totalScore}-{totalWickets}
              </span>
              <span className="overs">
                ({overs}/{totalOvers})
              </span>
            </div>

            <div className="extra-runs">
              <div className="extra-runs-display">
                Extras: <span id="extra-runs-value">{extraRuns}</span>
                <br />
                {target && (
                  <>
                    Target: <span id="extra-runs-value">{target}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Batting Stats Section */}
          <div className="batting-stats">
            <table>
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
                <tr>
                  <td>
                    {currentBatsman.id === strikeBatsmanStats.id
                      ? `${strikeBatsmanStats.name}*`
                      : strikeBatsmanStats.name}
                  </td>
                  <td>{strikeBatsmanStats?.runs || "0"}</td>
                  <td>{strikeBatsmanStats?.balls_faced || "0"}</td>
                  <td>{strikeBatsmanStats?.fours || "0"}</td>
                  <td>{strikeBatsmanStats?.sixes || "0"}</td>
                  <td>
                    {strikeBatsmanStats?.strike_rate?.toFixed(2) || "0.00"}
                  </td>
                </tr>
                <tr>
                  <td>
                    {currentBatsman.id === nonStrikeBatsmanStats.id
                      ? `${nonStrikeBatsmanStats.name}*`
                      : nonStrikeBatsmanStats.name}
                  </td>
                  <td>{nonStrikeBatsmanStats?.runs || "0"}</td>
                  <td>{nonStrikeBatsmanStats?.balls_faced || "0"}</td>
                  <td>{nonStrikeBatsmanStats?.fours || "0"}</td>
                  <td>{nonStrikeBatsmanStats?.sixes || "0"}</td>
                  <td>
                    {nonStrikeBatsmanStats?.strike_rate?.toFixed(2) || "0.00"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bowling Stats Section */}
          <div className="bowling-stats">
            <table>
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
                <tr>
                  <td>{bowlerStats?.name || "Unknown"}</td>
                  <td>{bowlerStats?.over || "0.0"}</td>
                  <td>{bowlerStats?.dot_balls || "0"}</td>
                  <td>{bowlerStats?.runs_given || "0"}</td>
                  <td>{bowlerStats?.wickets || "0"}</td>
                  <td>{bowlerStats?.economy_rate?.toFixed(2) || "0"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Over Tracker Section */}
          <div className="over-tracker">
            <span>This over: </span>
            <div className="ball-track">
              {trackBall.map((run, index) => (
                <span key={index} className="ball">
                  {run}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="action-buttons">
            <div className="extras">
              <label>
                Wide:
                <input type="checkbox" checked={wide} onChange={handleWide} />
              </label>
              <label>
                No Ball:
                <input
                  type="checkbox"
                  checked={noBall}
                  onChange={handleNoBall}
                />
              </label>
              <label>
                Byes:
                <input type="checkbox" checked={byes} onChange={handleByes} />
              </label>
              <label>
                Leg Byes:
                <input
                  type="checkbox"
                  checked={legByes}
                  onChange={handleLegByes}
                />
              </label>
              <label>
                Wicket:
                <input
                  type="checkbox"
                  checked={wicket}
                  onChange={handleWicket}
                />
              </label>
            </div>
            <div className="secondary-buttons">
              <button onClick={handleSummry} className="summary-button">
                Get Summary
              </button>
              <button onClick={swapBatsman}>Swap Batsman</button>
              {/* <button>Partnerships</button> */}
            </div>
            <div className="run-buttons">
              <button onClick={() => handleScoring(0)}>0</button>
              <button onClick={() => handleScoring(1)}>1</button>
              <button onClick={() => handleScoring(2)}>2</button>
              <button onClick={() => handleScoring(3)}>3</button>
              <button onClick={() => handleScoring(4)}>4</button>
              <button onClick={() => handleScoring(6)}>6</button>
            </div>
          </div>
        </div>
      )}
      {isSelectingBowler && (
        <div className="change-container">
          <form className="change-bowler" onSubmit={changeBowler}>
            <label>
              Select Next Bowler:
              <select
                value={nextBowler?.id || ""}
                onChange={(e) => {
                  const selectedBowler = allBowlers.find(
                    (bowler) => bowler.id === parseInt(e.target.value)
                  );
                  setNextBowler(selectedBowler);
                }}
              >
                <option value="">Select</option>
                {allBowlers
                  .filter((bowler) => bowler.id !== bowlerStats.player)
                  .map((bowler) => (
                    <option key={bowler.id} value={bowler.id}>
                      {bowler.name}
                    </option>
                  ))}
              </select>
            </label>
            <button type="submit">Change Bowler</button>
          </form>
        </div>
      )}

      {isSelectingBatsman && (
        <div className="change-container">
          <form
            className="change-bowler"
            onSubmit={(e) => {
              e.preventDefault();
              changeBatsman();
            }}
          >
            <label htmlFor="outType">Select Out Type: </label>
            <select
              id="outType"
              value={outType}
              onChange={(event) => {
                setOutType(event.target.value);
                setPlayerInvolved("");
              }}
            >
              <option value="">Select Out Type</option>
              <option value="bowled">Bowled</option>
              <option value="caught">Caught</option>
              <option value="lbw">LBW</option>
              <option value="run_out">Run Out</option>
              <option value="stumped">Stumped</option>
              <option value="hit_wicket">Hit Wicket</option>
              <option value="retired">Retired</option>
              <option value="obstructing_the_field">
                Obstructing the Field
              </option>
              <option value="handled_the_ball">Handled the Ball</option>
              <option value="hit_the_ball_twice">Hit the Ball Twice</option>
              <option value="timed_out">Timed Out</option>
            </select>

            {(outType === "caught" ||
              outType === "run_out" ||
              outType === "stumped") && (
              <>
                <label htmlFor="playerInvolved">
                  {outType === "caught"
                    ? "Caught By: "
                    : outType === "run_out"
                    ? "Run Out By: "
                    : "Stumped By: "}
                </label>
                <select
                  id="playerInvolved"
                  value={playerInvolved}
                  onChange={(event) => {
                    setPlayerInvolved(event.target.value);
                  }}
                >
                  <option value="">Select Player</option>
                  <option value={bowlerStats.name}>{bowlerStats.name}</option>
                  {allBowlers
                    .filter((bowler) => bowler.id !== bowlerStats.player)
                    .map((bowler) => (
                      <option key={bowler.id} value={bowler.name}>
                        {bowler.name}
                      </option>
                    ))}
                </select>
              </>
            )}

            <label>
              Select New Batsman:
              <select
                value={nextBatsman?.id || ""}
                onChange={(e) => {
                  const selectedBatsman = allBatsmen.find(
                    (batsman) => batsman.id === parseInt(e.target.value)
                  );
                  setNextBatsman(selectedBatsman);
                }}
              >
                <option value="">Select</option>
                {allBatsmen
                  .filter(
                    (batsman) =>
                      !batsman.isOut &&
                      batsman.id !== strikeBatsmanStats.player &&
                      batsman.id !== nonStrikeBatsmanStats.player
                  )
                  .map((batsman) => (
                    <option key={batsman.id} value={batsman.id}>
                      {batsman.name}
                    </option>
                  ))}
              </select>
            </label>
            <button type="submit">Confirm Batsman</button>
          </form>
        </div>
      )}

      {(allOut || overComplete) && inning === 1 && (
        <div className="next-innings-container">
          <div className="innings-info">
            <h1>Next Innings</h1>
            <p className="target">
              Target: <span>{totalScore + 1}</span> runs
            </p>
            <p className="over">
              In <span>{totalOvers}</span> overs
            </p>
            <p className="over">
              RR : <span>{((totalScore + 1) / totalOvers).toFixed(2)}</span>
            </p>
            <button
              className="start-innings-button"
              onClick={handleNextInnings}
            >
              Start Next Innings
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="winning-team-page">
          <div className="overlay">
            <div className="content">
              <h1>Congratulations!</h1>
              <h2 className="team-name">{winner && winner.name}</h2>
              {/* <img src="" alt={`Logo`} className="team-logo" /> */}
              <p className="match-summary"></p>
              <div className="trophy-container">
                <button
                  onClick={() => {
                    navigate(`/inning`, { state: { inning1Id } });
                  }}
                  className="summary-button"
                >
                  Get Summary
                </button>
                {/* <img
                  src={trophyImage}
                  alt="Trophy"
                  className="trophy"
                /> */}
              </div>
            </div>
          </div>
        </div>
      )}
      {summry && (
        <>
          <div className="scoreboard-container">
            <div className="header">
              <button
                className="back-button"
                onClick={() => {
                  setIsSummry(false);
                  setIsScoing(true);
                }}
              >
                ←
              </button>
              <h2>
                {batting_team.name} v/s {bowling_team.name}
              </h2>
            </div>

            <div className="score-summary">
              <div className="team-name">{batting_team.name}</div>
              <div className="score">
                {totalScore}-{totalWickets} ({overs}){" "}
                {(totalScore / overs).toFixed(2)}
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
                    {goneBatsmen.map((player) => (
                      <>
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
                                      : player.outType ===
                                        "obstructing_the_field"
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
                      </>
                    ))}
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
                    {goneBowler.map((player) => (
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
      )}
    </>
  );
}

export default LiveScore;
