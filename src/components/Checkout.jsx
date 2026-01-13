// src/pages/Checkout.jsx - ENHANCED WITH COMPONENTS
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { subscriptionService, paymentService } from "../services/apiService";
import Header from "../components/Header";
import { PageLoader } from "../components/LoadingSpinner";
import { useToast, ToastContainer } from "../components/Toast";
import config from "../config/config";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const planId = query.get("plan");
  const billing = query.get("billing") || "monthly";
  const toast = useToast();

  const [plan, setPlan] = useState(null);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const token = localStorage.getItem(config.STORAGE_KEYS.TOKEN);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchPlan = async () => {
      try {
        const res = await subscriptionService.getPlans();
        if (res.data.success) {
          const selected = res.data.data.find(p => p.id === parseInt(planId));
          if (!selected) {
            toast.error("Plan not found");
            navigate("/pricing");
            return;
          }
          setPlan(selected);
        }
      } catch (err) {
        toast.error("Failed to load plan");
        navigate("/pricing");
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [planId, token, navigate]);

  const initiatePayment = async () => {
    if (!phone.match(/^254[71]\d{8}$/)) {
      toast.error("Enter valid phone: 2547xxxxxxxx");
      return;
    }

    setProcessing(true);
    toast.info("Sending STK Push to your phone...");

    try {
      const amount = billing === "yearly" 
        ? (plan.yearly_price || plan.monthly_price * 12 * 0.83)
        : plan.monthly_price;

      const res = await paymentService.initiateMpesa(
        phone,
        Number(amount.toFixed(2)),
        plan.id
      );

      if (res.data.success) {
        toast.success("STK Push sent! Check your phone");
        pollStatus(res.data.data.CheckoutRequestID);
      } else {
        toast.error(res.data.message || "Payment failed");
        setProcessing(false);
      }
    } catch (err) {
      toast.error("Payment failed. Try again.");
      console.error(err);
      setProcessing(false);
    }
  };

  const pollStatus = (checkoutRequestID) => {
    let attempts = 0;
    const maxAttempts = config.PAYMENT.MAX_POLLING_ATTEMPTS;

    const interval = setInterval(async () => {
      attempts++;

      try {
        const res = await paymentService.checkMpesaStatus(checkoutRequestID);

        if (res.data.success && res.data.data?.ResultCode === "0") {
          clearInterval(interval);
          localStorage.setItem(config.STORAGE_KEYS.CURRENT_PLAN_ID, plan.id);
          toast.success("Payment successful! Redirecting...");
          setTimeout(() => {
            navigate(`/payment-success?plan=${plan.id}&billing=${billing}`);
          }, 1500);
          return;
        }

        if (res.data.data?.ResultCode && res.data.data.ResultCode !== "1037") {
          clearInterval(interval);
          toast.error(`Payment failed: ${res.data.data.ResultDesc || "Unknown error"}`);
          setProcessing(false);
        }

      } catch (err) {
        console.log("Polling...", attempts);
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        toast.error("Payment timeout. Please try again.");
        setProcessing(false);
      }
    }, config.PAYMENT.POLLING_INTERVAL);
  };

  if (loading) return <PageLoader message="Loading checkout..." />;
  if (!plan) return null;

  const amount = billing === "yearly"
    ? (plan.yearly_price || plan.monthly_price * 12 * 0.83).toFixed(2)
    : plan.monthly_price.toFixed(2);

  return (
    <div className="checkout-page">
      <Header />
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />

      <section className="checkout-section">
        <div className="container">
          <div className="checkout-wrapper">
            <div className="checkout-card">
              <div className="checkout-header">
                <h1 className="checkout-title">Complete Your Subscription</h1>
                <p className="checkout-subtitle">You're one step away from unlimited streaming</p>
              </div>

              {/* Plan Summary */}
              <div className="plan-summary">
                <div className="plan-icon">
                  <i className="icon ion-ios-film"></i>
                </div>
                <div className="plan-details">
                  <h3 className="plan-name">{plan.plan_name}</h3>
                  <div className="plan-price">
                    <span className="price-amount">KSh {amount}</span>
                    <span className="price-period">{billing === "yearly" ? "/ year" : "/ month"}</span>
                  </div>
                  <div className="plan-features">
                    <span className="feature-badge">{plan.max_screens} Screens</span>
                    <span className="feature-badge">{plan.HD_available ? "4K HD" : "SD"}</span>
                    {plan.download_available && <span className="feature-badge">Downloads</span>}
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              <div className="payment-form">
                <label className="form-label">
                  <i className="icon ion-ios-call me-2"></i>
                  M-Pesa Phone Number
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="254712345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={processing}
                />
                <small className="form-hint">Format: 2547XXXXXXXX</small>

                <button
                  onClick={initiatePayment}
                  disabled={processing || !phone}
                  className="checkout-btn"
                >
                  {processing ? (
                    <>
                      <div className="btn-spinner"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <i className="icon ion-ios-card me-2"></i>
                      <span>Pay with M-Pesa</span>
                    </>
                  )}
                </button>

                <div className="payment-footer">
                  <img src="/src/assets/img/mpesa.png" alt="M-Pesa" className="mpesa-logo" />
                  <p className="security-text">
                    <i className="icon ion-ios-lock"></i>
                    Secure payment powered by M-Pesa
                  </p>
                </div>
              </div>

              <Link to="/pricing" className="back-link">
                <i className="icon ion-ios-arrow-back"></i>
                Back to Plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .checkout-page {
          background: #0a0a0a;
          min-height: 100vh;
        }

        .checkout-section {
          padding: 140px 0 80px;
        }

        .checkout-wrapper {
          max-width: 600px;
          margin: 0 auto;
        }

        .checkout-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 3rem;
        }

        .checkout-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .checkout-title {
          color: #fff;
          font-size: 2rem;
          font-weight: 900;
          margin-bottom: 0.5rem;
        }

        .checkout-subtitle {
          color: #999;
          font-size: 1.1rem;
        }

        .plan-summary {
          background: linear-gradient(135deg, #e50914 0%, #b00710 100%);
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .plan-icon {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          color: #fff;
          flex-shrink: 0;
        }

        .plan-details {
          flex: 1;
        }

        .plan-name {
          color: #fff;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .plan-price {
          margin-bottom: 1rem;
        }

        .price-amount {
          color: #fff;
          font-size: 2.5rem;
          font-weight: 900;
        }

        .price-period {
          color: rgba(255, 255, 255, 0.8);
          font-size: 1rem;
          margin-left: 0.5rem;
        }

        .plan-features {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .feature-badge {
          background: rgba(255, 255, 255, 0.2);
          color: #fff;
          padding: 0.25rem 0.75rem;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .payment-form {
          margin-bottom: 2rem;
        }

        .form-label {
          color: #fff;
          font-weight: 700;
          margin-bottom: 0.75rem;
          display: block;
        }

        .form-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 1rem 1.5rem;
          color: #fff;
          font-size: 1.1rem;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #e50914;
          background: rgba(255, 255, 255, 0.15);
        }

        .form-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .form-hint {
          display: block;
          color: #999;
          margin-top: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .checkout-btn {
          width: 100%;
          background: #e50914;
          border: none;
          border-radius: 12px;
          padding: 1.25rem;
          color: #fff;
          font-size: 1.1rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .checkout-btn:hover:not(:disabled) {
          background: #f40612;
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(229, 9, 20, 0.4);
        }

        .checkout-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .payment-footer {
          text-align: center;
          margin-top: 2rem;
        }

        .mpesa-logo {
          height: 50px;
          margin-bottom: 1rem;
        }

        .security-text {
          color: #999;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .back-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: #999;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .back-link:hover {
          color: #e50914;
        }
      `}</style>
    </div>
  );
};

export default Checkout;