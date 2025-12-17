import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImage from "/src/assets/img/covers/robot.jpg";

const Otp = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState(null);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem("email");
  const token = localStorage.getItem("token"); // ← TEMP JWT
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email || !token) {
      navigate("/login");
    }

    const id = timer > 0 && setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer, email, token, navigate]);

  const handleChange = (index, value) => {
    const clean = value.replace(/[^0-9]/g, "").slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = clean;
    setOtp(newOtp);
    if (clean && index < 3) inputRefs.current[index + 1]?.focus();
    else if (!clean && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 4) return setError("Enter 4-digit OTP");

    setLoading(true);
    setError(null);

    try {
      console.log("SENDING OTP WITH TOKEN:", token); // ← DEBUG

      const res = await axios.post(
        "/api/User/OTPClientLogin",
        { username: email, password: code },
        {
          headers: {
            "Authorization": `Bearer ${token}`,   // ← REQUIRED
            "Content-Type": "application/json"
          },
          timeout: 15000
        }
      );

      console.log("OTP RESPONSE:", res.data); // ← DEBUG

      if (res.data.success) {
        if (res.data.data?.token) {
          localStorage.setItem("token", res.data.data.token); // ← FINAL JWT
        }
        setTimeout(() => navigate("/movies"), 800);
      } else {
        setError(res.data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("OTP ERROR:", err.response?.data || err);
      setError(
        err.response?.data?.message ||
        err.response?.status === 401 ? "Invalid or expired session" :
        "Network error"
      );
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (timer > 0) return;
    try {
      await axios.post("/api/Home/ResendOtp", { token });
      setTimer(60);
      setOtp(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError("Resend failed");
    }
  };

  return (
    <div
      className="sign section--bg"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0, 0, 0, 0.6)" }} />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(8px)",
            borderRadius: "16px",
            padding: "25px 30px",
            width: "300px",
            textAlign: "center",
            color: "#fff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            position: "relative",
          }}
        >
          {loading && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "12px",
                zIndex: 5,
              }}
            >
              <div className="loader" />
            </div>
          )}

          <Link to="/" className="sign__logo">
            <img src="/src/assets/img/logo.svg" alt="FlixGo" style={{ width: 80, margin: "0 auto 10px" }} />
          </Link>

          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1rem" }}>
            Verify OTP
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", justifyContent: "center", gap: "0.6rem", marginBottom: "1rem" }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="password"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  style={{
                    width: "2.3rem",
                    height: "2.5rem",
                    textAlign: "center",
                    fontSize: "1.2rem",
                    border: "1px solid rgba(255,255,255,0.3)",
                    background: "rgba(255,255,255,0.1)",
                    color: "#fff",
                    borderRadius: "6px",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#ff4b8b")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.3)")}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: "linear-gradient(90deg, #ff4b8b 0%, #ff006e 100%)",
                border: "none",
                padding: "0.7rem",
                width: "100%",
                borderRadius: "8px",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Verify OTP
            </button>

            <p style={{ marginTop: "12px", fontSize: "0.9rem", color: "#ccc" }}>
              Time left: {timer}s{" "}
              <button
                type="button"
                onClick={resendOtp}
                disabled={timer > 0}
                style={{
                  color: timer > 0 ? "#777" : "#ff4b8b",
                  textDecoration: "underline",
                  cursor: timer > 0 ? "not-allowed" : "pointer",
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  marginLeft: "5px",
                }}
              >
                Resend OTP
              </button>
            </p>

            {error && <p style={{ color: "#ff4b4b", marginTop: "10px", textAlign: "center" }}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Otp;