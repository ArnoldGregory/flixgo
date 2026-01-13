// src/pages/WatchMovie.jsx - ENHANCED VIDEO PLAYER
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { contentService, getMediaUrl } from "../services/apiService";
import config from "../config/config";

const WatchMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const controlsTimeoutRef = useRef(null);

  const token = localStorage.getItem(config.STORAGE_KEYS.TOKEN);
  const movieId = Number(id);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchMovie = async () => {
      try {
        const res = await contentService.getMovies();
        const found = (res.data.success ? res.data.data : res.data).find(
          m => Number(m.id) === movieId
        );

        if (!found || !found.video_url) {
          alert("Movie not available");
          navigate(-1);
          return;
        }

        setMovie(found);
        setLoading(false);

        // Resume from last position
        const saved = localStorage.getItem(`watch-${movieId}`);
        if (saved && videoRef.current) {
          videoRef.current.currentTime = parseFloat(saved);
        }
      } catch (err) {
        alert("Failed to load video");
        navigate(-1);
      }
    };

    fetchMovie();
  }, [movieId, token, navigate]);

  // Save progress
  useEffect(() => {
    if (!movie || !videoRef.current) return;

    const save = () => {
      if (videoRef.current) {
        localStorage.setItem(`watch-${movieId}`, videoRef.current.currentTime);
      }
    };

    const interval = setInterval(save, 5000);
    return () => clearInterval(interval);
  }, [movie, movieId]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleDurationChange = () => setDuration(video.duration);
    const handlePlay = () => setPlaying(true);
    const handlePause = () => setPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  // Auto-hide controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (playing) setShowControls(false);
      }, 3000);
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [playing]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const toggleFullscreen = () => {
    const container = document.querySelector(".player-container");
    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const skip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading video...</p>
      </div>
    );
  }

  return (
    <div className="player-container" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={getMediaUrl(movie.video_url)}
        autoPlay
        className="player-video"
      />

      {/* Back Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(-1);
        }}
        className={`back-btn ${showControls ? "visible" : ""}`}
      >
        <i className="icon ion-ios-arrow-back"></i>
        <span>Back</span>
      </button>

      {/* Movie Title */}
      <div className={`video-title ${showControls ? "visible" : ""}`}>
        <h2>{movie.title}</h2>
        {movie.description && <p>{movie.description}</p>}
      </div>

      {/* Play/Pause Overlay */}
      <div className="play-overlay">
        <button
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          className="play-btn-large"
        >
          <i className={`icon ${playing ? "ion-ios-pause" : "ion-ios-play"}`}></i>
        </button>
      </div>

      {/* Controls */}
      <div className={`player-controls ${showControls ? "visible" : ""}`} onClick={(e) => e.stopPropagation()}>
        {/* Progress Bar */}
        <div className="progress-bar" onClick={handleSeek}>
          <div
            className="progress-filled"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>

        {/* Control Buttons */}
        <div className="controls-row">
          <div className="controls-left">
            <button onClick={togglePlay} className="control-btn">
              <i className={`icon ${playing ? "ion-ios-pause" : "ion-ios-play"}`}></i>
            </button>
            
            <button onClick={() => skip(-10)} className="control-btn">
              <i className="icon ion-ios-rewind"></i>
              <span>10</span>
            </button>
            
            <button onClick={() => skip(10)} className="control-btn">
              <i className="icon ion-ios-fastforward"></i>
              <span>10</span>
            </button>

            <div className="volume-control">
              <button className="control-btn">
                <i className={`icon ${volume === 0 ? "ion-ios-volume-off" : "ion-ios-volume-high"}`}></i>
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>

            <span className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="controls-right">
            <button onClick={toggleFullscreen} className="control-btn">
              <i className={`icon ${fullscreen ? "ion-ios-contract" : "ion-ios-expand"}`}></i>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .player-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #000;
          cursor: none;
        }

        .player-video {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .loading-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #fff;
        }

        .spinner {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(229, 9, 20, 0.2);
          border-top-color: #e50914;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .back-btn {
          position: absolute;
          top: 2rem;
          left: 2rem;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          border: none;
          color: #fff;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
          opacity: 0;
          transform: translateY(-20px);
        }

        .back-btn.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .back-btn:hover {
          background: rgba(229, 9, 20, 0.9);
          transform: scale(1.05);
        }

        .video-title {
          position: absolute;
          top: 2rem;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          color: #fff;
          max-width: 800px;
          padding: 0 1rem;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .video-title.visible {
          opacity: 1;
        }

        .video-title h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .video-title p {
          font-size: 0.9rem;
          color: #ccc;
          margin: 0;
        }

        .play-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .play-btn-large {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: rgba(229, 9, 20, 0.9);
          border: none;
          color: #fff;
          font-size: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          pointer-events: all;
          transition: all 0.3s ease;
        }

        .play-btn-large:hover {
          background: #e50914;
          transform: scale(1.1);
        }

        .player-controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
          padding: 3rem 2rem 1.5rem;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .player-controls.visible {
          opacity: 1;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
          margin-bottom: 1rem;
          cursor: pointer;
          position: relative;
        }

        .progress-bar:hover {
          height: 8px;
        }

        .progress-filled {
          height: 100%;
          background: #e50914;
          border-radius: 3px;
          transition: width 0.1s ease;
        }

        .controls-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .controls-left,
        .controls-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .control-btn {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.5rem;
          transition: all 0.3s ease;
          position: relative;
        }

        .control-btn:hover {
          color: #e50914;
          transform: scale(1.1);
        }

        .control-btn span {
          position: absolute;
          font-size: 0.7rem;
          font-weight: 700;
        }

        .volume-control {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .volume-slider {
          width: 80px;
          height: 4px;
          -webkit-appearance: none;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
          outline: none;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          background: #e50914;
          border-radius: 50%;
          cursor: pointer;
        }

        .time-display {
          color: #fff;
          font-size: 0.9rem;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .volume-control {
            display: none;
          }

          .video-title h2 {
            font-size: 1.2rem;
          }

          .video-title p {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default WatchMovie;