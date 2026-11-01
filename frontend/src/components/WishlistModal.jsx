import React from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setWishlistOpen, toggleWishlistLocal } from '../store/wishlistSlice';
import { addToCartLocal } from '../store/cartSlice';
import { wishlistService, cartService } from '../services/api';
import toast from 'react-hot-toast';

export default function WishlistModal() {
  const dispatch = useDispatch();
  const { items, isOpen } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isOpen) return null;

  const handleRemove = async (item) => {
    dispatch(toggleWishlistLocal(item));
    toast.success('Removed from wishlist');
    if (isAuthenticated) {
      try {
        await wishlistService.removeFromWishlist(item.productId || item.id);
      } catch (e) {}
    }
  };

  const handleMoveToCart = async (item) => {
    const id = item.productId || item.id;
    dispatch(
      addToCartLocal({
        productId: id,
        productName: item.productName || item.name,
        productPrice: item.productPrice || item.price,
        productImage: item.productImage || item.imageUrl,
        quantity: 1,
      })
    );
    dispatch(toggleWishlistLocal(item));
    toast.success('Moved to cart!');

    if (isAuthenticated) {
      try {
        await cartService.addToCart(id, 1);
        await wishlistService.removeFromWishlist(id);
      } catch (e) {}
    }
  };

  return (
    <div className="overlay" onClick={() => dispatch(setWishlistOpen(false))}>
      <div
        className="modal"
        style={{ maxWidth: '560px', width: '95%', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={20} color="#ec4899" fill="#ec4899" />
            <h3 style={{ fontSize: '18px' }}>My Wishlist ({items.length})</h3>
          </div>
          <button type="button" className="btn-icon" onClick={() => dispatch(setWishlistOpen(false))}>
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Heart size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.4 }} />
            <h4>Your wishlist is empty</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '6px' }}>
              Click the heart icon on any product to save it for later.
            </p>
          </div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {items.map((item) => {
              const id = item.productId || item.id;
              return (
                <div
                  key={id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-glass-strong)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <img
                    src={item.productImage || item.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                    alt={item.productName || item.name}
                    style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.productName || item.name}
                    </h4>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary-light)' }}>
                      ₹{Number(item.productPrice || item.price || 0).toLocaleString()}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => handleMoveToCart(item)}
                    style={{ padding: '6px 12px' }}
                  >
                    <ShoppingBag size={14} />
                    <span>Cart</span>
                  </button>
                  <button
                    type="button"
                    className="heart-btn"
                    onClick={() => handleRemove(item)}
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
