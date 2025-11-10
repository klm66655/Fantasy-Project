import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./HomePage.css";
import Header from "../components/HeaderLogin";
import Footer from "../components/FooterLogin";

export default function HomePage() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Za modal
  const [showModal, setShowModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamStadium, setNewTeamStadium] = useState('');
  const [newTeamManager, setNewTeamManager] = useState('');
  const [newTeamFounded, setNewTeamFounded] = useState('');
  const [newTeamLogo, setNewTeamLogo] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTeams();
    checkAdmin();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('http://localhost:8080/teams');
      if (!response.ok) throw new Error('Failed to fetch teams');
      const data = await response.json();
      setTeams(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const checkAdmin = () => {
    if (!token) return;
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log("Payload:", payload);

    if (payload.roles && payload.roles.includes("ADMIN")) {
      setIsAdmin(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleTeamClick = (teamId) => {
    navigate(`/teams/${teamId}`);
  };

  const handleAddTeamSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newTeamName,
          stadium: newTeamStadium,
          manager: newTeamManager,
          founded: newTeamFounded,
          logo_url: newTeamLogo
        })
      });

      if (!response.ok) throw new Error('Failed to add team');

      // Reset forme i zatvori modal
      setShowModal(false);
      setNewTeamName('');
      setNewTeamStadium('');
      setNewTeamManager('');
      setNewTeamFounded('');
      setNewTeamLogo('');

      fetchTeams(); // osveži listu timova
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteTeam = async (teamId, teamName, e) => {
    e.stopPropagation(); // sprečava da se aktivira handleTeamClick

    const confirmDelete = window.confirm(`Are you sure you want to delete ${teamName}?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/teams/${teamId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete team');

      alert('Team deleted successfully!');
      fetchTeams(); // osveži listu timova
    } catch (err) {
      alert(err.message);
    }
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
          {token && (
            <button onClick={handleLogout} className="action-btn logout-btn">
              Logout
            </button>
          )}
        </div>
        </div>

      {error && <div className="error">{error}</div>}

      <div className="teams-section">
        <h2 className="section-title">Choose Your Team</h2>

        {isAdmin && (
          <div className="admin-section">
            <button className="add-btn" onClick={() => setShowModal(true)}>
              Add Team
            </button>
          </div>
        )}

        <div className="teams-grid">
          {teams.map((team) => (
            <div
              key={team.id}
              className="team-card"
              onClick={() => handleTeamClick(team.id)}
            >
              {isAdmin && (
                <button
                  className="delete-btn"
                  onClick={(e) => handleDeleteTeam(team.id, team.name, e)}
                  title="Delete team"
                >
                  ✕
                </button>
              )}
              <div className="team-card-inner">
                <div className="team-logo">
                  {team.logo_url ? (
                    <img src={team.logo_url} alt={team.name} />
                  ) : (
                    <span className="team-logo-placeholder">⚽</span>
                  )}
                </div>
                <h3 className="team-name">{team.name}</h3>
                <p className="team-info">Stadium: {team.stadium || 'N/A'}</p>
                <p className="team-info">Manager: {team.manager || 'N/A'}</p>
                <p className="team-info">Founded: {team.founded || 'N/A'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal za dodavanje tima */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add New Team</h2>
            <form onSubmit={handleAddTeamSubmit} className="modal-form">
              <input
                type="text"
                placeholder="Team Name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Stadium"
                value={newTeamStadium}
                onChange={(e) => setNewTeamStadium(e.target.value)}
              />
              <input
                type="text"
                placeholder="Manager"
                value={newTeamManager}
                onChange={(e) => setNewTeamManager(e.target.value)}
              />
              <input
                type="text"
                placeholder="Founded"
                value={newTeamFounded}
                onChange={(e) => setNewTeamFounded(e.target.value)}
              />
              <input
                type="text"
                placeholder="Logo URL"
                value={newTeamLogo}
                onChange={(e) => setNewTeamLogo(e.target.value)}
              />

              <div className="modal-buttons">
                <button type="submit" className="add-btn">Add Team</button>
                <button type="button" className="logout-btn" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}