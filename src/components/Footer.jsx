// src/components/Footer.jsx - MODERN FOOTER COMPONENT
import React from 'react';
import { Link } from 'react-router-dom';
import config from '../config/config';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          {/* Logo & Description */}
          <div className="footer__section footer__about">
            <Link to="/" className="footer__logo">
              <img src="/src/assets/img/logo.svg" alt={config.APP_NAME} />
            </Link>
            <p className="footer__description">
              Stream thousands of movies and TV shows in stunning HD quality. 
              Watch anywhere, anytime, on any device.
            </p>
            <div className="footer__social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="icon ion-logo-facebook"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="icon ion-logo-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="icon ion-logo-instagram"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <i className="icon ion-logo-youtube"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__section">
            <h3 className="footer__title">Browse</h3>
            <ul className="footer__links">
              <li><Link to="/movies">Movies</Link></li>
              <li><Link to="/series">TV Series</Link></li>
              <li><Link to="/cartoons">Cartoons</Link></li>
              <li><Link to="/pricing">Pricing Plans</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer__section">
            <h3 className="footer__title">Support</h3>
            <ul className="footer__links">
              <li><Link to="/faq">Help Center</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Download Apps */}
          <div className="footer__section">
            <h3 className="footer__title">Download Our App</h3>
            <div className="footer__apps">
              <a href="#" className="footer__app-link">
                <img 
                  src="/src/assets/img/Download_on_the_App_Store_Badge.svg" 
                  alt="Download on App Store" 
                />
              </a>
              <a href="#" className="footer__app-link">
                <img 
                  src="/src/assets/img/google-play-badge.png" 
                  alt="Get it on Google Play" 
                />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="footer__section">
            <h3 className="footer__title">Contact</h3>
            <ul className="footer__contact">
              <li>
                <i className="icon ion-ios-mail"></i>
                <a href="mailto:support@flixgo.com">support@flixgo.com</a>
              </li>
              <li>
                <i className="icon ion-ios-call"></i>
                <a href="tel:+18002345678">+1 (800) 234-5678</a>
              </li>
              <li>
                <i className="icon ion-ios-pin"></i>
                <span>123 Streaming St, Digital City</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} {config.APP_NAME}. All rights reserved.
          </p>
          <div className="footer__payment">
            <span>We Accept:</span>
            <i className="icon ion-logo-paypal"></i>
            <i className="icon ion-ios-card"></i>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: linear-gradient(to bottom, #0a0a0a 0%, #000 100%);
          color: #fff;
          padding: 4rem 0 2rem;
          margin-top: 4rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer__content {
          display: grid;
          grid-template-columns: 2fr repeat(4, 1fr);
          gap: 3rem;
          margin-bottom: 3rem;
        }

        .footer__about {
          max-width: 350px;
        }

        .footer__logo img {
          height: 40px;
          margin-bottom: 1.5rem;
        }

        .footer__description {
          color: #999;
          line-height: 1.7;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }

        .footer__social {
          display: flex;
          gap: 1rem;
        }

        .footer__social a {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          color: #fff;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }

        .footer__social a:hover {
          background: #e50914;
          transform: translateY(-3px);
        }

        .footer__title {
          color: #fff;
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .footer__links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer__links li {
          margin-bottom: 0.75rem;
        }

        .footer__links a {
          color: #999;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .footer__links a:hover {
          color: #e50914;
          transform: translateX(5px);
        }

        .footer__apps {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer__app-link img {
          height: 45px;
          transition: all 0.3s ease;
        }

        .footer__app-link:hover img {
          transform: scale(1.05);
          filter: brightness(1.2);
        }

        .footer__contact {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer__contact li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin-bottom: 1rem;
          color: #999;
        }

        .footer__contact i {
          font-size: 1.2rem;
          color: #e50914;
          margin-top: 2px;
        }

        .footer__contact a {
          color: #999;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .footer__contact a:hover {
          color: #e50914;
        }

        .footer__bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer__copyright {
          color: #666;
          margin: 0;
          font-size: 0.9rem;
        }

        .footer__payment {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #666;
          font-size: 0.9rem;
        }

        .footer__payment i {
          font-size: 1.5rem;
          color: #999;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .footer__content {
            grid-template-columns: repeat(3, 1fr);
          }

          .footer__about {
            grid-column: span 3;
            max-width: 100%;
            margin-bottom: 2rem;
          }
        }

        @media (max-width: 768px) {
          .footer__content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .footer__about {
            grid-column: span 1;
            text-align: center;
          }

          .footer__social {
            justify-content: center;
          }

          .footer__bottom {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;