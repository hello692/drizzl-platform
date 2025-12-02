import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '../../hooks/useRole';
import { Product } from '../../lib/supabaseClient';

export default function AdminProducts() {
  const { loading, authorized } = useRequireAdmin();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
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
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}><p>Loading...</p></div>;
  }

  if (!authorized) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}><p>Checking authorization...</p></div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{ background: '#000', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', fontWeight: '700' }}>DRIZZL ADMIN</Link>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/admin/products" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>Products</Link>
          <Link href="/admin/orders" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Orders</Link>
          <Link href="/admin/partners" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Partners</Link>
          <Link href="/admin/analytics" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Analytics</Link>
          <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.6 }}>Exit</Link>
        </div>
      </nav>

      <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>Products</h1>
            <p style={{ color: '#666', fontSize: '14px' }}>{products.length} products</p>
          </div>
          <button onClick={openNewForm} style={{
            background: '#000', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
          }}>Add Product</button>
        </div>

        {error && (
          <div style={{ background: '#fff3e0', border: '1px solid #ffcc02', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
            <p style={{ color: '#e65100', fontSize: '14px' }}>{error}</p>
          </div>
        )}

        {showForm && (
          <div style={{ background: '#fff', borderRadius: '12px', padding: '32px', marginBottom: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px' }}>{editingProduct ? 'Edit Product' : 'New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Slug (URL)</label>
                  <input type="text" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} required style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}>
                    <option value="smoothies">Smoothies</option>
                    <option value="high-protein">High Protein</option>
                    <option value="bowls">Bowls</option>
                    <option value="bites">Bites</option>
                    <option value="wellness">Wellness</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Image URL</label>
                  <input type="url" value={formData.hero_image_url} onChange={(e) => setFormData({...formData, hero_image_url: e.target.value})} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>D2C Price ($)</label>
                  <input type="number" step="0.01" value={(formData.price_cents / 100).toFixed(2)} onChange={(e) => setFormData({...formData, price_cents: Math.round(parseFloat(e.target.value) * 100)})} required style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Wholesale Price ($)</label>
                  <input type="number" step="0.01" value={(formData.wholesale_price_cents / 100).toFixed(2)} onChange={(e) => setFormData({...formData, wholesale_price_cents: Math.round(parseFloat(e.target.value) * 100)})} required style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Description</label>
                  <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows={3} style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }} />
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({...formData, is_active: e.target.checked})} />
                    Active (visible on store)
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" disabled={saving} style={{ background: '#000', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={{ background: '#f5f5f5', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #eee' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>Product</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>Category</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>D2C Price</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>Wholesale</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingProducts ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No products yet</td></tr>
              ) : (
                products.map(product => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {product.hero_image_url && (
                          <img src={product.hero_image_url} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', background: '#f5f5f5' }} />
                        )}
                        <div>
                          <p style={{ fontWeight: '600', fontSize: '14px' }}>{product.name}</p>
                          <p style={{ color: '#666', fontSize: '12px' }}>{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px' }}>{product.category}</td>
                    <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600' }}>${(product.price_cents / 100).toFixed(2)}</td>
                    <td style={{ padding: '16px', fontSize: '14px', color: '#666' }}>${(product.wholesale_price_cents / 100).toFixed(2)}</td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: product.is_active ? '#e6f4ea' : '#fce8e6', color: product.is_active ? '#1e7e34' : '#c53929' }}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <button onClick={() => openEditForm(product)} style={{ background: 'none', border: 'none', color: '#000', cursor: 'pointer', padding: '6px 12px', fontSize: '13px', marginRight: '8px' }}>Edit</button>
                      <button onClick={() => handleDelete(product.id)} style={{ background: 'none', border: 'none', color: '#c53929', cursor: 'pointer', padding: '6px 12px', fontSize: '13px' }}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
