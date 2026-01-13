// src/components/MovieCard.jsx - BEAUTIFUL NETFLIX-STYLE CARD
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getMediaUrl } from '../services/apiService';

const MovieCard = ({ movie, type = 'movie' }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const posterUrl = getMediaUrl(movie.thumb_nail_url || movie.poster_url);
  const detailUrl = type === 'series' ? `/series/${movie.id}` : `/movie/${movie.id}`;

  return (
    <Link to={detailUrl} className="movie-card">
      <div className="movie-card__wrapper">
        {/* Loading Skeleton */}
        {!imageLoaded && !imageError && (
          <div className="movie-card__skeleton">
            <div className="skeleton-pulse"></div>
          </div>
        )}

        {/* Movie Poster */}
        <img
          src={posterUrl}
          alt={movie.title}
          className={`movie-card__image ${imageLoaded ? 'loaded' : ''}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            setImageError(true);
            e.currentTarget.src = '/src/assets/img/covers/cover.jpg';
          }}
        />

        {/* Hover Overlay */}
        <div className="movie-card__overlay">
          <div className="movie-card__content">
            <h3 className="movie-card__title">{movie.title}</h3>
            
            <div className="movie-card__meta">
              {movie.rating && (
                <span className="movie-card__rating">
                  <i className="icon ion-ios-star"></i>
                  {movie.rating}
                </span>
              )}
              {movie.release_year && (
                <span className="movie-card__year">{movie.release_year}</span>
              )}
              {movie.duration && (
                <span className="movie-card__duration">{movie.duration} min</span>
              )}
            </div>

            {movie.description && (
              <p className="movie-card__description">
                {movie.description.length > 100
                  ? movie.description.substring(0, 100) + '...'
                  : movie.description}
              </p>
            )}

            <button className="movie-card__play-btn">
              <i className="icon ion-ios-play"></i>
              <span>Play Now</span>
            </button>
          </div>
        </div>

        {/* Badge for new/featured content */}
        {movie.is_featured && (
          <div className="movie-card__badge">
            <span>Featured</span>
          </div>
        )}
      </div>

      <style jsx>{`
        .movie-card {
          display: block;
          text-decoration: none;
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .movie-card__wrapper {
          position: relative;
          width: 100%;
          padding-bottom: 150%; /* 2:3 aspect ratio */
          background: #1a1a1a;
          overflow: hidden;
        }

        .movie-card__skeleton {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .skeleton-pulse {
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            #1a1a1a 0%,
            #2a2a2a 50%,
            #1a1a1a 100%
          );
          background-size: 200% 100%;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        .movie-card__image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.4s ease;
          opacity: 0;
        }

        .movie-card__image.loaded {
          opacity: 1;
        }

        .movie-card__overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.95) 0%,
            rgba(0, 0, 0, 0.7) 50%,
            transparent 100%
          );
          opacity: 0;
          transition: all 0.3s ease;
          display: flex;
          align-items: flex-end;
          padding: 1.5rem;
        }

        .movie-card:hover .movie-card__overlay {
          opacity: 1;
        }

        .movie-card:hover .movie-card__image {
          transform: scale(1.05);
        }

        .movie-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
        }

        .movie-card__content {
          width: 100%;
        }

        .movie-card__title {
          color: #fff;
          font-size: 1.1rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .movie-card__meta {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-bottom: 0.75rem;
          flex-wrap: wrap;
        }

        .movie-card__rating {
          color: #ffd700;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .movie-card__year,
        .movie-card__duration {
          color: #999;
          font-size: 0.9rem;
        }

        .movie-card__description {
          color: #ccc;
          font-size: 0.85rem;
          line-height: 1.5;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .movie-card__play-btn {
          background: #e50914;
          color: #fff;
          border: none;
          padding: 0.6rem 1.5rem;
          border-radius: 4px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          justify-content: center;
        }

        .movie-card__play-btn:hover {
          background: #f40612;
          transform: scale(1.05);
        }

        .movie-card__badge {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: rgba(229, 9, 20, 0.9);
          backdrop-filter: blur(10px);
          color: #fff;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
          z-index: 2;
        }

        @media (max-width: 768px) {
          .movie-card__overlay {
            opacity: 1;
            background: linear-gradient(
              to top,
              rgba(0, 0, 0, 0.9) 0%,
              transparent 60%
            );
          }

          .movie-card__description {
            display: none;
          }

          .movie-card__title {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </Link>
  );
};

export default MovieCard;