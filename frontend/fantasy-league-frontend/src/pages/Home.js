import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./HomePage.css";
import  Header  from "../components/HeaderLogin";
import Footer from "../components/FooterLogin";

export default function HomePage() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
  try {
    const response = await fetch('http://localhost:8080/teams'); // bez tokena
    
    if (!response.ok) throw new Error('Failed to fetch teams');
    
    const data = await response.json();
    setTeams(data);
    setLoading(false);
  } catch (err) {
    setError(err.message);
    setLoading(false);
  }
};


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleTeamClick = (teamId) => {
    navigate(`/teams/${teamId}`);
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading-spinner">⚽ Loading teams...</div>
      </div>
    );
  }

  return (
    <div className="home-container">
        <Header />
      <div className="home-header">
        <div className="hero-section">
          <h1 className="hero-title">Fantasy League</h1>
          <p className="hero-subtitle">
            Build your dream team, track stats, and compete with friends
          </p>
        </div>

        <div className="action-buttons">
          <button onClick={() => navigate('/players')} className="action-btn">
            View All Players
          </button>
          <button onClick={handleLogout} className="action-btn logout-btn">
            Logout
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="teams-section">
        <h2 className="section-title">Choose Your Team</h2>
        <div className="teams-grid">
          {teams.map((team) => (
            <div 
              key={team.id} 
              className="team-card"
              onClick={() => handleTeamClick(team.id)}
            >
              <div className="team-card-inner">
                <div className="team-logo">
                  {team.logo ? (
                    <img src={team.logo} alt={team.name} />
                  ) : (
                    <span className="team-logo-placeholder">⚽</span>
                  )}
                </div>
                <h3 className="team-name">{team.name}</h3>
                <p className="team-info">{team.league || 'Premier League'}</p>
                <div className="team-stats">
                  <span>Players: {team.playerCount || 0}</span>
                  <span>Rating: {team.rating || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}