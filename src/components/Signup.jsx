// src/pages/Signup.jsx - Enhanced with Config & API Service
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import { useToast } from '../components/Toast';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.name.trim()) {
            showToast('Please enter your name', 'error');
            return;
        }
        
        if (!formData.email.trim()) {
            showToast('Please enter your email', 'error');
            return;
        }
        
        if (!formData.password.trim()) {
            showToast('Please enter a password', 'error');
            return;
        }
        
        if (formData.password.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }
        
        if (!agree) {
            showToast('Please agree to the Privacy Policy', 'error');
            return;
        }

        setLoading(true);
        
        try {
            const response = await apiService.register(formData);
            
            if (response.success) {
                showToast('Account created successfully!', 'success');
                
                // TODO: Update this based on your flow
                // Option 1: Go to OTP verification
                // navigate('/otp', { state: { email: formData.email } });
                
                // Option 2: Go to login
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
                
            } else {
                showToast(response.message || 'Registration failed', 'error');
            }
        } catch (err) {
            console.error('Signup error:', err);
            showToast(err.response?.data?.message || 'Failed to create account', 'error');
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
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                        <div 
                            className="sign__content"
                            style={{
                                background: 'rgba(0, 0, 0, 0.75)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '12px',
                                padding: '40px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                            }}
                        >
                            <form className="sign__form" onSubmit={handleSubmit}>
                                {/* Logo */}
                                <Link to="/" className="sign__logo d-block text-center mb-4">
                                    <img 
                                        src="/src/assets/img/logo.svg" 
                                        alt="FlixGo Logo"
                                        style={{ maxHeight: '50px' }}
                                    />
                                </Link>

                                <h2 className="text-white text-center mb-4 fw-bold">Create Account</h2>

                                {/* Name Input */}
                                <div className="sign__group mb-3">
                                    <input
                                        type="text"
                                        name="name"
                                        className="sign__input"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={loading}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            color: 'white',
                                            borderRadius: '6px',
                                            padding: '12px 16px'
                                        }}
                                    />
                                </div>

                                {/* Email Input */}
                                <div className="sign__group mb-3">
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
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            color: 'white',
                                            borderRadius: '6px',
                                            padding: '12px 16px'
                                        }}
                                    />
                                </div>

                                {/* Password Input */}
                                <div className="sign__group mb-3">
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
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            color: 'white',
                                            borderRadius: '6px',
                                            padding: '12px 16px'
                                        }}
                                    />
                                </div>

                                {/* Privacy Policy Checkbox */}
                                <div className="sign__group sign__group--checkbox mb-4">
                                    <input
                                        id="agree"
                                        name="agree"
                                        type="checkbox"
                                        checked={agree}
                                        onChange={(e) => setAgree(e.target.checked)}
                                        disabled={loading}
                                    />
                                    <label htmlFor="agree" className="text-light">
                                        I agree to the{' '}
                                        <a 
                                            href="#" 
                                            className="sign__link" 
                                            style={{ color: '#e50914', textDecoration: 'none' }}
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
                                        borderRadius: '6px',
                                        padding: '14px',
                                        fontSize: '16px',
                                        fontWeight: 'bold',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {loading ? (
                                        <span>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Creating Account...
                                        </span>
                                    ) : (
                                        'Sign Up'
                                    )}
                                </button>

                                {/* Login Link */}
                                <span className="sign__text text-center d-block mt-4 text-light">
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