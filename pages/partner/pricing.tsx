import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PartnerLayout from '../../components/partner/PartnerLayout';
import {
  Download,
  Tag,
  TrendingUp,
  Package,
  Search,
  Loader2,
} from 'lucide-react';
import { getAllProducts, getB2BPrice, formatPrice } from '../../lib/api/products';
import type { Product } from '../../types/database';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

interface DisplayProduct {
  id: string;
  name: string;
  category: string;
  retailPrice: number;
  wholesalePrice: number;
  sku: string;
  image: string;
}

const mockProducts: DisplayProduct[] = [
  { id: '1', name: 'Strawberry Peach Smoothie', category: 'Smoothies', retailPrice: 899, wholesalePrice: 584, sku: 'DRZZL-SPS-001', image: '🍓' },
  { id: '2', name: 'Mango Jackfruit Blend', category: 'Smoothies', retailPrice: 899, wholesalePrice: 584, sku: 'DRZZL-MJB-002', image: '🥭' },
  { id: '3', name: 'Açai Berry Bowl Mix', category: 'Bowls', retailPrice: 1199, wholesalePrice: 779, sku: 'DRZZL-ABB-003', image: '🫐' },
  { id: '4', name: 'Green Detox Blend', category: 'Smoothies', retailPrice: 799, wholesalePrice: 519, sku: 'DRZZL-GDB-004', image: '🥬' },
  { id: '5', name: 'Coffee Mushroom Blend', category: 'Specialty', retailPrice: 999, wholesalePrice: 649, sku: 'DRZZL-CMB-005', image: '☕' },
  { id: '6', name: 'Tropical Paradise Mix', category: 'Smoothies', retailPrice: 849, wholesalePrice: 552, sku: 'DRZZL-TPM-006', image: '🍍' },
  { id: '7', name: 'Protein Power Shake', category: 'Protein', retailPrice: 1099, wholesalePrice: 714, sku: 'DRZZL-PPS-007', image: '💪' },
  { id: '8', name: 'Berry Blast Smoothie', category: 'Smoothies', retailPrice: 849, wholesalePrice: 552, sku: 'DRZZL-BBS-008', image: '🍇' },
  { id: '9', name: 'Immunity Boost Blend', category: 'Specialty', retailPrice: 949, wholesalePrice: 617, sku: 'DRZZL-IBB-009', image: '🍊' },
  { id: '10', name: 'Chocolate Peanut Butter', category: 'Protein', retailPrice: 1049, wholesalePrice: 682, sku: 'DRZZL-CPB-010', image: '🍫' },
];

const volumeDiscounts = [
  { min: 0, max: 99, discount: 0, label: 'Base Tier' },
  { min: 100, max: 249, discount: 5, label: 'Bronze' },
  { min: 250, max: 499, discount: 8, label: 'Silver' },
  { min: 500, max: 999, discount: 12, label: 'Gold' },
  { min: 1000, max: Infinity, discount: 15, label: 'Platinum' },
];

function getProductEmoji(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('strawberry')) return '🍓';
  if (lower.includes('mango')) return '🥭';
  if (lower.includes('açai') || lower.includes('acai')) return '🫐';
  if (lower.includes('green') || lower.includes('detox')) return '🥬';
  if (lower.includes('coffee') || lower.includes('mocha')) return '☕';
  if (lower.includes('tropical') || lower.includes('pineapple')) return '🍍';
  if (lower.includes('protein') || lower.includes('power')) return '💪';
  if (lower.includes('berry') || lower.includes('blueberry')) return '🍇';
  if (lower.includes('chocolate')) return '🍫';
  if (lower.includes('immunity') || lower.includes('orange')) return '🍊';
  if (lower.includes('mint')) return '🌿';
  if (lower.includes('almond')) return '🌰';
  return '🥤';
}

function getTierDiscount(tier: string): number {
  switch (tier.toLowerCase()) {
    case 'platinum': return 40;
    case 'gold': return 35;
    case 'silver': return 25;
    case 'bronze': return 15;
    default: return 20;
  }
}

export default function PartnerPricing() {
  const router = useRouter();
  const [partnerName, setPartnerName] = useState('Partner');
  const [tier, setTier] = useState<'bronze' | 'silver' | 'gold' | 'platinum'>('silver');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const session = localStorage.getItem('partnerSession');
      if (!session) {
        router.push('/partner/login');
        return;
      }
      const data = JSON.parse(session);
      setPartnerName(data.businessName);
      setTier(data.tier?.toLowerCase() as any || 'silver');

      try {
        const productsData = await getAllProducts();
        if (productsData.length > 0) {
          const mappedProducts = productsData.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            retailPrice: p.price_cents,
            wholesalePrice: getB2BPrice(p, data.tier?.toLowerCase() || 'silver'),
            sku: p.sku || `DRZZL-${p.id.slice(0, 3).toUpperCase()}`,
            image: getProductEmoji(p.name),
          }));
          setProducts(mappedProducts);
        } else {
          setProducts(mockProducts);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts(mockProducts);
      }

      setLoading(false);
    };

    loadData();
  }, [router]);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const discount = getTierDiscount(tier);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <PartnerLayout title="Pricing" partnerName={partnerName}>
        <div style={styles.loadingPage}>
          <Loader2 size={32} color={NEON_GREEN} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={styles.loadingText}>Loading pricing...</p>
        </div>
      </PartnerLayout>
    );
  }

  return (
    <PartnerLayout title="Pricing" partnerName={partnerName}>
      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Wholesale Pricing</h1>
            <p style={styles.subtitle}>Your exclusive partner pricing</p>
          </div>
          <button style={styles.downloadButton}>
            <Download size={18} />
            Download Price List
          </button>
        </div>

        <div style={styles.tierCard}>
          <div style={styles.tierInfo}>
            <div style={styles.tierBadge}>
              <TrendingUp size={20} />
              {tier.charAt(0).toUpperCase() + tier.slice(1)} Tier
            </div>
            <div style={styles.tierDiscount}>
              <span style={styles.discountValue}>{discount}%</span>
              <span style={styles.discountLabel}>Off Retail</span>
            </div>
          </div>
          <div style={styles.tierDetails}>
            <p style={styles.tierDescription}>
              As a {tier.charAt(0).toUpperCase() + tier.slice(1)} partner, you receive tier-based B2B pricing.
              Order more to unlock additional volume discounts!
            </p>
          </div>
        </div>

        <div style={styles.volumeSection}>
          <h2 style={styles.sectionTitle}>
            <Package size={20} />
            Volume Discounts
          </h2>
          <p style={styles.sectionSubtitle}>
            Additional discounts based on order quantity (applied on top of your tier discount)
          </p>
          <div style={styles.volumeGrid}>
            {volumeDiscounts.map((volTier, idx) => (
              <div key={idx} style={styles.volumeCard}>
                <div style={styles.volumeLabel}>{volTier.label}</div>
                <div style={styles.volumeRange}>
                  {volTier.max === Infinity
                    ? `${volTier.min}+ units`
                    : `${volTier.min}-${volTier.max} units`}
                </div>
                <div style={styles.volumeDiscount}>
                  {volTier.discount > 0 ? `+${volTier.discount}%` : 'Base'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.productsSection}>
          <h2 style={styles.sectionTitle}>
            <Tag size={20} />
            Product Pricing
          </h2>

          <div style={styles.filters}>
            <div style={styles.searchWrapper}>
              <Search size={18} style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>
            <div style={styles.categoryTabs}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    ...styles.categoryTab,
                    ...(categoryFilter === cat ? styles.categoryTabActive : {}),
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Product</th>
                  <th style={styles.th}>SKU</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Retail Price</th>
                  <th style={styles.th}>Your Price</th>
                  <th style={styles.th}>Savings</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const savings = product.retailPrice - product.wholesalePrice;
                  return (
                    <tr key={product.id}>
                      <td style={styles.td}>
                        <div style={styles.productCell}>
                          <span style={styles.productImage}>{product.image}</span>
                          <span style={styles.productName}>{product.name}</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.sku}>{product.sku}</span>
                      </td>
                      <td style={styles.td}>{product.category}</td>
                      <td style={styles.td}>
                        <span style={styles.retailPrice}>${(product.retailPrice / 100).toFixed(2)}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.wholesalePrice}>${(product.wholesalePrice / 100).toFixed(2)}</span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.savings}>${(savings / 100).toFixed(2)}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: 32,
    maxWidth: 1400,
    margin: '0 auto',
  },
  loadingPage: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#666666',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    flexWrap: 'wrap',
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  downloadButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 20px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  tierCard: {
    padding: 24,
    backgroundColor: 'rgba(0, 255, 133, 0.05)',
    border: '1px solid rgba(0, 255, 133, 0.2)',
    borderRadius: 16,
    marginBottom: 32,
  },
  tierInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tierBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 20,
    fontWeight: 600,
    color: NEON_GREEN,
  },
  tierDiscount: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  discountValue: {
    fontSize: 36,
    fontWeight: 700,
    color: NEON_GREEN,
  },
  discountLabel: {
    fontSize: 14,
    color: '#999999',
  },
  tierDetails: {},
  tierDescription: {
    fontSize: 14,
    color: '#999999',
    margin: 0,
  },
  volumeSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 8px 0',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666666',
    margin: '0 0 20px 0',
  },
  volumeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 12,
  },
  volumeCard: {
    padding: 16,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 10,
    textAlign: 'center',
  },
  volumeLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  volumeRange: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  volumeDiscount: {
    fontSize: 18,
    fontWeight: 600,
    color: NEON_GREEN,
  },
  productsSection: {},
  filters: {
    marginBottom: 20,
  },
  searchWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#666666',
  },
  searchInput: {
    width: '100%',
    maxWidth: 400,
    padding: '12px 12px 12px 44px',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
  },
  categoryTabs: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  categoryTab: {
    padding: '8px 16px',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 20,
    color: '#999999',
    fontSize: 13,
    cursor: 'pointer',
  },
  categoryTabActive: {
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    borderColor: 'rgba(0, 255, 133, 0.3)',
    color: NEON_GREEN,
  },
  tableCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '14px 16px',
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 500,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  td: {
    padding: '14px 16px',
    fontSize: 14,
    color: '#CCCCCC',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  productCell: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  productImage: {
    fontSize: 24,
  },
  productName: {
    fontWeight: 500,
    color: '#FFFFFF',
  },
  sku: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#666666',
  },
  retailPrice: {
    color: '#666666',
    textDecoration: 'line-through',
  },
  wholesalePrice: {
    fontWeight: 600,
    color: NEON_GREEN,
  },
  savings: {
    color: '#F59E0B',
    fontWeight: 500,
  },
};
