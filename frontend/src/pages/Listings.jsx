import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, LayoutGrid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import FilterPanel from '../components/FilterPanel';
import SearchBar from '../components/SearchBar';
import usePropertyStore from '../store/propertyStore';
import './Listings.css';

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton" style={{ height: 220 }} />
      <div style={{ padding: 18 }}>
        <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: 10 }} />
        <div className="skeleton" style={{ height: 16, width: '80%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 14, width: '50%' }} />
      </div>
    </div>
  );
}

export default function Listings() {
  const [searchParams] = useSearchParams();
  const { properties, loading, total, page, setPage, setFilters, fetchProperties, resetFilters } = usePropertyStore();
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Sync URL params → store filters
  useEffect(() => {
    const params = {};
    if (searchParams.get('search')) params.search = searchParams.get('search');
    if (searchParams.get('listingType')) params.listingType = searchParams.get('listingType');
    if (searchParams.get('type')) params.type = searchParams.get('type');
    if (Object.keys(params).length) setFilters(params);
    fetchProperties();
  }, [searchParams.toString()]);

  useEffect(() => {
    fetchProperties();
  }, [page]);

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="listings-page">
      {/* Header */}
      <div className="listings-header">
        <div className="container">
          <div className="listings-header-content">
            <div>
              <h1 className="listings-title">Property Listings</h1>
              <p className="listings-subtitle">
                {loading ? 'Searching...' : `${total.toLocaleString()} properties found`}
              </p>
            </div>
            <div className="listings-toolbar">
              <div className="search-wrap-inline">
                <SearchBar variant="compact" />
              </div>
              <button
                className={`filter-toggle-btn ${filterOpen ? 'active' : ''}`}
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <SlidersHorizontal size={16} />
                <span>Filters</span>
                {filterOpen && <X size={14} />}
              </button>
              <div className="view-toggle">
                <button
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')} title="Grid view"
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')} title="List view"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container listings-body">
        {/* Sidebar */}
        <aside className={`listings-sidebar ${filterOpen ? 'open' : ''}`}>
          <FilterPanel onClose={() => setFilterOpen(false)} />
        </aside>

        {/* Main */}
        <main className="listings-main">
          {/* Mobile filter overlay */}
          {filterOpen && (
            <div className="filter-overlay-mobile">
              <div className="filter-overlay-panel">
                <FilterPanel onClose={() => setFilterOpen(false)} />
              </div>
            </div>
          )}

          {loading ? (
            <div className={`listings-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : properties.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏠</div>
              <h3 className="empty-state-title">No Properties Found</h3>
              <p className="empty-state-text">Try adjusting your filters or search for a different area.</p>
              <button className="btn btn-primary" style={{ marginTop: 24 }} onClick={resetFilters}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className={`listings-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                {properties.map(p => <PropertyCard key={p._id} property={p} />)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="page-btn" onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        className={`page-btn ${page === p ? 'active' : ''}`}
                        onClick={() => setPage(p)}
                      >{p}</button>
                    );
                  })}
                  <button
                    className="page-btn" onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
