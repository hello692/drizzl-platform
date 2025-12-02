import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '../../hooks/useRole';

const OrderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="orderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#48c6ef" />
        <stop offset="100%" stopColor="#6f86d6" />
      </linearGradient>
    </defs>
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" stroke="url(#orderGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="filterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="100%" stopColor="#764ba2" />
      </linearGradient>
    </defs>
    <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" stroke="url(#filterGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="userGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f093fb" />
        <stop offset="100%" stopColor="#f5576c" />
      </linearGradient>
    </defs>
    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="url(#userGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="calGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a8edea" />
        <stop offset="100%" stopColor="#fed6e3" />
      </linearGradient>
    </defs>
    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="url(#calGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DollarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="dollarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#43e97b" />
        <stop offset="100%" stopColor="#38f9d7" />
      </linearGradient>
    </defs>
    <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="url(#dollarGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4facfe" />
        <stop offset="100%" stopColor="#00f2fe" />
      </linearGradient>
    </defs>
    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="url(#eyeGrad)" strokeWidth="2"/>
    <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="url(#eyeGrad)" strokeWidth="2"/>
  </svg>
);

export default function AdminOrders() {
  const { loading, authorized } = useRequireAdmin();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'd2c' | 'b2b'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  useEffect(() => {
    if (authorized) {
      loadOrders();
    }
  }, [authorized, filter, statusFilter]);

  async function loadOrders() {
    setLoadingOrders(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.append('orderType', filter);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      
      const response = await fetch(`/api/admin/orders?${params.toString()}`);
      const data = await response.json();
      setOrders(data.orders || []);
      if (data.message) {
        setError(data.message);
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Error loading orders:', err);
      setError('Unable to load orders');
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  }

  async function handleStatusChange(orderId: string, newStatus: string) {
    setUpdating(orderId);
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      
      loadOrders();
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Error updating order status');
    } finally {
      setUpdating(null);
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
          <Link href="/admin/products" style={styles.navLink}>Products</Link>
          <Link href="/admin/orders" style={styles.navLinkActive}>Orders</Link>
          <Link href="/admin/partners" style={styles.navLink}>Partners</Link>
          <Link href="/admin/banking" style={styles.navLink}>Banking</Link>
          <Link href="/admin/ai-assistant" style={styles.navLink}>AI Assistant</Link>
          <Link href="/" style={styles.exitLink}>Exit</Link>
        </div>
      </nav>

      <main style={styles.main}>
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.headerIcon}><OrderIcon /></div>
            <div>
              <h1 style={styles.title}>Orders</h1>
              <p style={styles.subtitle}>{orders.length} total orders</p>
            </div>
          </div>
          <div style={styles.filters}>
            <div style={styles.filterGroup}>
              <FilterIcon />
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value as any)} 
                style={styles.select}
              >
                <option value="all">All Types</option>
                <option value="d2c">D2C</option>
                <option value="b2b">B2B</option>
              </select>
            </div>
            <div style={styles.filterGroup}>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)} 
                style={styles.select}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </header>

        {error && (
          <div style={styles.errorBanner}>
            <div style={styles.errorIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4m0 4h.01"/>
              </svg>
            </div>
            <p style={styles.errorText}>{error}</p>
          </div>
        )}

        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Order ID</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingOrders ? (
                <tr>
                  <td colSpan={7} style={styles.emptyCell}>
                    <div style={styles.loadingInline}>
                      <div style={styles.loadingDot} />
                      <div style={{ ...styles.loadingDot, animationDelay: '0.2s' }} />
                      <div style={{ ...styles.loadingDot, animationDelay: '0.4s' }} />
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={styles.emptyCell}>
                    <div style={styles.emptyState}>
                      <OrderIcon />
                      <p>No orders found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr 
                    key={order.id} 
                    style={{
                      ...styles.tr,
                      background: hoveredRow === order.id 
                        ? 'rgba(255,255,255,0.06)' 
                        : 'transparent',
                      boxShadow: hoveredRow === order.id 
                        ? '0 0 30px rgba(102, 126, 234, 0.15)' 
                        : 'none',
                    }}
                    onMouseEnter={() => setHoveredRow(order.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td style={styles.td}>
                      <span style={styles.orderId}>{order.id.slice(0, 8)}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.customerCell}>
                        <div style={styles.customerAvatar}>
                          <UserIcon />
                        </div>
                        <div>
                          <p style={styles.customerEmail}>{order.profiles?.email || 'Guest'}</p>
                          <p style={styles.customerName}>{order.profiles?.name || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.typeBadge,
                        background: order.order_type === 'b2b' 
                          ? 'linear-gradient(135deg, rgba(79, 172, 254, 0.2) 0%, rgba(0, 242, 254, 0.2) 100%)'
                          : 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
                        borderColor: order.order_type === 'b2b' 
                          ? 'rgba(79, 172, 254, 0.3)'
                          : 'rgba(102, 126, 234, 0.3)',
                      }}>
                        {order.order_type?.toUpperCase() || 'N/A'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.totalCell}>
                        <DollarIcon />
                        <span style={styles.totalAmount}>${((order.total_cents || 0) / 100).toFixed(2)}</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <StatusBadge 
                        status={order.status} 
                        onChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                        updating={updating === order.id}
                      />
                    </td>
                    <td style={styles.td}>
                      <div style={styles.dateCell}>
                        <CalendarIcon />
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <button 
                        style={styles.viewButton}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <EyeIcon />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
          updating={updating}
        />
      )}

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
          50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6); }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

function StatusBadge({ status, onChange, updating }: { status: string; onChange: (s: string) => void; updating: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const config = getStatusConfig(status);
  
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={updating}
        style={{
          ...styles.statusBadge,
          background: config.gradient,
          opacity: updating ? 0.6 : 1,
          cursor: updating ? 'wait' : 'pointer',
        }}
      >
        <span style={styles.statusDot} />
        <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      
      {isOpen && (
        <div style={styles.statusDropdown}>
          {statuses.map(s => {
            const cfg = getStatusConfig(s);
            return (
              <button
                key={s}
                onClick={() => {
                  onChange(s);
                  setIsOpen(false);
                }}
                style={{
                  ...styles.statusOption,
                  background: s === status ? 'rgba(255,255,255,0.1)' : 'transparent',
                }}
              >
                <span style={{ ...styles.statusOptionDot, background: cfg.dotColor }} />
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function OrderDetailModal({ order, onClose, onStatusChange, updating }: { order: any; onClose: () => void; onStatusChange: (id: string, status: string) => void; updating: string | null }) {
  const config = getStatusConfig(order.status);
  
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div>
            <h2 style={styles.modalTitle}>Order Details</h2>
            <p style={styles.modalOrderId}>#{order.id.slice(0, 12)}</p>
          </div>
          <button onClick={onClose} style={styles.closeButton}>
            <CloseIcon />
          </button>
        </div>
        
        <div style={styles.modalBody}>
          <div style={styles.modalSection}>
            <h3 style={styles.modalSectionTitle}>Customer Information</h3>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Email</span>
                <span style={styles.infoValue}>{order.profiles?.email || 'Guest'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Name</span>
                <span style={styles.infoValue}>{order.profiles?.name || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div style={styles.modalSection}>
            <h3 style={styles.modalSectionTitle}>Order Information</h3>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Type</span>
                <span style={styles.infoValue}>{order.order_type?.toUpperCase() || 'N/A'}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Total</span>
                <span style={{ ...styles.infoValue, color: '#43e97b', fontWeight: '600' }}>
                  ${((order.total_cents || 0) / 100).toFixed(2)}
                </span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Created</span>
                <span style={styles.infoValue}>
                  {new Date(order.created_at).toLocaleString()}
                </span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Status</span>
                <span style={{
                  ...styles.modalStatusBadge,
                  background: config.gradient,
                }}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
          
          <div style={styles.modalSection}>
            <h3 style={styles.modalSectionTitle}>Update Status</h3>
            <div style={styles.statusActions}>
              {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => {
                const cfg = getStatusConfig(s);
                const isActive = s === order.status;
                return (
                  <button
                    key={s}
                    onClick={() => onStatusChange(order.id, s)}
                    disabled={updating === order.id || isActive}
                    style={{
                      ...styles.statusActionButton,
                      background: isActive ? cfg.gradient : 'rgba(255,255,255,0.05)',
                      borderColor: isActive ? 'transparent' : 'rgba(255,255,255,0.1)',
                      opacity: updating === order.id ? 0.5 : 1,
                    }}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusConfig(status: string) {
  switch (status) {
    case 'pending':
      return { 
        gradient: 'linear-gradient(135deg, rgba(250, 176, 5, 0.25) 0%, rgba(255, 193, 7, 0.25) 100%)',
        dotColor: '#ffc107',
      };
    case 'processing':
      return { 
        gradient: 'linear-gradient(135deg, rgba(79, 172, 254, 0.25) 0%, rgba(0, 242, 254, 0.25) 100%)',
        dotColor: '#4facfe',
      };
    case 'shipped':
      return { 
        gradient: 'linear-gradient(135deg, rgba(131, 96, 195, 0.25) 0%, rgba(168, 128, 255, 0.25) 100%)',
        dotColor: '#a880ff',
      };
    case 'delivered':
      return { 
        gradient: 'linear-gradient(135deg, rgba(67, 233, 123, 0.25) 0%, rgba(56, 249, 215, 0.25) 100%)',
        dotColor: '#43e97b',
      };
    case 'cancelled':
      return { 
        gradient: 'linear-gradient(135deg, rgba(255, 87, 87, 0.25) 0%, rgba(255, 100, 124, 0.25) 100%)',
        dotColor: '#ff5757',
      };
    case 'paid':
      return { 
        gradient: 'linear-gradient(135deg, rgba(67, 233, 123, 0.25) 0%, rgba(56, 249, 215, 0.25) 100%)',
        dotColor: '#43e97b',
      };
    default:
      return { 
        gradient: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        dotColor: '#888',
      };
  }
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
    background: 'radial-gradient(ellipse at 20% 20%, rgba(102, 126, 234, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(240, 147, 251, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(67, 233, 123, 0.04) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  orbOne: {
    position: 'fixed',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(72, 198, 239, 0.12) 0%, transparent 70%)',
    top: '-150px',
    right: '-100px',
    animation: 'float 20s ease-in-out infinite',
    pointerEvents: 'none',
  },
  orbTwo: {
    position: 'fixed',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(111, 134, 214, 0.1) 0%, transparent 70%)',
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
    background: 'radial-gradient(circle, rgba(168, 128, 255, 0.08) 0%, transparent 70%)',
    top: '40%',
    left: '60%',
    animation: 'float 25s ease-in-out infinite',
    pointerEvents: 'none',
  },
  orbFour: {
    position: 'fixed',
    width: '350px',
    height: '350px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(67, 233, 123, 0.06) 0%, transparent 70%)',
    top: '60%',
    left: '20%',
    animation: 'float 18s ease-in-out infinite',
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
    background: 'linear-gradient(135deg, #48c6ef 0%, #6f86d6 100%)',
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
    background: 'rgba(5, 5, 5, 0.85)',
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
    background: 'linear-gradient(135deg, #48c6ef 0%, #6f86d6 100%)',
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
    background: 'linear-gradient(135deg, #48c6ef, #6f86d6)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
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
    maxWidth: '1500px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '20px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  headerIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, rgba(72, 198, 239, 0.15) 0%, rgba(111, 134, 214, 0.15) 100%)',
    border: '1px solid rgba(72, 198, 239, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
    background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.5)',
    marginTop: '4px',
  },
  filters: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '10px',
    padding: '4px 12px',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  select: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: '13px',
    padding: '8px 4px',
    cursor: 'pointer',
    outline: 'none',
  },
  errorBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'linear-gradient(135deg, rgba(255, 87, 87, 0.1) 0%, rgba(255, 100, 124, 0.1) 100%)',
    border: '1px solid rgba(255, 87, 87, 0.2)',
    borderRadius: '12px',
    padding: '16px 20px',
    marginBottom: '24px',
  },
  errorIcon: {
    color: '#ff5757',
    display: 'flex',
    alignItems: 'center',
  },
  errorText: {
    color: '#ff8a8a',
    fontSize: '14px',
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
  th: {
    padding: '16px 20px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'rgba(255,255,255,0.4)',
    background: 'rgba(255,255,255,0.02)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  tr: {
    transition: 'all 0.3s ease',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  td: {
    padding: '16px 20px',
    verticalAlign: 'middle',
  },
  orderId: {
    fontFamily: 'monospace',
    fontSize: '13px',
    fontWeight: '600',
    color: '#fff',
    background: 'rgba(255,255,255,0.05)',
    padding: '6px 10px',
    borderRadius: '6px',
  },
  customerCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  customerAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.15) 0%, rgba(245, 87, 108, 0.15) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerEmail: {
    fontSize: '14px',
    color: '#fff',
    fontWeight: '500',
  },
  customerName: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    marginTop: '2px',
  },
  typeBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.5px',
    border: '1px solid',
  },
  totalCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  totalAmount: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#fff',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 14px',
    borderRadius: '20px',
    border: 'none',
    fontSize: '12px',
    fontWeight: '500',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#fff',
  },
  statusDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: '8px',
    background: 'rgba(20, 20, 20, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    overflow: 'hidden',
    zIndex: 50,
    minWidth: '150px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
  },
  statusOption: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '12px 16px',
    border: 'none',
    background: 'transparent',
    color: '#fff',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'background 0.2s',
    textAlign: 'left',
  },
  statusOptionDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  dateCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.6)',
  },
  viewButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  emptyCell: {
    padding: '60px 20px',
    textAlign: 'center',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    color: 'rgba(255,255,255,0.4)',
  },
  loadingInline: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
  },
  loadingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #48c6ef 0%, #6f86d6 100%)',
    animation: 'dotPulse 1s ease-in-out infinite',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    padding: '20px',
  },
  modal: {
    width: '100%',
    maxWidth: '600px',
    background: 'rgba(15, 15, 15, 0.95)',
    backdropFilter: 'blur(40px)',
    borderRadius: '24px',
    border: '1px solid rgba(255,255,255,0.08)',
    overflow: 'hidden',
    animation: 'fadeIn 0.3s ease',
    boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '28px 28px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  modalTitle: {
    fontSize: '22px',
    fontWeight: '700',
    letterSpacing: '-0.3px',
  },
  modalOrderId: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.4)',
    marginTop: '4px',
    fontFamily: 'monospace',
  },
  closeButton: {
    background: 'rgba(255,255,255,0.05)',
    border: 'none',
    borderRadius: '10px',
    padding: '8px',
    cursor: 'pointer',
    color: 'rgba(255,255,255,0.6)',
    transition: 'all 0.2s',
  },
  modalBody: {
    padding: '24px 28px 28px',
  },
  modalSection: {
    marginBottom: '28px',
  },
  modalSectionTitle: {
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'rgba(255,255,255,0.4)',
    marginBottom: '16px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  infoItem: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '12px',
    padding: '14px 16px',
  },
  infoLabel: {
    display: 'block',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '6px',
  },
  infoValue: {
    fontSize: '14px',
    color: '#fff',
  },
  modalStatusBadge: {
    display: 'inline-block',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  statusActions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  statusActionButton: {
    padding: '10px 18px',
    borderRadius: '10px',
    border: '1px solid',
    fontSize: '13px',
    fontWeight: '500',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
