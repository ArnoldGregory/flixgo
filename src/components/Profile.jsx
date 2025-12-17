// src/pages/Profile.jsx
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const userRes = await axios.get("/api/User/GetMyProfile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = userRes.data.data;
        setUser({
          id: userData.id,
          user_id: userData.user_id,
          full_name: userData.profile_name,
          email: userData.email,
          profile_picture: userData.avatar_url?.startsWith("http")
            ? userData.avatar_url
            : userData.avatar_url
              ? `https://localhost:7145${userData.avatar_url}`
              : "/src/assets/img/user.svg",
          maturity_rating: userData.maturity_rating,
          language: userData.language,
          is_kids: userData.is_kids_profile,
        });

        setLoading(false);
      } catch (err) {
        console.error("Profile error:", err.response?.data || err);
        setError("Failed to load profile.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user?.id) {
      alert("User not loaded or no file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "avatar");

    setUploading(true);
    try {
      const uploadRes = await axios.post("/api/Content/UploadFile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (!uploadRes.data.success) {
        throw new Error(uploadRes.data.message || "Upload failed");
      }

      const uploadedUrl = uploadRes.data.data.url;

      const updateRes = await axios.post("/api/User/UpdateUserProfile", {
        id: user.id,
        user_id: user.user_id,
        profile_name: user.full_name,
        avatar_url: uploadedUrl,
        is_kids_profile: user.is_kids,
        maturity_rating: user.maturity_rating,
        language: user.language,
        is_active: true,
        created_by: user.user_id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (updateRes.data.success) {
        setUser(prev => ({
          ...prev,
          profile_picture: `https://localhost:7145${uploadedUrl}`
        }));
        alert("Profile picture updated successfully!");
      } else {
        throw new Error(updateRes.data.message);
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed: " + (err.response?.data?.message || err.message || "Try again"));
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-white">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 bg-dark text-danger">
        <h3>{error}</h3>
        <button onClick={() => window.location.reload()} className="btn btn-outline-light mt-3">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="body">
      {/* HEADER — NOW WITH SWITCH PROFILE BUTTON */}
      <header className="header header--transparent">
        <div className="container">
          <div className="header__content">
            <Link to="/" className="header__logo">
              <img src="/src/assets/img/logo.svg" alt="FlixGo" />
            </Link>
            <ul className="header__nav">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/movies">Catalog</Link></li>
              <li><Link to="/profile" className="active">Profile</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/faq">Help</Link></li>
            </ul>
            <div className="header__auth">
              {/* ONLY ADDED THIS BUTTON — SAFE & CLEAN */}
              <button
                onClick={() => navigate("/profiles")}
                className="btn btn-outline-light me-3 d-flex align-items-center"
                style={{ fontSize: "0.95rem" }}
              >
                <span className="me-1">{user?.full_name || "User"}</span>
                <i className="icon896 ion-ios-arrow-down"></i>
              </button>

              <button onClick={handleLogout} className="header__sign-in">
                <i className="icon ion-ios-log-out"></i>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* REST OF YOUR CODE — 100% UNCHANGED */}
      <section
        className="position-relative text-white"
        style={{
          background: "linear-gradient(135deg, #141414 0%, #1a1a1a 100%)",
          minHeight: "70vh",
          padding: "8rem 0 6rem",
        }}
      >
        <div className="container" style={{ marginTop: "2rem" }}>
          <div className="row align-items-center">
            <div className="col-md-4 text-center">
              <div className="position-relative d-inline-block">
                <img
                  src={user?.profile_picture}
                  alt="Profile"
                  className="rounded-circle border border-5 border-dark shadow-lg"
                  style={{
                    width: "180px",
                    height: "180px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  onError={(e) => (e.currentTarget.src = "/src/assets/img/user.svg")}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="d-none"
                />
              </div>
              <div className="mt-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="btn btn-outline-light btn-sm px-4"
                >
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <i className="icon ion-ios-camera me-1"></i>
                      Change Photo
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="col-md-8">
              <h1 className="display-3 fw-bold mb-2">{user?.full_name}</h1>
              <p className="fs-3 text-light mb-3">{user?.email}</p>
              <div className="d-flex flex-wrap gap-3 mb-4">
                <span className="badge bg-primary fs-5 px-3 py-2">
                  {user?.maturity_rating || "All Ages"}
                </span>
                <span className="badge bg-info fs-5 px-3 py-2">
                  {user?.language || "English"}
                </span>
                {user?.is_kids && (
                  <span className="badge bg-warning text-dark fs-5 px-3 py-2">
                    Kids Profile
                  </span>
                )}
              </div>
              <p className="lead text-light">
                Member since {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ACCOUNT DETAILS */}
      <section className="py-5 bg-dark">
        <div className="container">
          <h2 className="text-white mb-5 text-center fw-bold">Account Settings</h2>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card bg-secondary text-white border-0 shadow-lg">
                <div className="card-body p-5">
                  <div className="row g-4">
                    <div className="col-sm-6">
                      <div className="d-flex align-items-center">
                        <i className="icon ion-ios-person fs-3 text-primary me-3"></i>
                        <div>
                          <small className="text-muted">Full Name</small>
                          <p className="mb-0 fw-bold">{user?.full_name}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="d-flex align-items-center">
                        <i className="icon ion-ios-mail fs-3 text-info me-3"></i>
                        <div>
                          <small className="text-muted">Email</small>
                          <p className="mb-0 fw-bold">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="d-flex align-items-center">
                        <i className="icon ion-ios-globe fs-3 text-success me-3"></i>
                        <div>
                          <small className="text-muted">Language</small>
                          <p className="mb-0 fw-bold">{user?.language}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="d-flex align-items-center">
                        <i className="icon ion-ios-shield fs-3 text-warning me-3"></i>
                        <div>
                          <small className="text-muted">Maturity Rating</small>
                          <p className="mb-0 fw-bold">{user?.maturity_rating}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="py-5 bg-dark">
        <div className="container">
          <h2 className="text-white text-center mb-5 fw-bold">Quick Actions</h2>
          <div className="row g-4">
            {[
              { to: "/favorites", icon: "ion-ios-heart", color: "danger", label: "My Favorites" },
              { to: "/watch-history", icon: "ion-ios-time", color: "warning", label: "Continue Watching" },
              { to: "/series", icon: "ion-ios-tv", color: "info", label: "Browse Series" },
            ].map((item) => (
              <div key={item.to} className="col-md-4">
                <Link to={item.to} className="text-decoration-none">
                  <div className="card bg-secondary text-white text-center p-4 h-100 hover-shadow transition">
                    <i className={`icon ${item.icon} display-4 text-${item.color}`}></i>
                    <h5 className="mt-3 fw-bold">{item.label}</h5>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer py-5 bg-dark text-white">
        <div className="container text-center">
          <p className="mb-0">© 2025 FlixGo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Profile;