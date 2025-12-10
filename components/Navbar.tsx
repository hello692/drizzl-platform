'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import SearchModal from './SearchModal';

const MENU_SECTIONS = [
  {
    title: 'Shop',
    subtitle: 'Explore our smoothie collection',
    items: [
      { name: 'Smoothies', href: '/collections/smoothies' },
      { name: 'Protein Power-Ups', href: '/collections/high-protein' },
      { name: 'Fan Favorites', href: '/collections/best-sellers' },
      { name: 'Fresh Drops (New Arrivals)', href: '/collections/new-arrivals' },
      { name: 'Smoothie Kits', href: '/collections/smoothie-boxes' },
      { name: 'Gifts That Blend Joy', href: '/collections/gift-guide' },
    ]
  },
  {
    title: 'Discover',
    subtitle: 'Learn about Drizzl',
    items: [
      { name: 'Our Story (Spoiler: It\'s Delicious)', href: '/our-story' },
      { name: 'About Us', href: '/about' },
      { name: 'Blog & Recipes (Sip, Blend, Repeat)', href: '/blog' },
      { name: 'Store Locator (Find Us Near You)', href: '/locations' },
      { name: 'Sustainability', href: '/sustainability' },
      { name: 'Ingredients', href: '/ingredients' },
    ]
  },
  {
    title: 'Wholesale & Partnerships',
    subtitle: 'Partner with us',
    items: [
      { name: 'Big Ideas? Let\'s Collaborate', href: '/wholesale' },
      { name: 'Wholesale Pricing', href: '/wholesale#wholesale-pricing' },
      { name: 'Partner Portal', href: '/wholesale#partner-portal' },
    ]
  },
  {
    title: 'Membership & Community',
    subtitle: 'Join the wellness movement',
    items: [
      { name: 'Join the Wellness Club', href: '/membership' },
      { name: 'Referral Program', href: '/refer' },
      { name: 'Ambassadors & Affiliates (Spread the Crave)', href: '/ambassadors' },
      { name: 'Student Perks', href: '/student-discount' },
    ]
  },
  {
    title: 'Careers',
    subtitle: 'Join our team',
    items: [
      { name: 'Careers (Blend Your Talents Here)', href: '/careers' },
    ]
  },
  {
    title: 'Support',
    subtitle: 'We\'re here to help',
    items: [
      { name: 'FAQs (We\'ve Got Answers)', href: '/faq' },
      { name: 'Contact Us (We\'re Here to Help)', href: '/contact' },
      { name: 'Shipping & Returns (No Stress, Just Smoothies)', href: '/shipping' },
    ]
  },
  {
    title: 'The Fine Print',
    subtitle: 'Legal stuff',
    items: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ]
  },
];

interface NavbarProps {
  hideCart?: boolean;
  hideSearch?: boolean;
}

export default function Navbar({ hideCart = false, hideSearch = false }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [isDarkBg, setIsDarkBg] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleExpandedMenu = (title: string) => {
    setExpandedMenu(expandedMenu === title ? null : title);
  };

  const navigateTo = (href: string) => {
    setMenuOpen(false);
    setExpandedMenu(null);
    router.push(href);
  };

  const getBrightness = useCallback((color: string): number => {
    if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
      return 255;
    }
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);
      return (r * 299 + g * 587 + b * 114) / 1000;
    }
    return 255;
  }, []);

  const detectBackgroundBrightness = useCallback(() => {
    if (!headerRef.current) return;
    
    const header = headerRef.current;
    const rect = header.getBoundingClientRect();
    const sampleY = rect.bottom + 5;
    const sampleX = rect.left + rect.width / 2;
    
    header.style.pointerEvents = 'none';
    const elementBehind = document.elementFromPoint(sampleX, sampleY);
    header.style.pointerEvents = '';
    
    if (!elementBehind) {
      setIsDarkBg(window.scrollY < 100);
      return;
    }

    let currentElement: Element | null = elementBehind;
    let brightness = 255;
    
    while (currentElement && currentElement !== document.body) {
      const style = window.getComputedStyle(currentElement);
      const bgColor = style.backgroundColor;
      const bgImage = style.backgroundImage;
      
      if (bgImage && bgImage !== 'none') {
        const isDarkSection = currentElement.classList.contains('dark-section') ||
                             currentElement.classList.contains('hero') ||
                             currentElement.classList.contains('lifestyle-section') ||
                             currentElement.tagName === 'VIDEO' ||
                             (currentElement as HTMLElement).dataset?.theme === 'dark';
        if (isDarkSection) {
          brightness = 50;
          break;
        }
      }
      
      if (bgColor && bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
        brightness = getBrightness(bgColor);
        break;
      }
      
      currentElement = currentElement.parentElement;
    }
    
    setIsDarkBg(brightness < 128);
  }, [getBrightness]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          detectBackgroundBrightness();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    const timer = setTimeout(detectBackgroundBrightness, 100);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [detectBackgroundBrightness]);

  useEffect(() => {
    detectBackgroundBrightness();
  }, [router.pathname, detectBackgroundBrightness]);

  const headerHeight = scrolled ? 70 : 76;
  const iconSize = 24;
  const isHomepage = router.pathname === '/';
  const isHomeTransparent = isHomepage && !scrolled;
  
  const bgStyle = isHomeTransparent 
    ? 'transparent' 
    : isDarkBg 
      ? 'rgba(0, 0, 0, 0.5)' 
      : 'rgba(255, 255, 255, 0.95)';
  const blurStyle = isHomeTransparent ? 'none' : 'blur(20px)';
  const textColor = isDarkBg ? '#ffffff' : '#000000';
  const actionTextColor = isDarkBg ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';
  const borderColor = isHomeTransparent ? 'transparent' : (isDarkBg ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)');
  const logoFilter = isDarkBg ? 'none' : 'invert(1)';
  const logoWidth = scrolled ? 180 : 200;

  return (
    <>
      <header 
        ref={headerRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: `${headerHeight}px`,
          padding: '0 40px',
          background: bgStyle,
          backdropFilter: blurStyle,
          WebkitBackdropFilter: blurStyle,
          borderBottom: `1px solid ${borderColor}`,
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px', height: '100%' }}>
          <button 
            className="header-btn"
            onClick={() => setMenuOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              color: actionTextColor,
              cursor: 'pointer',
              padding: '8px 0',
              fontSize: '14px',
              fontWeight: 400,
              letterSpacing: '0.01em',
              lineHeight: 1,
              height: '100%',
              transition: 'color 0.3s ease',
            }}
          >
            <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ display: 'block', flexShrink: 0 }}>
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/>
            </svg>
            <span className="header-btn-text" style={{ lineHeight: 1 }}>Menu</span>
          </button>
          {!hideSearch && (
            <button 
              className="header-btn"
              onClick={() => setSearchOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                color: actionTextColor,
                cursor: 'pointer',
                padding: '8px 0',
                fontSize: '14px',
                fontWeight: 400,
                letterSpacing: '0.01em',
                lineHeight: 1,
                height: '100%',
                transition: 'color 0.3s ease',
              }}
            >
              <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ display: 'block', flexShrink: 0 }}>
                <circle cx="11" cy="11" r="7"/>
                <path d="M21 21l-4.35-4.35" strokeLinecap="round"/>
              </svg>
              <span className="header-btn-text" style={{ lineHeight: 1 }}>Search</span>
            </button>
          )}
        </div>

        <div style={{ 
          position: 'absolute', 
          left: '50%', 
          top: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Link href="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/images/drizzl-logo-white.gif"
              alt="DRIZZL WELLNESS" 
              style={{ 
                width: `${logoWidth}px`, 
                height: 'auto', 
                display: 'block',
                filter: logoFilter, 
                transition: 'all 0.3s ease' 
              }}
            />
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', height: '100%' }}>
          <Link 
            href="/wholesale" 
            className="nav-link wholesale-link"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              color: textColor,
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 400,
              letterSpacing: '0.01em',
              lineHeight: 1,
              height: '100%',
              padding: '8px 0',
              transition: 'color 0.3s ease',
            }}
          >
            Wholesale
          </Link>
          <Link 
            href="/auth" 
            className="nav-icon"
            style={{ 
              color: textColor, 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              padding: '8px 0',
              transition: 'color 0.3s ease' 
            }}
          >
            <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ display: 'block' }}>
              <circle cx="12" cy="8" r="4"/>
              <path d="M5 20c0-2.76 3.13-5 7-5s7 2.24 7 5" strokeLinecap="round"/>
            </svg>
          </Link>
          {!hideCart && (
            <Link 
              href="/cart" 
              className="nav-icon"
              style={{ 
                color: textColor, 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                padding: '8px 0',
                transition: 'color 0.3s ease' 
              }}
            >
              <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ display: 'block' }}>
                <path d="M6 6h-2l-2 12h18l-2-12h-2M6 6V5a4 4 0 018 0v1M6 6h8"/>
              </svg>
            </Link>
          )}
        </div>
      </header>

      <div 
        style={{
          position: 'fixed',
          inset: 0,
          background: '#000000',
          zIndex: 10000,
          opacity: menuOpen ? 1 : 0,
          visibility: menuOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s ease',
          overflowY: 'auto',
        }}
      >
        <button 
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'absolute',
            top: '24px',
            right: '40px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            zIndex: 10,
          }}
          aria-label="Close menu"
        >
          <svg width="24" height="24" viewBox="0 0 18 18" fill="none">
            <path d="M1 1L17 17M17 1L1 17" stroke="#f5f5f7" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '100px 40px 60px',
        }}>
          <nav>
            {MENU_SECTIONS.map((section, index) => (
              <div 
                key={section.title}
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? 'translateY(0)' : 'translateY(20px)',
                  transition: `opacity 0.4s ease ${0.1 + index * 0.05}s, transform 0.4s ease ${0.1 + index * 0.05}s`,
                }}
              >
                <button
                  className="menu-item-title"
                  onClick={() => section.items.length > 0 ? toggleExpandedMenu(section.title) : navigateTo(section.items[0]?.href || '/')}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '28px 0',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    <span style={{
                      display: 'block',
                      fontSize: '1.75rem',
                      fontWeight: 300,
                      color: '#ffffff',
                      letterSpacing: '-0.02em',
                    }}>
                      {section.title}
                    </span>
                    {section.subtitle && (
                      <span style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        color: 'rgba(255,255,255,0.5)',
                        marginTop: '4px',
                      }}>
                        {section.subtitle}
                      </span>
                    )}
                  </div>
                  {section.items.length > 0 && (
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 16 16" 
                      fill="none"
                      style={{
                        transform: expandedMenu === section.title ? 'rotate(45deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      <path d="M8 3v10M3 8h10" stroke="#86868b" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  )}
                </button>
                
                {section.items.length > 0 && (
                  <div style={{
                    maxHeight: expandedMenu === section.title ? '400px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.4s ease',
                  }}>
                    <div style={{ paddingBottom: '20px' }}>
                      {section.items.map((item, subIdx) => (
                        <button
                          key={item.name}
                          className="submenu-item"
                          onClick={() => navigateTo(item.href)}
                          style={{
                            display: 'block',
                            width: '100%',
                            textAlign: 'left',
                            padding: '12px 0 12px 20px',
                            background: 'none',
                            border: 'none',
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            opacity: expandedMenu === section.title ? 1 : 0,
                            transform: expandedMenu === section.title ? 'translateX(0)' : 'translateX(-10px)',
                            transition: `opacity 0.3s ease ${subIdx * 0.03}s, transform 0.3s ease ${subIdx * 0.03}s`,
                          }}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
          
          <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <button
              onClick={() => navigateTo('/auth')}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '12px 0',
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Sign In or Create Account
            </button>
            <button
              onClick={() => navigateTo('/auth?type=retail')}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '12px 0',
                background: 'none',
                border: 'none',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Wholesale Partners
            </button>
          </div>
        </div>
      </div>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
