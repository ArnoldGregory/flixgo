// src/pages/Pricing.jsx → FINAL FULL VERSION (EVERYTHING INCLUDED)
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Pricing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isYearly, setIsYearly] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchPlans = async () => {
      try {
        const res = await axios.get("/api/Subscription/GetSubscriptionPlans", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const activePlans = res.data.data
            .filter(p => p.is_active && !p.is_deleted)
            .sort((a, b) => a.id - b.id);
          setPlans(activePlans);
        }
      } catch (err) {
        console.error("Failed to load plans:", err);
        alert("Could not load subscription plans.");
      }
    };

    const fetchUserPlan = async () => {
      try {
        const endpoints = [
          "/api/User/GetCurrentUser",
          "/api/Auth/GetCurrentUser",
          "/api/User/Me",
          "/api/Account/Profile",
          "/api/User/Profile"
        ];

        for (const endpoint of endpoints) {
          try {
            const res = await axios.get(endpoint, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = res.data.data || res.data;
            if (data?.subscription_plan_id) {
              setCurrentPlanId(data.subscription_plan_id);
              localStorage.setItem("currentPlanId", data.subscription_plan_id);
              return;
            }
          } catch (e) {
            continue;
          }
        }
        setCurrentPlanId(1);
      } catch (err) {
        console.warn("User plan not found → defaulting to Free");
        setCurrentPlanId(1);
      }
    };

    Promise.all([fetchPlans(), fetchUserPlan()]).finally(() => setLoading(false));
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
        localStorage.setItem("currentPlanId", "1");
        setCurrentPlanId(1);
        alert("Switched to Free plan!");
        navigate("/profile");
      }
      return;
    }

    navigate(`/checkout?plan=${plan.id}&billing=${isYearly ? "yearly" : "monthly"}`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark text-white">
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="body bg-dark text-white">

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
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/pricing" className="active">Pricing</Link></li>
              <li><Link to="/faq">Help</Link></li>
            </ul>
            <div className="header__auth">
              <Link to="/profile" className="header__sign-in">
                <i className="icon ion-ios-person"></i>
                <span>Account</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* PAGE TITLE */}
      <section className="section section--first section--bg" style={{ backgroundImage: "url('/src/assets/img/section/section.jpg')" }}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="section__wrap">
                <h2 className="section__title">Pricing Plan</h2>
                <ul className="breadcrumb">
                  <li className="breadcrumb__item"><Link to="/">Home</Link></li>
                  <li className="breadcrumb__item breadcrumb__item--active">Pricing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLAN FEATURES */}
      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <ul className="row plan-features text-center text-md-start">
                <li className="col-12 col-md-6 col-lg-4">Unlimited movies, TV shows & more</li>
                <li className="col-12 col-md-6 col-lg-4">Watch on your phone, laptop, tablet or TV</li>
                <li className="col-12 col-md-6 col-lg-4">Cancel anytime — no contracts</li>
                <li className="col-12 col-md-6 col-lg-4">HD & 4K available on premium plans</li>
                <li className="col-12 col-md-6 col-lg-4">Download & watch offline</li>
                <li className="col-12 col-md-6 col-lg-4">Create profiles for family members</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING PLANS */}
      <section className="section">
        <div className="container">
          <div className="row">

            {/* TOGGLE */}
            <div className="col-12 text-center mb-5">
              <div className="d-inline-flex align-items-center bg-dark rounded-pill p-1 shadow">
                <button
                  onClick={() => setIsYearly(false)}
                  className={`btn px-5 py-3 rounded-pill fw-bold ${!isYearly ? "btn-danger" : "btn-outline-light"}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setIsYearly(true)}
                  className={`btn px-5 py-3 rounded-pill fw-bold ${isYearly ? "btn-danger" : "btn-outline-light"}`}
                >
                  Yearly <span className="badge bg-success ms-2">Save ~17%</span>
                </button>
              </div>
            </div>

            {/* PLAN CARDS */}
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
                <div key={plan.id} className="col-12 col-md-6 col-lg-4 mb-4">
                  <div className={`price ${isPremium ? "price--premium" : ""}`}>
                    <div className="price__item price__item--first">
                      <span>{plan.plan_name}</span>
                      <span>{displayPrice}</span>
                    </div>
                    <div className="price__item">
                      <span className="text-muted small">{period}</span>
                    </div>
                    <div className="price__item">
                      <span><strong>{plan.max_screens}</strong> Screen{plan.max_screens > 1 ? "s" : ""} at once</span>
                    </div>
                    <div className="price__item">
                      <span>{plan.HD_available ? "Full HD + 4K HDR" : "SD Quality"}</span>
                    </div>
                    <div className="price__item">
                      <span>{plan.download_available ? `${plan.max_downloads} Offline Downloads` : "No Offline"}</span>
                    </div>
                    <div className="price__item">
                      <span>24/7 Support</span>
                    </div>

                    <button
                      onClick={() => handleChoosePlan(plan)}
                      disabled={isCurrent}
                      className={`price__btn w-100 mt-4 ${
                        isCurrent
                          ? "btn-success"
                          : isFree
                          ? "btn-outline-warning border-2"
                          : "btn-danger"
                      }`}
                    >
                      {isCurrent
                        ? "Your Current Plan"
                        : isFree
                        ? "Switch to Free"
                        : isYearly
                        ? "Subscribe Yearly"
                        : "Subscribe Now"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="section section--dark py-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="section__title section__title--no-margin text-center mb-5">Our Features</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="feature">
                <i className="icon ion-ios-tv feature__icon"></i>
                <h3 className="feature__title">Ultra HD</h3>
                <p className="feature__text">Stream in stunning 4K Ultra HD with Dolby Vision and Atmos on supported plans.</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="feature">
                <i className="icon ion-ios-film feature__icon"></i>
                <h3 className="feature__title">Latest Movies</h3>
                <p className="feature__text">New releases every week — watch before anyone else.</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="feature">
                <i className="icon ion-ios-trophy feature__icon"></i>
                <h3 className="feature__title">Award Winning</h3>
                <p className="feature__text">Exclusive originals and award-winning series.</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="feature">
                <i className="icon ion-ios-notifications feature__icon"></i>
                <h3 className="feature__title">Smart Notifications</h3>
                <p className="feature__text">Get alerts when new episodes or movies drop.</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="feature">
                <i className="icon ion-ios-download feature__icon"></i>
                <h3 className="feature__title">Download & Go</h3>
                <p className="feature__text">Download your favorites and watch anywhere — even offline.</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <div className="feature">
                <i className="icon ion-ios-globe feature__icon"></i>
                <h3 className="feature__title">100+ Languages</h3>
                <p className="feature__text">Subtitles and audio in multiple languages.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="section partners py-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h2 className="section__title text-center">Our Partners</h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4">
              <img src="/src/assets/img/partners/themeforest-light-background.png" alt="" className="partner__img img-fluid" />
            </div>
            <div className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4">
              <img src="/src/assets/img/partners/audiojungle-light-background.png" alt="" className="partner__img img-fluid" />
            </div>
            <div className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4">
              <img src="/src/assets/img/partners/codecanyon-light-background.png" alt="" className="partner__img img-fluid" />
            </div>
            <div className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4">
              <img src="/src/assets/img/partners/photodune-light-background.png" alt="" className="partner__img img-fluid" />
            </div>
            <div className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4">
              <img src="/src/assets/img/partners/activeden-light-background.png" alt="" className="partner__img img-fluid" />
            </div>
            <div className="col-6 col-sm-4 col-md-3 col-lg-2 mb-4">
              <img src="/src/assets/img/partners/3docean-light-background.png" alt="" className="partner__img img-fluid" />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer py-5 bg-dark text-white">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-3">
              <h6 className="footer__title">Download Our App</h6>
              <ul className="footer__app list-unstyled d-flex gap-2">
                <li><a href="#"><img src="/src/assets/img/Download_on_the_App_Store_Badge.svg" alt="App Store" style={{ height: "40px" }} /></a></li>
                <li><a href="#"><img src="/src/assets/img/google-play-badge.png" alt="Google Play" style={{ height: "40px" }} /></a></li>
              </ul>
            </div>
            <div className="col-6 col-sm-4 col-md-3">
              <h6 className="footer__title">Resources</h6>
              <ul className="footer__list list-unstyled">
                <li><a href="#" className="text-white">About Us</a></li>
                <li><a href="#" className="text-white">Pricing Plan</a></li>
                <li><a href="#" className="text-white">Help</a></li>
              </ul>
            </div>
            <div className="col-6 col-sm-4 col-md-3">
              <h6 className="footer__title">Legal</h6>
              <ul className="footer__list list-unstyled">
                <li><a href="#" className="text-white">Terms of Use</a></li>
                <li><a href="#" className="text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-white">Security</a></li>
              </ul>
            </div>
            <div className="col-12 col-sm-4 col-md-3">
              <h6 className="footer__title">Contact</h6>
              <ul className="footer__list list-unstyled mb-3">
                <li><a href="tel:+18002345678" className="text-white">+1 (800) 234-5678</a></li>
                <li><a href="mailto:support@flixgo.com" className="text-white">support@flixgo.com</a></li>
              </ul>
              <ul className="footer__social d-flex gap-3">
                <li><a href="#" className="text-white"><i className="icon ion-logo-facebook"></i></a></li>
                <li><a href="#" className="text-white"><i className="icon ion-logo-instagram"></i></a></li>
                <li><a href="#" className="text-white"><i className="icon ion-logo-twitter"></i></a></li>
              </ul>
            </div>
          </div>
          <div className="footer__bottom text-center mt-4">
            <p className="mb-0">© 2025 FlixGo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;