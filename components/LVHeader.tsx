import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

export default function LVHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const menuItems = [
    { label: 'Shop All', href: '/products' },
    { label: 'Smoothies', href: '/products?category=smoothie' },
    { label: 'Juices', href: '/juices' },
    { label: 'Our Story', href: '/our-story' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <header className="lv-header">
        <div className="lv-header-left" ref={menuRef}>
          <button className="lv-header-link" onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/>
            </svg>
            <span>Menu</span>
          </button>
          
          {menuOpen && (
            <div className="lv-menu-dropdown">
              {menuItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className="lv-menu-item"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
          
          <div ref={searchRef} style={{ position: 'relative' }}>
            <button className="lv-header-link" onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7"/>
                <path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
              </svg>
              <span>Search</span>
            </button>
            
            {searchOpen && (
              <div className="lv-search-dropdown">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="lv-search-input"
                    autoFocus
                  />
                </form>
              </div>
            )}
          </div>
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
          <Link href="/retail" className="lv-header-link">
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

      <style jsx>{`
        .lv-menu-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 8px;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px 0;
          min-width: 200px;
          z-index: 1000;
        }
        
        .lv-menu-dropdown :global(.lv-menu-item) {
          display: block;
          padding: 12px 24px;
          color: #ffffff;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 400;
          letter-spacing: 0.02em;
          transition: background 0.2s;
        }
        
        .lv-menu-dropdown :global(.lv-menu-item:hover) {
          background: rgba(255, 255, 255, 0.08);
        }
        
        .lv-search-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          margin-top: 8px;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px;
          min-width: 280px;
          z-index: 1000;
        }
        
        .lv-search-input {
          width: 100%;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          color: #ffffff;
          font-size: 0.9rem;
          outline: none;
        }
        
        .lv-search-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        
        .lv-search-input:focus {
          border-color: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </>
  );
}
