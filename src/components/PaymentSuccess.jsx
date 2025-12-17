// src/pages/PaymentSuccess.jsx → FINAL WITH AUTO-REDIRECT + COUNTDOWN
import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("plan");
  const billing = searchParams.get("billing") || "monthly";
  const navigate = useNavigate();

  // COUNTDOWN TIMER
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    // Start countdown
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/profile");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const planNames = {
    "1": "Free Plan",
    "2": "Premium",
    "3": "Cinematic"
  };

  return (
    <div className="body bg-dark text-white min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center p-5 rounded shadow-lg" style={{ background: "rgba(0,0,0,0.9)", maxWidth: "600px" }}>
        {/* SUCCESS ICON */}
        <div className="mb-4">
          <i className="icon ion-ios-checkmark-circle text-success" style={{ fontSize: "100px" }}></i>
        </div>

        <h1 className="display-4 fw-bold text-success mb-3">
          Payment Successful!
        </h1>

        <h3 className="mb-4">
          Welcome to <span className="text-danger">{planNames[planId] || "Premium"}</span>
        </h3>

        <p className="lead mb-4">
          Your <strong>{billing === "yearly" ? "Yearly" : "Monthly"}</strong> subscription is now active.
        </p>

        <div className="bg-black bg-opacity-50 p-4 rounded mb-4">
          <p className="mb-2">You can now enjoy:</p>
          <ul className="text-start list-unstyled">
            <li>4K Ultra HD Streaming</li>
            <li>Download & Watch Offline</li>
            <li>Multiple Devices</li>
            <li>No Ads</li>
          </ul>
        </div>

        <div className="d-flex gap-3 justify-content-center">
          <Link to="/movies" className="btn btn-danger btn-lg px-5 py-3 rounded-pill fw-bold">
            Start Watching
          </Link>
          <Link to="/profile" className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill">
            Go to Profile
          </Link>
        </div>

        {/* COUNTDOWN TIMER */}
        <p className="text-muted small mt-4">
          Redirecting to profile in <strong className="text-danger">{seconds}</strong> seconds...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;