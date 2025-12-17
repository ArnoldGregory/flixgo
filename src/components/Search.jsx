// src/pages/Search.jsx → FINAL: PROFESSIONAL SEARCH PAGE (LIKE NETFLIX)
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Search = () => {
  const [allMovies, setAllMovies] = useState([]);
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchMovies = async () => {
      try {
        const res = await axios.get("/api/Content/GetMovies", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setAllMovies(res.data.data);
          setResults(res.data.data);
        }
      } catch (err) {
        alert("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [token, navigate]);

  // LIVE SEARCH
  useEffect(() => {
    if (!query.trim()) {
      setResults(allMovies);
      return;
    }

    const filtered = allMovies.filter(movie =>
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.description.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query, allMovies]);

  const getImageUrl = (url) => url ? `https://localhost:7145${url}` : "/src/assets/img/covers/cover.jpg";

  return (
    <div className="body bg-dark text-white min-vh-100">

      {/* HEADER WITH SEARCH BAR */}
      <header className="header header--transparent position-sticky top-0" style={{ zIndex: 1000, background: "rgba(0,0,0,0.9)" }}>
        <div className="container py-3">
          <div className="d-flex align-items-center justify-content-between">
            <Link to="/" className="header__logo">
              <img src="/src/assets/img/logo.svg" alt="FlixGo" height="40" />
            </Link>

            {/* SEARCH BAR IN HEADER */}
            <input
              type="text"
              placeholder="Search movies, series, actors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="form-control form-control-lg"
              style={{ maxWidth: "600px", background: "#333", border: "none", color: "white" }}
              autoFocus
            />

            <button onClick={() => navigate(-1)} className="btn btn-outline-light">
              Back
            </button>
          </div>
        </div>
      </header>

      {/* RESULTS */}
      <section className="py-5">
        <div className="container">
          <h2 className="mb-4">
            {query ? `Results for "${query}"` : "All Movies"} 
            <span className="text-muted small ms-3">({results.length} found)</span>
          </h2>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-danger" style={{ width: "4rem", height: "4rem" }} />
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-5">
              <h3 className="text-muted">No movies found</h3>
            </div>
          ) : (
            <div className="row g-4">
              {results.map((movie) => (
                <div key={movie.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
                  <Link to={`/movie/${movie.id}`} className="text-decoration-none">
                    <div className="card bg-black border-0 rounded-4 overflow-hidden shadow hover-lift">
                      <img
                        src={getImageUrl(movie.thumb_nail_url)}
                        alt={movie.title}
                        className="w-100"
                        style={{ height: "300px", objectFit: "cover" }}
                        onError={(e) => e.currentTarget.src = "/src/assets/img/covers/cover.jpg"}
                      />
                      <div className="p-3">
                        <h6 className="text-white fw-bold text-truncate">{movie.title}</h6>
                        <small className="text-muted">{movie.release_year} • ★ {movie.rating || "N/A"}</small>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Search;