import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ShortenerPage from "./pages/ShortenerPage";
import StatsPage from "./pages/StatsPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ShortenerPage />} />
        <Route path="/stats/:code" element={<StatsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
