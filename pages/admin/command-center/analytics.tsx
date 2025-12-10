import React from 'react';
import CommandCenterLayout from '../../../components/admin/CommandCenterLayout';
import { BarChart3, TrendingUp, Users, Target } from 'lucide-react';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255,255,255,0.03)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

export default function AnalyticsPage() {
  return (
    <CommandCenterLayout title="Analytics">
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.iconWrapper}>
            <BarChart3 size={24} color={NEON_GREEN} />
          </div>
          <div>
            <h1 style={styles.title}>Analytics</h1>
            <p style={styles.subtitle}>Business intelligence and performance metrics</p>
          </div>
        </header>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <TrendingUp size={20} color={NEON_GREEN} />
            <span style={styles.statLabel}>Growth Rate</span>
            <span style={styles.statValue}>+23%</span>
          </div>
          <div style={styles.statCard}>
            <Users size={20} color={NEON_GREEN} />
            <span style={styles.statLabel}>Total Customers</span>
            <span style={styles.statValue}>2,847</span>
          </div>
          <div style={styles.statCard}>
            <Target size={20} color={NEON_GREEN} />
            <span style={styles.statLabel}>Conversion Rate</span>
            <span style={styles.statValue}>3.8%</span>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.comingSoon}>
            <span style={styles.comingSoonEmoji}>📊</span>
            <h2 style={styles.comingSoonTitle}>Full Analytics Module Coming Soon</h2>
            <p style={styles.comingSoonText}>
              Content from existing analytics tabs will be integrated here.
              Features include sales analytics, customer insights, product performance,
              and customizable dashboards.
            </p>
          </div>
        </div>
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
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    borderRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: '#FFFFFF',
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    margin: '4px 0 0 0',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: 20,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
  },
  statLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 700,
    color: '#FFFFFF',
  },
  card: {
    padding: 48,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
  },
  comingSoon: {
    textAlign: 'center',
    maxWidth: 500,
    margin: '0 auto',
  },
  comingSoonEmoji: {
    fontSize: 48,
    marginBottom: 16,
    display: 'block',
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 12px 0',
  },
  comingSoonText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 1.6,
    margin: 0,
  },
};
