import React from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  Factory,
  Activity,
  Gauge,
  Package,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  Pause,
  Wrench,
  Calendar,
  Users,
  TrendingUp,
  TrendingDown,
  FileText,
  Download,
  Settings,
  Zap,
  Target,
  Timer,
  Cog,
  ThermometerSun,
  Droplets,
  Wind,
  XCircle,
  ChevronRight,
  BarChart3,
  AlertCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const isDemoMode = true;

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255,255,255,0.03)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

interface ProductionMetric {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendType?: 'up' | 'down';
  subtitle?: string;
}

interface ProductionLine {
  id: string;
  name: string;
  product: string;
  status: 'running' | 'paused' | 'maintenance';
  progress: number;
  unitsCompleted: number;
  unitsTarget: number;
  estimatedCompletion: string;
  batchNumber: string;
}

interface ScheduledBatch {
  id: string;
  batchNumber: string;
  product: string;
  quantity: number;
  assignedLine: string;
  startTime: string;
  status: 'scheduled' | 'in-progress' | 'completed';
}

interface QCTest {
  id: string;
  batchNumber: string;
  testType: string;
  result: 'pass' | 'fail';
  timestamp: string;
  inspector: string;
}

interface DefectData {
  day: string;
  rate: number;
}

interface DefectType {
  type: string;
  count: number;
  percentage: number;
}

interface Equipment {
  id: string;
  name: string;
  status: 'operational' | 'warning' | 'offline' | 'maintenance';
  lastMaintenance: string;
  nextMaintenance: string;
  uptime: number;
}

const productionMetrics: ProductionMetric[] = [
  {
    id: 'output',
    label: "Today's Output",
    value: '12,450',
    icon: <Package size={20} />,
    trend: '+8%',
    trendType: 'up',
    subtitle: 'units',
  },
  {
    id: 'capacity',
    label: 'Capacity Utilization',
    value: '78%',
    icon: <Gauge size={20} />,
    trend: '+3%',
    trendType: 'up',
  },
  {
    id: 'batches',
    label: 'Active Batches',
    value: '4',
    icon: <Activity size={20} />,
    subtitle: 'in progress',
  },
  {
    id: 'quality',
    label: 'Quality Pass Rate',
    value: '98.2%',
    icon: <CheckCircle2 size={20} />,
    trend: '+0.3%',
    trendType: 'up',
  },
  {
    id: 'downtime',
    label: 'Downtime Today',
    value: '23',
    icon: <Clock size={20} />,
    subtitle: 'minutes',
  },
];

const productionLines: ProductionLine[] = [
  {
    id: 'line-1',
    name: 'Production Line A',
    product: 'Strawberry Peach Smoothie',
    status: 'running',
    progress: 72,
    unitsCompleted: 2880,
    unitsTarget: 4000,
    estimatedCompletion: '2:45 PM',
    batchNumber: '#2847',
  },
  {
    id: 'line-2',
    name: 'Production Line B',
    product: 'Mango Jackfruit Blend',
    status: 'running',
    progress: 45,
    unitsCompleted: 1800,
    unitsTarget: 4000,
    estimatedCompletion: '4:30 PM',
    batchNumber: '#2848',
  },
  {
    id: 'line-3',
    name: 'Production Line C',
    product: 'Açaí Berry Bowl Mix',
    status: 'paused',
    progress: 89,
    unitsCompleted: 3560,
    unitsTarget: 4000,
    estimatedCompletion: '1:15 PM',
    batchNumber: '#2849',
  },
  {
    id: 'line-4',
    name: 'Production Line D',
    product: 'Coffee Mushroom Blend',
    status: 'maintenance',
    progress: 0,
    unitsCompleted: 0,
    unitsTarget: 3500,
    estimatedCompletion: 'Pending',
    batchNumber: '#2850',
  },
];

const scheduledBatches: ScheduledBatch[] = [
  { id: 'sb-1', batchNumber: '#2847', product: 'Strawberry Peach Smoothie', quantity: 4000, assignedLine: 'Line A', startTime: '6:00 AM', status: 'in-progress' },
  { id: 'sb-2', batchNumber: '#2848', product: 'Mango Jackfruit Blend', quantity: 4000, assignedLine: 'Line B', startTime: '7:30 AM', status: 'in-progress' },
  { id: 'sb-3', batchNumber: '#2849', product: 'Açaí Berry Bowl Mix', quantity: 4000, assignedLine: 'Line C', startTime: '6:30 AM', status: 'in-progress' },
  { id: 'sb-4', batchNumber: '#2850', product: 'Coffee Mushroom Blend', quantity: 3500, assignedLine: 'Line D', startTime: '3:00 PM', status: 'scheduled' },
  { id: 'sb-5', batchNumber: '#2851', product: 'Chocolate Berry Fusion', quantity: 3000, assignedLine: 'Line A', startTime: '4:00 PM', status: 'scheduled' },
  { id: 'sb-6', batchNumber: '#2852', product: 'Almond Vanilla Dream', quantity: 2500, assignedLine: 'Line B', startTime: '5:30 PM', status: 'scheduled' },
  { id: 'sb-7', batchNumber: '#2845', product: 'Matcha Green Energy', quantity: 3500, assignedLine: 'Line C', startTime: '5:00 AM', status: 'completed' },
  { id: 'sb-8', batchNumber: '#2846', product: 'Nutty Monkey Protein', quantity: 3000, assignedLine: 'Line A', startTime: '4:30 AM', status: 'completed' },
];

const recentQCTests: QCTest[] = [
  { id: 'qc-1', batchNumber: '#2847', testType: 'Viscosity Test', result: 'pass', timestamp: '11:45 AM', inspector: 'Sarah M.' },
  { id: 'qc-2', batchNumber: '#2847', testType: 'pH Level Check', result: 'pass', timestamp: '11:30 AM', inspector: 'Mike R.' },
  { id: 'qc-3', batchNumber: '#2848', testType: 'Microbiological', result: 'pass', timestamp: '11:15 AM', inspector: 'Lisa K.' },
  { id: 'qc-4', batchNumber: '#2849', testType: 'Color Consistency', result: 'fail', timestamp: '10:45 AM', inspector: 'James T.' },
  { id: 'qc-5', batchNumber: '#2848', testType: 'Sugar Content', result: 'pass', timestamp: '10:30 AM', inspector: 'Sarah M.' },
  { id: 'qc-6', batchNumber: '#2845', testType: 'Final Inspection', result: 'pass', timestamp: '9:00 AM', inspector: 'Mike R.' },
];

const defectRateData: DefectData[] = [
  { day: 'Dec 4', rate: 2.1 },
  { day: 'Dec 5', rate: 1.8 },
  { day: 'Dec 6', rate: 2.4 },
  { day: 'Dec 7', rate: 1.5 },
  { day: 'Dec 8', rate: 1.9 },
  { day: 'Dec 9', rate: 1.6 },
  { day: 'Dec 10', rate: 1.8 },
];

const topDefectTypes: DefectType[] = [
  { type: 'Color Variation', count: 23, percentage: 35 },
  { type: 'Viscosity Issues', count: 18, percentage: 28 },
  { type: 'Packaging Defects', count: 14, percentage: 22 },
  { type: 'Weight Deviation', count: 10, percentage: 15 },
];

const equipmentList: Equipment[] = [
  { id: 'eq-1', name: 'Industrial Blender #1', status: 'operational', lastMaintenance: 'Dec 1, 2025', nextMaintenance: 'Jan 1, 2026', uptime: 98.5 },
  { id: 'eq-2', name: 'Industrial Blender #2', status: 'operational', lastMaintenance: 'Nov 28, 2025', nextMaintenance: 'Dec 28, 2025', uptime: 97.2 },
  { id: 'eq-3', name: 'Mixing Tank A', status: 'warning', lastMaintenance: 'Nov 15, 2025', nextMaintenance: 'Dec 15, 2025', uptime: 94.8 },
  { id: 'eq-4', name: 'Mixing Tank B', status: 'operational', lastMaintenance: 'Dec 5, 2025', nextMaintenance: 'Jan 5, 2026', uptime: 99.1 },
  { id: 'eq-5', name: 'Bottling Machine #1', status: 'operational', lastMaintenance: 'Nov 20, 2025', nextMaintenance: 'Dec 20, 2025', uptime: 96.3 },
  { id: 'eq-6', name: 'Bottling Machine #2', status: 'maintenance', lastMaintenance: 'Dec 10, 2025', nextMaintenance: 'Dec 10, 2025', uptime: 0 },
  { id: 'eq-7', name: 'Pasteurizer Unit', status: 'operational', lastMaintenance: 'Nov 25, 2025', nextMaintenance: 'Dec 25, 2025', uptime: 99.5 },
  { id: 'eq-8', name: 'Cooling System', status: 'operational', lastMaintenance: 'Dec 3, 2025', nextMaintenance: 'Jan 3, 2026', uptime: 99.8 },
];

const shiftInfo = {
  currentShift: 'Day Shift (6:00 AM - 2:00 PM)',
  timeRemaining: '2h 15m',
  staffOnDuty: 24,
  productivity: 104,
  target: 100,
};

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
    case 'offline':
      return '#FF6B6B';
    case 'scheduled':
      return '#60A5FA';
    default:
      return 'rgba(255,255,255,0.5)';
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'running': return 'Running';
    case 'paused': return 'Paused';
    case 'maintenance': return 'Maintenance';
    case 'operational': return 'Operational';
    case 'warning': return 'Warning';
    case 'offline': return 'Offline';
    default: return status;
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
        <p style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>
          Defect Rate: <span style={{ color: NEON_GREEN }}>{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
}

export default function ProductionDashboard() {
  return (
    <AdminLayout title="Production" subtitle="Factory Operations & Manufacturing">
      {isDemoMode && (
        <div style={styles.demoTag}>
          <AlertCircle size={14} />
          <span>Demo Mode - Connect factory systems for live data</span>
        </div>
      )}

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

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>
          <Factory size={18} color={NEON_GREEN} />
          Production Overview
        </h2>
        <div style={styles.metricsGrid}>
          {productionMetrics.map((metric) => (
            <div key={metric.id} style={styles.metricCard}>
              <div style={styles.metricIcon}>{metric.icon}</div>
              <div style={styles.metricContent}>
                <span style={styles.metricLabel}>{metric.label}</span>
                <div style={styles.metricValueRow}>
                  <span style={styles.metricValue}>{metric.value}</span>
                  {metric.subtitle && <span style={styles.metricSubtitle}>{metric.subtitle}</span>}
                  {metric.trend && (
                    <span style={{ ...styles.metricTrend, color: metric.trendType === 'up' ? NEON_GREEN : '#FF6B6B' }}>
                      {metric.trendType === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {metric.trend}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

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
                  {getStatusLabel(line.status)}
                </span>
              </div>
              <div style={styles.lineBatch}>Batch {line.batchNumber}</div>
              <div style={styles.progressContainer}>
                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${line.progress}%`,
                      background: getStatusColor(line.status),
                    }}
                  />
                </div>
                <span style={styles.progressText}>{line.progress}%</span>
              </div>
              <div style={styles.lineStats}>
                <div style={styles.lineStat}>
                  <span style={styles.lineStatLabel}>Units</span>
                  <span style={styles.lineStatValue}>{line.unitsCompleted.toLocaleString()} / {line.unitsTarget.toLocaleString()}</span>
                </div>
                <div style={styles.lineStat}>
                  <span style={styles.lineStatLabel}>Est. Completion</span>
                  <span style={styles.lineStatValue}>{line.estimatedCompletion}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={styles.twoColumnGrid}>
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>
            <Calendar size={18} color={NEON_GREEN} />
            Batch Schedule
          </h2>
          <div style={styles.batchList}>
            {scheduledBatches.map((batch) => (
              <div key={batch.id} style={styles.batchItem}>
                <div style={styles.batchInfo}>
                  <div style={styles.batchHeader}>
                    <span style={styles.batchNumber}>{batch.batchNumber}</span>
                    <span style={{ ...styles.batchStatus, background: `${getStatusColor(batch.status)}20`, color: getStatusColor(batch.status) }}>
                      {batch.status === 'completed' && <CheckCircle2 size={10} />}
                      {batch.status === 'in-progress' && <Activity size={10} />}
                      {batch.status === 'scheduled' && <Clock size={10} />}
                      {batch.status}
                    </span>
                  </div>
                  <p style={styles.batchProduct}>{batch.product}</p>
                  <div style={styles.batchDetails}>
                    <span>{batch.quantity.toLocaleString()} units</span>
                    <span>•</span>
                    <span>{batch.assignedLine}</span>
                    <span>•</span>
                    <span>{batch.startTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>
            <CheckCircle2 size={18} color={NEON_GREEN} />
            Quality Control Dashboard
          </h2>
          <div style={styles.qcSection}>
            <h3 style={styles.subSectionTitle}>Recent QC Tests</h3>
            <div style={styles.qcList}>
              {recentQCTests.map((test) => (
                <div key={test.id} style={styles.qcItem}>
                  <div style={{ ...styles.qcResult, background: getStatusColor(test.result) }}>
                    {test.result === 'pass' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  </div>
                  <div style={styles.qcInfo}>
                    <span style={styles.qcTest}>{test.testType}</span>
                    <span style={styles.qcBatch}>{test.batchNumber} • {test.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={styles.qcSection}>
            <h3 style={styles.subSectionTitle}>Defect Rate (7-Day Trend)</h3>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={defectRateData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} tickLine={false} domain={[0, 3]} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="rate" stroke={NEON_GREEN} strokeWidth={2} dot={{ fill: NEON_GREEN, r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={styles.qcSection}>
            <h3 style={styles.subSectionTitle}>Top Defect Types</h3>
            <div style={styles.defectList}>
              {topDefectTypes.map((defect, index) => (
                <div key={index} style={styles.defectItem}>
                  <div style={styles.defectInfo}>
                    <span style={styles.defectType}>{defect.type}</span>
                    <span style={styles.defectCount}>{defect.count} occurrences</span>
                  </div>
                  <div style={styles.defectBar}>
                    <div style={{ ...styles.defectFill, width: `${defect.percentage}%` }} />
                  </div>
                  <span style={styles.defectPercent}>{defect.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div style={styles.twoColumnGrid}>
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>
            <Cog size={18} color={NEON_GREEN} />
            Equipment Status
          </h2>
          <div style={styles.equipmentList}>
            {equipmentList.map((equipment) => (
              <div key={equipment.id} style={styles.equipmentItem}>
                <div style={styles.equipmentLeft}>
                  <div style={{ ...styles.equipmentStatus, background: getStatusColor(equipment.status) }} />
                  <div style={styles.equipmentInfo}>
                    <span style={styles.equipmentName}>{equipment.name}</span>
                    <span style={styles.equipmentMeta}>
                      Last: {equipment.lastMaintenance} • Next: {equipment.nextMaintenance}
                    </span>
                  </div>
                </div>
                <div style={styles.equipmentRight}>
                  {equipment.status === 'operational' && (
                    <span style={styles.uptimeLabel}>{equipment.uptime}% uptime</span>
                  )}
                  <span style={{ ...styles.equipmentStatusLabel, color: getStatusColor(equipment.status) }}>
                    {getStatusLabel(equipment.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.card}>
          <h2 style={styles.cardTitle}>
            <Users size={18} color={NEON_GREEN} />
            Shift Overview
          </h2>
          <div style={styles.shiftContent}>
            <div style={styles.shiftMain}>
              <div style={styles.shiftInfo}>
                <Clock size={24} color={NEON_GREEN} />
                <div>
                  <p style={styles.shiftLabel}>Current Shift</p>
                  <p style={styles.shiftValue}>{shiftInfo.currentShift}</p>
                </div>
              </div>
              <div style={styles.shiftTimeRemaining}>
                <Timer size={20} color="rgba(255,255,255,0.5)" />
                <span style={styles.timeRemainingValue}>{shiftInfo.timeRemaining}</span>
                <span style={styles.timeRemainingLabel}>remaining</span>
              </div>
            </div>

            <div style={styles.shiftStats}>
              <div style={styles.shiftStatCard}>
                <Users size={20} color={NEON_GREEN} />
                <div>
                  <span style={styles.shiftStatValue}>{shiftInfo.staffOnDuty}</span>
                  <span style={styles.shiftStatLabel}>Staff on Duty</span>
                </div>
              </div>
              <div style={styles.shiftStatCard}>
                <Target size={20} color={NEON_GREEN} />
                <div>
                  <span style={styles.shiftStatValue}>{shiftInfo.productivity}%</span>
                  <span style={styles.shiftStatLabel}>Productivity</span>
                </div>
              </div>
            </div>

            <div style={styles.productivityBar}>
              <div style={styles.productivityHeader}>
                <span>Shift Productivity vs Target</span>
                <span style={{ color: shiftInfo.productivity >= shiftInfo.target ? NEON_GREEN : '#FF6B6B' }}>
                  {shiftInfo.productivity >= shiftInfo.target ? '+' : ''}{shiftInfo.productivity - shiftInfo.target}%
                </span>
              </div>
              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${Math.min(shiftInfo.productivity, 120)}%`,
                    background: shiftInfo.productivity >= shiftInfo.target ? NEON_GREEN : '#FFB800',
                  }}
                />
                <div style={{ ...styles.targetLine, left: `${shiftInfo.target}%` }} />
              </div>
              <div style={styles.productivityLabels}>
                <span>0%</span>
                <span style={{ position: 'absolute', left: `${shiftInfo.target}%`, transform: 'translateX(-50%)' }}>Target</span>
                <span>120%</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  demoTag: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    background: 'rgba(255,184,0,0.1)',
    border: '1px solid rgba(255,184,0,0.2)',
    borderRadius: 8,
    color: '#FFB800',
    fontSize: 13,
    marginBottom: 24,
  },
  quickActionsBar: {
    display: 'flex',
    gap: 12,
    marginBottom: 32,
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
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: 16,
  },
  metricCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: 20,
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
  },
  metricIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 10,
    background: `${NEON_GREEN}15`,
    color: NEON_GREEN,
  },
  metricContent: {
    flex: 1,
  },
  metricLabel: {
    display: 'block',
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 4,
  },
  metricValueRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 700,
    color: '#fff',
  },
  metricSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  metricTrend: {
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    fontSize: 12,
    fontWeight: 500,
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
    fontSize: 14,
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
    textTransform: 'capitalize',
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
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 6,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    position: 'relative',
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
  lineStats: {
    display: 'flex',
    gap: 16,
  },
  lineStat: {
    flex: 1,
  },
  lineStatLabel: {
    display: 'block',
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 2,
  },
  lineStatValue: {
    fontSize: 12,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.8)',
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
    marginBottom: 24,
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
    marginBottom: 20,
    margin: 0,
    paddingBottom: 16,
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  batchList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    maxHeight: 400,
    overflowY: 'auto',
  },
  batchItem: {
    padding: 12,
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 10,
    border: `1px solid ${CARD_BORDER}`,
  },
  batchInfo: {},
  batchHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  batchNumber: {
    fontSize: 13,
    fontWeight: 600,
    color: '#fff',
  },
  batchStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '3px 8px',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 500,
    textTransform: 'capitalize',
  },
  batchProduct: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    margin: '0 0 6px 0',
  },
  batchDetails: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  qcSection: {
    marginTop: 20,
  },
  subSectionTitle: {
    fontSize: 12,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  qcList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  qcItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '8px 12px',
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
    fontSize: 12,
    fontWeight: 500,
    color: '#fff',
  },
  qcBatch: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
  },
  defectList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  defectItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  defectInfo: {
    flex: '0 0 140px',
  },
  defectType: {
    display: 'block',
    fontSize: 12,
    fontWeight: 500,
    color: '#fff',
  },
  defectCount: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
  },
  defectBar: {
    flex: 1,
    height: 6,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  defectFill: {
    height: '100%',
    background: '#FF6B6B',
    borderRadius: 3,
  },
  defectPercent: {
    fontSize: 11,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.6)',
    minWidth: 35,
    textAlign: 'right',
  },
  equipmentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  equipmentItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 10,
    border: `1px solid ${CARD_BORDER}`,
  },
  equipmentLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  equipmentStatus: {
    width: 8,
    height: 8,
    borderRadius: '50%',
  },
  equipmentInfo: {},
  equipmentName: {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    color: '#fff',
  },
  equipmentMeta: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
  },
  equipmentRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  uptimeLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  equipmentStatusLabel: {
    fontSize: 11,
    fontWeight: 500,
  },
  shiftContent: {},
  shiftMain: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  shiftInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  shiftLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    margin: 0,
    marginBottom: 4,
  },
  shiftValue: {
    fontSize: 14,
    fontWeight: 500,
    color: '#fff',
    margin: 0,
  },
  shiftTimeRemaining: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 16px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
  },
  timeRemainingValue: {
    fontSize: 18,
    fontWeight: 600,
    color: '#fff',
  },
  timeRemainingLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
  shiftStats: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    marginBottom: 24,
  },
  shiftStatCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    border: `1px solid ${CARD_BORDER}`,
  },
  shiftStatValue: {
    display: 'block',
    fontSize: 20,
    fontWeight: 600,
    color: '#fff',
  },
  shiftStatLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  productivityBar: {
    padding: 16,
    background: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
  },
  productivityHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 12,
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  targetLine: {
    position: 'absolute',
    top: -4,
    width: 2,
    height: 14,
    background: '#fff',
    borderRadius: 1,
  },
  productivityLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 8,
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    position: 'relative',
  },
  tooltip: {
    background: 'rgba(0,0,0,0.9)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    padding: 12,
  },
  tooltipLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    margin: '0 0 4px 0',
  },
  tooltipValue: {
    color: '#fff',
    fontSize: 12,
    margin: 0,
  },
};
