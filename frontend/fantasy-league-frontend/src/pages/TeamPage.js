import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./TeamPage.css";
import { Link } from 'react-router-dom';
import Header from "../components/HeaderLogin";

export default function TeamPage() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    player: '',
    nation: '',
    pos: '',
    age: '',
    mp: '',
    starts: '',
    min: '',
    gls: '',
    ast: '',
    pk: '',
    crdy: '',
    crdr: '',
    xg: '',
    xag: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    checkAdmin();
    fetchTeamData();
  }, [id]);

  const checkAdmin = () => {
    if (!token) return;
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (payload.roles && payload.roles.includes("ADMIN")) {
      setIsAdmin(true);
    }
  };

  const fetchTeamData = () => {
  setLoading(true);
  fetch(`http://localhost:8080/teams/${id}`)
    .then(res => res.json())
    .then(data => {
      setTeam(data);

      // Ako postoji token, dodaj header, inače fetch bez auth
      const playerFetchOptions = token
        ? { headers: { 'Authorization': `Bearer ${token}` } }
        : {};

      return fetch(`http://localhost:8080/api/v1/player?team=${encodeURIComponent(data.name)}`, playerFetchOptions);
    })
    .then(res => res.json())
    .then(data => setPlayers(data))
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
};

  const resetForm = () => {
    setFormData({
      player: '',
      nation: '',
      pos: '',
      age: '',
      mp: '',
      starts: '',
      min: '',
      gls: '',
      ast: '',
      pk: '',
      crdy: '',
      crdr: '',
      xg: '',
      xag: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPlayer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/v1/player', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          team: { id: parseInt(id) }
        })
      });

      if (!response.ok) throw new Error('Failed to add player');

      alert('Player added successfully!');
      setShowAddModal(false);
      resetForm();
      fetchTeamData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEditPlayer = (player) => {
    setSelectedPlayer(player);
    setFormData({
      player: player.player || '',
      nation: player.nation || '',
      pos: player.pos || '',
      age: player.age || '',
      mp: player.mp || '',
      starts: player.starts || '',
      min: player.min || '',
      gls: player.gls || '',
      ast: player.ast || '',
      pk: player.pk || '',
      crdy: player.crdy || '',
      crdr: player.crdr || '',
      xg: player.xg || '',
      xag: player.xag || ''
    });
    setShowEditModal(true);
  };

  const handleUpdatePlayer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/v1/player', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: selectedPlayer.id,
          ...formData,
          team: { id: parseInt(id) }
        })
      });

      if (!response.ok) throw new Error('Failed to update player');

      alert('Player updated successfully!');
      setShowEditModal(false);
      setSelectedPlayer(null);
      resetForm();
      fetchTeamData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeletePlayer = async (playerName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${playerName}?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:8080/api/v1/player/${encodeURIComponent(playerName)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete player');

      alert('Player deleted successfully!');
      fetchTeamData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loading-spinner">⚽ Loading team...</div>;
  if (!team) return <div className="error">Team not found</div>;

  return (
    <div>
      <Header />
      <div className="team-page">
        {(team.logo_url || team.logoUrl) && (
          <div className="team-logo">
            <img src={team.logo_url || team.logoUrl} alt={team.name} />
          </div>
        )}

        <div className="team-header">
          <h1 className="team-name">{team.name}</h1>
          <div className="team-info">
            <p><strong>Stadium:</strong> {team.stadium || 'N/A'}</p>
            <p><strong>Manager:</strong> {team.manager || 'N/A'}</p>
            <p><strong>Founded:</strong> {team.founded || 'N/A'}</p>
          </div>
        </div>

        <div className="team-players">
          <div className="players-header">
            <h2>Players</h2>
            {isAdmin && (
              <button className="add-player-btn" onClick={() => setShowAddModal(true)}>
                Add Player +
              </button>
            )}
          </div>

          <ul className="players-list">
            {players.map(player => (
              <li key={player.id} className="player-card">
                <Link to={`/player/${player.id}`} className="player-link">
                  <span className="player-name">{player.player}</span>
                  <span className="player-position">{player.pos}</span>
                </Link>
                {isAdmin && (
                  <div className="player-actions">
                    <button
                      className="edit-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        handleEditPlayer(player);
                      }}
                      title="Edit player"
                    >
                      ✎
                    </button>
                    <button
                      className="delete-player-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeletePlayer(player.player);
                      }}
                      title="Delete player"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Add Player Modal */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal player-modal" onClick={(e) => e.stopPropagation()}>
              <h2>Add New Player</h2>
              <form onSubmit={handleAddPlayer} className="player-form">
                <div className="form-grid">
                  <input
                    type="text"
                    name="player"
                    placeholder="Player Name *"
                    value={formData.player}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="nation"
                    placeholder="Nation"
                    value={formData.nation}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="pos"
                    placeholder="Position"
                    value={formData.pos}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    name="mp"
                    placeholder="Matches Played"
                    value={formData.mp}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    name="starts"
                    placeholder="Starts"
                    value={formData.starts}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    step="0.01"
                    name="min"
                    placeholder="Minutes"
                    value={formData.min}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    step="0.01"
                    name="gls"
                    placeholder="Goals"
                    value={formData.gls}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    step="0.01"
                    name="ast"
                    placeholder="Assists"
                    value={formData.ast}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    step="0.01"
                    name="pk"
                    placeholder="Penalties"
                    value={formData.pk}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    step="0.01"
                    name="crdy"
                    placeholder="Yellow Cards"
                    value={formData.crdy}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    step="0.01"
                    name="crdr"
                    placeholder="Red Cards"
                    value={formData.crdr}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    step="0.01"
                    name="xg"
                    placeholder="xG"
                    value={formData.xg}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    step="0.01"
                    name="xag"
                    placeholder="xAG"
                    value={formData.xag}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="modal-buttons">
                  <button type="submit" className="add-btn">Add Player</button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Player Modal */}
        {showEditModal && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal player-modal" onClick={(e) => e.stopPropagation()}>
              <h2>Edit Player</h2>
              <form onSubmit={handleUpdatePlayer} className="player-form">
                <div className="form-grid">
                  <input
                    type="text"
                    name="player"
                    placeholder="Player Name *"
                    value={formData.player}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="nation"
                    placeholder="Nation"
                    value={formData.nation}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="pos"
                    placeholder="Position"
                    value={formData.pos}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    name="mp"
                    placeholder="Matches Played"
                    value={formData.mp}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    name="starts"
                    placeholder="Starts"
                    value={formData.starts}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    step="0.01"
                    name="min"
                    placeholder="Minutes"
                    value={formData.min}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    step="0.01"
                    name="gls"
                    placeholder="Goals"
                    value={formData.gls}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    step="0.01"
                    name="ast"
                    placeholder="Assists"
                    value={formData.ast}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    step="0.01"
                    name="pk"
                    placeholder="Penalties"
                    value={formData.pk}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    step="0.01"
                    name="crdy"
                    placeholder="Yellow Cards"
                    value={formData.crdy}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    step="0.01"
                    name="crdr"
                    placeholder="Red Cards"
                    value={formData.crdr}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    step="0.01"
                    name="xg"
                    placeholder="xG"
                    value={formData.xg}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    step="0.01"
                    name="xag"
                    placeholder="xAG"
                    value={formData.xag}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="modal-buttons">
                  <button type="submit" className="add-btn">Update Player</button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedPlayer(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}