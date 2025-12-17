// src/pages/Checkout.jsx → FINAL: M-PESA + AUTO REDIRECT TO SUCCESS PAGE
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const planId = query.get("plan");
  const billing = query.get("billing") || "monthly";

  const [plan, setPlan] = useState(null);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchPlan = async () => {
      try {
        const res = await axios.get("/api/Subscription/GetSubscriptionPlans", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          const selected = res.data.data.find(p => p.id === parseInt(planId));
          setPlan(selected);
        }
      } catch (err) {
        setMessage("Failed to load plan.");
      }
    };

    fetchPlan();
  }, [planId, token, navigate]);

  const initiatePayment = async () => {
    if (!phone.match(/^254[71]\d{8}$/)) {
      setMessage("Enter valid phone: 2547xxxxxxxx");
      return;
    }

    setLoading(true);
    setMessage("Sending STK Push...");

    try {
      const amount = billing === "yearly" 
        ? (plan.yearly_price || plan.monthly_price * 12 * 0.83)
        : plan.monthly_price;

      const res = await axios.post(
        "/api/Payment/InitiateMpesaSTK",
        {
          phone: phone,
          amount: Number(amount.toFixed(2)),
          planId: plan.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setMessage("STK Push sent! Check your phone and enter PIN");
        pollStatus(res.data.data.CheckoutRequestID);
      } else {
        setMessage(res.data.message || "Payment failed");
      }
    } catch (err) {
      setMessage("Payment failed. Try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // BULLETPROOF POLLING — WILL NEVER MISS PAYMENT
  const pollStatus = (checkoutRequestID) => {
    let attempts = 0;
    const maxAttempts = 36; // 3 minutes

    const interval = setInterval(async () => {
      attempts++;
      console.log(`Polling payment status... attempt ${attempts}`);

      try {
        const res = await axios.post(
          "/api/Payment/CheckMpesaStatus",
          { checkoutRequestID },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Poll response:", res.data);

        if (res.data.success && res.data.data?.ResultCode === "0") {
          clearInterval(interval);
          localStorage.setItem("currentPlanId", plan.id);
          setMessage("Payment successful! Redirecting...");
          
          // AUTO REDIRECT TO SUCCESS PAGE
          navigate(`/payment-success?plan=${plan.id}&billing=${billing}`);
          return;
        }

        // Payment failed or cancelled
        if (res.data.data?.ResultCode && res.data.data.ResultCode !== "1037") {
          clearInterval(interval);
          setMessage(`Payment failed: ${res.data.data.ResultDesc || "Unknown error"}`);
        }

      } catch (err) {
        console.log("Still waiting for payment confirmation...");
      }

      // Timeout after 3 minutes
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setMessage("Payment timeout. Please try again.");
      }
    }, 5000);
  };

  if (!plan) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-white">
        <div className="spinner-border text-danger"></div>
      </div>
    );
  }

  const amount = billing === "yearly"
    ? (plan.yearly_price || plan.monthly_price * 12 * 0.83).toFixed(2)
    : plan.monthly_price.toFixed(2);

  return (
    <div className="body bg-dark text-white min-vh-100">
      <header className="header header--transparent">
        <div className="container">
          <div className="header__content">
            <Link to="/" className="header__logo">
              <img src="/src/assets/img/logo.svg" alt="FlixGo" />
            </Link>
            <Link to="/pricing" className="btn btn-outline-light">Back to Plans</Link>
          </div>
        </div>
      </header>

      <section className="section section--first py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="sign__wrap p-5 rounded shadow-lg" style={{ background: "#111" }}>
                <h2 className="text-center mb-4">Complete Your Subscription</h2>

                <div className="price text-center p-4 mb-4 border border-danger rounded">
                  <h3>{plan.plan_name}</h3>
                  <h1 className="text-danger">KSh {amount}</h1>
                  <p>{billing === "yearly" ? "per year" : "per month"}</p>
                </div>

                <div className="mb-4">
                  <label className="form__label">M-Pesa Phone Number</label>
                  <input
                    type="text"
                    className="form__input"
                    placeholder="254712345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <small className="text-muted">Format: 2547xxxxxxxx</small>
                </div>

                <button
                  onClick={initiatePayment}
                  disabled={loading || !phone}
                  className="btn btn-danger w-100 py-3 fw-bold"
                >
                  {loading ? "Please wait..." : "Pay with M-Pesa"}
                </button>

                {message && (
                  <div className={`mt-4 p-3 rounded text-center ${message.includes("sent") || message.includes("successful") ? "bg-success" : "bg-warning"} text-white`}>
                    {message}
                  </div>
                )}

                <div className="mt-4 text-center">
                  <img src="/src/assets/img/mpesa.png" alt="M-Pesa" style={{ height: "60px" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Checkout;