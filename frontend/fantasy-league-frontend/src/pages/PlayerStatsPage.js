import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./PlayerStatsPage.css";
import Header from "../components/HeaderLogin";
import ReactStars from "react-stars";


// 🧩 Helper funkcija za učitavanje slike igrača
const getPlayerImage = (playerName) => {
  try {
    // pretvori ime u lowercase i ukloni razmake
    const formattedName = playerName.toLowerCase().replace(/\s+/g, "");
    return require(`../assets/players/${formattedName}.png`);
  } catch (err) {
    // ako nema slike, koristi default
    return require("../assets/players/default.png");
  }
};



export default function PlayerStatsPage() {
  const { id } = useParams();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const [averageRating, setAverageRating] = useState(0);

  const fetchAverageRating = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/reviews/${id}/average`);
      if (!res.ok) throw new Error("Failed to fetch average rating");
      const data = await res.json();
      setAverageRating(data || 0);
    } catch (err) {
      console.error("Error fetching average rating:", err);
    }
  };

  useEffect(() => {
    fetchAverageRating();
    checkAdmin();
  }, [id]);

  // ✅ Provera da li je korisnik admin
  const checkAdmin = () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.roles && payload.roles.includes("ADMIN")) {
        setIsAdmin(true);
      }
    } catch (err) {
      console.error("Error checking admin status:", err);
    }
  };

  const handleRatingChange = async (newRating) => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  if (!userId || !token) {
    alert("Please log in to rate");
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080/api/v1/reviews/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, rating: newRating }),
    });

    if (!res.ok) {
  if (res.status === 409) {
    alert("You already rated this player!");
    return;
  }
  const errText = await res.text();
  throw new Error(`Failed to submit rating: ${errText}`);
}


    alert("Rating submitted!");
    fetchAverageRating();
  } catch (err) {
    console.error("Error submitting rating:", err);
    alert("Error submitting rating");
  }
};


  // ✅ Fetch player stats
  useEffect(() => {
  setLoading(true);

  fetch(`http://localhost:8080/api/v1/player/${id}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch player stats");
      return res.json();
    })
    .then((data) => setStats(data))
    .catch((err) => console.error(err))
    .finally(() => setLoading(false));
}, [id]);


  // ✅ Fetch favorites
  useEffect(() => {
    const fetchFavorites = async () => {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");
      if (!userId || !token) return;

      try {
        const res = await fetch(`http://localhost:8080/api/v1/favorites/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch favorites");

        const data = await res.json();
        const playerIds = data.map((f) => Number(f.player.id || f.playerId));
        setFavoriteIds(playerIds);
        setIsFavorite(playerIds.includes(Number(id)));
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };

    fetchFavorites();
  }, [id]);

  // ✅ Fetch comments
  const fetchComments = () => {
    fetch(`http://localhost:8080/api/v1/comments/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) return [];
        return res.json();
      })
      .then((data) => setComments(data || []))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchComments();
  }, [stats]);

  // ✅ Dodavanje komentara
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setIsSubmitting(true);

    fetch(`http://localhost:8080/api/v1/comments/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newComment }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or server error");
        return res.json();
      })
      .then((comment) => {
        setComments((prev) => [comment, ...prev]);
        setNewComment("");
      })
      .catch((err) => console.error(err))
      .finally(() => setIsSubmitting(false));
  };

  // ✅ Brisanje komentara (samo za admina)
  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this comment?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:8080/api/v1/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete comment");

      setComments((prev) => prev.filter((c) => c.id !== commentId));
      alert("Comment deleted successfully!");
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Could not delete comment");
    }
  };

  // ✅ Add favorite
  const handleAddFavorite = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      alert("Please log in to add favorites");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/v1/favorites/${userId}/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to add favorite: ${errText}`);
      }

      const data = await res.json();
      console.log("Favorite added:", data);

      setIsFavorite(true);
      alert("Added to favorites!");
    } catch (err) {
      console.error("Error adding favorite:", err.message);
      alert("Could not add to favorites (maybe already added?)");
    }
  };

  if (loading) return <p>Loading player stats...</p>;
  if (!stats) return <p>Player not found</p>;

  return (
    <div>
      <Header />
      <div className="player-stats-page">
        {/* 🧩 Dodato: slika i ime igrača */}
        <div className="player-header">
          <img
            src={getPlayerImage(stats.player)}
            alt={stats.player}
            className="player-avatar"
          />
          <h1>{stats.player}</h1>
          <ReactStars
    count={5}
    size={28}
    value={averageRating}
    activeColor="#ffd700"
    onChange={handleRatingChange}
  />
  {/* ⭐ Prikaz prosečne ocene */}
          <p style={{ marginTop: "8px", fontWeight: "bold" }}>
            Average rating: ⭐ {averageRating.toFixed(1)} / 5
          </p>
        
        </div>

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
        <p><strong>xG:</strong> {stats.xg}</p>
        <p><strong>xA:</strong> {stats.xag}</p>
        <p><strong>Cards:</strong> {stats.crdy} yellow / {stats.crdr} red</p>
        <p><strong>Team:</strong> {stats.team ? (stats.team.name || stats.team) : "N/A"}</p>

        {/* Comments */}
        <div className="player-comments">
          <h2>Comments {comments.length > 0 ? `(${comments.length})` : "(0)"}</h2>

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
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <li key={comment.id || index}>
                  <div className="comment-content">
                    <div>
                      <strong>{comment.username || "Unknown"}:</strong> {comment.content}{" "}
                      <em>({new Date(comment.createdAt).toLocaleString()})</em>
                    </div>
                    {isAdmin && (
                      <button
                        className="delete-comment-btn"
                        onClick={() => handleDeleteComment(comment.id)}
                        title="Delete comment"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </li>
              ))
            ) : (
              <p>No comments yet.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}