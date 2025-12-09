import Link from 'next/link';
import { useState } from 'react';

export default function LVHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="lv-header">
      <div className="lv-header-left">
        <button className="lv-header-link" onClick={() => setMenuOpen(!menuOpen)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/>
          </svg>
          <span>Menu</span>
        </button>
        <button className="lv-header-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="11" cy="11" r="7"/>
            <path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
          </svg>
          <span>Search</span>
        </button>
      </div>

      <div className="lv-header-center">
        <Link href="/" className="lv-header-logo-link">
          <img 
            src="/logo.gif" 
            alt="DRIZZL" 
            className="lv-header-logo"
          />
        </Link>
      </div>

      <div className="lv-header-right">
        <Link href="/wholesale" className="lv-header-link">
          <span>Wholesale</span>
        </Link>
        <Link href="/auth" className="lv-header-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="8" r="4"/>
            <path d="M5 20c0-2.76 3.13-5 7-5s7 2.24 7 5" strokeLinecap="round"/>
          </svg>
        </Link>
        <Link href="/cart" className="lv-header-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 6h-2l-2 12h18l-2-12h-2M6 6V5a4 4 0 018 0v1M6 6h8"/>
          </svg>
        </Link>
      </div>
    </header>
  );
}
