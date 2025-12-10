import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PartnerLayout from '../../components/partner/PartnerLayout';
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  BarChart3,
  Sparkles,
  Award,
  Loader2,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area,
} from 'recharts';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

const monthlySpendingData = [
  { month: 'Jan', thisYear: 28400, lastYear: 21200 },
  { month: 'Feb', thisYear: 32100, lastYear: 24800 },
  { month: 'Mar', thisYear: 29800, lastYear: 22100 },
  { month: 'Apr', thisYear: 35600, lastYear: 26500 },
  { month: 'May', thisYear: 38200, lastYear: 28900 },
  { month: 'Jun', thisYear: 41500, lastYear: 30200 },
  { month: 'Jul', thisYear: 39800, lastYear: 29100 },
  { month: 'Aug', thisYear: 43200, lastYear: 31800 },
  { month: 'Sep', thisYear: 45100, lastYear: 33500 },
  { month: 'Oct', thisYear: 47800, lastYear: 35200 },
  { month: 'Nov', thisYear: 44600, lastYear: 34100 },
  { month: 'Dec', thisYear: 42300, lastYear: 31600 },
];

const productPerformanceData = [
  { id: 1, name: 'Açai Berry Bowl Mix', unitsSold: 342, revenue: 26658, margin: 42, isBestSeller: true },
  { id: 2, name: 'Strawberry Peach Smoothie', unitsSold: 287, revenue: 19918, margin: 38, isBestSeller: true },
  { id: 3, name: 'Mango Jackfruit Blend', unitsSold: 256, revenue: 17664, margin: 40, isBestSeller: false },
  { id: 4, name: 'Coffee Mushroom Blend', unitsSold: 198, revenue: 16632, margin: 45, isBestSeller: false },
  { id: 5, name: 'Green Detox Blend', unitsSold: 176, revenue: 11264, margin: 36, isBestSeller: false },
  { id: 6, name: 'Protein Power Shake', unitsSold: 154, revenue: 13090, margin: 41, isBestSeller: false },
  { id: 7, name: 'Tropical Paradise Mix', unitsSold: 143, revenue: 9438, margin: 35, isBestSeller: false },
  { id: 8, name: 'Berry Blast Smoothie', unitsSold: 128, revenue: 8448, margin: 37, isBestSeller: false },
];

const aiRecommendations = [
  {
    icon: '📈',
    title: 'Stock Up on Açai',
    description: 'Açai Berry Bowl Mix is trending 47% higher than last quarter. Consider increasing your next order by 25% to meet demand.',
  },
  {
    icon: '🎯',
    title: 'Bundle Opportunity',
    description: 'Customers who buy Coffee Mushroom also purchase Protein Power 68% of the time. Create a morning bundle for higher AOV.',
  },
  {
    icon: '⏰',
    title: 'Optimal Order Timing',
    description: 'Based on your sales velocity, place your next order by Dec 15 to avoid stockouts during the holiday rush.',
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: '#111111',
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 8,
        padding: '12px 16px',
      }}>
        <p style={{ color: '#FFFFFF', fontWeight: 600, marginBottom: 8 }}>{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color, fontSize: 13, margin: '4px 0' }}>
            {entry.name}: ${entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function PartnerAnalytics() {
  const router = useRouter();
  const [partnerName, setPartnerName] = useState('Partner');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('partnerSession');
    if (!session) {
      router.push('/partner/login');
      return;
    }
    const data = JSON.parse(session);
    setPartnerName(data.businessName);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <PartnerLayout title="Analytics" partnerName={partnerName}>
        <div style={styles.loadingPage}>
          <Loader2 size={32} color={NEON_GREEN} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={styles.loadingText}>Loading analytics...</p>
        </div>
      </PartnerLayout>
    );
  }

  const totalCost = 89420;
  const totalRevenue = 123112;
  const grossProfit = totalRevenue - totalCost;
  const marginPercent = ((grossProfit / totalRevenue) * 100).toFixed(1);

  return (
    <PartnerLayout title="Analytics" partnerName={partnerName}>
      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Analytics Dashboard</h1>
            <p style={styles.subtitle}>Track your purchasing trends and performance insights</p>
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <DollarSign size={20} color={NEON_GREEN} />
            </div>
            <div style={styles.statContent}>
              <span style={styles.statLabel}>Total Purchased (MTD)</span>
              <span style={styles.statValue}>$42,300</span>
              <span style={styles.statMeta}>
                <ArrowUp size={14} color={NEON_GREEN} />
                <span style={{ color: NEON_GREEN }}>12%</span> vs last month
              </span>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: 'rgba(139, 92, 246, 0.1)' }}>
              <ShoppingCart size={20} color="#8B5CF6" />
            </div>
            <div style={styles.statContent}>
              <span style={styles.statLabel}>Orders Placed (MTD)</span>
              <span style={styles.statValue}>8</span>
              <span style={styles.statMeta}>
                <ArrowUp size={14} color={NEON_GREEN} />
                <span style={{ color: NEON_GREEN }}>2</span> more than last month
              </span>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
              <BarChart3 size={20} color="#F59E0B" />
            </div>
            <div style={styles.statContent}>
              <span style={styles.statLabel}>Average Order Value</span>
              <span style={styles.statValue}>$5,287</span>
              <span style={styles.statMeta}>
                <ArrowUp size={14} color={NEON_GREEN} />
                <span style={{ color: NEON_GREEN }}>8%</span> vs last month
              </span>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: 'rgba(6, 182, 212, 0.1)' }}>
              <TrendingUp size={20} color="#06B6D4" />
            </div>
            <div style={styles.statContent}>
              <span style={styles.statLabel}>Year-over-Year Growth</span>
              <span style={styles.statValue}>+34%</span>
              <span style={styles.statMeta}>Outperforming industry avg</span>
            </div>
          </div>
        </div>

        <div style={styles.chartSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Purchasing Trends</h2>
            <p style={styles.sectionSubtitle}>Monthly spending comparison • Current vs Prior Year</p>
          </div>
          <div style={styles.chartCard}>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={monthlySpendingData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis 
                  dataKey="month" 
                  stroke="#666666" 
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#666666" 
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: 20 }}
                  formatter={(value) => <span style={{ color: '#999999', fontSize: 13 }}>{value}</span>}
                />
                <Area 
                  type="monotone" 
                  dataKey="lastYear" 
                  name="Last Year"
                  fill="rgba(102, 102, 102, 0.1)" 
                  stroke="transparent"
                />
                <Bar 
                  dataKey="lastYear" 
                  name="Last Year" 
                  fill="rgba(102, 102, 102, 0.3)" 
                  radius={[4, 4, 0, 0]}
                  barSize={20}
                />
                <Line 
                  type="monotone" 
                  dataKey="thisYear" 
                  name="This Year"
                  stroke={NEON_GREEN} 
                  strokeWidth={3}
                  dot={{ fill: NEON_GREEN, strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: NEON_GREEN, stroke: '#000000', strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={styles.gridTwoCol}>
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                <Award size={20} color={NEON_GREEN} style={{ marginRight: 8 }} />
                Product Performance
              </h2>
            </div>
            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Product Name</th>
                    <th style={styles.th}>Units Sold</th>
                    <th style={styles.th}>Revenue</th>
                    <th style={styles.th}>Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {productPerformanceData.map((product) => (
                    <tr key={product.id}>
                      <td style={styles.td}>
                        <div style={styles.productCell}>
                          <span style={styles.productName}>{product.name}</span>
                          {product.isBestSeller && (
                            <span style={styles.bestSellerBadge}>Best Seller</span>
                          )}
                        </div>
                      </td>
                      <td style={styles.td}>{product.unitsSold}</td>
                      <td style={styles.td}>${product.revenue.toLocaleString()}</td>
                      <td style={styles.td}>
                        <span style={{
                          color: product.margin >= 40 ? NEON_GREEN : product.margin >= 35 ? '#F59E0B' : '#999999',
                          fontWeight: 500,
                        }}>
                          {product.margin}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                <Sparkles size={20} color={NEON_GREEN} style={{ marginRight: 8 }} />
                AI Recommendations
              </h2>
            </div>
            <div style={styles.recommendationsList}>
              {aiRecommendations.map((rec, idx) => (
                <div key={idx} style={styles.recommendationCard}>
                  <div style={styles.recIcon}>{rec.icon}</div>
                  <div style={styles.recContent}>
                    <h4 style={styles.recTitle}>{rec.title}</h4>
                    <p style={styles.recDescription}>{rec.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Profitability Analysis</h2>
            <p style={styles.sectionSubtitle}>Year-to-date financial performance</p>
          </div>
          <div style={styles.profitGrid}>
            <div style={styles.profitCard}>
              <div style={styles.profitLabel}>Total Cost</div>
              <div style={styles.profitValue}>${totalCost.toLocaleString()}</div>
              <div style={styles.profitMeta}>Product costs + shipping</div>
            </div>
            <div style={styles.profitCard}>
              <div style={styles.profitLabel}>Total Revenue</div>
              <div style={{ ...styles.profitValue, color: '#3B82F6' }}>${totalRevenue.toLocaleString()}</div>
              <div style={styles.profitMeta}>From resale at retail price</div>
            </div>
            <div style={styles.profitCard}>
              <div style={styles.profitLabel}>Gross Profit</div>
              <div style={{ ...styles.profitValue, color: NEON_GREEN }}>${grossProfit.toLocaleString()}</div>
              <div style={styles.profitMeta}>Revenue minus costs</div>
            </div>
            <div style={styles.profitCard}>
              <div style={styles.profitLabel}>Margin %</div>
              <div style={{ ...styles.profitValue, color: '#8B5CF6' }}>{marginPercent}%</div>
              <div style={styles.profitMeta}>Healthy profit margin</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </PartnerLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: 32,
    maxWidth: 1400,
    margin: '0 auto',
  },
  loadingPage: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#666666',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 20,
    marginBottom: 32,
  },
  statCard: {
    display: 'flex',
    gap: 16,
    padding: 24,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#666666',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  statMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
    color: '#999999',
  },
  chartSection: {
    marginBottom: 32,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#666666',
    marginTop: 4,
  },
  chartCard: {
    padding: 24,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
  },
  gridTwoCol: {
    display: 'grid',
    gridTemplateColumns: '1.5fr 1fr',
    gap: 24,
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  tableCard: {
    backgroundColor: CARD_BG,
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
    padding: '14px 20px',
    fontSize: 12,
    fontWeight: 600,
    color: '#666666',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  td: {
    padding: '14px 20px',
    fontSize: 14,
    color: '#CCCCCC',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  productCell: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  productName: {
    color: '#FFFFFF',
    fontWeight: 500,
  },
  bestSellerBadge: {
    fontSize: 10,
    fontWeight: 600,
    padding: '3px 8px',
    backgroundColor: 'rgba(0, 255, 133, 0.15)',
    color: NEON_GREEN,
    borderRadius: 20,
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
  recommendationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  recommendationCard: {
    display: 'flex',
    gap: 16,
    padding: 20,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
  },
  recIcon: {
    fontSize: 24,
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    flexShrink: 0,
  },
  recContent: {
    flex: 1,
  },
  recTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 6px 0',
  },
  recDescription: {
    fontSize: 13,
    color: '#999999',
    margin: 0,
    lineHeight: 1.5,
  },
  profitGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 20,
  },
  profitCard: {
    padding: 24,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    textAlign: 'center',
  },
  profitLabel: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 8,
  },
  profitValue: {
    fontSize: 28,
    fontWeight: 700,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  profitMeta: {
    fontSize: 12,
    color: '#666666',
  },
};
