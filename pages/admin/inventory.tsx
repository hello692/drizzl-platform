import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '../../hooks/useRole';
import {
  IngredientItem,
  PackagingItem,
  FinishedGood,
} from '../../lib/inventoryService';

type TabType = 'ingredients' | 'packaging' | 'finished_goods';
type ModalMode = 'add' | 'edit' | null;

export default function InventoryDashboard() {
  const { loading, authorized } = useRequireAdmin();
  const [activeTab, setActiveTab] = useState<TabType>('ingredients');
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  const [packaging, setPackaging] = useState<PackagingItem[]>([]);
  const [finishedGoods, setFinishedGoods] = useState<FinishedGood[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingItem, setEditingItem] = useState<IngredientItem | PackagingItem | FinishedGood | null>(null);

  useEffect(() => {
    if (authorized) {
      loadInventory();
    }
  }, [authorized]);

  async function loadInventory() {
    try {
      const response = await fetch('/api/admin/inventory');
      const data = await response.json();
      if (data.success) {
        setIngredients(data.data.ingredients || []);
        setPackaging(data.data.packaging || []);
        setFinishedGoods(data.data.finishedGoods || []);
      }
    } catch (error) {
      console.error('Error loading inventory:', error);
    } finally {
      setLoadingData(false);
    }
  }

  const filteredIngredients = useMemo(() => {
    return ingredients.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.lotNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [ingredients, searchQuery, statusFilter]);

  const filteredPackaging = useMemo(() => {
    return packaging.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [packaging, searchQuery, statusFilter]);

  const filteredFinishedGoods = useMemo(() => {
    return finishedGoods.filter(item => {
      const matchesSearch = item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [finishedGoods, searchQuery, statusFilter]);

  function getStatusBadge(status: string) {
    const gradients: Record<string, string> = {
      in_stock: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      low_stock: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      out_of_stock: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
      expiring_soon: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
      expired: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
      available: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
      reserved: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
      shipped: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
    };
    const labels: Record<string, string> = {
      in_stock: 'In Stock',
      low_stock: 'Low Stock',
      out_of_stock: 'Out of Stock',
      expiring_soon: 'Expiring Soon',
      expired: 'Expired',
      available: 'Available',
      reserved: 'Reserved',
      shipped: 'Shipped',
    };
    return (
      <span style={{
        background: gradients[status] || gradients.in_stock,
        color: '#fff',
        padding: '6px 14px',
        borderRadius: '9999px',
        fontSize: '11px',
        fontWeight: '600',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}>
        {labels[status] || status}
      </span>
    );
  }

  function getStockLevelBar(current: number, min: number) {
    const max = min * 3;
    const percentage = Math.min((current / max) * 100, 100);
    const gradient = current <= min 
      ? 'linear-gradient(90deg, #ef4444 0%, #f87171 100%)' 
      : current <= min * 1.5 
        ? 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)' 
        : 'linear-gradient(90deg, #10b981 0%, #34d399 100%)';
    const glowColor = current <= min ? 'rgba(239, 68, 68, 0.4)' : current <= min * 1.5 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)';
    
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          width: '80px', 
          height: '8px', 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: '4px', 
          overflow: 'hidden',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)',
        }}>
          <div style={{ 
            width: `${percentage}%`, 
            height: '100%', 
            background: gradient, 
            borderRadius: '4px',
            boxShadow: `0 0 12px ${glowColor}`,
            transition: 'width 0.3s ease',
          }} />
        </div>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>{current}</span>
      </div>
    );
  }

  function openAddModal() {
    setEditingItem(null);
    setModalMode('add');
  }

  function openEditModal(item: IngredientItem | PackagingItem | FinishedGood) {
    setEditingItem(item);
    setModalMode('edit');
  }

  function closeModal() {
    setModalMode(null);
    setEditingItem(null);
  }

  async function handleSaveItem(formData: any) {
    try {
      const itemType = activeTab === 'finished_goods' ? 'finished_good' : activeTab === 'packaging' ? 'packaging' : 'ingredient';
      
      if (modalMode === 'add') {
        const response = await fetch('/api/admin/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: itemType, item: formData }),
        });
        const data = await response.json();
        if (data.success) {
          await loadInventory();
        }
      } else if (modalMode === 'edit' && editingItem) {
        const response = await fetch('/api/admin/inventory', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: itemType, id: editingItem.id, updates: formData }),
        });
        const data = await response.json();
        if (data.success) {
          await loadInventory();
        }
      }
      closeModal();
    } catch (error) {
      console.error('Error saving item:', error);
    }
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingOrb} />
        <p style={styles.loadingText}>Initializing</p>
        <style jsx global>{globalAnimations}</style>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingOrb} />
        <p style={styles.loadingText}>Authenticating</p>
        <style jsx global>{globalAnimations}</style>
      </div>
    );
  }

  const lowStockCount = ingredients.filter(i => i.status === 'low_stock' || i.status === 'out_of_stock').length +
    packaging.filter(p => p.status === 'low_stock' || p.status === 'out_of_stock').length;
  const expiringCount = ingredients.filter(i => i.status === 'expiring_soon' || i.status === 'expired').length;

  return (
    <div style={styles.container}>
      <div style={styles.meshGradient} />
      <div style={styles.orbOne} />
      <div style={styles.orbTwo} />
      <div style={styles.orbThree} />

      <nav style={styles.nav}>
        <Link href="/admin" style={styles.logo}>
          <span style={styles.logoIcon}>D</span>
          <span style={styles.logoText}>DRIZZL</span>
        </Link>
        <div style={styles.navLinks}>
          <Link href="/admin/command-center" style={styles.navLink}>Command Center</Link>
          <Link href="/admin/inventory" style={styles.navLinkActive}>Inventory</Link>
          <Link href="/admin/factory" style={styles.navLink}>Factory</Link>
          <Link href="/admin/products" style={styles.navLink}>Products</Link>
          <Link href="/admin/orders" style={styles.navLink}>Orders</Link>
          <Link href="/admin/partners" style={styles.navLink}>Partners</Link>
          <Link href="/admin/banking" style={styles.navLink}>Banking</Link>
          <Link href="/" style={styles.exitLink}>Exit</Link>
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <p style={styles.headerLabel}>Intelligence Module</p>
            <h1 style={styles.title}>Inventory</h1>
            <p style={styles.subtitle}>Track ingredients, packaging, and finished goods</p>
          </div>
          <div style={styles.alertsContainer}>
            {lowStockCount > 0 && (
              <div style={styles.alertBadge}>
                <div style={styles.alertIconLow}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                </div>
                <span style={styles.alertText}>{lowStockCount} low stock</span>
              </div>
            )}
            {expiringCount > 0 && (
              <div style={styles.alertBadgeExpiring}>
                <div style={styles.alertIconExpiring}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12,6 12,12 16,14" />
                  </svg>
                </div>
                <span style={styles.alertTextExpiring}>{expiringCount} expiring</span>
              </div>
            )}
          </div>
        </div>

        <div style={styles.controlsRow}>
          <div style={styles.tabsContainer}>
            {(['ingredients', 'packaging', 'finished_goods'] as TabType[]).map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSearchQuery(''); setStatusFilter('all'); }}
                style={activeTab === tab ? styles.tabActive : styles.tab}
              >
                {tab === 'ingredients' ? 'Ingredients' : tab === 'packaging' ? 'Packaging' : 'Finished Goods'}
              </button>
            ))}
          </div>

          <div style={styles.searchContainer}>
            <svg style={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.selectInput}
          >
            <option value="all">All Status</option>
            {activeTab === 'ingredients' && (
              <>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="expiring_soon">Expiring Soon</option>
                <option value="expired">Expired</option>
              </>
            )}
            {activeTab === 'packaging' && (
              <>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </>
            )}
            {activeTab === 'finished_goods' && (
              <>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="shipped">Shipped</option>
              </>
            )}
          </select>

          <button onClick={openAddModal} style={styles.addButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Item
          </button>
        </div>

        <div style={styles.tableCard}>
          {loadingData ? (
            <div style={styles.loadingState}>
              <div style={styles.loadingSpinner} />
              <span>Loading inventory...</span>
            </div>
          ) : (
            <>
              {activeTab === 'ingredients' && (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Stock Level</th>
                      <th style={styles.th}>Unit</th>
                      <th style={styles.th}>Min</th>
                      <th style={styles.th}>Expiration</th>
                      <th style={styles.th}>Lot #</th>
                      <th style={styles.th}>Supplier</th>
                      <th style={styles.th}>Status</th>
                      <th style={{ ...styles.th, textAlign: 'right' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIngredients.map((item, index) => (
                      <tr key={item.id} style={index % 2 === 1 ? styles.trAlt : styles.tr}>
                        <td style={styles.tdName}>{item.name}</td>
                        <td style={styles.td}>{getStockLevelBar(item.quantity, item.minThreshold)}</td>
                        <td style={styles.td}>{item.unit}</td>
                        <td style={styles.td}>{item.minThreshold}</td>
                        <td style={styles.td}>{item.expirationDate || '—'}</td>
                        <td style={styles.tdMono}>{item.lotNumber}</td>
                        <td style={styles.td}>{item.supplier}</td>
                        <td style={styles.td}>{getStatusBadge(item.status)}</td>
                        <td style={{ ...styles.td, textAlign: 'right' }}>
                          <button onClick={() => openEditModal(item)} style={styles.editButton}>Edit</button>
                        </td>
                      </tr>
                    ))}
                    {filteredIngredients.length === 0 && (
                      <tr>
                        <td colSpan={9} style={styles.emptyState}>No ingredients found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'packaging' && (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Item</th>
                      <th style={styles.th}>Stock Level</th>
                      <th style={styles.th}>Quantity</th>
                      <th style={styles.th}>Min Threshold</th>
                      <th style={styles.th}>Status</th>
                      <th style={{ ...styles.th, textAlign: 'right' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPackaging.map((item, index) => (
                      <tr key={item.id} style={index % 2 === 1 ? styles.trAlt : styles.tr}>
                        <td style={styles.tdName}>{item.name}</td>
                        <td style={styles.td}>{getStockLevelBar(item.quantity, item.minThreshold)}</td>
                        <td style={styles.td}>{item.quantity.toLocaleString()} {item.unit}</td>
                        <td style={styles.td}>{item.minThreshold.toLocaleString()}</td>
                        <td style={styles.td}>{getStatusBadge(item.status)}</td>
                        <td style={{ ...styles.td, textAlign: 'right' }}>
                          <button onClick={() => openEditModal(item)} style={styles.editButton}>Edit</button>
                        </td>
                      </tr>
                    ))}
                    {filteredPackaging.length === 0 && (
                      <tr>
                        <td colSpan={6} style={styles.emptyState}>No packaging items found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'finished_goods' && (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Batch #</th>
                      <th style={styles.th}>Product</th>
                      <th style={styles.th}>Quantity</th>
                      <th style={styles.th}>Manufacture Date</th>
                      <th style={styles.th}>Expiration</th>
                      <th style={styles.th}>Location</th>
                      <th style={styles.th}>Status</th>
                      <th style={{ ...styles.th, textAlign: 'right' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFinishedGoods.map((item, index) => (
                      <tr key={item.id} style={index % 2 === 1 ? styles.trAlt : styles.tr}>
                        <td style={styles.tdMono}>{item.batchNumber}</td>
                        <td style={styles.tdName}>{item.productName}</td>
                        <td style={styles.td}>{item.quantity.toLocaleString()}</td>
                        <td style={styles.td}>{item.manufactureDate}</td>
                        <td style={styles.td}>{item.expirationDate}</td>
                        <td style={styles.td}>{item.location}</td>
                        <td style={styles.td}>{getStatusBadge(item.status)}</td>
                        <td style={{ ...styles.td, textAlign: 'right' }}>
                          <button onClick={() => openEditModal(item)} style={styles.editButton}>Edit</button>
                        </td>
                      </tr>
                    ))}
                    {filteredFinishedGoods.length === 0 && (
                      <tr>
                        <td colSpan={8} style={styles.emptyState}>No finished goods found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </main>

      {modalMode && (
        <InventoryModal
          mode={modalMode}
          type={activeTab}
          item={editingItem}
          onClose={closeModal}
          onSave={handleSaveItem}
        />
      )}

      <style jsx global>{globalAnimations}</style>
    </div>
  );
}

function InventoryModal({
  mode,
  type,
  item,
  onClose,
  onSave,
}: {
  mode: 'add' | 'edit';
  type: TabType;
  item: IngredientItem | PackagingItem | FinishedGood | null;
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [formData, setFormData] = useState<any>(
    item || (type === 'ingredients'
      ? { name: '', quantity: 0, unit: 'kg', minThreshold: 0, expirationDate: '', lotNumber: '', supplier: '', status: 'in_stock' }
      : type === 'packaging'
        ? { name: '', quantity: 0, unit: 'pcs', minThreshold: 0, status: 'in_stock' }
        : { batchNumber: '', productName: '', quantity: 0, manufactureDate: '', expirationDate: '', location: '', status: 'available' })
  );

  function handleChange(field: string, value: string | number) {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(formData);
  }

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.container}>
        <div style={modalStyles.gradientBorder} />
        <div style={modalStyles.content}>
          <div style={modalStyles.header}>
            <h2 style={modalStyles.title}>
              {mode === 'add' ? 'Add' : 'Edit'} {type === 'ingredients' ? 'Ingredient' : type === 'packaging' ? 'Packaging' : 'Finished Good'}
            </h2>
            <button onClick={onClose} style={modalStyles.closeButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {type === 'ingredients' && (
              <>
                <FormField label="Name" value={formData.name} onChange={(v) => handleChange('name', v)} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <FormField label="Quantity" type="number" value={formData.quantity} onChange={(v) => handleChange('quantity', Number(v))} />
                  <FormField label="Unit" value={formData.unit} onChange={(v) => handleChange('unit', v)} />
                </div>
                <FormField label="Min Threshold" type="number" value={formData.minThreshold} onChange={(v) => handleChange('minThreshold', Number(v))} />
                <FormField label="Expiration Date" type="date" value={formData.expirationDate} onChange={(v) => handleChange('expirationDate', v)} />
                <FormField label="Lot Number" value={formData.lotNumber} onChange={(v) => handleChange('lotNumber', v)} />
                <FormField label="Supplier" value={formData.supplier} onChange={(v) => handleChange('supplier', v)} />
              </>
            )}

            {type === 'packaging' && (
              <>
                <FormField label="Item Name" value={formData.name} onChange={(v) => handleChange('name', v)} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <FormField label="Quantity" type="number" value={formData.quantity} onChange={(v) => handleChange('quantity', Number(v))} />
                  <FormField label="Unit" value={formData.unit} onChange={(v) => handleChange('unit', v)} />
                </div>
                <FormField label="Min Threshold" type="number" value={formData.minThreshold} onChange={(v) => handleChange('minThreshold', Number(v))} />
              </>
            )}

            {type === 'finished_goods' && (
              <>
                <FormField label="Batch Number" value={formData.batchNumber} onChange={(v) => handleChange('batchNumber', v)} />
                <FormField label="Product Name" value={formData.productName} onChange={(v) => handleChange('productName', v)} />
                <FormField label="Quantity" type="number" value={formData.quantity} onChange={(v) => handleChange('quantity', Number(v))} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <FormField label="Manufacture Date" type="date" value={formData.manufactureDate} onChange={(v) => handleChange('manufactureDate', v)} />
                  <FormField label="Expiration Date" type="date" value={formData.expirationDate} onChange={(v) => handleChange('expirationDate', v)} />
                </div>
                <FormField label="Location" value={formData.location} onChange={(v) => handleChange('location', v)} />
                <div style={{ marginBottom: '20px' }}>
                  <label style={modalStyles.label}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    style={modalStyles.select}
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="shipped">Shipped</option>
                  </select>
                </div>
              </>
            )}

            <div style={modalStyles.buttonRow}>
              <button type="button" onClick={onClose} style={modalStyles.cancelButton}>
                Cancel
              </button>
              <button type="submit" style={modalStyles.submitButton}>
                {mode === 'add' ? 'Add Item' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={modalStyles.label}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={modalStyles.input}
      />
    </div>
  );
}

const globalAnimations = `
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
    50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6); }
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`;

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
    background: 'radial-gradient(ellipse at 20% 20%, rgba(67, 233, 123, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(56, 249, 215, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(102, 126, 234, 0.04) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  orbOne: {
    position: 'fixed',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(67, 233, 123, 0.12) 0%, transparent 70%)',
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
    background: 'radial-gradient(circle, rgba(56, 249, 215, 0.1) 0%, transparent 70%)',
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
    background: 'radial-gradient(circle, rgba(102, 126, 234, 0.08) 0%, transparent 70%)',
    top: '40%',
    left: '25%',
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
    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
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
    padding: '20px 40px',
    background: 'rgba(5, 5, 5, 0.8)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
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
    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
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
  },
  main: {
    position: 'relative',
    zIndex: 1,
    padding: '40px',
    maxWidth: '1500px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '36px',
  },
  headerLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginBottom: '8px',
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
  },
  alertsContainer: {
    display: 'flex',
    gap: '12px',
  },
  alertBadge: {
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '12px',
    padding: '12px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backdropFilter: 'blur(10px)',
  },
  alertIconLow: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
  alertText: {
    fontSize: '13px',
    color: '#f87171',
    fontWeight: '600',
  },
  alertBadgeExpiring: {
    background: 'rgba(245, 158, 11, 0.15)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    borderRadius: '12px',
    padding: '12px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backdropFilter: 'blur(10px)',
  },
  alertIconExpiring: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
  alertTextExpiring: {
    fontSize: '13px',
    color: '#fbbf24',
    fontWeight: '600',
  },
  controlsRow: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tabsContainer: {
    display: 'flex',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    padding: '4px',
    border: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(10px)',
  },
  tab: {
    padding: '12px 24px',
    border: 'none',
    background: 'transparent',
    color: 'rgba(255,255,255,0.5)',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    padding: '12px 24px',
    border: 'none',
    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    color: '#000',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(67, 233, 123, 0.3)',
  },
  searchContainer: {
    flex: 1,
    minWidth: '250px',
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'rgba(255,255,255,0.4)',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px 12px 44px',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    background: 'rgba(255,255,255,0.03)',
    color: '#fff',
    backdropFilter: 'blur(10px)',
  },
  selectInput: {
    padding: '12px 20px',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    fontSize: '14px',
    background: 'rgba(255,255,255,0.03)',
    color: '#fff',
    cursor: 'pointer',
    minWidth: '150px',
    backdropFilter: 'blur(10px)',
  },
  addButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  tableCard: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.06)',
    overflow: 'hidden',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  loadingState: {
    padding: '80px',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  loadingSpinner: {
    width: '32px',
    height: '32px',
    border: '3px solid rgba(255,255,255,0.1)',
    borderTopColor: '#43e97b',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '16px 20px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    background: 'rgba(255,255,255,0.02)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    transition: 'background 0.2s',
  },
  trAlt: {
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    background: 'rgba(255,255,255,0.015)',
    transition: 'background 0.2s',
  },
  td: {
    padding: '16px 20px',
    fontSize: '14px',
    color: 'rgba(255,255,255,0.7)',
  },
  tdName: {
    padding: '16px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
  },
  tdMono: {
    padding: '16px 20px',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.6)',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  editButton: {
    background: 'rgba(59, 130, 246, 0.15)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    color: '#60a5fa',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '6px 14px',
    borderRadius: '8px',
    transition: 'all 0.2s',
  },
  emptyState: {
    padding: '60px',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.4)',
    fontSize: '14px',
  },
};

const modalStyles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  container: {
    position: 'relative',
    width: '100%',
    maxWidth: '520px',
    maxHeight: '90vh',
    borderRadius: '24px',
    padding: '2px',
    background: 'linear-gradient(135deg, rgba(67, 233, 123, 0.5) 0%, rgba(56, 249, 215, 0.5) 50%, rgba(102, 126, 234, 0.5) 100%)',
    backgroundSize: '200% 200%',
    animation: 'gradientShift 3s ease infinite',
  },
  gradientBorder: {
    position: 'absolute',
    inset: 0,
    borderRadius: '24px',
    background: 'linear-gradient(135deg, rgba(67, 233, 123, 0.3) 0%, rgba(56, 249, 215, 0.3) 50%, rgba(102, 126, 234, 0.3) 100%)',
    filter: 'blur(20px)',
    zIndex: -1,
  },
  content: {
    background: 'rgba(10, 10, 10, 0.95)',
    borderRadius: '22px',
    padding: '32px',
    backdropFilter: 'blur(20px)',
    overflow: 'auto',
    maxHeight: 'calc(90vh - 4px)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
    background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  closeButton: {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: 'rgba(255,255,255,0.6)',
    transition: 'all 0.2s',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    fontSize: '14px',
    outline: 'none',
    background: 'rgba(255,255,255,0.03)',
    color: '#fff',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  select: {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    fontSize: '14px',
    background: 'rgba(255,255,255,0.03)',
    color: '#fff',
    cursor: 'pointer',
  },
  buttonRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '28px',
  },
  cancelButton: {
    flex: 1,
    padding: '14px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'transparent',
    color: 'rgba(255,255,255,0.7)',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  submitButton: {
    flex: 1,
    padding: '14px',
    border: 'none',
    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    color: '#000',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(67, 233, 123, 0.3)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
};
