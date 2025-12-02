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
    const styles: Record<string, React.CSSProperties> = {
      in_stock: { background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500' },
      low_stock: { background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500' },
      out_of_stock: { background: '#fee2e2', color: '#991b1b', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500' },
      expiring_soon: { background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500' },
      expired: { background: '#fee2e2', color: '#991b1b', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500' },
      available: { background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500' },
      reserved: { background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500' },
      shipped: { background: '#f3e8ff', color: '#6b21a8', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500' },
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
    return <span style={styles[status] || styles.in_stock}>{labels[status] || status}</span>;
  }

  function getStockLevelBar(current: number, min: number) {
    const max = min * 3;
    const percentage = Math.min((current / max) * 100, 100);
    const color = current <= min ? '#ef4444' : current <= min * 1.5 ? '#f59e0b' : '#22c55e';
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '60px', height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${percentage}%`, height: '100%', background: color, borderRadius: '3px' }} />
        </div>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>{current}</span>
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>Loading...</p>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa' }}>
        <p style={{ color: '#666', fontSize: '14px' }}>Checking authorization...</p>
      </div>
    );
  }

  const lowStockCount = ingredients.filter(i => i.status === 'low_stock' || i.status === 'out_of_stock').length +
    packaging.filter(p => p.status === 'low_stock' || p.status === 'out_of_stock').length;
  const expiringCount = ingredients.filter(i => i.status === 'expiring_soon' || i.status === 'expired').length;

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <nav style={{ background: '#000', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', fontWeight: '700', letterSpacing: '-0.5px' }}>
          DRIZZL ADMIN
        </Link>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/admin/command-center" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Command Center</Link>
          <Link href="/admin/inventory" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 1, fontWeight: '600' }}>Inventory</Link>
          <Link href="/admin/factory" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Factory</Link>
          <Link href="/admin/products" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Products</Link>
          <Link href="/admin/orders" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Orders</Link>
          <Link href="/admin/partners" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Partners</Link>
          <Link href="/admin/banking" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Banking</Link>
          <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.6 }}>Exit</Link>
        </div>
      </nav>

      <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.5px', color: '#111' }}>Inventory</h1>
            <p style={{ color: '#666', fontSize: '14px' }}>Track ingredients, packaging, and finished goods</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            {lowStockCount > 0 && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>⚠️</span>
                <span style={{ fontSize: '13px', color: '#991b1b', fontWeight: '500' }}>{lowStockCount} low stock items</span>
              </div>
            )}
            {expiringCount > 0 && (
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px' }}>⏰</span>
                <span style={{ fontSize: '13px', color: '#92400e', fontWeight: '500' }}>{expiringCount} expiring soon</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: '#fff', borderRadius: '8px', padding: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            {(['ingredients', 'packaging', 'finished_goods'] as TabType[]).map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setSearchQuery(''); setStatusFilter('all'); }}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  background: activeTab === tab ? '#000' : 'transparent',
                  color: activeTab === tab ? '#fff' : '#666',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab === 'ingredients' ? 'Ingredients' : tab === 'packaging' ? 'Packaging' : 'Finished Goods'}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                background: '#fff',
              }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '14px',
              background: '#fff',
              cursor: 'pointer',
              minWidth: '140px',
            }}
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

          <button
            onClick={openAddModal}
            style={{
              padding: '10px 20px',
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '16px' }}>+</span> Add Item
          </button>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          {loadingData ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#666' }}>Loading inventory...</div>
          ) : (
            <>
              {activeTab === 'ingredients' && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Name</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Stock Level</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Unit</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Min</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Expiration</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Lot #</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Supplier</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIngredients.map((item, index) => (
                      <tr key={item.id} style={{ borderTop: '1px solid #f3f4f6', background: index % 2 === 1 ? '#fafafa' : '#fff' }}>
                        <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '500', color: '#111' }}>{item.name}</td>
                        <td style={{ padding: '14px 16px' }}>{getStockLevelBar(item.quantity, item.minThreshold)}</td>
                        <td style={{ padding: '14px 16px', fontSize: '14px', color: '#666' }}>{item.unit}</td>
                        <td style={{ padding: '14px 16px', fontSize: '14px', color: '#666' }}>{item.minThreshold}</td>
                        <td style={{ padding: '14px 16px', fontSize: '14px', color: '#666' }}>{item.expirationDate || '—'}</td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#666', fontFamily: 'monospace' }}>{item.lotNumber}</td>
                        <td style={{ padding: '14px 16px', fontSize: '14px', color: '#666' }}>{item.supplier}</td>
                        <td style={{ padding: '14px 16px' }}>{getStatusBadge(item.status)}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <button
                            onClick={() => openEditModal(item)}
                            style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredIngredients.length === 0 && (
                      <tr>
                        <td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No ingredients found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'packaging' && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Item</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Stock Level</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quantity</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Min Threshold</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPackaging.map((item, index) => (
                      <tr key={item.id} style={{ borderTop: '1px solid #f3f4f6', background: index % 2 === 1 ? '#fafafa' : '#fff' }}>
                        <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '500', color: '#111' }}>{item.name}</td>
                        <td style={{ padding: '14px 16px' }}>{getStockLevelBar(item.quantity, item.minThreshold)}</td>
                        <td style={{ padding: '14px 16px', fontSize: '14px', color: '#666' }}>{item.quantity.toLocaleString()} {item.unit}</td>
                        <td style={{ padding: '14px 16px', fontSize: '14px', color: '#666' }}>{item.minThreshold.toLocaleString()}</td>
                        <td style={{ padding: '14px 16px' }}>{getStatusBadge(item.status)}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <button
                            onClick={() => openEditModal(item)}
                            style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredPackaging.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No packaging items found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === 'finished_goods' && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Batch #</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Product</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quantity</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Manufacture Date</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Expiration</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Location</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFinishedGoods.map((item, index) => (
                      <tr key={item.id} style={{ borderTop: '1px solid #f3f4f6', background: index % 2 === 1 ? '#fafafa' : '#fff' }}>
                        <td style={{ padding: '14px 16px', fontSize: '13px', fontFamily: 'monospace', color: '#111' }}>{item.batchNumber}</td>
                        <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: '500', color: '#111' }}>{item.productName}</td>
                        <td style={{ padding: '14px 16px', fontSize: '14px', color: '#666' }}>{item.quantity.toLocaleString()}</td>
                        <td style={{ padding: '14px 16px', fontSize: '14px', color: '#666' }}>{item.manufactureDate}</td>
                        <td style={{ padding: '14px 16px', fontSize: '14px', color: '#666' }}>{item.expirationDate}</td>
                        <td style={{ padding: '14px 16px', fontSize: '14px', color: '#666' }}>{item.location}</td>
                        <td style={{ padding: '14px 16px' }}>{getStatusBadge(item.status)}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <button
                            onClick={() => openEditModal(item)}
                            style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredFinishedGoods.length === 0 && (
                      <tr>
                        <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No finished goods found</td>
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
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '32px',
        width: '100%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflow: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', letterSpacing: '-0.5px' }}>
            {mode === 'add' ? 'Add' : 'Edit'} {type === 'ingredients' ? 'Ingredient' : type === 'packaging' ? 'Packaging' : 'Finished Good'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}>×</button>
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
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', background: '#fff' }}
                >
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="shipped">Shipped</option>
                </select>
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, padding: '12px', border: '1px solid #e5e7eb', background: '#fff', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ flex: 1, padding: '12px', border: 'none', background: '#000', color: '#fff', borderRadius: '8px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
            >
              {mode === 'add' ? 'Add Item' : 'Save Changes'}
            </button>
          </div>
        </form>
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
      <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
      />
    </div>
  );
}
