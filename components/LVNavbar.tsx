'use client';

import Link from 'next/link';
import { useState } from 'react';

const NAV_ITEMS = [
  { label: 'Smoothies', href: '/collections/smoothies' },
  { label: 'Bundles', href: '/collections/smoothie-boxes' },
  { label: 'Wellness', href: '/wellness' },
  { label: 'Our Story', href: '/our-story' },
];

export default function LVNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="lv-navbar">
        <div className="lv-navbar-container">
          <div className="lv-navbar-left">
            <button 
              className="lv-navbar-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          <Link href="/" className="lv-navbar-logo">
            DRIZZL
          </Link>

          <div className="lv-navbar-center">
            {NAV_ITEMS.map((item) => (
              <Link key={item.label} href={item.href} className="lv-navbar-link">
                {item.label}
              </Link>
            ))}
          </div>

          <div className="lv-navbar-right">
            <button className="lv-navbar-icon" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7"/>
                <path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
              </svg>
            </button>
            <button className="lv-navbar-icon" aria-label="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <Link href="/cart" className="lv-navbar-icon" aria-label="Shopping bag">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 6h12l1 14H5L6 6z"/>
                <path d="M9 6V5a3 3 0 0 1 6 0v1" strokeLinecap="round"/>
              </svg>
            </Link>
            <Link href="/account" className="lv-navbar-icon" aria-label="Account">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="lv-mobile-menu">
          <div className="lv-mobile-menu-overlay" onClick={() => setMenuOpen(false)} />
          <div className="lv-mobile-menu-content">
            <button className="lv-mobile-menu-close" onClick={() => setMenuOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
              </svg>
            </button>
            <nav className="lv-mobile-nav">
              {NAV_ITEMS.map((item) => (
                <Link 
                  key={item.label} 
                  href={item.href} 
                  className="lv-mobile-nav-link"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
