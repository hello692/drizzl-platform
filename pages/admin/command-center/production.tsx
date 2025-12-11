import React from 'react';
import CommandCenterLayout from '../../../components/admin/CommandCenterLayout';
import {
  Factory,
  Activity,
  Gauge,
  Package,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  Wrench,
  Users,
  TrendingUp,
  FileText,
  Download,
  Cog,
  ThermometerSun,
  Droplets,
  Wind,
  XCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255,255,255,0.03)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

interface ProductionLine {
  id: string;
  name: string;
  product: string;
  status: 'running' | 'paused' | 'maintenance';
  progress: number;
  batchNumber: string;
  estimatedCompletion: string;
}

interface ScheduledBatch {
  id: string;
  batchNumber: string;
  product: string;
  quantity: number;
  line: string;
  startTime: string;
  status: 'completed' | 'in-progress' | 'scheduled';
}

interface QCTest {
  id: string;
  batchNumber: string;
  testType: string;
  result: 'pass' | 'fail';
  timestamp: string;
  inspector: string;
}

interface Equipment {
  id: string;
  name: string;
  status: 'operational' | 'warning' | 'maintenance';
  uptime: number;
  lastMaintenance: string;
  nextScheduled: string;
}

interface Shift {
  name: string;
  time: string;
  workers: number;
  units: number;
}

const productionLines: ProductionLine[] = [
  { id: '1', name: 'Line A', product: 'Strawberry Peach Smoothie', status: 'running', progress: 72, batchNumber: '#2847', estimatedCompletion: '2:45 PM' },
  { id: '2', name: 'Line B', product: 'Mango Jackfruit Blend', status: 'running', progress: 45, batchNumber: '#2848', estimatedCompletion: '4:30 PM' },
  { id: '3', name: 'Line C', product: 'Açaí Berry Bowl Mix', status: 'paused', progress: 89, batchNumber: '#2849', estimatedCompletion: '1:15 PM' },
  { id: '4', name: 'Line D', product: 'Coffee Mushroom Blend', status: 'maintenance', progress: 0, batchNumber: '#2850', estimatedCompletion: 'Pending' },
];

const scheduledBatches: ScheduledBatch[] = [
  { id: '1', batchNumber: '#2847', product: 'Strawberry Peach Smoothie', quantity: 4000, line: 'A', startTime: '6:00 AM', status: 'in-progress' },
  { id: '2', batchNumber: '#2848', product: 'Mango Jackfruit Blend', quantity: 4000, line: 'B', startTime: '7:30 AM', status: 'in-progress' },
  { id: '3', batchNumber: '#2849', product: 'Açaí Berry Bowl Mix', quantity: 4000, line: 'C', startTime: '6:30 AM', status: 'in-progress' },
  { id: '4', batchNumber: '#2850', product: 'Coffee Mushroom Blend', quantity: 3500, line: 'D', startTime: '3:00 PM', status: 'scheduled' },
  { id: '5', batchNumber: '#2851', product: 'Chocolate Berry Fusion', quantity: 3000, line: 'A', startTime: '4:00 PM', status: 'scheduled' },
  { id: '6', batchNumber: '#2852', product: 'Almond Vanilla Dream', quantity: 2500, line: 'B', startTime: '5:30 PM', status: 'scheduled' },
  { id: '7', batchNumber: '#2845', product: 'Matcha Green Energy', quantity: 3500, line: 'C', startTime: '5:00 AM', status: 'completed' },
  { id: '8', batchNumber: '#2846', product: 'Nutty Monkey Protein', quantity: 3000, line: 'A', startTime: '4:30 AM', status: 'completed' },
  { id: '9', batchNumber: '#2844', product: 'Pink Piyata Blend', quantity: 2800, line: 'B', startTime: '3:00 AM', status: 'completed' },
  { id: '10', batchNumber: '#2843', product: 'Mocha Protein Shake', quantity: 3200, line: 'D', startTime: '2:00 AM', status: 'completed' },
];

const qcTests: QCTest[] = [
  { id: '1', batchNumber: '#2847', testType: 'Viscosity Test', result: 'pass', timestamp: '11:45 AM', inspector: 'Sarah M.' },
  { id: '2', batchNumber: '#2847', testType: 'pH Level Check', result: 'pass', timestamp: '11:30 AM', inspector: 'Mike R.' },
  { id: '3', batchNumber: '#2848', testType: 'Microbiological', result: 'pass', timestamp: '11:15 AM', inspector: 'Lisa K.' },
  { id: '4', batchNumber: '#2849', testType: 'Color Consistency', result: 'fail', timestamp: '10:45 AM', inspector: 'James T.' },
  { id: '5', batchNumber: '#2848', testType: 'Sugar Content', result: 'pass', timestamp: '10:30 AM', inspector: 'Sarah M.' },
  { id: '6', batchNumber: '#2845', testType: 'Final Inspection', result: 'pass', timestamp: '9:00 AM', inspector: 'Mike R.' },
  { id: '7', batchNumber: '#2846', testType: 'Texture Analysis', result: 'pass', timestamp: '8:45 AM', inspector: 'Lisa K.' },
  { id: '8', batchNumber: '#2844', testType: 'Weight Check', result: 'pass', timestamp: '8:30 AM', inspector: 'James T.' },
  { id: '9', batchNumber: '#2843', testType: 'Seal Integrity', result: 'fail', timestamp: '8:00 AM', inspector: 'Sarah M.' },
  { id: '10', batchNumber: '#2843', testType: 'Visual Inspection', result: 'pass', timestamp: '7:45 AM', inspector: 'Mike R.' },
];

const defectRateData = [
  { day: 'Dec 4', rate: 2.1 },
  { day: 'Dec 5', rate: 1.8 },
  { day: 'Dec 6', rate: 2.4 },
  { day: 'Dec 7', rate: 1.5 },
  { day: 'Dec 8', rate: 1.9 },
  { day: 'Dec 9', rate: 1.6 },
  { day: 'Dec 10', rate: 1.8 },
];

const equipmentList: Equipment[] = [
  { id: '1', name: 'Blender Unit 1', status: 'operational', uptime: 98.5, lastMaintenance: 'Dec 1, 2025', nextScheduled: 'Jan 1, 2026' },
  { id: '2', name: 'Blender Unit 2', status: 'operational', uptime: 97.2, lastMaintenance: 'Nov 28, 2025', nextScheduled: 'Dec 28, 2025' },
  { id: '3', name: 'Blender Unit 3', status: 'warning', uptime: 94.8, lastMaintenance: 'Nov 15, 2025', nextScheduled: 'Dec 15, 2025' },
  { id: '4', name: 'Bottling Line 1', status: 'operational', uptime: 99.1, lastMaintenance: 'Dec 5, 2025', nextScheduled: 'Jan 5, 2026' },
  { id: '5', name: 'Bottling Line 2', status: 'maintenance', uptime: 0, lastMaintenance: 'Dec 10, 2025', nextScheduled: 'Dec 10, 2025' },
  { id: '6', name: 'Packaging Robot', status: 'operational', uptime: 96.3, lastMaintenance: 'Nov 20, 2025', nextScheduled: 'Dec 20, 2025' },
];

const shifts: Shift[] = [
  { name: 'Morning', time: '6am - 2pm', workers: 12, units: 4200 },
  { name: 'Afternoon', time: '2pm - 10pm', workers: 10, units: 4850 },
  { name: 'Night', time: '10pm - 6am', workers: 8, units: 3400 },
];

const quickActions = [
  { label: 'Start New Batch', icon: <Play size={16} />, primary: true },
  { label: 'Pause Line', icon: <Pause size={16} /> },
  { label: 'Schedule Maintenance', icon: <Wrench size={16} /> },
  { label: 'View Reports', icon: <FileText size={16} /> },
  { label: 'Export Data', icon: <Download size={16} /> },
];

function getStatusColor(status: string): string {
  switch (status) {
    case 'running':
    case 'operational':
    case 'pass':
    case 'completed':
      return NEON_GREEN;
    case 'paused':
    case 'warning':
    case 'in-progress':
      return '#FFB800';
    case 'maintenance':
    case 'fail':
      return '#FF6B6B';
    case 'scheduled':
      return '#60A5FA';
    default:
      return 'rgba(255,255,255,0.5)';
  }
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(0,0,0,0.9)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: '12px 16px',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 4 }}>{label}</p>
        <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: 0 }}>
          Defect Rate: <span style={{ color: NEON_GREEN }}>{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
}

export default function ProductionPage() {
  return (
    <CommandCenterLayout title="Production">
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.iconWrapper}>
            <Factory size={24} color={NEON_GREEN} />
          </div>
          <div>
            <h1 style={styles.title}>Production</h1>
            <p style={styles.subtitle}>Factory operations, batches, and quality control</p>
          </div>
        </header>

        <div style={styles.quickActionsBar}>
          {quickActions.map((action, index) => (
            <button
              key={index}
              style={{
                ...styles.quickActionBtn,
                ...(action.primary ? styles.quickActionBtnPrimary : {}),
              }}
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>

        <div style={styles.kpiGrid}>
          <div style={styles.kpiCard}>
            <div style={styles.kpiIcon}><Package size={20} color={NEON_GREEN} /></div>
            <div style={styles.kpiContent}>
              <span style={styles.kpiLabel}>Today's Output</span>
              <div style={styles.kpiValueRow}>
                <span style={styles.kpiValue}>12,450</span>
                <span style={styles.kpiUnit}>units</span>
                <span style={styles.kpiTrendUp}><TrendingUp size={14} /> +8%</span>
              </div>
            </div>
          </div>
          <div style={styles.kpiCard}>
            <div style={styles.kpiIcon}><Gauge size={20} color={NEON_GREEN} /></div>
            <div style={styles.kpiContent}>
              <span style={styles.kpiLabel}>Capacity Utilization</span>
              <div style={styles.kpiValueRow}>
                <span style={styles.kpiValue}>78%</span>
                <span style={styles.kpiTrendUp}><TrendingUp size={14} /> +3%</span>
              </div>
            </div>
          </div>
          <div style={styles.kpiCard}>
            <div style={styles.kpiIcon}><Activity size={20} color={NEON_GREEN} /></div>
            <div style={styles.kpiContent}>
              <span style={styles.kpiLabel}>Active Batches</span>
              <div style={styles.kpiValueRow}>
                <span style={styles.kpiValue}>4</span>
                <span style={styles.kpiUnit}>in progress</span>
              </div>
            </div>
          </div>
          <div style={styles.kpiCard}>
            <div style={styles.kpiIcon}><CheckCircle2 size={20} color={NEON_GREEN} /></div>
            <div style={styles.kpiContent}>
              <span style={styles.kpiLabel}>Quality Pass Rate</span>
              <div style={styles.kpiValueRow}>
                <span style={styles.kpiValue}>98.2%</span>
                <span style={styles.kpiTrendUp}><TrendingUp size={14} /> +0.3%</span>
              </div>
            </div>
          </div>
          <div style={styles.kpiCard}>
            <div style={styles.kpiIcon}><Clock size={20} color={NEON_GREEN} /></div>
            <div style={styles.kpiContent}>
              <span style={styles.kpiLabel}>Downtime Today</span>
              <div style={styles.kpiValueRow}>
                <span style={styles.kpiValue}>23</span>
                <span style={styles.kpiUnit}>minutes</span>
              </div>
            </div>
          </div>
        </div>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <Activity size={18} color={NEON_GREEN} />
            Active Production Lines
          </h2>
          <div style={styles.linesGrid}>
            {productionLines.map((line) => (
              <div key={line.id} style={styles.lineCard}>
                <div style={styles.lineHeader}>
                  <div>
                    <h3 style={styles.lineName}>{line.name}</h3>
                    <p style={styles.lineProduct}>{line.product}</p>
                  </div>
                  <span style={{ ...styles.statusBadge, background: `${getStatusColor(line.status)}20`, color: getStatusColor(line.status) }}>
                    {line.status === 'running' && <Play size={12} />}
                    {line.status === 'paused' && <Pause size={12} />}
                    {line.status === 'maintenance' && <Wrench size={12} />}
                    {line.status.charAt(0).toUpperCase() + line.status.slice(1)}
                  </span>
                </div>
                <div style={styles.lineBatch}>Batch {line.batchNumber}</div>
                <div style={styles.progressContainer}>
                  <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${line.progress}%`, background: getStatusColor(line.status) }} />
                  </div>
                  <span style={styles.progressText}>{line.progress}%</span>
                </div>
                <div style={styles.lineFooter}>
                  <span style={styles.lineFooterLabel}>Est. Completion:</span>
                  <span style={styles.lineFooterValue}>{line.estimatedCompletion}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <Clock size={18} color={NEON_GREEN} />
            Production Schedule
          </h2>
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Batch #</th>
                  <th style={styles.th}>Product</th>
                  <th style={styles.th}>Quantity</th>
                  <th style={styles.th}>Line</th>
                  <th style={styles.th}>Start Time</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {scheduledBatches.map((batch) => (
                  <tr key={batch.id} style={styles.tr}>
                    <td style={styles.td}><span style={styles.batchNum}>{batch.batchNumber}</span></td>
                    <td style={styles.td}>{batch.product}</td>
                    <td style={styles.td}>{batch.quantity.toLocaleString()}</td>
                    <td style={styles.td}>{batch.line}</td>
                    <td style={styles.td}>{batch.startTime}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.statusPill, background: `${getStatusColor(batch.status)}20`, color: getStatusColor(batch.status) }}>
                        {batch.status === 'completed' && <CheckCircle2 size={12} />}
                        {batch.status === 'in-progress' && <Activity size={12} />}
                        {batch.status === 'scheduled' && <Clock size={12} />}
                        {batch.status.replace('-', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <CheckCircle2 size={18} color={NEON_GREEN} />
            Quality Control Dashboard
          </h2>
          <div style={styles.twoColumnGrid}>
            <div style={styles.card}>
              <h3 style={styles.cardSubtitle}>Recent QC Tests</h3>
              <div style={styles.qcList}>
                {qcTests.map((test) => (
                  <div key={test.id} style={styles.qcItem}>
                    <div style={{ ...styles.qcResult, background: getStatusColor(test.result) }}>
                      {test.result === 'pass' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    </div>
                    <div style={styles.qcInfo}>
                      <span style={styles.qcTest}>{test.testType}</span>
                      <span style={styles.qcMeta}>{test.batchNumber} • {test.timestamp} • {test.inspector}</span>
                    </div>
                    <span style={{ ...styles.qcResultLabel, color: getStatusColor(test.result) }}>
                      {test.result.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardSubtitle}>Defect Rate Trend (7 Days)</h3>
              <div style={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={defectRateData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} tickLine={false} domain={[0, 3]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="rate" stroke={NEON_GREEN} strokeWidth={2} dot={{ fill: NEON_GREEN, r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>
            <Cog size={18} color={NEON_GREEN} />
            Equipment Status
          </h2>
          <div style={styles.equipmentGrid}>
            {equipmentList.map((eq) => (
              <div key={eq.id} style={styles.equipmentCard}>
                <div style={styles.equipmentHeader}>
                  <div style={{ ...styles.equipmentDot, background: getStatusColor(eq.status) }} />
                  <span style={styles.equipmentName}>{eq.name}</span>
                  <span style={{ ...styles.equipmentStatusLabel, color: getStatusColor(eq.status) }}>
                    {eq.status.charAt(0).toUpperCase() + eq.status.slice(1)}
                  </span>
                </div>
                <div style={styles.equipmentStats}>
                  <div style={styles.equipmentStat}>
                    <span style={styles.equipmentStatLabel}>Uptime</span>
                    <span style={styles.equipmentStatValue}>{eq.uptime > 0 ? `${eq.uptime}%` : 'N/A'}</span>
                  </div>
                  <div style={styles.equipmentStat}>
                    <span style={styles.equipmentStatLabel}>Last Maintenance</span>
                    <span style={styles.equipmentStatValue}>{eq.lastMaintenance}</span>
                  </div>
                  <div style={styles.equipmentStat}>
                    <span style={styles.equipmentStatLabel}>Next Scheduled</span>
                    <span style={styles.equipmentStatValue}>{eq.nextScheduled}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div style={styles.twoColumnGrid}>
          <section style={styles.card}>
            <h2 style={styles.cardTitle}>
              <Users size={18} color={NEON_GREEN} />
              Shift Overview
            </h2>
            <div style={styles.shiftList}>
              {shifts.map((shift, index) => (
                <div key={index} style={styles.shiftCard}>
                  <div style={styles.shiftHeader}>
                    <span style={styles.shiftName}>{shift.name} Shift</span>
                    <span style={styles.shiftTime}>{shift.time}</span>
                  </div>
                  <div style={styles.shiftStats}>
                    <div style={styles.shiftStat}>
                      <Users size={16} color="rgba(255,255,255,0.5)" />
                      <span style={styles.shiftStatValue}>{shift.workers}</span>
                      <span style={styles.shiftStatLabel}>workers</span>
                    </div>
                    <div style={styles.shiftStat}>
                      <Package size={16} color="rgba(255,255,255,0.5)" />
                      <span style={styles.shiftStatValue}>{shift.units.toLocaleString()}</span>
                      <span style={styles.shiftStatLabel}>units</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={styles.card}>
            <h2 style={styles.cardTitle}>
              <ThermometerSun size={18} color={NEON_GREEN} />
              Environmental Monitoring
            </h2>
            <div style={styles.envGrid}>
              <div style={styles.envCard}>
                <div style={styles.envIcon}><ThermometerSun size={24} color={NEON_GREEN} /></div>
                <div style={styles.envContent}>
                  <span style={styles.envLabel}>Temperature</span>
                  <span style={styles.envValue}>68°F</span>
                  <span style={styles.envStatus}>Optimal</span>
                </div>
              </div>
              <div style={styles.envCard}>
                <div style={styles.envIcon}><Droplets size={24} color={NEON_GREEN} /></div>
                <div style={styles.envContent}>
                  <span style={styles.envLabel}>Humidity</span>
                  <span style={styles.envValue}>45%</span>
                  <span style={styles.envStatus}>Optimal</span>
                </div>
              </div>
              <div style={styles.envCard}>
                <div style={styles.envIcon}><Wind size={24} color={NEON_GREEN} /></div>
                <div style={styles.envContent}>
                  <span style={styles.envLabel}>Air Quality</span>
                  <span style={styles.envValue}>Good</span>
                  <span style={styles.envStatus}>Within Range</span>
                </div>
              </div>
            </div>
          </section>
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
    marginBottom: 24,
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
  quickActionsBar: {
    display: 'flex',
    gap: 12,
    marginBottom: 24,
    flexWrap: 'wrap',
  },
  quickActionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 10,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  quickActionBtnPrimary: {
    background: `${NEON_GREEN}15`,
    borderColor: `${NEON_GREEN}40`,
    color: NEON_GREEN,
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 16,
    marginBottom: 32,
  },
  kpiCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: 20,
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
  },
  kpiIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 10,
    background: `${NEON_GREEN}15`,
  },
  kpiContent: {
    flex: 1,
  },
  kpiLabel: {
    display: 'block',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 4,
  },
  kpiValueRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: 700,
    color: '#fff',
  },
  kpiUnit: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  kpiTrendUp: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    fontSize: 12,
    fontWeight: 500,
    color: NEON_GREEN,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 16,
  },
  linesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
  },
  lineCard: {
    padding: 20,
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
  },
  lineHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  lineName: {
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
    margin: 0,
  },
  lineProduct: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    margin: '4px 0 0 0',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 8px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 500,
  },
  lineBatch: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 12,
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.3s ease',
  },
  progressText: {
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.7)',
    minWidth: 35,
    textAlign: 'right',
  },
  lineFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lineFooterLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  lineFooterValue: {
    fontSize: 12,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.8)',
  },
  tableCard: {
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '14px 16px',
    fontSize: 11,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  tr: {
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  td: {
    padding: '14px 16px',
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  batchNum: {
    fontWeight: 600,
    color: '#fff',
  },
  statusPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 10px',
    borderRadius: 6,
    fontSize: 11,
    fontWeight: 500,
    textTransform: 'capitalize',
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
    marginBottom: 32,
  },
  card: {
    padding: 24,
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 15,
    fontWeight: 600,
    color: '#fff',
    margin: 0,
    paddingBottom: 16,
    borderBottom: `1px solid ${CARD_BORDER}`,
    marginBottom: 16,
  },
  cardSubtitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    margin: '0 0 16px 0',
  },
  qcList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    maxHeight: 400,
    overflowY: 'auto',
  },
  qcItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 12px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 8,
  },
  qcResult: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: 6,
    color: '#000',
  },
  qcInfo: {
    flex: 1,
  },
  qcTest: {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    color: '#fff',
  },
  qcMeta: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  qcResultLabel: {
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.5px',
  },
  chartContainer: {
    marginTop: 16,
  },
  equipmentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
  },
  equipmentCard: {
    padding: 16,
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
  },
  equipmentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  equipmentDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
  },
  equipmentName: {
    flex: 1,
    fontSize: 13,
    fontWeight: 600,
    color: '#fff',
  },
  equipmentStatusLabel: {
    fontSize: 11,
    fontWeight: 500,
  },
  equipmentStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  equipmentStat: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  equipmentStatLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  equipmentStatValue: {
    fontSize: 12,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.8)',
  },
  shiftList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  shiftCard: {
    padding: 16,
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 10,
    border: `1px solid ${CARD_BORDER}`,
  },
  shiftHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  shiftName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
  },
  shiftTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  shiftStats: {
    display: 'flex',
    gap: 24,
  },
  shiftStat: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  shiftStatValue: {
    fontSize: 16,
    fontWeight: 600,
    color: '#fff',
  },
  shiftStatLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  envGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
  },
  envCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: 20,
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 12,
    border: `1px solid ${CARD_BORDER}`,
  },
  envIcon: {
    marginBottom: 12,
  },
  envContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  envLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  envValue: {
    fontSize: 24,
    fontWeight: 700,
    color: '#fff',
  },
  envStatus: {
    fontSize: 11,
    color: NEON_GREEN,
    fontWeight: 500,
  },
};
