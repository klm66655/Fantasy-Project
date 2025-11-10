import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/HeaderLogin";
import Footer from "../components/FooterLogin";
import "./AddHighlightPage.css";

export default function AddHighlightPage() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form state
  const [formData, setFormData] = useState({
    playerId: '',
    type: 'GOL',
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: ''
  });

  // File upload state
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploadMethod, setUploadMethod] = useState('youtube'); // 'youtube' or 'upload'

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // 🔒 Provera pristupa
  useEffect(() => {
    if (!token) {
      alert("Morate biti prijavljeni!");
      navigate("/login");
      return;
    }
    if (role !== "ADMIN") {
      alert("Samo admin može dodavati highlightove!");
      navigate("/home");
      return;
    }
    fetchPlayers();
  }, []);

  // ✅ Fetch igrača sa JWT tokenom
  const fetchPlayers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/player', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        alert("Vaša sesija je istekla. Prijavite se ponovo.");
        navigate("/login");
        return;
      }

      if (!response.ok) throw new Error('Greška pri dohvaćanju igrača');
      const data = await response.json();
      setPlayers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        alert('Video je prevelik! Maksimalna veličina je 100MB');
        return;
      }
      setVideoFile(file);
    }
  };

  const handleThumbnailFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setThumbnailFile(file);
  };

  const uploadVideoFile = async () => {
    if (!videoFile) return null;

    const formData = new FormData();
    formData.append('file', videoFile);

    try {
      const response = await fetch('http://localhost:8080/api/videos/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Video upload failed');
      const data = await response.json();
      return `http://localhost:8080${data.videoUrl}`;
    } catch (err) {
      throw new Error('Greška pri upload-u videa: ' + err.message);
    }
  };

  const uploadThumbnailFile = async () => {
    if (!thumbnailFile) return null;

    const formData = new FormData();
    formData.append('file', thumbnailFile);

    try {
      const response = await fetch('http://localhost:8080/api/videos/upload-thumbnail', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Thumbnail upload failed');
      const data = await response.json();
      return `http://localhost:8080${data.thumbnailUrl}`;
    } catch (err) {
      console.error('Greška pri upload-u thumbnail-a:', err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalVideoUrl = formData.videoUrl;
      let finalThumbnailUrl = formData.thumbnailUrl;

      // Ako je upload metod, upload-uj fajlove
      if (uploadMethod === 'upload') {
        if (!videoFile) {
          alert('Morate izabrati video fajl');
          setLoading(false);
          return;
        }

        finalVideoUrl = await uploadVideoFile();

        if (thumbnailFile) {
          finalThumbnailUrl = await uploadThumbnailFile();
        }
      } else {
        // YouTube metod - automatski generiši thumbnail
        if (!finalThumbnailUrl && finalVideoUrl.includes('youtube.com')) {
          const videoId = extractYouTubeId(finalVideoUrl);
          if (videoId) {
            finalThumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
          }
        }
      }

      const highlightData = {
        playerId: parseInt(formData.playerId),
        type: formData.type,
        title: formData.title,
        description: formData.description,
        videoUrl: finalVideoUrl,
        thumbnailUrl: finalThumbnailUrl
      };

      const response = await fetch('http://localhost:8080/api/highlights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(highlightData)
      });

      if (!response.ok) throw new Error('Failed to create highlight');

      alert('✅ Highlight uspešno kreiran!');
      navigate('/highlights');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const extractYouTubeId = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      return url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1]?.split('?')[0];
    }
    return null;
  };

  return (
    <div className="add-highlight-container">
      <Header />
      <div className="form-wrapper">
        <div className="form-header">
          <h1 className="form-title">🎬 Add New Highlight</h1>
          <p className="form-subtitle">Dodaj novi highlight za igrača</p>
        </div>

        <form onSubmit={handleSubmit} className="highlight-form">
          <div className="upload-method-toggle">
            <button
              type="button"
              className={`toggle-btn ${uploadMethod === 'youtube' ? 'active' : ''}`}
              onClick={() => setUploadMethod('youtube')}
            >
              📺 YouTube URL
            </button>
            <button
              type="button"
              className={`toggle-btn ${uploadMethod === 'upload' ? 'active' : ''}`}
              onClick={() => setUploadMethod('upload')}
            >
              📤 Upload Video
            </button>
          </div>

          <div className="form-group">
            <label>Igrač *</label>
            <select
              name="playerId"
              value={formData.playerId}
              onChange={handleInputChange}
              required
            >
              <option value="">Izaberi igrača...</option>
              {players.map(player => (
                <option key={player.id} value={player.id}>
                  {player.player} - {player.team?.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Tip *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="GOL">⚽ Gol</option>
              <option value="ASISTENCIJA">🎯 Asistencija</option>
              <option value="ODBRANA">🧤 Odbrana</option>
              <option value="SKILL">✨ Skill</option>
              <option value="OSTALO">🎬 Ostalo</option>
            </select>
          </div>

          <div className="form-group">
            <label>Naslov *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="npr. Haaland hattrick protiv West Ham"
              required
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label>Opis</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Kratak opis highlighta..."
              rows={4}
            />
          </div>

          {uploadMethod === 'youtube' && (
            <div className="form-group">
              <label>YouTube Video URL *</label>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleInputChange}
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
              <small className="form-hint">
                Thumbnail će biti automatski generisan iz YouTube-a
              </small>
            </div>
          )}

          {uploadMethod === 'upload' && (
            <>
              <div className="form-group">
                <label>Upload Video Fajl *</label>
                <input
                  type="file"
                  accept="video/mp4,video/avi,video/mov,video/wmv"
                  onChange={handleVideoFileChange}
                  required
                />
                <small className="form-hint">
                  Maksimalna veličina: 100MB | Format: MP4, AVI, MOV, WMV
                </small>
                {videoFile && (
                  <div className="file-info">
                    ✓ {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)}MB)
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Upload Thumbnail (opciono)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailFileChange}
                />
                {thumbnailFile && (
                  <div className="file-info">
                    ✓ {thumbnailFile.name}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/highlights')}
              className="btn-cancel"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? '⏳ Uploading...' : '✓ Create Highlight'}
            </button>
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="upload-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p>{uploadProgress}% uploaded</p>
            </div>
          )}
        </form>
      </div>
      <Footer />
    </div>
  );
}
