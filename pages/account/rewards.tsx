import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../../components/customer/CustomerLayout';
import {
  Gift,
  Star,
  Zap,
  Trophy,
  ArrowRight,
  Lock,
  Check,
  Clock,
  Loader2,
} from 'lucide-react';
import { getCustomerById, getLoyaltyTransactions } from '../../lib/api/customers';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  category: 'discount' | 'product' | 'experience';
  available: boolean;
}

interface PointsActivity {
  id: string;
  description: string;
  points: number;
  type: 'earned' | 'redeemed';
  date: string;
}

const rewards: Reward[] = [
  { id: 'r1', name: '$5 Off', description: 'Get $5 off your next order', pointsCost: 500, category: 'discount', available: true },
  { id: 'r2', name: '$10 Off', description: 'Get $10 off your next order', pointsCost: 1000, category: 'discount', available: true },
  { id: 'r3', name: 'Free Smoothie', description: 'Any smoothie, on us', pointsCost: 1500, category: 'product', available: false },
  { id: 'r4', name: '$25 Off', description: 'Get $25 off your next order', pointsCost: 2500, category: 'discount', available: false },
  { id: 'r5', name: 'Free Box', description: 'Get a free variety box', pointsCost: 5000, category: 'product', available: false },
  { id: 'r6', name: 'VIP Access', description: 'Early access to new flavors', pointsCost: 7500, category: 'experience', available: false },
];

const mockPointsHistory: PointsActivity[] = [
  { id: 'ph1', description: 'Order #ORD-78542', points: 90, type: 'earned', date: 'Dec 8, 2025' },
  { id: 'ph2', description: 'Order #ORD-78401', points: 45, type: 'earned', date: 'Dec 3, 2025' },
  { id: 'ph3', description: 'Redeemed: $5 Off', points: -500, type: 'redeemed', date: 'Nov 30, 2025' },
  { id: 'ph4', description: 'Order #ORD-78256', points: 60, type: 'earned', date: 'Nov 28, 2025' },
  { id: 'ph5', description: 'Referral Bonus', points: 200, type: 'earned', date: 'Nov 25, 2025' },
  { id: 'ph6', description: 'Order #ORD-78124', points: 60, type: 'earned', date: 'Nov 20, 2025' },
  { id: 'ph7', description: 'Birthday Bonus', points: 500, type: 'earned', date: 'Nov 15, 2025' },
  { id: 'ph8', description: 'Sign Up Bonus', points: 100, type: 'earned', date: 'Oct 15, 2025' },
];

const tiers = [
  { name: 'Member', minPoints: 0, color: '#999999', multiplier: '1x' },
  { name: 'Silver', minPoints: 1000, color: '#C0C0C0', multiplier: '1.25x' },
  { name: 'Gold', minPoints: 2500, color: '#FFD700', multiplier: '1.5x' },
  { name: 'Platinum', minPoints: 5000, color: '#E5E4E2', multiplier: '2x' },
];

const tierNameMap: Record<string, string> = {
  bronze: 'Member',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
};

export default function CustomerRewards() {
  const router = useRouter();
  const [toast, setToast] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPoints, setCurrentPoints] = useState(1240);
  const [lifetimePoints, setLifetimePoints] = useState(1555);
  const [pointsHistory, setPointsHistory] = useState<PointsActivity[]>(mockPointsHistory);
  const [loyaltyTier, setLoyaltyTier] = useState('bronze');

  useEffect(() => {
    const loadRewardsData = async () => {
      const session = localStorage.getItem('customerSession');
      if (!session) {
        router.push('/account/login');
        return;
      }

      const parsedSession = JSON.parse(session);

      try {
        if (parsedSession.id && parsedSession.id !== 'demo-customer') {
          const [customerData, transactions] = await Promise.all([
            getCustomerById(parsedSession.id),
            getLoyaltyTransactions(parsedSession.id),
          ]);

          if (customerData) {
            setCurrentPoints(customerData.loyalty_points || 1240);
            setLoyaltyTier(customerData.loyalty_tier || 'bronze');
            const earned = transactions
              .filter(t => t.type === 'earn')
              .reduce((sum, t) => sum + t.points, 0);
            setLifetimePoints(earned || customerData.loyalty_points || 1555);
          }

          if (transactions && transactions.length > 0) {
            const formattedHistory: PointsActivity[] = transactions.map(t => ({
              id: t.id,
              description: t.description || `${t.type === 'earn' ? 'Earned' : 'Redeemed'} points`,
              points: t.type === 'earn' ? t.points : -t.points,
              type: t.type === 'earn' ? 'earned' : 'redeemed',
              date: new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            }));
            setPointsHistory(formattedHistory.length > 0 ? formattedHistory : mockPointsHistory);
          }
        }
      } catch (error) {
        console.error('Error loading rewards data:', error);
      }
      
      setLoading(false);
    };

    loadRewardsData();
  }, [router]);

  const currentTier = tiers.find(t => t.name === tierNameMap[loyaltyTier]) || 
    tiers.reduce((acc, tier) => lifetimePoints >= tier.minPoints ? tier : acc, tiers[0]);

  const nextTier = tiers.find(t => t.minPoints > lifetimePoints);
  const pointsToNextTier = nextTier ? nextTier.minPoints - lifetimePoints : 0;

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const handleRedeem = (reward: Reward) => {
    if (currentPoints >= reward.pointsCost) {
      showToast(`Redeemed: ${reward.name}! Check your email for details.`);
    }
  };

  return (
    <CustomerLayout title="Rewards">
      <div style={styles.page}>
        {toast && (
          <div style={styles.toast}>
            <Check size={16} color={NEON_GREEN} />
            <span>{toast}</span>
          </div>
        )}

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Rewards Program</h1>
            <p style={styles.subtitle}>Earn points with every purchase and redeem for rewards</p>
          </div>
        </div>

        {loading ? (
          <div style={styles.loadingContainer}>
            <Loader2 size={32} color={NEON_GREEN} style={{ animation: 'spin 1s linear infinite' }} />
            <p style={styles.loadingText}>Loading your rewards...</p>
          </div>
        ) : (
          <>
            <div style={styles.pointsCard}>
              <div style={styles.pointsMain}>
                <div style={styles.pointsIcon}>
                  <Gift size={32} color={NEON_GREEN} />
                </div>
                <div style={styles.pointsInfo}>
                  <span style={styles.pointsLabel}>Available Points</span>
                  <span style={styles.pointsValue}>{currentPoints.toLocaleString()}</span>
                  <span style={styles.pointsDollar}>≈ ${(currentPoints / 100).toFixed(2)} value</span>
                </div>
              </div>
              <div style={styles.tierSection}>
                <div style={{ ...styles.tierBadge, backgroundColor: `${currentTier.color}20`, color: currentTier.color }}>
                  <Trophy size={16} />
                  <span>{currentTier.name} ({currentTier.multiplier} points)</span>
                </div>
                {nextTier && (
                  <div style={styles.tierProgress}>
                    <span style={styles.tierProgressText}>
                      {pointsToNextTier} pts to {nextTier.name}
                    </span>
                    <div style={styles.progressBar}>
                      <div 
                        style={{ 
                          ...styles.progressFill, 
                          width: `${((lifetimePoints - currentTier.minPoints) / (nextTier.minPoints - currentTier.minPoints)) * 100}%` 
                        }} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={styles.earnSection}>
              <h2 style={styles.sectionTitle}>Ways to Earn</h2>
              <div style={styles.earnGrid}>
                <div style={styles.earnCard}>
                  <div style={styles.earnIcon}>🛒</div>
                  <div style={styles.earnContent}>
                    <h4 style={styles.earnTitle}>Shop</h4>
                    <p style={styles.earnText}>1 point per $1 spent</p>
                  </div>
                </div>
                <div style={styles.earnCard}>
                  <div style={styles.earnIcon}>📧</div>
                  <div style={styles.earnContent}>
                    <h4 style={styles.earnTitle}>Refer Friends</h4>
                    <p style={styles.earnText}>200 bonus points</p>
                  </div>
                </div>
                <div style={styles.earnCard}>
                  <div style={styles.earnIcon}>🎂</div>
                  <div style={styles.earnContent}>
                    <h4 style={styles.earnTitle}>Birthday</h4>
                    <p style={styles.earnText}>500 bonus points</p>
                  </div>
                </div>
                <div style={styles.earnCard}>
                  <div style={styles.earnIcon}>📝</div>
                  <div style={styles.earnContent}>
                    <h4 style={styles.earnTitle}>Leave Reviews</h4>
                    <p style={styles.earnText}>50 points per review</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.rewardsSection}>
              <h2 style={styles.sectionTitle}>Available Rewards</h2>
              <div style={styles.rewardsGrid}>
                {rewards.map((reward) => {
                  const canRedeem = currentPoints >= reward.pointsCost;
                  return (
                    <div 
                      key={reward.id} 
                      style={{
                        ...styles.rewardCard,
                        opacity: canRedeem ? 1 : 0.6,
                      }}
                    >
                      <div style={styles.rewardHeader}>
                        <span style={styles.rewardName}>{reward.name}</span>
                        <span style={styles.rewardPoints}>{reward.pointsCost.toLocaleString()} pts</span>
                      </div>
                      <p style={styles.rewardDesc}>{reward.description}</p>
                      <button 
                        onClick={() => handleRedeem(reward)}
                        disabled={!canRedeem}
                        style={{
                          ...styles.redeemButton,
                          ...(canRedeem ? {} : styles.redeemButtonDisabled),
                        }}
                      >
                        {canRedeem ? (
                          <>Redeem <ArrowRight size={14} /></>
                        ) : (
                          <><Lock size={14} /> {reward.pointsCost - currentPoints} more pts</>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={styles.historySection}>
              <h2 style={styles.sectionTitle}>Points History</h2>
              <div style={styles.historyCard}>
                {pointsHistory.map((activity) => (
                  <div key={activity.id} style={styles.historyRow}>
                    <div style={styles.historyIcon}>
                      {activity.type === 'earned' ? (
                        <Zap size={16} color={NEON_GREEN} />
                      ) : (
                        <Gift size={16} color="#8B5CF6" />
                      )}
                    </div>
                    <div style={styles.historyContent}>
                      <span style={styles.historyDesc}>{activity.description}</span>
                      <span style={styles.historyDate}>{activity.date}</span>
                    </div>
                    <span style={{
                      ...styles.historyPoints,
                      color: activity.type === 'earned' ? NEON_GREEN : '#8B5CF6',
                    }}>
                      {activity.type === 'earned' ? '+' : ''}{activity.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.tiersSection}>
              <h2 style={styles.sectionTitle}>Membership Tiers</h2>
              <div style={styles.tiersGrid}>
                {tiers.map((tier, index) => {
                  const isCurrentTier = tier.name === currentTier.name;
                  return (
                    <div 
                      key={tier.name} 
                      style={{
                        ...styles.tierCard,
                        ...(isCurrentTier ? { borderColor: tier.color } : {}),
                      }}
                    >
                      <div style={{ ...styles.tierCardBadge, color: tier.color }}>
                        {isCurrentTier && <Check size={14} />}
                        <span>{tier.name}</span>
                      </div>
                      <div style={styles.tierCardPoints}>
                        {tier.minPoints === 0 ? 'Start' : `${tier.minPoints.toLocaleString()} pts`}
                      </div>
                      <div style={styles.tierCardMultiplier}>
                        <Star size={14} color={tier.color} />
                        <span>{tier.multiplier} earning</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </CustomerLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 900,
    margin: '0 auto',
  },
  toast: {
    position: 'fixed',
    top: 24,
    right: 24,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 20px',
    backgroundColor: '#111111',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    zIndex: 1000,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  },
  header: {
    marginBottom: 24,
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
    marginTop: 8,
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 64,
    gap: 16,
  },
  loadingText: {
    color: '#666666',
    fontSize: 14,
  },
  pointsCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    padding: 24,
    background: `linear-gradient(135deg, rgba(0, 255, 133, 0.1) 0%, rgba(0, 255, 133, 0.02) 100%)`,
    border: `1px solid rgba(0, 255, 133, 0.2)`,
    borderRadius: 16,
    marginBottom: 32,
  },
  pointsMain: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
  },
  pointsIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  pointsLabel: {
    fontSize: 13,
    color: '#999999',
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 36,
    fontWeight: 700,
    color: '#FFFFFF',
  },
  pointsDollar: {
    fontSize: 14,
    color: NEON_GREEN,
    marginTop: 4,
  },
  tierSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  tierBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    borderRadius: 20,
    fontSize: 14,
    fontWeight: 600,
    backgroundColor: 'rgba(192, 192, 192, 0.1)',
    color: '#C0C0C0',
  },
  tierProgress: {
    flex: 1,
    minWidth: 200,
  },
  tierProgressText: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
    display: 'block',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: NEON_GREEN,
    borderRadius: 3,
    transition: 'width 0.3s ease',
  },
  earnSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 16px 0',
  },
  earnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 12,
  },
  earnCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
  },
  earnIcon: {
    fontSize: 24,
  },
  earnContent: {},
  earnTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  earnText: {
    fontSize: 12,
    color: '#666666',
    margin: '4px 0 0 0',
  },
  rewardsSection: {
    marginBottom: 32,
  },
  rewardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
  },
  rewardCard: {
    padding: 20,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
  },
  rewardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rewardName: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  rewardPoints: {
    fontSize: 13,
    color: NEON_GREEN,
    fontWeight: 600,
  },
  rewardDesc: {
    fontSize: 13,
    color: '#666666',
    margin: '0 0 16px 0',
    flex: 1,
  },
  redeemButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '10px 16px',
    backgroundColor: NEON_GREEN,
    border: 'none',
    borderRadius: 8,
    color: '#000000',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  redeemButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#666666',
    cursor: 'not-allowed',
  },
  historySection: {
    marginBottom: 32,
  },
  historyCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    overflow: 'hidden',
  },
  historyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '14px 20px',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  historyIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyContent: {
    flex: 1,
  },
  historyDesc: {
    display: 'block',
    fontSize: 14,
    color: '#FFFFFF',
  },
  historyDate: {
    display: 'block',
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  historyPoints: {
    fontSize: 14,
    fontWeight: 600,
  },
  tiersSection: {
    marginBottom: 32,
  },
  tiersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 12,
  },
  tierCard: {
    padding: 16,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    textAlign: 'center',
  },
  tierCardBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 8,
  },
  tierCardPoints: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 8,
  },
  tierCardMultiplier: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    fontSize: 13,
    color: '#999999',
  },
};
