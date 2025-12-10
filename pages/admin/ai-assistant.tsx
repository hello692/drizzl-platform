import React, { useState, useRef, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import {
  Send,
  Sparkles,
  MessageSquare,
  TrendingUp,
  Package,
  Users,
  AlertTriangle,
  Clock,
  BarChart3,
  DollarSign,
  ShoppingCart,
  Factory,
  FileText,
  Zap,
  ChevronRight,
  Bot,
  User,
  AlertCircle,
} from 'lucide-react';

const isDemoMode = true;

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255,255,255,0.03)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface QuickInsight {
  id: string;
  title: string;
  icon: React.ReactNode;
  preview: string;
  prompt: string;
}

interface RecentConversation {
  id: string;
  topic: string;
  timestamp: string;
  messageCount: number;
}

interface Capability {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const suggestedPrompts = [
  "What's our best selling product?",
  "Show revenue trends",
  "Analyze customer retention",
  "Inventory status report",
];

const quickInsights: QuickInsight[] = [
  {
    id: 'revenue',
    title: 'Revenue Summary',
    icon: <DollarSign size={18} />,
    preview: '$1.2M this month',
    prompt: 'Give me a detailed revenue summary for this month',
  },
  {
    id: 'products',
    title: 'Top Products',
    icon: <Package size={18} />,
    preview: 'Strawberry Peach leads',
    prompt: 'What are our top selling products this month?',
  },
  {
    id: 'customers',
    title: 'Customer Insights',
    icon: <Users size={18} />,
    preview: '2,847 active customers',
    prompt: 'Analyze our customer base and retention metrics',
  },
  {
    id: 'inventory',
    title: 'Inventory Alerts',
    icon: <AlertTriangle size={18} />,
    preview: '3 items low stock',
    prompt: 'Show me current inventory alerts and low stock items',
  },
];

const recentConversations: RecentConversation[] = [
  { id: 'conv-1', topic: 'Q4 Revenue Analysis', timestamp: 'Today, 2:30 PM', messageCount: 8 },
  { id: 'conv-2', topic: 'Inventory Optimization', timestamp: 'Today, 11:15 AM', messageCount: 5 },
  { id: 'conv-3', topic: 'Customer Churn Report', timestamp: 'Yesterday, 4:45 PM', messageCount: 12 },
  { id: 'conv-4', topic: 'Production Efficiency', timestamp: 'Dec 8, 2025', messageCount: 6 },
  { id: 'conv-5', topic: 'B2B Pipeline Review', timestamp: 'Dec 7, 2025', messageCount: 9 },
];

const capabilities: Capability[] = [
  {
    id: 'sales',
    title: 'Sales Analysis',
    description: 'Revenue trends, order patterns, and sales forecasting',
    icon: <TrendingUp size={20} />,
  },
  {
    id: 'inventory',
    title: 'Inventory Queries',
    description: 'Stock levels, reorder points, and supply chain insights',
    icon: <Package size={20} />,
  },
  {
    id: 'customer',
    title: 'Customer Insights',
    description: 'Retention analysis, segmentation, and behavior patterns',
    icon: <Users size={20} />,
  },
  {
    id: 'financial',
    title: 'Financial Reports',
    description: 'Cash flow, margins, and profitability analysis',
    icon: <DollarSign size={20} />,
  },
  {
    id: 'production',
    title: 'Production Status',
    description: 'Manufacturing metrics, batch tracking, and efficiency',
    icon: <Factory size={20} />,
  },
];

const mockResponses: Record<string, string> = {
  "What's our best selling product?": `**Best Selling Product Analysis**

Based on the last 30 days of sales data:

🏆 **#1: Strawberry Peach Smoothie**
- Units Sold: 4,287
- Revenue: $128,610
- Growth: +23% vs last month

📊 **Top 5 Products:**
1. Strawberry Peach - $128,610 (28% of total)
2. Mango Jackfruit - $98,450 (21% of total)
3. Açaí Berry Bowl - $76,230 (16% of total)
4. Coffee Mushroom Blend - $62,180 (13% of total)
5. Chocolate Berry Fusion - $54,320 (12% of total)

💡 **Insight:** Strawberry Peach has maintained its #1 position for 6 consecutive months. Consider increasing production capacity by 15% to meet projected holiday demand.`,

  "Show revenue trends": `**Revenue Trend Analysis**

📈 **Monthly Performance:**
- November 2025: $1,247,832 (+18% YoY)
- October 2025: $1,089,456 (+15% YoY)
- September 2025: $982,340 (+12% YoY)

**Key Metrics:**
- Average Daily Revenue: $41,594
- Peak Day: Dec 5 ($68,432)
- D2C vs B2B Split: 62% / 38%

**Growth Drivers:**
1. New retail partnerships (+$145K)
2. Subscription program expansion (+$82K)
3. Holiday promotional campaigns (+$64K)

💡 **Forecast:** December is projected to reach $1.45M based on current trajectory and seasonal patterns.`,

  "Analyze customer retention": `**Customer Retention Analysis**

📊 **Retention Metrics:**
- 30-Day Retention: 78.4%
- 90-Day Retention: 62.1%
- Annual Retention: 45.8%

**Customer Segments:**
- VIP Customers (>$500/year): 847 customers
- Regular (3+ orders): 1,234 customers
- New (1-2 orders): 766 customers

**Churn Risk Analysis:**
- 127 customers haven't ordered in 45+ days
- Potential revenue at risk: $38,400

💡 **Recommendation:** Launch a win-back campaign targeting the 127 at-risk customers. Based on historical data, a 20% discount could recover 35% of these customers, generating approximately $13,440 in recovered revenue.`,

  "Inventory status report": `**Inventory Status Report**

⚠️ **Low Stock Alerts (3 items):**
1. Strawberry Base - 12 units (Reorder Now)
2. Mango Puree - 45 units (Order within 5 days)
3. Açaí Powder - 28 units (Order within 7 days)

✅ **Healthy Stock Levels:**
- Chocolate Mix: 340 units
- Coffee Mushroom: 280 units
- Almond Base: 195 units

**Inventory Health Score: 87/100**

📦 **Pending Orders:**
- Strawberry Base: 500 units (ETA: Dec 12)
- Organic Honey: 200 units (ETA: Dec 14)

💡 **Action Required:** Expedite Strawberry Base order - current stock will deplete in 2 days at current sales velocity.`,

  "Give me a detailed revenue summary for this month": `**December 2025 Revenue Summary**

💰 **Total Revenue MTD:** $478,293
- D2C Sales: $296,541 (62%)
- B2B/Wholesale: $181,752 (38%)

**Daily Average:** $47,829
**Projected Month-End:** $1,434,879

📊 **Channel Breakdown:**
- Website Direct: $198,432 (41.5%)
- Subscription: $98,109 (20.5%)
- Retail Partners: $124,856 (26.1%)
- Amazon: $56,896 (11.9%)

**Top Performing Days:**
1. Dec 5 (Friday): $68,432
2. Dec 8 (Monday): $59,187
3. Dec 3 (Wednesday): $54,923

💡 **Insight:** Weekend sales are 34% higher than weekdays. Consider increasing ad spend on Thursday-Friday for maximum impact.`,

  "What are our top selling products this month?": `**Top Selling Products - December 2025**

🥇 **#1 Strawberry Peach Smoothie**
- Units: 1,847 | Revenue: $55,410
- Avg Order: 2.3 units per customer

🥈 **#2 Mango Jackfruit Blend**
- Units: 1,523 | Revenue: $45,690
- Avg Order: 1.9 units per customer

🥉 **#3 Açaí Berry Bowl Mix**
- Units: 1,298 | Revenue: $38,940
- Avg Order: 2.1 units per customer

**#4 Coffee Mushroom Blend**
- Units: 1,087 | Revenue: $32,610

**#5 Chocolate Berry Fusion**
- Units: 956 | Revenue: $28,680

📈 **Trending Up:** Matcha Green Energy (+45% vs last month)
📉 **Needs Attention:** Almond Vanilla (-12% vs last month)`,

  "Analyze our customer base and retention metrics": `**Customer Base Analysis**

👥 **Total Active Customers:** 2,847
- New This Month: 312
- Returning: 2,535

**Customer Lifetime Value:**
- Average LTV: $487
- Top 10% LTV: $1,850+
- Acquisition Cost: $28

**Geographic Distribution:**
1. California: 34%
2. New York: 18%
3. Texas: 12%
4. Florida: 9%
5. Other: 27%

**Retention Cohort Analysis:**
- Jan 2025 Cohort: 52% still active
- Apr 2025 Cohort: 61% still active
- Jul 2025 Cohort: 74% still active

💡 **Insight:** Customers who order within 14 days of first purchase have 3x higher LTV. Consider implementing a "second order" incentive program.`,

  "Show me current inventory alerts and low stock items": `**Inventory Alerts Dashboard**

🔴 **Critical (Immediate Action Required):**
1. **Strawberry Base**
   - Current: 12 units | Days of Stock: 1.5
   - Reorder Point: 100 units
   - Action: Expedite pending order

⚠️ **Warning (Order Within 5 Days):**
2. **Mango Puree**
   - Current: 45 units | Days of Stock: 6
   - Reorder Point: 80 units

3. **Açaí Powder**
   - Current: 28 units | Days of Stock: 8
   - Reorder Point: 50 units

📊 **Inventory Summary:**
- Total SKUs: 24
- Critical: 1
- Warning: 2
- Healthy: 21

**Supplier Performance:**
- Average Lead Time: 5.2 days
- On-Time Delivery: 94%

💡 **Recommendation:** Set up auto-reorder for high-velocity items to prevent future stockouts.`,
};

const defaultResponse = `I've analyzed your query against our business data. Here's what I found:

📊 **Quick Summary:**
- Revenue is tracking 18% above last year
- Customer satisfaction score: 4.7/5
- Production efficiency: 94%

Would you like me to dive deeper into any specific area? I can provide detailed analysis on:
- Sales and revenue trends
- Customer behavior patterns
- Inventory optimization
- Production metrics

Just ask a follow-up question to explore further!`;

function getTimeString(): string {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  function sendMessage(messageText: string) {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText.trim(),
      timestamp: getTimeString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const response = mockResponses[messageText.trim()] || defaultResponse;
      
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: getTimeString(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1200);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  function formatContent(content: string) {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      let formattedLine = line
        .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #fff">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      return (
        <span key={index}>
          <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
          {index < lines.length - 1 && <br />}
        </span>
      );
    });
  }

  return (
    <AdminLayout title="AI Assistant" subtitle="Business Intelligence & Natural Language Queries">
      {isDemoMode && (
        <div style={styles.demoBanner}>
          <AlertCircle size={14} />
          <span>Demo Mode - Connect your data sources for live AI-powered insights</span>
        </div>
      )}

      <div style={styles.mainContainer}>
        <div style={styles.leftSidebar}>
          <div style={styles.sidebarSection}>
            <h3 style={styles.sidebarTitle}>
              <Zap size={16} color={NEON_GREEN} />
              Quick Insights
            </h3>
            <div style={styles.quickInsightsList}>
              {quickInsights.map((insight) => (
                <button
                  key={insight.id}
                  style={styles.quickInsightCard}
                  onClick={() => sendMessage(insight.prompt)}
                  disabled={isLoading}
                >
                  <div style={styles.quickInsightIcon}>{insight.icon}</div>
                  <div style={styles.quickInsightContent}>
                    <span style={styles.quickInsightTitle}>{insight.title}</span>
                    <span style={styles.quickInsightPreview}>{insight.preview}</span>
                  </div>
                  <ChevronRight size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
                </button>
              ))}
            </div>
          </div>

          <div style={styles.sidebarSection}>
            <h3 style={styles.sidebarTitle}>
              <Clock size={16} color={NEON_GREEN} />
              Recent Conversations
            </h3>
            <div style={styles.conversationsList}>
              {recentConversations.map((conv) => (
                <div key={conv.id} style={styles.conversationItem}>
                  <MessageSquare size={14} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                  <div style={styles.conversationContent}>
                    <span style={styles.conversationTopic}>{conv.topic}</span>
                    <span style={styles.conversationMeta}>
                      {conv.timestamp} · {conv.messageCount} messages
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.chatSection}>
          <div style={styles.chatContainer}>
            {messages.length === 0 ? (
              <div style={styles.welcomeContainer}>
                <div style={styles.welcomeGlow} />
                <div style={styles.aiIconContainer}>
                  <Bot size={32} color={NEON_GREEN} />
                </div>
                <h2 style={styles.welcomeTitle}>AI Business Assistant</h2>
                <p style={styles.welcomeSubtitle}>
                  Ask questions about your business metrics, revenue, orders, inventory, or get AI-powered insights.
                </p>
                
                <div style={styles.promptsGrid}>
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(prompt)}
                      disabled={isLoading}
                      style={styles.promptButton}
                    >
                      <Sparkles size={14} style={{ color: NEON_GREEN }} />
                      {prompt}
                    </button>
                  ))}
                </div>

                <div style={styles.capabilitiesSection}>
                  <h3 style={styles.capabilitiesTitle}>What I can help with</h3>
                  <div style={styles.capabilitiesGrid}>
                    {capabilities.map((cap) => (
                      <div key={cap.id} style={styles.capabilityCard}>
                        <div style={styles.capabilityIcon}>{cap.icon}</div>
                        <div style={styles.capabilityContent}>
                          <span style={styles.capabilityTitle}>{cap.title}</span>
                          <span style={styles.capabilityDesc}>{cap.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={styles.messagesContainer}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      ...styles.messageWrapper,
                      justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {message.role === 'assistant' && (
                      <div style={styles.assistantAvatar}>
                        <Bot size={16} color={NEON_GREEN} />
                      </div>
                    )}
                    <div style={message.role === 'user' ? styles.userMessage : styles.assistantMessage}>
                      <div style={styles.messageContent}>{formatContent(message.content)}</div>
                      <span style={styles.messageTime}>{message.timestamp}</span>
                    </div>
                    {message.role === 'user' && (
                      <div style={styles.userAvatar}>
                        <User size={16} color="#fff" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div style={{ ...styles.messageWrapper, justifyContent: 'flex-start' }}>
                    <div style={styles.assistantAvatar}>
                      <Bot size={16} color={NEON_GREEN} />
                    </div>
                    <div style={styles.typingIndicator}>
                      <span style={{ ...styles.typingDot, animationDelay: '0s' }} />
                      <span style={{ ...styles.typingDot, animationDelay: '0.15s' }} />
                      <span style={{ ...styles.typingDot, animationDelay: '0.3s' }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div style={styles.inputContainer}>
            <div style={styles.inputWrapper}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about revenue, orders, products, customers, or inventory..."
                disabled={isLoading}
                style={styles.input}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                style={{
                  ...styles.sendButton,
                  opacity: input.trim() && !isLoading ? 1 : 0.4,
                  cursor: input.trim() && !isLoading ? 'pointer' : 'default',
                }}
              >
                <Send size={18} />
              </button>
            </div>
            <p style={styles.disclaimer}>
              AI responses are generated from your business data. Results are for informational purposes.
            </p>
          </div>
        </div>

        <div style={styles.rightSidebar}>
          <div style={styles.sidebarSection}>
            <h3 style={styles.sidebarTitle}>
              <BarChart3 size={16} color={NEON_GREEN} />
              Capabilities
            </h3>
            <div style={styles.capabilitiesList}>
              {capabilities.map((cap) => (
                <div key={cap.id} style={styles.capabilityListItem}>
                  <div style={styles.capabilityListIcon}>{cap.icon}</div>
                  <span style={styles.capabilityListTitle}>{cap.title}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.statsCard}>
            <h4 style={styles.statsTitle}>AI Usage Stats</h4>
            <div style={styles.statRow}>
              <span style={styles.statLabel}>Queries Today</span>
              <span style={styles.statValue}>47</span>
            </div>
            <div style={styles.statRow}>
              <span style={styles.statLabel}>Avg Response Time</span>
              <span style={styles.statValue}>1.2s</span>
            </div>
            <div style={styles.statRow}>
              <span style={styles.statLabel}>Accuracy Rate</span>
              <span style={styles.statValue}>98.5%</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes typingPulse {
          0%, 100% { 
            background: rgba(0, 255, 133, 0.4);
            transform: scale(0.8);
          }
          50% { 
            background: ${NEON_GREEN};
            transform: scale(1);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 133, 0.3); }
          50% { box-shadow: 0 0 40px rgba(0, 255, 133, 0.6); }
        }
      `}</style>
    </AdminLayout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  demoBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: 'rgba(0, 255, 133, 0.1)',
    border: `1px solid rgba(0, 255, 133, 0.2)`,
    borderRadius: '8px',
    color: NEON_GREEN,
    fontSize: '13px',
    marginBottom: '24px',
  },
  mainContainer: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr 260px',
    gap: '24px',
    minHeight: 'calc(100vh - 220px)',
  },
  leftSidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  rightSidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  sidebarSection: {
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: '16px',
    padding: '20px',
  },
  sidebarTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '16px',
  },
  quickInsightsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  quickInsightCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255,255,255,0.02)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    width: '100%',
  },
  quickInsightIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'rgba(0, 255, 133, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: NEON_GREEN,
    flexShrink: 0,
  },
  quickInsightContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  quickInsightTitle: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#fff',
  },
  quickInsightPreview: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.5)',
  },
  conversationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  conversationItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '10px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },
  conversationContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  conversationTopic: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  conversationMeta: {
    fontSize: '11px',
    color: 'rgba(255,255,255,0.4)',
  },
  chatSection: {
    display: 'flex',
    flexDirection: 'column',
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: '16px',
    overflow: 'hidden',
  },
  chatContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
  },
  welcomeContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
    gap: '20px',
    position: 'relative',
    padding: '40px 20px',
  },
  welcomeGlow: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(0, 255, 133, 0.1) 0%, transparent 70%)',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  aiIconContainer: {
    width: '80px',
    height: '80px',
    borderRadius: '24px',
    background: 'rgba(0, 255, 133, 0.1)',
    border: `1px solid rgba(0, 255, 133, 0.2)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'glow 3s ease-in-out infinite',
  },
  welcomeTitle: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#fff',
    margin: 0,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    maxWidth: '400px',
    lineHeight: '1.6',
    margin: 0,
  },
  promptsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    width: '100%',
    maxWidth: '500px',
    marginTop: '16px',
  },
  promptButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 18px',
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: '12px',
    color: 'rgba(255,255,255,0.8)',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
  },
  capabilitiesSection: {
    width: '100%',
    maxWidth: '600px',
    marginTop: '32px',
    paddingTop: '32px',
    borderTop: `1px solid ${CARD_BORDER}`,
  },
  capabilitiesTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginBottom: '20px',
  },
  capabilitiesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  capabilityCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '16px 12px',
    background: 'rgba(255,255,255,0.02)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: '12px',
    gap: '10px',
  },
  capabilityIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'rgba(0, 255, 133, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: NEON_GREEN,
  },
  capabilityContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  capabilityTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#fff',
  },
  capabilityDesc: {
    fontSize: '10px',
    color: 'rgba(255,255,255,0.4)',
    lineHeight: '1.4',
  },
  messagesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  messageWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    animation: 'fadeIn 0.3s ease',
  },
  assistantAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '12px',
    background: 'rgba(0, 255, 133, 0.1)',
    border: `1px solid rgba(0, 255, 133, 0.2)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #a855f7 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  userMessage: {
    maxWidth: '70%',
    padding: '14px 18px',
    borderRadius: '16px 16px 4px 16px',
    background: 'linear-gradient(135deg, #667eea 0%, #a855f7 100%)',
    color: '#fff',
    fontSize: '14px',
    lineHeight: '1.6',
  },
  assistantMessage: {
    maxWidth: '70%',
    padding: '16px 20px',
    borderRadius: '16px 16px 16px 4px',
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${CARD_BORDER}`,
    color: 'rgba(255,255,255,0.9)',
    fontSize: '14px',
    lineHeight: '1.7',
  },
  messageContent: {
    whiteSpace: 'pre-wrap',
  },
  messageTime: {
    display: 'block',
    fontSize: '10px',
    color: 'rgba(255,255,255,0.4)',
    marginTop: '8px',
  },
  typingIndicator: {
    padding: '18px 24px',
    borderRadius: '16px 16px 16px 4px',
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${CARD_BORDER}`,
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  },
  typingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: NEON_GREEN,
    animation: 'typingPulse 1.4s ease-in-out infinite',
  },
  inputContainer: {
    padding: '20px 24px',
    borderTop: `1px solid ${CARD_BORDER}`,
    background: 'rgba(0,0,0,0.3)',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(255,255,255,0.03)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: '14px',
    padding: '6px 6px 6px 20px',
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    background: 'transparent',
    color: '#fff',
    padding: '12px 0',
  },
  sendButton: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    border: 'none',
    background: NEON_GREEN,
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  },
  disclaimer: {
    textAlign: 'center',
    fontSize: '11px',
    color: 'rgba(255,255,255,0.3)',
    marginTop: '12px',
  },
  capabilitiesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  capabilityListItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 12px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.02)',
  },
  capabilityListIcon: {
    color: NEON_GREEN,
    opacity: 0.8,
  },
  capabilityListTitle: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.7)',
  },
  statsCard: {
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: '16px',
    padding: '20px',
  },
  statsTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#fff',
    marginBottom: '16px',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  statLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
  },
  statValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: NEON_GREEN,
  },
};
