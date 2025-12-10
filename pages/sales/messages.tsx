import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import SalesLayout from '../../components/sales/SalesLayout';
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
} from 'lucide-react';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

interface Conversation {
  id: string;
  name: string;
  role: 'Manager' | 'Partner' | 'Support';
  companyName?: string;
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
    name: 'Mike Chen',
    role: 'Manager',
    lastMessage: 'Great work on the Target deal! 🎉',
    timestamp: 'Today',
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: '2',
    name: 'Whole Foods Team',
    role: 'Partner',
    lastMessage: "Quick question about next month's order...",
    timestamp: 'Today',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: '3',
    name: 'Support Team',
    role: 'Support',
    lastMessage: 'Your expense report has been approved',
    timestamp: 'Yesterday',
    unreadCount: 0,
    isOnline: true,
  },
  {
    id: '4',
    name: 'Sarah Thompson',
    role: 'Partner',
    companyName: 'Costco',
    lastMessage: 'Looking forward to our demo tomorrow',
    timestamp: 'Dec 8',
    unreadCount: 0,
    isOnline: false,
  },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'm1',
      conversationId: '1',
      senderId: 'mike',
      senderName: 'Mike Chen',
      content: "Hey, just saw the numbers come in from the Target presentation.",
      timestamp: 'Today 9:15 AM',
      isOwn: false,
      status: 'read',
    },
    {
      id: 'm2',
      conversationId: '1',
      senderId: 'me',
      senderName: 'You',
      content: "Thanks! They were really receptive to the new product line pitch.",
      timestamp: 'Today 9:30 AM',
      isOwn: true,
      status: 'read',
    },
    {
      id: 'm3',
      conversationId: '1',
      senderId: 'mike',
      senderName: 'Mike Chen',
      content: "Great work on the Target deal! 🎉",
      timestamp: 'Today 10:00 AM',
      isOwn: false,
      status: 'read',
    },
  ],
  '2': [
    {
      id: 'm4',
      conversationId: '2',
      senderId: 'wholefoods',
      senderName: 'Whole Foods Team',
      content: "Hi! We wanted to discuss expanding our order for Q1.",
      timestamp: 'Today 11:00 AM',
      isOwn: false,
      status: 'read',
    },
    {
      id: 'm5',
      conversationId: '2',
      senderId: 'me',
      senderName: 'You',
      content: "Absolutely! I'd love to go over the options with you.",
      timestamp: 'Today 11:15 AM',
      isOwn: true,
      status: 'read',
    },
    {
      id: 'm6',
      conversationId: '2',
      senderId: 'wholefoods',
      senderName: 'Whole Foods Team',
      content: "Quick question about next month's order...",
      timestamp: 'Today 2:30 PM',
      isOwn: false,
      status: 'read',
    },
  ],
  '3': [
    {
      id: 'm7',
      conversationId: '3',
      senderId: 'support',
      senderName: 'Support Team',
      content: "Hello! We've received your expense report for the client visit last week.",
      timestamp: 'Yesterday 10:00 AM',
      isOwn: false,
      status: 'read',
    },
    {
      id: 'm8',
      conversationId: '3',
      senderId: 'me',
      senderName: 'You',
      content: "Thanks for the quick turnaround!",
      timestamp: 'Yesterday 10:30 AM',
      isOwn: true,
      status: 'read',
    },
    {
      id: 'm9',
      conversationId: '3',
      senderId: 'support',
      senderName: 'Support Team',
      content: "Your expense report has been approved",
      timestamp: 'Yesterday 3:00 PM',
      isOwn: false,
      status: 'read',
    },
  ],
  '4': [
    {
      id: 'm10',
      conversationId: '4',
      senderId: 'sarah',
      senderName: 'Sarah Thompson',
      content: "Hi! I'm excited about the demo we have scheduled.",
      timestamp: 'Dec 8 2:00 PM',
      isOwn: false,
      status: 'read',
    },
    {
      id: 'm11',
      conversationId: '4',
      senderId: 'me',
      senderName: 'You',
      content: "Me too! I've prepared a customized presentation for Costco's needs.",
      timestamp: 'Dec 8 2:30 PM',
      isOwn: true,
      status: 'read',
    },
    {
      id: 'm12',
      conversationId: '4',
      senderId: 'sarah',
      senderName: 'Sarah Thompson',
      content: "Looking forward to our demo tomorrow",
      timestamp: 'Dec 8 4:00 PM',
      isOwn: false,
      status: 'read',
    },
  ],
};

const emojiList = ['😊', '👍', '🎉', '❤️', '🙌', '✨', '🚀', '💪', '👏', '🔥', '⭐', '💯'];

export default function SalesMessages() {
  const router = useRouter();
  const [repName, setRepName] = useState('Sales Rep');
  const [searchQuery, setSearchQuery] = useState('');
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
    const session = localStorage.getItem('salesSession');
    if (!session) {
      router.push('/sales/login');
      return;
    }
    const data = JSON.parse(session);
    setRepName(data.name || 'Sales Rep');
  }, [router]);

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

  const filteredConversations = mockConversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      senderId: 'me',
      senderName: 'You',
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

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'Manager':
        return {
          backgroundColor: 'rgba(251, 146, 60, 0.15)',
          color: '#FB923C',
        };
      case 'Partner':
        return {
          backgroundColor: 'rgba(139, 92, 246, 0.15)',
          color: '#A78BFA',
        };
      case 'Support':
        return {
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          color: '#60A5FA',
        };
      default:
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: '#FFFFFF',
        };
    }
  };

  const getDisplayName = (conversation: Conversation) => {
    if (conversation.companyName) {
      return `${conversation.name} (${conversation.companyName})`;
    }
    return conversation.name;
  };

  return (
    <SalesLayout title="Messages" repName={repName}>
      <div style={styles.page}>
        <div style={{
          ...styles.container,
          gridTemplateColumns: isMobileView ? '1fr' : '320px 1fr',
        }}>
          {(showConversationList || !isMobileView) && (
            <div style={{
              ...styles.conversationList,
              display: isMobileView && !showConversationList ? 'none' : 'flex',
            }}>
              <div style={styles.listHeader}>
                <h2 style={styles.listTitle}>Messages</h2>
                <button style={styles.composeButton}>
                  <Edit3 size={16} />
                  Compose
                </button>
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
                          ...getRoleBadgeStyle(conversation.role),
                        }}>
                          {conversation.role}
                          {conversation.companyName && ` at ${conversation.companyName}`}
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
                    <div style={styles.participantName}>{getDisplayName(selectedConversation)}</div>
                    <div style={styles.participantStatus}>
                      <span style={{
                        ...styles.roleBadge,
                        ...getRoleBadgeStyle(selectedConversation.role),
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
                <User size={48} color="#444444" />
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
    </SalesLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    height: 'calc(100vh - 80px)',
    padding: 24,
    boxSizing: 'border-box',
  },
  container: {
    display: 'grid',
    height: '100%',
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
    fontSize: 20,
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
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 20px',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
  },
  conversationItems: {
    flex: 1,
    overflowY: 'auto',
  },
  conversationItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '16px 20px',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
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
    border: '2px solid #0A0A0A',
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
    fontSize: 12,
    color: '#666666',
  },
  conversationMeta: {
    marginBottom: 4,
  },
  roleBadge: {
    display: 'inline-block',
    padding: '2px 8px',
    fontSize: 11,
    fontWeight: 500,
    borderRadius: 4,
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
    padding: '0 6px',
    borderRadius: 10,
    backgroundColor: NEON_GREEN,
    color: '#000000',
    fontSize: 12,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  messagePane: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: 'none',
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
    marginBottom: 2,
  },
  participantStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  onlineStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 12,
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
    padding: '12px 16px',
  },
  messageSender: {
    fontSize: 12,
    fontWeight: 600,
    color: NEON_GREEN,
    marginBottom: 4,
  },
  messageContent: {
    fontSize: 14,
    lineHeight: 1.5,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 6,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  readReceipt: {
    display: 'inline-flex',
    marginLeft: 2,
  },
  typingIndicator: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 8,
  },
  typingBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '16px 16px 16px 4px',
    padding: '14px 18px',
    display: 'flex',
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    backgroundColor: '#666666',
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: '8px 12px',
  },
  inputButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'transparent',
    border: 'none',
    color: '#666666',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.15s',
  },
  emojiContainer: {
    position: 'relative',
  },
  emojiPicker: {
    position: 'absolute',
    bottom: 50,
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
    marginBottom: 8,
    paddingBottom: 8,
    borderBottom: `1px solid ${CARD_BORDER}`,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 500,
  },
  emojiCloseButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#666666',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: 4,
  },
  emojiButton: {
    width: 32,
    height: 32,
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: 18,
    cursor: 'pointer',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.15s',
  },
  textarea: {
    flex: 1,
    backgroundColor: 'transparent',
    border: 'none',
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
    resize: 'none',
    minHeight: 36,
    maxHeight: 120,
    padding: '8px 0',
    fontFamily: 'inherit',
  },
  sendButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 16px',
    backgroundColor: NEON_GREEN,
    color: '#000000',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: 40,
    textAlign: 'center',
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 8px 0',
  },
  emptyText: {
    fontSize: 14,
    color: '#666666',
    margin: 0,
  },
};
