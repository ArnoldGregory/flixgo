import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from '/src/assets/img/covers/robot.jpg';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post('/api/User/ClientLogin', {
        username,
        password,
      });

      console.log('LOGIN RESPONSE:', response.data); // ← DEBUG

      if (response.data.success) {
        const token = response.data.data.token;
        const email = response.data.data.email || username;

        localStorage.setItem('token', token);   // ← TEMP JWT
        console.log("token:", token);
        localStorage.setItem('email', email);   // ← For OTP

        navigate('/otp');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('LOGIN ERROR:', err.response?.data || err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="sign section--bg relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 0,
        }}
      />

      <div
        className="relative z-10 flex items-center justify-center min-h-screen"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div
          className="sign__content"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '40px',
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            color: '#fff',
            position: 'relative',
          }}
        >
          {loading && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.6)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '12px',
                zIndex: 5,
              }}
            >
              <div className="loader"></div>
            </div>
          )}

          <form className="sign__form" onSubmit={handleSubmit}>
            <Link to="/" className="sign__logo">
              <img
                src="/src/assets/img/logo.svg"
                alt="FlixGo Logo"
                style={{ width: '120px', marginBottom: '20px' }}
              />
            </Link>

            <div className="sign__group">
              <input
                type="text"
                className="sign__input"
                placeholder="Email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="sign__group">
              <input
                type="password"
                className="sign__input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="sign__group sign__group--checkbox">
              <input id="remember" name="remember" type="checkbox" disabled={loading} />
              <label htmlFor="remember">Remember Me</label>
            </div>

            <button className="sign__btn" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <span className="sign__text">
              Don’t have an account?{' '}
              <Link to="/signup" className="sign__link">
                Sign up!
              </Link>
            </span>

            <span className="sign__text">
              <Link to="/forgot-password" className="sign__link">
                Forgot password?
              </Link>
            </span>

            {error && (
              <p className="sign__error text-red-500 mt-4 text-center">{error}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;