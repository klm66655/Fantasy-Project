import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./TeamPage.css";
import { Link } from 'react-router-dom';
import  Header  from "../components/HeaderLogin";



export default function TeamPage() {
  const { id } = useParams(); // teamId iz URL-a
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // 1️⃣ fetch tima
    fetch(`http://localhost:8080/teams/${id}`)
      .then(res => res.json())
      .then(data => {
        setTeam(data);

        // 2️⃣ fetch igrača po imenu tima
        return fetch(`http://localhost:8080/api/v1/player?team=${encodeURIComponent(data.name)}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
      })
      .then(res => res.json())
      .then(data => setPlayers(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));

  }, [id]);

  


  if (loading) return <div>Loading team...</div>;
  if (!team) return <div>Team not found</div>;

  return (
    <div>
    <Header />
    <div className="team-page">
      {team.logoUrl && (
        <div className="team-logo">
          <img src={team.logoUrl} alt={team.name} />
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
  <h2>Players</h2>
  <ul>
    {players.map(player => (
      <li key={player.id} className="player-card">
        <Link to={`/player/${player.id}`} className="player-link">
          <span className="player-name">{player.player}</span>
          <span className="player-position">{player.pos}</span>
        </Link>
      </li>
    ))}
  </ul>
</div>
</div>
    </div>
  );
}
