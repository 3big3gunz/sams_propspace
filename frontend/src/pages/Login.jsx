import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import useAuthStore from '../store/authStore';
import './Auth.css';

export default function Login() {
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form);
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
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account to continue</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-icon-wrap">
              <Mail size={16} className="input-icon" />
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                className="form-control input-with-icon"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="label-row">
              <label className="form-label">Password</label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>
            <div className="input-icon-wrap">
              <Lock size={16} className="input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                className="form-control input-with-icon input-with-icon-right"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              />
              <button type="button" className="input-icon-right" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? <span className="spinner" style={{ width: 20, height: 20 }} /> : <>Sign In <ArrowRight size={16} /></>}
          </button>
        </form>

        <div className="auth-divider"><span>or continue with</span></div>

        <div className="demo-accounts">
          <p className="demo-label">🔑 Demo Accounts</p>
          <div className="demo-btns">
            <button className="demo-btn"
              onClick={() => setForm({ email: 'admin@propspace.com', password: 'password123' })}>
              Admin
            </button>
            <button className="demo-btn"
              onClick={() => setForm({ email: 'sarah@propspace.com', password: 'password123' })}>
              Agent
            </button>
            <button className="demo-btn"
              onClick={() => setForm({ email: 'emily@propspace.com', password: 'password123' })}>
              User
            </button>
          </div>
        </div>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Sign up free <ArrowRight size={13} style={{ display: 'inline' }} /></Link>
        </p>
      </div>
    </div>
  );
}
