import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:8000/api/",
  baseURL: "http://127.0.0.1:8000/api/",
});

// export const fetchTeams = () => API.get("teams/"); NOT REQUIRE
export const fetchPlayers = () => API.get("players/");
export const fetchMatches = () => API.get("matches/");
export const fetchUmpires = () => API.get("umpires/");
export const fetchScores = () => API.get("scores/");
export const fetchTeamStats = () => API.get("teamstats/");
export const updateBallScore = async (ballData) => {
  try {
    // POST request to add a new ball or PUT request to update
    const response = await API.post("update-score/", ballData);
    console.log("Ball data updated:", response.data);
  } catch (error) {
    console.error(
      "Error updating ball score:",
      error.response ? error.response.data : error.message
    );
  }
};

export default API;
