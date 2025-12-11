import React, { useState, useEffect, useRef, useCallback } from 'react';

interface PartnerSearchResult {
  id: string;
  partner_code: string;
  company_name: string;
  contact_email: string;
  phone?: string;
  status: string;
  total_orders: number;
  total_revenue_cents: number;
  match_type: string;
  match_field: string;
}

interface PartnerSearchBarProps {
  onSelect?: (partnerId: string, partner: PartnerSearchResult) => void;
  onNavigate?: (partnerId: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export default function PartnerSearchBar({
  onSelect,
  onNavigate,
  placeholder = 'Search partners by code, name, email, or phone...',
  autoFocus = false,
  className = '',
}: PartnerSearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PartnerSearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showQRScanner, setShowQRScanner] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const searchPartners = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/partners/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data.results || []);
      setIsOpen(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('[PartnerSearch] Error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim()) {
      debounceRef.current = setTimeout(() => {
        searchPartners(query);
      }, 300);
    } else {
      setResults([]);
      setIsOpen(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, searchPartners]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (partner: PartnerSearchResult) => {
    if (onSelect) {
      onSelect(partner.id, partner);
    }
    if (onNavigate) {
      onNavigate(partner.id);
    }
    setQuery('');
    setIsOpen(false);
    setResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleQRScan = () => {
    setShowQRScanner(true);
  };

  const closeQRScanner = () => {
    setShowQRScanner(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.3)' };
      case 'pending':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' };
      case 'rejected':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.3)' };
      default:
        return { bg: 'rgba(107, 114, 128, 0.15)', text: '#9ca3af', border: 'rgba(107, 114, 128, 0.3)' };
    }
  };

  const getMatchFieldLabel = (field: string) => {
    switch (field) {
      case 'partner_code':
        return 'Code';
      case 'name':
        return 'Name';
      case 'email':
        return 'Email';
      case 'phone':
        return 'Phone';
      default:
        return field;
    }
  };

  return (
    <div style={styles.container} className={className}>
      <div style={styles.inputWrapper}>
        <div style={styles.searchIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          style={styles.input}
        />

        {loading && (
          <div style={styles.loadingIndicator}>
            <div style={styles.spinner} />
          </div>
        )}

        {query && !loading && (
          <button onClick={handleClear} style={styles.clearButton} aria-label="Clear search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}

        <button onClick={handleQRScan} style={styles.qrButton} aria-label="Scan QR Code">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="3" height="3" />
            <path d="M21 14v3h-3M21 21h-3M18 21v-3" />
          </svg>
        </button>
      </div>

      {isOpen && results.length > 0 && (
        <div ref={dropdownRef} style={styles.dropdown}>
          {results.map((partner, index) => {
            const statusColors = getStatusColor(partner.status);
            const isSelected = index === selectedIndex;

            return (
              <div
                key={partner.id}
                onClick={() => handleSelect(partner)}
                style={{
                  ...styles.resultItem,
                  ...(isSelected ? styles.resultItemSelected : {}),
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div style={styles.resultMain}>
                  <div style={styles.resultHeader}>
                    <span style={styles.partnerCode}>{partner.partner_code || '—'}</span>
                    <span
                      style={{
                        ...styles.statusBadge,
                        background: statusColors.bg,
                        color: statusColors.text,
                        border: `1px solid ${statusColors.border}`,
                      }}
                    >
                      {partner.status}
                    </span>
                  </div>
                  <div style={styles.companyName}>{partner.company_name}</div>
                  <div style={styles.contactEmail}>{partner.contact_email}</div>
                </div>

                <div style={styles.resultMeta}>
                  <span style={styles.matchIndicator}>
                    <span style={styles.matchLabel}>Match:</span>
                    <span style={styles.matchField}>{getMatchFieldLabel(partner.match_field)}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isOpen && results.length === 0 && query && !loading && (
        <div ref={dropdownRef} style={styles.dropdown}>
          <div style={styles.noResults}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <span>No partners found</span>
          </div>
        </div>
      )}

      {showQRScanner && (
        <div style={styles.qrOverlay} onClick={closeQRScanner}>
          <div style={styles.qrModal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.qrHeader}>
              <h3 style={styles.qrTitle}>Scan Partner QR Code</h3>
              <button onClick={closeQRScanner} style={styles.qrCloseButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div style={styles.qrContent}>
              <div style={styles.qrPlaceholder}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
                <p style={styles.qrPlaceholderText}>Camera access required for QR scanning</p>
                <p style={styles.qrPlaceholderSubtext}>
                  Point your camera at a partner QR code to quickly access their profile
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    width: '100%',
    maxWidth: '480px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '14px 100px 14px 48px',
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '14px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  },
  loadingIndicator: {
    position: 'absolute',
    right: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    borderTopColor: '#667eea',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  clearButton: {
    position: 'absolute',
    right: '52px',
    background: 'none',
    border: 'none',
    padding: '4px',
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s ease',
  },
  qrButton: {
    position: 'absolute',
    right: '12px',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(168, 85, 247, 0.2))',
    border: '1px solid rgba(102, 126, 234, 0.3)',
    borderRadius: '8px',
    padding: '8px',
    cursor: 'pointer',
    color: '#a78bfa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    right: 0,
    background: 'rgba(20, 20, 30, 0.95)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.6)',
    zIndex: 1000,
    maxHeight: '400px',
    overflowY: 'auto',
    padding: '8px',
  },
  resultItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    marginBottom: '4px',
  },
  resultItemSelected: {
    background: 'rgba(102, 126, 234, 0.15)',
  },
  resultMain: {
    flex: 1,
    minWidth: 0,
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '4px',
  },
  partnerCode: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#a78bfa',
    fontFamily: 'monospace',
    letterSpacing: '0.5px',
  },
  statusBadge: {
    fontSize: '10px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '10px',
    textTransform: 'capitalize',
  },
  companyName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#fff',
    marginBottom: '2px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  contactEmail: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  resultMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginLeft: '12px',
    flexShrink: 0,
  },
  matchIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  matchLabel: {
    fontSize: '10px',
    color: 'rgba(255, 255, 255, 0.3)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  matchField: {
    fontSize: '11px',
    color: 'rgba(102, 126, 234, 0.8)',
    fontWeight: '500',
  },
  noResults: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 16px',
    gap: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '14px',
  },
  qrOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
  },
  qrModal: {
    background: 'rgba(30, 30, 45, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    width: '90%',
    maxWidth: '400px',
    overflow: 'hidden',
    boxShadow: '0 32px 100px rgba(0, 0, 0, 0.8)',
  },
  qrHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
  },
  qrTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#fff',
    margin: 0,
  },
  qrCloseButton: {
    background: 'none',
    border: 'none',
    padding: '8px',
    cursor: 'pointer',
    color: 'rgba(255, 255, 255, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  qrContent: {
    padding: '40px 24px',
  },
  qrPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    gap: '16px',
  },
  qrPlaceholderText: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: 0,
  },
  qrPlaceholderSubtext: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
    margin: 0,
    maxWidth: '280px',
  },
};
