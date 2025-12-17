// src/pages/Movies.jsx → FINAL 100% FULL CODE — REAL GENRES + YEARS + SEARCH + FILTER
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  // DETERMINE ACTIVE TAB FROM URL
  const getActiveTab = () => {
    if (location.pathname.includes("/series")) return "series";
    if (location.pathname.includes("/cartoons")) return "cartoons";
    return "movies";
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [moviesRes, genresRes] = await Promise.all([
          axios.get("/api/Content/GetMovies", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/Content/GetGenres", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const movieList = moviesRes.data.success ? moviesRes.data.data : moviesRes.data;
        const genreList = genresRes.data.success ? genresRes.data.data : genresRes.data;

        setMovies(movieList);
        setFilteredMovies(movieList);
        setGenres(genreList);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          setError("Failed to load content.");
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  // SEARCH + FILTER LOGIC
  useEffect(() => {
    let results = movies;

    if (searchQuery) {
      results = results.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedGenre) {
      results = results.filter(m => m.genre_id === parseInt(selectedGenre));
    }

    if (selectedYear) {
      results = results.filter(m => m.release_year === parseInt(selectedYear));
    }

    setFilteredMovies(results);
  }, [searchQuery, selectedGenre, selectedYear, movies]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "series") navigate("/series");
    else if (tab === "cartoons") navigate("/cartoons");
    else navigate("/movies");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-danger">
        <h3>{error}</h3>
      </div>
    );
  }

  const newReleases = filteredMovies.slice(0, 6);
  const comingSoon = filteredMovies.slice(3, 9);

  const partners = [
    "themeforest-light-background.png",
    "audiojungle-light-background.png",
    "codecanyon-light-background.png",
    "photodune-light-background.png",
    "activeden-light-background.png",
    "3docean-light-background.png",
  ];

  // CORRECT IMAGE URL
  const getImageUrl = (url) => {
    if (!url) return "/src/assets/img/covers/cover.jpg";
    return `https://localhost:7145${url}`;
  };

  // Extract unique years
  const uniqueYears = [...new Set(movies.map(m => m.release_year))].sort((a, b) => b - a);

  return (
    <div className="body">
      {/* HEADER */}
      <header className="header header--transparent">
        <div className="container">
          <div className="header__content">
            <Link to="/" className="header__logo">
              <img src="/src/assets/img/logo.svg" alt="FlixGo" />
            </Link>
            <ul className="header__nav">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/movies" className="active">Catalog</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/faq">Help</Link></li>
            </ul>
            <div className="header__auth">
              <button onClick={handleLogout} className="header__sign-in">
                <i className="icon ion-ios-log-out"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section
        className="hero-section"
        style={{
          backgroundImage: "url('/src/assets/img/home/home__bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "top center",
          minHeight: "700px",
          position: "relative",
        }}
      >
        <div className="hero-overlay"></div>
        <div className="container text-center" style={{ position: "relative", zIndex: 2 }}>
          <h1 className="hero__title">Welcome to <b>FLIXGO</b></h1>
          <p className="hero__subtitle">Stream the best movies and TV shows instantly.</p>
        </div>
      </section>

      {/* SEARCH + FILTER BAR */}
      <section className="py-4 bg-dark">
        <div className="container">
          <div className="row g-3 align-items-center justify-content-center">
            <div className="col-12 col-md-5">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control form-control-lg"
                style={{ background: "#333", border: "none", color: "white" }}
              />
            </div>
            <div className="col-md-3">
              <select className="form-select form-select-lg" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
                <option value="">All Genres</option>
                {genres.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select className="form-select form-select-lg" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                <option value="">All Years</option>
                {uniqueYears.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* TABS */}
      <section className="content py-5 bg-dark">
        <div className="container">
          <ul className="nav nav-tabs content__tabs justify-content-center mb-5">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "new" ? "active" : ""}`}
                onClick={() => handleTabClick("new")}
              >
                NEW RELEASES
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "movies" ? "active" : ""}`}
                onClick={() => handleTabClick("movies")}
              >
                MOVIES
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "series" ? "active" : ""}`}
                onClick={() => handleTabClick("series")}
              >
                TV SERIES
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "cartoons" ? "active" : ""}`}
                onClick={() => handleTabClick("cartoons")}
              >
                CARTOONS
              </button>
            </li>
          </ul>

          {/* TOP RATED CAROUSEL */}
          <div className="mb-5">
            <h1 className="home__title text-start mb-4 text-white">
              <b>TOP RATED</b> MOVIES
            </h1>
            <div className="position-relative">
              <div className="home__carousel-wrap overflow-hidden">
                <div className="home__carousel d-flex">
                  {filteredMovies.map((m) => (
                    <Link key={m.id} to={`/movie/${m.id}`} className="text-decoration-none">
                      <div className="card card--featured me-3" style={{ minWidth: "260px" }}>
                        <div className="card__cover position-relative">
                          <img
                            src={getImageUrl(m.thumb_nail_url)}
                            alt={m.title}
                            className="w-100"
                            style={{ height: "360px", objectFit: "cover" }}
                            onError={(e) => (e.currentTarget.src = "/src/assets/img/covers/cover.jpg")}
                          />
                          <div className="card__play">
                            <i className="icon ion-ios-play"></i>
                          </div>
                        </div>
                        <div className="card__content p-3">
                          <h3 className="card__title text-truncate text-white">{m.title}</h3>
                          <span className="card__category d-block text-muted small">
                            {m.genres || "Action"}
                          </span>
                          <span className="card__rate text-warning">
                            <i className="icon ion-ios-star"></i> {m.rating || "N/A"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* NEW RELEASES GRID */}
          <h2 className="content__title text-white mb-4">New Releases</h2>
          <div className="row">
            {newReleases.map((movie) => (
              <div key={movie.id} className="col-md-6 mb-4">
                <Link to={`/movie/${movie.id}`} className="text-decoration-none">
                  <div className="card card--list card--dark">
                    <div className="row g-0">
                      <div className="col-5">
                        <div className="card__cover">
                          <img
                            src={getImageUrl(movie.thumb_nail_url)}
                            alt={movie.title}
                            className="w-100 h-100"
                            style={{ objectFit: "cover" }}
                            onError={(e) => (e.currentTarget.src = "/src/assets/img/covers/cover.jpg")}
                          />
                        </div>
                      </div>
                      <div className="col-7">
                        <div className="card__content p-3">
                          <h3 className="card__title text-white">{movie.title}</h3>
                          <span className="card__category text-muted small">
                            {movie.genres || "Drama"}
                          </span>
                          <p className="card__description text-light small mt-2">
                            {movie.description || "No description available."}
                          </p>
                          <div className="card__meta mt-3">
                            <span className="card__rate text-warning">
                              <i className="icon ion-ios-star"></i> {movie.rating || "N/A"}
                            </span>
                            <span className="card__quality ms-3">HD</span>
                            <span className="card__age ms-3">16+</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMING SOON */}
      <section
        className="section py-5"
        style={{
          backgroundImage: "url('/src/assets/img/section/section.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container text-center">
          <h2 className="section__title text-white">Coming Soon</h2>
          <div className="row justify-content-center">
            {comingSoon.map((m) => (
              <div key={m.id} className="col-md-2 col-sm-4 mb-4">
                <Link to={`/movie/${m.id}`} className="text-decoration-none">
                  <div className="card card--featured">
                    <div className="card__cover">
                      <img
                        src={getImageUrl(m.thumb_nail_url)}
                        alt={m.title}
                        className="w-100"
                        style={{ height: "300px", objectFit: "cover" }}
                        onError={(e) => (e.currentTarget.src = "/src/assets/img/covers/cover.jpg")}
                      />
                    </div>
                    <div className="card__content p-3 text-center">
                      <h3 className="card__title text-white">{m.title}</h3>
                      <p className="card__category text-muted small">{m.genres || "N/A"}</p>
                      <span className="card__rate text-warning">
                        <i className="icon ion-ios-star"></i> {m.rating || "N/A"}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="section partners">
        <div className="container text-center">
          <h2 className="section__title">Our Partners</h2>
          <p className="section__text">
            It is a long <b>established</b> fact that a reader will be distracted by readable content.
          </p>
          <div className="row justify-content-center">
            {partners.map((p) => (
              <div key={p} className="col-6 col-sm-4 col-md-2 mb-4">
                <img src={`/src/assets/img/partners/${p}`} alt={p} className="partner__img" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer py-5 bg-dark text-white">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-3">
              <h6 className="footer__title">Download Our App</h6>
              <ul className="footer__app list-unstyled d-flex gap-2">
                <li><a href="#"><img src="/src/assets/img/Download_on_the_App_Store_Badge.svg" alt="App Store" style={{ height: "40px" }} /></a></li>
                <li><a href="#"><img src="/src/assets/img/google-play-badge.png" alt="Google Play" style={{ height: "40px" }} /></a></li>
              </ul>
            </div>
            <div className="col-6 col-sm-4 col-md-3">
              <h6 className="footer__title">Resources</h6>
              <ul className="footer__list list-unstyled">
                <li><a href="#" className="text-white">About Us</a></li>
                <li><a href="#" className="text-white">Pricing Plan</a></li>
                <li><a href="#" className="text-white">Help</a></li>
              </ul>
            </div>
            <div className="col-6 col-sm-4 col-md-3">
              <h6 className="footer__title">Legal</h6>
              <ul className="footer__list list-unstyled">
                <li><a href="#" className="text-white">Terms of Use</a></li>
                <li><a href="#" className="text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-white">Security</a></li>
              </ul>
            </div>
            <div className="col-12 col-sm-4 col-md-3">
              <h6 className="footer__title">Contact</h6>
              <ul className="footer__list list-unstyled mb-3">
                <li><a href="tel:+18002345678" className="text-white">+1 (800) 234-5678</a></li>
                <li><a href="mailto:support@flixgo.com" className="text-white">support@flixgo.com</a></li>
              </ul>
              <ul className="footer__social d-flex gap-3">
                <li><a href="#" className="text-white"><i className="icon ion-logo-facebook"></i></a></li>
                <li><a href="#" className="text-white"><i className="icon ion-logo-instagram"></i></a></li>
                <li><a href="#" className="text-white"><i className="icon ion-logo-twitter"></i></a></li>
              </ul>
            </div>
          </div>
          <div className="footer__bottom text-center mt-4">
            <p className="mb-0">© 2025 FlixGo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Movies;