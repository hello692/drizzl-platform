import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '../../hooks/useRole';
import { ProductWithCosts, ProductDetails } from '../../lib/productIntelService';

type SortField = 'name' | 'margin_percent' | 'cost_per_unit' | 'price_cents';
type SortDirection = 'asc' | 'desc';

function GradientIcon({ type }: { type: 'sparkle' | 'search' | 'filter' | 'chart' | 'dollar' | 'box' | 'flask' | 'arrow' }) {
  const gradients: Record<string, string> = {
    sparkle: 'url(#gradientPurple)',
    search: 'url(#gradientCyan)',
    filter: 'url(#gradientBlue)',
    chart: 'url(#gradientGreen)',
    dollar: 'url(#gradientGold)',
    box: 'url(#gradientPink)',
    flask: 'url(#gradientTeal)',
    arrow: 'url(#gradientWhite)',
  };

  const paths: Record<string, React.ReactNode> = {
    sparkle: (
      <path d="M12 2L13.09 8.26L19 9.27L14.55 13.97L15.82 20.02L12 17.27L8.18 20.02L9.45 13.97L5 9.27L10.91 8.26L12 2Z" fill={gradients.sparkle} />
    ),
    search: (
      <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke={gradients.search} strokeWidth="2" strokeLinecap="round" fill="none" />
    ),
    filter: (
      <path d="M3 4H21M6 12H18M9 20H15" stroke={gradients.filter} strokeWidth="2" strokeLinecap="round" fill="none" />
    ),
    chart: (
      <path d="M3 3V21H21M7 16V13M11 16V9M15 16V5M19 16V11" stroke={gradients.chart} strokeWidth="2" strokeLinecap="round" fill="none" />
    ),
    dollar: (
      <path d="M12 2V22M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6" stroke={gradients.dollar} strokeWidth="2" strokeLinecap="round" fill="none" />
    ),
    box: (
      <path d="M21 16V8C20.9996 7.64927 20.9071 7.30481 20.7315 7.00116C20.556 6.69751 20.3037 6.44536 20 6.27L13 2.27C12.696 2.09446 12.3511 2.00205 12 2.00205C11.6489 2.00205 11.304 2.09446 11 2.27L4 6.27C3.69626 6.44536 3.44398 6.69751 3.26846 7.00116C3.09294 7.30481 3.00036 7.64927 3 8V16C3.00036 16.3507 3.09294 16.6952 3.26846 16.9988C3.44398 17.3025 3.69626 17.5546 4 17.73L11 21.73C11.304 21.9055 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9055 13 21.73L20 17.73C20.3037 17.5546 20.556 17.3025 20.7315 16.9988C20.9071 16.6952 20.9996 16.3507 21 16Z" stroke={gradients.box} strokeWidth="2" strokeLinecap="round" fill="none" />
    ),
    flask: (
      <path d="M9 3H15M10 9V3M14 9V3M5 21H19L16 11H8L5 21Z" stroke={gradients.flask} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    arrow: (
      <path d="M5 12H19M12 5L19 12L12 19" stroke={gradients.arrow} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
  };

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="gradientPurple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="gradientCyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="gradientBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="gradientGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <linearGradient id="gradientGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="gradientPink" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="gradientTeal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
        <linearGradient id="gradientWhite" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
        </linearGradient>
      </defs>
      {paths[type]}
    </svg>
  );
}

export default function ProductIntelligence() {
  const { loading, authorized } = useRequireAdmin();
  const [products, setProducts] = useState<ProductWithCosts[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [demoMode, setDemoMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('margin_percent');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  useEffect(() => {
    if (authorized) {
      loadProducts();
    }
  }, [authorized]);

  async function loadProducts() {
    try {
      const response = await fetch('/api/admin/product-intel');
      const data = await response.json();
      setProducts(data.products || []);
      setSuggestions(data.suggestions || []);
      setDemoMode(data.demo_mode || false);
      if (data.message) {
        setError(data.message);
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Unable to load products');
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }

  async function loadProductDetails(productId: string) {
    setLoadingDetails(true);
    try {
      const response = await fetch(`/api/admin/product-intel/${productId}`);
      const data = await response.json();
      setProductDetails(data.product);
    } catch (err) {
      console.error('Error loading product details:', err);
      setProductDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  }

  function handleRowClick(productId: string) {
    if (expandedProductId === productId) {
      setExpandedProductId(null);
      setProductDetails(null);
    } else {
      setExpandedProductId(productId);
      loadProductDetails(productId);
    }
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'name' ? 'asc' : 'desc');
    }
  }

  const categories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              p.slug.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        let comparison = 0;
        switch (sortField) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'margin_percent':
            comparison = a.margin_percent - b.margin_percent;
            break;
          case 'cost_per_unit':
            comparison = a.cost_per_unit - b.cost_per_unit;
            break;
          case 'price_cents':
            comparison = a.price_cents - b.price_cents;
            break;
        }
        return sortDirection === 'asc' ? comparison : -comparison;
      });
  }, [products, searchQuery, categoryFilter, sortField, sortDirection]);

  function getMarginGradient(marginPercent: number): string {
    if (marginPercent >= 50) return 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)';
    if (marginPercent >= 30) return 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)';
    return 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)';
  }

  function getMarginGlow(marginPercent: number): string {
    if (marginPercent >= 50) return '0 0 20px rgba(34, 197, 94, 0.4)';
    if (marginPercent >= 30) return '0 0 20px rgba(245, 158, 11, 0.4)';
    return '0 0 20px rgba(239, 68, 68, 0.4)';
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingOrb} />
        <p style={styles.loadingText}>Initializing</p>
        <style jsx global>{globalStyles}</style>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingOrb} />
        <p style={styles.loadingText}>Authenticating</p>
        <style jsx global>{globalStyles}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.meshGradient} />
      <div style={styles.orbOne} />
      <div style={styles.orbTwo} />
      <div style={styles.orbThree} />

      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <Link href="/admin" style={styles.logo}>
            <span style={styles.logoIcon}>D</span>
            <span style={styles.logoText}>DRIZZL</span>
          </Link>
        </div>
        <div style={styles.navLinks}>
          <Link href="/admin/command-center" style={styles.navLink}>Command Center</Link>
          <Link href="/admin/products" style={styles.navLink}>Products</Link>
          <Link href="/admin/product-intel" style={styles.navLinkActive}>Product Intel</Link>
          <Link href="/admin/orders" style={styles.navLink}>Orders</Link>
          <Link href="/admin/order-intel" style={styles.navLink}>Order Intel</Link>
          <Link href="/admin/partners" style={styles.navLink}>Partners</Link>
          <Link href="/admin/banking" style={styles.navLink}>Banking</Link>
          <Link href="/admin/analytics" style={styles.navLink}>Analytics</Link>
          <Link href="/admin/ai-assistant" style={styles.navLink}>AI Assistant</Link>
          <Link href="/" style={styles.exitLink}>Exit</Link>
        </div>
      </nav>

      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <div style={styles.headerBadge}>
              <GradientIcon type="chart" />
              <span>Intelligence Module</span>
            </div>
            <h1 style={styles.title}>Product Intelligence</h1>
            <p style={styles.subtitle}>
              {filteredProducts.length} products analyzed
            </p>
          </div>
          {demoMode && (
            <div style={styles.demoBadge}>
              <div style={styles.demoDot} />
              Demo Mode
            </div>
          )}
        </header>

        {error && (
          <div style={styles.errorCard}>
            <div style={styles.errorGlow} />
            <p style={styles.errorText}>{error}</p>
          </div>
        )}

        {suggestions.length > 0 && (
          <div style={styles.suggestionsCard}>
            <div style={styles.suggestionsGlow} />
            <div style={styles.suggestionsHeader}>
              <GradientIcon type="sparkle" />
              <h2 style={styles.suggestionsTitle}>AI Optimization Insights</h2>
            </div>
            <div style={styles.suggestionsList}>
              {suggestions.map((suggestion, index) => (
                <div key={index} style={styles.suggestionItem}>
                  <div style={styles.suggestionDot} />
                  <p style={styles.suggestionText}>{suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={styles.controlsRow}>
          <div style={styles.searchContainer}>
            <div style={styles.searchIcon}>
              <GradientIcon type="search" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.filterContainer}>
            <div style={styles.filterIcon}>
              <GradientIcon type="filter" />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={styles.filterSelect}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div style={styles.tableContainer}>
          <div style={styles.tableGlow} />
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <SortableHeader field="name" label="Product" currentField={sortField} direction={sortDirection} onSort={handleSort} />
                <th style={styles.tableHeader}>Category</th>
                <SortableHeader field="price_cents" label="D2C Price" currentField={sortField} direction={sortDirection} onSort={handleSort} align="right" />
                <th style={{ ...styles.tableHeader, textAlign: 'right' }}>Wholesale</th>
                <SortableHeader field="cost_per_unit" label="Cost" currentField={sortField} direction={sortDirection} onSort={handleSort} align="right" />
                <th style={{ ...styles.tableHeader, textAlign: 'right' }}>Margin</th>
                <SortableHeader field="margin_percent" label="Margin %" currentField={sortField} direction={sortDirection} onSort={handleSort} align="right" />
              </tr>
            </thead>
            <tbody>
              {loadingProducts ? (
                <tr>
                  <td colSpan={7} style={styles.emptyCell}>
                    <div style={styles.loadingPulse} />
                    <span>Loading products...</span>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={styles.emptyCell}>
                    <span>No products found</span>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <React.Fragment key={product.id}>
                    <tr
                      onClick={() => handleRowClick(product.id)}
                      onMouseEnter={() => setHoveredRow(product.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{
                        ...styles.tableRow,
                        background: expandedProductId === product.id 
                          ? 'rgba(255,255,255,0.06)' 
                          : hoveredRow === product.id 
                            ? 'rgba(255,255,255,0.04)' 
                            : 'transparent',
                        borderBottom: expandedProductId === product.id ? 'none' : '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <td style={styles.tableCell}>
                        <div style={styles.productCell}>
                          <span style={{
                            ...styles.expandArrow,
                            transform: expandedProductId === product.id ? 'rotate(90deg)' : 'rotate(0deg)',
                          }}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </span>
                          <div>
                            <div style={styles.productName}>{product.name}</div>
                            <div style={styles.productSlug}>{product.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td style={styles.tableCell}>
                        <span style={styles.categoryBadge}>
                          {product.category}
                        </span>
                      </td>
                      <td style={{ ...styles.tableCell, textAlign: 'right' }}>
                        <span style={styles.priceValue}>${(product.price_cents / 100).toFixed(2)}</span>
                      </td>
                      <td style={{ ...styles.tableCell, textAlign: 'right' }}>
                        <span style={styles.secondaryValue}>${(product.wholesale_price_cents / 100).toFixed(2)}</span>
                      </td>
                      <td style={{ ...styles.tableCell, textAlign: 'right' }}>
                        <span style={styles.secondaryValue}>${product.cost_per_unit.toFixed(2)}</span>
                      </td>
                      <td style={{ ...styles.tableCell, textAlign: 'right' }}>
                        <span style={styles.marginValue}>${product.margin.toFixed(2)}</span>
                      </td>
                      <td style={{ ...styles.tableCell, textAlign: 'right' }}>
                        <span style={{
                          ...styles.marginBadge,
                          background: getMarginGradient(product.margin_percent),
                          boxShadow: getMarginGlow(product.margin_percent),
                        }}>
                          {product.margin_percent.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                    {expandedProductId === product.id && (
                      <tr style={styles.expandedRow}>
                        <td colSpan={7} style={{ padding: 0 }}>
                          <ExpandedDetails details={productDetails} loading={loadingDetails} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      <style jsx global>{globalStyles}</style>
    </div>
  );
}

const globalStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
    50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6); }
  }
  @keyframes borderGlow {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
  }
`;

function SortableHeader({
  field,
  label,
  currentField,
  direction,
  onSort,
  align = 'left',
}: {
  field: SortField;
  label: string;
  currentField: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
  align?: 'left' | 'right';
}) {
  const isActive = currentField === field;
  const [hovered, setHovered] = useState(false);
  
  return (
    <th
      onClick={() => onSort(field)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.tableHeader,
        textAlign: align,
        color: isActive ? '#fff' : hovered ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'color 0.2s ease',
      }}
    >
      {label}
      {isActive && (
        <span style={{ marginLeft: '6px', fontSize: '10px', opacity: 0.7 }}>
          {direction === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </th>
  );
}

function ExpandedDetails({ details, loading }: { details: ProductDetails | null; loading: boolean }) {
  if (loading) {
    return (
      <div style={styles.expandedContent}>
        <div style={styles.loadingPulse} />
        <span style={styles.expandedLoadingText}>Loading details...</span>
      </div>
    );
  }

  if (!details) {
    return (
      <div style={styles.expandedContent}>
        <span style={styles.expandedLoadingText}>Could not load product details</span>
      </div>
    );
  }

  return (
    <div style={styles.expandedContent}>
      <div style={styles.expandedGlow} />
      <div style={styles.expandedGrid}>
        <div style={styles.expandedSection}>
          <div style={styles.sectionHeader}>
            <GradientIcon type="dollar" />
            <h3 style={styles.sectionTitle}>Cost Breakdown</h3>
          </div>
          <div style={styles.costList}>
            <CostRow label="Ingredients" value={details.cost_breakdown.ingredients} total={details.cost_breakdown.total} color="#22d3ee" />
            <CostRow label="Packaging" value={details.cost_breakdown.packaging} total={details.cost_breakdown.total} color="#a855f7" />
            <CostRow label="Labor" value={details.cost_breakdown.labor} total={details.cost_breakdown.total} color="#f472b6" />
            <CostRow label="Overhead" value={details.cost_breakdown.overhead} total={details.cost_breakdown.total} color="#60a5fa" />
            <div style={styles.costTotal}>
              <span>Total Cost</span>
              <span style={styles.costTotalValue}>${details.cost_breakdown.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div style={styles.expandedSection}>
          <div style={styles.sectionHeader}>
            <GradientIcon type="chart" />
            <h3 style={styles.sectionTitle}>Profit Analysis</h3>
          </div>
          <div style={styles.profitCards}>
            <div style={styles.profitCard}>
              <div style={styles.profitCardGlow} />
              <div style={styles.profitLabel}>D2C Margin</div>
              <div style={styles.profitRow}>
                <span style={styles.profitValue}>${details.profit_analysis.d2c_margin.toFixed(2)}</span>
                <span style={{
                  ...styles.profitPercent,
                  background: details.profit_analysis.d2c_margin_percent >= 50 
                    ? 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)'
                    : details.profit_analysis.d2c_margin_percent >= 30 
                      ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
                      : 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {details.profit_analysis.d2c_margin_percent.toFixed(1)}%
                </span>
              </div>
            </div>
            <div style={styles.profitCard}>
              <div style={styles.profitCardGlow} />
              <div style={styles.profitLabel}>Wholesale Margin</div>
              <div style={styles.profitRow}>
                <span style={styles.profitValue}>${details.profit_analysis.wholesale_margin.toFixed(2)}</span>
                <span style={{
                  ...styles.profitPercent,
                  background: details.profit_analysis.wholesale_margin_percent >= 30 
                    ? 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)'
                    : details.profit_analysis.wholesale_margin_percent >= 15 
                      ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
                      : 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {details.profit_analysis.wholesale_margin_percent.toFixed(1)}%
                </span>
              </div>
            </div>
            <div style={styles.breakEvenRow}>
              <span style={styles.breakEvenLabel}>Break-even</span>
              <span style={styles.breakEvenValue}>{details.profit_analysis.break_even_units.toLocaleString()} units/month</span>
            </div>
          </div>
        </div>

        <div style={styles.expandedSection}>
          <div style={styles.sectionHeader}>
            <GradientIcon type="flask" />
            <h3 style={styles.sectionTitle}>Nutrition (per serving)</h3>
          </div>
          <div style={styles.nutritionGrid}>
            <NutritionItem label="Calories" value={`${Math.round(details.nutrition_totals.calories)}`} />
            <NutritionItem label="Protein" value={`${details.nutrition_totals.protein.toFixed(1)}g`} />
            <NutritionItem label="Carbs" value={`${details.nutrition_totals.carbs.toFixed(1)}g`} />
            <NutritionItem label="Fat" value={`${details.nutrition_totals.fat.toFixed(1)}g`} />
            <NutritionItem label="Fiber" value={`${details.nutrition_totals.fiber.toFixed(1)}g`} />
            <NutritionItem label="Sugar" value={`${details.nutrition_totals.sugar.toFixed(1)}g`} />
          </div>
        </div>
      </div>

      <div style={styles.ingredientsSection}>
        <div style={styles.sectionHeader}>
          <GradientIcon type="box" />
          <h3 style={styles.sectionTitle}>Ingredients ({details.ingredients.length})</h3>
        </div>
        <div style={styles.ingredientsGrid}>
          {details.ingredients.map((ing, index) => (
            <div key={index} style={styles.ingredientCard}>
              <div style={styles.ingredientCardGlow} />
              <div style={styles.ingredientInfo}>
                <div style={styles.ingredientName}>{ing.ingredient_name}</div>
                {ing.supplier && (
                  <div style={styles.ingredientSupplier}>{ing.supplier}</div>
                )}
              </div>
              <div style={styles.ingredientStats}>
                <div style={styles.ingredientWeight}>{ing.weight_grams}g</div>
                {ing.nutrition_data.calories !== undefined && (
                  <div style={styles.ingredientCalories}>{ing.nutrition_data.calories} cal</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CostRow({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div style={styles.costRow}>
      <div style={styles.costRowHeader}>
        <span style={styles.costLabel}>{label}</span>
        <span style={styles.costValue}>${value.toFixed(2)}</span>
      </div>
      <div style={styles.costBarBg}>
        <div style={{
          ...styles.costBarFill,
          width: `${percentage}%`,
          background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
          boxShadow: `0 0 10px ${color}40`,
        }} />
      </div>
    </div>
  );
}

function NutritionItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.nutritionItem}>
      <span style={styles.nutritionLabel}>{label}</span>
      <span style={styles.nutritionValue}>{value}</span>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    background: '#050505',
    color: '#fff',
    position: 'relative',
    overflow: 'hidden',
  },
  meshGradient: {
    position: 'fixed',
    inset: 0,
    background: 'radial-gradient(ellipse at 20% 10%, rgba(79, 172, 254, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 90%, rgba(168, 85, 247, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(34, 211, 238, 0.04) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  orbOne: {
    position: 'fixed',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(79, 172, 254, 0.12) 0%, transparent 70%)',
    top: '-200px',
    right: '-200px',
    animation: 'float 20s ease-in-out infinite',
    pointerEvents: 'none',
  },
  orbTwo: {
    position: 'fixed',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
    bottom: '-100px',
    left: '-100px',
    animation: 'float 15s ease-in-out infinite reverse',
    pointerEvents: 'none',
  },
  orbThree: {
    position: 'fixed',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(34, 211, 238, 0.08) 0%, transparent 70%)',
    top: '40%',
    left: '20%',
    animation: 'float 25s ease-in-out infinite',
    pointerEvents: 'none',
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#050505',
    gap: '24px',
  },
  loadingOrb: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    animation: 'pulse 2s ease-in-out infinite, glow 2s ease-in-out infinite',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '13px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
  },
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 32px',
    background: 'rgba(5, 5, 5, 0.8)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
    color: '#fff',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
  },
  logoText: {
    fontSize: '15px',
    fontWeight: '600',
    letterSpacing: '2px',
  },
  navLinks: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  navLink: {
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'color 0.2s ease',
  },
  navLinkActive: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '600',
  },
  exitLink: {
    color: 'rgba(255,255,255,0.4)',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '500',
    padding: '8px 16px',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  main: {
    position: 'relative',
    zIndex: 1,
    padding: '40px',
    maxWidth: '1600px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '40px',
  },
  headerBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.08)',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.6)',
    marginBottom: '16px',
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    letterSpacing: '-1px',
    background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: '0.5px',
  },
  demoBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.08)',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.6)',
  },
  demoDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    animation: 'pulse 2s ease-in-out infinite',
  },
  errorCard: {
    position: 'relative',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '12px',
    padding: '16px 20px',
    marginBottom: '24px',
    overflow: 'hidden',
  },
  errorGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    background: 'linear-gradient(180deg, #ef4444 0%, #f87171 100%)',
  },
  errorText: {
    color: '#fca5a5',
    fontSize: '14px',
    paddingLeft: '12px',
    margin: 0,
  },
  suggestionsCard: {
    position: 'relative',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '32px',
    backdropFilter: 'blur(10px)',
    overflow: 'hidden',
  },
  suggestionsGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.5), rgba(99, 102, 241, 0.5), transparent)',
    animation: 'borderGlow 3s ease-in-out infinite',
  },
  suggestionsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
  },
  suggestionsTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#fff',
    margin: 0,
  },
  suggestionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  suggestionItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    paddingLeft: '4px',
  },
  suggestionDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
    marginTop: '6px',
    flexShrink: 0,
  },
  suggestionText: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: '1.5',
    margin: 0,
  },
  controlsRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  searchContainer: {
    position: 'relative',
    flex: 1,
    minWidth: '280px',
    maxWidth: '400px',
  },
  searchIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px 12px 48px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    fontSize: '14px',
    color: '#fff',
    outline: 'none',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(10px)',
  },
  filterContainer: {
    position: 'relative',
    minWidth: '180px',
  },
  filterIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    zIndex: 1,
  },
  filterSelect: {
    width: '100%',
    padding: '12px 16px 12px 48px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    fontSize: '14px',
    color: '#fff',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    backdropFilter: 'blur(10px)',
  },
  tableContainer: {
    position: 'relative',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.08)',
    overflow: 'hidden',
    backdropFilter: 'blur(20px)',
  },
  tableGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(79, 172, 254, 0.4), rgba(0, 242, 254, 0.4), transparent)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeaderRow: {
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  tableHeader: {
    padding: '16px 20px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'rgba(255,255,255,0.5)',
  },
  tableRow: {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tableCell: {
    padding: '16px 20px',
    fontSize: '14px',
  },
  emptyCell: {
    padding: '60px',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
  },
  loadingPulse: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    margin: '0 auto 16px',
    animation: 'pulse 2s ease-in-out infinite',
  },
  productCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  expandArrow: {
    color: 'rgba(255,255,255,0.4)',
    transition: 'transform 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productName: {
    fontWeight: '500',
    color: '#fff',
    marginBottom: '2px',
  },
  productSlug: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    fontFamily: 'monospace',
  },
  categoryBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '6px',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.7)',
  },
  priceValue: {
    fontWeight: '600',
    color: '#fff',
  },
  secondaryValue: {
    color: 'rgba(255,255,255,0.5)',
  },
  marginValue: {
    fontWeight: '500',
    color: '#fff',
  },
  marginBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#fff',
  },
  expandedRow: {
    background: 'rgba(255,255,255,0.03)',
  },
  expandedContent: {
    position: 'relative',
    padding: '32px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  expandedGlow: {
    position: 'absolute',
    top: 0,
    left: '20%',
    right: '20%',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(79, 172, 254, 0.3), transparent)',
  },
  expandedLoadingText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
  },
  expandedGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '32px',
  },
  expandedSection: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#fff',
    margin: 0,
  },
  costList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  costRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  costRowHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
  },
  costLabel: {
    color: 'rgba(255,255,255,0.6)',
  },
  costValue: {
    fontWeight: '500',
    color: '#fff',
  },
  costBarBg: {
    height: '4px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  costBarFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.5s ease',
  },
  costTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    paddingTop: '16px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    marginTop: '8px',
  },
  costTotalValue: {
    background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  profitCards: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  profitCard: {
    position: 'relative',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '16px',
    overflow: 'hidden',
  },
  profitCardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
  },
  profitLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '8px',
  },
  profitRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
  },
  profitValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#fff',
  },
  profitPercent: {
    fontSize: '14px',
    fontWeight: '600',
  },
  breakEvenRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '8px',
  },
  breakEvenLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
  },
  breakEvenValue: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#fff',
  },
  nutritionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
  },
  nutritionItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 14px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '8px',
  },
  nutritionLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
  },
  nutritionValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
  },
  ingredientsSection: {
    marginTop: '32px',
  },
  ingredientsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '12px',
  },
  ingredientCard: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 18px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '10px',
    overflow: 'hidden',
    transition: 'all 0.2s ease',
  },
  ingredientCardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '3px',
    height: '100%',
    background: 'linear-gradient(180deg, #f472b6 0%, #ec4899 100%)',
    opacity: 0.6,
  },
  ingredientInfo: {
    paddingLeft: '8px',
  },
  ingredientName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#fff',
    marginBottom: '2px',
  },
  ingredientSupplier: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
  },
  ingredientStats: {
    textAlign: 'right',
  },
  ingredientWeight: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#fff',
  },
  ingredientCalories: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
  },
};
