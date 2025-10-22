import React, { useEffect, useState } from "react";
import Header from "../components/HeaderLogin";
import Footer from "../components/FooterLogin";
import "./ViewPlayersPage.css";
import { useNavigate } from "react-router-dom";

export default function ViewPlayersPage() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all players for top lists
    const fetchPlayers = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/v1/player", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch players");
        const data = await res.json();
        setPlayers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, [token]);

  // Search lokalno po imenu igrača
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    const results = players.filter((p) =>
      p.player.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  // Klik na igrača vodi na /player/:id
  const handlePlayerClick = (id) => {
    navigate(`/player/${id}`);
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  // Top 10 liste (bez Squad Total)
  const topGoals = players
    .filter((p) => p.player !== "Squad Total")
    .sort((a, b) => b.gls - a.gls)
    .slice(0, 10);
  const topAssists = players
    .filter((p) => p.player !== "Squad Total")
    .sort((a, b) => b.ast - a.ast)
    .slice(0, 10);
  const topYellow = players
    .filter((p) => p.player !== "Squad Total")
    .sort((a, b) => b.crdy - a.crdy)
    .slice(0, 10);
  const topRed = players
    .filter((p) => p.player !== "Squad Total")
    .sort((a, b) => b.crdr - a.crdr)
    .slice(0, 10);

  const renderTopList = (list, stat, label) => (
    <div className="top-section">
      <h3>{label}</h3>
      <ul>
        {list.map((p, idx) => (
          <li
            key={p.id}
            onClick={() => handlePlayerClick(p.id)}
            style={{ cursor: "pointer" }}
          >
            {idx + 1}. {p.player} ({p[stat]})
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div>
      <Header />
      <div className="view-players-container">
        <h1>Top Players</h1>

        {/* Search input */}
        <form onSubmit={handleSearch} style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Search player..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        {/* Search results */}
        {searchResults.length > 0 ? (
          <ul className="player-list">
            {searchResults.map((p) => (
              <li
                key={p.id}
                onClick={() => handlePlayerClick(p.id)}
                style={{ cursor: "pointer" }}
              >
                {p.player} - {p.nation} - {p.pos}
              </li>
            ))}
          </ul>
        ) : (
          // Ako nema searchResults, prikazujemo top liste
          <>
            {renderTopList(topGoals, "gls", "Top Scorers (Goals)")}
            {renderTopList(topAssists, "ast", "Top Assists")}
            {renderTopList(topYellow, "crdy", "Most Yellow Cards")}
            {renderTopList(topRed, "crdr", "Most Red Cards")}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
