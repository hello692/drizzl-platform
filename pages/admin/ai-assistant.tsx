import React, { useState, useRef, useEffect } from 'react';
import { useRequireAdmin } from '../../hooks/useRole';
import AdminLayout from '../../components/AdminLayout';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const examplePrompts = [
  'Show revenue summary',
  'Top selling products',
  'Order trends this week',
  'Cash flow analysis',
];

export default function AIAssistant() {
  const { loading, authorized } = useRequireAdmin();
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
    if (authorized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [authorized]);

  async function sendMessage(messageText: string) {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/ai-assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText.trim() }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.response || 'I could not generate a response.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
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
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
      
      return (
        <span key={index}>
          <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
          {index < lines.length - 1 && <br />}
        </span>
      );
    });
  }

  if (loading || !authorized) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingOrb} />
        <p style={styles.loadingText}>Initializing AI</p>
      </div>
    );
  }

  return (
    <AdminLayout title="AI Assistant" subtitle="Natural Language Intelligence">
      <div style={styles.chatWrapper}>
        <div style={styles.chatContainer}>
          {messages.length === 0 && (
            <div style={styles.welcomeContainer}>
              <div style={styles.welcomeGlow} />
              <div style={styles.aiIconContainer}>
                <div style={styles.aiIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="1.5">
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 6v2M12 16v2M6 12h2M16 12h2" />
                  </svg>
                </div>
              </div>
              <h2 style={styles.welcomeTitle}>Ask me anything</h2>
              <p style={styles.welcomeSubtitle}>
                Ask questions about your business metrics, revenue, orders, or financial health.
              </p>
              
              <div style={styles.promptsGrid}>
                {examplePrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(prompt)}
                    disabled={isLoading}
                    style={styles.promptButton}
                    onMouseEnter={(e) => {
                      if (!isLoading) {
                        e.currentTarget.style.background = 'rgba(168, 85, 247, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.5)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }}
                  >
                    <span style={styles.promptIcon}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                    </span>
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                )}
                <div
                  style={message.role === 'user' ? styles.userMessage : styles.assistantMessage}
                >
                  {formatContent(message.content)}
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{ ...styles.messageWrapper, justifyContent: 'flex-start' }}>
                <div style={styles.assistantAvatar}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
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
        </div>

        <div style={styles.inputContainer}>
          <div style={styles.inputWrapper}>
            <div style={styles.inputGradientBorder} />
            <div style={styles.inputInner}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about revenue, orders, products, or cash flow..."
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
          <p style={styles.disclaimer}>
            AI responses are based on current business data. Results may vary.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.3); }
          50% { box-shadow: 0 0 40px rgba(168, 85, 247, 0.6); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes typingPulse {
          0%, 100% { 
            background: rgba(168, 85, 247, 0.4);
            transform: scale(0.8);
          }
          50% { 
            background: rgba(236, 72, 153, 0.9);
            transform: scale(1);
          }
        }
      `}</style>
    </AdminLayout>
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
    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    animation: 'pulse 2s ease-in-out infinite, glow 2s ease-in-out infinite',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
  },
  chatWrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'calc(100vh - 200px)',
    maxWidth: '900px',
    width: '100%',
    margin: '0 auto',
  },
  chatContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  welcomeContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
    padding: '40px 20px',
    position: 'relative',
  },
  welcomeGlow: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  aiIconContainer: {
    position: 'relative',
    marginBottom: '8px',
  },
  aiIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '24px',
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 40px rgba(168, 85, 247, 0.2)',
  },
  welcomeTitle: {
    fontSize: '28px',
    fontWeight: '700',
    letterSpacing: '-0.5px',
    background: 'linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textAlign: 'center',
    margin: 0,
  },
  welcomeSubtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '15px',
    maxWidth: '400px',
    textAlign: 'center',
    lineHeight: '1.6',
    margin: 0,
  },
  promptsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    width: '100%',
    maxWidth: '500px',
    marginTop: '16px',
  },
  promptButton: {
    padding: '16px 20px',
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '14px',
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.8)',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  promptIcon: {
    color: 'rgba(168, 85, 247, 0.8)',
    display: 'flex',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingBottom: '24px',
  },
  messageWrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    animation: 'fadeIn 0.3s ease',
  },
  assistantAvatar: {
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(168, 85, 247, 0.8)',
    flexShrink: 0,
  },
  userMessage: {
    maxWidth: '75%',
    padding: '14px 18px',
    borderRadius: '18px 18px 4px 18px',
    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    color: '#fff',
    fontSize: '14px',
    lineHeight: '1.6',
    boxShadow: '0 4px 20px rgba(168, 85, 247, 0.3)',
  },
  assistantMessage: {
    maxWidth: '75%',
    padding: '14px 18px',
    borderRadius: '18px 18px 18px 4px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px',
    lineHeight: '1.6',
    boxShadow: '0 0 30px rgba(139, 92, 246, 0.1)',
  },
  typingIndicator: {
    padding: '16px 20px',
    borderRadius: '18px 18px 18px 4px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  },
  typingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'rgba(168, 85, 247, 0.6)',
    animation: 'typingPulse 1.4s ease-in-out infinite',
  },
  inputContainer: {
    padding: '24px 0',
    position: 'relative',
  },
  inputWrapper: {
    position: 'relative',
    borderRadius: '18px',
    padding: '2px',
  },
  inputGradientBorder: {
    position: 'absolute',
    inset: 0,
    borderRadius: '18px',
    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.5) 0%, rgba(236, 72, 153, 0.5) 50%, rgba(139, 92, 246, 0.5) 100%)',
    opacity: 0.5,
    pointerEvents: 'none',
  },
  inputInner: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(5, 5, 5, 0.9)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
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
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  },
  disclaimer: {
    textAlign: 'center',
    fontSize: '11px',
    color: 'rgba(255, 255, 255, 0.3)',
    marginTop: '12px',
    letterSpacing: '0.5px',
  },
};
