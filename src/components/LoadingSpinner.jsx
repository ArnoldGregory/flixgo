// src/components/LoadingSpinner.jsx - BEAUTIFUL LOADING STATES
import React from 'react';

// Full Page Loader
export const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="page-loader">
      <div className="page-loader__content">
        <div className="loader-spinner"></div>
        <p className="page-loader__message">{message}</p>
      </div>

      <style jsx>{`
        .page-loader {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .page-loader__content {
          text-align: center;
        }

        .loader-spinner {
          width: 60px;
          height: 60px;
          border: 4px solid rgba(229, 9, 20, 0.1);
          border-top-color: #e50914;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1.5rem;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .page-loader__message {
          color: #fff;
          font-size: 1.1rem;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

// Inline Spinner (for buttons, sections, etc.)
export const Spinner = ({ size = 'md', color = '#e50914' }) => {
  const sizes = {
    sm: '20px',
    md: '40px',
    lg: '60px',
  };

  return (
    <div className="spinner" style={{ '--size': sizes[size], '--color': color }}>
      <style jsx>{`
        .spinner {
          width: var(--size);
          height: var(--size);
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: var(--color);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

// Skeleton Loader for Cards
export const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card__image"></div>
      <div className="skeleton-card__content">
        <div className="skeleton-card__title"></div>
        <div className="skeleton-card__text"></div>
        <div className="skeleton-card__text short"></div>
      </div>

      <style jsx>{`
        .skeleton-card {
          background: #1a1a1a;
          border-radius: 8px;
          overflow: hidden;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .skeleton-card__image {
          width: 100%;
          padding-bottom: 150%;
          background: linear-gradient(
            90deg,
            #1a1a1a 0%,
            #2a2a2a 50%,
            #1a1a1a 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
        }

        .skeleton-card__content {
          padding: 1rem;
        }

        .skeleton-card__title {
          height: 1.2rem;
          background: linear-gradient(
            90deg,
            #2a2a2a 0%,
            #3a3a3a 50%,
            #2a2a2a 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
          border-radius: 4px;
          margin-bottom: 0.75rem;
        }

        .skeleton-card__text {
          height: 0.8rem;
          background: linear-gradient(
            90deg,
            #2a2a2a 0%,
            #3a3a3a 50%,
            #2a2a2a 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
          border-radius: 4px;
          margin-bottom: 0.5rem;
        }

        .skeleton-card__text.short {
          width: 60%;
        }

        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};

// Grid of Skeleton Cards
export const SkeletonGrid = ({ count = 12 }) => {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}

      <style jsx>{`
        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1.5rem;
          padding: 2rem 0;
        }

        @media (max-width: 768px) {
          .skeleton-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Spinner;