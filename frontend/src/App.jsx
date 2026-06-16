import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Listings from './pages/Listings';
import PropertyDetail from './pages/PropertyDetail';
import CreateListing from './pages/CreateListing';
import Dashboard from './pages/Dashboard';
import SavedProperties from './pages/SavedProperties';
import Login from './pages/Login';
import Register from './pages/Register';
import useAuthStore from './store/authStore';

export default function App() {
  const { token, refreshUser } = useAuthStore();

  useEffect(() => {
    if (token) {
      refreshUser();
    }
  }, [token, refreshUser]);

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content" style={{ minHeight: 'calc(100vh - var(--header-height, 70px) - 300px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/edit-listing/:id" element={<CreateListing />} />
          <Route path="/dashboard" element={<Dashboard initialTab="overview" />} />
          <Route path="/my-listings" element={<Dashboard initialTab="listings" />} />
          <Route path="/saved" element={<SavedProperties />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
