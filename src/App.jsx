// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Otp from './components/Otp';
import Signup from './components/Signup';
import MovieList from './components/MovieList';
import Profile from "./components/Profile";
import ProfileSwitcher from "./components/ProfileSwitcher"; // ← THIS LINE IS SAFE
import Series from './components/Series';
import SeriesDetail from './components/SeriesDetail';
import MovieDetail from './components/MovieDetail';
import Pricing from './components/Pricing';
import Checkout from './components/Checkout';
import WatchMovie from './components/WatchMovie';
import PaymentSuccess from './components/PaymentSuccess';
import Search from './components/Search';

import './index.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/otp" element={<Otp />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/movies" element={<MovieList />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profiles" element={<ProfileSwitcher />} /> 
                <Route path="/series" element={<Series />} />
                <Route path="/series/:id" element={<SeriesDetail />} />
                <Route path="/movie/:id" element={<MovieDetail />} />
                <Route path="/watch/movie/:id" element={<WatchMovie />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />

                <Route path="/pricing" element={<Pricing />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/search" element={<Search />} />
            </Routes>
        </Router>
    );
}

export default App;