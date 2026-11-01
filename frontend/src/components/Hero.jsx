import React from 'react';
import { Sparkles, Zap, ShieldCheck, Cpu } from 'lucide-react';

export default function Hero({ categories, selectedCategory, onSelectCategory, onExplore }) {
  return (
    <div
      style={{
        paddingTop: 'calc(var(--navbar-height) + 30px)',
        paddingBottom: '30px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '400px',
          background: 'var(--gradient-hero)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', textAlign: 'center' }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', marginBottom: '16px' }}>
            <span
              className="badge badge-primary"
              style={{
                fontSize: '12px',
                padding: '6px 14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Sparkles size={14} /> AI-Powered Microservices E-Commerce
            </span>
          </div>

          <h1 style={{ marginBottom: '16px', letterSpacing: '-1px' }}>
            Smart Shopping Powered by{' '}
            <span
              style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Intelligence
            </span>
          </h1>

          <p
            style={{
              fontSize: '17px',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: '28px',
            }}
          >
            Explore personalized product recommendations, lightning-fast search, and effortless cart
            management backed by Spring Boot microservices and React.
          </p>

          {/* Quick value props */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '20px',
              marginBottom: '32px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <Cpu size={16} color="var(--primary-light)" />
              <span>5 Distributed Microservices</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <Zap size={16} color="var(--warning)" />
              <span>Reactive API Gateway</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={16} color="var(--success)" />
              <span>JWT Authentication</span>
            </div>
          </div>

          {/* Category Chips */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <button
              type="button"
              className={`tag-chip ${selectedCategory === null ? 'active' : ''}`}
              onClick={() => onSelectCategory(null)}
              style={{ fontSize: '13px', padding: '6px 16px' }}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`tag-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat.id)}
                style={{ fontSize: '13px', padding: '6px 16px' }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
