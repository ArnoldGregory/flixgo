// src/components/Header.jsx - MODERN HEADER WITH SMOOTH ANIMATIONS
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/apiService';
import config from '../config/config';

const Header = ({ transparent = false, showAuth = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const token = localStorage.getItem(config.STORAGE_KEYS.TOKEN);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      authService.logout();
    }
  };

  const isActive = (path) => location.pathname === path;

  const headerClass = `header ${
    transparent && !scrolled ? 'header--transparent' : 'header--solid'
  } ${scrolled ? 'header--scrolled' : ''}`;

  return (
    <header className={headerClass}>
      <div className="container">
        <div className="header__content">
          {/* Logo */}
          <Link to="/" className="header__logo">
            <img 
              src="/src/assets/img/logo.svg" 
              alt={config.APP_NAME} 
              style={{ height: '40px' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="header__nav d-none d-lg-flex">
            <Link 
              to="/" 
              className={isActive('/') ? 'active' : ''}
            >
              Home
            </Link>
            <Link 
              to="/movies" 
              className={isActive('/movies') ? 'active' : ''}
            >
              Movies
            </Link>
            <Link 
              to="/series" 
              className={isActive('/series') ? 'active' : ''}
            >
              TV Series
            </Link>
            {token && (
              <Link 
                to="/profile" 
                className={isActive('/profile') ? 'active' : ''}
              >
                My Profile
              </Link>
            )}
            <Link 
              to="/pricing" 
              className={isActive('/pricing') ? 'active' : ''}
            >
              Pricing
            </Link>
          </nav>

          {/* Auth Buttons */}
          {showAuth && (
            <div className="header__auth d-none d-lg-flex">
              {token ? (
                <>
                  <Link 
                    to="/search" 
                    className="header__search-btn"
                    title="Search"
                  >
                    <i className="icon ion-ios-search"></i>
                  </Link>
                  <button 
                    onClick={handleLogout} 
                    className="header__sign-in"
                  >
                    <i className="icon ion-ios-log-out"></i>
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link to="/login" className="header__sign-in">
                  <i className="icon ion-ios-log-in"></i>
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="header__menu-toggle d-lg-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className={`icon ${mobileMenuOpen ? 'ion-ios-close' : 'ion-ios-menu'}`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="header__mobile-menu">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/movies" onClick={() => setMobileMenuOpen(false)}>Movies</Link>
            <Link to="/series" onClick={() => setMobileMenuOpen(false)}>TV Series</Link>
            {token && (
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>My Profile</Link>
            )}
            <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
            {token ? (
              <button onClick={handleLogout} className="w-100 text-start">
                <i className="icon ion-ios-log-out me-2"></i>Logout
              </button>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <i className="icon ion-ios-log-in me-2"></i>Sign In
              </Link>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          transition: all 0.3s ease;
          padding: 1rem 0;
        }

        .header--transparent {
          background: transparent;
        }

        .header--solid,
        .header--scrolled {
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(10px);
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
        }

        .header__content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        .header__nav {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .header__nav a {
          color: #fff;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
          padding: 0.5rem 0;
        }

        .header__nav a:hover {
          color: #e50914;
        }

        .header__nav a.active {
          color: #e50914;
        }

        .header__nav a.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: #e50914;
        }

        .header__auth {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .header__search-btn {
          color: #fff;
          font-size: 1.5rem;
          transition: all 0.3s ease;
        }

        .header__search-btn:hover {
          color: #e50914;
          transform: scale(1.1);
        }

        .header__sign-in {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #fff;
          background: transparent;
          border: 2px solid #e50914;
          padding: 0.5rem 1.5rem;
          border-radius: 4px;
          transition: all 0.3s ease;
          cursor: pointer;
          text-decoration: none;
        }

        .header__sign-in:hover {
          background: #e50914;
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(229, 9, 20, 0.4);
        }

        .header__menu-toggle {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 2rem;
          cursor: pointer;
        }

        .header__mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.98);
          backdrop-filter: blur(10px);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          animation: slideDown 0.3s ease;
        }

        .header__mobile-menu a,
        .header__mobile-menu button {
          color: #fff;
          text-decoration: none;
          padding: 0.75rem;
          border-radius: 4px;
          transition: all 0.3s ease;
          background: transparent;
          border: none;
          font-size: 1rem;
        }

        .header__mobile-menu a:hover,
        .header__mobile-menu button:hover {
          background: rgba(229, 9, 20, 0.1);
          color: #e50914;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </header>
  );
};

export default Header;