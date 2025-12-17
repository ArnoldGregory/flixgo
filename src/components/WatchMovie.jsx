// src/pages/WatchMovie.jsx → FULL CINEMATIC PLAYER (YOUR LOCAL video_url)
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const WatchMovie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const movieId = Number(id);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchMovie = async () => {
      try {
        const res = await axios.get("/api/Content/GetMovies", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const found = (res.data.success ? res.data.data : res.data).find(m => Number(m.id) === movieId);

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

  // Save progress every 5 seconds
  useEffect(() => {
    if (!movie || !videoRef.current) return;

    const save = () => {
      localStorage.setItem(`watch-${movieId}`, videoRef.current.currentTime);
    };

    const interval = setInterval(save, 5000);
    return () => clearInterval(interval);
  }, [movie, movieId]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-black text-white">
      <div className="spinner-border text-danger" style={{ width: "5rem", height: "5rem" }} />
    </div>
  );

  return (
    <div className="position-fixed top-0 start-0 w-100 h-100 bg-black">
      <video
        ref={videoRef}
        src={`https://localhost:7145${movie.video_url}`}
        controls
        autoPlay
        className="w-100 h-100"
        style={{ objectFit: "contain" }}
      />

      {/* Simple Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="position-absolute top-0 start-0 m-4 btn btn-outline-light rounded-pill px-4 py-2 shadow"
        style={{ zIndex: 10 }}
      >
        ← Back
      </button>
    </div>
  );
};

export default WatchMovie;