// src/components/ProfileSwitcher.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfileSwitcher = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [isKids, setIsKids] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [editingProfile, setEditingProfile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const defaultAvatars = [
    "/src/assets/img/avatar1.png",
    "/src/assets/img/avatar2.png",
    "/src/assets/img/avatar3.png",
    "/src/assets/img/avatar4.png",
    "/src/assets/img/avatar5.png",
  ];

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      try {
        const userRes = await axios.get("/api/User/GetMyProfile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserId(userRes.data.data.user_id);

        const profileRes = await axios.get("/api/User/GetUserProfiles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const loadedProfiles = profileRes.data.data || [];
        setProfiles(loadedProfiles);

        const lastProfileId = localStorage.getItem("current_profile_id");
        if (loadedProfiles.length > 0) {
          if (!lastProfileId || !loadedProfiles.some(p => p.id == lastProfileId)) {
            localStorage.setItem("current_profile_id", loadedProfiles[0].id);
          }
        }
      } catch (err) {
        console.error(err);
        alert("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, navigate]);

  const selectProfile = (id) => {
    localStorage.setItem("current_profile_id", id);
    navigate("/movies");
  };

  const uploadAvatar = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "avatar");

    setUploading(true);
    try {
      const res = await axios.post("/api/Content/UploadFile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        return `https://localhost:7145${res.data.data.url}`;
      }
    } catch (err) {
      alert("Upload failed: " + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
    return null;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadedUrl = await uploadAvatar(file);
    if (uploadedUrl) {
      setAvatar(uploadedUrl);
    }
  };

  const createProfile = async () => {
    if (!name.trim()) return alert("Enter a name");

    try {
      const payload = {
        user_id: currentUserId,
        profile_name: name,
        avatar_url: avatar || defaultAvatars[0],
        is_kids_profile: isKids,
        maturity_rating: isKids ? "G" : "PG-13",
        language: "English",
        is_active: true,
        created_by: currentUserId,
      };

      const res = await axios.post("/api/User/CreateUserProfile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const newProfile = {
          id: res.data.data.id,
          profile_name: name,
          avatar_url: payload.avatar_url,
          is_kids_profile: isKids,
        };
        setProfiles([...profiles, newProfile]);
        closeModal();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create profile");
    }
  };

  const saveEditedProfile = async () => {
    if (!name.trim()) return alert("Enter a name");

    try {
      const payload = {
        id: editingProfile.id,
        user_id: currentUserId,
        profile_name: name,
        avatar_url: avatar || defaultAvatars[0],
        is_kids_profile: isKids,
        maturity_rating: isKids ? "G" : "PG-13",
        language: "English",
        is_active: true,
        created_by: currentUserId,
      };

      const res = await axios.post("/api/User/UpdateUserProfile", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setProfiles(profiles.map(p =>
          p.id === editingProfile.id
            ? { ...p, profile_name: name, avatar_url: payload.avatar_url, is_kids_profile: isKids }
            : p
        ));
        closeModal();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    }
  };

  const deleteProfile = async (id) => {
    if (!confirm("Delete this profile? This cannot be undone.")) return;

    try {
      await axios.delete(`/api/User/DeleteUserProfile?id=${id}&deleted_by=${currentUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfiles(profiles.filter(p => p.id !== id));

      if (localStorage.getItem("current_profile_id") == id) {
        localStorage.removeItem("current_profile_id");
        if (profiles.length > 1) {
          const remaining = profiles.find(p => p.id !== id);
          localStorage.setItem("current_profile_id", remaining.id);
        }
      }
    } catch (err) {
      alert("Failed to delete: " + (err.response?.data?.message || err.message));
    }
  };

  const editProfile = (profile) => {
    setEditingProfile(profile);
    setName(profile.profile_name);
    setIsKids(profile.is_kids_profile);
    setAvatar(profile.avatar_url);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProfile(null);
    setName("");
    setIsKids(false);
    setAvatar("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDone = () => {
    const selectedId = localStorage.getItem("current_profile_id");
    if (selectedId) {
      navigate("/movies");
    } else if (profiles.length > 0) {
      localStorage.setItem("current_profile_id", profiles[0].id);
      navigate("/movies");
    } else {
      alert("Please create a profile first");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <div className="spinner-border text-white" style={{ width: "3rem", height: "3rem" }} />
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-black text-white"
      style={{ background: "#141414" }}
    >
      <h1 className="display-1 fw-bold mb-5">Who's watching?</h1>

      <div className="d-flex gap-5 flex-wrap justify-content-center" style={{ maxWidth: "800px" }}>
        {profiles.map((p) => (
          <div
            key={p.id}
            className="text-center position-relative"
            style={{ cursor: "pointer" }}
          >
            <div
              onClick={() => selectProfile(p.id)}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              style={{ transition: "transform 0.3s" }}
            >
              <div
                className="rounded overflow-hidden"
                style={{
                  width: "160px",
                  height: "160px",
                  border: "4px solid transparent",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
                }}
              >
                <img
                  src={
                    p.avatar_url?.startsWith("http")
                      ? p.avatar_url
                      : p.avatar_url
                      ? `https://localhost:7145${p.avatar_url}`
                      : "/src/assets/img/user.svg"
                  }
                  alt={p.profile_name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => (e.currentTarget.src = "/src/assets/img/user.svg")}
                />
              </div>
              <p className="mt-3 fs-4">{p.profile_name}</p>
              {p.is_kids_profile && <span className="badge bg-danger">Kids</span>}
            </div>

            <div className="position-absolute top-0 end-0 d-flex gap-1 p-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  editProfile(p);
                }}
                className="btn btn-sm btn-outline-light rounded-circle p-1"
                title="Edit"
              >
                <i className="icon ion-ios-create" style={{ fontSize: "1rem" }}></i>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteProfile(p.id);
                }}
                className="btn btn-sm btn-outline-danger rounded-circle p-1"
                title="Delete"
              >
                <i className="icon ion-ios-trash" style={{ fontSize: "1rem" }}></i>
              </button>
            </div>
          </div>
        ))}

        {profiles.length < 5 && (
          <div
            className="text-center"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setEditingProfile(null);
              setName("");
              setIsKids(false);
              setAvatar("");
              setShowModal(true);
            }}
          >
            <div
              className="rounded d-flex align-items-center justify-content-center bg-dark"
              style={{
                width: "160px",
                height: "160px",
                border: "4px dashed #555",
                transition: "border 0.3s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#555")}
            >
              <i className="icon ion-ios-add-circle display-1 text-secondary" />
            </div>
            <p className="mt-3 fs-4 text-secondary">Add Profile</p>
          </div>
        )}
      </div>

      <button
        onClick={handleDone}
        className="btn btn-outline-light mt-5 px-5 py-3"
      >
        Done
      </button>

      {/* MODAL */}
      {showModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ background: "rgba(0,0,0,0.9)", zIndex: 9999 }}
          onClick={closeModal}
        >
          <div
            className="bg-dark p-5 rounded shadow-lg"
            style={{ maxWidth: "500px", width: "90%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4">{editingProfile ? "Edit Profile" : "Create Profile"}</h3>

            <input
              type="text"
              className="form-control bg-secondary text-white mb-3"
              placeholder="Profile name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div className="mb-3">
              <label className="form-label text-muted d-block">Avatar</label>
              
              {/* UPLOAD BUTTON */}
              <div className="mb-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="btn btn-outline-light btn-sm"
                >
                  {uploading ? (
                    <>Uploading...</>
                  ) : (
                    <>Upload Photo</>
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

              {/* DEFAULT AVATARS */}
              <div className="d-flex gap-2 flex-wrap">
                {defaultAvatars.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="rounded-circle border"
                    style={{
                      width: "50px",
                      height: "50px",
                      cursor: "pointer",
                      border: avatar === src ? "3px solid #fff" : "3px solid #555",
                    }}
                    onClick={() => setAvatar(src)}
                  />
                ))}
              </div>

              {/* SHOW UPLOADED AVATAR */}
              {avatar && avatar.startsWith("http") && (
                <div className="mt-3 text-center">
                  <img
                    src={avatar}
                    alt="Current"
                    className="rounded-circle border border-2 border-success"
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  />
                  <p className="small text-success mt-1">Uploaded</p>
                </div>
              )}
            </div>

            <div className="form-check mb-4">
              <input
                type="checkbox"
                className="form-check-input"
                id="kids"
                checked={isKids}
                onChange={(e) => setIsKids(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="kids">
                Kids Profile
              </label>
            </div>

            <div className="d-flex gap-2">
              <button
                onClick={editingProfile ? saveEditedProfile : createProfile}
                className="btn btn-primary flex-fill"
                disabled={!name.trim() || uploading}
              >
                {editingProfile ? "Update" : "Save"}
              </button>
              <button
                onClick={closeModal}
                className="btn btn-secondary flex-fill"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSwitcher;