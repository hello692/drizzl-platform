import React, { useState, useEffect, useRef } from 'react';
import CommandCenterLayout from '../../../components/admin/CommandCenterLayout';
import {
  Search,
  Send,
  Paperclip,
  Smile,
  User,
  Check,
  CheckCheck,
  X,
  Edit3,
  MessageSquare,
  Users,
  Briefcase,
  HeadphonesIcon,
} from 'lucide-react';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

type FilterTab = 'all' | 'sales' | 'partners' | 'support';

interface Conversation {
  id: string;
  name: string;
  role: 'Sales Rep' | 'Partner' | 'Support';
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  status: 'sent' | 'delivered' | 'read';
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Sales Rep',
    lastMessage: 'Closed the Whole Foods deal! Need approval on...',
    timestamp: 'Today',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: '2',
    name: 'Whole Foods Market',
    role: 'Partner',
    lastMessage: 'Question about our net terms',
    timestamp: 'Today',
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: '3',
    name: 'Mike Chen',
    role: 'Sales Rep',
    lastMessage: 'Q4 projections look great',
    timestamp: 'Yesterday',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '4',
    name: 'Target Corporation',
    role: 'Partner',
    lastMessage: 'Ready to place our next order',
    timestamp: 'Yesterday',
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: '5',
    name: 'Support Tickets',
    role: 'Support',
    lastMessage: '3 new tickets need review',
    timestamp: 'Today',
    unreadCount: 3,
    isOnline: true,
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      conversationId: '1',
      senderId: 'sarah',
      senderName: 'Sarah Johnson',
      content: "Hey! Just wanted to update you on the Whole Foods deal. We've been negotiating for the past 2 weeks.",
      timestamp: 'Yesterday 2:30 PM',
      isOwn: false,
      status: 'read',
    },
    {
      id: 'm2',
      conversationId: '1',
      senderId: 'admin',
      senderName: 'Admin',
      content: "Great work Sarah! What's the latest?",
      timestamp: 'Yesterday 3:00 PM',
      isOwn: true,
      status: 'read',
    },
    {
      id: 'm3',
      conversationId: '1',
      senderId: 'sarah',
      senderName: 'Sarah Johnson',
      content: "Closed the Whole Foods deal! Need approval on the 5% volume discount I offered. They're committing to 500 units/month.",
      timestamp: 'Today 10:15 AM',
      isOwn: false,
      status: 'read',
    },
    {
      id: 'm4',
      conversationId: '1',
      senderId: 'sarah',
      senderName: 'Sarah Johnson',
      content: "This could be our biggest partner yet! 🎉",
      timestamp: 'Today 10:16 AM',
      isOwn: false,
      status: 'read',
    },
  ],
  '2': [
    {
      id: 'm5',
      conversationId: '2',
      senderId: 'wholefoods',
      senderName: 'Whole Foods Market',
      content: "Hi there! We're excited to partner with DRIZZL.",
      timestamp: 'Yesterday 11:00 AM',
      isOwn: false,
      status: 'read',
    },
    {
      id: 'm6',
      conversationId: '2',
      senderId: 'admin',
      senderName: 'Admin',
      content: "Welcome to the DRIZZL family! We're thrilled to have you on board.",
      timestamp: 'Yesterday 11:30 AM',
      isOwn: true,
      status: 'read',
    },
    {
      id: 'm7',
      conversationId: '2',
      senderId: 'wholefoods',
      senderName: 'Whole Foods Market',
      content: "Question about our net terms - can we get Net 45 instead of Net 30?",
      timestamp: 'Today 9:00 AM',
      isOwn: false,
      status: 'read',
    },
  ],
  '3': [
    {
      id: 'm8',
      conversationId: '3',
      senderId: 'mike',
      senderName: 'Mike Chen',
      content: "Just finished the Q4 forecast analysis.",
      timestamp: 'Yesterday 4:00 PM',
      isOwn: false,
      status: 'read',
    },
    {
      id: 'm9',
      conversationId: '3',
      senderId: 'admin',
      senderName: 'Admin',
      content: "How are the numbers looking?",
      timestamp: 'Yesterday 4:15 PM',
      isOwn: true,
      status: 'read',
    },
    {
      id: 'm10',
      conversationId: '3',
      senderId: 'mike',
      senderName: 'Mike Chen',
      content: "Q4 projections look great - we're tracking 23% above target. The holiday push is really paying off.",
      timestamp: 'Yesterday 4:30 PM',
      isOwn: false,
      status: 'read',
    },
  ],
  '4': [
    {
      id: 'm11',
      conversationId: '4',
      senderId: 'target',
      senderName: 'Target Corporation',
      content: "The initial test run at our 50 locations went really well.",
      timestamp: 'Dec 8 2:00 PM',
      isOwn: false,
      status: 'read',
    },
    {
      id: 'm12',
      conversationId: '4',
      senderId: 'admin',
      senderName: 'Admin',
      content: "That's fantastic news! What were the top sellers?",
      timestamp: 'Dec 8 2:30 PM',
      isOwn: true,
      status: 'read',
    },
    {
      id: 'm13',
      conversationId: '4',
      senderId: 'target',
      senderName: 'Target Corporation',
      content: "Ready to place our next order - expanding to 200 locations. Can we discuss bulk pricing?",
      timestamp: 'Yesterday 10:00 AM',
      isOwn: false,
      status: 'read',
    },
  ],
  '5': [
    {
      id: 'm14',
      conversationId: '5',
      senderId: 'support',
      senderName: 'Support System',
      content: "New ticket #4521: Shipping delay inquiry from Fresh Market",
      timestamp: 'Today 8:00 AM',
      isOwn: false,
      status: 'read',
    },
    {
      id: 'm15',
      conversationId: '5',
      senderId: 'support',
      senderName: 'Support System',
      content: "New ticket #4522: Product quality feedback from Sprouts",
      timestamp: 'Today 9:30 AM',
      isOwn: false,
      status: 'read',
    },
    {
      id: 'm16',
      conversationId: '5',
      senderId: 'support',
      senderName: 'Support System',
      content: "3 new tickets need review - prioritize #4521 (urgent shipping issue)",
      timestamp: 'Today 10:00 AM',
      isOwn: false,
      status: 'read',
    },
  ],
};

const emojiList = ['😊', '👍', '🎉', '❤️', '🙌', '✨', '🚀', '💪', '👏', '🔥', '⭐', '💯'];

const filterTabs: { id: FilterTab; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All', icon: <MessageSquare size={14} /> },
  { id: 'sales', label: 'Sales Team', icon: <Users size={14} /> },
  { id: 'partners', label: 'Partners', icon: <Briefcase size={14} /> },
  { id: 'support', label: 'Support', icon: <HeadphonesIcon size={14} /> },
];

export default function AdminMessages() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(mockConversations[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages['1'] || []);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredConversations = mockConversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'all') return matchesSearch;
    if (activeFilter === 'sales') return matchesSearch && conv.role === 'Sales Rep';
    if (activeFilter === 'partners') return matchesSearch && conv.role === 'Partner';
    if (activeFilter === 'support') return matchesSearch && conv.role === 'Support';
    return matchesSearch;
  });

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setMessages(mockMessages[conversation.id] || []);
    if (isMobileView) {
      setShowConversationList(false);
    }
    
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 2000);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const newMsg: Message = {
      id: `m${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: 'admin',
      senderName: 'Admin',
      content: newMessage.trim(),
      timestamp: 'Just now',
      isOwn: true,
      status: 'sent',
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === newMsg.id ? { ...m, status: 'delivered' } : m
      ));
    }, 1000);

    setTimeout(() => {
      setMessages(prev => prev.map(m => 
        m.id === newMsg.id ? { ...m, status: 'read' } : m
      ));
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const renderStatusIcon = (status: string) => {
    if (status === 'read') {
      return <CheckCheck size={14} color={NEON_GREEN} />;
    } else if (status === 'delivered') {
      return <CheckCheck size={14} color="#666666" />;
    }
    return <Check size={14} color="#666666" />;
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Sales Rep':
        return { bg: 'rgba(139, 92, 246, 0.15)', color: '#A78BFA' };
      case 'Partner':
        return { bg: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA' };
      case 'Support':
        return { bg: 'rgba(249, 115, 22, 0.15)', color: '#FB923C' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF' };
    }
  };

  return (
    <CommandCenterLayout title="Messages">
      <div style={styles.page}>
        <header style={styles.header}>
          <div style={styles.iconWrapper}>
            <MessageSquare size={24} color={NEON_GREEN} />
          </div>
          <div>
            <h1 style={styles.headerTitle}>Messages</h1>
            <p style={styles.subtitle}>Communicate with sales reps and partners</p>
          </div>
        </header>

        <div style={styles.container}>
          {(showConversationList || !isMobileView) && (
            <div style={{
              ...styles.conversationList,
              display: isMobileView && !showConversationList ? 'none' : 'flex',
            }}>
              <div style={styles.listHeader}>
                <h2 style={styles.listTitle}>Conversations</h2>
                <button style={styles.composeButton}>
                  <Edit3 size={16} />
                  Compose
                </button>
              </div>

              <div style={styles.filterTabs}>
                {filterTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    style={{
                      ...styles.filterTab,
                      backgroundColor: activeFilter === tab.id ? 'rgba(0, 255, 133, 0.1)' : 'transparent',
                      borderColor: activeFilter === tab.id ? NEON_GREEN : 'transparent',
                      color: activeFilter === tab.id ? NEON_GREEN : '#888888',
                    }}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              <div style={styles.searchContainer}>
                <Search size={18} color="#666666" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchInput}
                />
              </div>

              <div style={styles.conversationItems}>
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    style={{
                      ...styles.conversationItem,
                      backgroundColor: selectedConversation?.id === conversation.id
                        ? 'rgba(0, 255, 133, 0.05)'
                        : 'transparent',
                      borderLeft: selectedConversation?.id === conversation.id
                        ? `3px solid ${NEON_GREEN}`
                        : '3px solid transparent',
                    }}
                  >
                    <div style={styles.avatarContainer}>
                      <div style={styles.avatar}>
                        <User size={20} color="#888888" />
                      </div>
                      {conversation.isOnline && (
                        <div style={styles.onlineIndicator} />
                      )}
                    </div>
                    <div style={styles.conversationContent}>
                      <div style={styles.conversationHeader}>
                        <span style={styles.conversationName}>{conversation.name}</span>
                        <span style={styles.conversationTime}>{conversation.timestamp}</span>
                      </div>
                      <div style={styles.conversationMeta}>
                        <span style={{
                          ...styles.roleBadge,
                          backgroundColor: getRoleColor(conversation.role).bg,
                          color: getRoleColor(conversation.role).color,
                        }}>
                          {conversation.role}
                        </span>
                      </div>
                      <div style={styles.conversationPreview}>
                        {conversation.lastMessage}
                      </div>
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div style={styles.unreadBadge}>
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!showConversationList || !isMobileView) && selectedConversation && (
            <div style={styles.messagePane}>
              <div style={styles.messagePaneHeader}>
                {isMobileView && (
                  <button
                    onClick={() => setShowConversationList(true)}
                    style={styles.backButton}
                  >
                    ←
                  </button>
                )}
                <div style={styles.participantInfo}>
                  <div style={styles.participantAvatar}>
                    <User size={20} color="#888888" />
                  </div>
                  <div>
                    <div style={styles.participantName}>{selectedConversation.name}</div>
                    <div style={styles.participantStatus}>
                      <span style={{
                        ...styles.roleBadge,
                        backgroundColor: getRoleColor(selectedConversation.role).bg,
                        color: getRoleColor(selectedConversation.role).color,
                      }}>
                        {selectedConversation.role}
                      </span>
                      {selectedConversation.isOnline && (
                        <span style={styles.onlineStatus}>
                          <span style={styles.onlineDot} />
                          Online
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.messagesContainer}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      ...styles.messageWrapper,
                      justifyContent: message.isOwn ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {!message.isOwn && (
                      <div style={styles.messageAvatar}>
                        <User size={16} color="#888888" />
                      </div>
                    )}
                    <div style={{
                      ...styles.messageBubble,
                      backgroundColor: message.isOwn
                        ? NEON_GREEN
                        : 'rgba(255, 255, 255, 0.08)',
                      color: message.isOwn ? '#000000' : '#FFFFFF',
                      borderRadius: message.isOwn
                        ? '16px 16px 4px 16px'
                        : '16px 16px 16px 4px',
                    }}>
                      {!message.isOwn && (
                        <div style={styles.messageSender}>{message.senderName}</div>
                      )}
                      <div style={styles.messageContent}>{message.content}</div>
                      <div style={{
                        ...styles.messageTime,
                        color: message.isOwn ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.5)',
                      }}>
                        {message.timestamp}
                        {message.isOwn && (
                          <span style={styles.readReceipt}>
                            {renderStatusIcon(message.status)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div style={styles.typingIndicator}>
                    <div style={styles.messageAvatar}>
                      <User size={16} color="#888888" />
                    </div>
                    <div style={styles.typingBubble}>
                      <span style={styles.typingDot} />
                      <span style={{ ...styles.typingDot, animationDelay: '0.2s' }} />
                      <span style={{ ...styles.typingDot, animationDelay: '0.4s' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div style={styles.inputContainer}>
                <div style={styles.inputWrapper}>
                  <button style={styles.inputButton} title="Attach file">
                    <Paperclip size={20} />
                  </button>
                  
                  <div style={styles.emojiContainer}>
                    <button
                      style={styles.inputButton}
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      title="Add emoji"
                    >
                      <Smile size={20} />
                    </button>
                    {showEmojiPicker && (
                      <div style={styles.emojiPicker}>
                        <div style={styles.emojiPickerHeader}>
                          <span>Emoji</span>
                          <button
                            onClick={() => setShowEmojiPicker(false)}
                            style={styles.emojiCloseButton}
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div style={styles.emojiGrid}>
                          {emojiList.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => addEmoji(emoji)}
                              style={styles.emojiButton}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <textarea
                    ref={textareaRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    style={styles.textarea}
                    rows={1}
                  />

                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    style={{
                      ...styles.sendButton,
                      opacity: newMessage.trim() ? 1 : 0.5,
                      cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
                    }}
                  >
                    <Send size={18} />
                    Send
                  </button>
                </div>
              </div>
            </div>
          )}

          {!selectedConversation && !isMobileView && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>
                <MessageSquare size={48} color="#444444" />
              </div>
              <h3 style={styles.emptyTitle}>Select a conversation</h3>
              <p style={styles.emptyText}>
                Choose a conversation from the list to start messaging
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
        
        @media (max-width: 767px) {
          .messages-page-container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </CommandCenterLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: 'calc(100vh - 64px)',
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
    borderRadius: 12,
    background: 'rgba(0, 255, 133, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: '#FFFFFF',
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: '#888888',
    margin: 0,
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '360px 1fr',
    height: 'calc(100vh - 200px)',
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    overflow: 'hidden',
  },
  conversationList: {
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid ${CARD_BORDER}`,
    overflow: 'hidden',
  },
  listHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 20px 16px',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  composeButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 14px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    border: 'none',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  filterTabs: {
    display: 'flex',
    gap: 8,
    padding: '12px 16px',
    borderBottom: `1px solid ${CARD_BORDER}`,
    overflowX: 'auto',
  },
  filterTab: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 12px',
    border: '1px solid transparent',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 16px',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  searchInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#FFFFFF',
    fontSize: 14,
  },
  conversationItems: {
    flex: 1,
    overflowY: 'auto',
  },
  conversationItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '16px',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  avatarContainer: {
    position: 'relative',
    flexShrink: 0,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: NEON_GREEN,
    border: '2px solid #000000',
  },
  conversationContent: {
    flex: 1,
    minWidth: 0,
  },
  conversationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  conversationTime: {
    fontSize: 11,
    color: '#666666',
  },
  conversationMeta: {
    marginBottom: 4,
  },
  roleBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    borderRadius: 10,
    fontSize: 10,
    fontWeight: 500,
  },
  conversationPreview: {
    fontSize: 13,
    color: '#888888',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: NEON_GREEN,
    color: '#000000',
    fontSize: 11,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  messagePane: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  messagePaneHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px 20px',
    borderBottom: `1px solid ${CARD_BORDER}`,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    border: `1px solid ${CARD_BORDER}`,
    backgroundColor: 'transparent',
    color: '#FFFFFF',
    fontSize: 18,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantName: {
    fontSize: 15,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  participantStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  onlineStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 11,
    color: NEON_GREEN,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: NEON_GREEN,
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  messageWrapper: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 8,
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '10px 14px',
  },
  messageSender: {
    fontSize: 11,
    fontWeight: 600,
    marginBottom: 4,
    opacity: 0.7,
  },
  messageContent: {
    fontSize: 14,
    lineHeight: 1.5,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 6,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'flex-end',
  },
  readReceipt: {
    marginLeft: 4,
  },
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  typingBubble: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '12px 16px',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '16px 16px 16px 4px',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: '#888888',
    animation: 'typingBounce 1s infinite',
  },
  inputContainer: {
    padding: 16,
    borderTop: `1px solid ${CARD_BORDER}`,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    border: `1px solid ${CARD_BORDER}`,
  },
  inputButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    border: 'none',
    backgroundColor: 'transparent',
    color: '#888888',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s ease',
  },
  emojiContainer: {
    position: 'relative',
  },
  emojiPicker: {
    position: 'absolute',
    bottom: 48,
    left: 0,
    backgroundColor: '#1A1A1A',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    padding: 12,
    width: 240,
    zIndex: 100,
  },
  emojiPickerHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 500,
  },
  emojiCloseButton: {
    background: 'none',
    border: 'none',
    color: '#888888',
    cursor: 'pointer',
    padding: 4,
  },
  emojiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: 4,
  },
  emojiButton: {
    width: 32,
    height: 32,
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: 18,
    borderRadius: 6,
    transition: 'background 0.2s ease',
  },
  textarea: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#FFFFFF',
    fontSize: 14,
    resize: 'none',
    minHeight: 24,
    maxHeight: 100,
    fontFamily: 'inherit',
  },
  sendButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    border: 'none',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
    margin: 0,
    textAlign: 'center',
  },
};
