import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TeamPage from "./pages/TeamPage";
import PlayerStatsPage from "./pages/PlayerStatsPage";
import ProfilePage from "./pages/ProfilePage";
import ViewPlayersPage from "./pages/ViewPlayersPage";
import HighlightsPage from './pages/HighlightsPage';
import AddHighlightPage from './pages/AddHighlightPage';





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
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/players" element={<ViewPlayersPage />} />
        <Route path="/highlights" element={<HighlightsPage />} />
        <Route path="/addhighlights" element={<AddHighlightPage />} />
        


      </Routes>
    </Router>
  );
}

export default App;
