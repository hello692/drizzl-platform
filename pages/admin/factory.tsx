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

const gradients = {
  primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  success: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  warning: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  info: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  orange: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  cyan: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
};

function GradientIcon({ type, size = 20 }: { type: 'batch' | 'efficiency' | 'active' | 'qa' | 'shift' | 'alert'; size?: number }) {
  const iconPaths: Record<string, { path: string; gradient: string }> = {
    batch: {
      path: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
      gradient: gradients.info,
    },
    efficiency: {
      path: 'M13 10V3L4 14h7v7l9-11h-7z',
      gradient: gradients.warning,
    },
    active: {
      path: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
      gradient: gradients.success,
    },
    qa: {
      path: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      gradient: gradients.orange,
    },
    shift: {
      path: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      gradient: gradients.primary,
    },
    alert: {
      path: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      gradient: gradients.warning,
    },
  };

  const icon = iconPaths[type];
  const gradientId = `gradient-${type}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={icon.gradient.includes('#667eea') ? '#667eea' : icon.gradient.includes('#43e97b') ? '#43e97b' : icon.gradient.includes('#f093fb') ? '#f093fb' : icon.gradient.includes('#4facfe') ? '#4facfe' : '#fa709a'} />
          <stop offset="100%" stopColor={icon.gradient.includes('#764ba2') ? '#764ba2' : icon.gradient.includes('#38f9d7') ? '#38f9d7' : icon.gradient.includes('#f5576c') ? '#f5576c' : icon.gradient.includes('#00f2fe') ? '#00f2fe' : '#fee140'} />
        </linearGradient>
      </defs>
      <path d={icon.path} stroke={`url(#${gradientId})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
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
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
    const badgeStyles: Record<string, { bg: string; glow: string }> = {
      scheduled: { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', glow: 'rgba(79, 172, 254, 0.4)' },
      in_progress: { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', glow: 'rgba(240, 147, 251, 0.4)' },
      completed: { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', glow: 'rgba(67, 233, 123, 0.4)' },
      qa_hold: { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', glow: 'rgba(250, 112, 154, 0.4)' },
    };
    const labels: Record<string, string> = {
      scheduled: 'Scheduled',
      in_progress: 'In Progress',
      completed: 'Completed',
      qa_hold: 'QA Hold',
    };
    const style = badgeStyles[status];
    return (
      <span style={{
        background: style.bg,
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '11px',
        fontWeight: '600',
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        boxShadow: `0 0 20px ${style.glow}`,
      }}>
        {labels[status]}
      </span>
    );
  }

  function getShiftStatusBadge(status: ShiftData['status']) {
    const badgeStyles: Record<string, { bg: string; glow: string }> = {
      active: { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', glow: 'rgba(67, 233, 123, 0.4)' },
      upcoming: { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', glow: 'rgba(79, 172, 254, 0.4)' },
      completed: { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', glow: 'rgba(102, 126, 234, 0.3)' },
    };
    const labels: Record<string, string> = {
      active: 'Active',
      upcoming: 'Upcoming',
      completed: 'Completed',
    };
    const style = badgeStyles[status];
    return (
      <span style={{
        background: style.bg,
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '11px',
        fontWeight: '600',
        color: '#fff',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        boxShadow: `0 0 15px ${style.glow}`,
      }}>
        {labels[status]}
      </span>
    );
  }

  function getUrgencyGradient(urgency: RestockAlert['urgency']) {
    const styles: Record<string, { bg: string; border: string; glow: string }> = {
      critical: {
        bg: 'rgba(250, 112, 154, 0.1)',
        border: 'rgba(250, 112, 154, 0.3)',
        glow: 'rgba(250, 112, 154, 0.2)',
      },
      warning: {
        bg: 'rgba(240, 147, 251, 0.1)',
        border: 'rgba(240, 147, 251, 0.3)',
        glow: 'rgba(240, 147, 251, 0.2)',
      },
      info: {
        bg: 'rgba(79, 172, 254, 0.1)',
        border: 'rgba(79, 172, 254, 0.3)',
        glow: 'rgba(79, 172, 254, 0.2)',
      },
    };
    return styles[urgency];
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingOrb} />
        <p style={styles.loadingText}>Initializing Factory Systems</p>
        <style jsx global>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(250, 112, 154, 0.3); }
            50% { box-shadow: 0 0 40px rgba(254, 225, 64, 0.6); }
          }
        `}</style>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingOrb} />
        <p style={styles.loadingText}>Authenticating</p>
        <style jsx global>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.05); }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(250, 112, 154, 0.3); }
            50% { box-shadow: 0 0 40px rgba(254, 225, 64, 0.6); }
          }
        `}</style>
      </div>
    );
  }

  const activeBatches = batches.filter(b => b.status === 'in_progress');

  return (
    <div style={styles.container}>
      <div style={styles.meshGradient} />
      <div style={styles.orbOne} />
      <div style={styles.orbTwo} />
      <div style={styles.orbThree} />

      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <Link href="/admin" style={styles.logo}>
            <span style={styles.logoIcon}>D</span>
            <span style={styles.logoText}>DRIZZL</span>
          </Link>
        </div>
        <div style={styles.navLinks}>
          <Link href="/admin/command-center" style={styles.navLink}>Command Center</Link>
          <Link href="/admin/inventory" style={styles.navLink}>Inventory</Link>
          <Link href="/admin/factory" style={styles.navLinkActive}>Factory</Link>
          <Link href="/admin/products" style={styles.navLink}>Products</Link>
          <Link href="/admin/orders" style={styles.navLink}>Orders</Link>
          <Link href="/admin/partners" style={styles.navLink}>Partners</Link>
          <Link href="/admin/banking" style={styles.navLink}>Banking</Link>
          <Link href="/" style={styles.exitLink}>Exit</Link>
        </div>
      </nav>

      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <p style={styles.greeting}>Production Control</p>
            <h1 style={styles.title}>Factory Intelligence</h1>
          </div>
          <div style={styles.timeDisplay}>
            <span style={styles.timeText}>{time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            <span style={styles.dateText}>{time.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
          </div>
        </header>

        {loadingData ? (
          <div style={styles.loadingContent}>
            <div style={styles.loadingPulse} />
            <p style={styles.loadingContentText}>Loading factory data...</p>
          </div>
        ) : (
          <>
            <div style={styles.metricsGrid}>
              <MetricCard
                title="Today's Batches"
                value={metrics?.totalBatchesToday || 0}
                subtitle={`${metrics?.completedBatches || 0} completed`}
                iconType="batch"
                gradient={gradients.info}
              />
              <MetricCard
                title="Production Efficiency"
                value={`${metrics?.efficiency || 0}%`}
                subtitle={`${metrics?.actualUnits || 0} / ${metrics?.goalUnits || 0} units`}
                iconType="efficiency"
                gradient={metrics && metrics.efficiency >= 90 ? gradients.success : metrics && metrics.efficiency >= 70 ? gradients.warning : gradients.orange}
              />
              <MetricCard
                title="Active Batches"
                value={metrics?.inProgressBatches || 0}
                subtitle="Currently running"
                iconType="active"
                gradient={gradients.success}
              />
              <MetricCard
                title="QA Hold"
                value={metrics?.qaHoldBatches || 0}
                subtitle="Awaiting review"
                iconType="qa"
                gradient={metrics && metrics.qaHoldBatches > 0 ? gradients.orange : gradients.primary}
              />
            </div>

            <div style={styles.gridTwoOne}>
              <GlassCard title="Production Goals vs Actual">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {productionGoals.map((goal, index) => {
                    const percentage = Math.min((goal.actual / goal.goal) * 100, 100);
                    const gradient = percentage >= 100 ? gradients.success : percentage >= 80 ? gradients.warning : gradients.orange;
                    return (
                      <div key={index}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '500', color: '#fff' }}>{goal.product}</span>
                          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{goal.actual} / {goal.goal}</span>
                        </div>
                        <div style={styles.progressTrack}>
                          <div
                            style={{
                              width: `${percentage}%`,
                              height: '100%',
                              background: gradient,
                              borderRadius: '6px',
                              transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                              boxShadow: `0 0 20px ${gradient.includes('#43e97b') ? 'rgba(67, 233, 123, 0.4)' : gradient.includes('#f093fb') ? 'rgba(240, 147, 251, 0.4)' : 'rgba(250, 112, 154, 0.4)'}`,
                            }}
                          />
                        </div>
                        <div style={{ textAlign: 'right', marginTop: '6px' }}>
                          <span style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            background: gradient,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                          }}>
                            {percentage.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>

              <GlassCard title="Predictive Restocking" icon={<GradientIcon type="alert" size={18} />}>
                {restockAlerts.length === 0 ? (
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>All ingredients well stocked</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {restockAlerts.map((alert, index) => {
                      const urgencyStyle = getUrgencyGradient(alert.urgency);
                      return (
                        <div
                          key={index}
                          style={{
                            padding: '14px 16px',
                            borderRadius: '12px',
                            background: urgencyStyle.bg,
                            border: `1px solid ${urgencyStyle.border}`,
                            boxShadow: `0 4px 20px ${urgencyStyle.glow}`,
                            backdropFilter: 'blur(10px)',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#fff' }}>{alert.ingredient}</span>
                            <span style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              background: alert.urgency === 'critical' ? gradients.orange : alert.urgency === 'warning' ? gradients.warning : gradients.info,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}>
                              {alert.daysLeft === 0 ? 'Restock NOW' : `${alert.daysLeft} days left`}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </GlassCard>
            </div>

            <div style={styles.gridTwoOne}>
              <GlassCard title="Active Batches">
                {activeBatches.length === 0 ? (
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>No active batches</p>
                ) : (
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.tableHeader}>Batch #</th>
                        <th style={styles.tableHeader}>Product</th>
                        <th style={styles.tableHeader}>Progress</th>
                        <th style={styles.tableHeader}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeBatches.map((batch) => {
                        const progress = Math.round((batch.actualQuantity / batch.targetQuantity) * 100);
                        return (
                          <tr key={batch.id} style={styles.tableRow}>
                            <td style={styles.tableCell}>
                              <span style={styles.monoText}>{batch.batchNumber}</span>
                            </td>
                            <td style={styles.tableCellBold}>{batch.productName}</td>
                            <td style={styles.tableCell}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={styles.progressMini}>
                                  <div style={{
                                    width: `${progress}%`,
                                    height: '100%',
                                    background: gradients.info,
                                    borderRadius: '4px',
                                    boxShadow: '0 0 10px rgba(79, 172, 254, 0.5)',
                                  }} />
                                </div>
                                <span style={styles.progressLabel}>{progress}%</span>
                              </div>
                            </td>
                            <td style={styles.tableCell}>{getBatchStatusBadge(batch.status)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </GlassCard>

              <GlassCard title="Shift Tracking" icon={<GradientIcon type="shift" size={18} />}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {shifts.map((shift, index) => (
                    <div
                      key={index}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        background: shift.status === 'active' ? 'rgba(67, 233, 123, 0.1)' : 'rgba(255,255,255,0.03)',
                        border: shift.status === 'active' ? '1px solid rgba(67, 233, 123, 0.3)' : '1px solid rgba(255,255,255,0.06)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: shift.status === 'active' ? '0 4px 20px rgba(67, 233, 123, 0.15)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{shift.name}</span>
                        {getShiftStatusBadge(shift.status)}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
                        <span>{shift.startTime} - {shift.endTime}</span>
                        <span>{shift.workers} workers</span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            <div style={styles.gridHalf}>
              <GlassCard title="Ingredient Burn Rate">
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.tableHeader}>Ingredient</th>
                      <th style={{ ...styles.tableHeader, textAlign: 'right' }}>Daily</th>
                      <th style={{ ...styles.tableHeader, textAlign: 'right' }}>Weekly</th>
                      <th style={{ ...styles.tableHeader, textAlign: 'right' }}>Days Left</th>
                    </tr>
                  </thead>
                  <tbody>
                    {burnRates.map((rate) => {
                      const daysColor = rate.daysUntilRestock <= 3 ? gradients.orange : rate.daysUntilRestock <= 7 ? gradients.warning : gradients.success;
                      return (
                        <tr key={rate.ingredientId} style={styles.tableRow}>
                          <td style={styles.tableCellBold}>{rate.ingredientName}</td>
                          <td style={{ ...styles.tableCell, textAlign: 'right' }}>{rate.dailyUsage} kg</td>
                          <td style={{ ...styles.tableCell, textAlign: 'right' }}>{rate.weeklyUsage} kg</td>
                          <td style={{ ...styles.tableCell, textAlign: 'right' }}>
                            <span style={{
                              fontSize: '13px',
                              fontWeight: '600',
                              background: daysColor,
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                            }}>
                              {rate.daysUntilRestock} days
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </GlassCard>

              <GlassCard title="Recent Batch History">
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.tableHeader}>Batch</th>
                      <th style={styles.tableHeader}>Product</th>
                      <th style={styles.tableHeader}>Qty</th>
                      <th style={styles.tableHeader}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBatches.map((batch) => (
                      <tr key={batch.id} style={styles.tableRow}>
                        <td style={styles.tableCell}>
                          <span style={styles.monoText}>{batch.batchNumber}</span>
                        </td>
                        <td style={styles.tableCell}>{batch.productName}</td>
                        <td style={styles.tableCell}>{batch.actualQuantity}</td>
                        <td style={styles.tableCell}>{getBatchStatusBadge(batch.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </GlassCard>
            </div>
          </>
        )}
      </main>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(250, 112, 154, 0.3); }
          50% { box-shadow: 0 0 40px rgba(254, 225, 64, 0.6); }
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

function MetricCard({
  title,
  value,
  subtitle,
  iconType,
  gradient,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  iconType: 'batch' | 'efficiency' | 'active' | 'qa';
  gradient: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.metricCard,
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 40px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.metricGradientOverlay} />
      <div style={{ ...styles.metricAccent, background: gradient }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', position: 'relative' }}>
        <span style={styles.metricLabel}>{title}</span>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
        }}>
          <GradientIcon type={iconType} size={22} />
        </div>
      </div>
      <p style={{
        ...styles.metricValue,
        background: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        {value}
      </p>
      <p style={styles.metricSubtitle}>{subtitle}</p>
    </div>
  );
}

function GlassCard({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div style={styles.glassCard}>
      <div style={styles.glassCardHeader}>
        <h2 style={styles.glassCardTitle}>{title}</h2>
        {icon && <div style={styles.glassCardIcon}>{icon}</div>}
      </div>
      {children}
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
    background: 'radial-gradient(ellipse at 20% 20%, rgba(250, 112, 154, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(254, 225, 64, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(67, 233, 123, 0.04) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  orbOne: {
    position: 'fixed',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(250, 112, 154, 0.12) 0%, transparent 70%)',
    top: '-200px',
    right: '-200px',
    animation: 'float 20s ease-in-out infinite',
    pointerEvents: 'none',
  },
  orbTwo: {
    position: 'fixed',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(254, 225, 64, 0.1) 0%, transparent 70%)',
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
    background: 'radial-gradient(circle, rgba(67, 233, 123, 0.08) 0%, transparent 70%)',
    top: '50%',
    left: '30%',
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
    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    animation: 'pulse 2s ease-in-out infinite, glow 2s ease-in-out infinite',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
  },
  loadingContent: {
    padding: '100px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  loadingPulse: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  loadingContentText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
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
    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
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
    gap: '32px',
    alignItems: 'center',
  },
  navLink: {
    color: 'rgba(255,255,255,0.6)',
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
    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
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
    maxWidth: '1400px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '48px',
  },
  greeting: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '8px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: '42px',
    fontWeight: '700',
    letterSpacing: '-1px',
    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  timeDisplay: {
    textAlign: 'right' as const,
  },
  timeText: {
    display: 'block',
    fontSize: '28px',
    fontWeight: '300',
    letterSpacing: '-0.5px',
    color: 'rgba(255,255,255,0.9)',
  },
  dateText: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.4)',
    letterSpacing: '0.5px',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '32px',
  },
  metricCard: {
    position: 'relative',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid rgba(255,255,255,0.06)',
    overflow: 'hidden',
    backdropFilter: 'blur(20px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'default',
  },
  metricGradientOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.03) 0%, transparent 50%)',
    pointerEvents: 'none',
  },
  metricAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '3px',
    height: '100%',
  },
  metricLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: '36px',
    fontWeight: '700',
    letterSpacing: '-1px',
    marginBottom: '6px',
  },
  metricSubtitle: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.4)',
  },
  gridTwoOne: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
    marginBottom: '32px',
  },
  gridHalf: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  glassCard: {
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '20px',
    padding: '28px',
    border: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(20px)',
  },
  glassCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  glassCardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    letterSpacing: '-0.3px',
    color: '#fff',
  },
  glassCardIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    height: '10px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  progressMini: {
    width: '100px',
    height: '6px',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    padding: '12px 0',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  tableRow: {
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  tableCell: {
    padding: '16px 0',
    fontSize: '14px',
    color: 'rgba(255,255,255,0.6)',
  },
  tableCellBold: {
    padding: '16px 0',
    fontSize: '14px',
    fontWeight: '500',
    color: '#fff',
  },
  monoText: {
    fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.6)',
    background: 'rgba(255,255,255,0.05)',
    padding: '4px 8px',
    borderRadius: '6px',
  },
};
