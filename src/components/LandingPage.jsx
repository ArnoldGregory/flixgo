import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
    { title: "I Dream in Another Language", genres: ["Action", "Triler"], rating: 8.4, cover: "/src/assets/img/covers/cover.jpg" },
    { title: "Benched", genres: ["Comedy"], rating: 7.1, cover: "/src/assets/img/covers/cover2.jpg" },
    { title: "Whitney", genres: ["Romance", "Drama"], rating: 6.3, cover: "/src/assets/img/covers/cover3.jpg" },
    { title: "Blindspotting", genres: ["Comedy", "Drama"], rating: 7.9, cover: "/src/assets/img/covers/cover4.jpg" },
  ];

  const newItems = [
    {
      title: "I Dream in Another Language",
      genres: ["Action", "Triler"],
      rating: 8.4,
      quality: "HD",
      age: "16+",
      cover: "/src/assets/img/covers/cover.jpg",
      description:
        "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout...",
    },
    {
      title: "Benched",
      genres: ["Comedy"],
      rating: 7.1,
      quality: "HD",
      age: "16+",
      cover: "/src/assets/img/covers/cover2.jpg",
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. It has survived not only five centuries...",
    },
    {
      title: "Whitney",
      genres: ["Romance", "Drama", "Music"],
      rating: 6.3,
      quality: "HD",
      age: "16+",
      cover: "/src/assets/img/covers/cover3.jpg",
      description:
        "It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages...",
    },
    {
      title: "Blindspotting",
      genres: ["Comedy", "Drama"],
      rating: 7.9,
      quality: "HD",
      age: "16+",
      cover: "/src/assets/img/covers/cover4.jpg",
      description:
        "Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text...",
    },
    {
      title: "I Dream in Another Language",
      genres: ["Action", "Triler"],
      rating: 8.4,
      quality: "HD",
      age: "16+",
      cover: "/src/assets/img/covers/cover5.jpg",
      description:
        "There are many variations of passages of Lorem Ipsum available, but most have suffered alteration in some form...",
    },
    {
      title: "Benched",
      genres: ["Comedy"],
      rating: 7.1,
      quality: "HD",
      age: "16+",
      cover: "/src/assets/img/covers/cover6.jpg",
      description:
        "All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary...",
    },
  ];

  const expectedPremieres = seasonMovies.concat(seasonMovies);

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
  }, [seasonMovies.length]);

  const translateX = -currentIndex * 280;

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
              <li><Link to="/movies">Catalog</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/faq">Help</Link></li>
            </ul>
            <div className="header__auth">
              <Link to="/login" className="header__sign-in"><i className="icon ion-ios-log-in"></i><span>Sign In</span></Link>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `url(${backgrounds[currentIndex]})`,
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

      {/* NEW ITEMS OF THIS SEASON */}
      <section className="home">
        <div className="container text-center position-relative">
          <h1 className="home__title text-start"><b>NEW ITEMS</b> OF THIS SEASON</h1>
          <button className="home__nav home__nav--prev" onClick={handlePrev}><i className="icon ion-ios-arrow-round-back"></i></button>
          <button className="home__nav home__nav--next" onClick={handleNext}><i className="icon ion-ios-arrow-round-forward"></i></button>
          <div className="home__carousel-wrap">
            <div className="home__carousel" style={{ transform: `translateX(${translateX}px)`, transition: "transform 400ms ease" }}>
              {seasonMovies.map((m) => (
                <div key={m.title} className="card card--featured">
                  <div className="card__cover">
                    <img src={m.cover} alt={m.title} />
                    <Link to="/movies" className="card__play"><i className="icon ion-ios-play"></i></Link>
                  </div>
                  <div className="card__content">
                    <h3 className="card__title">{m.title}</h3>
                    <span className="card__category">{m.genres.join(", ")}</span>
                    <span className="card__rate"><i className="icon ion-ios-star"></i>{m.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEW ITEMS SECTION */}
      <section className="content">
        <div className="container">
          <h2 className="content__title">New Items</h2>
          <ul className="nav nav-tabs content__tabs">
            <li className="nav-item"><a className={`nav-link ${activeTab === "tab-1" ? "active" : ""}`} onClick={() => setActiveTab("tab-1")}>NEW RELEASES</a></li>
            <li className="nav-item"><a className={`nav-link ${activeTab === "tab-2" ? "active" : ""}`} onClick={() => setActiveTab("tab-2")}>MOVIES</a></li>
            <li className="nav-item"><a className={`nav-link ${activeTab === "tab-3" ? "active" : ""}`} onClick={() => setActiveTab("tab-3")}>TV SERIES</a></li>
            <li className="nav-item"><a className={`nav-link ${activeTab === "tab-4" ? "active" : ""}`} onClick={() => setActiveTab("tab-4")}>CARTOONS</a></li>
          </ul>

          <div className="tab-content mt-4">
            <div className="tab-pane show active">
              <div className="row">
                {newItems.map((movie) => (
                  <div key={movie.title} className="col-md-6 mb-4">
                    <div className="card card--list card--dark">
                      <div className="row no-gutters">
                        <div className="col-md-5">
                          <div className="card__cover">
                            <img src={movie.cover} alt={movie.title} />
                          </div>
                        </div>
                        <div className="col-md-7">
                          <div className="card__content">
                            <h3 className="card__title">{movie.title}</h3>
                            <span className="card__category">{movie.genres.join(", ")}</span>
                            <p className="card__description">{movie.description}</p>
                            <div className="card__meta">
                              <span className="card__rate"><i className="icon ion-ios-star"></i>{movie.rating}</span>
                              <span className="card__quality">{movie.quality}</span>
                              <span className="card__age">{movie.age}</span>
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

      {/* EXPECTED PREMIERE */}
      <section className="section section--bg" style={{ backgroundImage: "url('/src/assets/img/section/section.jpg')" }}>
        <div className="container text-center position-relative">
          <h2 className="section__title">Expected Premiere</h2>
          <div className="row justify-content-center">
            {expectedPremieres.slice(0, 6).map((m) => (
              <div key={m.title} className="col-md-2 col-sm-4 mb-4">
                <div className="card card--featured">
                  <div className="card__cover"><img src={m.cover} alt={m.title} /></div>
                  <div className="card__content">
                    <h3 className="card__title">{m.title}</h3>
                    <p className="card__category">{m.genres.join(", ")}</p>
                    <span className="card__rate"><i className="icon ion-ios-star"></i>{m.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link to="/movies" className="btn btn-show-more">Show More</Link>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="section partners">
        <div className="container text-center">
          <h2 className="section__title">Our Partners</h2>
          <p className="section__text">It is a long <b>established</b> fact that a reader will be distracted by readable content.</p>
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
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-3">
              <h6 className="footer__title">Download Our App</h6>
              <ul className="footer__app">
                <li><a href="#"><img src="/src/assets/img/Download_on_the_App_Store_Badge.svg" alt="App Store" /></a></li>
                <li><a href="#"><img src="/src/assets/img/google-play-badge.png" alt="Google Play" /></a></li>
              </ul>
            </div>
            <div className="col-6 col-sm-4 col-md-3">
              <h6 className="footer__title">Resources</h6>
              <ul className="footer__list">
                <li><a href="#">About Us</a></li>
                <li><a href="#">Pricing Plan</a></li>
                <li><a href="#">Help</a></li>
              </ul>
            </div>
            <div className="col-6 col-sm-4 col-md-3">
              <h6 className="footer__title">Legal</h6>
              <ul className="footer__list">
                <li><a href="#">Terms of Use</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Security</a></li>
              </ul>
            </div>
            <div className="col-12 col-sm-4 col-md-3">
              <h6 className="footer__title">Contact</h6>
              <ul className="footer__list">
                <li><a href="tel:+18002345678">+1 (800) 234-5678</a></li>
                <li><a href="mailto:support@flixgo.com">support@flixgo.com</a></li>
              </ul>
              <ul className="footer__social">
                <li><a href="#"><i className="icon ion-logo-facebook"></i></a></li>
                <li><a href="#"><i className="icon ion-logo-instagram"></i></a></li>
                <li><a href="#"><i className="icon ion-logo-twitter"></i></a></li>
              </ul>
            </div>
          </div>
          <div className="footer__bottom text-center">
            <p>© 2025 FlixGo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
