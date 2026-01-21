// src/pages/Signup.jsx - FINAL: WORKING + REDIRECT + WIDER FIELDS
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/apiService';
import { useToast } from '../components/Toast';

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    mobile: '',
    password: '',
    id_no: ''
  });
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.first_name.trim()) {
      toast.error('Please enter your first name');
      return;
    }
    if (!formData.last_name.trim()) {
      toast.error('Please enter your last name');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!formData.mobile.trim()) {
      toast.error('Please enter your mobile number');
      return;
    }
    if (!formData.password.trim()) {
      toast.error('Please enter a password');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (!agree) {
      toast.error('Please agree to the Privacy Policy');
      return;
    }

    const payload = {
      first_name: formData.first_name.trim(),
      last_name: formData.last_name.trim(),
      email: formData.email.trim(),
      mobile: formData.mobile.trim(),
      password: formData.password,
      middle_name: '',
      id_no: formData.id_no.trim() || '',
      created_by: 1
    };

    setLoading(true);

    try {
      const response = await authService.register(payload);

      // proper redirect to login after creation
      if (response.data?.success) {
        toast.success('Account created successfully! Please login.');
        setTimeout(() => {
          navigate('/login');
        }, 1500); // 1.5 seconds delay before redirect
      } else {
        toast.error(response.data?.message || 'Registration failed');
      }
    } catch (err) {
      const errorMsg = 
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Failed to create account. Please try again.';

      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="sign section--bg" 
      style={{ 
        backgroundImage: "url('/src/assets/img/section/section.jpg')", 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* Dark overlay */}
      <div 
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(229,9,20,0.2) 100%)',
          zIndex: 1
        }}
      />

      <div className="container position-relative" style={{ zIndex: 2 }}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8 col-xl-6">
            <div 
              className="sign__content"
              style={{
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(10px)',
                borderRadius: '12px',
                padding: '60px 50px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                maxWidth: '700px'
              }}
            >
              <form className="sign__form" onSubmit={handleSubmit}>
                {/* Logo */}
                <Link to="/" className="sign__logo d-block text-center mb-5">
                  <img 
                    src="/src/assets/img/logo.svg" 
                    alt="FlixGo Logo"
                    style={{ maxHeight: '70px' }}
                  />
                </Link>

                <h2 className="text-white text-center mb-5 fw-bold">Create Account</h2>

                {/* First Name */}
                <div className="sign__group mb-4">
                  <input
                    type="text"
                    name="first_name"
                    className="sign__input"
                    placeholder="First Name"
                    value={formData.first_name}
                    onChange={handleChange}
                    disabled={loading}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      borderRadius: '8px',
                      padding: '18px 24px',
                      width: '100%',
                      fontSize: '17px'
                    }}
                  />
                </div>

                {/* Last Name */}
                <div className="sign__group mb-4">
                  <input
                    type="text"
                    name="last_name"
                    className="sign__input"
                    placeholder="Last Name"
                    value={formData.last_name}
                    onChange={handleChange}
                    disabled={loading}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      borderRadius: '8px',
                      padding: '18px 24px',
                      width: '100%',
                      fontSize: '17px'
                    }}
                  />
                </div>

                {/* Email */}
                <div className="sign__group mb-4">
                  <input
                    type="email"
                    name="email"
                    className="sign__input"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      borderRadius: '8px',
                      padding: '18px 24px',
                      width: '100%',
                      fontSize: '17px'
                    }}
                  />
                </div>

                {/* Mobile */}
                <div className="sign__group mb-4">
                  <input
                    type="tel"
                    name="mobile"
                    className="sign__input"
                    placeholder="Mobile Number (e.g. 0703622044)"
                    value={formData.mobile}
                    onChange={handleChange}
                    disabled={loading}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      borderRadius: '8px',
                      padding: '18px 24px',
                      width: '100%',
                      fontSize: '17px'
                    }}
                  />
                </div>

                {/* Password */}
                <div className="sign__group mb-4">
                  <input
                    type="password"
                    name="password"
                    className="sign__input"
                    placeholder="Password (min. 6 characters)"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      borderRadius: '8px',
                      padding: '18px 24px',
                      width: '100%',
                      fontSize: '17px'
                    }}
                  />
                </div>

                {/* ID Number (optional) */}
                <div className="sign__group mb-4">
                  <input
                    type="text"
                    name="id_no"
                    className="sign__input"
                    placeholder="ID Number (optional)"
                    value={formData.id_no}
                    onChange={handleChange}
                    disabled={loading}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      borderRadius: '8px',
                      padding: '18px 24px',
                      width: '100%',
                      fontSize: '17px'
                    }}
                  />
                </div>

                {/* Privacy Policy Checkbox */}
                <div className="sign__group sign__group--checkbox mb-5 d-flex align-items-center gap-3">
                  <input
                    id="agree"
                    name="agree"
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    disabled={loading}
                    style={{ 
                      cursor: 'pointer',
                      width: '24px',
                      height: '24px'
                    }}
                  />
                  <label htmlFor="agree" className="text-light mb-0" style={{ cursor: 'pointer', fontSize: '16px' }}>
                    I agree to the{' '}
                    <a 
                      href="#" 
                      className="sign__link" 
                      style={{ color: '#e50914', textDecoration: 'none' }}
                      onClick={(e) => e.preventDefault()}
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {/* Submit Button */}
                <button 
                  className="sign__btn w-100"
                  type="submit"
                  disabled={loading}
                  style={{
                    background: loading ? '#666' : '#e50914',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '20px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? (
                    <span>
                      <span className="spinner-border spinner-border-sm me-3" />
                      Creating Account...
                    </span>
                  ) : (
                    'Sign Up'
                  )}
                </button>

                {/* Login Link */}
                <span className="sign__text text-center d-block mt-5 text-light fs-5">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="sign__link"
                    style={{ color: '#e50914', textDecoration: 'none', fontWeight: 'bold' }}
                  >
                    Sign In
                  </Link>
                </span>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;