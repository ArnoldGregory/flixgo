// src/pages/Series.jsx → FINAL 100% COMPLETE — REAL POSTERS + SEARCH + GENRE FILTER
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Series = () => {
  const [series, setSeries] = useState([]);
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const getActiveTab = () => {
    if (location.pathname.includes("/series")) return "series";
    if (location.pathname.includes("/cartoons")) return "cartoons";
    if (location.pathname.includes("/movies")) return "movies";
    return "new";
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [seriesRes, genresRes] = await Promise.all([
          axios.get("/api/Content/GetSeries", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/api/Content/GetGenres", { headers: { Authorization: `Bearer ${token}` } })
        ]);

        let seriesList = [];
        if (seriesRes.data?.success && Array.isArray(seriesRes.data.data)) {
          seriesList = seriesRes.data.data;
        } else if (Array.isArray(seriesRes.data)) {
          seriesList = seriesRes.data;
        }

        const genreList = genresRes.data?.success ? genresRes.data.data : genresRes.data;

        const activeSeries = seriesList.filter(s => s.is_active !== false);

        setSeries(activeSeries);
        setFilteredSeries(activeSeries);
        setGenres(Array.isArray(genreList) ? genreList : []);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/login");
        } else {
          setError("Failed to load series.");
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  // SEARCH + GENRE FILTER
  useEffect(() => {
    let results = series;

    if (searchQuery) {
      results = results.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedGenre) {
      results = results.filter(s => s.genre_id === parseInt(selectedGenre));
    }

    setFilteredSeries(results);
  }, [searchQuery, selectedGenre, series]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "series") navigate("/series");
    else if (tab === "cartoons") navigate("/cartoons");
    else if (tab === "movies") navigate("/movies");
    else navigate("/");
  };

  const getImageUrl = (url) => {
    if (!url) return "/src/assets/img/covers/cover.jpg";
    return `https://localhost:7145${url}`;
  };

  const partners = [
    "themeforest-light-background.png",
    "audiojungle-light-background.png",
    "codecanyon-light-background.png",
    "photodune-light-background.png",
    "activeden-light-background.png",
    "3docean-light-background.png",
  ];

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

  return (
    <div className="body bg-dark text-white">
      {/* HEADER */}
      <header className="header header--transparent">
        <div className="container">
          <div className="header__content">
            <Link to="/" className="header__logo">
              <img src="/src/assets/img/logo.svg" alt="FlixGo" />
            </Link>
            <ul className="header__nav">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/movies">Catalog</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/faq">Help</Link></li>
            </ul>
            <div className="header__auth">
              <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="header__sign-in">
                <i className="icon ion-ios-log-out"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero-section" style={{ backgroundImage: "url('/src/assets/img/home/home__bg.jpg')", backgroundSize: "cover", minHeight: "700px", position: "relative" }}>
        <div className="hero-overlay"></div>
        <div className="container text-center" style={{ position: "relative", zIndex: 2, paddingTop: "200px" }}>
          <h1 className="hero__title display-3 fw-bold">TV Series</h1>
          <p className="hero__subtitle fs-4">Binge-watch complete seasons</p>
        </div>
      </section>

      {/* TABS */}
      <section className="content py-5">
        <div className="container">
          <ul className="nav nav-tabs content__tabs justify-content-center mb-5">
            <li className="nav-item"><button className={`nav-link ${activeTab === "new" ? "active" : ""}`} onClick={() => handleTabClick("new")}>NEW RELEASES</button></li>
            <li className="nav-item"><button className={`nav-link ${activeTab === "movies" ? "active" : ""}`} onClick={() => handleTabClick("movies")}>MOVIES</button></li>
            <li className="nav-item"><button className={`nav-link ${activeTab === "series" ? "active" : ""}`} onClick={() => handleTabClick("series")}>TV SERIES</button></li>
            <li className="nav-item"><button className={`nav-link ${activeTab === "cartoons" ? "active" : ""}`} onClick={() => handleTabClick("cartoons")}>CARTOONS</button></li>
          </ul>

          {/* SEARCH + GENRE FILTER */}
          <div className="row justify-content-center mb-5">
            <div className="col-12 col-md-6">
              <input
                type="text"
                placeholder="Search series..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control form-control-lg text-center"
                style={{ background: "#333", border: "none", color: "white" }}
              />
            </div>
            <div className="col-12 col-md-3">
              <select
                className="form-select form-select-lg"
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="">All Genres</option>
                {genres.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
          </div>

          <h2 className="content__title mb-5">All TV Series</h2>

          {/* GRID — EXACT SAME CARD STYLE AS MOVIES PAGE */}
          <div className="row g-4">
            {filteredSeries.length === 0 ? (
              <div className="col-12 text-center py-5">
                <h4 className="text-muted">No series available yet.</h4>
              </div>
            ) : (
              filteredSeries.map((s) => (
                <div key={s.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
                  <Link to={`/series/${Number(s.id)}`} className="text-decoration-none">
                    <div className="card bg-black border-0 rounded-3 overflow-hidden shadow-sm hover-lift position-relative">
                      {/* Poster */}
                      <div className="card__cover position-relative">
                        <img
                          src={getImageUrl(s.poster_url)}
                          alt={s.title}
                          className="w-100"
                          style={{ height: "300px", objectFit: "cover" }}
                          onError={(e) => e.currentTarget.src = "/src/assets/img/covers/cover.jpg"}
                        />
                        <div className="card__play">
                          <i className="icon ion-ios-play"></i>
                        </div>
                      </div>

                      {/* Content BELOW the image — EXACTLY LIKE MOVIES */}
                      <div className="card__content p-3 text-center text-md-start">
                        <h3 className="card__title text-white text-truncate fs-6 fw-bold">
                          {s.title}
                        </h3>
                        <span className="card__category text-muted small d-block">
                          {s.total_seasons || 1} Season{s.total_seasons > 1 ? "s" : ""}
                        </span>
                        <span className="card__rate text-warning mt-1 d-inline-block">
                          <i className="icon ion-ios-star"></i> {s.rating || "N/A"}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="section partners py-5">
        <div className="container text-center">
          <h2 className="section__title text-white">Our Partners</h2>
          <p className="section__text text-light">
            It is a long <b>established</b> fact that a reader will be distracted by readable content.
          </p>
          <div className="row justify-content-center">
            {partners.map((p) => (
              <div key={p} className="col-6 col-sm-4 col-md-2 mb-4">
                <img src={`/src/assets/img/partners/${p}`} alt={p} className="partner__img img-fluid" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FULL FOOTER */}
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

export default Series;