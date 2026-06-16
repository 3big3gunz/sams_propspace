import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, Heart, PlusCircle, Edit2, Trash2, Eye, TrendingUp, Star, User, Settings } from 'lucide-react';
import { getMyListings, deleteProperty } from '../api/properties';
import { updateDetails } from '../api/properties';
import useAuthStore from '../store/authStore';
import PropertyCard from '../components/PropertyCard';
import toast from 'react-hot-toast';
import './Dashboard.css';

export default function Dashboard({ initialTab = 'overview' }) {
  const { user, updateUser } = useAuthStore();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', bio: user?.bio || '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => { fetchListings(); }, []);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const { data } = await getMyListings();
      setListings(data.data);
    } catch { } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await deleteProperty(id);
      toast.success('Listing deleted');
      setListings(l => l.filter(p => p._id !== id));
    } catch { toast.error('Failed to delete'); }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await updateDetails(profileForm);
      updateUser(data.data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally { setSaving(false); }
  };

  const stats = {
    total: listings.length,
    active: listings.filter(l => l.status === 'active').length,
    views: listings.reduce((a, l) => a + (l.views || 0), 0),
    avgRating: listings.filter(l => l.averageRating).length
      ? (listings.reduce((a, l) => a + (l.averageRating || 0), 0) / listings.filter(l => l.averageRating).length).toFixed(1)
      : '–'
  };

  return (
    <div className="dashboard-page">
      <div className="container dashboard-layout">
        {/* Sidebar */}
        <aside className="dash-sidebar">
          <div className="dash-profile-card">
            <div className="dash-avatar">
              {user?.avatar ? <img src={user.avatar} alt={user.name} /> : <span>{user?.name?.[0]}</span>}
            </div>
            <h3 className="dash-name">{user?.name}</h3>
            <p className="dash-email">{user?.email}</p>
            <span className="badge badge-primary" style={{ marginTop: 8 }}>{user?.role}</span>
          </div>

          <nav className="dash-nav">
            {[
              { id: 'overview', icon: <TrendingUp size={16} />, label: 'Overview' },
              { id: 'listings', icon: <Home size={16} />, label: 'My Listings' },
              { id: 'profile', icon: <Settings size={16} />, label: 'Edit Profile' },
            ].map(item => (
              <button key={item.id}
                className={`dash-nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}>
                {item.icon} {item.label}
              </button>
            ))}
            <Link to="/saved" className="dash-nav-item">
              <Heart size={16} /> Saved Properties
            </Link>
            <Link to="/create-listing" className="btn btn-primary" style={{ marginTop: 16, width: '100%' }}>
              <PlusCircle size={15} /> New Listing
            </Link>
          </nav>
        </aside>

        {/* Main */}
        <main className="dash-main">
          {activeTab === 'overview' && (
            <div className="dash-section animate-fade-in">
              <h2 className="dash-section-title">Overview</h2>

              <div className="dash-stats-grid">
                <div className="dash-stat-card">
                  <div className="dsc-icon blue"><Home size={20} /></div>
                  <div className="dsc-num">{stats.total}</div>
                  <div className="dsc-label">Total Listings</div>
                </div>
                <div className="dash-stat-card">
                  <div className="dsc-icon green"><TrendingUp size={20} /></div>
                  <div className="dsc-num">{stats.active}</div>
                  <div className="dsc-label">Active</div>
                </div>
                <div className="dash-stat-card">
                  <div className="dsc-icon purple"><Eye size={20} /></div>
                  <div className="dsc-num">{stats.views.toLocaleString()}</div>
                  <div className="dsc-label">Total Views</div>
                </div>
                <div className="dash-stat-card">
                  <div className="dsc-icon gold"><Star size={20} /></div>
                  <div className="dsc-num">{stats.avgRating}</div>
                  <div className="dsc-label">Avg Rating</div>
                </div>
              </div>

              {listings.length > 0 && (
                <>
                  <h3 className="dash-sub-title">Recent Listings</h3>
                  <div className="grid grid-2">
                    {listings.slice(0, 4).map(p => <PropertyCard key={p._id} property={p} />)}
                  </div>
                </>
              )}

              {listings.length === 0 && !loading && (
                <div className="empty-state">
                  <div className="empty-state-icon">🏡</div>
                  <h3 className="empty-state-title">No Listings Yet</h3>
                  <p className="empty-state-text">Start by creating your first property listing.</p>
                  <Link to="/create-listing" className="btn btn-primary" style={{ marginTop: 24 }}>
                    <PlusCircle size={16} /> Create Listing
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'listings' && (
            <div className="dash-section animate-fade-in">
              <div className="dash-section-header">
                <h2 className="dash-section-title">My Listings</h2>
                <Link to="/create-listing" className="btn btn-primary btn-sm">
                  <PlusCircle size={14} /> New Listing
                </Link>
              </div>

              {loading ? (
                <div className="page-loader"><div className="spinner" /></div>
              ) : listings.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📋</div>
                  <h3 className="empty-state-title">No Listings</h3>
                  <p className="empty-state-text">Create your first listing to get started.</p>
                </div>
              ) : (
                <div className="listings-table-wrap">
                  <table className="listings-table">
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Views</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listings.map(p => (
                        <tr key={p._id}>
                          <td>
                            <div className="table-property">
                              <img src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200'} alt={p.title} className="table-prop-img" />
                              <div>
                                <p className="table-prop-title">{p.title}</p>
                                <p className="table-prop-location">{p.address?.city}, {p.address?.state}</p>
                              </div>
                            </div>
                          </td>
                          <td><span className="type-pill" style={{ fontSize: 11 }}>{p.type}</span></td>
                          <td><span style={{ fontWeight: 700 }}>${p.price?.toLocaleString()}</span></td>
                          <td>
                            <span className={`badge ${p.status === 'active' ? 'badge-success' : p.status === 'sold' ? 'badge-warning' : 'badge-primary'}`}>
                              {p.status}
                            </span>
                          </td>
                          <td>{p.views || 0}</td>
                          <td>
                            <div className="table-actions">
                              <Link to={`/property/${p._id}`} className="tbl-btn" title="View"><Eye size={14} /></Link>
                              <Link to={`/edit-listing/${p._id}`} className="tbl-btn" title="Edit"><Edit2 size={14} /></Link>
                              <button className="tbl-btn danger" onClick={() => handleDelete(p._id)} title="Delete"><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="dash-section animate-fade-in">
              <h2 className="dash-section-title">Edit Profile</h2>
              <form className="profile-form" onSubmit={handleProfileSave}>
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input className="form-control" value={profileForm.name}
                      onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={profileForm.email}
                      onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-control" value={profileForm.phone}
                      onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea className="form-control" rows={4} value={profileForm.bio}
                    onChange={e => setProfileForm(p => ({ ...p, bio: e.target.value }))} />
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
