import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { contentService, getMediaUrl } from "../services/apiService";
import config from "../config/config";

const WatchMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  const token = localStorage.getItem(config.STORAGE_KEYS.TOKEN);
  const movieId = Number(id);

  // Fetch movie
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
      } catch (err) {
        console.error('Error loading movie:', err);
        alert("Failed to load video");
        navigate(-1);
      }
    };

    fetchMovie();
  }, [movieId, token, navigate]);

  // Setup video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime) {
        setCurrentTime(video.currentTime);
      }
    };

    const handleDurationChange = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
        console.log('Duration set:', video.duration);
      }
    };

    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
        console.log('Metadata loaded, duration:', video.duration);
      }
      const saved = localStorage.getItem(`watch-${movieId}`);
      if (saved) {
        video.currentTime = parseFloat(saved);
      }
    };

    const handleCanPlay = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
        console.log('Can play, duration:', video.duration);
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setShowControls(true);
    };

    // Add all listeners
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("durationchange", handleDurationChange);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    // Force check duration
    if (video.duration && !isNaN(video.duration)) {
      setDuration(video.duration);
    }

    // Cleanup
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("durationchange", handleDurationChange);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, [movieId]);

  // Save progress periodically
  useEffect(() => {
    if (!movie || !videoRef.current) return;

    const interval = setInterval(() => {
      if (videoRef.current && videoRef.current.currentTime > 0) {
        localStorage.setItem(`watch-${movieId}`, videoRef.current.currentTime.toString());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [movie, movieId]);

  // Auto-hide controls
  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      return;
    }

    const handleActivity = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleActivity);
      container.addEventListener("click", handleActivity);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleActivity);
        container.removeEventListener("click", handleActivity);
      }
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Toggle play/pause
  const togglePlay = async (e) => {
    if (e) e.stopPropagation();
    
    const video = videoRef.current;
    if (!video) return;

    try {
      if (video.paused) {
        await video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    } catch (err) {
      console.error('Play/Pause error:', err);
    }
  };

  // Seek to position
  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * duration;
    video.currentTime = newTime;
  };

  // Volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  // Toggle mute
  const toggleMute = () => {
    const newVolume = volume === 0 ? 1 : 0;
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  // Fullscreen
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error('Fullscreen error:', err);
      });
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  // Skip forward/backward
  const skip = (seconds) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  };

  // Format time
  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid rgba(147, 51, 234, 0.2)',
          borderTopColor: '#9333ea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1rem'
        }}></div>
        <p>Loading video...</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000',
        overflow: 'hidden',
        cursor: showControls ? 'default' : 'none'
      }}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={getMediaUrl(movie.video_url)}
        onClick={togglePlay}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          cursor: 'pointer'
        }}
      />

      {/* Back Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(-1);
        }}
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#fff',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          zIndex: 100,
          opacity: showControls ? 1 : 0,
          transform: showControls ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'all 0.3s ease',
          pointerEvents: showControls ? 'all' : 'none'
        }}
      >
        <i className="icon ion-ios-arrow-back"></i>
        <span>Back</span>
      </button>

      {/* Movie Title */}
      <div
        style={{
          position: 'absolute',
          top: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          color: '#fff',
          maxWidth: '800px',
          padding: '0 1rem',
          opacity: showControls ? 1 : 0,
          transition: 'opacity 0.3s ease',
          zIndex: 90,
          pointerEvents: 'none'
        }}
      >
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          marginBottom: '0.5rem',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
        }}>{movie.title}</h2>
        {movie.description && (
          <p style={{
            fontSize: '0.9rem',
            color: '#ccc',
            margin: 0,
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
          }}>{movie.description}</p>
        )}
      </div>

      {/* Center Play/Pause Button - Only show when NOT playing */}
      {!isPlaying && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 50,
            pointerEvents: 'all'
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay(e);
            }}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(147, 51, 234, 0.9)',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              color: '#fff',
              fontSize: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingLeft: '0.25rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(147, 51, 234, 0.5)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(147, 51, 234, 1)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(147, 51, 234, 0.9)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <i className="icon ion-ios-play"></i>
          </button>
        </div>
      )}

      {/* Bottom Controls */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.7) 50%, transparent 100%)',
          padding: '4rem 2rem 1.5rem',
          opacity: showControls ? 1 : 0,
          transition: 'opacity 0.3s ease',
          zIndex: 80,
          pointerEvents: showControls ? 'all' : 'none'
        }}
      >
        {/* Progress Bar */}
        <div
          onClick={handleSeek}
          onMouseDown={(e) => {
            const handleMouseMove = (moveEvent) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = Math.max(0, Math.min(1, (moveEvent.clientX - rect.left) / rect.width));
              if (videoRef.current && duration) {
                videoRef.current.currentTime = pos * duration;
              }
            };
            
            const handleMouseUp = () => {
              document.removeEventListener('mousemove', handleMouseMove);
              document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
          style={{
            width: '100%',
            padding: '0.75rem 0',
            marginBottom: '1rem',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '100%',
            height: '5px',
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '3px',
            position: 'relative'
          }}>
            <div style={{
              height: '100%',
              background: '#9333ea',
              borderRadius: '3px',
              width: `${progressPercentage}%`,
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                right: '-6px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '14px',
                height: '14px',
                background: '#fff',
                borderRadius: '50%',
                boxShadow: '0 0 8px rgba(0, 0, 0, 0.5)',
                transition: 'transform 0.1s ease'
              }}></div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'all 0.2s ease'
              }}
            >
              <i className={`icon ${isPlaying ? "ion-ios-pause" : "ion-ios-play"}`}></i>
            </button>

            {/* Rewind */}
            <button
              onClick={() => skip(-10)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'all 0.2s ease'
              }}
            >
              <i className="icon ion-ios-rewind"></i>
            </button>

            {/* Forward */}
            <button
              onClick={() => skip(10)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '4px',
                transition: 'all 0.2s ease'
              }}
            >
              <i className="icon ion-ios-fastforward"></i>
            </button>

            {/* Volume */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <button
                onClick={toggleMute}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i className={`icon ${volume === 0 ? "ion-ios-volume-off" : "ion-ios-volume-high"}`}></i>
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                style={{
                  width: '80px',
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '2px',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* Time Display */}
            <span style={{
              color: '#fff',
              fontSize: '0.95rem',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              minWidth: '120px'
            }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <i className={`icon ${fullscreen ? "ion-ios-contract" : "ion-ios-expand"}`}></i>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default WatchMovie;