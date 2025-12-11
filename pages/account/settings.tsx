import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout, { CustomerSession } from '../../components/customer/CustomerLayout';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Save,
  Check,
  AlertCircle,
} from 'lucide-react';

const NEON_GREEN = '#00FF85';
const CARD_BG = 'rgba(255, 255, 255, 0.02)';
const CARD_BORDER = 'rgba(255, 255, 255, 0.08)';

export default function CustomerSettings() {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerSession | null>(null);
  const [toast, setToast] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '(555) 123-4567',
    birthday: '1990-03-15',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const [preferences, setPreferences] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    smsNotifications: false,
    productRecommendations: true,
    rewardAlerts: true,
  });

  useEffect(() => {
    const session = localStorage.getItem('customerSession');
    if (!session) {
      router.push('/account/login');
      return;
    }
    const data = JSON.parse(session);
    setCustomer(data);
    setFormData(prev => ({
      ...prev,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    }));
  }, [router]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const handleSaveProfile = () => {
    if (customer) {
      const updatedSession = {
        ...customer,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      };
      localStorage.setItem('customerSession', JSON.stringify(updatedSession));
      setCustomer(updatedSession);
    }
    showToast('Profile updated successfully');
  };

  const handleSavePassword = () => {
    if (passwords.new !== passwords.confirm) {
      showToast('Passwords do not match');
      return;
    }
    if (passwords.new.length < 6) {
      showToast('Password must be at least 6 characters');
      return;
    }
    setPasswords({ current: '', new: '', confirm: '' });
    showToast('Password updated successfully');
  };

  const handleSavePreferences = () => {
    showToast('Preferences saved');
  };

  if (!customer) return null;

  return (
    <CustomerLayout title="Settings">
      <div style={styles.page}>
        {toast && (
          <div style={styles.toast}>
            <Check size={16} color={NEON_GREEN} />
            <span>{toast}</span>
          </div>
        )}

        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Account Settings</h1>
            <p style={styles.subtitle}>Manage your personal information and preferences</p>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <User size={20} color={NEON_GREEN} />
            <h2 style={styles.sectionTitle}>Personal Information</h2>
          </div>
          <div style={styles.card}>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputWithIcon}>
                  <Mail size={18} style={styles.inputIcon} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ ...styles.input, paddingLeft: 44 }}
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number</label>
                <div style={styles.inputWithIcon}>
                  <Phone size={18} style={styles.inputIcon} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ ...styles.input, paddingLeft: 44 }}
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Birthday</label>
                <div style={styles.inputWithIcon}>
                  <Calendar size={18} style={styles.inputIcon} />
                  <input
                    type="date"
                    value={formData.birthday}
                    onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                    style={{ ...styles.input, paddingLeft: 44 }}
                  />
                </div>
              </div>
            </div>
            <div style={styles.cardActions}>
              <button onClick={handleSaveProfile} style={styles.saveButton}>
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Shield size={20} color={NEON_GREEN} />
            <h2 style={styles.sectionTitle}>Change Password</h2>
          </div>
          <div style={styles.card}>
            <div style={styles.formGrid}>
              <div style={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                <label style={styles.label}>Current Password</label>
                <div style={styles.passwordWrapper}>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    placeholder="Enter current password"
                    style={styles.input}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={styles.passwordToggle}
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>New Password</label>
                <div style={styles.passwordWrapper}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    placeholder="Enter new password"
                    style={styles.input}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={styles.passwordToggle}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Confirm New Password</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  placeholder="Confirm new password"
                  style={styles.input}
                />
              </div>
            </div>
            <div style={styles.cardActions}>
              <button onClick={handleSavePassword} style={styles.saveButton}>
                <Shield size={16} />
                Update Password
              </button>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <Bell size={20} color={NEON_GREEN} />
            <h2 style={styles.sectionTitle}>Notification Preferences</h2>
          </div>
          <div style={styles.card}>
            <div style={styles.preferencesGrid}>
              {[
                { key: 'orderUpdates', label: 'Order Updates', desc: 'Shipping and delivery notifications' },
                { key: 'promotions', label: 'Promotions & Offers', desc: 'Exclusive deals and discounts' },
                { key: 'newsletter', label: 'Newsletter', desc: 'Weekly recipes and wellness tips' },
                { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Text message updates' },
                { key: 'productRecommendations', label: 'Product Recommendations', desc: 'Personalized suggestions' },
                { key: 'rewardAlerts', label: 'Reward Alerts', desc: 'Points and rewards updates' },
              ].map((pref) => (
                <div key={pref.key} style={styles.preferenceItem}>
                  <div style={styles.preferenceInfo}>
                    <span style={styles.preferenceLabel}>{pref.label}</span>
                    <span style={styles.preferenceDesc}>{pref.desc}</span>
                  </div>
                  <label style={styles.toggle}>
                    <input
                      type="checkbox"
                      checked={preferences[pref.key as keyof typeof preferences]}
                      onChange={(e) => setPreferences({ ...preferences, [pref.key]: e.target.checked })}
                      style={styles.toggleInput}
                    />
                    <span style={{
                      ...styles.toggleSlider,
                      backgroundColor: preferences[pref.key as keyof typeof preferences] ? NEON_GREEN : 'rgba(255,255,255,0.1)',
                    }}>
                      <span style={{
                        ...styles.toggleKnob,
                        transform: preferences[pref.key as keyof typeof preferences] ? 'translateX(20px)' : 'translateX(0)',
                      }} />
                    </span>
                  </label>
                </div>
              ))}
            </div>
            <div style={styles.cardActions}>
              <button onClick={handleSavePreferences} style={styles.saveButton}>
                <Save size={16} />
                Save Preferences
              </button>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.dangerZone}>
            <div style={styles.dangerHeader}>
              <AlertCircle size={20} color="#EF4444" />
              <h3 style={styles.dangerTitle}>Danger Zone</h3>
            </div>
            <p style={styles.dangerText}>
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button style={styles.deleteButton}>
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: 700,
    margin: '0 auto',
  },
  toast: {
    position: 'fixed',
    top: 24,
    right: 24,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 20px',
    backgroundColor: '#111111',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    zIndex: 1000,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#FFFFFF',
    margin: 0,
  },
  card: {
    backgroundColor: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 12,
    padding: 24,
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 20,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: '#999999',
  },
  input: {
    padding: '12px 14px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${CARD_BORDER}`,
    borderRadius: 8,
    color: '#FFFFFF',
    fontSize: 14,
    outline: 'none',
    width: '100%',
  },
  inputWithIcon: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#666666',
    pointerEvents: 'none',
  },
  passwordWrapper: {
    position: 'relative',
  },
  passwordToggle: {
    position: 'absolute',
    right: 14,
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#666666',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 24,
    paddingTop: 20,
    borderTop: `1px solid ${CARD_BORDER}`,
  },
  saveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 24px',
    backgroundColor: NEON_GREEN,
    border: 'none',
    borderRadius: 8,
    color: '#000000',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
  preferencesGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  preferenceItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: `1px solid ${CARD_BORDER}`,
  },
  preferenceInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  preferenceLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: '#FFFFFF',
  },
  preferenceDesc: {
    fontSize: 12,
    color: '#666666',
  },
  toggle: {
    position: 'relative',
    display: 'inline-block',
    cursor: 'pointer',
  },
  toggleInput: {
    opacity: 0,
    width: 0,
    height: 0,
    position: 'absolute',
  },
  toggleSlider: {
    display: 'block',
    width: 44,
    height: 24,
    borderRadius: 12,
    transition: 'background-color 0.2s',
    position: 'relative',
  },
  toggleKnob: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 20,
    height: 20,
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    transition: 'transform 0.2s',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  },
  dangerZone: {
    padding: 24,
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: 12,
  },
  dangerHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#EF4444',
    margin: 0,
  },
  dangerText: {
    fontSize: 14,
    color: '#999999',
    margin: '0 0 16px 0',
  },
  deleteButton: {
    padding: '12px 24px',
    backgroundColor: 'transparent',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: 8,
    color: '#EF4444',
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
  },
};
