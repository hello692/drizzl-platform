import React, { useState, useRef, useEffect } from 'react';
import CommandCenterLayout from '../../../components/admin/CommandCenterLayout';
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
  Factory,
  Zap,
  ChevronRight,
  Bot,
  User,
} from 'lucide-react';

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
}

interface Capability {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const suggestedPrompts = [
  "What's our revenue this week?",
  "Which products are low on stock?",
  "Show me overdue invoices",
  "How is production performing?",
];

const quickInsights: QuickInsight[] = [
  {
    id: 'revenue',
    title: 'Revenue Summary',
    icon: <DollarSign size={18} />,
    preview: '$487K MTD',
    prompt: 'Show me the revenue summary for this month',
  },
  {
    id: 'products',
    title: 'Top Products',
    icon: <Package size={18} />,
    preview: 'Immune Boost leads',
    prompt: 'What are our top selling products?',
  },
  {
    id: 'customers',
    title: 'Customer Insights',
    icon: <Users size={18} />,
    preview: '2,847 active',
    prompt: 'Show me customer insights and activity',
  },
  {
    id: 'inventory',
    title: 'Inventory Alerts',
    icon: <AlertTriangle size={18} />,
    preview: '3 items low',
    prompt: 'Show me inventory alerts',
  },
];

const recentConversations: RecentConversation[] = [
  { id: 'conv-1', topic: 'Q4 Revenue Analysis', timestamp: 'Today' },
  { id: 'conv-2', topic: 'Inventory Optimization', timestamp: 'Yesterday' },
  { id: 'conv-3', topic: 'Customer Churn Report', timestamp: 'Dec 8' },
  { id: 'conv-4', topic: 'Production Efficiency', timestamp: 'Dec 7' },
  { id: 'conv-5', topic: 'B2B Pipeline Review', timestamp: 'Dec 6' },
];

const capabilities: Capability[] = [
  { id: 'sales', title: 'Sales Analysis', icon: <TrendingUp size={18} /> },
  { id: 'inventory', title: 'Inventory Queries', icon: <Package size={18} /> },
  { id: 'customer', title: 'Customer Insights', icon: <Users size={18} /> },
  { id: 'financial', title: 'Financial Reports', icon: <DollarSign size={18} /> },
  { id: 'production', title: 'Production Status', icon: <Factory size={18} /> },
];

const initialMessages: Message[] = [
  {
    id: 'user-1',
    role: 'user',
    content: "What's our best selling product this month?",
    timestamp: '2:15 PM',
  },
  {
    id: 'assistant-1',
    role: 'assistant',
    content: "Your top seller this month is Immune Boost Smoothie with 2,847 units sold, generating $42,705 in revenue. It's up 34% compared to last month. The product has a 4.8 star rating and 94% customer satisfaction.",
    timestamp: '2:15 PM',
  },
  {
    id: 'user-2',
    role: 'user',
    content: 'Show me our cash position',
    timestamp: '2:18 PM',
  },
  {
    id: 'assistant-2',
    role: 'assistant',
    content: 'Your current cash position across all Mercury accounts is $927,242.45. Operating: $284,392.45, Payroll: $142,850.00, Savings: $500,000.00. At current burn rate ($145K/month), you have 6.4 months of runway.',
    timestamp: '2:18 PM',
  },
];

const mockResponses: Record<string, string> = {
  "What's our revenue this week?": "This week's revenue is $124,532, up 12% from last week. Daily breakdown: Mon $18.2K, Tue $21.4K, Wed $19.8K, Thu $22.1K, Fri $24.8K, Sat $18.2K. Top channel: Direct website (62%).",
  "Which products are low on stock?": "3 products are currently low on stock:\n\n1. Strawberry Base - 12 units remaining (Critical)\n2. Mango Puree - 45 units (Reorder soon)\n3. Açaí Powder - 28 units (Reorder soon)\n\nRecommendation: Expedite Strawberry Base order immediately.",
  "Show me overdue invoices": "You have 4 overdue invoices totaling $12,847:\n\n1. INV-2847 - Whole Foods ($4,250) - 15 days overdue\n2. INV-2839 - Fresh Market ($3,120) - 8 days overdue\n3. INV-2841 - Local Juice Co ($2,890) - 5 days overdue\n4. INV-2845 - Health Hub ($2,587) - 3 days overdue\n\nSuggestion: Send reminder emails to aged accounts.",
  "How is production performing?": "Production efficiency is at 94.2% this week.\n\nBatch completion rate: 98%\nAverage batch time: 2.4 hours\nQuality pass rate: 99.1%\nEquipment uptime: 96.8%\n\nNext scheduled maintenance: Dec 15",
  "Show me the revenue summary for this month": "December MTD Revenue: $487,293\n\nBreakdown:\n- D2C Sales: $302,121 (62%)\n- B2B Wholesale: $185,172 (38%)\n\nProjected month-end: $1.2M\nYoY Growth: +23%",
  "What are our top selling products?": "Top 5 Products (December):\n\n1. Immune Boost Smoothie - $42,705 (2,847 units)\n2. Strawberry Peach - $38,420 (2,561 units)\n3. Mango Jackfruit - $31,890 (2,126 units)\n4. Açaí Berry Bowl - $28,450 (1,897 units)\n5. Coffee Mushroom - $24,680 (1,645 units)",
  "Show me customer insights and activity": "Active Customers: 2,847\n\nNew this month: 312 (+18%)\nRepeat purchase rate: 67%\nAverage order value: $47.50\nCustomer satisfaction: 4.7/5\n\nTop segment: Health-conscious millennials (42%)",
  "Show me inventory alerts": "Current Inventory Alerts:\n\n🔴 Critical (1):\n- Strawberry Base: 12 units, 1.5 days of stock\n\n⚠️ Low (2):\n- Mango Puree: 45 units, 6 days of stock\n- Açaí Powder: 28 units, 8 days of stock\n\nInventory health score: 87/100",
};

const defaultResponse = "I've analyzed your query. Based on current business data:\n\n📊 Key Metrics:\n- Revenue trending 18% above target\n- Customer satisfaction: 4.7/5\n- Production efficiency: 94%\n\nWould you like me to dive deeper into any specific area?";

function getTimeString(): string {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
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
    }, 1000);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <CommandCenterLayout title="AI Assistant">
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.iconWrapper}>
            <Bot size={24} color={NEON_GREEN} />
          </div>
          <div>
            <h1 style={styles.title}>AI Assistant</h1>
            <p style={styles.subtitle}>Natural language business intelligence</p>
          </div>
        </header>

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
                      <span style={styles.conversationMeta}>{conv.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={styles.chatSection}>
            <div style={styles.chatContainer}>
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
                      <div style={styles.messageContent}>{message.content}</div>
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
                      <span style={styles.typingDot} />
                      <span style={{ ...styles.typingDot, animationDelay: '0.15s' }} />
                      <span style={{ ...styles.typingDot, animationDelay: '0.3s' }} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <div style={styles.suggestedPromptsContainer}>
              <div style={styles.suggestedPromptsGrid}>
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(prompt)}
                    disabled={isLoading}
                    style={styles.suggestedPromptButton}
                  >
                    <Sparkles size={12} style={{ color: NEON_GREEN }} />
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div style={styles.inputContainer}>
              <div style={styles.inputWrapper}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about revenue, inventory, customers, or production..."
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
              <h4 style={styles.statsTitle}>Usage Stats</h4>
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
      `}</style>
    </CommandCenterLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 1600,
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
  mainContainer: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr 260px',
    gap: 24,
    minHeight: 'calc(100vh - 200px)',
  },
  leftSidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  rightSidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  sidebarSection: {
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 20,
  },
  sidebarTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    marginBottom: 16,
    margin: 0,
    paddingBottom: 16,
  },
  quickInsightsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  quickInsightCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    background: 'rgba(255,255,255,0.02)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    width: '100%',
  },
  quickInsightIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
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
    gap: 2,
  },
  quickInsightTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: '#fff',
  },
  quickInsightPreview: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  conversationsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  conversationItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    padding: 10,
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },
  conversationContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  conversationTopic: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: 500,
  },
  conversationMeta: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
  },
  chatSection: {
    display: 'flex',
    flexDirection: 'column',
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    overflow: 'hidden',
  },
  chatContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: 24,
    minHeight: 400,
  },
  messagesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  messageWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    animation: 'fadeIn 0.3s ease',
  },
  assistantAvatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    background: 'rgba(0, 255, 133, 0.1)',
    border: '1px solid rgba(0, 255, 133, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
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
    fontSize: 14,
    lineHeight: 1.6,
  },
  assistantMessage: {
    maxWidth: '70%',
    padding: '16px 20px',
    borderRadius: '16px 16px 16px 4px',
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${CARD_BORDER}`,
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 1.7,
  },
  messageContent: {
    whiteSpace: 'pre-wrap',
  },
  messageTime: {
    display: 'block',
    fontSize: 10,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 8,
  },
  typingIndicator: {
    padding: '18px 24px',
    borderRadius: '16px 16px 16px 4px',
    background: 'rgba(255,255,255,0.05)',
    border: `1px solid ${CARD_BORDER}`,
    display: 'flex',
    gap: 6,
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: NEON_GREEN,
    animation: 'typingPulse 1.4s ease-in-out infinite',
  },
  suggestedPromptsContainer: {
    padding: '12px 24px',
    borderTop: `1px solid ${CARD_BORDER}`,
  },
  suggestedPromptsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestedPromptButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 12px',
    background: 'rgba(255,255,255,0.02)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 20,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  inputContainer: {
    padding: '16px 24px 20px',
    borderTop: `1px solid ${CARD_BORDER}`,
    background: 'rgba(0,0,0,0.3)',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'rgba(255,255,255,0.03)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 14,
    padding: '6px 6px 6px 20px',
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: 14,
    background: 'transparent',
    color: '#fff',
    padding: '12px 0',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    border: 'none',
    background: NEON_GREEN,
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  },
  capabilitiesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  capabilityListItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 8,
    background: 'rgba(255,255,255,0.02)',
  },
  capabilityListIcon: {
    color: NEON_GREEN,
    opacity: 0.8,
  },
  capabilityListTitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  statsCard: {
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 20,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    margin: '0 0 16px 0',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  statLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 600,
    color: NEON_GREEN,
  },
};
