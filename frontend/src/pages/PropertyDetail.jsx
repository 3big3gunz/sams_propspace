import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bed, Bath, Maximize2, MapPin, Star, Eye, Heart, Share2,
  Phone, Mail, Calendar, CheckCircle, ChevronLeft, ChevronRight,
  Home, Trash2, Edit2, User
} from 'lucide-react';
import { getProperty, addReview, deleteReview } from '../api/properties';
import useAuthStore from '../store/authStore';
import usePropertyStore from '../store/propertyStore';
import toast from 'react-hot-toast';
import './PropertyDetail.css';

const formatPrice = (price, priceUnit) => {
  const f = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);
  if (priceUnit === 'per_month') return `${f} / mo`;
  if (priceUnit === 'per_year') return `${f} / yr`;
  return f;
};

const AMENITY_LABELS = {
  pool: '🏊 Pool', gym: '🏋️ Gym', parking: '🚗 Parking', elevator: '🛗 Elevator',
  security: '🔒 Security', garden: '🌿 Garden', balcony: '🏙️ Balcony', terrace: '☀️ Terrace',
  fireplace: '🔥 Fireplace', laundry: '🫧 Laundry', storage: '📦 Storage',
  pet_friendly: '🐾 Pet Friendly', furnished: '🛋️ Furnished',
  air_conditioning: '❄️ A/C', heating: '🌡️ Heating', internet: '📶 Internet',
  cable: '📺 Cable', dishwasher: '🍽️ Dishwasher', microwave: '📡 Microwave', alarm_system: '🚨 Alarm'
};

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { toggleSave } = usePropertyStore();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [reviewForm, setReviewForm] = useState({ title: '', text: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const { data } = await getProperty(id);
      setProperty(data.data);
      setIsSaved(user?.savedProperties?.includes(data.data._id));
    } catch {
      toast.error('Property not found');
      navigate('/listings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) { toast.error('Please login to save properties'); return; }
    const result = await toggleSave(id);
    if (result) setIsSaved(result.saved);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to leave a review'); return; }
    setSubmitting(true);
    try {
      await addReview(id, reviewForm);
      toast.success('Review added!');
      setReviewForm({ title: '', text: '', rating: 5 });
      fetchProperty();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      toast.success('Review deleted');
      fetchProperty();
    } catch { toast.error('Failed to delete review'); }
  };

  if (loading) return (
    <div className="page-loader" style={{ paddingTop: 'var(--header-height)' }}>
      <div className="spinner" />
      <p style={{ color: 'var(--text-muted)' }}>Loading property...</p>
    </div>
  );
  if (!property) return null;

  const images = property.images?.length ? property.images : [{ url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200' }];
  const isOwner = user?._id === property.owner?._id || user?.id === property.owner?._id;

  return (
    <div className="property-detail" style={{ paddingTop: 'var(--header-height)' }}>
      {/* ── Gallery ── */}
      <div className="gallery">
        <div className="gallery-main">
          <img src={images[imgIdx]?.url} alt={property.title} className="gallery-main-img" />
          <div className="gallery-overlay" />
          {images.length > 1 && (
            <>
              <button className="gallery-nav prev" onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}>
                <ChevronLeft size={22} />
              </button>
              <button className="gallery-nav next" onClick={() => setImgIdx(i => (i + 1) % images.length)}>
                <ChevronRight size={22} />
              </button>
              <div className="gallery-counter">{imgIdx + 1} / {images.length}</div>
            </>
          )}
          {/* Status badge */}
          <div className="gallery-badges">
            <span className={`badge badge-listing`} data-type={property.listingType}>
              {property.listingType === 'sale' ? 'For Sale' : property.listingType === 'rent' ? 'For Rent' : 'Lease'}
            </span>
            {property.featured && <span className="badge badge-gold">⭐ Featured</span>}
          </div>
        </div>
        {images.length > 1 && (
          <div className="gallery-thumbs">
            {images.map((img, i) => (
              <button
                key={i} className={`gallery-thumb ${i === imgIdx ? 'active' : ''}`}
                onClick={() => setImgIdx(i)}
              >
                <img src={img.url} alt={`View ${i + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="container detail-content">
        <div className="detail-main">
          {/* Title Row */}
          <div className="detail-title-row">
            <div>
              <div className="detail-breadcrumb">
                <Link to="/listings">Listings</Link> › {property.address?.city}
              </div>
              <h1 className="detail-title">{property.title}</h1>
              <div className="detail-location">
                <MapPin size={16} />
                <span>{property.address?.street}, {property.address?.city}, {property.address?.state} {property.address?.zipCode}</span>
              </div>
            </div>
            <div className="detail-actions">
              <button className={`action-btn ${isSaved ? 'saved' : ''}`} onClick={handleSave} title="Save">
                <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
              </button>
              <button className="action-btn" onClick={handleShare} title="Share"><Share2 size={18} /></button>
              {isOwner && (
                <>
                  <Link to={`/edit-listing/${id}`} className="btn btn-secondary btn-sm">
                    <Edit2 size={14} /> Edit
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Price & Stats */}
          <div className="detail-price-bar">
            <div className="detail-price">{formatPrice(property.price, property.priceUnit)}</div>
            <div className="detail-quick-stats">
              {property.bedrooms > 0 && <div className="dqs-item"><Bed size={16} /><span>{property.bedrooms} Beds</span></div>}
              {property.bathrooms > 0 && <div className="dqs-item"><Bath size={16} /><span>{property.bathrooms} Baths</span></div>}
              <div className="dqs-item"><Maximize2 size={16} /><span>{property.size?.toLocaleString()} sqft</span></div>
              {property.yearBuilt && <div className="dqs-item"><Calendar size={16} /><span>Built {property.yearBuilt}</span></div>}
              <div className="dqs-item"><Eye size={15} /><span>{property.views} views</span></div>
              {property.averageRating > 0 && (
                <div className="dqs-item rating-item">
                  <Star size={15} fill="#fbbf24" color="#fbbf24" />
                  <span>{property.averageRating} ({property.reviewCount})</span>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="detail-tabs">
            {['details', 'amenities', 'reviews'].map(tab => (
              <button
                key={tab}
                className={`detail-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'reviews' && property.reviewCount > 0 && (
                  <span className="tab-count">{property.reviewCount}</span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Panels */}
          {activeTab === 'details' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="tab-panel">
              <h3 className="section-sub-title">About This Property</h3>
              <p className="detail-description">{property.description}</p>

              <h3 className="section-sub-title" style={{ marginTop: 32 }}>Property Details</h3>
              <div className="detail-specs-grid">
                <div className="spec-item"><span className="spec-label">Type</span><span className="spec-value">{property.type}</span></div>
                <div className="spec-item"><span className="spec-label">Status</span><span className="spec-value">{property.status}</span></div>
                <div className="spec-item"><span className="spec-label">Listing</span><span className="spec-value">{property.listingType}</span></div>
                <div className="spec-item"><span className="spec-label">Size</span><span className="spec-value">{property.size?.toLocaleString()} sqft</span></div>
                {property.bedrooms > 0 && <div className="spec-item"><span className="spec-label">Bedrooms</span><span className="spec-value">{property.bedrooms}</span></div>}
                {property.bathrooms > 0 && <div className="spec-item"><span className="spec-label">Bathrooms</span><span className="spec-value">{property.bathrooms}</span></div>}
                {property.garage > 0 && <div className="spec-item"><span className="spec-label">Garage</span><span className="spec-value">{property.garage} Cars</span></div>}
                {property.yearBuilt && <div className="spec-item"><span className="spec-label">Year Built</span><span className="spec-value">{property.yearBuilt}</span></div>}
              </div>
            </motion.div>
          )}

          {activeTab === 'amenities' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="tab-panel">
              <h3 className="section-sub-title">Amenities & Features</h3>
              {property.amenities?.length > 0 ? (
                <div className="amenities-grid">
                  {property.amenities.map(a => (
                    <div key={a} className="amenity-item">
                      <CheckCircle size={16} className="amenity-check" />
                      <span>{AMENITY_LABELS[a] || a}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>No amenities listed.</p>
              )}
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="tab-panel">
              <h3 className="section-sub-title">
                Reviews {property.reviewCount > 0 && <span className="review-count-badge">{property.reviewCount}</span>}
              </h3>

              {/* Review List */}
              <div className="reviews-list">
                {property.reviews?.length === 0 && (
                  <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>No reviews yet. Be the first!</p>
                )}
                {property.reviews?.map(r => (
                  <div key={r._id} className="review-card">
                    <div className="review-header">
                      <div className="review-user">
                        <div className="avatar" style={{ width: 36, height: 36 }}>
                          {r.user?.avatar ? <img src={r.user.avatar} alt={r.user.name} /> : <span>{r.user?.name?.[0]}</span>}
                        </div>
                        <div>
                          <p className="review-user-name">{r.user?.name}</p>
                          <div className="stars">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={12} fill={i < r.rating ? '#fbbf24' : 'none'} color={i < r.rating ? '#fbbf24' : 'var(--text-muted)'} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="review-meta-right">
                        <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                        {(user?._id === r.user?._id || user?.id === r.user?._id || user?.role === 'admin') && (
                          <button className="btn-icon-danger" onClick={() => handleDeleteReview(r._id)} title="Delete">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    <h4 className="review-title">{r.title}</h4>
                    <p className="review-text">{r.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Review Form */}
              {isAuthenticated && (
                <form className="review-form" onSubmit={handleReviewSubmit}>
                  <h4 className="review-form-title">Write a Review</h4>
                  <div className="rating-picker">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button" className={`rating-star ${n <= reviewForm.rating ? 'on' : ''}`}
                        onClick={() => setReviewForm(p => ({ ...p, rating: n }))}>
                        <Star size={24} fill={n <= reviewForm.rating ? '#fbbf24' : 'none'} color={n <= reviewForm.rating ? '#fbbf24' : 'var(--text-muted)'} />
                      </button>
                    ))}
                    <span className="rating-label">{['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][reviewForm.rating]}</span>
                  </div>
                  <div className="form-group">
                    <input placeholder="Review title" required className="form-control"
                      value={reviewForm.title} onChange={e => setReviewForm(p => ({ ...p, title: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <textarea placeholder="Share your experience..." required className="form-control" rows={4}
                      value={reviewForm.text} onChange={e => setReviewForm(p => ({ ...p, text: e.target.value }))} />
                  </div>
                  <button className="btn btn-primary" type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <aside className="detail-sidebar">
          {/* Agent Card */}
          {property.owner && (
            <div className="agent-card">
              <div className="agent-card-header">
                <div className="agent-avatar-lg">
                  {property.owner.avatar
                    ? <img src={property.owner.avatar} alt={property.owner.name} />
                    : <span>{property.owner.name?.[0]}</span>
                  }
                </div>
                <div>
                  <p className="agent-card-name">{property.owner.name}</p>
                  <p className="agent-card-label">Property Agent</p>
                </div>
              </div>
              {property.owner.bio && <p className="agent-card-bio">{property.owner.bio}</p>}
              <div className="agent-card-contacts">
                {property.owner.phone && (
                  <a href={`tel:${property.owner.phone}`} className="contact-btn">
                    <Phone size={16} /> {property.owner.phone}
                  </a>
                )}
                {property.owner.email && (
                  <a href={`mailto:${property.owner.email}`} className="contact-btn secondary">
                    <Mail size={16} /> Send Email
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Quick Info */}
          <div className="sidebar-info-card">
            <h4 className="sidebar-info-title">Property Summary</h4>
            <div className="sidebar-info-list">
              <div className="si-row"><span>Price</span><strong>{formatPrice(property.price, property.priceUnit)}</strong></div>
              <div className="si-row"><span>Type</span><strong style={{ textTransform: 'capitalize' }}>{property.type}</strong></div>
              <div className="si-row"><span>Status</span><strong style={{ textTransform: 'capitalize' }}>{property.status}</strong></div>
              <div className="si-row"><span>Location</span><strong>{property.address?.city}, {property.address?.state}</strong></div>
              {property.bedrooms > 0 && <div className="si-row"><span>Bedrooms</span><strong>{property.bedrooms}</strong></div>}
              {property.bathrooms > 0 && <div className="si-row"><span>Bathrooms</span><strong>{property.bathrooms}</strong></div>}
              <div className="si-row"><span>Area</span><strong>{property.size?.toLocaleString()} sqft</strong></div>
            </div>
          </div>

          <button className={`btn ${isSaved ? 'btn-secondary' : 'btn-primary'} btn-lg`} style={{ width: '100%' }} onClick={handleSave}>
            <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
            {isSaved ? 'Saved' : 'Save Property'}
          </button>
        </aside>
      </div>
    </div>
  );
}
