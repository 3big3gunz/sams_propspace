import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Star, TrendingUp, Building, MapPin } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import PropertyCard from '../components/PropertyCard';
import usePropertyStore from '../store/propertyStore';
import './Home.css';

const fadeUp = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

const PROPERTY_TYPES = [
  {
    type: 'house',
    label: 'Modern Family Estates',
    count: '2,400+ Listings',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    desc: 'Spacious luxury homes designed for lasting memories and premium comfort.',
    cta: 'Explore Estates',
    badge: 'Trending'
  },
  {
    type: 'apartment',
    label: 'Urban Luxury Apartments',
    count: '5,100+ Listings',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    desc: 'Experience city life from high-end layouts featuring skyline panoramas.',
    cta: 'Browse Apartments',
    badge: 'Popular'
  },
  {
    type: 'villa',
    label: 'Private Paradise Villas',
    count: '890+ Listings',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
    desc: 'Exclusive retreat properties with infinity pools, ocean vistas, and privacy.',
    cta: 'View Villas',
    badge: 'Exclusive'
  },
  {
    type: 'condo',
    label: 'Metropolitan Condos',
    count: '1,700+ Listings',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    desc: 'Modern penthouse living featuring state-of-the-art amenities and services.',
    cta: 'Discover Condos',
    badge: 'New'
  },
];

const WHY_US = [
  { icon: <Shield size={24} />, title: 'Verified Listings', desc: 'Every property is verified by our team for accuracy and legitimacy.' },
  { icon: <Zap size={24} />, title: 'Instant Alerts', desc: 'Get notified the moment a new property matching your criteria is listed.' },
  { icon: <Star size={24} />, title: 'Top Agents', desc: 'Work with certified agents who have an average 4.8-star rating.' },
  { icon: <TrendingUp size={24} />, title: 'Market Insights', desc: 'Make data-driven decisions with our live market trends and analytics.' },
];

export default function Home() {
  const { featured, stats, fetchFeatured, fetchStats } = usePropertyStore();

  useEffect(() => {
    fetchFeatured();
    fetchStats();
  }, []);

  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="hero-grid" />
        </div>

        <div className="container hero-content">
          <motion.div initial="hidden" animate="show" variants={stagger}>


            <motion.h1 variants={fadeUp} className="hero-title">
              Find Your Dream<br />
              <span className="gradient-text">Property Today</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="hero-subtitle">
              Discover thousands of homes, apartments, and commercial properties.<br />
              Your perfect space is just a search away.
            </motion.p>

            <motion.div variants={fadeUp} className="hero-search">
              <SearchBar variant="hero" />
            </motion.div>

            <motion.div variants={fadeUp} className="hero-quick-links">
              <span className="ql-label">Popular:</span>
              {['New York', 'Los Angeles', 'Miami', 'Austin', 'Chicago'].map(city => (
                <Link key={city} to={`/listings?search=${city}`} className="ql-tag">{city}</Link>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Hero Stats */}
        {stats && (
          <div className="hero-stats">
            <div className="container hero-stats-inner">
              <div className="hero-stat">
                <span className="hero-stat-num">{stats.totalListings?.toLocaleString()}+</span>
                <span className="hero-stat-label">Active Listings</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-num">{stats.forSale?.toLocaleString()}+</span>
                <span className="hero-stat-label">For Sale</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-num">{stats.forRent?.toLocaleString()}+</span>
                <span className="hero-stat-label">For Rent</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <span className="hero-stat-num">{stats.cities}+</span>
                <span className="hero-stat-label">Cities</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Property Types ── */}
      <section className="section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
          >
            <span className="section-label">Browse by Type</span>
            <h2 className="section-title">Every Kind of Property</h2>
            <p className="section-subtitle">From cozy studios to sprawling villas — find exactly what you're looking for.</p>
          </motion.div>

          <motion.div
            className="types-grid"
            initial="hidden" whileInView="show"
            viewport={{ once: true }} variants={stagger}
          >
            {PROPERTY_TYPES.map(({ type, label, image, desc, cta, badge }) => (
              <motion.div key={type} variants={fadeUp}>
                <Link to={`/listings?type=${type}`} className="type-card">
                  <img src={image} alt={label} className="type-card-img" />
                  <div className="type-card-overlay">
                    <span className="badge badge-primary type-card-badge">{badge}</span>
                    <h3 className="type-card-title">{label}</h3>
                    <p className="type-card-desc">{desc}</p>
                    <div className="type-card-cta">
                      {cta} <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Featured ── */}
      {featured.length > 0 && (
        <section className="section featured-section">
          <div className="container">
            <div className="section-header-row">
              <div>
                <span className="section-label">Hand-Picked for You</span>
                <h2 className="section-title" style={{ textAlign: 'left', marginBottom: 0 }}>Featured Properties</h2>
              </div>
              <Link to="/listings?featured=true" className="btn btn-secondary">
                View All <ArrowRight size={15} />
              </Link>
            </div>

            <motion.div
              className="grid grid-3"
              initial="hidden" whileInView="show"
              viewport={{ once: true }} variants={stagger}
            >
              {featured.slice(0, 6).map((property, i) => (
                <motion.div key={property._id} variants={fadeUp}>
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ── Why PropSpace ── */}
      <section className="section why-section">
        <div className="container">
          <div className="why-inner">
            <div className="why-left">
              <span className="section-label">Why Choose Us</span>
              <h2 className="why-title">The Smartest Way<br />to Find Property</h2>
              <p className="why-desc">
                PropSpace brings together cutting-edge technology and local expertise to deliver a seamless property search experience.
              </p>
              <Link to="/listings" className="btn btn-primary btn-lg">
                Start Exploring <ArrowRight size={18} />
              </Link>
            </div>
            <div className="why-right">
              {WHY_US.map((item, i) => (
                <motion.div
                  key={i} className="why-card"
                  initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                >
                  <div className="why-icon">{item.icon}</div>
                  <div>
                    <h4 className="why-card-title">{item.title}</h4>
                    <p className="why-card-desc">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-glow" />
            <div className="cta-content">
              <h2 className="cta-title">Ready to List Your Property?</h2>
              <p className="cta-desc">Join thousands of agents and owners using PropSpace to reach qualified buyers and renters.</p>
              <div className="cta-actions">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started Free <ArrowRight size={18} />
                </Link>
                <Link to="/listings" className="btn btn-secondary btn-lg">Browse Listings</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
