import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { useRequireAdmin } from '../../hooks/useRole';

interface SettingSection {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const settingSections: SettingSection[] = [
  { id: 'general', title: 'General', description: 'Basic platform settings and preferences', icon: 'settings' },
  { id: 'notifications', title: 'Notifications', description: 'Configure email and push notifications', icon: 'bell' },
  { id: 'team', title: 'Team & Roles', description: 'Manage team members and permissions', icon: 'users' },
  { id: 'integrations', title: 'Integrations', description: 'Connect third-party services', icon: 'plug' },
  { id: 'billing', title: 'Billing', description: 'Subscription and payment settings', icon: 'credit' },
  { id: 'security', title: 'Security', description: 'Password and authentication settings', icon: 'shield' },
];

function SettingIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    settings: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#iconGrad)" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
    bell: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#iconGrad)" strokeWidth="1.5">
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
      </svg>
    ),
    users: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#iconGrad)" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    plug: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#iconGrad)" strokeWidth="1.5">
        <path d="M12 2v6M12 22v-6M4.93 10.93l4.24 4.24M14.83 8.83l4.24 4.24M2 12h6M22 12h-6M4.93 13.07l4.24-4.24M14.83 15.17l4.24-4.24" />
      </svg>
    ),
    credit: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#iconGrad)" strokeWidth="1.5">
        <rect x="1" y="4" width="22" height="16" rx="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
    shield: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#iconGrad)" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  };
  return (
    <span style={{ display: 'flex' }}>
      <svg width="0" height="0">
        <defs>
          <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
      </svg>
      {icons[type] || icons.settings}
    </span>
  );
}

export default function Settings() {
  const { loading, authorized } = useRequireAdmin();
  const [activeSection, setActiveSection] = useState('general');

  if (loading) {
    return (
      <AdminLayout title="Settings" subtitle="Configuration">
        <div style={styles.loadingContainer}>
          <div style={styles.loadingOrb} />
          <p style={styles.loadingText}>Loading settings...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!authorized) {
    return (
      <AdminLayout title="Settings" subtitle="Configuration">
        <div style={styles.loadingContainer}>
          <p style={styles.loadingText}>Authenticating...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Settings" subtitle="Configuration">
      <div style={styles.container}>
        <div style={styles.sidebar}>
          {settingSections.map(section => (
            <button
              key={section.id}
              style={{
                ...styles.sidebarItem,
                ...(activeSection === section.id ? styles.sidebarItemActive : {}),
              }}
              onClick={() => setActiveSection(section.id)}
            >
              <SettingIcon type={section.icon} />
              <div style={styles.sidebarText}>
                <span style={styles.sidebarTitle}>{section.title}</span>
                <span style={styles.sidebarDesc}>{section.description}</span>
              </div>
              {activeSection === section.id && <div style={styles.activeBar} />}
            </button>
          ))}
        </div>

        <div style={styles.content}>
          {activeSection === 'general' && <GeneralSettings />}
          {activeSection === 'notifications' && <NotificationSettings />}
          {activeSection === 'team' && <TeamSettings />}
          {activeSection === 'integrations' && <IntegrationSettings />}
          {activeSection === 'billing' && <BillingSettings />}
          {activeSection === 'security' && <SecuritySettings />}
        </div>
      </div>

      <style jsx global>{`
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(102, 126, 234, 0.3); } 50% { box-shadow: 0 0 40px rgba(102, 126, 234, 0.6); } }
      `}</style>
    </AdminLayout>
  );
}

function GeneralSettings() {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>General Settings</h3>
      <div style={styles.card}>
        <div style={styles.settingRow}>
          <div style={styles.settingInfo}>
            <h4 style={styles.settingLabel}>Company Name</h4>
            <p style={styles.settingDesc}>Your business name displayed across the platform</p>
          </div>
          <input type="text" style={styles.input} defaultValue="Drizzl Wellness Plantonica Inc." />
        </div>
        <div style={styles.settingRow}>
          <div style={styles.settingInfo}>
            <h4 style={styles.settingLabel}>Timezone</h4>
            <p style={styles.settingDesc}>Used for reports and scheduled tasks</p>
          </div>
          <select style={styles.select}>
            <option>America/New_York (EST)</option>
            <option>America/Los_Angeles (PST)</option>
            <option>America/Chicago (CST)</option>
          </select>
        </div>
        <div style={styles.settingRow}>
          <div style={styles.settingInfo}>
            <h4 style={styles.settingLabel}>Currency</h4>
            <p style={styles.settingDesc}>Default currency for pricing and reports</p>
          </div>
          <select style={styles.select}>
            <option>USD ($)</option>
            <option>EUR (€)</option>
            <option>GBP (£)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>Notification Preferences</h3>
      <div style={styles.card}>
        <div style={styles.settingRow}>
          <div style={styles.settingInfo}>
            <h4 style={styles.settingLabel}>Order Notifications</h4>
            <p style={styles.settingDesc}>Get notified when new orders are placed</p>
          </div>
          <ToggleSwitch defaultChecked />
        </div>
        <div style={styles.settingRow}>
          <div style={styles.settingInfo}>
            <h4 style={styles.settingLabel}>Low Stock Alerts</h4>
            <p style={styles.settingDesc}>Alerts when inventory falls below threshold</p>
          </div>
          <ToggleSwitch defaultChecked />
        </div>
        <div style={styles.settingRow}>
          <div style={styles.settingInfo}>
            <h4 style={styles.settingLabel}>Partner Applications</h4>
            <p style={styles.settingDesc}>Notify when new B2B partners apply</p>
          </div>
          <ToggleSwitch defaultChecked />
        </div>
        <div style={styles.settingRow}>
          <div style={styles.settingInfo}>
            <h4 style={styles.settingLabel}>Weekly Reports</h4>
            <p style={styles.settingDesc}>Receive weekly performance summary</p>
          </div>
          <ToggleSwitch />
        </div>
      </div>
    </div>
  );
}

function TeamSettings() {
  const teamMembers = [
    { name: 'Admin User', email: 'admin@drizzlwellness.com', role: 'Super Admin' },
    { name: 'Sarah Mitchell', email: 'sarah@drizzlwellness.com', role: 'Marketing' },
    { name: 'Mike Roberts', email: 'mike@drizzlwellness.com', role: 'Factory Manager' },
  ];
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>Team Members</h3>
      <div style={styles.card}>
        {teamMembers.map((member, i) => (
          <div key={i} style={{ ...styles.settingRow, ...(i < teamMembers.length - 1 ? { borderBottom: '1px solid rgba(255,255,255,0.06)' } : {}) }}>
            <div style={styles.teamMember}>
              <div style={styles.memberAvatar}>{member.name.split(' ').map(n => n[0]).join('')}</div>
              <div>
                <h4 style={styles.settingLabel}>{member.name}</h4>
                <p style={styles.settingDesc}>{member.email}</p>
              </div>
            </div>
            <span style={styles.roleBadge}>{member.role}</span>
          </div>
        ))}
      </div>
      <button style={styles.addBtn}>+ Invite Team Member</button>
    </div>
  );
}

function IntegrationSettings() {
  const integrations = [
    { name: 'Stripe', status: 'connected', icon: '💳' },
    { name: 'Mercury Banking', status: 'connected', icon: '🏦' },
    { name: 'Shopify', status: 'not_connected', icon: '🛒' },
    { name: 'QuickBooks', status: 'not_connected', icon: '📊' },
  ];
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>Connected Services</h3>
      <div style={styles.card}>
        {integrations.map((int, i) => (
          <div key={i} style={{ ...styles.settingRow, ...(i < integrations.length - 1 ? { borderBottom: '1px solid rgba(255,255,255,0.06)' } : {}) }}>
            <div style={styles.integrationInfo}>
              <span style={styles.integrationIcon}>{int.icon}</span>
              <h4 style={styles.settingLabel}>{int.name}</h4>
            </div>
            <button style={int.status === 'connected' ? styles.connectedBtn : styles.connectBtn}>
              {int.status === 'connected' ? 'Connected' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function BillingSettings() {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>Billing & Subscription</h3>
      <div style={styles.card}>
        <div style={styles.planCard}>
          <div style={styles.planHeader}>
            <span style={styles.planBadge}>Current Plan</span>
            <h4 style={styles.planName}>Enterprise</h4>
          </div>
          <p style={styles.planPrice}>$299<span>/month</span></p>
          <p style={styles.settingDesc}>Unlimited users, all features, priority support</p>
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>Security</h3>
      <div style={styles.card}>
        <div style={styles.settingRow}>
          <div style={styles.settingInfo}>
            <h4 style={styles.settingLabel}>Two-Factor Authentication</h4>
            <p style={styles.settingDesc}>Add an extra layer of security</p>
          </div>
          <ToggleSwitch />
        </div>
        <div style={styles.settingRow}>
          <div style={styles.settingInfo}>
            <h4 style={styles.settingLabel}>Session Timeout</h4>
            <p style={styles.settingDesc}>Automatically log out after inactivity</p>
          </div>
          <select style={styles.select}>
            <option>30 minutes</option>
            <option>1 hour</option>
            <option>4 hours</option>
            <option>Never</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function ToggleSwitch({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <button
      style={{ ...styles.toggle, ...(checked ? styles.toggleActive : {}) }}
      onClick={() => setChecked(!checked)}
    >
      <span style={{ ...styles.toggleKnob, ...(checked ? styles.toggleKnobActive : {}) }} />
    </button>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  loadingContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '20px' },
  loadingOrb: { width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', animation: 'pulse 2s infinite, glow 2s infinite' },
  loadingText: { color: 'rgba(255,255,255,0.5)', fontSize: '14px' },
  container: { display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px', minHeight: '600px' },
  sidebar: { display: 'flex', flexDirection: 'column', gap: '8px' },
  sidebarItem: { position: 'relative', display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 16px', borderRadius: '12px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', color: '#fff', transition: 'all 0.2s' },
  sidebarItemActive: { background: 'rgba(102, 126, 234, 0.1)' },
  sidebarText: { display: 'flex', flexDirection: 'column', gap: '4px' },
  sidebarTitle: { fontSize: '14px', fontWeight: '600' },
  sidebarDesc: { fontSize: '12px', color: 'rgba(255,255,255,0.4)' },
  activeBar: { position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: '3px', height: '24px', background: 'linear-gradient(180deg, #667eea, #a855f7)', borderRadius: '2px' },
  content: { flex: 1 },
  section: { marginBottom: '32px' },
  sectionTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '16px' },
  card: { background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', padding: '8px' },
  settingRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', gap: '20px' },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: '14px', fontWeight: '500', margin: 0, marginBottom: '4px' },
  settingDesc: { fontSize: '12px', color: 'rgba(255,255,255,0.4)', margin: 0 },
  input: { width: '280px', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: '14px' },
  select: { width: '200px', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: '#fff', fontSize: '14px' },
  toggle: { width: '48px', height: '26px', borderRadius: '13px', border: 'none', background: 'rgba(255,255,255,0.1)', padding: '2px', cursor: 'pointer', transition: 'all 0.2s' },
  toggleActive: { background: 'linear-gradient(135deg, #667eea, #764ba2)' },
  toggleKnob: { display: 'block', width: '22px', height: '22px', borderRadius: '50%', background: '#fff', transition: 'all 0.2s' },
  toggleKnobActive: { transform: 'translateX(22px)' },
  teamMember: { display: 'flex', alignItems: 'center', gap: '12px' },
  memberAvatar: { width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '600' },
  roleBadge: { padding: '6px 12px', borderRadius: '6px', background: 'rgba(102, 126, 234, 0.15)', color: '#667eea', fontSize: '12px', fontWeight: '500' },
  addBtn: { marginTop: '16px', padding: '12px 20px', borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.2)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '13px', cursor: 'pointer', width: '100%' },
  integrationInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
  integrationIcon: { fontSize: '24px' },
  connectedBtn: { padding: '8px 16px', borderRadius: '6px', border: 'none', background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', fontSize: '12px', fontWeight: '500', cursor: 'pointer' },
  connectBtn: { padding: '8px 16px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontSize: '12px', cursor: 'pointer' },
  planCard: { padding: '24px', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(168, 85, 247, 0.1))', borderRadius: '12px' },
  planHeader: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
  planBadge: { padding: '4px 10px', borderRadius: '4px', background: 'rgba(102, 126, 234, 0.2)', color: '#667eea', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' },
  planName: { fontSize: '20px', fontWeight: '700', margin: 0 },
  planPrice: { fontSize: '32px', fontWeight: '700', margin: '8px 0' },
};
