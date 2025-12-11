import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import CommandCenterLayout from '../../../components/admin/CommandCenterLayout';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  ChevronDown,
  CheckCircle2,
  XCircle,
  DollarSign,
  Boxes,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255,255,255,0.03)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  price_cents: number;
  wholesale_price_cents: number | null;
  hero_image_url: string | null;
  is_active: boolean;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = ['All', 'Smoothie', 'Box', 'Bundle'];
const STATUSES = ['All', 'Active', 'Inactive'];

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ProductsListPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
      if (data.error) {
        setError(data.message || 'Failed to load products');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'All' ||
      product.category.toLowerCase() === categoryFilter.toLowerCase();

    const matchesStatus =
      statusFilter === 'All' ||
      (statusFilter === 'Active' && product.is_active) ||
      (statusFilter === 'Inactive' && !product.is_active);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id));
        setDeleteId(null);
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product');
    } finally {
      setDeleting(false);
    }
  };

  const stats = {
    total: products.length,
    active: products.filter((p) => p.is_active).length,
    lowStock: products.filter((p) => p.stock_quantity < 20).length,
    totalValue: products.reduce((sum, p) => sum + p.price_cents * p.stock_quantity, 0),
  };

  return (
    <CommandCenterLayout title="Products">
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>PRODUCT MANAGEMENT</h1>
            <p style={styles.subtitle}>Manage your product catalog</p>
          </div>
          <Link href="/admin/products/new" style={styles.addBtn}>
            <Plus size={16} />
            Add Product
          </Link>
        </header>

        <section style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: 'rgba(99, 102, 241, 0.15)' }}>
              <Package size={20} color="#6366f1" />
            </div>
            <div style={styles.statContent}>
              <span style={styles.statLabel}>Total Products</span>
              <span style={styles.statValue}>{stats.total}</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: 'rgba(0, 255, 133, 0.15)' }}>
              <CheckCircle2 size={20} color={NEON_GREEN} />
            </div>
            <div style={styles.statContent}>
              <span style={styles.statLabel}>Active</span>
              <span style={styles.statValue}>{stats.active}</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: 'rgba(245, 158, 11, 0.15)' }}>
              <AlertTriangle size={20} color="#f59e0b" />
            </div>
            <div style={styles.statContent}>
              <span style={styles.statLabel}>Low Stock</span>
              <span style={styles.statValue}>{stats.lowStock}</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: 'rgba(34, 197, 94, 0.15)' }}>
              <DollarSign size={20} color="#22c55e" />
            </div>
            <div style={styles.statContent}>
              <span style={styles.statLabel}>Inventory Value</span>
              <span style={styles.statValue}>{formatCurrency(stats.totalValue)}</span>
            </div>
          </div>
        </section>

        <section style={styles.filtersSection}>
          <div style={styles.searchBox}>
            <Search size={18} color="rgba(255,255,255,0.4)" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.filterGroup}>
            <div style={styles.selectWrapper}>
              <Filter size={16} color="rgba(255,255,255,0.4)" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={styles.select}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} color="rgba(255,255,255,0.4)" />
            </div>
            <div style={styles.selectWrapper}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={styles.select}
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status === 'All' ? 'All Status' : status}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} color="rgba(255,255,255,0.4)" />
            </div>
          </div>
        </section>

        <section style={styles.tableCard}>
          {loading ? (
            <div style={styles.loadingState}>
              <div style={styles.spinner} />
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div style={styles.errorState}>
              <AlertTriangle size={24} color="#f59e0b" />
              <p>{error}</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={styles.emptyState}>
              <Package size={48} color="rgba(255,255,255,0.2)" />
              <p style={styles.emptyTitle}>No products found</p>
              <p style={styles.emptySubtitle}>
                {products.length === 0
                  ? 'Add your first product to get started'
                  : 'Try adjusting your filters'}
              </p>
              {products.length === 0 && (
                <Link href="/admin/products/new" style={styles.emptyAddBtn}>
                  <Plus size={16} />
                  Add Product
                </Link>
              )}
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Image</th>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Stock</th>
                    <th style={styles.th}>Status</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.productImage}>
                          {product.hero_image_url ? (
                            <img
                              src={product.hero_image_url}
                              alt={product.name}
                              style={styles.productImg}
                            />
                          ) : (
                            <Package size={20} color="rgba(255,255,255,0.3)" />
                          )}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.productName}>{product.name}</div>
                        <div style={styles.productSlug}>{product.slug}</div>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.categoryBadge}>{product.category}</span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.priceCell}>
                          <span style={styles.price}>{formatCurrency(product.price_cents)}</span>
                          {product.wholesale_price_cents && (
                            <span style={styles.wholesalePrice}>
                              B2B: {formatCurrency(product.wholesale_price_cents)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.stockBadge,
                            color: product.stock_quantity < 20 ? '#f59e0b' : NEON_GREEN,
                            backgroundColor:
                              product.stock_quantity < 20
                                ? 'rgba(245, 158, 11, 0.15)'
                                : 'rgba(0, 255, 133, 0.15)',
                          }}
                        >
                          {product.stock_quantity} units
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            color: product.is_active ? NEON_GREEN : '#ef4444',
                            backgroundColor: product.is_active
                              ? 'rgba(0, 255, 133, 0.15)'
                              : 'rgba(239, 68, 68, 0.15)',
                          }}
                        >
                          {product.is_active ? (
                            <>
                              <CheckCircle2 size={12} />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle size={12} />
                              Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        <div style={styles.actions}>
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            style={styles.actionBtn}
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </Link>
                          <button
                            onClick={() => setDeleteId(product.id)}
                            style={{ ...styles.actionBtn, color: '#ef4444' }}
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {deleteId && (
          <div style={styles.modalOverlay} onClick={() => setDeleteId(null)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h3 style={styles.modalTitle}>Delete Product</h3>
              <p style={styles.modalText}>
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div style={styles.modalActions}>
                <button
                  onClick={() => setDeleteId(null)}
                  style={styles.modalCancelBtn}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  style={styles.modalDeleteBtn}
                  disabled={deleting}
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </CommandCenterLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 1400,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '0.05em',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  addBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 20px',
    backgroundColor: NEON_GREEN,
    color: '#000',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 700,
    color: '#fff',
  },
  filtersSection: {
    display: 'flex',
    gap: 16,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 280,
    padding: '12px 16px',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: 14,
  },
  filterGroup: {
    display: 'flex',
    gap: 12,
  },
  selectWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 16px',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
  },
  select: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#fff',
    fontSize: 14,
    cursor: 'pointer',
    appearance: 'none',
    paddingRight: 20,
  },
  tableCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '16px 20px',
    textAlign: 'left',
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  tr: {
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  td: {
    padding: '16px 20px',
    fontSize: 14,
    color: '#fff',
    verticalAlign: 'middle',
  },
  productImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  productImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  productName: {
    fontWeight: 600,
    marginBottom: 2,
  },
  productSlug: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  categoryBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    color: '#a78bfa',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 500,
  },
  priceCell: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  price: {
    fontWeight: 600,
    color: NEON_GREEN,
  },
  wholesalePrice: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  stockBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 500,
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 10px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 500,
  },
  actions: {
    display: 'flex',
    gap: 8,
    justifyContent: 'flex-end',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: 'none',
    color: 'rgba(255,255,255,0.7)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
  },
  loadingState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
    color: 'rgba(255,255,255,0.5)',
    gap: 16,
  },
  spinner: {
    width: 32,
    height: 32,
    border: '3px solid rgba(255,255,255,0.1)',
    borderTopColor: NEON_GREEN,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  errorState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
    color: 'rgba(255,255,255,0.5)',
    gap: 12,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#fff',
  },
  emptySubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  emptyAddBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    padding: '10px 16px',
    backgroundColor: NEON_GREEN,
    color: '#000',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    textDecoration: 'none',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#1a1a1a',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 32,
    maxWidth: 400,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#fff',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 24,
    lineHeight: 1.5,
  },
  modalActions: {
    display: 'flex',
    gap: 12,
    justifyContent: 'flex-end',
  },
  modalCancelBtn: {
    padding: '10px 20px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
  modalDeleteBtn: {
    padding: '10px 20px',
    backgroundColor: '#ef4444',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
};
