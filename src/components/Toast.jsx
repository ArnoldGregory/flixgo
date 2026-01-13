// src/components/Toast.jsx - BEAUTIFUL TOAST NOTIFICATIONS
import React, { useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'ion-ios-checkmark-circle';
      case 'error':
        return 'ion-ios-close-circle';
      case 'warning':
        return 'ion-ios-warning';
      default:
        return 'ion-ios-information-circle';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      default:
        return '#3b82f6';
    }
  };

  return (
    <div className="toast" style={{ '--toast-color': getColor() }}>
      <div className="toast__icon">
        <i className={`icon ${getIcon()}`}></i>
      </div>
      <div className="toast__content">
        <p className="toast__message">{message}</p>
      </div>
      <button className="toast__close" onClick={onClose}>
        <i className="icon ion-ios-close"></i>
      </button>

      <style jsx>{`
        .toast {
          position: fixed;
          top: 2rem;
          right: 2rem;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(10px);
          border-left: 4px solid var(--toast-color);
          border-radius: 8px;
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          animation: slideIn 0.3s ease;
          z-index: 9999;
          max-width: 400px;
          min-width: 300px;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .toast__icon {
          font-size: 1.5rem;
          color: var(--toast-color);
        }

        .toast__content {
          flex: 1;
        }

        .toast__message {
          color: #fff;
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.4;
        }

        .toast__close {
          background: transparent;
          border: none;
          color: #999;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
          transition: all 0.3s ease;
        }

        .toast__close:hover {
          color: #fff;
          transform: scale(1.1);
        }

        @media (max-width: 768px) {
          .toast {
            top: 1rem;
            right: 1rem;
            left: 1rem;
            max-width: none;
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
};

// Toast Container Component
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>
  );
};

// Custom Hook for using toasts
export const useToast = () => {
  const [toasts, setToasts] = React.useState([]);

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    addToast,
    removeToast,
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
    info: (msg, duration) => addToast(msg, 'info', duration),
  };
};

export default Toast;