// src/pages/MovieList.jsx - ENHANCED WITH NEW COMPONENTS
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { contentService } from "../services/apiService";
import Header from "../components/Header";
import MovieCard from "../components/MovieCard";
import { PageLoader, SkeletonGrid } from "../components/LoadingSpinner";
import { useToast, ToastContainer } from "../components/Toast";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const getActiveTab = () => {
    if (location.pathname.includes("/series")) return "series";
    if (location.pathname.includes("/cartoons")) return "cartoons";
    return "movies";
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, genresRes] = await Promise.all([
          contentService.getMovies(),
          contentService.getGenres()
        ]);

        const movieList = moviesRes.data.success ? moviesRes.data.data : moviesRes.data;
        const genreList = genresRes.data.success ? genresRes.data.data : genresRes.data;

        setMovies(movieList);
        setFilteredMovies(movieList);
        setGenres(genreList);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/login");
        } else {
          toast.error("Failed to load movies. Please try again.");
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "series") navigate("/series");
    else if (tab === "cartoons") navigate("/cartoons");
    else navigate("/movies");
  };

  const uniqueYears = [...new Set(movies.map(m => m.release_year))].sort((a, b) => b - a);

  if (loading) {
    return <PageLoader message="Loading movies..." />;
  }

  return (
    <div className="body bg-dark text-white">
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
      
      {/* HEADER */}
      <Header />

      {/* HERO SECTION */}
      <section
        className="hero-section"
        style={{
          backgroundImage: "url('/src/assets/img/home/home__bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "top center",
          minHeight: "500px",
          position: "relative",
          marginTop: "80px",
        }}
      >
        <div className="hero-overlay"></div>
        <div className="container text-center" style={{ position: "relative", zIndex: 2, paddingTop: "120px" }}>
          <h1 className="hero__title display-3 fw-bold">Discover Amazing Movies</h1>
          <p className="hero__subtitle fs-4">Stream thousands of movies in HD quality</p>
        </div>
      </section>

      {/* SEARCH + FILTER BAR */}
      <section className="py-4 bg-black">
        <div className="container">
          <div className="row g-3 align-items-center justify-content-center">
            <div className="col-12 col-md-5">
              <div className="search-input-wrapper">
                <i className="icon ion-ios-search search-icon"></i>
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control form-control-lg search-input"
                />
              </div>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select form-select-lg filter-select" 
                value={selectedGenre} 
                onChange={(e) => setSelectedGenre(e.target.value)}
              >
                <option value="">All Genres</option>
                {genres.map(g => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <select 
                className="form-select form-select-lg filter-select" 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
              >
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
      <section className="content py-5">
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

          {/* MOVIES GRID */}
          <div className="row">
            <div className="col-12">
              <h2 className="section__title mb-4">
                {filteredMovies.length} Movies Found
              </h2>
            </div>
          </div>

          {filteredMovies.length === 0 ? (
            <div className="text-center py-5">
              <i className="icon ion-ios-film display-1 text-muted mb-3"></i>
              <h3 className="text-muted">No movies found</h3>
              <p className="text-muted">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="movies-grid">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} type="movie" />
              ))}
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.3) 0%,
            rgba(0, 0, 0, 0.8) 100%
          );
        }

        .search-input-wrapper {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.5rem;
          color: #999;
          pointer-events: none;
        }

        .search-input {
          background: #1a1a1a;
          border: 2px solid transparent;
          color: white;
          padding-left: 3rem;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          background: #222;
          border-color: #e50914;
          box-shadow: 0 0 20px rgba(229, 9, 20, 0.2);
        }

        .filter-select {
          background: #1a1a1a;
          border: 2px solid transparent;
          color: white;
          transition: all 0.3s ease;
        }

        .filter-select:focus {
          background: #222;
          border-color: #e50914;
          box-shadow: 0 0 20px rgba(229, 9, 20, 0.2);
        }

        .content__tabs {
          border: none;
          gap: 1rem;
        }

        .nav-link {
          background: transparent;
          border: 2px solid #333;
          color: #999;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .nav-link:hover {
          border-color: #e50914;
          color: #fff;
        }

        .nav-link.active {
          background: #e50914;
          border-color: #e50914;
          color: #fff;
        }

        .movies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        @media (max-width: 768px) {
          .movies-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 1rem;
          }
        }

        .section__title {
          color: #fff;
          font-weight: 700;
          font-size: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default Movies;