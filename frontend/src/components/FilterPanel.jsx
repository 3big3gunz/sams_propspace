import { useState } from 'react';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import usePropertyStore from '../store/propertyStore';
import './FilterPanel.css';

const AMENITIES = [
  'pool','gym','parking','elevator','security','garden',
  'balcony','fireplace','laundry','pet_friendly','furnished',
  'air_conditioning','internet','alarm_system'
];

export default function FilterPanel({ onClose }) {
  const { filters, setFilters, resetFilters, fetchProperties } = usePropertyStore();
  const [local, setLocal] = useState({ ...filters });
  const [priceOpen, setPriceOpen] = useState(true);
  const [roomsOpen, setRoomsOpen] = useState(true);

  const update = (key, val) => setLocal(prev => ({ ...prev, [key]: val }));

  const applyFilters = () => {
    setFilters(local);
    fetchProperties();
    onClose?.();
  };

  const handleReset = () => {
    const defaults = { listingType: '', type: '', minPrice: '', maxPrice: '', bedrooms: '', bathrooms: '', city: '', search: '', sort: '-createdAt' };
    setLocal(defaults);
    resetFilters();
    fetchProperties();
    onClose?.();
  };

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <div className="filter-title">
          <SlidersHorizontal size={18} />
          <span>Filters</span>
        </div>
        <div className="filter-header-actions">
          <button className="btn-reset" onClick={handleReset}>Reset all</button>
          {onClose && <button className="filter-close" onClick={onClose}><X size={18} /></button>}
        </div>
      </div>

      {/* Listing Type */}
      <div className="filter-section">
        <label className="filter-label">Listing Type</label>
        <div className="filter-pills">
          {['', 'sale', 'rent', 'lease'].map(t => (
            <button
              key={t}
              className={`filter-pill ${local.listingType === t ? 'active' : ''}`}
              onClick={() => update('listingType', t)}
            >
              {t === '' ? 'All' : t === 'sale' ? 'For Sale' : t === 'rent' ? 'For Rent' : 'Lease'}
            </button>
          ))}
        </div>
      </div>

      {/* Property Type */}
      <div className="filter-section">
        <label className="filter-label">Property Type</label>
        <div className="filter-pills filter-pills-wrap">
          {['', 'house', 'apartment', 'condo', 'townhouse', 'villa', 'studio', 'land', 'commercial'].map(t => (
            <button
              key={t}
              className={`filter-pill ${local.type === t ? 'active' : ''}`}
              onClick={() => update('type', t)}
            >
              {t === '' ? 'Any' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="filter-section">
        <button className="filter-section-toggle" onClick={() => setPriceOpen(!priceOpen)}>
          <span className="filter-label">Price Range</span>
          {priceOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {priceOpen && (
          <div className="filter-range-row">
            <div className="form-group">
              <label className="form-label">Min Price</label>
              <div className="price-input-wrap">
                <span className="price-symbol">$</span>
                <input
                  type="number" placeholder="0" className="form-control price-input"
                  value={local.minPrice} onChange={e => update('minPrice', e.target.value)}
                />
              </div>
            </div>
            <span className="range-dash">—</span>
            <div className="form-group">
              <label className="form-label">Max Price</label>
              <div className="price-input-wrap">
                <span className="price-symbol">$</span>
                <input
                  type="number" placeholder="Any" className="form-control price-input"
                  value={local.maxPrice} onChange={e => update('maxPrice', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Beds & Baths */}
      <div className="filter-section">
        <button className="filter-section-toggle" onClick={() => setRoomsOpen(!roomsOpen)}>
          <span className="filter-label">Beds & Baths</span>
          {roomsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {roomsOpen && (
          <div className="filter-rooms">
            <div>
              <label className="filter-sublabel">Bedrooms</label>
              <div className="filter-pills">
                {['', '1', '2', '3', '4', '5'].map(n => (
                  <button key={n} className={`filter-pill ${local.bedrooms === n ? 'active' : ''}`}
                    onClick={() => update('bedrooms', n)}>
                    {n === '' ? 'Any' : `${n}+`}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <label className="filter-sublabel">Bathrooms</label>
              <div className="filter-pills">
                {['', '1', '2', '3', '4'].map(n => (
                  <button key={n} className={`filter-pill ${local.bathrooms === n ? 'active' : ''}`}
                    onClick={() => update('bathrooms', n)}>
                    {n === '' ? 'Any' : `${n}+`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sort */}
      <div className="filter-section">
        <label className="filter-label">Sort By</label>
        <select className="form-control form-select"
          value={local.sort} onChange={e => update('sort', e.target.value)}>
          <option value="-createdAt">Newest First</option>
          <option value="createdAt">Oldest First</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="-averageRating">Top Rated</option>
          <option value="-views">Most Viewed</option>
        </select>
      </div>

      <button className="btn btn-primary filter-apply" onClick={applyFilters}>
        Apply Filters
      </button>
    </div>
  );
}
