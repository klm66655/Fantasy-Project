import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./PlayerStatsPage.css";
import Header from "../components/HeaderLogin";

export default function PlayerStatsPage() {
  const { id } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);


  // Fetch player stats
  useEffect(() => {
    setLoading(true);

    fetch(`http://localhost:8080/api/v1/player/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch player stats");
        return res.json();
      })
      .then(data => setStats(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch comments
  const fetchComments = () => {
    fetch(`http://localhost:8080/api/v1/comments/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || ""}`,
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (!res.ok) return []; // ako nije auth, vrati praznu listu
        return res.json();
      })
      .then(data => setComments(data || []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchComments();
  }, [stats]);

  // Dodavanje komentara
  const handleAddComment = () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);

    fetch(`http://localhost:8080/api/v1/comments/${id}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: newComment })
    })
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized or server error");
        return res.json();
      })
      .then(comment => {
        // Dodajemo novi komentar na početak liste
        setComments(prev => [comment, ...prev]);
        setNewComment("");
      })
      .catch(err => console.error(err))
      .finally(() => setIsSubmitting(false));
  };

  const handleAddFavorite = () => {
  const userId = localStorage.getItem("userId"); // pretpostavimo da čuvaš userId u localStorage

  if (!userId) {
    alert("Please log in to add favorites");
    return;
  }

  fetch(`http://localhost:8080/api/v1/favorites/${userId}/${id}`, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    }
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to add favorite");
      return res.json();
    })
    .then(fav => {
      setIsFavorite(true);
      alert("Added to favorites!");
    })
    .catch(err => console.error(err));
};


  if (loading) return <p>Loading player stats...</p>;
  if (!stats) return <p>Player not found</p>;

  return (
    <div>
      <Header />
      <div className="player-stats-page">
        <h1>{stats.player}</h1>
        {localStorage.getItem("token") && (
        <button 
            className={`favorite-btn ${isFavorite ? "favorited" : ""}`} 
            onClick={handleAddFavorite}
            disabled={isFavorite}
        >
            {isFavorite ? "Favorited ❤️" : "Add to Favorites ♡"}
        </button>
        )}

        <p><strong>Position:</strong> {stats.pos}</p>
        <p><strong>Nation:</strong> {stats.nation}</p>
        <p><strong>Age:</strong> {stats.age}</p>
        <p><strong>Goals:</strong> {stats.gls}</p>
        <p><strong>Assists:</strong> {stats.ast}</p>
        <p><strong>Minutes:</strong> {stats.min}</p>
        <p><strong>Expected Goals (xG):</strong> {stats.xg}</p>
        <p><strong>Expected Assists (xA):</strong> {stats.xag}</p>
        <p><strong>Cards:</strong> {stats.crdy} yellow / {stats.crdr} red</p>
        <p><strong>Team:</strong> {stats.team ? (stats.team.name || stats.team) : "N/A"}</p>

        {/* Sekcija komentara */}
        <div className="player-comments">
            <h2>
                Comments {comments.length > 0 ? `(${comments.length})` : "(0)"}
            </h2>

          {localStorage.getItem("token") ? (
            <div className="add-comment">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write your comment..."
                rows={3}
              />
              <button onClick={handleAddComment} disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          ) : (
            <p>Please log in to leave a comment.</p>
          )}

          <ul>
            {comments.length > 0 ? comments.map((comment, index) => (
              <li key={comment.id || index}>
                <strong>{comment.username || "Unknown"}:</strong> {comment.content}{" "}
                <em>({new Date(comment.createdAt).toLocaleString()})</em>
              </li>
            )) : <p>No comments yet.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}
