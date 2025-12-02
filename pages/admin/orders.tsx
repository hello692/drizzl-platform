import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '../../hooks/useRole';
import { getOrders, updateOrderStatus } from '../../lib/db';

export default function AdminOrders() {
  const { loading, authorized } = useRequireAdmin();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [filter, setFilter] = useState<'all' | 'd2c' | 'b2b'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (authorized) {
      loadOrders();
    }
  }, [authorized, filter, statusFilter]);

  async function loadOrders() {
    setLoadingOrders(true);
    try {
      const filters: any = {};
      if (filter !== 'all') filters.orderType = filter;
      if (statusFilter !== 'all') filters.status = statusFilter;
      
      const data = await getOrders(filters);
      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  }

  async function handleStatusChange(orderId: string, newStatus: string) {
    try {
      await updateOrderStatus(orderId, newStatus as any);
      loadOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Error updating order status');
    }
  }

  if (loading || !authorized) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}><p>Loading...</p></div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <nav style={{ background: '#000', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', fontWeight: '700' }}>DRIZZL ADMIN</Link>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/admin/products" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Products</Link>
          <Link href="/admin/orders" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}>Orders</Link>
          <Link href="/admin/partners" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Partners</Link>
          <Link href="/admin/analytics" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Analytics</Link>
          <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.6 }}>Exit</Link>
        </div>
      </nav>

      <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>Orders</h1>
            <p style={{ color: '#666', fontSize: '14px' }}>{orders.length} orders</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <select value={filter} onChange={(e) => setFilter(e.target.value as any)} style={{ padding: '10px 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', background: '#fff' }}>
              <option value="all">All Types</option>
              <option value="d2c">D2C</option>
              <option value="b2b">B2B</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '10px 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', background: '#fff' }}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #eee' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>Order ID</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>Customer</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>Type</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>Total</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>Status</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#666' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {loadingOrders ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading...</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No orders yet</td></tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '16px' }}>
                      <p style={{ fontWeight: '600', fontSize: '14px', fontFamily: 'monospace' }}>{order.id.slice(0, 8)}...</p>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <p style={{ fontSize: '14px' }}>{order.profiles?.email || 'Guest'}</p>
                      <p style={{ fontSize: '12px', color: '#666' }}>{order.profiles?.name || ''}</p>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', background: order.order_type === 'b2b' ? '#e3f2fd' : '#f5f5f5', color: order.order_type === 'b2b' ? '#1565c0' : '#666' }}>
                        {order.order_type.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontSize: '14px', fontWeight: '600' }}>${(order.total_cents / 100).toFixed(2)}</td>
                    <td style={{ padding: '16px' }}>
                      <select 
                        value={order.status} 
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        style={{ padding: '6px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', background: getStatusColor(order.status).bg, color: getStatusColor(order.status).text }}
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ padding: '16px', fontSize: '13px', color: '#666' }}>
                      {new Date(order.created_at).toLocaleDateString()}
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

function getStatusColor(status: string) {
  switch (status) {
    case 'paid': return { bg: '#e6f4ea', text: '#1e7e34' };
    case 'shipped': return { bg: '#e3f2fd', text: '#1565c0' };
    case 'delivered': return { bg: '#e8f5e9', text: '#2e7d32' };
    case 'cancelled': return { bg: '#fce8e6', text: '#c53929' };
    default: return { bg: '#fff3e0', text: '#e65100' };
  }
}
