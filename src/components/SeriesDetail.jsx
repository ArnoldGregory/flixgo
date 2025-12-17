// src/pages/SeriesDetail.jsx → FINAL: EPISODE GRID (NO ACCORDION, ALL EPISODES VISIBLE)
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SeriesDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [series, setSeries] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const seriesId = Number(id);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. GET ALL SERIES → FIND THIS ONE
        const seriesRes = await axios.get("/api/Content/GetSeries", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allSeries = seriesRes.data?.success ? seriesRes.data.data : seriesRes.data;
        const foundSeries = allSeries.find(s => Number(s.id) === seriesId);

        if (!foundSeries) {
          alert("Series not found");
          navigate("/series");
          return;
        }
        setSeries(foundSeries);

        // 2. GET ALL EPISODES → FILTER BY series_id
        const episodesRes = await axios.get("/api/Content/GetEpisodes", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allEpisodes = episodesRes.data?.success ? episodesRes.data.data : episodesRes.data;
        const filteredEpisodes = allEpisodes
          .filter(ep => Number(ep.series_id) === seriesId)
          .sort((a, b) => 
            (a.season_number || 1) - (b.season_number || 1) || 
            (a.episode_number || 1) - (b.episode_number || 1)
          );

        setEpisodes(filteredEpisodes);
      } catch (err) {
        console.error(err);
        alert("Failed to load series");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [seriesId, token, navigate]);

  if (loading) return <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-white"><div className="loader"></div></div>;
  if (!series) return null;

  return (
    <div className="body bg-dark text-white">

      {/* HERO */}
      <section
        className="position-relative"
        style={{
          backgroundImage: `url(${series.backdrop_url || series.poster_url || "/src/assets/img/home/home__bg.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "80vh",
        }}
      >
        <div className="hero-overlay" style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.9), transparent 70%)" }}></div>
        <div className="container position-relative" style={{ zIndex: 2, paddingTop: "140px" }}>
          <div className="row align-items-center">
            <div className="col-lg-4">
              <img
                src={series.poster_url || "/src/assets/img/covers/cover.jpg"}
                alt={series.title}
                className="img-fluid rounded-3 shadow-lg"
                style={{ maxHeight: "550px", objectFit: "cover" }}
              />
            </div>
            <div className="col-lg-8 text-white">
              <h1 className="display-3 fw-bold">{series.title}</h1>
              <div className="d-flex gap-4 my-4 fs-5">
                <span className="text-warning">Star {series.rating || "N/A"}</span>
                <span>• {episodes.length} Episode{episodes.length !== 1 ? "s" : ""}</span>
              </div>
              <p className="lead" style={{ maxWidth: "700px" }}>{series.description || "No description available."}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ALL EPISODES — GRID LIKE MOVIES PAGE */}
      <section className="py-5">
        <div className="container">
          <h2 className="content__title mb-5">All Episodes</h2>

          {episodes.length === 0 ? (
            <div className="text-center py-5">
              <h5 className="text-muted">No episodes available yet.</h5>
            </div>
          ) : (
            <div className="row g-4">
              {episodes.map((ep) => (
                <div key={ep.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
                  <Link
                    to={`/watch/series/${seriesId}/season/${ep.season_number || 1}/episode/${ep.episode_number}`}
                    className="text-decoration-none"
                  >
                    <div className="card bg-black border-0 rounded-3 overflow-hidden shadow-sm hover-lift position-relative">
                      {/* Episode Thumbnail */}
                      <img
                        src={ep.thumbnail_url || series.poster_url || "/src/assets/img/covers/cover.jpg"}
                        alt={ep.title}
                        className="w-100"
                        style={{ height: "280px", objectFit: "cover" }}
                        onError={(e) => e.currentTarget.src = "/src/assets/img/covers/cover.jpg"}
                      />

                      {/* S1 E1 Badge */}
                      <div className="position-absolute top-0 start-0 m-2 bg-danger text-white px-2 py-1 rounded small fw-bold">
                        S{ep.season_number || 1} E{ep.episode_number}
                      </div>

                      {/* Play Icon */}
                      <div className="card__play">
                        Play
                      </div>

                      {/* Episode Info */}
                      <div className="card__content p-3">
                        <h6 className="text-white fw-bold text-truncate mb-1">
                          {ep.title || `Episode ${ep.episode_number}`}
                        </h6>
                        {ep.description && (
                          <p className="text-muted small mb-1" style={{ lineHeight: "1.4" }}>
                            {ep.description.length > 80 
                              ? ep.description.substring(0, 80) + "..." 
                              : ep.description}
                          </p>
                        )}
                        {ep.duration && (
                          <span className="text-muted small d-block">{ep.duration} min</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer py-5 bg-dark text-white text-center mt-5">
        <p>© 2025 FlixGo. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default SeriesDetail;