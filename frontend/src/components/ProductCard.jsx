import React from 'react';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCartLocal } from '../store/cartSlice';
import { toggleWishlistLocal } from '../store/wishlistSlice';
import { cartService, wishlistService } from '../services/api';
import toast from 'react-hot-toast';

export default function ProductCard({ product, onSelect }) {
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const isWishlisted = wishlistItems.some(
    (item) => (item.productId || item.id) === product.id
  );

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    const itemPayload = {
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      productImage: product.imageUrl,
      quantity: 1,
    };

    dispatch(addToCartLocal(itemPayload));
    toast.success(`Added ${product.name} to cart!`);

    if (isAuthenticated) {
      try {
        await cartService.addToCart(product.id, 1);
      } catch (err) {
        // Silently keep local state if service not currently connected
      }
    }
  };

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
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
      } catch (err) {
        // Keep local state
      }
    }
  };

  return (
    <div className="product-card" onClick={() => onSelect(product)}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'}
          alt={product.name}
          className="product-card-image"
          loading="lazy"
        />

        {/* Wishlist button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`heart-btn ${isWishlisted ? 'active' : ''}`}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'rgba(10, 10, 26, 0.7)',
            borderRadius: '50%',
            padding: 8,
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={18} fill={isWishlisted ? '#ec4899' : 'none'} color={isWishlisted ? '#ec4899' : '#fff'} />
        </button>

        {/* Featured badge */}
        {product.isFeatured && (
          <div style={{ position: 'absolute', top: 10, left: 10 }}>
            <span className="badge badge-warning">Featured</span>
          </div>
        )}
      </div>

      <div className="product-card-body">
        {product.category && (
          <div className="product-card-category">{product.category.name || product.brand}</div>
        )}

        <h3 className="product-card-name" title={product.name}>
          {product.name}
        </h3>

        {/* Rating */}
        <div className="product-card-rating">
          <div style={{ display: 'flex', gap: 2 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={14}
                className={star <= Math.round(product.rating || 4.5) ? 'star-filled' : 'star-empty'}
                fill={star <= Math.round(product.rating || 4.5) ? '#fbbf24' : 'none'}
              />
            ))}
          </div>
          <span className="product-card-rating-text">
            {product.rating || '4.5'} ({product.reviewCount || 120})
          </span>
        </div>

        {/* Price */}
        <div className="product-card-price-row">
          <span className="product-price">₹{Number(product.price).toLocaleString()}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="product-price-original">
              ₹{Number(product.originalPrice).toLocaleString()}
            </span>
          )}
          {discountPercent && <span className="product-discount">{discountPercent}% OFF</span>}
        </div>

        {/* Actions */}
        <div className="product-card-actions">
          <button type="button" className="btn btn-primary" onClick={handleAddToCart}>
            <ShoppingBag size={15} />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
