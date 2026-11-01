import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, Bot, User, ArrowRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCartLocal } from '../store/cartSlice';
import toast from 'react-hot-toast';

export default function AiAssistant({ isOpen, onClose, products, onSelectProduct }) {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hello! I'm your ShopAI Shopping Assistant. I can help you find products, compare prices, or give you personalized recommendations. What are you looking for today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      // Find matching products by name, description, tags, brand
      const q = query.toLowerCase();
      const matches = products.filter((p) => {
        const name = (p.name || '').toLowerCase();
        const desc = (p.description || '').toLowerCase();
        const tags = (p.tags || '').toLowerCase();
        const brand = (p.brand || '').toLowerCase();
        return name.includes(q) || desc.includes(q) || tags.includes(q) || brand.includes(q);
      });

      let replyContent = '';
      let suggestedProducts = [];

      if (matches.length > 0) {
        suggestedProducts = matches.slice(0, 3);
        replyContent = `Based on your request, I found ${matches.length} matching product${
          matches.length > 1 ? 's' : ''
        } in our catalog:`;
      } else if (q.includes('recommend') || q.includes('suggest') || q.includes('best')) {
        suggestedProducts = products.filter((p) => p.isFeatured).slice(0, 3);
        replyContent = "Here are our highest-rated and featured products handpicked for you:";
      } else if (q.includes('phone') || q.includes('mobile')) {
        suggestedProducts = products.filter((p) => (p.tags || '').includes('smartphone')).slice(0, 3);
        replyContent = "Here are our top smartphones available now:";
      } else if (q.includes('laptop') || q.includes('computer')) {
        suggestedProducts = products.filter((p) => (p.tags || '').includes('laptop')).slice(0, 3);
        replyContent = "Here are top-tier laptops for work, programming, and creative tasks:";
      } else {
        suggestedProducts = products.slice(0, 2);
        replyContent = `I searched our catalog for "${query}". Here are relevant suggestions you might love:`;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: replyContent,
          suggestions: suggestedProducts,
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  const quickPrompts = [
    'Best smartphones with AI',
    'Laptops for coding',
    'Noise-cancelling headphones',
    'Workout & protein supplements',
  ];

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="modal"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          maxWidth: '460px',
          width: '100%',
          borderRadius: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px',
          boxSizing: 'border-box',
          overflowY: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={18} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', margin: 0 }}>ShopAI Assistant</h3>
              <span style={{ fontSize: '11px', color: 'var(--success)' }}>● Real-time AI Advisor</span>
            </div>
          </div>
          <button type="button" className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Quick Prompts */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '8px' }}>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              className="tag-chip"
              style={{ whiteSpace: 'nowrap' }}
              onClick={() => handleSend(p)}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', paddingRight: '4px' }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '8px',
                  maxWidth: '85%',
                  alignItems: 'flex-start',
                }}
              >
                {msg.role === 'assistant' && (
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '4px',
                      flexShrink: 0,
                    }}
                  >
                    <Bot size={14} color="#fff" />
                  </div>
                )}

                <div
                  style={{
                    background:
                      msg.role === 'user' ? 'var(--gradient-primary)' : 'var(--bg-glass-strong)',
                    border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                    borderRadius: '16px',
                    padding: '12px 16px',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
                  }}
                >
                  {msg.content}
                </div>
              </div>

              {/* Suggestions Cards */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div style={{ width: '100%', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {msg.suggestions.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-primary)',
                        borderRadius: 'var(--radius-md)',
                        padding: '10px',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        onSelectProduct(item);
                        onClose();
                      }}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h5 style={{ fontSize: '13px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </h5>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary-light)' }}>
                          ₹{Number(item.price).toLocaleString()}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ padding: '4px 10px', fontSize: '11px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            addToCartLocal({
                              productId: item.id,
                              productName: item.name,
                              productPrice: item.price,
                              productImage: item.imageUrl,
                              quantity: 1,
                            })
                          );
                          toast.success(`Added ${item.name} to cart!`);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bot size={14} color="#fff" />
              </div>
              <div
                style={{
                  background: 'var(--bg-glass-strong)',
                  padding: '8px 14px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  color: 'var(--text-muted)',
                }}
              >
                ShopAI is thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Ask anything about our products..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{ borderRadius: 'var(--radius-full)' }}
          />
          <button
            type="button"
            className="btn btn-primary btn-icon"
            onClick={() => handleSend()}
            style={{ borderRadius: '50%', width: 42, height: 42 }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
