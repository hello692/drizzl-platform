import React from 'react';
import CommandCenterLayout from '../../../components/admin/CommandCenterLayout';
import { Settings, User, Bell, Shield } from 'lucide-react';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255,255,255,0.03)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

export default function SettingsPage() {
  return (
    <CommandCenterLayout title="Settings">
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.iconWrapper}>
            <Settings size={24} color={NEON_GREEN} />
          </div>
          <div>
            <h1 style={styles.title}>Settings</h1>
            <p style={styles.subtitle}>Account and system configuration</p>
          </div>
        </header>

        <div style={styles.settingsList}>
          <div style={styles.settingCard}>
            <div style={styles.settingIcon}>
              <User size={20} color={NEON_GREEN} />
            </div>
            <div style={styles.settingContent}>
              <h3 style={styles.settingTitle}>Profile Settings</h3>
              <p style={styles.settingDescription}>Manage your account details and preferences</p>
            </div>
          </div>

          <div style={styles.settingCard}>
            <div style={styles.settingIcon}>
              <Bell size={20} color={NEON_GREEN} />
            </div>
            <div style={styles.settingContent}>
              <h3 style={styles.settingTitle}>Notifications</h3>
              <p style={styles.settingDescription}>Configure alerts and notification preferences</p>
            </div>
          </div>

          <div style={styles.settingCard}>
            <div style={styles.settingIcon}>
              <Shield size={20} color={NEON_GREEN} />
            </div>
            <div style={styles.settingContent}>
              <h3 style={styles.settingTitle}>Security</h3>
              <p style={styles.settingDescription}>Two-factor authentication and session management</p>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.comingSoon}>
            <span style={styles.comingSoonEmoji}>⚙️</span>
            <h2 style={styles.comingSoonTitle}>Full Settings Module Coming Soon</h2>
            <p style={styles.comingSoonText}>
              Content from existing settings tabs will be integrated here.
              Features include user management, integrations, API keys,
              and system preferences.
            </p>
          </div>
        </div>
      </div>
    </CommandCenterLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: 1400,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
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
  settingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 32,
  },
  settingCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  settingIcon: {
    width: 44,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    borderRadius: 10,
    flexShrink: 0,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 4px 0',
  },
  settingDescription: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    margin: 0,
  },
  card: {
    padding: 48,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
  },
  comingSoon: {
    textAlign: 'center',
    maxWidth: 500,
    margin: '0 auto',
  },
  comingSoonEmoji: {
    fontSize: 48,
    marginBottom: 16,
    display: 'block',
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: '0 0 12px 0',
  },
  comingSoonText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    lineHeight: 1.6,
    margin: 0,
  },
};
