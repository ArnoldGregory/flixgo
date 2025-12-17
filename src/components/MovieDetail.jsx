// src/pages/MovieDetail.jsx → FINAL CLEAN & PREMIUM (YOUR STYLE)
import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const videoRef = useRef(null);

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

        const allMovies = res.data?.success ? res.data.data : res.data;
        const found = allMovies.find(m => Number(m.id) === movieId);

        if (!found) {
          alert("Movie not found");
          navigate("/movies");
          return;
        }

        setMovie(found);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Failed to load movie");
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId, token, navigate]);

  // Stop video when modal closes
  useEffect(() => {
    if (!showTrailer && videoRef.current) {
      videoRef.current.pause();
    }
  }, [showTrailer]);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-black text-white">
      <div className="loader"></div>
    </div>
  );

  if (!movie) return null;

  return (
    <div className="body bg-black text-white">

      {/* HERO — CLEAN & CINEMATIC */}
      <section
        className="position-relative"
        style={{
          minHeight: "90vh",
          backgroundImage: `url(${movie.backdrop_url || movie.poster_url || "/src/assets/img/home/home__bg.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Dark overlay */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: "linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
          }}
        />

        <div className="container position-relative" style={{ zIndex: 2, paddingTop: "140px" }}>
          <div className="row align-items-center">
            {/* Poster */}
            <div className="col-lg-4">
              <img
                src={movie.poster_url || "/src/assets/img/covers/cover.jpg"}
                alt={movie.title}
                className="img-fluid rounded-4 shadow-lg"
                style={{ maxHeight: "580px", objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)" }}
              />
            </div>

            {/* Info */}
            <div className="col-lg-8 mt-5 mt-lg-0">
              <h1 className="display-3 fw-bold mb-4" style={{ lineHeight: "1.1" }}>
                {movie.title}
              </h1>

              <div className="d-flex gap-4 mb-4 fs-5 text-light">
                <span className="text-warning fw-bold">★★★★★ {movie.rating || "8.7"}</span>
                {movie.year && <span>• {movie.year}</span>}
                {movie.duration && <span>• {movie.duration} min</span>}
              </div>

              <p className="lead fs-4 mb-5 text-light" style={{ maxWidth: "700px", lineHeight: "1.7" }}>
                {movie.description || "No description available."}
              </p>

              {/* Buttons */}
              <div className="d-flex gap-3">
                <Link
                  to={`/watch/movie/${movie.id}`}
                  className="btn btn-danger btn-lg px-5 py-3 rounded-pill fw-bold"
                >
                  Play Movie
                </Link>

                {movie.trailer_url && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill"
                  >
                    Play Trailer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRAILER MODAL — CLEAN & SIMPLE */}
      {showTrailer && movie.trailer_url && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-black bg-opacity-95"
          style={{ zIndex: 9999 }}
          onClick={() => setShowTrailer(false)}
        >
          <div className="position-relative" style={{ width: "90%", maxWidth: "1100px" }}>
            {/* Small close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTrailer(false);
              }}
              className="position-absolute top-2 end-2 btn btn-dark rounded-circle d-flex align-items-center justify-content-center shadow"
              style={{ width: "40px", height: "40px", zIndex: 10 }}
            >
              ×
            </button>

            <video
              ref={videoRef}
              src={`https://localhost:7145${movie.trailer_url}`}
              controls
              autoPlay
              className="w-100 rounded-4 shadow-lg"
              style={{ maxHeight: "85vh", background: "#000" }}
            />
          </div>
        </div>
      )}

      {/* About */}
      <section className="py-5 bg-dark">
        <div className="container">
          <h2 className="display-6 fw-bold mb-4 text-danger">About This Movie</h2>
          <p className="lead text-light">{movie.description}</p>
        </div>
      </section>

      <footer className="py-5 text-center text-muted border-top border-secondary">
        © 2025 FLIXGO • All Rights Reserved
      </footer>
    </div>
  );
};

export default MovieDetail;