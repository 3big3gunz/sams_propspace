import { Link } from 'react-router-dom';
import { Heart, Bed, Bath, Maximize2, MapPin, Star, Eye } from 'lucide-react';
import useAuthStore from '../store/authStore';
import usePropertyStore from '../store/propertyStore';
import './PropertyCard.css';

const formatPrice = (price, priceUnit, listingType) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency', currency: 'USD', maximumFractionDigits: 0
  }).format(price);
  if (priceUnit === 'per_month') return `${formatted}/mo`;
  if (priceUnit === 'per_year') return `${formatted}/yr`;
  return formatted;
};

const typeColors = {
  house: '#6366f1', apartment: '#8b5cf6', condo: '#a855f7', villa: '#f59e0b',
  townhouse: '#10b981', studio: '#06b6d4', land: '#84cc16', commercial: '#f97316'
};

export default function PropertyCard({ property, saved = false }) {
  const { isAuthenticated, user } = useAuthStore();
  const { toggleSave } = usePropertyStore();

  const isSaved = user?.savedProperties?.includes(property._id) || saved;

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    const result = await toggleSave(property._id);
  };

  const firstImage = property.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800';

  return (
    <Link to={`/property/${property._id}`} className="property-card">
      {/* Image */}
      <div className="card-image-wrap">
        <img src={firstImage} alt={property.title} className="card-image" loading="lazy" />
        <div className="card-image-overlay" />

        {/* Badges */}
        <div className="card-top-badges">
          <span className="badge badge-listing" data-type={property.listingType}>
            {property.listingType === 'sale' ? 'For Sale' : property.listingType === 'rent' ? 'For Rent' : 'Lease'}
          </span>
          {property.featured && <span className="badge badge-gold">⭐ Featured</span>}
        </div>

        {/* Save Button */}
        {isAuthenticated && (
          <button
            className={`save-btn ${isSaved ? 'saved' : ''}`}
            onClick={handleSave}
            title={isSaved ? 'Unsave' : 'Save'}
          >
            <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        )}

        {/* Type Tag */}
        <div className="card-type-tag" style={{ '--type-color': typeColors[property.type] || '#6366f1' }}>
          {property.type}
        </div>
      </div>

      {/* Body */}
      <div className="card-body">
        <div className="card-price-row">
          <span className="price-tag-sm">{formatPrice(property.price, property.priceUnit, property.listingType)}</span>
          {property.averageRating > 0 && (
            <div className="card-rating">
              <Star size={12} fill="#fbbf24" color="#fbbf24" />
              <span>{property.averageRating}</span>
            </div>
          )}
        </div>

        <h3 className="card-title">{property.title}</h3>

        <div className="card-location">
          <MapPin size={13} />
          <span>{property.address?.city}, {property.address?.state}</span>
        </div>

        <div className="card-divider" />

        <div className="card-meta">
          {property.bedrooms > 0 && (
            <div className="meta-item">
              <Bed size={14} />
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="meta-item">
              <Bath size={14} />
              <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
          )}
          <div className="meta-item">
            <Maximize2 size={14} />
            <span>{property.size?.toLocaleString()} sqft</span>
          </div>
          {property.views > 0 && (
            <div className="meta-item meta-views">
              <Eye size={13} />
              <span>{property.views}</span>
            </div>
          )}
        </div>

        {/* Owner */}
        {property.owner && (
          <div className="card-agent">
            <div className="agent-avatar-xs">
              {property.owner.avatar
                ? <img src={property.owner.avatar} alt={property.owner.name} />
                : <span>{property.owner.name?.[0]}</span>
              }
            </div>
            <span className="agent-name-xs">{property.owner.name}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
