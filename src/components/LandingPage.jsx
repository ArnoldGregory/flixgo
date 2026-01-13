// src/pages/LandingPage.jsx - ENHANCED VERSION (KEEPING YOUR STRUCTURE)
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/bootstrap-reboot.min.css";
import "../assets/css/bootstrap-grid.min.css";
import "../assets/css/ionicons.min.css";
import "../assets/css/main.css";
import "../assets/css/custom.css";

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState("tab-1");
  const [currentIndex, setCurrentIndex] = useState(0);

  const backgrounds = [
    "/src/assets/img/home/home__bg.jpg",
    "/src/assets/img/home/home__bg2.jpg",
    "/src/assets/img/home/home__bg3.jpg",
    "/src/assets/img/home/home__bg4.jpg",
  ];

  const seasonMovies = [
    { title: "I Dream in Another Language", genres: ["Action", "Thriller"], rating: 8.4, cover: "/src/assets/img/covers/cover.jpg" },
    { title: "Benched", genres: ["Comedy"], rating: 7.1, cover: "/src/assets/img/covers/cover2.jpg" },
    { title: "Whitney", genres: ["Romance", "Drama"], rating: 6.3, cover: "/src/assets/img/covers/cover3.jpg" },
    { title: "Blindspotting", genres: ["Comedy", "Drama"], rating: 7.9, cover: "/src/assets/img/covers/cover4.jpg" },
  ];

  const newItems = [
    {
      title: "I Dream in Another Language",
      genres: ["Action", "Thriller"],
      rating: 8.4,
      quality: "HD",
      age: "16+",
      cover: "/src/assets/img/covers/cover.jpg",
      description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout...",
    },
    {
      title: "Benched",
      genres: ["Comedy"],
      rating: 7.1,
      quality: "HD",
      age: "16+",
      cover: "/src/assets/img/covers/cover2.jpg",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has survived not only five centuries...",
    },
    {
      title: "Whitney",
      genres: ["Romance", "Drama", "Music"],
      rating: 6.3,
      quality: "HD",
      age: "16+",
      cover: "/src/assets/img/covers/cover3.jpg",
      description: "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages...",
    },
    {
      title: "Blindspotting",
      genres: ["Comedy", "Drama"],
      rating: 7.9,
      quality: "HD",
      age: "16+",
      cover: "/src/assets/img/covers/cover4.jpg",
      description: "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text...",
    },
  ];

  const partners = [
    "themeforest-light-background.png",
    "audiojungle-light-background.png",
    "codecanyon-light-background.png",
    "photodune-light-background.png",
    "activeden-light-background.png",
    "3docean-light-background.png",
  ];

  const handlePrev = () => setCurrentIndex((prev) => (prev > 0 ? prev - 1 : seasonMovies.length - 1));
  const handleNext = () => setCurrentIndex((prev) => (prev < seasonMovies.length - 1 ? prev + 1 : 0));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev < seasonMovies.length - 1 ? prev + 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const translateX = -currentIndex * 280;

  return (
    <div className="body">
      {/* USE NEW HEADER COMPONENT */}
      <Header transparent={true} />

      {/* HERO SECTION - Enhanced */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `url(${backgrounds[currentIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
          minHeight: "100vh",
          position: "relative",
          transition: "background-image 1s ease-in-out",
        }}
      >
        <div className="hero-overlay"></div>
        <div className="container text-center" style={{ position: "relative", zIndex: 2, paddingTop: "200px" }}>
          <h1 className="hero__title display-1 fw-bold mb-4">
            Unlimited movies, TV shows, and more
          </h1>
          <p className="hero__subtitle fs-3 mb-5">
            Watch anywhere. Cancel anytime.
          </p>
          <div className="d-flex gap-3 justify-content-center mb-4">
            <Link to="/signup" className="btn btn-danger btn-lg px-5 py-3 rounded-pill">
              <i className="icon ion-ios-play me-2"></i>
              Start Free Trial
            </Link>
            <Link to="/movies" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill">
              Browse Movies
            </Link>
          </div>
          <p className="text-light">Ready to watch? Sign up to start streaming</p>
        </div>
      </section>

      {/* NEW ITEMS OF THIS SEASON - Enhanced Carousel */}
      <section className="home py-5">
        <div className="container position-relative">
          <h1 className="home__title text-start mb-5">
            <b>TRENDING NOW</b>
          </h1>
          <button className="home__nav home__nav--prev" onClick={handlePrev}>
            <i className="icon ion-ios-arrow-round-back"></i>
          </button>
          <button className="home__nav home__nav--next" onClick={handleNext}>
            <i className="icon ion-ios-arrow-round-forward"></i>
          </button>
          <div className="home__carousel-wrap overflow-hidden">
            <div className="home__carousel d-flex" style={{ transform: `translateX(${translateX}px)`, transition: "transform 400ms ease" }}>
              {seasonMovies.map((m, idx) => (
                <div key={idx} className="card card--featured me-3" style={{ minWidth: "260px" }}>
                  <div className="card__cover position-relative">
                    <img src={m.cover} alt={m.title} style={{ width: "100%", height: "360px", objectFit: "cover" }} />
                    <Link to="/movies" className="card__play">
                      <i className="icon ion-ios-play"></i>
                    </Link>
                  </div>
                  <div className="card__content p-3">
                    <h3 className="card__title text-white">{m.title}</h3>
                    <span className="card__category text-muted d-block">{m.genres.join(", ")}</span>
                    <span className="card__rate text-warning">
                      <i className="icon ion-ios-star"></i> {m.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEW ITEMS SECTION */}
      <section className="content py-5">
        <div className="container">
          <h2 className="content__title mb-4">New Releases</h2>
          <ul className="nav nav-tabs content__tabs mb-5">
            <li className="nav-item">
              <a className={`nav-link ${activeTab === "tab-1" ? "active" : ""}`} onClick={() => setActiveTab("tab-1")}>
                NEW RELEASES
              </a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${activeTab === "tab-2" ? "active" : ""}`} onClick={() => setActiveTab("tab-2")}>
                MOVIES
              </a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${activeTab === "tab-3" ? "active" : ""}`} onClick={() => setActiveTab("tab-3")}>
                TV SERIES
              </a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${activeTab === "tab-4" ? "active" : ""}`} onClick={() => setActiveTab("tab-4")}>
                CARTOONS
              </a>
            </li>
          </ul>

          <div className="tab-content">
            <div className="tab-pane show active">
              <div className="row g-4">
                {newItems.map((movie, idx) => (
                  <div key={idx} className="col-md-6 mb-4">
                    <div className="card card--list card--dark bg-dark border-0 rounded-3 overflow-hidden">
                      <div className="row g-0">
                        <div className="col-5">
                          <div className="card__cover">
                            <img src={movie.cover} alt={movie.title} className="w-100 h-100" style={{ objectFit: "cover" }} />
                          </div>
                        </div>
                        <div className="col-7">
                          <div className="card__content p-3">
                            <h3 className="card__title text-white">{movie.title}</h3>
                            <span className="card__category text-muted small">{movie.genres.join(", ")}</span>
                            <p className="card__description text-light small mt-2">{movie.description}</p>
                            <div className="card__meta mt-3">
                              <span className="card__rate text-warning me-3">
                                <i className="icon ion-ios-star"></i> {movie.rating}
                              </span>
                              <span className="card__quality badge bg-success me-2">{movie.quality}</span>
                              <span className="card__age badge bg-warning">{movie.age}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION - New */}
      <section className="features-section py-5" style={{ background: "linear-gradient(135deg, #141414 0%, #1a1a1a 100%)" }}>
        <div className="container">
          <h2 className="section__title text-center mb-5">Why Choose FlixGo?</h2>
          <div className="row g-4">
            <div className="col-md-3">
              <div className="feature-box text-center p-4">
                <i className="icon ion-ios-film display-3 text-danger mb-3"></i>
                <h3 className="h5 text-white mb-2">Unlimited Movies</h3>
                <p className="text-muted">Stream thousands of movies in HD & 4K</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="feature-box text-center p-4">
                <i className="icon ion-ios-tv display-3 text-danger mb-3"></i>
                <h3 className="h5 text-white mb-2">Watch Anywhere</h3>
                <p className="text-muted">On your phone, tablet, laptop, or TV</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="feature-box text-center p-4">
                <i className="icon ion-ios-download display-3 text-danger mb-3"></i>
                <h3 className="h5 text-white mb-2">Download & Go</h3>
                <p className="text-muted">Watch offline on your devices</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="feature-box text-center p-4">
                <i className="icon ion-ios-people display-3 text-danger mb-3"></i>
                <h3 className="h5 text-white mb-2">Multiple Profiles</h3>
                <p className="text-muted">Create profiles for your family</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="section partners py-5">
        <div className="container text-center">
          <h2 className="section__title mb-4">Our Partners</h2>
          <p className="section__text text-muted mb-5">
            Trusted by leading content providers worldwide
          </p>
          <div className="row justify-content-center g-4">
            {partners.map((p, idx) => (
              <div key={idx} className="col-6 col-sm-4 col-md-2">
                <img src={`/src/assets/img/partners/${p}`} alt={p} className="partner__img img-fluid" style={{ maxHeight: "60px", opacity: 0.7, transition: "opacity 0.3s" }} onMouseEnter={(e) => e.target.style.opacity = 1} onMouseLeave={(e) => e.target.style.opacity = 0.7} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USE NEW FOOTER COMPONENT */}
      <Footer />
    </div>
  );
};

export default LandingPage;