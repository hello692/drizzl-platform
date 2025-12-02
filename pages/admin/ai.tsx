import React, { useState } from 'react';
import { useRequireAdmin } from '../../hooks/useRole';
import AdminLayout from '../../components/AdminLayout';

const contentTypeIcons = {
  hero: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="heroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#667eea" />
          <stop offset="100%" stopColor="#764ba2" />
        </linearGradient>
      </defs>
      <path d="M4 5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zM4 13a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6zM16 12a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-3z" stroke="url(#heroGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  product: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="productGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f093fb" />
          <stop offset="100%" stopColor="#f5576c" />
        </linearGradient>
      </defs>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="url(#productGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="url(#productGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  email: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="emailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4facfe" />
          <stop offset="100%" stopColor="#00f2fe" />
        </linearGradient>
      </defs>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="url(#emailGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 6l-10 7L2 6" stroke="url(#emailGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  social: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="socialGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#43e97b" />
          <stop offset="100%" stopColor="#38f9d7" />
        </linearGradient>
      </defs>
      <circle cx="18" cy="5" r="3" stroke="url(#socialGrad)" strokeWidth="1.5"/>
      <circle cx="6" cy="12" r="3" stroke="url(#socialGrad)" strokeWidth="1.5"/>
      <circle cx="18" cy="19" r="3" stroke="url(#socialGrad)" strokeWidth="1.5"/>
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="url(#socialGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

const SparkleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="50%" stopColor="#f093fb" />
        <stop offset="100%" stopColor="#43e97b" />
      </linearGradient>
    </defs>
    <path d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z" stroke="url(#sparkleGrad)" strokeWidth="1.5" fill="url(#sparkleGrad)" fillOpacity="0.2"/>
    <path d="M19 16L19.54 18.46L22 19L19.54 19.54L19 22L18.46 19.54L16 19L18.46 18.46L19 16Z" stroke="url(#sparkleGrad)" strokeWidth="1" fill="url(#sparkleGrad)" fillOpacity="0.3"/>
    <path d="M5 2L5.27 3.73L7 4L5.27 4.27L5 6L4.73 4.27L3 4L4.73 3.73L5 2Z" stroke="url(#sparkleGrad)" strokeWidth="1" fill="url(#sparkleGrad)" fillOpacity="0.3"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="infoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" stroke="url(#infoGrad)" strokeWidth="1.5"/>
    <path d="M12 16v-4M12 8h.01" stroke="url(#infoGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function AdminAI() {
  const { loading, authorized } = useRequireAdmin();
  const [input, setInput] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [generating, setGenerating] = useState(false);
  const [contentType, setContentType] = useState<'hero' | 'product' | 'email' | 'social'>('hero');
  const [copied, setCopied] = useState(false);

  async function generateContent() {
    setGenerating(true);
    setSuggestion('');
    
    try {
      const response = await fetch('/api/ai/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, contentType }),
      });
      
      const data = await response.json();
      setSuggestion(data.suggestion);
    } catch (error) {
      console.error('Error generating content:', error);
      setSuggestion('Error generating content. Please try again.');
    } finally {
      setGenerating(false);
    }
  }

  function useContent() {
    navigator.clipboard.writeText(suggestion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    <AdminLayout title="AI Content" subtitle="Content Generation">
      <div style={styles.contentWrapper}>
        <div style={styles.formCard}>
          <div style={styles.cardGlow} />
          
          <div style={styles.sectionHeader}>
            <div style={styles.sectionIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient id="typeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                  </linearGradient>
                </defs>
                <path d="M4 6h16M4 12h16M4 18h10" stroke="url(#typeGrad)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <label style={styles.label}>Content Type</label>
          </div>
          
          <div style={styles.buttonGroup}>
            {(['hero', 'product', 'email', 'social'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setContentType(type)}
                style={{
                  ...styles.typeButton,
                  ...(contentType === type ? styles.typeButtonActive : {}),
                }}
              >
                <span style={styles.typeIcon}>{contentTypeIcons[type]}</span>
                <span style={styles.typeLabel}>{type}</span>
                {contentType === type && <div style={styles.activeIndicator} />}
              </button>
            ))}
          </div>

          <div style={styles.sectionHeader}>
            <div style={styles.sectionIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient id="descGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f093fb" />
                    <stop offset="100%" stopColor="#f5576c" />
                  </linearGradient>
                </defs>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="url(#descGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="url(#descGrad)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <label style={styles.label}>Describe your vision</label>
          </div>
          
          <div style={styles.textareaWrapper}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., Hero headline for summer smoothie collection promoting fresh ingredients and health benefits..."
              rows={5}
              style={styles.textarea}
            />
            <div style={styles.textareaGlow} />
          </div>

          <button
            onClick={generateContent}
            disabled={generating || !input.trim()}
            style={{
              ...styles.generateButton,
              opacity: generating || !input.trim() ? 0.5 : 1,
              cursor: generating || !input.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            <span style={styles.generateButtonInner}>
              {generating ? (
                <>
                  <div style={styles.spinner} />
                  <span>Generating</span>
                </>
              ) : (
                <>
                  <SparkleIcon />
                  <span>Generate Content</span>
                </>
              )}
            </span>
          </button>

          {suggestion && (
            <div style={styles.resultCard}>
              <div style={styles.resultHeader}>
                <div style={styles.resultHeaderLeft}>
                  <div style={styles.resultIcon}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <defs>
                        <linearGradient id="resultGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#43e97b" />
                          <stop offset="100%" stopColor="#38f9d7" />
                        </linearGradient>
                      </defs>
                      <path d="M9 12l2 2 4-4" stroke="url(#resultGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="12" r="10" stroke="url(#resultGrad)" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <h3 style={styles.resultTitle}>Generated Content</h3>
                </div>
                <button onClick={useContent} style={styles.copyButton}>
                  <CopyIcon />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div style={styles.resultContent}>
                <p style={styles.resultText}>{suggestion}</p>
              </div>
              <div style={styles.resultGlow} />
            </div>
          )}

          <div style={styles.infoCard}>
            <div style={styles.infoIcon}>
              <InfoIcon />
            </div>
            <div style={styles.infoContent}>
              <p style={styles.infoTitle}>Neural Configuration Required</p>
              <p style={styles.infoText}>
                Connect your OpenAI API key in environment variables (OPENAI_API_KEY) to enable real AI generation capabilities.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes borderGlow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
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
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    animation: 'pulse 2s ease-in-out infinite, glow 2s ease-in-out infinite',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '14px',
    letterSpacing: '4px',
    textTransform: 'uppercase',
    fontWeight: '300',
  },
  contentWrapper: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  formCard: {
    position: 'relative',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '24px',
    padding: '40px',
    border: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(20px)',
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'conic-gradient(from 180deg at 50% 50%, rgba(102, 126, 234, 0.03) 0deg, rgba(240, 147, 251, 0.03) 120deg, rgba(67, 233, 123, 0.03) 240deg, rgba(102, 126, 234, 0.03) 360deg)',
    animation: 'spin 20s linear infinite',
    pointerEvents: 'none',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px',
    position: 'relative',
  },
  sectionIcon: {
    width: '28px',
    height: '28px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: '0.5px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginBottom: '36px',
    position: 'relative',
    flexWrap: 'wrap',
  },
  typeButton: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '14px 20px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'capitalize',
    overflow: 'hidden',
  },
  typeButtonActive: {
    background: 'rgba(102, 126, 234, 0.1)',
    borderColor: 'rgba(102, 126, 234, 0.3)',
    color: '#fff',
    boxShadow: '0 0 30px rgba(102, 126, 234, 0.2)',
  },
  typeIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeLabel: {
    position: 'relative',
    zIndex: 1,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60%',
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #667eea, #f093fb, transparent)',
    borderRadius: '2px',
  },
  textareaWrapper: {
    position: 'relative',
    marginBottom: '32px',
  },
  textarea: {
    width: '100%',
    padding: '18px 20px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    fontSize: '15px',
    color: '#fff',
    resize: 'vertical',
    fontFamily: 'inherit',
    lineHeight: '1.6',
    minHeight: '140px',
    outline: 'none',
    transition: 'all 0.3s ease',
  },
  textareaGlow: {
    position: 'absolute',
    inset: '-1px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(240, 147, 251, 0.2), rgba(67, 233, 123, 0.2))',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
    zIndex: -1,
  },
  generateButton: {
    position: 'relative',
    width: '100%',
    padding: '3px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    backgroundSize: '200% 200%',
    animation: 'gradientShift 4s ease infinite',
    border: 'none',
    borderRadius: '14px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '32px',
  },
  generateButtonInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '16px 24px',
    background: 'rgba(5, 5, 5, 0.9)',
    borderRadius: '11px',
    fontSize: '15px',
    fontWeight: '600',
    color: '#fff',
    letterSpacing: '0.5px',
  },
  spinner: {
    width: '18px',
    height: '18px',
    border: '2px solid rgba(255,255,255,0.2)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  resultCard: {
    position: 'relative',
    background: 'rgba(67, 233, 123, 0.03)',
    border: '1px solid rgba(67, 233, 123, 0.15)',
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '28px',
    overflow: 'hidden',
  },
  resultGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(67, 233, 123, 0.5), transparent)',
    animation: 'borderGlow 2s ease-in-out infinite',
  },
  resultHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  resultHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  resultIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    background: 'rgba(67, 233, 123, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: '0.3px',
  },
  copyButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: 'rgba(255,255,255,0.8)',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  resultContent: {
    position: 'relative',
    padding: '20px',
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.05)',
  },
  resultText: {
    fontSize: '15px',
    lineHeight: '1.8',
    color: 'rgba(255,255,255,0.85)',
    whiteSpace: 'pre-wrap',
    margin: 0,
  },
  infoCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '20px 24px',
    background: 'rgba(251, 191, 36, 0.05)',
    border: '1px solid rgba(251, 191, 36, 0.15)',
    borderRadius: '16px',
    position: 'relative',
  },
  infoIcon: {
    flexShrink: 0,
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'rgba(251, 191, 36, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'rgba(251, 191, 36, 0.9)',
    marginBottom: '6px',
    letterSpacing: '0.3px',
  },
  infoText: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
    lineHeight: '1.6',
    margin: 0,
  },
};
