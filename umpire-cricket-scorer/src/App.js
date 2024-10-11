import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Teams from "./pages/Teams";
import Players from "./pages/Players";
import Match from "./pages/Match";
import LiveScore from "./pages/LiveScore";
import SetPlayer from "./pages/SetPlyayer";
import Inning from "./pages/Inning";
import History from "./pages/History";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/teamstats" element={<Teams />} />
          <Route path="/players" element={<Players />} />
          <Route path="/matches" element={<Match />} />
          <Route path="/setplayer" element={<SetPlayer />} />
          <Route path="/update-score" element={<LiveScore />} />
          <Route path="/inning" element={<Inning />} />
          <Route path="/history" element={<History />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
