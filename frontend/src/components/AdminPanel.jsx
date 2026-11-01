import React, { useState } from 'react';
import {
  X, Plus, Pencil, Trash2, Save, PackagePlus, Image,
  ShieldCheck, Search, ChevronDown,
} from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY_PRODUCT = {
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  imageUrl: '',
  stock: '',
  rating: '4.5',
  reviewCount: '0',
  categoryId: '',
  tags: '',
  brand: '',
  isFeatured: false,
};

export default function AdminPanel({ isOpen, onClose, products, setProducts, categories }) {
  const [editingProduct, setEditingProduct] = useState(null); // null = list view, object = form
  const [isNew, setIsNew] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  if (!isOpen) return null;

  const openNewForm = () => {
    setEditingProduct({ ...EMPTY_PRODUCT });
    setIsNew(true);
  };

  const openEditForm = (product) => {
    setEditingProduct({
      ...product,
      price: String(product.price),
      originalPrice: String(product.originalPrice || ''),
      stock: String(product.stock || '0'),
      rating: String(product.rating || '4.5'),
      reviewCount: String(product.reviewCount || '0'),
      categoryId: String(product.categoryId || product.category?.id || ''),
    });
    setIsNew(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    if (!editingProduct.name || !editingProduct.price || !editingProduct.categoryId) {
      toast.error('Name, Price and Category are required');
      return;
    }

    const catId = Number(editingProduct.categoryId);
    const category = categories.find((c) => c.id === catId);

    const product = {
      ...editingProduct,
      price: Number(editingProduct.price),
      originalPrice: editingProduct.originalPrice ? Number(editingProduct.originalPrice) : null,
      stock: Number(editingProduct.stock) || 0,
      rating: Number(editingProduct.rating) || 4.5,
      reviewCount: Number(editingProduct.reviewCount) || 0,
      categoryId: catId,
      category: category || { id: catId, name: 'Unknown' },
      imageUrl: editingProduct.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    };

    if (isNew) {
      product.id = Date.now(); // temporary local ID
      setProducts((prev) => [product, ...prev]);
      toast.success(`✅ "${product.name}" added successfully!`);
    } else {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? product : p))
      );
      toast.success(`✅ "${product.name}" updated!`);
    }

    setEditingProduct(null);
    setIsNew(false);
  };

  const handleDelete = (productId, productName) => {
    if (!window.confirm(`Delete "${productName}"? This cannot be undone.`)) return;
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    toast.success(`Deleted "${productName}"`);
  };

  // Filtered list
  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.brand && p.brand.toLowerCase().includes(q));
    const matchesCategory =
      !filterCategory || String(p.categoryId || p.category?.id) === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-primary)',
          borderRadius: 'var(--radius-xl)',
          padding: '0',
          width: '95%',
          maxWidth: '1000px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeIn 0.3s ease',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-surface)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={22} color="var(--success)" />
            <h3 style={{ fontSize: '18px', margin: 0 }}>Admin Panel — Manage Products</h3>
          </div>
          <button type="button" className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {editingProduct ? (
            /* ─── PRODUCT FORM ─── */
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => { setEditingProduct(null); setIsNew(false); }}
                >
                  ← Back
                </button>
                <h4 style={{ margin: 0 }}>
                  {isNew ? 'Add New Product' : `Edit: ${editingProduct.name}`}
                </h4>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Name */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text" name="name" className="form-input"
                    placeholder="e.g. iPhone 15 Pro" value={editingProduct.name}
                    onChange={handleChange} required
                  />
                </div>

                {/* Description */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Description</label>
                  <textarea
                    name="description" className="form-input"
                    placeholder="Product description..."
                    value={editingProduct.description} onChange={handleChange}
                    rows={3} style={{ resize: 'vertical' }}
                  />
                </div>

                {/* Image URL */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">
                    <Image size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                    Image URL
                  </label>
                  <input
                    type="url" name="imageUrl" className="form-input"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={editingProduct.imageUrl} onChange={handleChange}
                  />
                  {editingProduct.imageUrl && (
                    <div style={{ marginTop: '8px' }}>
                      <img
                        src={editingProduct.imageUrl}
                        alt="Preview"
                        style={{
                          width: '160px', height: '120px', objectFit: 'cover',
                          borderRadius: 'var(--radius-md)', border: '1px solid var(--border)',
                        }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    type="number" name="price" className="form-input"
                    placeholder="99999" value={editingProduct.price}
                    onChange={handleChange} required min="0" step="0.01"
                  />
                </div>

                {/* Original Price */}
                <div className="form-group">
                  <label className="form-label">Original Price (₹)</label>
                  <input
                    type="number" name="originalPrice" className="form-input"
                    placeholder="109999" value={editingProduct.originalPrice}
                    onChange={handleChange} min="0" step="0.01"
                  />
                </div>

                {/* Category */}
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    name="categoryId" className="form-input"
                    value={editingProduct.categoryId} onChange={handleChange} required
                  >
                    <option value="">Select category...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input
                    type="text" name="brand" className="form-input"
                    placeholder="Apple" value={editingProduct.brand}
                    onChange={handleChange}
                  />
                </div>

                {/* Stock */}
                <div className="form-group">
                  <label className="form-label">Stock</label>
                  <input
                    type="number" name="stock" className="form-input"
                    placeholder="50" value={editingProduct.stock}
                    onChange={handleChange} min="0"
                  />
                </div>

                {/* Rating */}
                <div className="form-group">
                  <label className="form-label">Rating (0-5)</label>
                  <input
                    type="number" name="rating" className="form-input"
                    placeholder="4.5" value={editingProduct.rating}
                    onChange={handleChange} min="0" max="5" step="0.1"
                  />
                </div>

                {/* Tags */}
                <div className="form-group">
                  <label className="form-label">Tags (comma separated)</label>
                  <input
                    type="text" name="tags" className="form-input"
                    placeholder="smartphone,apple,flagship"
                    value={editingProduct.tags} onChange={handleChange}
                  />
                </div>

                {/* Featured */}
                <div className="form-group" style={{ justifyContent: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox" name="isFeatured"
                      checked={editingProduct.isFeatured} onChange={handleChange}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: 600 }}>Featured Product</span>
                  </label>
                </div>
              </div>

              {/* Save Button */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-primary btn-lg" onClick={handleSave}>
                  <Save size={18} />
                  <span>{isNew ? 'Add Product' : 'Save Changes'}</span>
                </button>
                <button
                  type="button" className="btn btn-ghost btn-lg"
                  onClick={() => { setEditingProduct(null); setIsNew(false); }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* ─── PRODUCT LIST ─── */
            <div>
              {/* Toolbar */}
              <div
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  gap: '12px', marginBottom: '20px', flexWrap: 'wrap',
                }}
              >
                <button type="button" className="btn btn-primary" onClick={openNewForm}>
                  <Plus size={18} /> Add Product
                </button>

                <div style={{ display: 'flex', gap: '10px', flex: 1, maxWidth: '500px' }}>
                  <div className="search-bar" style={{ flex: 1, padding: '6px 14px' }}>
                    <Search size={16} color="var(--text-muted)" />
                    <input
                      type="text" placeholder="Search products..."
                      value={search} onChange={(e) => setSearch(e.target.value)}
                      style={{ fontSize: '13px' }}
                    />
                  </div>
                  <select
                    className="form-input"
                    value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
                    style={{ width: 'auto', padding: '6px 12px', fontSize: '13px', borderRadius: 'var(--radius-full)' }}
                  >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stats */}
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </div>

              {/* Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['Image', 'Name', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map(
                        (h) => (
                          <th
                            key={h}
                            style={{
                              textAlign: 'left', padding: '10px 12px', fontSize: '11px',
                              fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px',
                              color: 'var(--text-muted)', borderBottom: '1px solid var(--border)',
                            }}
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr
                        key={p.id}
                        style={{
                          borderBottom: '1px solid var(--border)',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-glass)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '10px 12px' }}>
                          <img
                            src={p.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'}
                            alt={p.name}
                            style={{
                              width: '48px', height: '48px', objectFit: 'cover',
                              borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)',
                            }}
                          />
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{p.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {p.brand || '—'}
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: '13px' }}>
                          {p.category?.name || '—'}
                        </td>
                        <td style={{ padding: '10px 12px', fontWeight: 700, fontSize: '14px' }}>
                          ₹{Number(p.price).toLocaleString()}
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: '13px' }}>
                          <span
                            className={`badge ${p.stock > 10 ? 'badge-success' : p.stock > 0 ? 'badge-warning' : 'badge-danger'}`}
                          >
                            {p.stock || 0}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', fontSize: '13px' }}>
                          {p.isFeatured ? (
                            <span className="badge badge-primary">Yes</span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>No</span>
                          )}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button" className="btn-icon"
                              title="Edit"
                              onClick={() => openEditForm(p)}
                              style={{ color: 'var(--primary-light)' }}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button" className="btn-icon"
                              title="Delete"
                              onClick={() => handleDelete(p.id, p.name)}
                              style={{ color: 'var(--danger)' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredProducts.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    <PackagePlus size={40} style={{ opacity: 0.4, marginBottom: '12px' }} />
                    <p>No products found. Click "Add Product" to get started.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
