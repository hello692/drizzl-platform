import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '../../hooks/useRole';
import {
  SocialAccount,
  SocialPost,
  PlatformStats,
  Platform,
  getPlatformLabel,
  getPlatformBadge,
  getPlatformColor,
  formatNumber,
  formatDate,
} from '../../lib/socialService';

type TabType = 'overview' | 'posts' | 'analytics';

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

  function PlatformBadge({ platform }: { platform: Platform }) {
    const colors = getPlatformColor(platform);
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '28px',
        height: '28px',
        borderRadius: '6px',
        background: colors.bg,
        color: colors.text,
        fontSize: '10px',
        fontWeight: '700',
        letterSpacing: '0.5px',
      }}>
        {getPlatformBadge(platform)}
      </span>
    );
  }

  function ConnectionStatus({ connected }: { connected: boolean }) {
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '9999px',
        background: connected ? '#dcfce7' : '#f3f4f6',
        color: connected ? '#166534' : '#6b7280',
        fontSize: '12px',
        fontWeight: '500',
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: connected ? '#22c55e' : '#9ca3af',
        }} />
        {connected ? 'Connected' : 'Not Connected'}
      </span>
    );
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

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa' }}>
      <nav style={{ background: '#000', color: '#fff', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/admin" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', fontWeight: '700', letterSpacing: '-0.5px' }}>
          DRIZZL ADMIN
        </Link>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href="/admin/command-center" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Command Center</Link>
          <Link href="/admin/video-manager" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Videos</Link>
          <Link href="/admin/social" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 1, fontWeight: '600' }}>Social</Link>
          <Link href="/admin/inventory" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Inventory</Link>
          <Link href="/admin/products" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Products</Link>
          <Link href="/admin/orders" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Orders</Link>
          <Link href="/admin/partners" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Partners</Link>
          <Link href="/admin/banking" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.8 }}>Banking</Link>
          <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '13px', opacity: 0.6 }}>Exit</Link>
        </div>
      </nav>

      <main style={{ padding: '40px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.5px', color: '#111' }}>Social Media</h1>
            <p style={{ color: '#666', fontSize: '14px' }}>Manage accounts, track performance, and schedule posts</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => showComingSoon('Post Scheduling')}
              style={{
                padding: '10px 20px',
                background: '#fff',
                color: '#111',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{ fontSize: '14px' }}>📅</span> Schedule Post
            </button>
            <button
              onClick={() => showComingSoon('Account Connection')}
              style={{
                padding: '10px 20px',
                background: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{ fontSize: '14px' }}>+</span> Connect Account
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Total Followers</p>
            <p style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px', color: '#111' }}>{formatNumber(totalFollowers)}</p>
            <p style={{ fontSize: '12px', color: '#22c55e', marginTop: '4px' }}>+12.3% this month</p>
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Engagement (30d)</p>
            <p style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px', color: '#111' }}>{formatNumber(totalEngagement)}</p>
            <p style={{ fontSize: '12px', color: '#22c55e', marginTop: '4px' }}>+8.7% vs last period</p>
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Total Posts</p>
            <p style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px', color: '#111' }}>{totalPosts}</p>
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>Last 30 days</p>
          </div>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <p style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Accounts</p>
            <p style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px', color: '#111' }}>{accounts.length}</p>
            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>All connected</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: '#fff', borderRadius: '8px', padding: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            {(['overview', 'posts', 'analytics'] as TabType[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  background: activeTab === tab ? '#000' : 'transparent',
                  color: activeTab === tab ? '#fff' : '#666',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textTransform: 'capitalize',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {loadingData ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#666' }}>Loading social data...</div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#111' }}>Connected Accounts</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {accounts.map(account => (
                      <div key={account.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '16px',
                        background: '#f9fafb',
                        borderRadius: '10px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <PlatformBadge platform={account.platform} />
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>{account.accountName}</p>
                            <p style={{ fontSize: '12px', color: '#6b7280' }}>{account.handle}</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>{formatNumber(account.followers)}</p>
                            <p style={{ fontSize: '11px', color: '#6b7280' }}>followers</p>
                          </div>
                          <ConnectionStatus connected={account.isConnected} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => showComingSoon('Account Connection')}
                    style={{
                      width: '100%',
                      marginTop: '16px',
                      padding: '12px',
                      background: '#f3f4f6',
                      color: '#6b7280',
                      border: '2px dashed #e5e7eb',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>+</span> Connect New Account
                  </button>
                </div>

                <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px', color: '#111' }}>Platform Stats</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {platformStats.map(stat => (
                      <div key={stat.platform} style={{
                        padding: '16px',
                        background: '#f9fafb',
                        borderRadius: '10px',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <PlatformBadge platform={stat.platform} />
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>{getPlatformLabel(stat.platform)}</span>
                          </div>
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>{stat.postCount} posts</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                          <div>
                            <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Followers</p>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>{formatNumber(stat.followers)}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Engagement</p>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>{formatNumber(stat.engagement30Days)}</p>
                          </div>
                          <div>
                            <p style={{ fontSize: '11px', color: '#6b7280', marginBottom: '2px' }}>Avg Rate</p>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#111' }}>{stat.avgEngagementRate}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1', background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111' }}>Social Wall</h2>
                    <select
                      value={platformFilter}
                      onChange={(e) => setPlatformFilter(e.target.value)}
                      style={{
                        padding: '8px 12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        fontSize: '13px',
                        background: '#fff',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="all">All Platforms</option>
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="facebook">Facebook</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {filteredPosts.slice(0, 8).map(post => (
                      <div key={post.id} style={{
                        minWidth: '280px',
                        background: '#f9fafb',
                        borderRadius: '10px',
                        padding: '16px',
                        flexShrink: 0,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <PlatformBadge platform={post.platform} />
                          <span style={{ fontSize: '11px', color: '#6b7280' }}>{formatDate(post.postedAt)}</span>
                        </div>
                        <p style={{
                          fontSize: '13px',
                          color: '#374151',
                          lineHeight: '1.5',
                          marginBottom: '12px',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {post.content}
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
                          <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '12px', fontWeight: '600', color: '#111' }}>{formatNumber(post.views)}</p>
                            <p style={{ fontSize: '10px', color: '#6b7280' }}>views</p>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '12px', fontWeight: '600', color: '#111' }}>{formatNumber(post.likes)}</p>
                            <p style={{ fontSize: '10px', color: '#6b7280' }}>likes</p>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '12px', fontWeight: '600', color: '#111' }}>{formatNumber(post.comments)}</p>
                            <p style={{ fontSize: '10px', color: '#6b7280' }}>comments</p>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '12px', fontWeight: '600', color: '#111' }}>{formatNumber(post.shares)}</p>
                            <p style={{ fontSize: '10px', color: '#6b7280' }}>shares</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'posts' && (
              <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: '600', color: '#111' }}>Post Performance</h2>
                  <select
                    value={platformFilter}
                    onChange={(e) => setPlatformFilter(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      fontSize: '13px',
                      background: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="all">All Platforms</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Platform</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Content</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Posted</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Views</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Likes</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Comments</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Shares</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Saves</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPosts.map((post, index) => (
                      <tr key={post.id} style={{ borderTop: '1px solid #f3f4f6', background: index % 2 === 1 ? '#fafafa' : '#fff' }}>
                        <td style={{ padding: '14px 16px' }}>
                          <PlatformBadge platform={post.platform} />
                        </td>
                        <td style={{ padding: '14px 16px', maxWidth: '300px' }}>
                          <p style={{
                            fontSize: '13px',
                            color: '#374151',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            {post.content}
                          </p>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', color: '#6b7280' }}>{formatDate(post.postedAt)}</td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '500', color: '#111', textAlign: 'right' }}>{formatNumber(post.views)}</td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '500', color: '#111', textAlign: 'right' }}>{formatNumber(post.likes)}</td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '500', color: '#111', textAlign: 'right' }}>{formatNumber(post.comments)}</td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '500', color: '#111', textAlign: 'right' }}>{formatNumber(post.shares)}</td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '500', color: '#111', textAlign: 'right' }}>{post.saves > 0 ? formatNumber(post.saves) : '—'}</td>
                        <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', textAlign: 'right' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: post.engagementRate >= 5 ? '#dcfce7' : post.engagementRate >= 2 ? '#fef3c7' : '#fee2e2',
                            color: post.engagementRate >= 5 ? '#166534' : post.engagementRate >= 2 ? '#92400e' : '#991b1b',
                          }}>
                            {post.engagementRate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredPosts.length === 0 && (
                      <tr>
                        <td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No posts found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#111' }}>Engagement Trends</h2>
                  <div style={{
                    height: '200px',
                    background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#9ca3af',
                    fontSize: '14px',
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>📈</span>
                      <p>Chart visualization coming soon</p>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#111' }}>AI Performance Analysis</h2>
                  <div style={{
                    height: '200px',
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#92400e',
                    fontSize: '14px',
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>✨</span>
                      <p>AI insights coming soon</p>
                    </div>
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1', background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#111' }}>Top Performing Content</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {posts.slice(0, 3).map((post, index) => (
                      <div key={post.id} style={{
                        padding: '20px',
                        background: '#f9fafb',
                        borderRadius: '10px',
                        position: 'relative',
                      }}>
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: index === 0 ? '#fbbf24' : index === 1 ? '#9ca3af' : '#d97706',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: '700',
                        }}>
                          {index + 1}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          <PlatformBadge platform={post.platform} />
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>{formatDate(post.postedAt)}</span>
                        </div>
                        <p style={{
                          fontSize: '13px',
                          color: '#374151',
                          lineHeight: '1.5',
                          marginBottom: '16px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {post.content}
                        </p>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <div>
                            <p style={{ fontSize: '16px', fontWeight: '700', color: '#111' }}>{formatNumber(post.views)}</p>
                            <p style={{ fontSize: '11px', color: '#6b7280' }}>views</p>
                          </div>
                          <div>
                            <p style={{ fontSize: '16px', fontWeight: '700', color: '#111' }}>{post.engagementRate}%</p>
                            <p style={{ fontSize: '11px', color: '#6b7280' }}>engagement</p>
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
      </main>

      {showComingSoonModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowComingSoonModal(false); }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚀</div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#111' }}>Coming Soon</h3>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>
              {comingSoonFeature} is currently in development. We&apos;re working hard to bring this feature to you soon!
            </p>
            <button
              onClick={() => setShowComingSoonModal(false)}
              style={{
                padding: '12px 32px',
                background: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
