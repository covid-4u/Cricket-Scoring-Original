import React from "react";

function BowlerStats({ bowler }) {
  if (!bowler) {
    return (
      <div className="bowler">
        <h3>Bowler</h3>
        <p>Select a bowler</p>
      </div>
    );
  }

  return (
    <div className="bowler">
      <h3>Bowler</h3>
      <p>Name: {bowler.name}</p>
      <p>Overs: {bowler.overs}</p>
      <p>Dot Balls: {bowler.dotBalls}</p>
      <p>Runs Given: {bowler.runsGiven}</p>
      <p>Wickets: {bowler.wickets}</p>
      <p>Economy: {bowler.economy}</p>
    </div>
  );
}

export default BowlerStats;
