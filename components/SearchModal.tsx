'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';

interface SearchItem {
  title: string;
  description: string;
  url: string;
  type: 'page' | 'product' | 'category';
}

const SEARCHABLE_CONTENT: SearchItem[] = [
  { title: 'Home', description: 'Welcome to Drizzl Wellness', url: '/', type: 'page' },
  { title: 'All Smoothies', description: 'Browse our full smoothie collection', url: '/collections/smoothies', type: 'category' },
  { title: 'Protein Power-Ups', description: 'High protein smoothies for muscle recovery', url: '/collections/high-protein', type: 'category' },
  { title: 'Fan Favorites', description: 'Our best-selling smoothies', url: '/collections/best-sellers', type: 'category' },
  { title: 'Fresh Drops', description: 'New arrivals and seasonal flavors', url: '/collections/new-arrivals', type: 'category' },
  { title: 'Smoothie Kits', description: 'Curated smoothie boxes and bundles', url: '/collections/smoothie-boxes', type: 'category' },
  { title: 'Gift Guide', description: 'Perfect gifts for smoothie lovers', url: '/collections/gift-guide', type: 'category' },
  { title: 'All Products', description: 'View all our products', url: '/products', type: 'page' },
  { title: 'About Us', description: 'Learn about Drizzl Wellness and our mission', url: '/about', type: 'page' },
  { title: 'Blog & Recipes', description: 'Tips, recipes, and wellness inspiration', url: '/blog', type: 'page' },
  { title: 'Store Locator', description: 'Find Drizzl products near you', url: '/locations', type: 'page' },
  { title: 'Sustainability', description: 'Our commitment to the planet', url: '/sustainability', type: 'page' },
  { title: 'Ingredients', description: 'Quality ingredients in every smoothie', url: '/ingredients', type: 'page' },
  { title: 'Careers', description: 'Join our team at Drizzl Wellness', url: '/careers', type: 'page' },
  { title: 'Wholesale', description: 'Partner with us for your business', url: '/wholesale', type: 'page' },
  { title: 'Wholesale Pricing', description: 'View our wholesale pricing tiers', url: '/wholesale#wholesale-pricing', type: 'page' },
  { title: 'Partner Portal', description: 'Access your wholesale account', url: '/wholesale#partner-portal', type: 'page' },
  { title: 'Wellness Club', description: 'Join our membership program', url: '/membership', type: 'page' },
  { title: 'Referral Program', description: 'Earn rewards by sharing Drizzl', url: '/refer', type: 'page' },
  { title: 'Ambassadors', description: 'Become a Drizzl ambassador', url: '/ambassadors', type: 'page' },
  { title: 'Student Discount', description: 'Special perks for students', url: '/student-discount', type: 'page' },
  { title: 'FAQs', description: 'Frequently asked questions', url: '/faq', type: 'page' },
  { title: 'Contact Us', description: 'Get in touch with our team', url: '/contact', type: 'page' },
  { title: 'Shipping & Returns', description: 'Shipping info and return policy', url: '/shipping', type: 'page' },
  { title: 'Privacy Policy', description: 'How we protect your data', url: '/privacy', type: 'page' },
  { title: 'Terms of Service', description: 'Terms and conditions', url: '/terms', type: 'page' },
  { title: 'Sign In', description: 'Access your account', url: '/auth', type: 'page' },
  { title: 'Cart', description: 'View your shopping cart', url: '/cart', type: 'page' },
  { title: 'Strawberry Bliss', description: 'Sweet strawberry smoothie blend', url: '/products/strawberry-bliss', type: 'product' },
  { title: 'Tropical Paradise', description: 'Mango, pineapple, and coconut', url: '/products/tropical-paradise', type: 'product' },
  { title: 'Green Machine', description: 'Spinach, kale, and apple', url: '/products/green-machine', type: 'product' },
  { title: 'Berry Blast', description: 'Mixed berry antioxidant blend', url: '/products/berry-blast', type: 'product' },
  { title: 'Protein Power', description: 'High protein post-workout smoothie', url: '/products/protein-power', type: 'product' },
  { title: 'Chocolate Dream', description: 'Rich chocolate protein shake', url: '/products/chocolate-dream', type: 'product' },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const performSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const filtered = SEARCHABLE_CONTENT.filter(item => {
      const q = searchQuery.toLowerCase();
      return item.title.toLowerCase().includes(q) || 
             item.description.toLowerCase().includes(q);
    });

    setResults(filtered);
    setSelectedIndex(-1);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
      
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }

      if (isOpen && results.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, -1));
        }
        if (e.key === 'Enter' && selectedIndex >= 0) {
          e.preventDefault();
          navigateTo(results[selectedIndex].url);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const items = resultsRef.current.querySelectorAll('.search-result-item');
      if (items[selectedIndex]) {
        items[selectedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  const navigateTo = (url: string) => {
    onClose();
    router.push(url);
  };

  const highlightMatch = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text;
    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="search-highlight">{part}</mark> : part
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'product':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="7" y1="7" x2="7.01" y2="7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'category':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="14" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="14" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="3" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="14,2 14,8 20,8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="search-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="search-modal-content">
        <div className="search-input-wrapper">
          <svg className="search-input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7"/>
            <path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search products, pages, and more..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              performSearch(e.target.value);
            }}
            autoComplete="off"
          />
          {query && (
            <button 
              className="search-clear-btn"
              onClick={() => {
                setQuery('');
                setResults([]);
                inputRef.current?.focus();
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        <div className="search-results" ref={resultsRef}>
          {query && results.length === 0 && (
            <div className="search-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="11" cy="11" r="7"/>
                <path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
              </svg>
              <p>No results found for "{query}"</p>
              <span>Try a different search term</span>
            </div>
          )}

          {!query && (
            <div className="search-suggestions">
              <p className="search-suggestions-title">Quick Links</p>
              <div className="search-quick-links">
                {[
                  { title: 'All Smoothies', url: '/collections/smoothies' },
                  { title: 'Best Sellers', url: '/collections/best-sellers' },
                  { title: 'New Arrivals', url: '/collections/new-arrivals' },
                  { title: 'About Us', url: '/about' },
                ].map((link) => (
                  <button
                    key={link.url}
                    className="search-quick-link"
                    onClick={() => navigateTo(link.url)}
                  >
                    {link.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.map((result, index) => (
            <button
              key={result.url}
              className={`search-result-item ${selectedIndex === index ? 'selected' : ''}`}
              onClick={() => navigateTo(result.url)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span className="search-result-icon">
                {getTypeIcon(result.type)}
              </span>
              <div className="search-result-content">
                <span className="search-result-title">
                  {highlightMatch(result.title, query)}
                </span>
                <span className="search-result-description">
                  {highlightMatch(result.description, query)}
                </span>
              </div>
              <svg className="search-result-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ))}
        </div>

        <div className="search-footer">
          <div className="search-hints">
            <span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
            <span><kbd>Enter</kbd> to select</span>
            <span><kbd>Esc</kbd> to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
