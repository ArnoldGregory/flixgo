// src/pages/Series.jsx - ENHANCED WITH COMPONENTS
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { contentService } from "../services/apiService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MovieCard from "../components/MovieCard";
import { PageLoader, SkeletonGrid } from "../components/LoadingSpinner";
import { useToast, ToastContainer } from "../components/Toast";

const Series = () => {
  const [series, setSeries] = useState([]);
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [seriesRes, genresRes] = await Promise.all([
          contentService.getSeries(),
          contentService.getGenres()
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
          toast.error("Session expired. Please login again.");
          navigate("/login");
        } else {
          toast.error("Failed to load TV series");
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // SEARCH + GENRE FILTER
  useEffect(() => {
    let results = series;

    if (searchQuery) {
      results = results.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedGenre) {
      results = results.filter(s => s.genre_id === parseInt(selectedGenre));
    }

    setFilteredSeries(results);
  }, [searchQuery, selectedGenre, series]);

  if (loading) return <PageLoader message="Loading TV series..." />;

  return (
    <div className="body">
      <Header />
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />

      {/* HERO SECTION */}
      <section className="series-hero">
        <div className="hero-bg" style={{ backgroundImage: "url('/src/assets/img/home/home__bg.jpg')" }} />
        <div className="hero-overlay" />
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">TV Series</h1>
            <p className="hero-subtitle">Binge-watch your favorite shows</p>
          </div>
        </div>
      </section>

      {/* SEARCH + FILTER */}
      <section className="search-section">
        <div className="container">
          <div className="search-bar">
            <div className="search-input-wrapper">
              <i className="icon ion-ios-search"></i>
              <input
                type="text"
                placeholder="Search TV series..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <select 
              className="genre-select" 
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
      </section>

      {/* SERIES GRID */}
      <section className="series-grid-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              {filteredSeries.length} Series Found
            </h2>
          </div>

          {filteredSeries.length === 0 ? (
            <div className="empty-state">
              <i className="icon ion-ios-tv"></i>
              <h3>No series found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="series-grid">
              {filteredSeries.map((show) => (
                <MovieCard key={show.id} movie={show} type="series" />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .body {
          background: #0a0a0a;
          min-height: 100vh;
        }

        .series-hero {
          position: relative;
          min-height: 500px;
          display: flex;
          align-items: center;
          margin-top: 80px;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-size: cover;
          background-position: center;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.7), #0a0a0a);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 4rem 0;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 900;
          color: #fff;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }

        .hero-subtitle {
          font-size: 1.5rem;
          color: #ccc;
        }

        .search-section {
          padding: 2rem 0;
          background: #000;
        }

        .search-bar {
          display: flex;
          gap: 1rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .search-input-wrapper {
          flex: 1;
          position: relative;
        }

        .search-input-wrapper i {
          position: absolute;
          left: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.5rem;
          color: #999;
        }

        .search-input {
          width: 100%;
          background: #1a1a1a;
          border: 2px solid transparent;
          border-radius: 50px;
          padding: 1rem 1.5rem 1rem 4rem;
          color: #fff;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #e50914;
          background: #222;
          box-shadow: 0 0 20px rgba(229, 9, 20, 0.2);
        }

        .genre-select {
          background: #1a1a1a;
          border: 2px solid transparent;
          border-radius: 50px;
          padding: 1rem 2rem;
          color: #fff;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 200px;
        }

        .genre-select:focus {
          outline: none;
          border-color: #e50914;
          background: #222;
        }

        .series-grid-section {
          padding: 4rem 0;
        }

        .section-header {
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 900;
          color: #fff;
        }

        .series-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 2rem;
        }

        .empty-state {
          text-align: center;
          padding: 5rem 2rem;
        }

        .empty-state i {
          font-size: 5rem;
          color: #333;
          margin-bottom: 1.5rem;
        }

        .empty-state h3 {
          color: #fff;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: #999;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .search-bar {
            flex-direction: column;
          }

          .genre-select {
            width: 100%;
          }

          .series-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Series;