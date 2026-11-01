import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartLocal } from '../store/cartSlice';
import { toggleWishlistLocal } from '../store/wishlistSlice';
import { cartService, wishlistService } from '../services/api';
import toast from 'react-hot-toast';

export default function ProductDetailModal({ product, onClose }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!product) return null;

  const isWishlisted = wishlistItems.some(
    (item) => (item.productId || item.id) === product.id
  );

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = async () => {
    const itemPayload = {
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      productImage: product.imageUrl,
      quantity,
    };
    dispatch(addToCartLocal(itemPayload));
    toast.success(`Added ${quantity} × ${product.name} to cart!`);

    if (isAuthenticated) {
      try {
        await cartService.addToCart(product.id, quantity);
      } catch (e) {}
    }
    onClose();
  };

  const handleToggleWishlist = async () => {
    const itemPayload = {
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      productImage: product.imageUrl,
    };
    dispatch(toggleWishlistLocal(itemPayload));
    toast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️');

    if (isAuthenticated) {
      try {
        if (isWishlisted) {
          await wishlistService.removeFromWishlist(product.id);
        } else {
          await wishlistService.addToWishlist(product.id);
        }
      } catch (e) {}
    }
  };

  const tags = product.tags ? product.tags.split(',') : [];

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="modal"
        style={{ maxWidth: '780px', width: '95%', padding: '24px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
          <button type="button" className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Image */}
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ width: '100%', height: '100%', maxHeight: '380px', objectFit: 'cover' }}
            />
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span className="badge badge-primary">{product.category?.name || product.brand || 'Store'}</span>
              <button
                type="button"
                className="heart-btn"
                onClick={handleToggleWishlist}
                title="Wishlist"
              >
                <Heart
                  size={22}
                  fill={isWishlisted ? '#ec4899' : 'none'}
                  color={isWishlisted ? '#ec4899' : 'var(--text-muted)'}
                />
              </button>
            </div>

            <h2 style={{ fontSize: '22px', margin: '10px 0 8px' }}>{product.name}</h2>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={15}
                    fill={star <= Math.round(product.rating || 4.5) ? '#fbbf24' : 'none'}
                    color={star <= Math.round(product.rating || 4.5) ? '#fbbf24' : 'var(--text-muted)'}
                  />
                ))}
              </div>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {product.rating || '4.5'} ({product.reviewCount || 120} reviews)
              </span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)' }}>
                ₹{Number(product.price).toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="product-price-original" style={{ fontSize: '16px' }}>
                  ₹{Number(product.originalPrice).toLocaleString()}
                </span>
              )}
              {discountPercent && (
                <span className="product-discount">{discountPercent}% OFF</span>
              )}
            </div>

            {/* Description */}
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
              {product.description}
            </p>

            {/* Tags */}
            {tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                {tags.map((tag, idx) => (
                  <span key={idx} className="tag-chip" style={{ fontSize: '11px', cursor: 'default' }}>
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div style={{ marginTop: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--bg-glass-strong)',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border)',
                  padding: '4px 8px',
                }}
              >
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    background: 'none',
                    color: 'var(--text-primary)',
                    padding: '4px 10px',
                    fontSize: '18px',
                  }}
                >
                  -
                </button>
                <span style={{ padding: '0 8px', fontWeight: 700, fontSize: '15px' }}>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    background: 'none',
                    color: 'var(--text-primary)',
                    padding: '4px 10px',
                    fontSize: '18px',
                  }}
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={handleAddToCart}
              >
                <ShoppingBag size={18} />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Benefits */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border)',
                fontSize: '12px',
                color: 'var(--text-muted)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Truck size={14} color="var(--primary-light)" /> Free Delivery
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <RefreshCw size={14} color="var(--primary-light)" /> 7-Day Returns
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <ShieldCheck size={14} color="var(--primary-light)" /> 1-Yr Warranty
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
