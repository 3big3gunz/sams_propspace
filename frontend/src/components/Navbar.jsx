import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Heart, PlusCircle, User, LogOut, Menu, X, Building2, ChevronDown } from 'lucide-react';
import useAuthStore from '../store/authStore';
import './Navbar.css';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <Building2 size={20} />
          </div>
          <span className="logo-text">Prop<span>Space</span></span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-links">
          <Link to="/listings" className={`nav-link ${location.pathname === '/listings' ? 'active' : ''}`}>
            Browse
          </Link>
          <Link to="/listings?listingType=sale" className="nav-link">For Sale</Link>
          <Link to="/listings?listingType=rent" className="nav-link">For Rent</Link>
        </div>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <Link to="/create-listing" className="btn btn-primary btn-sm">
                <PlusCircle size={15} /> List Property
              </Link>
              <div className="user-dropdown" ref={dropdownRef}>
                <button className="user-avatar-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <div className="avatar">
                    {user?.avatar
                      ? <img src={user.avatar} alt={user.name} />
                      : <span>{user?.name?.[0]?.toUpperCase()}</span>
                    }
                  </div>
                  <ChevronDown size={14} className={dropdownOpen ? 'rotated' : ''} />
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <p className="dropdown-name">{user?.name}</p>
                      <p className="dropdown-email">{user?.email}</p>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to="/dashboard" className="dropdown-item">
                      <User size={14} /> Dashboard
                    </Link>
                    <Link to="/saved" className="dropdown-item">
                      <Heart size={14} /> Saved Properties
                    </Link>
                    <Link to="/my-listings" className="dropdown-item">
                      <Home size={14} /> My Listings
                    </Link>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item danger" onClick={handleLogout}>
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/listings" className="mobile-link">Browse All</Link>
          <Link to="/listings?listingType=sale" className="mobile-link">For Sale</Link>
          <Link to="/listings?listingType=rent" className="mobile-link">For Rent</Link>
          <div className="mobile-divider" />
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="mobile-link">Dashboard</Link>
              <Link to="/saved" className="mobile-link">Saved Properties</Link>
              <Link to="/my-listings" className="mobile-link">My Listings</Link>
              <Link to="/create-listing" className="mobile-link highlight">+ List Property</Link>
              <button className="mobile-link danger" onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-link">Sign In</Link>
              <Link to="/register" className="mobile-link highlight">Get Started →</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
