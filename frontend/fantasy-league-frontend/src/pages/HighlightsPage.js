import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./HighlightsPage.css";
import Header from "../components/HeaderLogin";
import Footer from "../components/FooterLogin";
import HighlightCard from "../components/HighlightCard";
import VideoPlayerModal from "../components/VideoPlayerModal";

export default function HighlightsPage() {
  const navigate = useNavigate();
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);

  // Filters & Sorting
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal state
  const [selectedHighlight, setSelectedHighlight] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    checkAuth();
    fetchHighlights();
  }, [selectedType, sortBy, currentPage]);

  const checkAuth = () => {
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.sub) setUserId(payload.userId || null);
      if (payload.roles && payload.roles.includes("ADMIN")) setIsAdmin(true);
    } catch (err) {
      console.error("Token parse error:", err);
    }
  };

  const fetchHighlights = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        sortBy: sortBy,
        page: currentPage,
        limit: 12
      });
      if (selectedType) params.append('type', selectedType);

      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

      const response = await fetch(
        `http://localhost:8080/api/highlights?${params}`,
        { headers }
      );

      if (!response.ok) throw new Error('Failed to fetch highlights');

      const data = await response.json();
      setHighlights(data.data || []);
      setTotalPages(data.totalPages || 1);
      setLoading(false);
      console.log("📦 Received highlights:", data);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleLike = async (highlightId) => {
    if (!token) {
      alert('Morate biti ulogovani da biste lajkovali!');
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8080/api/highlights/${highlightId}/like`,
        {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (!response.ok) throw new Error('Failed to toggle like');

      const data = await response.json();
      console.log("Like response:", data);

      // UPDATE: likesCount and isLikedByUser
      setHighlights(prev =>
        prev.map(h =>
          h.id === highlightId
            ? { ...h, likesCount: data.likesCount, isLikedByUser: data.liked }
            : h
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (highlightId) => {
    const confirmDelete = window.confirm('Da li ste sigurni da želite obrisati ovaj highlight?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/highlights/${highlightId}`,
        {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (!response.ok) throw new Error('Failed to delete highlight');

      alert('Highlight uspešno obrisan!');
      fetchHighlights();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddHighlight = async () => {
    if (!token) {
      alert("Morate biti ulogovani kao admin.");
      return;
    }

    const playerId = prompt("Unesite ID igrača:");
    const title = prompt("Naslov highlighta:");
    const description = prompt("Opis (opcionalno):");
    const videoUrl = prompt("Video URL (npr. /videos/imefajla.mp4):");
    const thumbnailUrl = prompt("Thumbnail URL (npr. /videos/thumbnails/slika.png):");
    const type = prompt("Tip (GOL, ASISTENCIJA, ODBRANA, SKILL, SAVE, OSTALO):");

    if (!playerId || !videoUrl || !title || !type) {
      alert("Morate popuniti obavezna polja!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/highlights/addhighlight`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          playerId: Number(playerId),
          videoUrl,
          thumbnailUrl,
          title,
          description,
          type
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Greška prilikom dodavanja highlighta");
      }

      alert("Highlight uspješno dodat!");
      fetchHighlights();
    } catch (err) {
      alert(err.message);
    }
  };

  const openVideo = (highlight) => {
    setSelectedHighlight(highlight);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedHighlight(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading && highlights.length === 0) {
    return (
      <div className="highlights-container">
        <Header />
        <div className="loading-spinner">🎬 Loading highlights...</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="highlights-container">
      <Header />

      <div className="highlights-header">
        <div className="hero-section">
          <h1 className="hero-title">⚽ Highlights Zone</h1>
          <p className="hero-subtitle">
            Najbolji golovi, asistencije i akcije iz Premier League
          </p>
        </div>

        <div className="action-buttons">
          {isAdmin && (
            <button onClick={handleAddHighlight} className="action-btn">
              ➕ Add Highlight
            </button>
          )}
          <button onClick={handleLogout} className="action-btn logout-btn">
            Logout
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Tip:</label>
          <select 
            value={selectedType} 
            onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }}
            className="filter-select"
          >
            <option value="">Svi tipovi</option>
            <option value="GOL">Golovi</option>
            <option value="ASISTENCIJA">Asistencije</option>
            <option value="ODBRANA">Odbrane</option>
            <option value="SKILL">Skills</option>
            <option value="SAVE">Save</option>
            <option value="OSTALO">Ostalo</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Sortiraj:</label>
          <select 
            value={sortBy} 
            onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
            className="filter-select"
          >
            <option value="newest">Najnovije</option>
            <option value="popular">Najpopularnije</option>
            <option value="views">Najgledanije</option>
          </select>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="highlights-section">
        <div className="highlights-grid">
          {highlights.length === 0 ? (
            <div className="no-highlights">
              <p>Nema highlighta za prikaz</p>
            </div>
          ) : (
            highlights.map((highlight) => (
              <HighlightCard
                key={highlight.id}
                highlight={highlight}
                onPlay={openVideo}
                onLike={handleLike}
                onDelete={isAdmin ? handleDelete : null}
                isLiked={highlight.isLikedByUser}
                likesCount={highlight.likesCount} // ✅ prosleđujemo broj lajkova
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="page-btn"
            >
              ← Previous
            </button>
            
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="page-btn"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Video Modal */}
      {showModal && selectedHighlight && (
        <VideoPlayerModal
          highlight={selectedHighlight}
          onClose={closeModal}
        />
      )}

      <Footer />
    </div>
  );
}
