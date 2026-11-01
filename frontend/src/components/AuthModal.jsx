import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, LogIn, UserPlus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

export default function AuthModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        const response = await authService.register(formData);
        dispatch(setCredentials(response));
        toast.success(`Welcome to ShopAI, ${response.fullName || response.username}! 🎉`);
      } else {
        const response = await authService.login({
          username: formData.username,
          password: formData.password,
        });
        dispatch(setCredentials(response));
        toast.success(`Welcome back, ${response.fullName || response.username}!`);
      }
      onClose();
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Authentication failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '20px' }}>{isRegister ? 'Create Account' : 'Welcome Back'}</h3>
          <button type="button" className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab switch */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg-glass-strong)',
            padding: '4px',
            borderRadius: 'var(--radius-full)',
            marginBottom: '24px',
          }}
        >
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-full)',
              background: !isRegister ? 'var(--primary)' : 'transparent',
              color: !isRegister ? 'white' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '13px',
              transition: 'all 0.2s',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-full)',
              background: isRegister ? 'var(--primary)' : 'transparent',
              color: isRegister ? 'white' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '13px',
              transition: 'all 0.2s',
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="username"
                className="form-input"
                placeholder="Enter username"
                required
                value={formData.username}
                onChange={handleChange}
                style={{ paddingLeft: '38px' }}
              />
              <User
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          {isRegister && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    name="fullName"
                    className="form-input"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    style={{ paddingLeft: '38px' }}
                  />
                  <User
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="john@example.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    style={{ paddingLeft: '38px' }}
                  />
                  <Mail
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={handleChange}
                    style={{ paddingLeft: '38px' }}
                  />
                  <Phone
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleChange}
                style={{ paddingLeft: '38px' }}
              />
              <Lock
                size={16}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ width: '100%', marginTop: '8px' }}
          >
            {isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
            <span>{loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
