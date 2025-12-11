import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import CommandCenterLayout from '../../../components/admin/CommandCenterLayout';
import {
  ArrowLeft,
  Package,
  Save,
  Image,
  DollarSign,
  Boxes,
  FileText,
  Tag,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255,255,255,0.03)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

const CATEGORIES = ['Smoothie', 'Box', 'Bundle'];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface Toast {
  type: 'success' | 'error';
  message: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    category: 'Smoothie',
    price_cents: '',
    wholesale_price_cents: '',
    hero_image_url: '',
    stock_quantity: '',
    is_active: true,
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setToast({ type: 'error', message: 'Product name is required' });
      return;
    }

    if (!formData.price_cents) {
      setToast({ type: 'error', message: 'Price is required' });
      return;
    }

    setSaving(true);
    try {
      const productData = {
        name: formData.name.trim(),
        slug: formData.slug || generateSlug(formData.name),
        description: formData.description.trim() || null,
        category: formData.category,
        price_cents: Math.round(parseFloat(formData.price_cents) * 100),
        wholesale_price_cents: formData.wholesale_price_cents
          ? Math.round(parseFloat(formData.wholesale_price_cents) * 100)
          : null,
        hero_image_url: formData.hero_image_url.trim() || null,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        is_active: formData.is_active,
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        setToast({ type: 'success', message: 'Product created successfully!' });
        setTimeout(() => {
          router.push('/admin/products');
        }, 1500);
      } else {
        const data = await res.json();
        setToast({ type: 'error', message: data.error || 'Failed to create product' });
      }
    } catch (err) {
      console.error('Error creating product:', err);
      setToast({ type: 'error', message: 'Failed to create product' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <CommandCenterLayout title="Add Product">
      <div style={styles.container}>
        <header style={styles.header}>
          <Link href="/admin/products" style={styles.backBtn}>
            <ArrowLeft size={18} />
            Back to Products
          </Link>
          <h1 style={styles.title}>ADD NEW PRODUCT</h1>
          <p style={styles.subtitle}>Create a new product in your catalog</p>
        </header>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGrid}>
            <div style={styles.mainColumn}>
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>
                  <FileText size={18} />
                  Basic Information
                </h2>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleNameChange}
                    placeholder="e.g., Strawberry Peach Smoothie"
                    style={styles.input}
                    required
                  />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Slug</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="auto-generated-from-name"
                    style={styles.input}
                  />
                  <span style={styles.fieldHint}>URL-friendly identifier (auto-generated)</span>
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your product..."
                    style={styles.textarea}
                    rows={4}
                  />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={styles.card}>
                <h2 style={styles.cardTitle}>
                  <Image size={18} />
                  Product Image
                </h2>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Hero Image URL</label>
                  <input
                    type="url"
                    name="hero_image_url"
                    value={formData.hero_image_url}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    style={styles.input}
                  />
                  <span style={styles.fieldHint}>Enter a URL for the product image</span>
                </div>
                {formData.hero_image_url && (
                  <div style={styles.imagePreview}>
                    <img
                      src={formData.hero_image_url}
                      alt="Preview"
                      style={styles.previewImg}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div style={styles.sideColumn}>
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>
                  <DollarSign size={18} />
                  Pricing
                </h2>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Retail Price ($) *</label>
                  <div style={styles.priceInput}>
                    <span style={styles.pricePrefix}>$</span>
                    <input
                      type="number"
                      name="price_cents"
                      value={formData.price_cents}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      style={styles.priceField}
                      required
                    />
                  </div>
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Wholesale Price ($)</label>
                  <div style={styles.priceInput}>
                    <span style={styles.pricePrefix}>$</span>
                    <input
                      type="number"
                      name="wholesale_price_cents"
                      value={formData.wholesale_price_cents}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      style={styles.priceField}
                    />
                  </div>
                  <span style={styles.fieldHint}>B2B pricing for wholesale partners</span>
                </div>
              </div>

              <div style={styles.card}>
                <h2 style={styles.cardTitle}>
                  <Boxes size={18} />
                  Inventory
                </h2>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Stock Quantity</label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.card}>
                <h2 style={styles.cardTitle}>
                  <Tag size={18} />
                  Status
                </h2>
                <label style={styles.toggleLabel}>
                  <div style={styles.toggleInfo}>
                    <span style={styles.toggleTitle}>Active</span>
                    <span style={styles.toggleHint}>Product is visible and can be purchased</span>
                  </div>
                  <div
                    style={{
                      ...styles.toggle,
                      backgroundColor: formData.is_active ? NEON_GREEN : 'rgba(255,255,255,0.2)',
                    }}
                    onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                  >
                    <div
                      style={{
                        ...styles.toggleKnob,
                        transform: formData.is_active ? 'translateX(20px)' : 'translateX(0)',
                      }}
                    />
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div style={styles.formActions}>
            <Link href="/admin/products" style={styles.cancelBtn}>
              Cancel
            </Link>
            <button type="submit" style={styles.saveBtn} disabled={saving}>
              {saving ? (
                <>
                  <div style={styles.btnSpinner} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Create Product
                </>
              )}
            </button>
          </div>
        </form>

        {toast && (
          <div
            style={{
              ...styles.toast,
              backgroundColor: toast.type === 'success' ? 'rgba(0, 255, 133, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              borderColor: toast.type === 'success' ? NEON_GREEN : '#ef4444',
            }}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 size={18} color={NEON_GREEN} />
            ) : (
              <AlertCircle size={18} color="#ef4444" />
            )}
            <span style={{ color: toast.type === 'success' ? NEON_GREEN : '#ef4444' }}>
              {toast.message}
            </span>
            <button style={styles.toastClose} onClick={() => setToast(null)}>
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </CommandCenterLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 1200,
    margin: '0 auto',
  },
  header: {
    marginBottom: 32,
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    color: 'rgba(255,255,255,0.6)',
    textDecoration: 'none',
    fontSize: 14,
    marginBottom: 16,
    transition: 'color 0.2s ease',
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: 24,
  },
  mainColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  sideColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  card: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    padding: 24,
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    cursor: 'pointer',
  },
  fieldHint: {
    display: 'block',
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 6,
  },
  priceInput: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    overflow: 'hidden',
  },
  pricePrefix: {
    padding: '12px 16px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    fontWeight: 500,
  },
  priceField: {
    flex: 1,
    padding: '12px 16px',
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
  },
  imagePreview: {
    marginTop: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  previewImg: {
    width: '100%',
    height: 200,
    objectFit: 'cover',
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
  },
  toggleInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  toggleTitle: {
    fontSize: 14,
    fontWeight: 500,
    color: '#fff',
  },
  toggleHint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 4,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    transition: 'transform 0.2s ease',
  },
  formActions: {
    display: 'flex',
    gap: 16,
    justifyContent: 'flex-end',
    paddingTop: 24,
    borderTop: `1px solid ${CARD_BORDER}`,
  },
  cancelBtn: {
    padding: '12px 24px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    fontSize: 14,
    fontWeight: 500,
    textDecoration: 'none',
    cursor: 'pointer',
  },
  saveBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 24px',
    backgroundColor: NEON_GREEN,
    border: 'none',
    borderRadius: 8,
    color: '#000',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
  },
  btnSpinner: {
    width: 16,
    height: 16,
    border: '2px solid rgba(0,0,0,0.2)',
    borderTopColor: '#000',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  toast: {
    position: 'fixed',
    bottom: 24,
    right: 24,
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px 20px',
    borderRadius: 12,
    border: '1px solid',
    zIndex: 1000,
  },
  toastClose: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    padding: 4,
    marginLeft: 8,
  },
};
