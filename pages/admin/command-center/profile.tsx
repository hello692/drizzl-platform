import React from 'react';
import CommandCenterLayout from '../../../components/admin/CommandCenterLayout';
import { User, Mail, Key, Shield } from 'lucide-react';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255,255,255,0.03)';
const CARD_BORDER = 'rgba(255,255,255,0.08)';

export default function ProfilePage() {
  return (
    <CommandCenterLayout title="Profile">
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.iconWrapper}>
            <User size={24} color={NEON_GREEN} />
          </div>
          <div>
            <h1 style={styles.title}>Profile</h1>
            <p style={styles.subtitle}>Your account information</p>
          </div>
        </header>

        <div style={styles.profileCard}>
          <div style={styles.avatar}>
            <User size={48} color={NEON_GREEN} />
          </div>
          <div style={styles.profileInfo}>
            <h2 style={styles.profileName}>Admin User</h2>
            <p style={styles.profileEmail}>admin@drizzlwellness.com</p>
          </div>
        </div>

        <div style={styles.infoGrid}>
          <div style={styles.infoCard}>
            <Mail size={18} color={NEON_GREEN} />
            <span style={styles.infoLabel}>Email</span>
            <span style={styles.infoValue}>admin@drizzlwellness.com</span>
          </div>
          <div style={styles.infoCard}>
            <Key size={18} color={NEON_GREEN} />
            <span style={styles.infoLabel}>Role</span>
            <span style={styles.infoValue}>Administrator</span>
          </div>
          <div style={styles.infoCard}>
            <Shield size={18} color={NEON_GREEN} />
            <span style={styles.infoLabel}>2FA Status</span>
            <span style={styles.infoValue}>Enabled</span>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.comingSoon}>
            <span style={styles.comingSoonEmoji}>👤</span>
            <h2 style={styles.comingSoonTitle}>Full Profile Settings Coming Soon</h2>
            <p style={styles.comingSoonText}>
              Edit profile details, change password, manage connected accounts,
              and configure personal preferences.
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
  profileCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 24,
    padding: 32,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 96,
    height: 96,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 255, 133, 0.1)',
    borderRadius: '50%',
  },
  profileInfo: {},
  profileName: {
    fontSize: 24,
    fontWeight: 700,
    color: '#FFFFFF',
    margin: '0 0 4px 0',
  },
  profileEmail: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    margin: 0,
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
    marginBottom: 32,
  },
  infoCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: 20,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
  },
  infoLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
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
