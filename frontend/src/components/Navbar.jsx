import React from 'react';
import { ShoppingCart, Heart, Sparkles, User, LogOut, Search } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleCart } from '../store/cartSlice';
import { toggleWishlistModal } from '../store/wishlistSlice';
import { logout } from '../store/authSlice';
import toast from 'react-hot-toast';

export default function Navbar({ onOpenAuth, onToggleAi, searchQuery, setSearchQuery }) {
  const dispatch = useDispatch();
  const { items: cartItems } = useSelector((state) => state.cart);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const totalCartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Signed out successfully');
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--navbar-height)',
        backgroundColor: 'rgba(10, 10, 26, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-primary)',
            }}
          >
            <Sparkles size={20} color="#fff" />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '22px',
                fontWeight: 800,
                letterSpacing: '-0.5px',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ShopAI
            </span>
          </div>
        </div>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: '520px' }}>
          <div className="search-bar">
            <Search size={18} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search products, brands, tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Ask AI button */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onToggleAi}
            style={{ gap: '6px' }}
          >
            <Sparkles size={15} color="var(--primary-light)" />
            <span>AI Assistant</span>
          </button>

          {/* Wishlist */}
          <button
            type="button"
            className="btn-icon"
            onClick={() => dispatch(toggleWishlistModal())}
            title="Wishlist"
            style={{ position: 'relative' }}
          >
            <Heart size={20} />
            {wishlistItems.length > 0 && (
              <span className="notification-dot">{wishlistItems.length}</span>
            )}
          </button>

          {/* Cart */}
          <button
            type="button"
            className="btn-icon"
            onClick={() => dispatch(toggleCart())}
            title="Shopping Cart"
            style={{ position: 'relative' }}
          >
            <ShoppingCart size={20} />
            {totalCartCount > 0 && (
              <span className="notification-dot">{totalCartCount}</span>
            )}
          </button>

          {/* User profile / login */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--bg-glass)',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border)',
                }}
              >
                <User size={15} color="var(--primary-light)" />
                <span style={{ fontSize: '13px', fontWeight: 600 }}>
                  {user?.fullName || user?.username || 'User'}
                </span>
              </div>
              <button
                type="button"
                className="btn-icon"
                onClick={handleLogout}
                title="Log out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onOpenAuth}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
