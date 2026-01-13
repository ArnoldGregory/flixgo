// src/pages/Pricing.jsx - ENHANCED WITH COMPONENTS
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { subscriptionService } from "../services/apiService";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { PageLoader } from "../components/LoadingSpinner";
import { useToast, ToastContainer } from "../components/Toast";
import config from "../config/config";

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isYearly, setIsYearly] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();
  const token = localStorage.getItem(config.STORAGE_KEYS.TOKEN);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const res = await subscriptionService.getPlans();
        
        if (res.data.success) {
          const activePlans = res.data.data
            .filter(p => p.is_active && !p.is_deleted)
            .sort((a, b) => a.id - b.id);
          setPlans(activePlans);
        }

        // Get current plan
        const savedPlanId = localStorage.getItem(config.STORAGE_KEYS.CURRENT_PLAN_ID);
        setCurrentPlanId(savedPlanId ? parseInt(savedPlanId) : 1);

        setLoading(false);
      } catch (err) {
        console.error("Failed to load plans:", err);
        toast.error("Failed to load subscription plans");
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleChoosePlan = (plan) => {
    const isCurrent = currentPlanId === plan.id;
    const isFree = parseFloat(plan.monthly_price) === 0;

    if (isCurrent) {
      navigate("/profile");
      return;
    }

    if (isFree) {
      if (window.confirm("Switch to Free plan? You will lose premium features.")) {
        localStorage.setItem(config.STORAGE_KEYS.CURRENT_PLAN_ID, "1");
        setCurrentPlanId(1);
        toast.success("Switched to Free plan!");
        navigate("/profile");
      }
      return;
    }

    navigate(`/checkout?plan=${plan.id}&billing=${isYearly ? "yearly" : "monthly"}`);
  };

  if (loading) return <PageLoader message="Loading plans..." />;

  return (
    <div className="body">
      <Header />
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />

      {/* PAGE TITLE */}
      <section className="pricing-hero">
        <div className="container">
          <div className="text-center py-5">
            <span className="badge bg-danger mb-3">PRICING</span>
            <h1 className="display-3 fw-bold text-white mb-3">Choose Your Plan</h1>
            <p className="lead text-muted">Watch on your favorite devices. Cancel anytime.</p>
          </div>
        </div>
      </section>

      {/* PLAN FEATURES */}
      <section className="py-4 bg-dark">
        <div className="container">
          <div className="row g-3 text-center text-md-start">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="feature-item">
                <i className="icon ion-ios-checkmark-circle text-success me-2"></i>
                <span>Unlimited movies & TV shows</span>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="feature-item">
                <i className="icon ion-ios-checkmark-circle text-success me-2"></i>
                <span>Watch on any device</span>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="feature-item">
                <i className="icon ion-ios-checkmark-circle text-success me-2"></i>
                <span>Cancel anytime</span>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="feature-item">
                <i className="icon ion-ios-checkmark-circle text-success me-2"></i>
                <span>HD & 4K available</span>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="feature-item">
                <i className="icon ion-ios-checkmark-circle text-success me-2"></i>
                <span>Download & watch offline</span>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="feature-item">
                <i className="icon ion-ios-checkmark-circle text-success me-2"></i>
                <span>Create profiles for family</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING TOGGLE */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <div className="pricing-toggle">
              <button
                onClick={() => setIsYearly(false)}
                className={`toggle-btn ${!isYearly ? "active" : ""}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`toggle-btn ${isYearly ? "active" : ""}`}
              >
                Yearly <span className="badge bg-success ms-2">Save 17%</span>
              </button>
            </div>
          </div>

          {/* PLAN CARDS */}
          <div className="row g-4">
            {plans.map((plan) => {
              const monthly = parseFloat(plan.monthly_price);
              const yearly = plan.yearly_price ? parseFloat(plan.yearly_price) : monthly * 12 * 0.83;

              const displayPrice = isYearly
                ? (yearly === 0 ? "Free" : `$${yearly.toFixed(2)}`)
                : (monthly === 0 ? "Free" : `$${monthly.toFixed(2)}`);

              const period = isYearly
                ? (yearly === 0 ? "Forever" : "/ year")
                : (monthly === 0 ? "Forever" : "/ month");

              const isPremium = plan.plan_name.toLowerCase().includes("premium");
              const isCurrent = currentPlanId === plan.id;
              const isFree = monthly === 0;

              return (
                <div key={plan.id} className="col-md-6 col-lg-4">
                  <div className={`pricing-card ${isPremium ? "pricing-card--featured" : ""} ${isCurrent ? "pricing-card--current" : ""}`}>
                    {isPremium && <div className="pricing-badge">MOST POPULAR</div>}
                    
                    <div className="pricing-card__header">
                      <h3 className="pricing-card__name">{plan.plan_name}</h3>
                      <div className="pricing-card__price">
                        <span className="price-amount">{displayPrice}</span>
                        <span className="price-period">{period}</span>
                      </div>
                    </div>

                    <div className="pricing-card__features">
                      <div className="feature">
                        <i className="icon ion-ios-checkmark-circle"></i>
                        <span><strong>{plan.max_screens}</strong> Screen{plan.max_screens > 1 ? "s" : ""}</span>
                      </div>
                      <div className="feature">
                        <i className="icon ion-ios-checkmark-circle"></i>
                        <span>{plan.HD_available ? "Full HD + 4K HDR" : "SD Quality"}</span>
                      </div>
                      <div className="feature">
                        <i className="icon ion-ios-checkmark-circle"></i>
                        <span>{plan.download_available ? `${plan.max_downloads} Downloads` : "No Offline"}</span>
                      </div>
                      <div className="feature">
                        <i className="icon ion-ios-checkmark-circle"></i>
                        <span>24/7 Support</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleChoosePlan(plan)}
                      disabled={isCurrent}
                      className={`pricing-card__btn ${
                        isCurrent ? "btn-success" : isPremium ? "btn-danger" : "btn-outline-light"
                      }`}
                    >
                      {isCurrent ? "✓ Current Plan" : isFree ? "Switch to Free" : "Subscribe Now"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .body {
          background: #0a0a0a;
          min-height: 100vh;
        }

        .pricing-hero {
          padding: 140px 0 60px;
          background: linear-gradient(135deg, #141414 0%, #1a1a1a 100%);
        }

        .feature-item {
          color: #fff;
          display: flex;
          align-items: center;
          padding: 0.75rem 0;
        }

        .pricing-toggle {
          display: inline-flex;
          background: #1a1a1a;
          border-radius: 50px;
          padding: 0.5rem;
          gap: 0.5rem;
        }

        .toggle-btn {
          background: transparent;
          border: none;
          color: #999;
          padding: 0.75rem 2rem;
          border-radius: 50px;
          font-weight: 700;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .toggle-btn.active {
          background: #e50914;
          color: #fff;
        }

        .pricing-card {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2.5rem;
          position: relative;
          transition: all 0.3s ease;
          height: 100%;
        }

        .pricing-card:hover {
          border-color: #e50914;
          transform: translateY(-10px);
          box-shadow: 0 20px 60px rgba(229, 9, 20, 0.3);
        }

        .pricing-card--featured {
          background: linear-gradient(135deg, rgba(229, 9, 20, 0.1) 0%, rgba(229, 9, 20, 0.05) 100%);
          border-color: #e50914;
        }

        .pricing-card--current {
          border-color: #10b981;
        }

        .pricing-badge {
          position: absolute;
          top: -15px;
          left: 50%;
          transform: translateX(-50%);
          background: #e50914;
          color: #fff;
          padding: 0.5rem 1.5rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .pricing-card__header {
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .pricing-card__name {
          color: #fff;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .pricing-card__price {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .price-amount {
          font-size: 3rem;
          font-weight: 900;
          color: #e50914;
        }

        .price-period {
          color: #999;
          font-size: 1rem;
        }

        .pricing-card__features {
          margin-bottom: 2rem;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #fff;
          padding: 0.75rem 0;
        }

        .feature i {
          color: #10b981;
          font-size: 1.2rem;
        }

        .pricing-card__btn {
          width: 100%;
          padding: 1rem;
          border-radius: 8px;
          font-weight: 700;
          border: 2px solid;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .btn-danger {
          background: #e50914;
          border-color: #e50914;
          color: #fff;
        }

        .btn-danger:hover {
          background: #f40612;
          transform: scale(1.05);
        }

        .btn-success {
          background: #10b981;
          border-color: #10b981;
          color: #fff;
        }

        .btn-outline-light {
          background: transparent;
          border-color: #fff;
          color: #fff;
        }

        .btn-outline-light:hover {
          background: #fff;
          color: #000;
        }
      `}</style>
    </div>
  );
};

export default Pricing;