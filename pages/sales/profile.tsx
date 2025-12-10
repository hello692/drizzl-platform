import React, { useState } from 'react';
import { useRouter } from 'next/router';
import SalesLayout from '../../components/sales/SalesLayout';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Users,
  Edit3,
  Target,
  DollarSign,
  Star,
  Trophy,
  TrendingUp,
  Settings,
  Clock,
  MessageSquare,
  PenTool,
  Calendar,
  BookOpen,
  GraduationCap,
  Calculator,
  FileText,
  LogOut,
  ChevronRight,
  X,
  Save,
} from 'lucide-react';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

const profileData = {
  name: 'Sarah Johnson',
  title: 'Senior Sales Rep',
  email: 'sjohnson@drizzlwellness.com',
  phone: '(555) 987-6543',
  territory: 'West Coast',
  manager: 'Mike Chen',
  team: 'Sales Team Alpha',
  initials: 'SJ',
};

const allTimeStats = [
  { icon: Target, label: 'Deals Closed', value: '47', emoji: '🎯' },
  { icon: DollarSign, label: 'Total Sales', value: '$2.4M', emoji: '💰' },
  { icon: Star, label: 'Avg Rating', value: '4.9/5.0', emoji: '⭐' },
  { icon: Trophy, label: 'Awards', value: 'Top Rep Q3 2024', emoji: '🏆' },
];

const thisYearStats = [
  { icon: Target, label: 'Deals', value: '32', emoji: '🎯' },
  { icon: DollarSign, label: 'Sales', value: '$1.8M', emoji: '💰' },
  { icon: TrendingUp, label: 'Growth', value: '+42% YoY', emoji: '📈' },
];

const quickSettings = [
  { icon: Settings, label: 'Notifications', emoji: '⚙️' },
  { icon: Clock, label: 'Availability hours', emoji: '🕐' },
  { icon: MessageSquare, label: 'Auto-responses', emoji: '💬' },
  { icon: PenTool, label: 'Email signature', emoji: '✍️' },
  { icon: Calendar, label: 'Calendar sync', emoji: '📅' },
  { icon: Target, label: 'Goal settings', emoji: '🎯' },
];

const resources = [
  { icon: BookOpen, label: 'Sales playbook', emoji: '📖', link: '#' },
  { icon: GraduationCap, label: 'Product training', emoji: '📚', link: '#' },
  { icon: Calculator, label: 'Pricing calculator', emoji: '🧮', link: '#' },
  { icon: FileText, label: 'Contract templates', emoji: '📄', link: '#' },
];

export default function SalesProfile() {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: profileData.name,
    title: profileData.title,
    email: profileData.email,
    phone: profileData.phone,
    territory: profileData.territory,
  });

  const handleSignOut = () => {
    localStorage.removeItem('salesSession');
    router.push('/sales/login');
  };

  const handleSaveProfile = () => {
    setShowEditModal(false);
  };

  return (
    <SalesLayout title="Profile" repName={profileData.name}>
      <div style={styles.page}>
        <section style={styles.profileHeader}>
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>
              <span style={styles.avatarText}>{profileData.initials}</span>
            </div>
            <div style={styles.profileInfo}>
              <h1 style={styles.profileName}>{profileData.name}</h1>
              <p style={styles.profileTitle}>{profileData.title}</p>
            </div>
          </div>
          
          <div style={styles.profileDetails}>
            <div style={styles.detailItem}>
              <Mail size={16} color="rgba(255,255,255,0.5)" />
              <span>{profileData.email}</span>
            </div>
            <div style={styles.detailItem}>
              <Phone size={16} color="rgba(255,255,255,0.5)" />
              <span>{profileData.phone}</span>
            </div>
            <div style={styles.detailItem}>
              <MapPin size={16} color="rgba(255,255,255,0.5)" />
              <span>Territory: {profileData.territory}</span>
            </div>
            <div style={styles.detailItem}>
              <User size={16} color="rgba(255,255,255,0.5)" />
              <span>Manager: {profileData.manager}</span>
            </div>
            <div style={styles.detailItem}>
              <Users size={16} color="rgba(255,255,255,0.5)" />
              <span>Team: {profileData.team}</span>
            </div>
          </div>

          <button onClick={() => setShowEditModal(true)} style={styles.editButton}>
            <Edit3 size={16} />
            Edit Profile
          </button>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Performance Stats</h2>
          
          <div style={styles.statsContainer}>
            <div style={styles.statsCard}>
              <h3 style={styles.statsCardTitle}>All-Time Stats</h3>
              <div style={styles.statsGrid}>
                {allTimeStats.map((stat, index) => (
                  <div key={index} style={styles.statItem}>
                    <span style={styles.statEmoji}>{stat.emoji}</span>
                    <div style={styles.statContent}>
                      <span style={styles.statLabel}>{stat.label}</span>
                      <span style={styles.statValue}>{stat.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.statsCard}>
              <h3 style={styles.statsCardTitle}>This Year</h3>
              <div style={styles.statsGrid}>
                {thisYearStats.map((stat, index) => (
                  <div key={index} style={styles.statItem}>
                    <span style={styles.statEmoji}>{stat.emoji}</span>
                    <div style={styles.statContent}>
                      <span style={styles.statLabel}>{stat.label}</span>
                      <span style={styles.statValue}>{stat.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Quick Settings</h2>
          <div style={styles.settingsCard}>
            {quickSettings.map((setting, index) => (
              <button key={index} style={styles.settingsItem} className="settings-item">
                <div style={styles.settingsItemLeft}>
                  <span style={styles.settingsEmoji}>{setting.emoji}</span>
                  <span style={styles.settingsLabel}>{setting.label}</span>
                </div>
                <ChevronRight size={16} color="rgba(255,255,255,0.3)" />
              </button>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Resources</h2>
          <div style={styles.resourcesGrid}>
            {resources.map((resource, index) => (
              <a key={index} href={resource.link} style={styles.resourceCard} className="resource-card">
                <span style={styles.resourceEmoji}>{resource.emoji}</span>
                <span style={styles.resourceLabel}>{resource.label}</span>
                <ChevronRight size={14} color="rgba(255,255,255,0.3)" />
              </a>
            ))}
          </div>
        </section>

        <section style={styles.signOutSection}>
          <button onClick={handleSignOut} style={styles.signOutButton}>
            <LogOut size={18} />
            Sign Out
          </button>
        </section>
      </div>

      {showEditModal && (
        <div style={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Edit Profile</h2>
              <button onClick={() => setShowEditModal(false)} style={styles.modalClose}>
                <X size={20} />
              </button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  style={styles.formInput}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  style={styles.formInput}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  style={styles.formInput}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Phone</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  style={styles.formInput}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Territory</label>
                <input
                  type="text"
                  value={editForm.territory}
                  onChange={(e) => setEditForm({ ...editForm, territory: e.target.value })}
                  style={styles.formInput}
                />
              </div>
            </div>
            
            <div style={styles.modalFooter}>
              <button onClick={() => setShowEditModal(false)} style={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={handleSaveProfile} style={styles.saveButton}>
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .settings-item:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
        }
        .resource-card:hover {
          background-color: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
        }
      `}</style>
    </SalesLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 800,
    margin: '0 auto',
    paddingBottom: 40,
  },
  profileHeader: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  avatarSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: '50%',
    backgroundColor: NEON_GREEN,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 700,
    color: '#000000',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 700,
    color: '#FFFFFF',
    margin: 0,
    marginBottom: 4,
  },
  profileTitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    margin: 0,
  },
  profileDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginBottom: 20,
    paddingTop: 16,
    borderTop: `1px solid ${CARD_BORDER}`,
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  editButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    backgroundColor: 'transparent',
    border: `1px solid ${NEON_GREEN}`,
    borderRadius: 8,
    color: NEON_GREEN,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
    marginBottom: 12,
  },
  statsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  statsCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    padding: 20,
  },
  statsCardTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.6)',
    margin: 0,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: 12,
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 8,
  },
  statEmoji: {
    fontSize: 20,
  },
  statContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFFFFF',
  },
  settingsCard: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingsItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '14px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${CARD_BORDER}`,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  settingsItemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  settingsEmoji: {
    fontSize: 18,
  },
  settingsLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  resourcesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
  },
  resourceCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    textDecoration: 'none',
    transition: 'all 0.2s',
  },
  resourceEmoji: {
    fontSize: 20,
  },
  resourceLabel: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  signOutSection: {
    marginTop: 32,
    paddingTop: 24,
    borderTop: `1px solid ${CARD_BORDER}`,
  },
  signOutButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    padding: '14px 24px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: 10,
    color: '#EF4444',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: 20,
  },
  modal: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#111111',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  modalClose: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 6,
    color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
  },
  modalBody: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  formLabel: {
    fontSize: 13,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.6)',
  },
  formInput: {
    padding: '10px 14px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
  },
  modalFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
    padding: '16px 20px',
    borderTop: `1px solid ${CARD_BORDER}`,
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
  saveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    backgroundColor: NEON_GREEN,
    border: 'none',
    borderRadius: 8,
    color: '#000000',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
};
