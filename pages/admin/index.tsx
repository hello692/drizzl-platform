import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRequireAdmin } from '../../hooks/useRole';
import AdminLayout from '../../components/AdminLayout';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  d2cOrders: number;
  b2bOrders: number;
  ordersLast7Days: number;
}

interface AISuggestion {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action: string;
  link: string;
  icon: string;
}

const modules = [
  { title: 'Command Center', description: 'Real-time business intelligence', link: '/admin/command-center', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { title: 'AI Assistant', description: 'Natural language business queries', link: '/admin/ai-assistant', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { title: 'Product Intel', description: 'SKU costing & margin analysis', link: '/admin/product-intel', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { title: 'Inventory', description: 'Track ingredients & packaging', link: '/admin/inventory', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { title: 'Factory', description: 'Production monitoring & batches', link: '/admin/factory', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { title: 'Order Intel', description: 'D2C & B2B order analytics', link: '/admin/order-intel', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { title: 'Content', description: 'Landing page content CMS', link: '/admin/video-manager', gradient: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)' },
  { title: 'Social Media', description: 'Manage accounts & performance', link: '/admin/social', gradient: 'linear-gradient(135deg, #8360c3 0%, #2ebf91 100%)' },
  { title: 'Banking', description: 'Financial intelligence & cash flow', link: '/admin/banking', gradient: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)' },
  { title: 'Products', description: 'Manage your product catalog', link: '/admin/products', gradient: 'linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)' },
  { title: 'Orders', description: 'View and manage orders', link: '/admin/orders', gradient: 'linear-gradient(135deg, #48c6ef 0%, #6f86d6 100%)' },
  { title: 'Partners', description: 'Manage retail partners', link: '/admin/partners', gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
];

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getFormattedDate(): string {
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  };
  return now.toLocaleDateString('en-US', options);
}

function generateAISuggestions(stats: DashboardStats | null): AISuggestion[] {
  const suggestions: AISuggestion[] = [];
  
  if (!stats || stats.totalOrders === 0) {
    suggestions.push({
      id: '1',
      title: 'Launch Your First Campaign',
      description: 'No orders detected yet. Consider running a promotional campaign to drive initial sales.',
      priority: 'high',
      action: 'Create Campaign',
      link: '/admin/social',
      icon: 'rocket'
    });
    suggestions.push({
      id: '2',
      title: 'Complete Product Catalog',
      description: 'Add products to your catalog to enable sales and track inventory.',
      priority: 'high',
      action: 'Add Products',
      link: '/admin/products',
      icon: 'box'
    });
  } else {
    if (stats.b2bOrders < stats.d2cOrders * 0.3) {
      suggestions.push({
        id: '1',
        title: 'Expand B2B Partnerships',
        description: 'B2B orders are lower than expected. Consider reaching out to more retail partners.',
        priority: 'medium',
        action: 'View Partners',
        link: '/admin/partners',
        icon: 'handshake'
      });
    }
    
    if (stats.ordersLast7Days < stats.totalOrders * 0.1) {
      suggestions.push({
        id: '2',
        title: 'Boost Recent Sales',
        description: 'Order velocity has slowed. Consider launching a flash sale or promotional offer.',
        priority: 'high',
        action: 'View Analytics',
        link: '/admin/order-intel',
        icon: 'chart'
      });
    }
  }
  
  suggestions.push({
    id: '3',
    title: 'Review Cash Flow',
    description: 'Monitor your burn rate and runway to ensure financial stability.',
    priority: 'low',
    action: 'Open Banking',
    link: '/admin/banking',
    icon: 'dollar'
  });
  
  suggestions.push({
    id: '4',
    title: 'Check Inventory Levels',
    description: 'Ensure you have adequate stock of ingredients and packaging materials.',
    priority: 'medium',
    action: 'View Inventory',
    link: '/admin/inventory',
    icon: 'warehouse'
  });
  
  return suggestions.slice(0, 3);
}

function useTypewriter(text: string, speed: number = 50) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    let index = 0;
    
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayedText, isComplete };
}

export default function AdminDashboard() {
  const { user, loading, authorized } = useRequireAdmin();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  
  const greeting = `${getTimeGreeting()}... ${getFormattedDate()}`;
  const { displayedText, isComplete } = useTypewriter(greeting, 40);
  
  const suggestions = generateAISuggestions(stats);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch('/api/admin/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error loading stats:', err);
        setStats({ totalOrders: 0, totalRevenue: 0, d2cOrders: 0, b2bOrders: 0, ordersLast7Days: 0 });
      } finally {
        setLoadingStats(false);
      }
    }

    if (authorized) loadStats();
  }, [authorized]);

  const handleAISubmit = async () => {
    if (!aiMessage.trim()) return;
    setAiLoading(true);
    
    try {
      const response = await fetch('/api/admin/ai-assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: aiMessage })
      });
      const data = await response.json();
      setAiResponse(data.response || 'I analyzed your request. Check the relevant module for detailed insights.');
      setAiMessage('');
    } catch (error) {
      setAiResponse('I can help you with business insights. Try asking about revenue, orders, or inventory.');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingOrb} />
        <p style={styles.loadingText}>Initializing</p>
        <style jsx global>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
            50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6); }
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
            0%, 100% { opacity: 0.4; }
            50% { opacity: 0.8; }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
            50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <AdminLayout>
      <section style={styles.aiGreetingSection}>
        <div style={styles.aiGreetingCard}>
          <div style={styles.aiIconWrapper}>
            <div style={styles.aiIconGlow} />
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#aiGradient)" strokeWidth="1.5">
              <defs>
                <linearGradient id="aiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 017 7h1.27c.34.6.73 1.26.73 2a2 2 0 01-4 0c0-.74.4-1.39 1-1.73V14a5 5 0 00-5-5h-1v1.27c.6.34 1 .99 1 1.73a2 2 0 01-4 0c0-.74.4-1.39 1-1.73V9h-1a5 5 0 00-5 5v.27c.6.34 1 .99 1 1.73a2 2 0 01-4 0c0-.74.4-1.39 1-1.73V14a7 7 0 017-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2z" />
            </svg>
          </div>
          <div style={styles.aiGreetingContent}>
            <p style={styles.aiLabel}>DRIZZL AI</p>
            <h1 style={styles.aiGreetingText}>
              {displayedText}
              {!isComplete && <span style={styles.cursor}>|</span>}
            </h1>
            <p style={styles.aiSubtext}>
              Your intelligent business companion is ready to help you make data-driven decisions.
            </p>
          </div>
        </div>

        <div style={styles.inlineAIChatBox}>
          <div style={styles.inlineAIChatHeader}>
            <span style={styles.inlineAIChatLabel}>Chat with DRIZZL AI</span>
          </div>
          {aiResponse && (
            <div style={styles.inlineAIResponseBubble}>
              <div style={styles.aiAvatar}>AI</div>
              <p style={styles.aiResponseText}>{aiResponse}</p>
            </div>
          )}
          <div style={styles.inlineAIInputRow}>
            <input
              type="text"
              value={aiMessage}
              onChange={(e) => setAiMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAISubmit()}
              placeholder="Ask about revenue, orders, inventory..."
              style={styles.inlineAIInput}
            />
            <button onClick={handleAISubmit} disabled={aiLoading} style={styles.inlineAISendBtn}>
              {aiLoading ? (
                <div style={styles.aiLoadingDot} />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </section>

      <section style={styles.summarySection}>
        <div style={styles.summaryHeader}>
          <h2 style={styles.sectionTitle}>Business Summary</h2>
          <Link href="/admin/command-center" style={styles.viewAllLink}>
            View Details
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div style={styles.statsGrid}>
          <StatCard label="Total Orders" value={stats?.totalOrders || 0} loading={loadingStats} accent="#667eea" icon="orders" />
          <StatCard label="Revenue" value={`$${((stats?.totalRevenue || 0) / 100).toLocaleString()}`} loading={loadingStats} accent="#43e97b" icon="revenue" />
          <StatCard label="D2C Orders" value={stats?.d2cOrders || 0} loading={loadingStats} accent="#4facfe" icon="d2c" />
          <StatCard label="B2B Orders" value={stats?.b2bOrders || 0} loading={loadingStats} accent="#f093fb" icon="b2b" />
        </div>
      </section>

      <section style={styles.suggestionsSection}>
        <div style={styles.suggestionsHeader}>
          <div style={styles.suggestionsTitle}>
            <div style={styles.sparkleIcon}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="url(#sparkleGrad)" strokeWidth="2">
                <defs>
                  <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <h2 style={styles.sectionTitle}>AI Recommendations</h2>
          </div>
          <button onClick={() => setShowAIChat(!showAIChat)} style={styles.askAIButton}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            Ask AI
          </button>
        </div>

        {showAIChat && (
          <div style={styles.aiChatBox}>
            <div style={styles.aiChatHeader}>
              <span style={styles.aiChatLabel}>Chat with DRIZZL AI</span>
              <button onClick={() => setShowAIChat(false)} style={styles.closeChatBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div style={styles.aiChatBody}>
              {aiResponse && (
                <div style={styles.aiResponseBubble}>
                  <div style={styles.aiAvatar}>AI</div>
                  <p style={styles.aiResponseText}>{aiResponse}</p>
                </div>
              )}
              <div style={styles.aiInputRow}>
                <input
                  type="text"
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAISubmit()}
                  placeholder="Ask about revenue, orders, inventory..."
                  style={styles.aiInput}
                />
                <button onClick={handleAISubmit} disabled={aiLoading} style={styles.aiSendBtn}>
                  {aiLoading ? (
                    <div style={styles.aiLoadingDot} />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        <div style={styles.suggestionsGrid}>
          {suggestions.map((suggestion) => (
            <SuggestionCard key={suggestion.id} suggestion={suggestion} />
          ))}
        </div>
      </section>

      <section style={styles.modulesSection}>
        <h2 style={styles.sectionTitle}>Intelligence Modules</h2>
        <div style={styles.modulesGrid}>
          {modules.map((mod) => (
            <ModuleCard key={mod.title} {...mod} />
          ))}
        </div>
      </section>

      <button onClick={() => setShowAIChat(true)} style={styles.floatingAIButton}>
        <div style={styles.floatingAIGlow} />
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      </button>

      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); }
          50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6); }
        }
        @keyframes floatAI {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </AdminLayout>
  );
}

function StatCard({ label, value, loading, accent, icon }: { label: string; value: string | number; loading: boolean; accent: string; icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    orders: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
      </svg>
    ),
    revenue: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
    d2c: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
      </svg>
    ),
    b2b: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  };

  return (
    <div style={{ ...styles.statCard, borderColor: `${accent}20` }}>
      <div style={{ ...styles.statAccent, background: accent }} />
      <div style={styles.statIconWrapper}>
        {icons[icon]}
      </div>
      <p style={styles.statLabel}>{label}</p>
      <p style={styles.statValue}>
        {loading ? <span style={styles.skeleton} /> : value}
      </p>
    </div>
  );
}

function SuggestionCard({ suggestion }: { suggestion: AISuggestion }) {
  const [hovered, setHovered] = useState(false);
  
  const priorityColors = {
    high: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: '#ef4444' },
    medium: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', text: '#f59e0b' },
    low: { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', text: '#22c55e' },
  };
  
  const colors = priorityColors[suggestion.priority];
  
  const icons: Record<string, React.ReactNode> = {
    rocket: <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09zM12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />,
    box: <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />,
    handshake: <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />,
    chart: <path d="M18 20V10M12 20V4M6 20v-6" />,
    dollar: <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />,
    warehouse: <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />,
  };
  
  return (
    <Link href={suggestion.link} style={{ textDecoration: 'none' }}>
      <div 
        style={{
          ...styles.suggestionCard,
          transform: hovered ? 'translateY(-2px)' : 'none',
          boxShadow: hovered ? '0 10px 30px rgba(0,0,0,0.3)' : 'none',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={styles.suggestionIconWrapper}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
            {icons[suggestion.icon]}
          </svg>
        </div>
        <div style={styles.suggestionContent}>
          <div style={styles.suggestionHeader}>
            <h3 style={styles.suggestionTitle}>{suggestion.title}</h3>
            <span style={{
              ...styles.priorityBadge,
              background: colors.bg,
              borderColor: colors.border,
              color: colors.text,
            }}>
              {suggestion.priority}
            </span>
          </div>
          <p style={styles.suggestionDesc}>{suggestion.description}</p>
        </div>
        <div style={{ ...styles.suggestionArrow, opacity: hovered ? 1 : 0.5 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

function ModuleCard({ title, description, link, gradient }: { title: string; description: string; link: string; gradient: string }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <Link href={link} style={{ textDecoration: 'none' }}>
      <div
        style={{
          ...styles.moduleCard,
          transform: hovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
          boxShadow: hovered ? '0 20px 40px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.2)',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div style={{ ...styles.moduleGradient, background: gradient, opacity: hovered ? 0.15 : 0.08 }} />
        <div style={{ ...styles.moduleIcon, background: gradient }}>
          {title.charAt(0)}
        </div>
        <h3 style={styles.moduleTitle}>{title}</h3>
        <p style={styles.moduleDesc}>{description}</p>
        <div style={{ ...styles.moduleArrow, opacity: hovered ? 1 : 0.5 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    animation: 'pulse 2s ease-in-out infinite, glow 2s ease-in-out infinite',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
  },
  aiGreetingSection: {
    marginBottom: '40px',
  },
  aiGreetingCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '24px',
    padding: '32px',
    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(236, 72, 153, 0.05) 100%)',
    borderRadius: '24px',
    border: '1px solid rgba(168, 85, 247, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  aiIconWrapper: {
    position: 'relative',
    width: '56px',
    height: '56px',
    borderRadius: '16px',
    background: 'rgba(168, 85, 247, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  aiIconGlow: {
    position: 'absolute',
    inset: '-4px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(236, 72, 153, 0.2) 100%)',
    filter: 'blur(10px)',
    animation: 'pulse 3s ease-in-out infinite',
  },
  aiGreetingContent: {
    flex: 1,
  },
  aiLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#a855f7',
    letterSpacing: '2px',
    marginBottom: '8px',
    textTransform: 'uppercase',
  },
  aiGreetingText: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '12px',
    lineHeight: 1.3,
    letterSpacing: '-0.5px',
  },
  cursor: {
    animation: 'blink 1s infinite',
    color: '#a855f7',
    marginLeft: '2px',
  },
  aiSubtext: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.6,
  },
  inlineAIChatBox: {
    marginTop: '20px',
    background: 'rgba(168, 85, 247, 0.06)',
    border: '1px solid rgba(168, 85, 247, 0.2)',
    borderRadius: '16px',
    overflow: 'hidden',
  },
  inlineAIChatHeader: {
    padding: '14px 20px',
    borderBottom: '1px solid rgba(168, 85, 247, 0.1)',
  },
  inlineAIChatLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#c084fc',
  },
  inlineAIResponseBubble: {
    display: 'flex',
    gap: '12px',
    padding: '16px 20px',
    background: 'rgba(168, 85, 247, 0.08)',
    borderBottom: '1px solid rgba(168, 85, 247, 0.1)',
  },
  inlineAIInputRow: {
    display: 'flex',
    gap: '12px',
    padding: '16px 20px',
  },
  inlineAIInput: {
    flex: 1,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '14px 18px',
    fontSize: '14px',
    color: '#fff',
    outline: 'none',
  },
  inlineAISendBtn: {
    width: '52px',
    height: '52px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)',
  },
  summarySection: {
    marginBottom: '40px',
  },
  summaryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  viewAllLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
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
  statIconWrapper: {
    marginBottom: '16px',
  },
  statLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '600',
    letterSpacing: '-1px',
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
  suggestionsSection: {
    marginBottom: '50px',
  },
  suggestionsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  suggestionsTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  sparkleIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'rgba(251, 191, 36, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  askAIButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0.1) 100%)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '10px',
    color: '#c084fc',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  aiChatBox: {
    background: 'rgba(20,20,25,0.95)',
    border: '1px solid rgba(168, 85, 247, 0.2)',
    borderRadius: '16px',
    marginBottom: '20px',
    overflow: 'hidden',
  },
  aiChatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    background: 'rgba(168, 85, 247, 0.08)',
    borderBottom: '1px solid rgba(168, 85, 247, 0.15)',
  },
  aiChatLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#c084fc',
  },
  closeChatBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    padding: '4px',
  },
  aiChatBody: {
    padding: '20px',
  },
  aiResponseBubble: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
    padding: '16px',
    background: 'rgba(168, 85, 247, 0.08)',
    borderRadius: '12px',
  },
  aiAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
    color: '#fff',
    flexShrink: 0,
  },
  aiResponseText: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 1.6,
  },
  aiInputRow: {
    display: 'flex',
    gap: '12px',
  },
  aiInput: {
    flex: 1,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '14px 16px',
    fontSize: '14px',
    color: '#fff',
    outline: 'none',
  },
  aiSendBtn: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiLoadingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#fff',
    animation: 'pulse 1s infinite',
  },
  suggestionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  suggestionCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '20px',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.06)',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
  },
  suggestionIconWrapper: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  suggestionContent: {
    flex: 1,
    minWidth: 0,
  },
  suggestionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  suggestionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    margin: 0,
  },
  priorityBadge: {
    fontSize: '10px',
    fontWeight: '600',
    padding: '3px 8px',
    borderRadius: '4px',
    border: '1px solid',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  suggestionDesc: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: 1.5,
    margin: 0,
  },
  suggestionArrow: {
    color: 'rgba(255,255,255,0.5)',
    transition: 'opacity 0.2s',
    flexShrink: 0,
  },
  sectionTitle: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontWeight: '500',
  },
  modulesSection: {
    marginBottom: '40px',
  },
  modulesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
    marginTop: '24px',
  },
  moduleCard: {
    position: 'relative',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '20px',
    padding: '28px',
    border: '1px solid rgba(255,255,255,0.06)',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
  },
  moduleGradient: {
    position: 'absolute',
    inset: 0,
    transition: 'opacity 0.3s',
  },
  moduleIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '20px',
    position: 'relative',
  },
  moduleTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px',
    position: 'relative',
  },
  moduleDesc: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: '1.5',
    position: 'relative',
  },
  moduleArrow: {
    position: 'absolute',
    bottom: '24px',
    right: '24px',
    color: 'rgba(255,255,255,0.6)',
    transition: 'opacity 0.3s',
  },
  floatingAIButton: {
    position: 'fixed',
    bottom: '32px',
    right: '32px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 40px rgba(168, 85, 247, 0.4)',
    animation: 'floatAI 3s ease-in-out infinite',
    zIndex: 100,
    transition: 'transform 0.2s',
  },
  floatingAIGlow: {
    position: 'absolute',
    inset: '-8px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.4) 0%, rgba(236, 72, 153, 0.3) 100%)',
    filter: 'blur(15px)',
    animation: 'pulse 2s ease-in-out infinite',
  },
};
