import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, SlidersHorizontal } from 'lucide-react';
import './SearchBar.css';

export default function SearchBar({ variant = 'hero' }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [listingType, setListingType] = useState('');
  const [type, setType] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('search', query);
    if (listingType) params.set('listingType', listingType);
    if (type) params.set('type', type);
    navigate(`/listings?${params.toString()}`);
  };

  if (variant === 'compact') {
    return (
      <form className="search-compact" onSubmit={handleSearch}>
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text" placeholder="Search city, address, keyword..."
            value={query} onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
        </div>
        <button type="submit" className="btn btn-primary btn-sm">Search</button>
      </form>
    );
  }

  return (
    <form className="search-bar-hero" onSubmit={handleSearch}>
      <div className="search-tabs">
        <button
          type="button"
          className={`search-tab ${listingType === '' ? 'active' : ''}`}
          onClick={() => setListingType('')}
        >All</button>
        <button
          type="button"
          className={`search-tab ${listingType === 'sale' ? 'active' : ''}`}
          onClick={() => setListingType('sale')}
        >Buy</button>
        <button
          type="button"
          className={`search-tab ${listingType === 'rent' ? 'active' : ''}`}
          onClick={() => setListingType('rent')}
        >Rent</button>
      </div>

      <div className="search-fields">
        <div className="search-field">
          <MapPin size={16} className="field-icon" />
          <input
            type="text"
            placeholder="City, neighborhood, or address..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-field-input"
          />
        </div>

        <div className="search-divider-v" />

        <div className="search-field search-field-select">
          <Home size={16} className="field-icon" />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="search-field-input"
          >
            <option value="">Property Type</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
            <option value="villa">Villa</option>
            <option value="studio">Studio</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        <button type="submit" className="search-submit">
          <Search size={18} />
          <span>Search</span>
        </button>
      </div>
    </form>
  );
}
