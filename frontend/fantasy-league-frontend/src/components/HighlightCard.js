import React from 'react';

export default function HighlightCard({ highlight, onPlay, onLike, onDelete, isLiked }) {
  const getTypeEmoji = (type) => {
    switch(type) {
      case 'GOL': return '⚽';
      case 'ASISTENCIJA': return '🎯';
      case 'ODBRANA': return '🧤';
      case 'SKILL': return '✨';
      default: return '🎬';
    }
  };

  const getTypeName = (type) => {
    switch(type) {
      case 'GOL': return 'Gol';
      case 'ASISTENCIJA': return 'Asistencija';
      case 'ODBRANA': return 'Odbrana';
      case 'SKILL': return 'Skill';
      case 'SAVE': return 'Save';
      default: return 'Ostalo';
    }
  };

  return (
    <div className="highlight-card">
      {onDelete && (
        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(highlight.id);
          }}
          title="Delete highlight"
        >
          ✕
        </button>
      )}

      <div 
        className="highlight-thumbnail"
        onClick={() => onPlay(highlight)}
      >
        {highlight.thumbnailUrl ? (
          <img src={highlight.thumbnailUrl} alt={highlight.title} />
        ) : (
          <div className="thumbnail-placeholder">
            <span className="play-icon">▶</span>
          </div>
        )}
        <div className="play-overlay">
          <span className="play-icon-large">▶</span>
        </div>
        <div className="type-badge">
          {getTypeEmoji(highlight.type)} {getTypeName(highlight.type)}
        </div>
      </div>

      <div className="highlight-content">
        <h3 className="highlight-title">{highlight.title}</h3>
        
        {highlight.playerName && (
          <p className="highlight-player">
            👤 {highlight.playerName}
          </p>
        )}

        {highlight.description && (
          <p className="highlight-description">
            {highlight.description}
          </p>
        )}

        <div className="highlight-stats">
          <button
            className={`stat-item like-btn ${isLiked ? 'liked' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onLike(highlight.id);
            }}
          >
            <span className="stat-icon">{isLiked ? '❤️' : '🤍'}</span>
            <span className="stat-value">{highlight.likesCount || 0}</span>
          </button>

          <div className="stat-item">
            <span className="stat-icon">👁️</span>
            <span className="stat-value">{highlight.viewCount || 0}</span>
          </div>
        </div>

        <div className="highlight-date">
          {new Date(highlight.createdAt).toLocaleDateString('sr-RS', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </div>
      </div>
    </div>
  );
}