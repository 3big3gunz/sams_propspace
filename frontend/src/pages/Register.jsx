import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from 'lucide-react';
import useAuthStore from '../store/authStore';
import './Auth.css';

export default function Register() {
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'user' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(form);
    if (result.success) navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />
      </div>

      <div className="auth-card">
        <div className="auth-logo">
          <Link to="/" className="auth-logo-link">
            <div className="logo-icon"><Building2 size={20} /></div>
            <span>Prop<span>Space</span></span>
          </Link>
        </div>

        <div className="auth-header">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join thousands of property seekers and agents</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-icon-wrap">
              <User size={16} className="input-icon" />
              <input type="text" required placeholder="John Smith" className="form-control input-with-icon"
                value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-icon-wrap">
              <Mail size={16} className="input-icon" />
              <input type="email" required placeholder="you@example.com" className="form-control input-with-icon"
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Phone (optional)</label>
            <div className="input-icon-wrap">
              <Phone size={16} className="input-icon" />
              <input type="tel" placeholder="+1 (555) 000-0000" className="form-control input-with-icon"
                value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrap">
              <Lock size={16} className="input-icon" />
              <input type={showPassword ? 'text' : 'password'} required minLength={6}
                placeholder="Min 6 characters" className="form-control input-with-icon input-with-icon-right"
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
              <button type="button" className="input-icon-right" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">I am a...</label>
            <div className="role-picker">
              {[{ val: 'user', label: '🏠 Property Seeker', desc: 'Looking to buy or rent' },
                { val: 'agent', label: '🤝 Agent / Owner', desc: 'Listing properties' }].map(r => (
                <button key={r.val} type="button"
                  className={`role-option ${form.role === r.val ? 'active' : ''}`}
                  onClick={() => setForm(p => ({ ...p, role: r.val }))}>
                  <span className="role-label">{r.label}</span>
                  <span className="role-desc">{r.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 20, height: 20 }} /> : <>Create Account <ArrowRight size={16} /></>}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in <ArrowRight size={13} style={{ display: 'inline' }} /></Link>
        </p>
      </div>
    </div>
  );
}
