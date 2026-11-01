import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setCartOpen, removeFromCartLocal, updateQuantityLocal, clearCart } from '../store/cartSlice';
import { cartService } from '../services/api';
import toast from 'react-hot-toast';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const { items, isOpen } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [address, setAddress] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.productPrice || item.price || 0) * (item.quantity || 1),
    0
  );

  const handleRemove = async (productId) => {
    dispatch(removeFromCartLocal(productId));
    toast.success('Item removed from cart');
    if (isAuthenticated) {
      try {
        await cartService.removeFromCart(productId);
      } catch (e) {}
    }
  };

  const handleQuantity = async (productId, currentQty, delta) => {
    const newQty = currentQty + delta;
    dispatch(updateQuantityLocal({ productId, quantity: newQty }));
    if (isAuthenticated) {
      try {
        await cartService.updateQuantity(productId, newQty);
      } catch (e) {}
    }
  };

  const handleCheckout = async () => {
    if (!address.trim()) {
      toast.error('Please enter a delivery address');
      return;
    }
    setIsCheckingOut(true);
    try {
      if (isAuthenticated) {
        await cartService.checkout(address);
      }
      setOrderComplete(true);
      dispatch(clearCart());
      toast.success('Order placed successfully! 🎉');
    } catch (e) {
      toast.error('Failed to complete order');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="overlay" onClick={() => dispatch(setCartOpen(false))}>
      <div
        className="modal"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          maxWidth: '440px',
          width: '100%',
          borderRadius: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          boxSizing: 'border-box',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={22} color="var(--primary-light)" />
            <h3 style={{ fontSize: '18px' }}>Your Cart ({items.length})</h3>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={() => dispatch(setCartOpen(false))}
          >
            <X size={20} />
          </button>
        </div>

        {orderComplete ? (
          <div style={{ margin: 'auto 0', textAlign: 'center', padding: '20px' }}>
            <CheckCircle2 size={56} color="var(--success)" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ marginBottom: '8px' }}>Order Placed!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px' }}>
              Thank you for shopping with ShopAI. Your items will be shipped to: <br />
              <strong style={{ color: 'var(--text-primary)' }}>{address}</strong>
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setOrderComplete(false);
                dispatch(setCartOpen(false));
              }}
            >
              Continue Shopping
            </button>
          </div>
        ) : items.length === 0 ? (
          <div style={{ margin: 'auto 0', textAlign: 'center', padding: '20px' }}>
            <ShoppingBag size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <h4 style={{ marginBottom: '6px' }}>Your cart is empty</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
              Discover amazing products and add them to your cart.
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => dispatch(setCartOpen(false))}
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {items.map((item) => {
                const id = item.productId || item.id;
                return (
                  <div
                    key={id}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      background: 'var(--bg-glass-strong)',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border)',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={item.productImage || item.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120'}
                      alt={item.productName || item.name}
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h4
                        style={{
                          fontSize: '14px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          marginBottom: '4px',
                        }}
                      >
                        {item.productName || item.name}
                      </h4>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-light)' }}>
                        ₹{Number(item.productPrice || item.price || 0).toLocaleString()}
                      </div>
                      {/* Quantity selector */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                        <button
                          type="button"
                          onClick={() => handleQuantity(id, item.quantity, -1)}
                          style={{
                            background: 'var(--bg-card)',
                            color: 'var(--text-primary)',
                            borderRadius: '4px',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleQuantity(id, item.quantity, 1)}
                          style={{
                            background: 'var(--bg-card)',
                            color: 'var(--text-primary)',
                            borderRadius: '4px',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="heart-btn"
                      onClick={() => handleRemove(id)}
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer Summary */}
            <div
              style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--text-secondary)' }}>
                <span>Shipping</span>
                <span style={{ color: 'var(--success)' }}>FREE</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  paddingTop: '8px',
                  borderTop: '1px dashed var(--border)',
                }}
              >
                <span>Total</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>

              {/* Delivery Address Input */}
              <div className="form-group" style={{ marginTop: '8px' }}>
                <label className="form-label">Delivery Address</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Street, City, Zip Code"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <button
                type="button"
                className="btn btn-primary btn-lg"
                onClick={handleCheckout}
                disabled={isCheckingOut || items.length === 0}
                style={{ width: '100%', marginTop: '6px' }}
              >
                <span>{isCheckingOut ? 'Processing...' : 'Place Order'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
