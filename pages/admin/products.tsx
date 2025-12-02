import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '../../hooks/useRole';
import { Product } from '../../lib/supabaseClient';

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="url(#greenGradient)" strokeWidth="2" strokeLinecap="round">
    <defs>
      <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#43e97b" />
        <stop offset="100%" stopColor="#38f9d7" />
      </linearGradient>
    </defs>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="url(#blueGradient)" strokeWidth="2" strokeLinecap="round">
    <defs>
      <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4facfe" />
        <stop offset="100%" stopColor="#00f2fe" />
      </linearGradient>
    </defs>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="url(#redGradient)" strokeWidth="2" strokeLinecap="round">
    <defs>
      <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff416c" />
        <stop offset="100%" stopColor="#ff4b2b" />
      </linearGradient>
    </defs>
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const ProductIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#productGradient)" strokeWidth="2" strokeLinecap="round">
    <defs>
      <linearGradient id="productGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c471f5" />
        <stop offset="100%" stopColor="#fa71cd" />
      </linearGradient>
    </defs>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
  </svg>
);

export default function AdminProducts() {
  const { loading, authorized } = useRequireAdmin();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    category: 'smoothies',
    price_cents: 0,
    wholesale_price_cents: 0,
    hero_image_url: '',
    is_active: true,
  });

  useEffect(() => {
    if (authorized) {
      loadProducts();
    }
  }, [authorized]);

  async function loadProducts() {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      setProducts(data.products || []);
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

  function openNewForm() {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      category: 'smoothies',
      price_cents: 0,
      wholesale_price_cents: 0,
      hero_image_url: '',
      is_active: true,
    });
    setShowForm(true);
  }

  function openEditForm(product: Product) {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      category: product.category,
      price_cents: product.price_cents,
      wholesale_price_cents: product.wholesale_price_cents,
      hero_image_url: product.hero_image_url || '',
      is_active: product.is_active,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingProduct) {
        const response = await fetch(`/api/admin/products?id=${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error('Failed to update product');
        }
      } else {
        const response = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          throw new Error('Failed to create product');
        }
      }
      setShowForm(false);
      loadProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Error saving product');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      loadProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Error deleting product');
    }
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingOrb} />
        <p style={styles.loadingText}>Initializing</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingOrb} />
        <p style={styles.loadingText}>Authenticating</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.meshGradient} />
      <div style={styles.orbOne} />
      <div style={styles.orbTwo} />
      <div style={styles.orbThree} />
      <div style={styles.orbFour} />

      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <Link href="/admin" style={styles.logo}>
            <span style={styles.logoIcon}>D</span>
            <span style={styles.logoText}>DRIZZL</span>
          </Link>
        </div>
        <div style={styles.navLinks}>
          <Link href="/admin/command-center" style={styles.navLink}>Command Center</Link>
          <Link href="/admin/products" style={styles.navLinkActive}>Products</Link>
          <Link href="/admin/product-intel" style={styles.navLink}>Product Intel</Link>
          <Link href="/admin/orders" style={styles.navLink}>Orders</Link>
          <Link href="/admin/partners" style={styles.navLink}>Partners</Link>
          <Link href="/admin/banking" style={styles.navLink}>Banking</Link>
          <Link href="/admin/ai-assistant" style={styles.navLink}>AI Assistant</Link>
          <Link href="/" style={styles.exitLink}>Exit</Link>
        </div>
      </nav>

      <main style={styles.main}>
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.headerIcon}>
              <ProductIcon />
            </div>
            <div>
              <p style={styles.headerSubtitle}>Product Catalog</p>
              <h1 style={styles.title}>Products</h1>
            </div>
          </div>
          <div style={styles.headerRight}>
            <div style={styles.productCount}>
              <span style={styles.countNumber}>{products.length}</span>
              <span style={styles.countLabel}>Total Products</span>
            </div>
            <button onClick={openNewForm} style={styles.addButton}>
              <PlusIcon />
              <span>Add Product</span>
            </button>
          </div>
        </header>

        {error && (
          <div style={styles.errorBanner}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff9500" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p style={styles.errorText}>{error}</p>
          </div>
        )}

        {showForm && (
          <div style={styles.modalOverlay} onClick={() => setShowForm(false)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalGradientBorder} />
              <div style={styles.modalContent}>
                <div style={styles.modalHeader}>
                  <h2 style={styles.modalTitle}>{editingProduct ? 'Edit Product' : 'New Product'}</h2>
                  <button onClick={() => setShowForm(false)} style={styles.closeButton}>
                    <CloseIcon />
                  </button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        style={styles.formInput}
                        placeholder="Product name"
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Slug (URL)</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({...formData, slug: e.target.value})}
                        required
                        style={styles.formInput}
                        placeholder="product-slug"
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        style={styles.formSelect}
                      >
                        <option value="smoothies">Smoothies</option>
                        <option value="high-protein">High Protein</option>
                        <option value="bowls">Bowls</option>
                        <option value="bites">Bites</option>
                        <option value="wellness">Wellness</option>
                      </select>
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Image URL</label>
                      <input
                        type="url"
                        value={formData.hero_image_url}
                        onChange={(e) => setFormData({...formData, hero_image_url: e.target.value})}
                        style={styles.formInput}
                        placeholder="https://..."
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>D2C Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={(formData.price_cents / 100).toFixed(2)}
                        onChange={(e) => setFormData({...formData, price_cents: Math.round(parseFloat(e.target.value) * 100)})}
                        required
                        style={styles.formInput}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Wholesale Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={(formData.wholesale_price_cents / 100).toFixed(2)}
                        onChange={(e) => setFormData({...formData, wholesale_price_cents: Math.round(parseFloat(e.target.value) * 100)})}
                        required
                        style={styles.formInput}
                      />
                    </div>
                    <div style={styles.formGroupFull}>
                      <label style={styles.formLabel}>Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        rows={3}
                        style={styles.formTextarea}
                        placeholder="Product description..."
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={formData.is_active}
                          onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                          style={styles.checkbox}
                        />
                        <span style={styles.checkboxText}>Active (visible on store)</span>
                      </label>
                    </div>
                  </div>
                  <div style={styles.formActions}>
                    <button type="submit" disabled={saving} style={styles.submitButton}>
                      {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} style={styles.cancelButton}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Product</th>
                <th style={styles.tableHeader}>Category</th>
                <th style={styles.tableHeader}>D2C Price</th>
                <th style={styles.tableHeader}>Wholesale</th>
                <th style={styles.tableHeader}>Status</th>
                <th style={{...styles.tableHeader, textAlign: 'right' as const}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingProducts ? (
                <tr>
                  <td colSpan={6} style={styles.loadingCell}>
                    <div style={styles.loadingSpinner} />
                    <span>Loading products...</span>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} style={styles.emptyCell}>
                    <ProductIcon />
                    <p>No products yet</p>
                    <button onClick={openNewForm} style={styles.emptyAddButton}>Add your first product</button>
                  </td>
                </tr>
              ) : (
                products.map(product => (
                  <tr
                    key={product.id}
                    style={{
                      ...styles.tableRow,
                      background: hoveredRow === product.id ? 'rgba(255,255,255,0.03)' : 'transparent',
                    }}
                    onMouseEnter={() => setHoveredRow(product.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td style={styles.tableCell}>
                      <div style={styles.productCell}>
                        {product.hero_image_url ? (
                          <img src={product.hero_image_url} alt="" style={styles.productImage} />
                        ) : (
                          <div style={styles.productImagePlaceholder}>
                            <ProductIcon />
                          </div>
                        )}
                        <div>
                          <p style={styles.productName}>{product.name}</p>
                          <p style={styles.productSlug}>{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td style={styles.tableCell}>
                      <span style={styles.categoryBadge}>{product.category}</span>
                    </td>
                    <td style={styles.tableCell}>
                      <span style={styles.priceText}>${(product.price_cents / 100).toFixed(2)}</span>
                    </td>
                    <td style={styles.tableCell}>
                      <span style={styles.wholesaleText}>${(product.wholesale_price_cents / 100).toFixed(2)}</span>
                    </td>
                    <td style={styles.tableCell}>
                      <span style={{
                        ...styles.statusBadge,
                        background: product.is_active
                          ? 'linear-gradient(135deg, rgba(67, 233, 123, 0.15) 0%, rgba(56, 249, 215, 0.15) 100%)'
                          : 'linear-gradient(135deg, rgba(255, 65, 108, 0.15) 0%, rgba(255, 75, 43, 0.15) 100%)',
                        color: product.is_active ? '#43e97b' : '#ff416c',
                      }}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{...styles.tableCell, textAlign: 'right' as const}}>
                      <button onClick={() => openEditForm(product)} style={styles.editButton}>
                        <EditIcon />
                        <span>Edit</span>
                      </button>
                      <button onClick={() => handleDelete(product.id)} style={styles.deleteButton}>
                        <TrashIcon />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(196, 113, 245, 0.3); }
          50% { box-shadow: 0 0 40px rgba(196, 113, 245, 0.6); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
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
    background: 'radial-gradient(ellipse at 20% 20%, rgba(196, 113, 245, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(250, 113, 205, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(79, 172, 254, 0.04) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  orbOne: {
    position: 'fixed',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(196, 113, 245, 0.12) 0%, transparent 70%)',
    top: '-150px',
    right: '-150px',
    animation: 'float 20s ease-in-out infinite',
    pointerEvents: 'none',
  },
  orbTwo: {
    position: 'fixed',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(250, 113, 205, 0.1) 0%, transparent 70%)',
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
    background: 'radial-gradient(circle, rgba(79, 172, 254, 0.08) 0%, transparent 70%)',
    top: '40%',
    left: '20%',
    animation: 'float 25s ease-in-out infinite',
    pointerEvents: 'none',
  },
  orbFour: {
    position: 'fixed',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(67, 233, 123, 0.06) 0%, transparent 70%)',
    top: '60%',
    right: '25%',
    animation: 'float 18s ease-in-out infinite reverse',
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
    background: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
    animation: 'pulse 2s ease-in-out infinite, glow 2s ease-in-out infinite',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px',
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
    padding: '16px 40px',
    background: 'rgba(5, 5, 5, 0.8)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
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
    background: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
  },
  logoText: {
    fontSize: '16px',
    fontWeight: '600',
    letterSpacing: '2px',
  },
  navLinks: {
    display: 'flex',
    gap: '28px',
    alignItems: 'center',
  },
  navLink: {
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'color 0.2s',
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
    transition: 'all 0.2s',
  },
  main: {
    position: 'relative',
    zIndex: 1,
    padding: '40px',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  headerIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  headerSubtitle: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: '1px',
    marginBottom: '4px',
  },
  title: {
    fontSize: '36px',
    fontWeight: '700',
    letterSpacing: '-1px',
    background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.7) 50%, #c471f5 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  productCount: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  countNumber: {
    fontSize: '28px',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  countLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#000',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(67, 233, 123, 0.3)',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(255, 149, 0, 0.1)',
    border: '1px solid rgba(255, 149, 0, 0.2)',
    borderRadius: '12px',
    padding: '16px 20px',
    marginBottom: '24px',
    backdropFilter: 'blur(10px)',
  },
  errorText: {
    color: '#ff9500',
    fontSize: '14px',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    padding: '20px',
  },
  modal: {
    position: 'relative',
    width: '100%',
    maxWidth: '640px',
    borderRadius: '24px',
    overflow: 'hidden',
  },
  modalGradientBorder: {
    position: 'absolute',
    inset: 0,
    borderRadius: '24px',
    padding: '1px',
    background: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 50%, #4facfe 100%)',
    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
    WebkitMaskComposite: 'xor',
    maskComposite: 'exclude',
    pointerEvents: 'none',
  },
  modalContent: {
    background: 'rgba(15, 15, 15, 0.95)',
    backdropFilter: 'blur(40px)',
    padding: '32px',
    borderRadius: '24px',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  closeButton: {
    background: 'rgba(255,255,255,0.05)',
    border: 'none',
    borderRadius: '10px',
    padding: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  formGroupFull: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    gridColumn: 'span 2',
  },
  formLabel: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  formInput: {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#fff',
    transition: 'all 0.2s',
    outline: 'none',
  },
  formSelect: {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#fff',
    outline: 'none',
    cursor: 'pointer',
  },
  formTextarea: {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    fontSize: '14px',
    color: '#fff',
    resize: 'vertical',
    outline: 'none',
    minHeight: '100px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: '#43e97b',
  },
  checkboxText: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.7)',
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '28px',
  },
  submitButton: {
    flex: 1,
    padding: '14px 24px',
    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    border: 'none',
    borderRadius: '12px',
    color: '#000',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  cancelButton: {
    padding: '14px 24px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tableContainer: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.06)',
    overflow: 'hidden',
    backdropFilter: 'blur(20px)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    padding: '18px 20px',
    textAlign: 'left' as const,
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
    color: 'rgba(255,255,255,0.4)',
    background: 'rgba(255,255,255,0.02)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  tableRow: {
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    transition: 'background 0.2s',
  },
  tableCell: {
    padding: '18px 20px',
    fontSize: '14px',
    color: 'rgba(255,255,255,0.8)',
  },
  loadingCell: {
    padding: '60px 20px',
    textAlign: 'center' as const,
    color: 'rgba(255,255,255,0.4)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '16px',
  },
  loadingSpinner: {
    width: '24px',
    height: '24px',
    border: '2px solid rgba(196, 113, 245, 0.2)',
    borderTop: '2px solid #c471f5',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  emptyCell: {
    padding: '80px 20px',
    textAlign: 'center' as const,
    color: 'rgba(255,255,255,0.4)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '16px',
  },
  emptyAddButton: {
    marginTop: '8px',
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    border: 'none',
    borderRadius: '10px',
    color: '#000',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  productCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },
  productImage: {
    width: '48px',
    height: '48px',
    objectFit: 'cover' as const,
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  productImagePlaceholder: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productName: {
    fontWeight: '600',
    fontSize: '14px',
    color: '#fff',
    marginBottom: '2px',
  },
  productSlug: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
  },
  categoryBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'capitalize' as const,
  },
  priceText: {
    fontWeight: '600',
    color: '#fff',
    fontSize: '15px',
  },
  wholesaleText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  editButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.1) 0%, rgba(0, 242, 254, 0.1) 100%)',
    border: '1px solid rgba(79, 172, 254, 0.2)',
    borderRadius: '8px',
    color: '#4facfe',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginRight: '8px',
  },
  deleteButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: 'linear-gradient(135deg, rgba(255, 65, 108, 0.1) 0%, rgba(255, 75, 43, 0.1) 100%)',
    border: '1px solid rgba(255, 65, 108, 0.2)',
    borderRadius: '8px',
    color: '#ff416c',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
