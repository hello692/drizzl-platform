import React, { useState, useEffect, useMemo } from 'react';
import { useRequireAdmin } from '../../hooks/useRole';
import AdminLayout from '../../components/AdminLayout';
import {
  SocialAccount,
  SocialPost,
  PlatformStats,
  Platform,
  getPlatformLabel,
  formatNumber,
  formatDate,
} from '../../lib/socialService';

type TabType = 'overview' | 'posts' | 'analytics';

const platformGradients: Record<Platform, string> = {
  instagram: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  tiktok: 'linear-gradient(135deg, #00f5d4 0%, #00bbf9 100%)',
  facebook: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
};

const platformIcons: Record<Platform, React.ReactNode> = {
  instagram: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  ),
  tiktok: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  ),
  facebook: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  ),
};

function GradientIcon({ type, size = 24 }: { type: 'calendar' | 'plus' | 'chart' | 'sparkle' | 'rocket'; size?: number }) {
  const icons: Record<string, React.ReactNode> = {
    calendar: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="url(#iconGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    plus: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    ),
    chart: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="url(#chartGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#43e97b" />
            <stop offset="100%" stopColor="#38f9d7" />
          </linearGradient>
        </defs>
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    sparkle: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="url(#sparkleGradient)">
        <defs>
          <linearGradient id="sparkleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f093fb" />
            <stop offset="100%" stopColor="#f5576c" />
          </linearGradient>
        </defs>
        <path d="M12 2L13.09 8.26L19 9.27L14.55 13.97L15.82 20L12 16.77L8.18 20L9.45 13.97L5 9.27L10.91 8.26L12 2Z"/>
      </svg>
    ),
    rocket: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="url(#rocketGradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <defs>
          <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
        <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
      </svg>
    ),
  };
  return icons[type] || null;
}

export default function SocialDashboard() {
  const { loading, authorized } = useRequireAdmin();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [platformStats, setPlatformStats] = useState<PlatformStats[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState('');

  useEffect(() => {
    if (authorized) {
      loadSocialData();
    }
  }, [authorized]);

  async function loadSocialData() {
    try {
      const response = await fetch('/api/admin/social');
      const data = await response.json();
      if (data.success) {
        setAccounts(data.data.accounts || []);
        setPosts(data.data.posts || []);
        setPlatformStats(data.data.platformStats || []);
      }
    } catch (error) {
      console.error('Error loading social data:', error);
    } finally {
      setLoadingData(false);
    }
  }

  const filteredPosts = useMemo(() => {
    if (platformFilter === 'all') return posts;
    return posts.filter(post => post.platform === platformFilter);
  }, [posts, platformFilter]);

  const totalFollowers = useMemo(() => {
    return accounts.reduce((sum, acc) => sum + acc.followers, 0);
  }, [accounts]);

  const totalEngagement = useMemo(() => {
    return platformStats.reduce((sum, stat) => sum + stat.engagement30Days, 0);
  }, [platformStats]);

  const totalPosts = useMemo(() => {
    return posts.length;
  }, [posts]);

  function showComingSoon(feature: string) {
    setComingSoonFeature(feature);
    setShowComingSoonModal(true);
  }

  function PlatformBadge({ platform, size = 'default' }: { platform: Platform; size?: 'default' | 'large' }) {
    const isLarge = size === 'large';
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: isLarge ? '36px' : '28px',
        height: isLarge ? '36px' : '28px',
        borderRadius: '8px',
        background: platformGradients[platform],
        color: '#fff',
        boxShadow: `0 4px 15px ${platform === 'instagram' ? 'rgba(240, 147, 251, 0.4)' : platform === 'tiktok' ? 'rgba(0, 245, 212, 0.4)' : 'rgba(79, 172, 254, 0.4)'}`,
      }}>
        {platformIcons[platform]}
      </span>
    );
  }

  function ConnectionStatus({ connected }: { connected: boolean }) {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        borderRadius: '9999px',
        background: connected ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.05)',
        border: `1px solid ${connected ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
        color: connected ? '#4ade80' : 'rgba(255, 255, 255, 0.5)',
        fontSize: '12px',
        fontWeight: '500',
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: connected ? '#22c55e' : 'rgba(255, 255, 255, 0.3)',
          boxShadow: connected ? '0 0 8px rgba(34, 197, 94, 0.6)' : 'none',
        }} />
        {connected ? 'Connected' : 'Not Connected'}
      </span>
    );
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
    <AdminLayout title="Social Media" subtitle="Account Management">
      <div style={styles.headerActions}>
        <button onClick={() => showComingSoon('Post Scheduling')} style={styles.secondaryButton}>
          <GradientIcon type="calendar" size={16} />
          <span>Schedule Post</span>
        </button>
        <button onClick={() => showComingSoon('Account Connection')} style={styles.primaryButton}>
          <GradientIcon type="plus" size={16} />
          <span>Connect Account</span>
        </button>
      </div>

      <div style={styles.statsGrid}>
          <StatCard 
            label="Total Followers" 
            value={formatNumber(totalFollowers)} 
            change="+12.3%" 
            loading={loadingData} 
            accent="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" 
          />
          <StatCard 
            label="Engagement (30d)" 
            value={formatNumber(totalEngagement)} 
            change="+8.7%" 
            loading={loadingData} 
            accent="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" 
          />
          <StatCard 
            label="Total Posts" 
            value={totalPosts.toString()} 
            subtext="Last 30 days" 
            loading={loadingData} 
            accent="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" 
          />
          <StatCard 
            label="Accounts" 
            value={accounts.length.toString()} 
            subtext="All connected" 
            loading={loadingData} 
            accent="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
          />
        </div>

        <div style={styles.tabsContainer}>
          <div style={styles.tabsWrapper}>
            {(['overview', 'posts', 'analytics'] as TabType[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={activeTab === tab ? styles.tabActive : styles.tab}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loadingData ? (
          <div style={styles.loadingContent}>
            <div style={styles.loadingSpinner} />
            <p>Loading social data...</p>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div style={styles.overviewGrid}>
                <div style={styles.glassCard}>
                  <h2 style={styles.cardTitle}>Connected Accounts</h2>
                  <div style={styles.accountsList}>
                    {accounts.map(account => (
                      <div key={account.id} style={styles.accountItem}>
                        <div style={styles.accountInfo}>
                          <PlatformBadge platform={account.platform} />
                          <div>
                            <p style={styles.accountName}>{account.accountName}</p>
                            <p style={styles.accountHandle}>{account.handle}</p>
                          </div>
                        </div>
                        <div style={styles.accountStats}>
                          <div style={styles.accountFollowers}>
                            <p style={styles.followerCount}>{formatNumber(account.followers)}</p>
                            <p style={styles.followerLabel}>followers</p>
                          </div>
                          <ConnectionStatus connected={account.isConnected} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => showComingSoon('Account Connection')} style={styles.addAccountButton}>
                    <GradientIcon type="plus" size={16} />
                    <span>Connect New Account</span>
                  </button>
                </div>

                <div style={styles.glassCard}>
                  <h2 style={styles.cardTitle}>Platform Stats</h2>
                  <div style={styles.platformStatsList}>
                    {platformStats.map(stat => (
                      <div key={stat.platform} style={styles.platformStatItem}>
                        <div style={styles.platformStatHeader}>
                          <div style={styles.platformStatInfo}>
                            <PlatformBadge platform={stat.platform} />
                            <span style={styles.platformName}>{getPlatformLabel(stat.platform)}</span>
                          </div>
                          <span style={styles.postCount}>{stat.postCount} posts</span>
                        </div>
                        <div style={styles.platformMetrics}>
                          <div style={styles.metric}>
                            <p style={styles.metricLabel}>Followers</p>
                            <p style={styles.metricValue}>{formatNumber(stat.followers)}</p>
                          </div>
                          <div style={styles.metric}>
                            <p style={styles.metricLabel}>Engagement</p>
                            <p style={styles.metricValue}>{formatNumber(stat.engagement30Days)}</p>
                          </div>
                          <div style={styles.metric}>
                            <p style={styles.metricLabel}>Avg Rate</p>
                            <p style={styles.metricValue}>{stat.avgEngagementRate}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ ...styles.glassCard, gridColumn: '1 / -1' }}>
                  <div style={styles.socialWallHeader}>
                    <h2 style={styles.cardTitle}>Social Wall</h2>
                    <select
                      value={platformFilter}
                      onChange={(e) => setPlatformFilter(e.target.value)}
                      style={styles.filterSelect}
                    >
                      <option value="all">All Platforms</option>
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="facebook">Facebook</option>
                    </select>
                  </div>
                  <div style={styles.socialWall}>
                    {filteredPosts.slice(0, 8).map(post => (
                      <div key={post.id} style={styles.postCard}>
                        <div style={styles.postHeader}>
                          <PlatformBadge platform={post.platform} />
                          <span style={styles.postDate}>{formatDate(post.postedAt)}</span>
                        </div>
                        <p style={styles.postContent}>{post.content}</p>
                        <div style={styles.postMetrics}>
                          <div style={styles.postMetric}>
                            <p style={styles.postMetricValue}>{formatNumber(post.views)}</p>
                            <p style={styles.postMetricLabel}>views</p>
                          </div>
                          <div style={styles.postMetric}>
                            <p style={styles.postMetricValue}>{formatNumber(post.likes)}</p>
                            <p style={styles.postMetricLabel}>likes</p>
                          </div>
                          <div style={styles.postMetric}>
                            <p style={styles.postMetricValue}>{formatNumber(post.comments)}</p>
                            <p style={styles.postMetricLabel}>comments</p>
                          </div>
                          <div style={styles.postMetric}>
                            <p style={styles.postMetricValue}>{formatNumber(post.shares)}</p>
                            <p style={styles.postMetricLabel}>shares</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'posts' && (
              <div style={styles.glassCard}>
                <div style={styles.tableHeader}>
                  <h2 style={styles.cardTitle}>Post Performance</h2>
                  <select
                    value={platformFilter}
                    onChange={(e) => setPlatformFilter(e.target.value)}
                    style={styles.filterSelect}
                  >
                    <option value="all">All Platforms</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </div>
                <div style={styles.tableWrapper}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Platform</th>
                        <th style={{ ...styles.th, textAlign: 'left' }}>Content</th>
                        <th style={styles.th}>Posted</th>
                        <th style={{ ...styles.th, textAlign: 'right' }}>Views</th>
                        <th style={{ ...styles.th, textAlign: 'right' }}>Likes</th>
                        <th style={{ ...styles.th, textAlign: 'right' }}>Comments</th>
                        <th style={{ ...styles.th, textAlign: 'right' }}>Shares</th>
                        <th style={{ ...styles.th, textAlign: 'right' }}>Saves</th>
                        <th style={{ ...styles.th, textAlign: 'right' }}>Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPosts.map((post, index) => (
                        <tr key={post.id} style={{ background: index % 2 === 1 ? 'rgba(255, 255, 255, 0.02)' : 'transparent' }}>
                          <td style={styles.td}>
                            <PlatformBadge platform={post.platform} />
                          </td>
                          <td style={{ ...styles.td, maxWidth: '300px' }}>
                            <p style={styles.tableContent}>{post.content}</p>
                          </td>
                          <td style={{ ...styles.td, color: 'rgba(255, 255, 255, 0.5)' }}>{formatDate(post.postedAt)}</td>
                          <td style={{ ...styles.td, textAlign: 'right', fontWeight: '500' }}>{formatNumber(post.views)}</td>
                          <td style={{ ...styles.td, textAlign: 'right', fontWeight: '500' }}>{formatNumber(post.likes)}</td>
                          <td style={{ ...styles.td, textAlign: 'right', fontWeight: '500' }}>{formatNumber(post.comments)}</td>
                          <td style={{ ...styles.td, textAlign: 'right', fontWeight: '500' }}>{formatNumber(post.shares)}</td>
                          <td style={{ ...styles.td, textAlign: 'right', fontWeight: '500' }}>{post.saves > 0 ? formatNumber(post.saves) : '—'}</td>
                          <td style={{ ...styles.td, textAlign: 'right' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: post.engagementRate >= 5 
                                ? 'rgba(34, 197, 94, 0.15)' 
                                : post.engagementRate >= 2 
                                  ? 'rgba(251, 191, 36, 0.15)' 
                                  : 'rgba(239, 68, 68, 0.15)',
                              color: post.engagementRate >= 5 
                                ? '#4ade80' 
                                : post.engagementRate >= 2 
                                  ? '#fbbf24' 
                                  : '#f87171',
                              boxShadow: post.engagementRate >= 5 
                                ? '0 0 10px rgba(34, 197, 94, 0.3)' 
                                : post.engagementRate >= 2 
                                  ? '0 0 10px rgba(251, 191, 36, 0.3)' 
                                  : '0 0 10px rgba(239, 68, 68, 0.3)',
                            }}>
                              {post.engagementRate}%
                            </span>
                          </td>
                        </tr>
                      ))}
                      {filteredPosts.length === 0 && (
                        <tr>
                          <td colSpan={9} style={{ ...styles.td, textAlign: 'center', padding: '40px', color: 'rgba(255, 255, 255, 0.4)' }}>
                            No posts found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div style={styles.analyticsGrid}>
                <div style={styles.glassCard}>
                  <h2 style={styles.cardTitle}>Engagement Trends</h2>
                  <div style={styles.chartPlaceholder}>
                    <div style={styles.placeholderContent}>
                      <GradientIcon type="chart" size={48} />
                      <p style={styles.placeholderText}>Chart visualization coming soon</p>
                    </div>
                  </div>
                </div>

                <div style={styles.glassCard}>
                  <h2 style={styles.cardTitle}>AI Performance Analysis</h2>
                  <div style={{ ...styles.chartPlaceholder, background: 'linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, rgba(245, 87, 108, 0.05) 100%)' }}>
                    <div style={styles.placeholderContent}>
                      <GradientIcon type="sparkle" size={48} />
                      <p style={styles.placeholderText}>AI insights coming soon</p>
                    </div>
                  </div>
                </div>

                <div style={{ ...styles.glassCard, gridColumn: '1 / -1' }}>
                  <h2 style={styles.cardTitle}>Top Performing Content</h2>
                  <div style={styles.topPostsGrid}>
                    {posts.slice(0, 3).map((post, index) => (
                      <div key={post.id} style={styles.topPostCard}>
                        <div style={styles.rankBadge}>
                          <span style={{
                            ...styles.rankNumber,
                            background: index === 0 
                              ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' 
                              : index === 1 
                                ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)' 
                                : 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                          }}>
                            {index + 1}
                          </span>
                        </div>
                        <div style={styles.topPostHeader}>
                          <PlatformBadge platform={post.platform} />
                          <span style={styles.topPostDate}>{formatDate(post.postedAt)}</span>
                        </div>
                        <p style={styles.topPostContent}>{post.content}</p>
                        <div style={styles.topPostStats}>
                          <div>
                            <p style={styles.topPostValue}>{formatNumber(post.views)}</p>
                            <p style={styles.topPostLabel}>views</p>
                          </div>
                          <div>
                            <p style={styles.topPostValue}>{post.engagementRate}%</p>
                            <p style={styles.topPostLabel}>engagement</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

      {showComingSoonModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowComingSoonModal(false); }}
          style={styles.modalOverlay}
        >
          <div style={styles.modal}>
            <div style={styles.modalIcon}>
              <GradientIcon type="rocket" size={48} />
            </div>
            <h3 style={styles.modalTitle}>Coming Soon</h3>
            <p style={styles.modalText}>
              {comingSoonFeature} is currently in development. We&apos;re working hard to bring this feature to you soon!
            </p>
            <button onClick={() => setShowComingSoonModal(false)} style={styles.modalButton}>
              Got it
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </AdminLayout>
  );
}

function StatCard({ label, value, change, subtext, loading, accent }: { 
  label: string; 
  value: string; 
  change?: string;
  subtext?: string;
  loading: boolean; 
  accent: string;
}) {
  return (
    <div style={styles.statCard}>
      <div style={{ ...styles.statAccent, background: accent }} />
      <p style={styles.statLabel}>{label}</p>
      <p style={styles.statValue}>
        {loading ? <span style={styles.skeleton} /> : value}
      </p>
      {change && <p style={styles.statChange}>{change}</p>}
      {subtext && <p style={styles.statSubtext}>{subtext}</p>}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
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
    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    animation: 'pulse 2s ease-in-out infinite, glow 2s ease-in-out infinite',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
  },
  loadingContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px',
    gap: '16px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255, 255, 255, 0.1)',
    borderTopColor: '#f093fb',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  secondaryButton: {
    padding: '12px 20px',
    background: 'rgba(255, 255, 255, 0.05)',
    color: '#fff',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.2s',
  },
  primaryButton: {
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    transition: 'all 0.2s',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    marginBottom: '32px',
  },
  statCard: {
    position: 'relative',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255,255,255,0.06)',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
  },
  statAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '3px',
    height: '100%',
  },
  statLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '12px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '600',
    letterSpacing: '-1px',
  },
  statChange: {
    fontSize: '12px',
    color: '#4ade80',
    marginTop: '4px',
  },
  statSubtext: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: '4px',
  },
  skeleton: {
    display: 'inline-block',
    width: '80px',
    height: '32px',
    background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    borderRadius: '4px',
  },
  tabsContainer: {
    marginBottom: '24px',
  },
  tabsWrapper: {
    display: 'inline-flex',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    padding: '4px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
  },
  tab: {
    padding: '12px 24px',
    border: 'none',
    background: 'transparent',
    color: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  tabActive: {
    padding: '12px 24px',
    border: 'none',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
  },
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  glassCard: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '20px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    backdropFilter: 'blur(10px)',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#fff',
  },
  accountsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  accountItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.04)',
  },
  accountInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  accountName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
  },
  accountHandle: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  accountStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  accountFollowers: {
    textAlign: 'right' as const,
  },
  followerCount: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
  },
  followerLabel: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  addAccountButton: {
    width: '100%',
    marginTop: '16px',
    padding: '14px',
    background: 'transparent',
    color: 'rgba(255, 255, 255, 0.5)',
    border: '2px dashed rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s',
  },
  platformStatsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  platformStatItem: {
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.04)',
  },
  platformStatHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  platformStatInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  platformName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
  },
  postCount: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  platformMetrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  metric: {},
  metricLabel: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.4)',
    marginBottom: '2px',
  },
  metricValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
  },
  socialWallHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  filterSelect: {
    padding: '10px 16px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#fff',
    cursor: 'pointer',
    outline: 'none',
  },
  socialWall: {
    display: 'flex',
    gap: '16px',
    overflowX: 'auto',
    paddingBottom: '8px',
  },
  postCard: {
    minWidth: '280px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    flexShrink: 0,
  },
  postHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  postDate: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  postContent: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: '1.5',
    marginBottom: '12px',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  postMetrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    paddingTop: '12px',
  },
  postMetric: {
    textAlign: 'center' as const,
  },
  postMetricValue: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#fff',
  },
  postMetricLabel: {
    fontSize: '10px',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '14px 16px',
    textAlign: 'left' as const,
    fontSize: '12px',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  },
  td: {
    padding: '14px 16px',
    fontSize: '13px',
    color: '#fff',
    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
  },
  tableContent: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.7)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  chartPlaceholder: {
    height: '200px',
    background: 'linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.05) 100%)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderContent: {
    textAlign: 'center' as const,
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
    marginTop: '12px',
  },
  topPostsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  topPostCard: {
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.04)',
    position: 'relative',
  },
  rankBadge: {
    position: 'absolute',
    top: '12px',
    right: '12px',
  },
  rankNumber: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
    color: '#fff',
  },
  topPostHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  topPostDate: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  topPostContent: {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: '1.5',
    marginBottom: '16px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  topPostStats: {
    display: 'flex',
    gap: '16px',
  },
  topPostValue: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#fff',
  },
  topPostLabel: {
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    background: 'rgba(20, 20, 20, 0.95)',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center' as const,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
  },
  modalIcon: {
    marginBottom: '20px',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '12px',
    color: '#fff',
  },
  modalText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '14px',
    marginBottom: '28px',
    lineHeight: '1.6',
  },
  modalButton: {
    padding: '14px 40px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
  },
};
