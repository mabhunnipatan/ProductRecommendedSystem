-- ============================================================
-- E-Commerce Database Schema Setup
-- Run this script as root on MySQL 3306
-- ============================================================

-- Auth Service Database
CREATE DATABASE IF NOT EXISTS auth_db;
USE auth_db;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER',
    full_name VARCHAR(100),
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Product Service Database
CREATE DATABASE IF NOT EXISTS product_db;
USE product_db;

CREATE TABLE IF NOT EXISTS categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    image_url VARCHAR(500),
    stock INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.0,
    review_count INT DEFAULT 0,
    category_id BIGINT,
    tags VARCHAR(500),
    brand VARCHAR(100),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS product_views (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart Service Database
CREATE DATABASE IF NOT EXISTS cart_db;
USE cart_db;

CREATE TABLE IF NOT EXISTS cart_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(200),
    product_image VARCHAR(500),
    product_price DECIMAL(10,2),
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wishlist (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(200),
    product_image VARCHAR(500),
    product_price DECIMAL(10,2),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_wishlist (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recommendation Service Database
CREATE DATABASE IF NOT EXISTS recommendation_db;
USE recommendation_db;

CREATE TABLE IF NOT EXISTS search_history (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    query VARCHAR(500) NOT NULL,
    result_count INT DEFAULT 0,
    searched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_events (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    event_type ENUM('VIEW','LIKE','ADD_TO_CART','PURCHASE','SEARCH_CLICK') NOT NULL,
    category_id BIGINT,
    tags VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recommendations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    score DECIMAL(5,4) DEFAULT 0.0,
    reason VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_chat_sessions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    session_id VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_chat_messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_id VARCHAR(100) NOT NULL,
    role ENUM('USER','ASSISTANT') NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Seed Data
-- ============================================================
USE product_db;

INSERT INTO categories (name, description, icon) VALUES
('Electronics', 'Phones, Laptops, Gadgets & more', 'laptop'),
('Clothing', 'Men, Women & Kids Fashion', 'shirt'),
('Books', 'Bestsellers, Fiction, Non-fiction', 'book'),
('Home & Kitchen', 'Furniture, Appliances, Decor', 'home'),
('Sports', 'Fitness, Outdoor & Sports gear', 'dumbbell'),
('Beauty', 'Skincare, Makeup & Wellness', 'sparkles');

INSERT INTO products (name, description, price, original_price, image_url, stock, rating, review_count, category_id, tags, brand, is_featured) VALUES
-- Electronics
('iPhone 15 Pro', 'Latest Apple flagship with titanium design, A17 Pro chip, and advanced camera system', 99999.00, 109999.00, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500', 50, 4.8, 2340, 1, 'smartphone,apple,flagship,ios', 'Apple', TRUE),
('Samsung Galaxy S24 Ultra', 'Galaxy AI features, 200MP camera, built-in S Pen, 6.8-inch display', 89999.00, 99999.00, 'https://images.unsplash.com/photo-1707131169598-2f8e5e1e7c0f?w=500', 35, 4.7, 1890, 1, 'smartphone,samsung,android,ai', 'Samsung', TRUE),
('MacBook Pro 14"', 'M3 Pro chip, 18GB RAM, Liquid Retina XDR display, 22hr battery', 169999.00, 189999.00, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', 20, 4.9, 876, 1, 'laptop,apple,macbook,m3,productivity', 'Apple', TRUE),
('Sony WH-1000XM5', 'Industry-leading noise cancellation wireless headphones, 30hr battery', 24999.00, 34999.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 80, 4.8, 3210, 1, 'headphones,sony,noise-cancelling,wireless,audio', 'Sony', FALSE),
('iPad Air M2', '11-inch Liquid Retina, M2 chip, Apple Pencil Pro support, all-day battery', 59999.00, 64999.00, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500', 45, 4.7, 654, 1, 'tablet,apple,ipad,m2', 'Apple', FALSE),
('Dell XPS 15', '15.6" OLED display, Intel i9, 32GB RAM, RTX 4060, premium build', 149999.00, 169999.00, 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500', 15, 4.6, 432, 1, 'laptop,dell,windows,gaming,productivity', 'Dell', FALSE),
('GoPro Hero 12', 'Waterproof action camera, 5.3K video, HyperSmooth 6.0 stabilization', 34999.00, 39999.00, 'https://images.unsplash.com/photo-1606986628253-c7e4e62e6c80?w=500', 60, 4.5, 987, 1, 'camera,gopro,action,waterproof,4k', 'GoPro', FALSE),

-- Clothing
('Nike Air Max 270', 'Iconic Air cushioning, breathable mesh upper, lifestyle sneaker', 8999.00, 12999.00, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 120, 4.6, 5432, 2, 'shoes,nike,sneakers,running,sports', 'Nike', TRUE),
('Levi''s 501 Original Jeans', 'Classic straight fit, button fly, 100% cotton denim', 4999.00, 6999.00, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', 200, 4.5, 8921, 2, 'jeans,levis,denim,classic,casual', 'Levi''s', FALSE),
('Adidas Ultraboost 23', 'Responsive Boost midsole, Primeknit upper, Continental rubber outsole', 12999.00, 16999.00, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500', 90, 4.7, 3456, 2, 'shoes,adidas,running,boost,performance', 'Adidas', TRUE),
('Zara Summer Dress', 'Floral print, midi length, adjustable straps, lightweight fabric', 2999.00, 4499.00, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500', 150, 4.3, 2109, 2, 'dress,zara,summer,floral,women', 'Zara', FALSE),
('H&M Slim Fit Shirt', 'Cotton blend, slim fit, wrinkle-resistant, multiple colors available', 1299.00, 1999.00, 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=500', 300, 4.2, 1876, 2, 'shirt,hm,formal,slim-fit,men', 'H&M', FALSE),

-- Books
('Atomic Habits', 'James Clear - Tiny changes, remarkable results. #1 NYT Bestseller', 499.00, 699.00, 'https://images.unsplash.com/photo-1598618443855-232ee0f819f6?w=500', 500, 4.9, 45678, 3, 'self-help,habits,productivity,bestseller,james-clear', 'Penguin', TRUE),
('The Psychology of Money', 'Morgan Housel - Timeless lessons on wealth, greed, and happiness', 399.00, 599.00, 'https://images.unsplash.com/photo-1554774853-b415df9eeb92?w=500', 400, 4.8, 32109, 3, 'finance,money,psychology,investing,bestseller', 'Penguin', FALSE),
('Dune', 'Frank Herbert - The greatest science fiction novel ever written', 349.00, 499.00, 'https://images.unsplash.com/photo-1500099817043-86d46000d58f?w=500', 300, 4.7, 28765, 3, 'sci-fi,fiction,dune,classic,adventure', 'Chilton Books', FALSE),
('Clean Code', 'Robert C. Martin - A handbook of agile software craftsmanship', 799.00, 999.00, 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500', 200, 4.6, 15432, 3, 'programming,coding,software,tech,development', 'Prentice Hall', FALSE),

-- Home & Kitchen
('Dyson V15 Detect', 'Laser dust detection, HEPA filtration, 60min runtime cordless vacuum', 54999.00, 64999.00, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 25, 4.8, 2341, 4, 'vacuum,dyson,home,cleaning,cordless', 'Dyson', TRUE),
('Instant Pot Duo 7-in-1', 'Pressure cooker, slow cooker, rice cooker, steamer, and more', 8999.00, 12999.00, 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500', 60, 4.7, 87654, 4, 'kitchen,cooking,pressure-cooker,instant-pot,home', 'Instant Pot', TRUE),
('IKEA BILLY Bookcase', 'Classic white bookcase, adjustable shelves, 80x28x202cm', 4999.00, 6499.00, 'https://images.unsplash.com/photo-1493663284031-b7e3aaa4e3e4?w=500', 40, 4.4, 9876, 4, 'furniture,bookcase,ikea,storage,home-decor', 'IKEA', FALSE),
('Philips Hue Starter Kit', 'Smart LED bulbs, full spectrum color, voice & app control', 7999.00, 9999.00, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 75, 4.6, 4532, 4, 'smart-home,philips,lighting,iot,home', 'Philips', FALSE),

-- Sports
('Yoga Mat Premium', 'Non-slip, 6mm thick TPE material, includes carrying strap', 1999.00, 2999.00, 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=500', 200, 4.5, 6789, 5, 'yoga,fitness,mat,exercise,meditation', 'Boldfit', FALSE),
('Whey Protein Isolate', 'MyProtein Impact Whey - 25g protein per serving, chocolate flavor', 3499.00, 4999.00, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500', 150, 4.7, 23456, 5, 'protein,fitness,gym,nutrition,supplement', 'MyProtein', TRUE),
('Resistance Band Set', '5-level resistance bands, door anchor, handles, ankle straps included', 1499.00, 2499.00, 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500', 300, 4.4, 8765, 5, 'resistance-bands,fitness,home-gym,exercise,training', 'Boldfit', FALSE),
('Garmin Forerunner 265', 'Running smartwatch, AMOLED display, GPS, heart rate, training metrics', 34999.00, 44999.00, 'https://images.unsplash.com/photo-1523475496153-3206d9f3e014?w=500', 30, 4.8, 3421, 5, 'smartwatch,garmin,running,gps,fitness-tracker', 'Garmin', TRUE),

-- Beauty
('The Ordinary Niacinamide', '10% Niacinamide + 1% Zinc, reduces blemishes and pore appearance', 599.00, 799.00, 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500', 500, 4.6, 34567, 6, 'skincare,niacinamide,serum,the-ordinary,beauty', 'The Ordinary', FALSE),
('Maybelline Fit Me Foundation', 'Matte + Poreless liquid foundation, 40 shades, SPF 22', 799.00, 999.00, 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500', 400, 4.5, 45678, 6, 'foundation,makeup,maybelline,beauty,cosmetics', 'Maybelline', TRUE),
('Forest Essentials Face Wash', 'Ayurvedic cleansing gel with Kashmiri Saffron, natural ingredients', 1299.00, 1699.00, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500', 200, 4.7, 8765, 6, 'face-wash,ayurvedic,natural,skincare,forest-essentials', 'Forest Essentials', FALSE),
('Dyson Airwrap', 'Styling tool with no extreme heat, creates curls, waves, and straight styles', 44999.00, 52999.00, 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500', 20, 4.7, 12345, 6, 'hair,dyson,styling,beauty,premium', 'Dyson', TRUE),
('Biotique Bio Almond Oil', 'Cold pressed almond oil for face, hair, and body, 200ml', 399.00, 549.00, 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=500', 600, 4.4, 9876, 6, 'oil,biotique,natural,hair-care,skin-care', 'Biotique', FALSE);
