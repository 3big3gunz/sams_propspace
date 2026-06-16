import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { getSavedProperties } from '../api/properties';
import PropertyCard from '../components/PropertyCard';
import './SavedProperties.css';

export default function SavedProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getSavedProperties();
        setProperties(data.data);
      } catch { } finally { setLoading(false); }
    };
    fetch();
  }, []);

  return (
    <div className="saved-page">
      <div className="container">
        <div className="saved-header">
          <div className="saved-header-icon"><Heart size={24} /></div>
          <div>
            <h1 className="saved-title">Saved Properties</h1>
            <p className="saved-subtitle">{properties.length} saved {properties.length === 1 ? 'property' : 'properties'}</p>
          </div>
        </div>

        {loading ? (
          <div className="page-loader"><div className="spinner" /></div>
        ) : properties.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💔</div>
            <h3 className="empty-state-title">No Saved Properties</h3>
            <p className="empty-state-text">Browse listings and heart the ones you love.</p>
            <a href="/listings" className="btn btn-primary" style={{ marginTop: 24 }}>Browse Listings</a>
          </div>
        ) : (
          <div className="grid grid-3">
            {properties.map(p => <PropertyCard key={p._id} property={p} saved={true} />)}
          </div>
        )}
      </div>
    </div>
  );
}
