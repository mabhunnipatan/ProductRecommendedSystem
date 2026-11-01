import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import WishlistModal from './components/WishlistModal';
import AuthModal from './components/AuthModal';
import AiAssistant from './components/AiAssistant';
import AdminPanel from './components/AdminPanel';
import { productService } from './services/api';
import { Sparkles, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

// Fallback seed catalog matching backend schema.sql
const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Electronics', icon: 'laptop' },
  { id: 2, name: 'Clothing', icon: 'shirt' },
  { id: 3, name: 'Books', icon: 'book' },
  { id: 4, name: 'Home & Kitchen', icon: 'home' },
  { id: 5, name: 'Sports', icon: 'dumbbell' },
  { id: 6, name: 'Beauty', icon: 'sparkles' },
];

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: 'iPhone 15 Pro',
    description: 'Latest Apple flagship with titanium design, A17 Pro chip, and advanced camera system',
    price: 99999.0,
    originalPrice: 109999.0,
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
    stock: 50,
    rating: 4.8,
    reviewCount: 2340,
    categoryId: 1,
    category: { id: 1, name: 'Electronics' },
    tags: 'smartphone,apple,flagship,ios',
    brand: 'Apple',
    isFeatured: true,
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Galaxy AI features, 200MP camera, built-in S Pen, 6.8-inch display',
    price: 89999.0,
    originalPrice: 99999.0,
    imageUrl: 'https://images.unsplash.com/photo-1707131169598-2f8e5e1e7c0f?w=500',
    stock: 35,
    rating: 4.7,
    reviewCount: 1890,
    categoryId: 1,
    category: { id: 1, name: 'Electronics' },
    tags: 'smartphone,samsung,android,ai',
    brand: 'Samsung',
    isFeatured: true,
  },
  {
    id: 3,
    name: 'MacBook Pro 14"',
    description: 'M3 Pro chip, 18GB RAM, Liquid Retina XDR display, 22hr battery',
    price: 169999.0,
    originalPrice: 189999.0,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
    stock: 20,
    rating: 4.9,
    reviewCount: 876,
    categoryId: 1,
    category: { id: 1, name: 'Electronics' },
    tags: 'laptop,apple,macbook,m3,productivity',
    brand: 'Apple',
    isFeatured: true,
  },
  {
    id: 4,
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise cancellation wireless headphones, 30hr battery',
    price: 24999.0,
    originalPrice: 34999.0,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    stock: 80,
    rating: 4.8,
    reviewCount: 3210,
    categoryId: 1,
    category: { id: 1, name: 'Electronics' },
    tags: 'headphones,sony,noise-cancelling,wireless,audio',
    brand: 'Sony',
    isFeatured: false,
  },
  {
    id: 5,
    name: 'iPad Air M2',
    description: '11-inch Liquid Retina, M2 chip, Apple Pencil Pro support, all-day battery',
    price: 59999.0,
    originalPrice: 64999.0,
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
    stock: 45,
    rating: 4.7,
    reviewCount: 654,
    categoryId: 1,
    category: { id: 1, name: 'Electronics' },
    tags: 'tablet,apple,ipad,m2',
    brand: 'Apple',
    isFeatured: false,
  },
  {
    id: 6,
    name: 'Dell XPS 15',
    description: '15.6" OLED display, Intel i9, 32GB RAM, RTX 4060, premium build',
    price: 149999.0,
    originalPrice: 169999.0,
    imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500',
    stock: 15,
    rating: 4.6,
    reviewCount: 432,
    categoryId: 1,
    category: { id: 1, name: 'Electronics' },
    tags: 'laptop,dell,windows,gaming,productivity',
    brand: 'Dell',
    isFeatured: false,
  },
  {
    id: 7,
    name: 'GoPro Hero 12',
    description: 'Waterproof action camera, 5.3K video, HyperSmooth 6.0 stabilization',
    price: 34999.0,
    originalPrice: 39999.0,
    imageUrl: 'https://images.unsplash.com/photo-1606986628253-c7e4e62e6c80?w=500',
    stock: 60,
    rating: 4.5,
    reviewCount: 987,
    categoryId: 1,
    category: { id: 1, name: 'Electronics' },
    tags: 'camera,gopro,action,waterproof,4k',
    brand: 'GoPro',
    isFeatured: false,
  },
  {
    id: 8,
    name: 'Nike Air Max 270',
    description: 'Iconic Air cushioning, breathable mesh upper, lifestyle sneaker',
    price: 8999.0,
    originalPrice: 12999.0,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    stock: 120,
    rating: 4.6,
    reviewCount: 5432,
    categoryId: 2,
    category: { id: 2, name: 'Clothing' },
    tags: 'shoes,nike,sneakers,running,sports',
    brand: 'Nike',
    isFeatured: true,
  },
  {
    id: 9,
    name: "Levi's 501 Original Jeans",
    description: 'Classic straight fit, button fly, 100% cotton denim',
    price: 4999.0,
    originalPrice: 6999.0,
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
    stock: 200,
    rating: 4.5,
    reviewCount: 8921,
    categoryId: 2,
    category: { id: 2, name: 'Clothing' },
    tags: 'jeans,levis,denim,classic,casual',
    brand: "Levi's",
    isFeatured: false,
  },
  {
    id: 10,
    name: 'Adidas Ultraboost 23',
    description: 'Responsive Boost midsole, Primeknit upper, Continental rubber outsole',
    price: 12999.0,
    originalPrice: 16999.0,
    imageUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500',
    stock: 90,
    rating: 4.7,
    reviewCount: 3456,
    categoryId: 2,
    category: { id: 2, name: 'Clothing' },
    tags: 'shoes,adidas,running,boost,performance',
    brand: 'Adidas',
    isFeatured: true,
  },
  {
    id: 11,
    name: 'Zara Summer Dress',
    description: 'Floral print, midi length, adjustable straps, lightweight fabric',
    price: 2999.0,
    originalPrice: 4499.0,
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500',
    stock: 150,
    rating: 4.3,
    reviewCount: 2109,
    categoryId: 2,
    category: { id: 2, name: 'Clothing' },
    tags: 'dress,zara,summer,floral,women',
    brand: 'Zara',
    isFeatured: false,
  },
  {
    id: 12,
    name: 'H&M Slim Fit Shirt',
    description: 'Cotton blend, slim fit, wrinkle-resistant, multiple colors available',
    price: 1299.0,
    originalPrice: 1999.0,
    imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500',
    stock: 300,
    rating: 4.2,
    reviewCount: 1876,
    categoryId: 2,
    category: { id: 2, name: 'Clothing' },
    tags: 'shirt,hm,formal,slim-fit,men',
    brand: 'H&M',
    isFeatured: false,
  },
  {
    id: 13,
    name: 'Atomic Habits',
    description: 'James Clear - Tiny changes, remarkable results. #1 NYT Bestseller',
    price: 499.0,
    originalPrice: 699.0,
    imageUrl: 'https://images.unsplash.com/photo-1598618443855-232ee0f819f6?w=500',
    stock: 500,
    rating: 4.9,
    reviewCount: 45678,
    categoryId: 3,
    category: { id: 3, name: 'Books' },
    tags: 'self-help,habits,productivity,bestseller,james-clear',
    brand: 'Penguin',
    isFeatured: true,
  },
  {
    id: 14,
    name: 'The Psychology of Money',
    description: 'Morgan Housel - Timeless lessons on wealth, greed, and happiness',
    price: 399.0,
    originalPrice: 599.0,
    imageUrl: 'https://images.unsplash.com/photo-1554774853-b415df9eeb92?w=500',
    stock: 400,
    rating: 4.8,
    reviewCount: 32109,
    categoryId: 3,
    category: { id: 3, name: 'Books' },
    tags: 'finance,money,psychology,investing,bestseller',
    brand: 'Penguin',
    isFeatured: false,
  },
  {
    id: 15,
    name: 'Dune',
    description: 'Frank Herbert - The greatest science fiction novel ever written',
    price: 349.0,
    originalPrice: 499.0,
    imageUrl: 'https://images.unsplash.com/photo-1500099817043-86d46000d58f?w=500',
    stock: 300,
    rating: 4.7,
    reviewCount: 28765,
    categoryId: 3,
    category: { id: 3, name: 'Books' },
    tags: 'sci-fi,fiction,dune,classic,adventure',
    brand: 'Chilton Books',
    isFeatured: false,
  },
  {
    id: 16,
    name: 'Clean Code',
    description: 'Robert C. Martin - A handbook of agile software craftsmanship',
    price: 799.0,
    originalPrice: 999.0,
    imageUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500',
    stock: 200,
    rating: 4.6,
    reviewCount: 15432,
    categoryId: 3,
    category: { id: 3, name: 'Books' },
    tags: 'programming,coding,software,tech,development',
    brand: 'Prentice Hall',
    isFeatured: false,
  },
  {
    id: 17,
    name: 'Dyson V15 Detect',
    description: 'Laser dust detection, HEPA filtration, 60min runtime cordless vacuum',
    price: 54999.0,
    originalPrice: 64999.0,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    stock: 25,
    rating: 4.8,
    reviewCount: 2341,
    categoryId: 4,
    category: { id: 4, name: 'Home & Kitchen' },
    tags: 'vacuum,dyson,home,cleaning,cordless',
    brand: 'Dyson',
    isFeatured: true,
  },
  {
    id: 18,
    name: 'Instant Pot Duo 7-in-1',
    description: 'Pressure cooker, slow cooker, rice cooker, steamer, and more',
    price: 8999.0,
    originalPrice: 12999.0,
    imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500',
    stock: 60,
    rating: 4.7,
    reviewCount: 87654,
    categoryId: 4,
    category: { id: 4, name: 'Home & Kitchen' },
    tags: 'kitchen,cooking,pressure-cooker,instant-pot,home',
    brand: 'Instant Pot',
    isFeatured: true,
  },
  {
    id: 19,
    name: 'IKEA BILLY Bookcase',
    description: 'Classic white bookcase, adjustable shelves, 80x28x202cm',
    price: 4999.0,
    originalPrice: 6499.0,
    imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aaa4e3e4?w=500',
    stock: 40,
    rating: 4.4,
    reviewCount: 9876,
    categoryId: 4,
    category: { id: 4, name: 'Home & Kitchen' },
    tags: 'furniture,bookcase,ikea,storage,home-decor',
    brand: 'IKEA',
    isFeatured: false,
  },
  {
    id: 20,
    name: 'Philips Hue Starter Kit',
    description: 'Smart LED bulbs, full spectrum color, voice & app control',
    price: 7999.0,
    originalPrice: 9999.0,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    stock: 75,
    rating: 4.6,
    reviewCount: 4532,
    categoryId: 4,
    category: { id: 4, name: 'Home & Kitchen' },
    tags: 'smart-home,philips,lighting,iot,home',
    brand: 'Philips',
    isFeatured: false,
  },
  {
    id: 21,
    name: 'Yoga Mat Premium',
    description: 'Non-slip, 6mm thick TPE material, includes carrying strap',
    price: 1999.0,
    originalPrice: 2999.0,
    imageUrl: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=500',
    stock: 200,
    rating: 4.5,
    reviewCount: 6789,
    categoryId: 5,
    category: { id: 5, name: 'Sports' },
    tags: 'yoga,fitness,mat,exercise,meditation',
    brand: 'Boldfit',
    isFeatured: false,
  },
  {
    id: 22,
    name: 'Whey Protein Isolate',
    description: 'MyProtein Impact Whey - 25g protein per serving, chocolate flavor',
    price: 3499.0,
    originalPrice: 4999.0,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
    stock: 150,
    rating: 4.7,
    reviewCount: 23456,
    categoryId: 5,
    category: { id: 5, name: 'Sports' },
    tags: 'protein,fitness,gym,nutrition,supplement',
    brand: 'MyProtein',
    isFeatured: true,
  },
  {
    id: 23,
    name: 'Resistance Band Set',
    description: '5-level resistance bands, door anchor, handles, ankle straps included',
    price: 1499.0,
    originalPrice: 2499.0,
    imageUrl: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500',
    stock: 300,
    rating: 4.4,
    reviewCount: 8765,
    categoryId: 5,
    category: { id: 5, name: 'Sports' },
    tags: 'resistance-bands,fitness,home-gym,exercise,training',
    brand: 'Boldfit',
    isFeatured: false,
  },
  {
    id: 24,
    name: 'Garmin Forerunner 265',
    description: 'Running smartwatch, AMOLED display, GPS, heart rate, training metrics',
    price: 34999.0,
    originalPrice: 44999.0,
    imageUrl: 'https://images.unsplash.com/photo-1523475496153-3206d9f3e014?w=500',
    stock: 30,
    rating: 4.8,
    reviewCount: 3421,
    categoryId: 5,
    category: { id: 5, name: 'Sports' },
    tags: 'smartwatch,garmin,running,gps,fitness-tracker',
    brand: 'Garmin',
    isFeatured: true,
  },
  {
    id: 25,
    name: 'The Ordinary Niacinamide',
    description: '10% Niacinamide + 1% Zinc, reduces blemishes and pore appearance',
    price: 599.0,
    originalPrice: 799.0,
    imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500',
    stock: 500,
    rating: 4.6,
    reviewCount: 34567,
    categoryId: 6,
    category: { id: 6, name: 'Beauty' },
    tags: 'skincare,niacinamide,serum,the-ordinary,beauty',
    brand: 'The Ordinary',
    isFeatured: false,
  },
  {
    id: 26,
    name: 'Maybelline Fit Me Foundation',
    description: 'Matte + Poreless liquid foundation, 40 shades, SPF 22',
    price: 799.0,
    originalPrice: 999.0,
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500',
    stock: 400,
    rating: 4.5,
    reviewCount: 45678,
    categoryId: 6,
    category: { id: 6, name: 'Beauty' },
    tags: 'foundation,makeup,maybelline,beauty,cosmetics',
    brand: 'Maybelline',
    isFeatured: true,
  },
  {
    id: 27,
    name: 'Forest Essentials Face Wash',
    description: 'Ayurvedic cleansing gel with Kashmiri Saffron, natural ingredients',
    price: 1299.0,
    originalPrice: 1699.0,
    imageUrl: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500',
    stock: 200,
    rating: 4.7,
    reviewCount: 8765,
    categoryId: 6,
    category: { id: 6, name: 'Beauty' },
    tags: 'face-wash,ayurvedic,natural,skincare,forest-essentials',
    brand: 'Forest Essentials',
    isFeatured: false,
  },
  {
    id: 28,
    name: 'Dyson Airwrap',
    description: 'Styling tool with no extreme heat, creates curls, waves, and straight styles',
    price: 44999.0,
    originalPrice: 52999.0,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500',
    stock: 20,
    rating: 4.7,
    reviewCount: 12345,
    categoryId: 6,
    category: { id: 6, name: 'Beauty' },
    tags: 'hair,dyson,styling,beauty,premium',
    brand: 'Dyson',
    isFeatured: true,
  },
  {
    id: 29,
    name: 'Biotique Bio Almond Oil',
    description: 'Cold pressed almond oil for face, hair, and body, 200ml',
    price: 399.0,
    originalPrice: 549.0,
    imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500',
    stock: 600,
    rating: 4.4,
    reviewCount: 9876,
    categoryId: 6,
    category: { id: 6, name: 'Beauty' },
    tags: 'oil,biotique,natural,hair-care,skin-care',
    brand: 'Biotique',
    isFeatured: false,
  },
];

export default function App() {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'ADMIN';

  // Fetch from Spring Boot backend if available
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await productService.getCategories();
        if (catRes && catRes.length > 0) {
          setCategories(catRes);
        }
      } catch (err) {
        // Fallback to local default data
      }

      try {
        const prodRes = await productService.getProducts();
        if (prodRes && prodRes.content && prodRes.content.length > 0) {
          setProducts(prodRes.content);
        } else if (Array.isArray(prodRes) && prodRes.length > 0) {
          setProducts(prodRes);
        }
      } catch (err) {
        // Fallback to local default data
      }
    };

    fetchData();
  }, []);

  // Build a lookup map: categoryId -> category name (lowercased)
  const categoryNameMap = {};
  categories.forEach((c) => {
    categoryNameMap[c.id] = c.name.toLowerCase();
  });

  // Filter products — now also matches CATEGORY NAME so "kitchen" finds "Home & Kitchen"
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory ? (p.categoryId || p.category?.id) === selectedCategory : true;
    const q = searchQuery.toLowerCase().trim();

    if (!q) return matchesCategory;

    const catId = p.categoryId || p.category?.id;
    const catName = categoryNameMap[catId] || p.category?.name?.toLowerCase() || '';

    const matchesSearch =
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.tags && p.tags.toLowerCase().includes(q)) ||
      (p.brand && p.brand.toLowerCase().includes(q)) ||
      catName.includes(q);

    return matchesCategory && matchesSearch;
  });

  // Auto-select category when search matches a category name exactly
  useEffect(() => {
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase().trim();
    const matchedCat = categories.find((c) => c.name.toLowerCase().includes(q));
    if (matchedCat && selectedCategory !== matchedCat.id) {
      setSelectedCategory(matchedCat.id);
    }
  }, [searchQuery]);

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        onOpenAuth={() => setIsAuthOpen(true)}
        onToggleAi={() => setIsAiOpen(!isAiOpen)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={(q) => {
          setSearchQuery(q);
          // When clearing search, also clear category filter
          if (!q) setSelectedCategory(null);
        }}
        isAdmin={isAdmin}
      />

      <Hero
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          // Clear search when manually selecting a category
          if (catId !== null) setSearchQuery('');
        }}
      />

      {/* Main catalog */}
      <main className="container" style={{ flex: 1, paddingBottom: '60px' }}>
        {/* Filter bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '20px' }}>
              {searchQuery
                ? `Search results for "${searchQuery}"`
                : selectedCategory
                ? `${categories.find((c) => c.id === selectedCategory)?.name || 'Category'} Products`
                : 'Featured Catalog'}
            </h2>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              Showing {sortedProducts.length} items
            </span>
          </div>

          {/* Sort selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpDown size={16} color="var(--text-muted)" />
            <select
              className="form-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: 'auto',
                padding: '8px 16px',
                fontSize: '13px',
                borderRadius: 'var(--radius-full)',
              }}
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {sortedProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <Sparkles size={48} color="var(--primary)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
            <h3>No products found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '6px' }}>
              Try searching with different keywords or clearing your filters.
            </p>
            {searchQuery && (
              <button
                type="button"
                className="btn btn-secondary"
                style={{ marginTop: '16px' }}
                onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartDrawer />
      <WishlistModal />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        setProducts={setProducts}
        categories={categories}
      />
      <AiAssistant
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-surface)',
          padding: '40px 0 24px',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Sparkles size={18} color="var(--primary)" />
              <strong style={{ fontSize: '18px', fontFamily: 'var(--font-heading)' }}>ShopAI</strong>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              Full-Stack Spring Boot Microservices & React Application
            </p>
          </div>

          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} ShopAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
