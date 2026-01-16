import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [agree, setAgree] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    //this shold be changed
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!agree) {
            setError('Please agree to the Privacy Policy');
            return;
        }
        try {
            const response = await axios.post('https://localhost:7145/api/User/ClientRegister', { name, email, password });
            if (response.data.success) {
                navigate('/login'); // Redirect to login after successful signup
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('Failed to sign up: ' + err.message);
        }
    };

    return (
        <div className="sign section--bg" style={{ backgroundImage: "url('/src/assets/img/section/section.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="sign__content">
                            <form action="#" className="sign__form" onSubmit={handleSubmit}>
                                <Link to="/" className="sign__logo">
                                    <img src="/src/assets/img/logo.svg" alt="FlixGo Logo" />
                                </Link>

                                <div className="sign__group">
                                    <input
                                        type="text"
                                        className="sign__input"
                                        placeholder="Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="sign__group">
                                    <input
                                        type="text"
                                        className="sign__input"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className="sign__group">
                                    <input
                                        type="password"
                                        className="sign__input"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <div className="sign__group sign__group--checkbox">
                                    <input
                                        id="agree"
                                        name="agree"
                                        type="checkbox"
                                        checked={agree}
                                        onChange={(e) => setAgree(e.target.checked)}
                                    />
                                    <label htmlFor="agree">I agree to the <a href="#" className="sign__link" style={{ color: '#e50914' }}>Privacy Policy</a></label>
                                </div>
                                
                                <button className="sign__btn" type="submit">Sign up</button>

                                <span className="sign__text">Already have an account? <Link to="/login" className="sign__link">Sign in!</Link></span>

                                {error && <p className="sign__error text-red-500 mt-4 text-center">{error}</p>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;