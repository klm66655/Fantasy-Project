import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TeamPage from "./pages/TeamPage";
import PlayerStatsPage from "./pages/PlayerStatsPage";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/teams/:id" element={<TeamPage />} />
        <Route path="/player/:id" element={<PlayerStatsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
