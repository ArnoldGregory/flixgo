// src/pages/Profile.jsx - ENHANCED MODERN PROFILE
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userService, contentService } from "../services/apiService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { PageLoader } from "../components/LoadingSpinner";
import { useToast, ToastContainer } from "../components/Toast";
import config from "../config/config";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userRes = await userService.getProfile();
        const userData = userRes.data.data;
        
        setUser({
          id: userData.id,
          user_id: userData.user_id,
          full_name: userData.profile_name,
          email: userData.email,
          profile_picture: userData.avatar_url?.startsWith("http")
            ? userData.avatar_url
            : userData.avatar_url
              ? `${config.MEDIA_BASE_URL}${userData.avatar_url}`
              : config.DEFAULT_IMAGES.USER_AVATAR,
          maturity_rating: userData.maturity_rating,
          language: userData.language,
          is_kids: userData.is_kids_profile,
        });

        setLoading(false);
      } catch (err) {
        console.error("Profile error:", err.response?.data || err);
        toast.error("Failed to load profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user?.id) {
      toast.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "avatar");

    setUploading(true);
    try {
      const uploadRes = await contentService.uploadFile(formData);

      if (!uploadRes.data.success) {
        throw new Error(uploadRes.data.message || "Upload failed");
      }

      const uploadedUrl = uploadRes.data.data.url;

      const updateRes = await userService.updateProfile({
        id: user.id,
        user_id: user.user_id,
        profile_name: user.full_name,
        avatar_url: uploadedUrl,
        is_kids_profile: user.is_kids,
        maturity_rating: user.maturity_rating,
        language: user.language,
        is_active: true,
        created_by: user.user_id
      });

      if (updateRes.data.success) {
        setUser(prev => ({
          ...prev,
          profile_picture: `${config.MEDIA_BASE_URL}${uploadedUrl}`
        }));
        toast.success("Profile picture updated!");
      } else {
        throw new Error(updateRes.data.message);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <PageLoader message="Loading your profile..." />;

  return (
    <div className="body">
      <Header />
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />

      {/* PROFILE HERO */}
      <section className="profile-hero">
        <div className="profile-hero__bg" />
        <div className="container">
          <div className="profile-hero__content">
            <div className="profile-avatar-section">
              <div className="profile-avatar-wrapper">
                <img
                  src={user?.profile_picture}
                  alt="Profile"
                  className="profile-avatar"
                  onError={(e) => (e.currentTarget.src = config.DEFAULT_IMAGES.USER_AVATAR)}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="profile-avatar-edit"
                >
                  {uploading ? (
                    <div className="spinner-small"></div>
                  ) : (
                    <i className="icon ion-ios-camera"></i>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="d-none"
                />
              </div>
            </div>

            <div className="profile-info">
              <h1 className="profile-name">{user?.full_name}</h1>
              <p className="profile-email">{user?.email}</p>
              <div className="profile-badges">
                <span className="badge badge-primary">
                  {user?.maturity_rating || "All Ages"}
                </span>
                <span className="badge badge-info">
                  {user?.language || "English"}
                </span>
                {user?.is_kids && (
                  <span className="badge badge-warning">
                    Kids Profile
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ACCOUNT SETTINGS */}
      <section className="account-settings">
        <div className="container">
          <h2 className="section-title">Account Settings</h2>
          
          <div className="settings-grid">
            <div className="setting-card">
              <div className="setting-icon">
                <i className="icon ion-ios-person"></i>
              </div>
              <div className="setting-content">
                <h3 className="setting-title">Full Name</h3>
                <p className="setting-value">{user?.full_name}</p>
              </div>
            </div>

            <div className="setting-card">
              <div className="setting-icon">
                <i className="icon ion-ios-mail"></i>
              </div>
              <div className="setting-content">
                <h3 className="setting-title">Email</h3>
                <p className="setting-value">{user?.email}</p>
              </div>
            </div>

            <div className="setting-card">
              <div className="setting-icon">
                <i className="icon ion-ios-globe"></i>
              </div>
              <div className="setting-content">
                <h3 className="setting-title">Language</h3>
                <p className="setting-value">{user?.language}</p>
              </div>
            </div>

            <div className="setting-card">
              <div className="setting-icon">
                <i className="icon ion-ios-shield"></i>
              </div>
              <div className="setting-content">
                <h3 className="setting-title">Maturity Rating</h3>
                <p className="setting-value">{user?.maturity_rating}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section className="quick-actions">
        <div className="container">
          <h2 className="section-title">Quick Actions</h2>
          
          <div className="actions-grid">
            <Link to="/profiles" className="action-card">
              <i className="icon ion-ios-people"></i>
              <h3>Switch Profile</h3>
              <p>Manage your profiles</p>
            </Link>

            <Link to="/favorites" className="action-card">
              <i className="icon ion-ios-heart"></i>
              <h3>My Favorites</h3>
              <p>View saved content</p>
            </Link>

            <Link to="/watch-history" className="action-card">
              <i className="icon ion-ios-time"></i>
              <h3>Continue Watching</h3>
              <p>Resume where you left off</p>
            </Link>

            <Link to="/pricing" className="action-card">
              <i className="icon ion-ios-card"></i>
              <h3>Manage Subscription</h3>
              <p>View your plan</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .body {
          background: #0a0a0a;
          min-height: 100vh;
        }

        .profile-hero {
          position: relative;
          padding: 140px 0 80px;
          margin-top: 80px;
        }

        .profile-hero__bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #141414 0%, #1a1a1a 100%);
        }

        .profile-hero__content {
          position: relative;
          display: flex;
          align-items: center;
          gap: 3rem;
        }

        .profile-avatar-wrapper {
          position: relative;
          width: 180px;
          height: 180px;
        }

        .profile-avatar {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          border: 5px solid rgba(229, 9, 20, 0.5);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .profile-avatar-edit {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #e50914;
          border: 3px solid #0a0a0a;
          color: #fff;
          font-size: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .profile-avatar-edit:hover {
          background: #f40612;
          transform: scale(1.1);
        }

        .profile-avatar-edit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .spinner-small {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .profile-info {
          flex: 1;
        }

        .profile-name {
          font-size: 3rem;
          font-weight: 900;
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .profile-email {
          font-size: 1.3rem;
          color: #999;
          margin-bottom: 1.5rem;
        }

        .profile-badges {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .badge {
          padding: 0.5rem 1.5rem;
          border-radius: 50px;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .badge-primary {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
        }

        .badge-info {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        .badge-warning {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }

        .account-settings,
        .quick-actions {
          padding: 4rem 0;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 900;
          color: #fff;
          margin-bottom: 2rem;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .setting-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          transition: all 0.3s ease;
        }

        .setting-card:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: #e50914;
          transform: translateY(-5px);
        }

        .setting-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: linear-gradient(135deg, #e50914 0%, #f40612 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          color: #fff;
          flex-shrink: 0;
        }

        .setting-content {
          flex: 1;
        }

        .setting-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.5rem;
        }

        .setting-value {
          font-size: 1.2rem;
          font-weight: 700;
          color: #fff;
          margin: 0;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .action-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2.5rem;
          text-align: center;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .action-card:hover {
          background: rgba(229, 9, 20, 0.1);
          border-color: #e50914;
          transform: translateY(-10px);
        }

        .action-card i {
          font-size: 3rem;
          color: #e50914;
          margin-bottom: 1rem;
          display: block;
        }

        .action-card h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 0.5rem;
        }

        .action-card p {
          color: #999;
          margin: 0;
        }

        @media (max-width: 768px) {
          .profile-hero__content {
            flex-direction: column;
            text-align: center;
          }

          .profile-name {
            font-size: 2rem;
          }

          .profile-badges {
            justify-content: center;
          }

          .settings-grid,
          .actions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Profile;