import { Link } from 'react-router-dom';
import { Building2, Twitter, Instagram, Linkedin, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-glow" />
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="logo-icon-sm">
                <Building2 size={18} />
              </div>
              <span>Prop<span>Space</span></span>
            </Link>
            <p className="footer-tagline">
              Find your perfect space. Whether buying, renting, or selling — PropSpace connects people with exceptional properties.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-btn" aria-label="Twitter"><Twitter size={16} /></a>
              <a href="#" className="social-btn" aria-label="Instagram"><Instagram size={16} /></a>
              <a href="#" className="social-btn" aria-label="LinkedIn"><Linkedin size={16} /></a>
              <a href="#" className="social-btn" aria-label="Facebook"><Facebook size={16} /></a>
            </div>
          </div>

          {/* Explore */}
          <div className="footer-col">
            <h4 className="footer-col-title">Explore</h4>
            <Link to="/listings" className="footer-link">All Listings</Link>
            <Link to="/listings?listingType=sale" className="footer-link">For Sale</Link>
            <Link to="/listings?listingType=rent" className="footer-link">For Rent</Link>
            <Link to="/listings?type=apartment" className="footer-link">Apartments</Link>
            <Link to="/listings?type=house" className="footer-link">Houses</Link>
            <Link to="/listings?type=villa" className="footer-link">Villas</Link>
          </div>

          {/* Account */}
          <div className="footer-col">
            <h4 className="footer-col-title">Account</h4>
            <Link to="/register" className="footer-link">Create Account</Link>
            <Link to="/login" className="footer-link">Sign In</Link>
            <Link to="/dashboard" className="footer-link">Dashboard</Link>
            <Link to="/saved" className="footer-link">Saved Properties</Link>
            <Link to="/create-listing" className="footer-link">List a Property</Link>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contact</h4>
            <div className="footer-contact-item">
              <MapPin size={14} /> <span>123 PropSpace Blvd, Douala, Cameroon</span>
            </div>
            <div className="footer-contact-item">
              <Phone size={14} /> <span>+237679756303</span>
            </div>
            <div className="footer-contact-item">
              <Mail size={14} /> <span>nalovasamira20@gmail.com </span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} PropSpace. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
