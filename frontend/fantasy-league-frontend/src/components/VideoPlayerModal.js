import React, { useEffect } from 'react';


export default function VideoPlayerModal({ highlight, onClose }) {
  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // Extract YouTube video ID from URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';

    // If already embed URL, return as is
    if (url.includes('embed')) {
      return url;
    }

    // Extract video ID from various YouTube URL formats
    let videoId = '';

    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
  };

  const getTypeEmoji = (type) => {
    switch (type) {
      case 'GOL':
        return '⚽';
      case 'ASISTENCIJA':
        return '🎯';
      case 'ODBRANA':
        return '🧤';
      case 'SKILL':
        return '✨';
      default:
        return '🎬';
    }
  };

  const isYouTubeVideo = (url) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="video-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="video-container">
          {isYouTubeVideo(highlight.videoUrl) ? (
            <iframe
              src={getYouTubeEmbedUrl(highlight.videoUrl)}
              title={highlight.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video
              controls
              autoPlay
              src={highlight.videoUrl}
              poster={highlight.thumbnailUrl || ''}
            />
          )}
        </div>

        <div className="video-info">
          <div className="video-header">
            <h2 className="video-title">
              {getTypeEmoji(highlight.type)} {highlight.title}
            </h2>
            {highlight.playerName && (
              <p className="video-player">👤 {highlight.playerName}</p>
            )}
          </div>

          {highlight.description && (
            <p className="video-description">{highlight.description}</p>
          )}

          <div className="video-meta">
            <span className="meta-item">❤️ {highlight.likesCount || 0} likes</span>
            
            <span className="meta-item">
              📅{' '}
              {new Date(highlight.createdAt).toLocaleDateString('sr-RS', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}