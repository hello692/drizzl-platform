import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '../../hooks/useRole';
import type {
  ProductionBatch,
  BurnRateData,
  ProductionMetrics,
} from '../../lib/inventoryService';

interface ShiftData {
  name: string;
  status: 'active' | 'upcoming' | 'completed';
  workers: number;
  startTime: string;
  endTime: string;
}

interface ProductionGoal {
  product: string;
  goal: number;
  actual: number;
}

interface RestockAlert {
  ingredient: string;
  daysLeft: number;
  urgency: 'critical' | 'warning' | 'info';
}

export default function FactoryDashboard() {
  const { loading, authorized } = useRequireAdmin();
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [burnRates, setBurnRates] = useState<BurnRateData[]>([]);
  const [metrics, setMetrics] = useState<ProductionMetrics | null>(null);
  const [restockAlerts, setRestockAlerts] = useState<RestockAlert[]>([]);
  const [recentBatches, setRecentBatches] = useState<ProductionBatch[]>([]);
  const [productionGoals, setProductionGoals] = useState<ProductionGoal[]>([]);
  const [shifts, setShifts] = useState<ShiftData[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (authorized) {
      loadFactoryData();
    }
  }, [authorized]);

  async function loadFactoryData() {
    try {
      const response = await fetch('/api/admin/factory');
      const data = await response.json();
      if (data.success) {
        setBatches(data.data.batches);
        setBurnRates(data.data.burnRates);
        setMetrics(data.data.metrics);
        setRestockAlerts(data.data.restockAlerts);
        setRecentBatches(data.data.recentBatches);
        setProductionGoals(data.data.productionGoals);
        setShifts(data.data.shifts);
      }
    } catch (error) {
      console.error('Error loading factory data:', error);
    } finally {
      setLoadingData(false);
    }
  }

  function getBatchStatusBadge(status: ProductionBatch['status']) {
    const styles: Record<string, React.CSSProperties> = {
      scheduled: { background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500' },
      in_progress: { background: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500' },
      completed: { background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500' },
      qa_hold: { background: '#fee2e2', color: '#991b1b', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500' },
    };
    const labels: Record<string, string> = {
      scheduled: 'Scheduled',
      in_progress: 'In Progress',
      completed: 'Completed',
      qa_hold: 'QA Hold',
    };
    return <span style={styles[status]}>{labels[status]}</span>;
  }

  function getShiftStatusBadge(status: ShiftData['status']) {
    const styles: Record<string, React.CSSProperties> = {
      active: { background: '#dcfce7', color: '#166534', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500' },
      upcoming: { background: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500' },
      completed: { background: '#f3f4f6', color: '#6b7280', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500' },
    };
    const labels: Record<string, string> = {
      active: 'Active',
      upcoming: 'Upcoming',
      completed: 'Completed',
    };
    return <span style={styles[status]}>{labels[status]}</span>;
  }

  function getUrgencyStyle(urgency: RestockAlert['urgency']) {
    const styles: Record<string, React.CSSProperties> = {
      critical: { background: '#fef2f2', borderColor: '#fecaca', color: '#991b1b' },
      warning: { background: '#fffbeb', borderColor: '#fde68a', color: '#92400e' },
      info: { background: '#eff6ff', borderColor: '#bfdbfe', color: '#1e40af' },
    };
    return styles[urgency];
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

  const activeBatches = batches.filter(b => b.status === 'in_progress');

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <nav style={{ background: '#000', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', fontWeight: '700', letterSpacing: '-0.5px' }}>
          DRIZZL ADMIN
        </Link>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link href="/admin/command-center" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Command Center</Link>
          <Link href="/admin/inventory" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Inventory</Link>
          <Link href="/admin/factory" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 1, fontWeight: '600' }}>Factory</Link>
          <Link href="/admin/products" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Products</Link>
          <Link href="/admin/orders" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Orders</Link>
          <Link href="/admin/partners" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Partners</Link>
          <Link href="/admin/banking" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Banking</Link>
          <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.6 }}>Exit</Link>
        </div>
      </nav>

      <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.5px', color: '#111' }}>Factory Intelligence</h1>
          <p style={{ color: '#666', fontSize: '14px' }}>Production monitoring and manufacturing insights</p>
        </div>

        {loadingData ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#666' }}>Loading factory data...</div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
              <MetricCard
                title="Today's Batches"
                value={metrics?.totalBatchesToday || 0}
                subtitle={`${metrics?.completedBatches || 0} completed`}
                icon="📦"
              />
              <MetricCard
                title="Production Efficiency"
                value={`${metrics?.efficiency || 0}%`}
                subtitle={`${metrics?.actualUnits || 0} / ${metrics?.goalUnits || 0} units`}
                icon="⚡"
                valueColor={metrics && metrics.efficiency >= 90 ? '#16a34a' : metrics && metrics.efficiency >= 70 ? '#ca8a04' : '#dc2626'}
              />
              <MetricCard
                title="Active Batches"
                value={metrics?.inProgressBatches || 0}
                subtitle="Currently running"
                icon="🔄"
              />
              <MetricCard
                title="QA Hold"
                value={metrics?.qaHoldBatches || 0}
                subtitle="Awaiting review"
                icon="⏸️"
                valueColor={metrics && metrics.qaHoldBatches > 0 ? '#dc2626' : undefined}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', letterSpacing: '-0.3px' }}>Production Goals vs Actual</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {productionGoals.map((goal, index) => {
                    const percentage = Math.min((goal.actual / goal.goal) * 100, 100);
                    const color = percentage >= 100 ? '#22c55e' : percentage >= 80 ? '#eab308' : '#ef4444';
                    return (
                      <div key={index}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '500', color: '#111' }}>{goal.product}</span>
                          <span style={{ fontSize: '13px', color: '#666' }}>{goal.actual} / {goal.goal}</span>
                        </div>
                        <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                          <div
                            style={{
                              width: `${percentage}%`,
                              height: '100%',
                              background: color,
                              borderRadius: '4px',
                              transition: 'width 0.5s ease',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', letterSpacing: '-0.3px' }}>Predictive Restocking</h2>
                {restockAlerts.length === 0 ? (
                  <p style={{ color: '#666', fontSize: '14px' }}>All ingredients well stocked</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {restockAlerts.map((alert, index) => {
                      const urgencyStyle = getUrgencyStyle(alert.urgency);
                      return (
                        <div
                          key={index}
                          style={{
                            padding: '12px 14px',
                            borderRadius: '8px',
                            border: '1px solid',
                            ...urgencyStyle,
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '14px', fontWeight: '500' }}>{alert.ingredient}</span>
                            <span style={{ fontSize: '12px', fontWeight: '600' }}>
                              {alert.daysLeft === 0 ? 'Restock NOW' : `${alert.daysLeft} days left`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', letterSpacing: '-0.3px' }}>Active Batches</h2>
                {activeBatches.length === 0 ? (
                  <p style={{ color: '#666', fontSize: '14px' }}>No active batches</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <th style={{ padding: '10px 0', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Batch #</th>
                        <th style={{ padding: '10px 0', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Product</th>
                        <th style={{ padding: '10px 0', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Progress</th>
                        <th style={{ padding: '10px 0', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeBatches.map((batch) => {
                        const progress = Math.round((batch.actualQuantity / batch.targetQuantity) * 100);
                        return (
                          <tr key={batch.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                            <td style={{ padding: '12px 0', fontSize: '13px', fontFamily: 'monospace' }}>{batch.batchNumber}</td>
                            <td style={{ padding: '12px 0', fontSize: '14px', fontWeight: '500' }}>{batch.productName}</td>
                            <td style={{ padding: '12px 0' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '80px', height: '6px', background: '#e5e7eb', borderRadius: '3px', overflow: 'hidden' }}>
                                  <div style={{ width: `${progress}%`, height: '100%', background: '#3b82f6', borderRadius: '3px' }} />
                                </div>
                                <span style={{ fontSize: '12px', color: '#666' }}>{progress}%</span>
                              </div>
                            </td>
                            <td style={{ padding: '12px 0' }}>{getBatchStatusBadge(batch.status)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', letterSpacing: '-0.3px' }}>Shift Tracking</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {shifts.map((shift, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '14px',
                        borderRadius: '8px',
                        background: shift.status === 'active' ? '#f0fdf4' : '#f9fafb',
                        border: shift.status === 'active' ? '1px solid #bbf7d0' : '1px solid #e5e7eb',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>{shift.name}</span>
                        {getShiftStatusBadge(shift.status)}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666' }}>
                        <span>{shift.startTime} - {shift.endTime}</span>
                        <span>{shift.workers} workers</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', letterSpacing: '-0.3px' }}>Ingredient Burn Rate</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <th style={{ padding: '10px 0', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Ingredient</th>
                      <th style={{ padding: '10px 0', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Daily</th>
                      <th style={{ padding: '10px 0', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Weekly</th>
                      <th style={{ padding: '10px 0', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Days Left</th>
                    </tr>
                  </thead>
                  <tbody>
                    {burnRates.map((rate) => (
                      <tr key={rate.ingredientId} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '12px 0', fontSize: '14px', fontWeight: '500' }}>{rate.ingredientName}</td>
                        <td style={{ padding: '12px 0', fontSize: '14px', color: '#666', textAlign: 'right' }}>{rate.dailyUsage} kg</td>
                        <td style={{ padding: '12px 0', fontSize: '14px', color: '#666', textAlign: 'right' }}>{rate.weeklyUsage} kg</td>
                        <td style={{ padding: '12px 0', textAlign: 'right' }}>
                          <span
                            style={{
                              fontSize: '13px',
                              fontWeight: '600',
                              color: rate.daysUntilRestock <= 3 ? '#dc2626' : rate.daysUntilRestock <= 7 ? '#ca8a04' : '#16a34a',
                            }}
                          >
                            {rate.daysUntilRestock} days
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', letterSpacing: '-0.3px' }}>Recent Batch History</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <th style={{ padding: '10px 0', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Batch</th>
                      <th style={{ padding: '10px 0', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Product</th>
                      <th style={{ padding: '10px 0', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Qty</th>
                      <th style={{ padding: '10px 0', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBatches.map((batch) => (
                      <tr key={batch.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '12px 0', fontSize: '13px', fontFamily: 'monospace' }}>{batch.batchNumber}</td>
                        <td style={{ padding: '12px 0', fontSize: '14px', color: '#666' }}>{batch.productName}</td>
                        <td style={{ padding: '12px 0', fontSize: '14px', color: '#666' }}>{batch.actualQuantity}</td>
                        <td style={{ padding: '12px 0' }}>{getBatchStatusBadge(batch.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon,
  valueColor,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  valueColor?: string;
}) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '500' }}>{title}</span>
        <span style={{ fontSize: '24px' }}>{icon}</span>
      </div>
      <p style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-1px', color: valueColor || '#111', marginBottom: '4px' }}>{value}</p>
      <p style={{ fontSize: '13px', color: '#666' }}>{subtitle}</p>
    </div>
  );
}
