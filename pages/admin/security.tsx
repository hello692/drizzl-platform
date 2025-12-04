import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useRequireAdmin } from '../../hooks/useRole';

interface TwoFAStatus {
  enabled: boolean;
  setupAt?: string;
}

interface TwoFASetupData {
  qrCodeUrl?: string;
  backupCodes?: string[];
  message?: string;
}

interface Session {
  id: string;
  user_id: string;
  device_info: {
    browser?: string;
    os?: string;
    device?: string;
  };
  ip_address: string;
  location?: string;
  is_active: boolean;
  last_activity_at: string;
  created_at: string;
}

interface AuditLog {
  id: string;
  user_id: string | null;
  action_type: string;
  resource_type?: string;
  resource_id?: string;
  details: Record<string, any>;
  ip_address?: string;
  status: 'success' | 'failure' | 'warning';
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
}

const MOCK_USER_ID = 'demo-user-123';
const MOCK_USER_EMAIL = 'admin@drizzlwellness.com';

const actionTypeOptions = [
  { value: '', label: 'All Actions' },
  { value: 'login', label: 'Login' },
  { value: 'logout', label: 'Logout' },
  { value: 'login_failed', label: 'Failed Login' },
  { value: '2fa_enabled', label: '2FA Enabled' },
  { value: '2fa_disabled', label: '2FA Disabled' },
  { value: 'session_created', label: 'Session Created' },
  { value: 'session_terminated', label: 'Session Terminated' },
  { value: 'password_changed', label: 'Password Changed' },
  { value: 'partner_approved', label: 'Partner Approved' },
  { value: 'partner_rejected', label: 'Partner Rejected' },
  { value: 'admin_action', label: 'Admin Action' },
];

const riskLevelOptions = [
  { value: '', label: 'All Risk Levels' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c471f5" />
        <stop offset="100%" stopColor="#00f2fe" />
      </linearGradient>
    </defs>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="url(#shieldGrad)" strokeWidth="2" fill="none" />
    <path d="M9 12l2 2 4-4" stroke="url(#shieldGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const KeyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="keyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#c471f5" />
        <stop offset="100%" stopColor="#ff6b9d" />
      </linearGradient>
    </defs>
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" stroke="url(#keyGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DeviceIcon = ({ type }: { type?: string }) => {
  const color = type === 'Mobile' ? '#ff6b9d' : type === 'Tablet' ? '#00f2fe' : '#c471f5';
  if (type === 'Mobile') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    );
  }
  if (type === 'Tablet') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
};

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="clockGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00f2fe" />
        <stop offset="100%" stopColor="#43e97b" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" stroke="url(#clockGrad2)" strokeWidth="2" />
    <path d="M12 6v6l4 2" stroke="url(#clockGrad2)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const LogIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="logGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#43e97b" />
        <stop offset="100%" stopColor="#00f2fe" />
      </linearGradient>
    </defs>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="url(#logGrad)" strokeWidth="2" />
    <polyline points="14,2 14,8 20,8" stroke="url(#logGrad)" strokeWidth="2" />
    <line x1="16" y1="13" x2="8" y2="13" stroke="url(#logGrad)" strokeWidth="2" />
    <line x1="16" y1="17" x2="8" y2="17" stroke="url(#logGrad)" strokeWidth="2" />
  </svg>
);

const TerminateIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23,4 23,10 17,10" />
    <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
  </svg>
);

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

function getRiskLevelColor(level: string): { bg: string; border: string; text: string } {
  switch (level) {
    case 'low':
      return { bg: 'rgba(67, 233, 123, 0.1)', border: 'rgba(67, 233, 123, 0.3)', text: '#43e97b' };
    case 'medium':
      return { bg: 'rgba(251, 191, 36, 0.1)', border: 'rgba(251, 191, 36, 0.3)', text: '#fbbf24' };
    case 'high':
      return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: '#ef4444' };
    case 'critical':
      return { bg: 'rgba(196, 113, 245, 0.1)', border: 'rgba(196, 113, 245, 0.3)', text: '#c471f5' };
    default:
      return { bg: 'rgba(255, 255, 255, 0.05)', border: 'rgba(255, 255, 255, 0.1)', text: 'rgba(255,255,255,0.6)' };
  }
}

function getStatusColor(status: string): { bg: string; text: string } {
  switch (status) {
    case 'success':
      return { bg: 'rgba(67, 233, 123, 0.15)', text: '#43e97b' };
    case 'failure':
      return { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' };
    case 'warning':
      return { bg: 'rgba(251, 191, 36, 0.15)', text: '#fbbf24' };
    default:
      return { bg: 'rgba(255, 255, 255, 0.05)', text: 'rgba(255,255,255,0.6)' };
  }
}

export default function SecuritySettings() {
  const { loading, authorized } = useRequireAdmin();
  const [activeTab, setActiveTab] = useState<'2fa' | 'sessions' | 'logs'>('2fa');

  if (loading) {
    return (
      <AdminLayout title="Security" subtitle="Protection Center">
        <div style={styles.loadingContainer}>
          <div style={styles.loadingOrb} />
          <p style={styles.loadingText}>Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!authorized) {
    return (
      <AdminLayout title="Security" subtitle="Protection Center">
        <div style={styles.loadingContainer}>
          <p style={styles.loadingText}>Authenticating...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Security" subtitle="Protection Center">
      <div style={styles.tabsContainer}>
        <button
          style={{ ...styles.tab, ...(activeTab === '2fa' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('2fa')}
        >
          <KeyIcon />
          <span>Two-Factor Auth</span>
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'sessions' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('sessions')}
        >
          <DeviceIcon type="Desktop" />
          <span>Active Sessions</span>
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'logs' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('logs')}
        >
          <LogIcon />
          <span>Audit Logs</span>
        </button>
      </div>

      <div style={styles.content}>
        {activeTab === '2fa' && <TwoFactorSection />}
        {activeTab === 'sessions' && <SessionsSection />}
        {activeTab === 'logs' && <AuditLogsSection />}
      </div>

      <style jsx global>{`
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(196, 113, 245, 0.3); } 50% { box-shadow: 0 0 40px rgba(196, 113, 245, 0.6); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}</style>
    </AdminLayout>
  );
}

function TwoFactorSection() {
  const [status, setStatus] = useState<TwoFAStatus>({ enabled: false });
  const [setupData, setSetupData] = useState<TwoFASetupData | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [disableCode, setDisableCode] = useState('');
  const [showDisableForm, setShowDisableForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [savedBackupCodes, setSavedBackupCodes] = useState<string[]>([]);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/security/2fa?userId=${MOCK_USER_ID}`);
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error('Failed to fetch 2FA status:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleSetup2FA = async () => {
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/security/2fa?userId=${MOCK_USER_ID}&email=${MOCK_USER_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setup' }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSetupData(data);
        setSavedBackupCodes(data.backupCodes || []);
      }
    } catch (err) {
      setError('Failed to start 2FA setup');
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifySetup = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/security/2fa?userId=${MOCK_USER_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-setup', code: verificationCode }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSuccess('Two-factor authentication enabled successfully!');
        setShowBackupCodes(true);
        setSetupData(null);
        setVerificationCode('');
        fetchStatus();
      }
    } catch (err) {
      setError('Verification failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!disableCode || disableCode.length !== 6) {
      setError('Please enter your current 2FA code');
      return;
    }
    setActionLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/security/2fa?userId=${MOCK_USER_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disable', code: disableCode }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSuccess('Two-factor authentication disabled');
        setShowDisableForm(false);
        setDisableCode('');
        setSavedBackupCodes([]);
        setShowBackupCodes(false);
        fetchStatus();
      }
    } catch (err) {
      setError('Failed to disable 2FA');
    } finally {
      setActionLoading(false);
    }
  };

  const cancelSetup = () => {
    setSetupData(null);
    setVerificationCode('');
    setError(null);
  };

  if (loading) {
    return (
      <div style={styles.sectionLoading}>
        <div style={styles.loadingOrb} />
      </div>
    );
  }

  return (
    <div style={styles.section}>
      <div style={styles.glassCard}>
        <div style={styles.cardHeader}>
          <div style={styles.headerLeft}>
            <ShieldIcon />
            <div>
              <h2 style={styles.cardTitle}>Two-Factor Authentication</h2>
              <p style={styles.cardSubtitle}>Add an extra layer of security to your account</p>
            </div>
          </div>
          <div style={{
            ...styles.statusBadge,
            background: status.enabled ? 'rgba(67, 233, 123, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            borderColor: status.enabled ? 'rgba(67, 233, 123, 0.3)' : 'rgba(255, 255, 255, 0.1)',
            color: status.enabled ? '#43e97b' : 'rgba(255,255,255,0.5)',
          }}>
            {status.enabled ? '● Enabled' : '○ Disabled'}
          </div>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}
        {success && <div style={styles.successAlert}>{success}</div>}

        {!status.enabled && !setupData && (
          <div style={styles.setupPrompt}>
            <p style={styles.promptText}>
              Protect your account with two-factor authentication using an authenticator app like Google Authenticator or Authy.
            </p>
            <button
              style={styles.primaryButton}
              onClick={handleSetup2FA}
              disabled={actionLoading}
            >
              {actionLoading ? 'Setting up...' : 'Enable 2FA'}
            </button>
          </div>
        )}

        {setupData && setupData.qrCodeUrl && (
          <div style={styles.setupFlow}>
            <div style={styles.setupStep}>
              <div style={styles.stepNumber}>1</div>
              <div style={styles.stepContent}>
                <h4 style={styles.stepTitle}>Scan QR Code</h4>
                <p style={styles.stepDesc}>Open your authenticator app and scan this QR code</p>
                <div style={styles.qrContainer}>
                  <div style={styles.qrPlaceholder}>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(setupData.qrCodeUrl)}`}
                      alt="2FA QR Code"
                      style={styles.qrImage}
                    />
                  </div>
                  <p style={styles.manualEntry}>
                    Can't scan? Enter this code manually:
                    <code style={styles.secretCode}>
                      {setupData.qrCodeUrl.split('secret=')[1]?.split('&')[0] || 'XXXXXXXXXXXXXX'}
                    </code>
                  </p>
                </div>
              </div>
            </div>

            <div style={styles.setupStep}>
              <div style={styles.stepNumber}>2</div>
              <div style={styles.stepContent}>
                <h4 style={styles.stepTitle}>Enter Verification Code</h4>
                <p style={styles.stepDesc}>Enter the 6-digit code from your authenticator app</p>
                <div style={styles.codeInputContainer}>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    style={styles.codeInput}
                    maxLength={6}
                  />
                  <div style={styles.buttonRow}>
                    <button style={styles.secondaryButton} onClick={cancelSetup}>
                      Cancel
                    </button>
                    <button
                      style={styles.primaryButton}
                      onClick={handleVerifySetup}
                      disabled={actionLoading || verificationCode.length !== 6}
                    >
                      {actionLoading ? 'Verifying...' : 'Verify & Enable'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {status.enabled && !showDisableForm && (
          <div style={styles.enabledState}>
            <div style={styles.enabledInfo}>
              <p style={styles.enabledText}>
                2FA has been enabled since {status.setupAt ? formatDate(status.setupAt) : 'recently'}
              </p>
              {savedBackupCodes.length > 0 && (
                <button
                  style={styles.linkButton}
                  onClick={() => setShowBackupCodes(!showBackupCodes)}
                >
                  {showBackupCodes ? 'Hide Backup Codes' : 'Show Backup Codes'}
                </button>
              )}
            </div>
            <button
              style={styles.dangerButton}
              onClick={() => setShowDisableForm(true)}
            >
              Disable 2FA
            </button>
          </div>
        )}

        {showBackupCodes && savedBackupCodes.length > 0 && (
          <div style={styles.backupCodesSection}>
            <h4 style={styles.backupTitle}>Backup Codes</h4>
            <p style={styles.backupDesc}>
              Store these codes safely. Each code can only be used once.
            </p>
            <div style={styles.backupCodesGrid}>
              {savedBackupCodes.map((code, i) => (
                <code key={i} style={styles.backupCode}>{code}</code>
              ))}
            </div>
          </div>
        )}

        {showDisableForm && (
          <div style={styles.disableForm}>
            <p style={styles.disableWarning}>
              ⚠️ Disabling 2FA will reduce your account security. Enter your current 2FA code to confirm.
            </p>
            <div style={styles.codeInputContainer}>
              <input
                type="text"
                value={disableCode}
                onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter code"
                style={styles.codeInput}
                maxLength={6}
              />
              <div style={styles.buttonRow}>
                <button style={styles.secondaryButton} onClick={() => {
                  setShowDisableForm(false);
                  setDisableCode('');
                  setError(null);
                }}>
                  Cancel
                </button>
                <button
                  style={styles.dangerButton}
                  onClick={handleDisable2FA}
                  disabled={actionLoading || disableCode.length !== 6}
                >
                  {actionLoading ? 'Disabling...' : 'Confirm Disable'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SessionsSection() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [currentSessionId] = useState('current-session-mock');

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/security/sessions?userId=${MOCK_USER_ID}`);
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
      setSessions([
        {
          id: 'session-1',
          user_id: MOCK_USER_ID,
          device_info: { browser: 'Chrome', os: 'macOS', device: 'Desktop' },
          ip_address: '192.168.1.100',
          location: 'San Francisco, CA',
          is_active: true,
          last_activity_at: new Date().toISOString(),
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'session-2',
          user_id: MOCK_USER_ID,
          device_info: { browser: 'Safari', os: 'iOS', device: 'Mobile' },
          ip_address: '10.0.0.50',
          location: 'New York, NY',
          is_active: true,
          last_activity_at: new Date(Date.now() - 7200000).toISOString(),
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: 'session-3',
          user_id: MOCK_USER_ID,
          device_info: { browser: 'Firefox', os: 'Windows', device: 'Desktop' },
          ip_address: '172.16.0.25',
          location: 'Austin, TX',
          is_active: true,
          last_activity_at: new Date(Date.now() - 28800000).toISOString(),
          created_at: new Date(Date.now() - 172800000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleTerminateSession = async (sessionId: string) => {
    setActionLoading(sessionId);
    try {
      await fetch(`/api/admin/security/sessions?userId=${MOCK_USER_ID}&sessionId=${sessionId}`, {
        method: 'DELETE',
      });
      setSessions(sessions.filter(s => s.id !== sessionId));
    } catch (err) {
      console.error('Failed to terminate session:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleTerminateAllOther = async () => {
    setActionLoading('all');
    try {
      await fetch(`/api/admin/security/sessions?userId=${MOCK_USER_ID}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exceptCurrent: currentSessionId }),
      });
      setSessions(sessions.filter(s => s.id === currentSessionId || s.id === 'session-1'));
    } catch (err) {
      console.error('Failed to terminate sessions:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div style={styles.sectionLoading}>
        <div style={styles.loadingOrb} />
      </div>
    );
  }

  return (
    <div style={styles.section}>
      <div style={styles.glassCard}>
        <div style={styles.cardHeader}>
          <div style={styles.headerLeft}>
            <ClockIcon />
            <div>
              <h2 style={styles.cardTitle}>Active Sessions</h2>
              <p style={styles.cardSubtitle}>{sessions.length} active session{sessions.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <div style={styles.headerActions}>
            <button style={styles.iconButton} onClick={fetchSessions}>
              <RefreshIcon />
            </button>
            {sessions.length > 1 && (
              <button
                style={styles.dangerOutlineButton}
                onClick={handleTerminateAllOther}
                disabled={actionLoading === 'all'}
              >
                {actionLoading === 'all' ? 'Terminating...' : 'Terminate All Other'}
              </button>
            )}
          </div>
        </div>

        <div style={styles.sessionsList}>
          {sessions.map((session, index) => {
            const isCurrent = index === 0;
            return (
              <div
                key={session.id}
                style={{
                  ...styles.sessionCard,
                  ...(isCurrent ? styles.currentSession : {}),
                }}
              >
                <div style={styles.sessionIcon}>
                  <DeviceIcon type={session.device_info?.device} />
                </div>
                <div style={styles.sessionDetails}>
                  <div style={styles.sessionTop}>
                    <div style={styles.sessionDeviceInfo}>
                      <span style={styles.sessionBrowser}>
                        {session.device_info?.browser || 'Unknown'} on {session.device_info?.os || 'Unknown'}
                      </span>
                      {isCurrent && <span style={styles.currentBadge}>Current Session</span>}
                    </div>
                    <span style={styles.sessionTime}>
                      {formatRelativeTime(session.last_activity_at)}
                    </span>
                  </div>
                  <div style={styles.sessionBottom}>
                    <span style={styles.sessionMeta}>
                      {session.ip_address}
                      {session.location && ` • ${session.location}`}
                    </span>
                    <span style={styles.sessionCreated}>
                      Created {formatRelativeTime(session.created_at)}
                    </span>
                  </div>
                </div>
                {!isCurrent && (
                  <button
                    style={styles.terminateButton}
                    onClick={() => handleTerminateSession(session.id)}
                    disabled={actionLoading === session.id}
                  >
                    {actionLoading === session.id ? (
                      <span style={styles.loadingDot} />
                    ) : (
                      <TerminateIcon />
                    )}
                  </button>
                )}
              </div>
            );
          })}

          {sessions.length === 0 && (
            <div style={styles.emptyState}>
              <p>No active sessions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AuditLogsSection() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [actionFilter, setActionFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const limit = 10;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(page * limit),
      });
      if (actionFilter) params.append('actionType', actionFilter);
      if (riskFilter) params.append('riskLevel', riskFilter);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const res = await fetch(`/api/admin/security/audit-logs?${params}`);
      const data = await res.json();
      setLogs(data.logs || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
      setLogs([
        {
          id: '1',
          user_id: MOCK_USER_ID,
          action_type: 'login',
          details: { method: 'password' },
          ip_address: '192.168.1.100',
          status: 'success',
          risk_level: 'low',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          user_id: MOCK_USER_ID,
          action_type: 'partner_approved',
          resource_type: 'partner',
          resource_id: 'partner-123',
          details: { company: 'Acme Corp' },
          ip_address: '192.168.1.100',
          status: 'success',
          risk_level: 'medium',
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '3',
          user_id: null,
          action_type: 'login_failed',
          details: { email: 'test@example.com', reason: 'Invalid password' },
          ip_address: '10.0.0.1',
          status: 'failure',
          risk_level: 'high',
          created_at: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          id: '4',
          user_id: MOCK_USER_ID,
          action_type: '2fa_enabled',
          details: { method: 'totp' },
          ip_address: '192.168.1.100',
          status: 'success',
          risk_level: 'low',
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '5',
          user_id: MOCK_USER_ID,
          action_type: 'admin_action',
          resource_type: 'settings',
          details: { action: 'permission_change' },
          ip_address: '192.168.1.100',
          status: 'warning',
          risk_level: 'critical',
          created_at: new Date(Date.now() - 172800000).toISOString(),
        },
      ]);
      setTotal(5);
    } finally {
      setLoading(false);
    }
  }, [page, actionFilter, riskFilter, startDate, endDate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const totalPages = Math.ceil(total / limit);

  const formatActionType = (action: string) => {
    return action.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div style={styles.section}>
      <div style={styles.glassCard}>
        <div style={styles.cardHeader}>
          <div style={styles.headerLeft}>
            <LogIcon />
            <div>
              <h2 style={styles.cardTitle}>Audit Logs</h2>
              <p style={styles.cardSubtitle}>{total} security event{total !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button style={styles.iconButton} onClick={fetchLogs}>
            <RefreshIcon />
          </button>
        </div>

        <div style={styles.filtersRow}>
          <select
            style={styles.filterSelect}
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setPage(0); }}
          >
            {actionTypeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <select
            style={styles.filterSelect}
            value={riskFilter}
            onChange={(e) => { setRiskFilter(e.target.value); setPage(0); }}
          >
            {riskLevelOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <input
            type="date"
            style={styles.dateInput}
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setPage(0); }}
            placeholder="Start date"
          />
          <input
            type="date"
            style={styles.dateInput}
            value={endDate}
            onChange={(e) => { setEndDate(e.target.value); setPage(0); }}
            placeholder="End date"
          />
          {(actionFilter || riskFilter || startDate || endDate) && (
            <button
              style={styles.clearFiltersBtn}
              onClick={() => {
                setActionFilter('');
                setRiskFilter('');
                setStartDate('');
                setEndDate('');
                setPage(0);
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {loading ? (
          <div style={styles.tableLoading}>
            <div style={styles.loadingOrb} />
          </div>
        ) : (
          <>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Time</th>
                    <th style={styles.th}>Action</th>
                    <th style={styles.th}>User</th>
                    <th style={styles.th}>Resource</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const riskColors = getRiskLevelColor(log.risk_level);
                    const statusColors = getStatusColor(log.status);
                    return (
                      <tr key={log.id} style={styles.tr}>
                        <td style={styles.td}>
                          <span style={styles.timeCell}>{formatDate(log.created_at)}</span>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.actionCell}>{formatActionType(log.action_type)}</span>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.userCell}>
                            {log.user_id ? log.user_id.slice(0, 8) + '...' : 'Anonymous'}
                          </span>
                          {log.ip_address && (
                            <span style={styles.ipCell}>{log.ip_address}</span>
                          )}
                        </td>
                        <td style={styles.td}>
                          {log.resource_type ? (
                            <span style={styles.resourceCell}>
                              {log.resource_type}
                              {log.resource_id && <code style={styles.resourceId}>#{log.resource_id.slice(0, 8)}</code>}
                            </span>
                          ) : (
                            <span style={styles.emptyCell}>—</span>
                          )}
                        </td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.statusBadgeSmall,
                            background: statusColors.bg,
                            color: statusColors.text,
                          }}>
                            {log.status}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.riskBadge,
                            background: riskColors.bg,
                            borderColor: riskColors.border,
                            color: riskColors.text,
                          }}>
                            {log.risk_level}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {logs.length === 0 && (
                <div style={styles.emptyState}>
                  <p>No audit logs found matching your filters</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div style={styles.pagination}>
                <button
                  style={{ ...styles.pageButton, ...(page === 0 ? styles.pageButtonDisabled : {}) }}
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                >
                  ← Previous
                </button>
                <span style={styles.pageInfo}>
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  style={{ ...styles.pageButton, ...(page >= totalPages - 1 ? styles.pageButtonDisabled : {}) }}
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '20px',
  },
  loadingOrb: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #c471f5, #00f2fe)',
    animation: 'pulse 2s infinite, glow 2s infinite',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  sectionLoading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 0',
  },
  tabsContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '24px',
    padding: '6px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.06)',
    width: 'fit-content',
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 20px',
    borderRadius: '12px',
    border: 'none',
    background: 'transparent',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    background: 'linear-gradient(135deg, rgba(196, 113, 245, 0.15), rgba(0, 242, 254, 0.1))',
    color: '#fff',
    boxShadow: '0 0 20px rgba(196, 113, 245, 0.2)',
  },
  content: {
    animation: 'fadeIn 0.3s ease',
  },
  section: {
    marginBottom: '24px',
  },
  glassCard: {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '24px',
    padding: '28px',
    border: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(20px)',
    boxShadow: '0 4px 40px rgba(0,0,0,0.3)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #c471f5, #00f2fe)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
  },
  cardSubtitle: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.4)',
    margin: '4px 0 0 0',
  },
  statusBadge: {
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
    border: '1px solid',
  },
  errorAlert: {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '12px',
    padding: '14px 18px',
    marginBottom: '20px',
    color: '#ef4444',
    fontSize: '14px',
  },
  successAlert: {
    background: 'rgba(67, 233, 123, 0.1)',
    border: '1px solid rgba(67, 233, 123, 0.3)',
    borderRadius: '12px',
    padding: '14px 18px',
    marginBottom: '20px',
    color: '#43e97b',
    fontSize: '14px',
  },
  setupPrompt: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  promptText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '15px',
    lineHeight: '1.6',
    marginBottom: '24px',
    maxWidth: '400px',
    margin: '0 auto 24px',
  },
  primaryButton: {
    padding: '14px 28px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #c471f5, #00f2fe)',
    color: '#000',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 20px rgba(196, 113, 245, 0.3)',
  },
  secondaryButton: {
    padding: '12px 24px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'transparent',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  dangerButton: {
    padding: '12px 24px',
    borderRadius: '10px',
    border: 'none',
    background: 'rgba(239, 68, 68, 0.15)',
    color: '#ef4444',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  dangerOutlineButton: {
    padding: '10px 18px',
    borderRadius: '10px',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    background: 'transparent',
    color: '#ef4444',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  iconButton: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.03)',
    color: 'rgba(255,255,255,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#c471f5',
    fontSize: '13px',
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 0,
  },
  setupFlow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  setupStep: {
    display: 'flex',
    gap: '20px',
  },
  stepNumber: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #c471f5, #00f2fe)',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '700',
    flexShrink: 0,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#fff',
    margin: '0 0 6px 0',
  },
  stepDesc: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.5)',
    margin: '0 0 20px 0',
  },
  qrContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
  },
  qrPlaceholder: {
    width: '200px',
    height: '200px',
    background: '#fff',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px',
  },
  qrImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  manualEntry: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  secretCode: {
    display: 'block',
    marginTop: '8px',
    padding: '10px 16px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '14px',
    color: '#c471f5',
    letterSpacing: '2px',
  },
  codeInputContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '300px',
  },
  codeInput: {
    padding: '16px 20px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.03)',
    color: '#fff',
    fontSize: '24px',
    fontFamily: 'monospace',
    letterSpacing: '8px',
    textAlign: 'center',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  buttonRow: {
    display: 'flex',
    gap: '12px',
  },
  enabledState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
    background: 'rgba(67, 233, 123, 0.05)',
    borderRadius: '16px',
    border: '1px solid rgba(67, 233, 123, 0.15)',
  },
  enabledInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  enabledText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px',
    margin: 0,
  },
  backupCodesSection: {
    marginTop: '24px',
    padding: '20px',
    background: 'rgba(196, 113, 245, 0.05)',
    borderRadius: '16px',
    border: '1px solid rgba(196, 113, 245, 0.15)',
  },
  backupTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#c471f5',
    margin: '0 0 8px 0',
  },
  backupDesc: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.5)',
    margin: '0 0 16px 0',
  },
  backupCodesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '10px',
  },
  backupCode: {
    padding: '10px',
    background: 'rgba(0,0,0,0.3)',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '13px',
    color: '#fff',
    textAlign: 'center',
  },
  disableForm: {
    padding: '24px',
    background: 'rgba(239, 68, 68, 0.05)',
    borderRadius: '16px',
    border: '1px solid rgba(239, 68, 68, 0.15)',
  },
  disableWarning: {
    color: '#ef4444',
    fontSize: '14px',
    marginBottom: '20px',
  },
  sessionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  sessionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '18px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.06)',
    transition: 'all 0.2s ease',
  },
  currentSession: {
    background: 'rgba(67, 233, 123, 0.05)',
    borderColor: 'rgba(67, 233, 123, 0.2)',
  },
  sessionIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.03)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionDetails: {
    flex: 1,
  },
  sessionTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '6px',
  },
  sessionDeviceInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  sessionBrowser: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#fff',
  },
  currentBadge: {
    padding: '4px 10px',
    borderRadius: '6px',
    background: 'rgba(67, 233, 123, 0.15)',
    color: '#43e97b',
    fontSize: '11px',
    fontWeight: '600',
  },
  sessionTime: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
  },
  sessionBottom: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sessionMeta: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.4)',
  },
  sessionCreated: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.3)',
  },
  terminateButton: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    border: 'none',
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  loadingDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#ef4444',
    animation: 'pulse 1s infinite',
  },
  filtersRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '20px',
  },
  filterSelect: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.03)',
    color: '#fff',
    fontSize: '13px',
    minWidth: '150px',
    outline: 'none',
    cursor: 'pointer',
  },
  dateInput: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.03)',
    color: '#fff',
    fontSize: '13px',
    outline: 'none',
  },
  clearFiltersBtn: {
    padding: '10px 16px',
    borderRadius: '10px',
    border: 'none',
    background: 'rgba(255,255,255,0.05)',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  tableLoading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 0',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '14px 16px',
    textAlign: 'left',
    fontSize: '11px',
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    transition: 'background 0.15s ease',
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    verticalAlign: 'middle',
  },
  timeCell: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '13px',
  },
  actionCell: {
    color: '#fff',
    fontWeight: '500',
  },
  userCell: {
    display: 'block',
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'monospace',
    fontSize: '12px',
  },
  ipCell: {
    display: 'block',
    color: 'rgba(255,255,255,0.3)',
    fontSize: '11px',
    marginTop: '4px',
  },
  resourceCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'capitalize',
  },
  resourceId: {
    padding: '2px 6px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '4px',
    fontSize: '11px',
    fontFamily: 'monospace',
    color: 'rgba(255,255,255,0.4)',
  },
  emptyCell: {
    color: 'rgba(255,255,255,0.2)',
  },
  statusBadgeSmall: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  riskBadge: {
    display: 'inline-block',
    padding: '5px 12px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'capitalize',
    border: '1px solid',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: 'rgba(255,255,255,0.4)',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  pageButton: {
    padding: '10px 18px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.03)',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  pageButtonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
  },
  pageInfo: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '13px',
  },
};
