import React, { useEffect, useState } from "react";
import Header from "../components/HeaderLogin";
import Footer from "../components/FooterLogin";
import "./ProfilePage.css";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [favoritePlayers, setFavoritePlayers] = useState([]);
  const [cover, setCover] = useState(null); // <-- novo
  const fileInputRef = React.useRef(null);   // <-- novo

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserAndFavorites = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      if (!token) return;

      try {
        const resUser = await fetch("http://localhost:8080/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resUser.ok) throw new Error("Failed to fetch user data");
        const userData = await resUser.json();
        setUser(userData);

        if (userId) {
          const resFav = await fetch(`http://localhost:8080/api/v1/favorites/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!resFav.ok) throw new Error("Failed to fetch favorites");
          const favData = await resFav.json();
          setFavoriteCount(favData.length);
          setFavoritePlayers(favData.map(f => f.player?.player || "Unknown Player"));
        }

      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndFavorites();
  }, [token]);

  // ------------------- NOVO -------------------
  const handleCoverClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCover(imageUrl);
      // opcionalno: ovde možeš poslati fajl na backend da sačuvaš trajno
    }
  };
  // --------------------------------------------

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (!user) return <p style={{ textAlign: "center" }}>User not found</p>;

  return (
    <div>
      <Header />
      <div className="profile-container">
        {/* Cover Section */}
        <div
          className="profile-cover"
          style={{
            backgroundImage: cover 
              ? `url(${cover})` 
              : "linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #4f46e5 100%)"
          }}
        >
          <button className="change-cover-btn" onClick={handleCoverClick}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
            Change Cover
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            {user.username.charAt(0).toUpperCase()}
            <button className="avatar-upload-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </button>
          </div>

          <div className="profile-info">
            <h2 className="profile-name">{user.username}</h2>
            <div className="profile-meta">
              <div className="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                {user.email}
              </div>
              <div className="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>
            
          </div>

          <div className="profile-actions">
            <button className="btn-primary" onClick={() => alert("Edit coming soon!")}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit Profile
            </button>
            <button className="btn-settings">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6m5.2-14.2l-4.2 4.2m-2 2l-4.2 4.2M23 12h-6m-6 0H1m14.2 5.2l-4.2-4.2m-2-2l-4.2-4.2"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="profile-stats">
  <div className="stat-item">
    <div className="stat-value">{favoriteCount}</div>
    <div className="stat-label">Favorite Players</div>

    {/* Lista omiljenih igrača */}
    {favoritePlayers.length > 0 ? (
      <ul className="favorite-list">
        {favoritePlayers.map((player, index) => (
          <li key={index} className="favorite-player">{player}</li>
        ))}
      </ul>
    ) : (
      <p className="no-favorites">No favorite players yet.</p>
    )}
  </div>
</div>
</div>


      {/* Content Tabs */}
      <div className="profile-content">
        <div className="tabs">
          <button className="tab-btn active">Overview</button>
          <button className="tab-btn">Activity</button>
          <button className="tab-btn">Achievements</button>
        </div>

        <div className="tab-content">
          <div className="content-section">
            <h3>About</h3>
            <p>Member since {new Date(user.createdAt).getFullYear()}. Active contributor to the community.</p>
          </div>

          <div className="content-section">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
                <div>
                  <p className="activity-title">Completed a new project</p>
                  <p className="activity-time">2 days ago</p>
                </div>
              </div>
              <div className="activity-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
                <div>
                  <p className="activity-title">Updated profile information</p>
                  <p className="activity-time">1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="account-actions">
        <h3>Account Actions</h3>
        <div className="action-buttons">
          
          <button
            className="btn-logout"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userId");
              window.location.href = "/login";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
    <Footer />
  </div>
  );
}
