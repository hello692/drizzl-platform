import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '../../hooks/useRole';
import { ProductWithCosts, ProductDetails } from '../../lib/productIntelService';

type SortField = 'name' | 'margin_percent' | 'cost_per_unit' | 'price_cents';
type SortDirection = 'asc' | 'desc';

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

  function getMarginColor(marginPercent: number): string {
    if (marginPercent >= 50) return '#22c55e';
    if (marginPercent >= 30) return '#eab308';
    return '#ef4444';
  }

  function getMarginBgColor(marginPercent: number): string {
    if (marginPercent >= 50) return 'rgba(34, 197, 94, 0.1)';
    if (marginPercent >= 30) return 'rgba(234, 179, 8, 0.1)';
    return 'rgba(239, 68, 68, 0.1)';
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>Loading...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>Checking authorization...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <nav style={{ background: '#000', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', fontWeight: '700', letterSpacing: '-0.5px' }}>
          DRIZZL ADMIN
        </Link>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/admin/command-center" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Command Center</Link>
          <Link href="/admin/products" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Products</Link>
          <Link href="/admin/product-intel" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>Product Intel</Link>
          <Link href="/admin/orders" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Orders</Link>
          <Link href="/admin/order-intel" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Order Intel</Link>
          <Link href="/admin/partners" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Partners</Link>
          <Link href="/admin/banking" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Banking</Link>
          <Link href="/admin/analytics" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Analytics</Link>
          <Link href="/admin/ai" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>AI Tools</Link>
          <Link href="/admin/ai-assistant" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>AI Assistant</Link>
          <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.6 }}>Exit</Link>
        </div>
      </nav>

      <main style={{ padding: '40px', maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '4px', color: '#000' }}>
                Product Intelligence
              </h1>
              <p style={{ color: '#666', fontSize: '14px' }}>
                {filteredProducts.length} products · Cost analysis & margin tracking
              </p>
            </div>
            {demoMode && (
              <div style={{ background: '#f5f5f5', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', color: '#666' }}>
                Demo Mode
              </div>
            )}
          </div>
        </div>

        {error && (
          <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
            <p style={{ color: '#92400e', fontSize: '14px' }}>{error}</p>
          </div>
        )}

        {suggestions.length > 0 && (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '16px' }}>✨</span>
              <h2 style={{ fontSize: '14px', fontWeight: '600', color: '#000', margin: 0 }}>AI Optimization Suggestions</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {suggestions.map((suggestion, index) => (
                <p key={index} style={{ fontSize: '13px', color: '#475569', margin: 0, paddingLeft: '24px' }}>
                  • {suggestion}
                </p>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              width: '280px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#000'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              background: '#fff',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                <SortableHeader field="name" label="Product" currentField={sortField} direction={sortDirection} onSort={handleSort} />
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6b7280' }}>Category</th>
                <SortableHeader field="price_cents" label="D2C Price" currentField={sortField} direction={sortDirection} onSort={handleSort} align="right" />
                <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6b7280' }}>Wholesale</th>
                <SortableHeader field="cost_per_unit" label="Cost" currentField={sortField} direction={sortDirection} onSort={handleSort} align="right" />
                <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#6b7280' }}>Margin</th>
                <SortableHeader field="margin_percent" label="Margin %" currentField={sortField} direction={sortDirection} onSort={handleSort} align="right" />
              </tr>
            </thead>
            <tbody>
              {loadingProducts ? (
                <tr>
                  <td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <React.Fragment key={product.id}>
                    <tr
                      onClick={() => handleRowClick(product.id)}
                      style={{
                        borderBottom: expandedProductId === product.id ? 'none' : '1px solid #f3f4f6',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#fafafa'}
                      onMouseLeave={(e) => e.currentTarget.style.background = expandedProductId === product.id ? '#fafafa' : '#fff'}
                    >
                      <td style={{ padding: '16px', fontSize: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            transition: 'transform 0.2s',
                            transform: expandedProductId === product.id ? 'rotate(90deg)' : 'rotate(0deg)',
                            fontSize: '10px',
                            color: '#9ca3af',
                          }}>
                            ▶
                          </span>
                          <div>
                            <div style={{ fontWeight: '500', color: '#000' }}>{product.name}</div>
                            <div style={{ fontSize: '12px', color: '#9ca3af', fontFamily: 'monospace' }}>{product.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px', fontSize: '13px', color: '#6b7280' }}>
                        <span style={{
                          background: '#f3f4f6',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '12px',
                        }}>
                          {product.category}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right', fontSize: '14px', fontWeight: '500', color: '#000' }}>
                        ${(product.price_cents / 100).toFixed(2)}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right', fontSize: '14px', color: '#6b7280' }}>
                        ${(product.wholesale_price_cents / 100).toFixed(2)}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right', fontSize: '14px', color: '#6b7280' }}>
                        ${product.cost_per_unit.toFixed(2)}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right', fontSize: '14px', fontWeight: '500', color: getMarginColor(product.margin_percent) }}>
                        ${product.margin.toFixed(2)}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '13px',
                          fontWeight: '600',
                          color: getMarginColor(product.margin_percent),
                          background: getMarginBgColor(product.margin_percent),
                        }}>
                          {product.margin_percent.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                    {expandedProductId === product.id && (
                      <tr style={{ background: '#fafafa' }}>
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
    </div>
  );
}

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
  return (
    <th
      onClick={() => onSort(field)}
      style={{
        padding: '14px 16px',
        textAlign: align,
        fontSize: '11px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: isActive ? '#000' : '#6b7280',
        cursor: 'pointer',
        userSelect: 'none',
        transition: 'color 0.15s',
      }}
    >
      {label}
      {isActive && (
        <span style={{ marginLeft: '4px', fontSize: '10px' }}>
          {direction === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </th>
  );
}

function ExpandedDetails({ details, loading }: { details: ProductDetails | null; loading: boolean }) {
  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
        Loading details...
      </div>
    );
  }

  if (!details) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
        Could not load product details
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 32px 32px', borderTop: '1px solid #e5e7eb' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
        <div>
          <h3 style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000', marginBottom: '16px' }}>
            Cost Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <CostRow label="Ingredients" value={details.cost_breakdown.ingredients} total={details.cost_breakdown.total} />
            <CostRow label="Packaging" value={details.cost_breakdown.packaging} total={details.cost_breakdown.total} />
            <CostRow label="Labor" value={details.cost_breakdown.labor} total={details.cost_breakdown.total} />
            <CostRow label="Overhead" value={details.cost_breakdown.overhead} total={details.cost_breakdown.total} />
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', marginTop: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600' }}>
                <span>Total Cost</span>
                <span>${details.cost_breakdown.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000', marginBottom: '16px' }}>
            Profit Analysis
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>D2C Margin</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '24px', fontWeight: '700', color: '#000' }}>
                  ${details.profit_analysis.d2c_margin.toFixed(2)}
                </span>
                <span style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: details.profit_analysis.d2c_margin_percent >= 50 ? '#22c55e' :
                         details.profit_analysis.d2c_margin_percent >= 30 ? '#eab308' : '#ef4444',
                }}>
                  {details.profit_analysis.d2c_margin_percent.toFixed(1)}%
                </span>
              </div>
            </div>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>Wholesale Margin</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '24px', fontWeight: '700', color: '#000' }}>
                  ${details.profit_analysis.wholesale_margin.toFixed(2)}
                </span>
                <span style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: details.profit_analysis.wholesale_margin_percent >= 30 ? '#22c55e' :
                         details.profit_analysis.wholesale_margin_percent >= 15 ? '#eab308' : '#ef4444',
                }}>
                  {details.profit_analysis.wholesale_margin_percent.toFixed(1)}%
                </span>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Break-even: <span style={{ fontWeight: '600', color: '#000' }}>{details.profit_analysis.break_even_units.toLocaleString()}</span> units/month
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000', marginBottom: '16px' }}>
            Nutrition (per serving)
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            <NutritionItem label="Calories" value={`${Math.round(details.nutrition_totals.calories)}`} />
            <NutritionItem label="Protein" value={`${details.nutrition_totals.protein.toFixed(1)}g`} />
            <NutritionItem label="Carbs" value={`${details.nutrition_totals.carbs.toFixed(1)}g`} />
            <NutritionItem label="Fat" value={`${details.nutrition_totals.fat.toFixed(1)}g`} />
            <NutritionItem label="Fiber" value={`${details.nutrition_totals.fiber.toFixed(1)}g`} />
            <NutritionItem label="Sugar" value={`${details.nutrition_totals.sugar.toFixed(1)}g`} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#000', marginBottom: '16px' }}>
          Ingredients ({details.ingredients.length})
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {details.ingredients.map((ing, index) => (
            <div key={index} style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#000' }}>{ing.ingredient_name}</div>
                {ing.supplier && (
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>{ing.supplier}</div>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#000' }}>{ing.weight_grams}g</div>
                {ing.nutrition_data.calories !== undefined && (
                  <div style={{ fontSize: '12px', color: '#9ca3af' }}>{ing.nutrition_data.calories} cal</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CostRow({ label, value, total }: { label: string; value: number; total: number }) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
        <span style={{ color: '#6b7280' }}>{label}</span>
        <span style={{ fontWeight: '500', color: '#000' }}>${value.toFixed(2)}</span>
      </div>
      <div style={{ height: '4px', background: '#e5e7eb', borderRadius: '2px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${percentage}%`,
          background: '#000',
          borderRadius: '2px',
          transition: 'width 0.3s ease',
        }} />
      </div>
    </div>
  );
}

function NutritionItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '6px',
      padding: '10px 12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <span style={{ fontSize: '12px', color: '#6b7280' }}>{label}</span>
      <span style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>{value}</span>
    </div>
  );
}
