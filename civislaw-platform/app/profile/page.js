'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/utils/LanguageContext';
import { t } from '@/utils/i18n';

export default function ProfilePage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Form states
  const [generalForm, setGeneralForm] = useState({
    fullName: '',
    phoneNumber: ''
  });
  
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    caseUpdates: true,
    language: 'en'
  });
  
  const [errors, setErrors] = useState({});
  const [securityErrors, setSecurityErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/profile');
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      setUser(data.user);
      setGeneralForm({
        fullName: data.user.fullName || '',
        phoneNumber: data.user.phoneNumber || ''
      });
      setPreferences({
        emailNotifications: data.user.preferences?.notifications ?? true,
        smsNotifications: data.user.preferences?.smsNotifications ?? false,
        caseUpdates: data.user.preferences?.caseUpdates ?? true,
        language: data.user.language || 'en'
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      showToast(t('auth.errors.networkError', language), 'error');
    } finally {
      setIsLoading(false);
    }
  }, [language, router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Handle general form changes
  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle security form changes
  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityForm(prev => ({ ...prev, [name]: value }));
    if (securityErrors[name]) {
      setSecurityErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle preference changes
  const handlePreferenceChange = async (name, value) => {
    setPreferences(prev => ({ ...prev, [name]: value }));
    
    // Auto-save preferences
    try {
      await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: name === 'language' ? value : preferences.language,
          preferences: {
            notifications: name === 'emailNotifications' ? value : preferences.emailNotifications,
            smsNotifications: name === 'smsNotifications' ? value : preferences.smsNotifications,
            caseUpdates: name === 'caseUpdates' ? value : preferences.caseUpdates
          }
        })
      });
      
      if (name === 'language') {
        setLanguage(value);
      }
      
      showToast(t('profile.preferencesSaved', language));
    } catch (error) {
      console.error('Error saving preferences:', error);
      showToast(t('auth.errors.networkError', language), 'error');
    }
  };

  // Save general profile
  const saveGeneralProfile = async () => {
    setErrors({});
    
    if (!generalForm.fullName.trim()) {
      setErrors({ fullName: t('auth.errors.nameRequired', language) });
      return;
    }

    if (generalForm.fullName.trim().length < 2) {
      setErrors({ fullName: t('auth.errors.nameTooShort', language) });
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (generalForm.phoneNumber && !phoneRegex.test(generalForm.phoneNumber.replace(/\D/g, ''))) {
      setErrors({ phoneNumber: t('auth.errors.invalidPhone', language) });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: generalForm.fullName.trim(),
          phoneNumber: generalForm.phoneNumber || null
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        setErrors({ general: data.error || t('profile.updateFailed', language) });
        return;
      }

      showToast(t('profile.savedSuccessfully', language));
      fetchProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      setErrors({ general: t('auth.errors.networkError', language) });
    } finally {
      setIsSaving(false);
    }
  };

  // Change password
  const changePassword = async () => {
    setSecurityErrors({});

    if (!securityForm.currentPassword) {
      setSecurityErrors({ currentPassword: t('auth.errors.passwordRequired', language) });
      return;
    }

    if (!securityForm.newPassword) {
      setSecurityErrors({ newPassword: t('auth.errors.passwordRequired', language) });
      return;
    }

    if (securityForm.newPassword !== securityForm.confirmPassword) {
      setSecurityErrors({ confirmPassword: t('auth.errors.passwordsNotMatch', language) });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: securityForm.currentPassword,
          newPassword: securityForm.newPassword,
          confirmNewPassword: securityForm.confirmPassword
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (data.code === 'AUTH_506') {
          setSecurityErrors({ currentPassword: t('profile.wrongCurrentPassword', language) });
        } else {
          setSecurityErrors({ general: data.error || t('profile.passwordChangeFailed', language) });
        }
        return;
      }

      showToast(t('profile.passwordChanged', language));
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      setSecurityErrors({ general: t('auth.errors.networkError', language) });
    } finally {
      setIsSaving(false);
    }
  };

  // Logout all devices
  const logoutAllDevices = async () => {
    if (!confirm(t('profile.confirmLogoutAll', language))) {
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/auth/logout-all', {
        method: 'POST'
      });

      if (response.ok) {
        showToast(t('profile.loggedOutAll', language));
        // Redirect to login
        router.push('/login');
      } else {
        showToast(t('auth.errors.networkError', language), 'error');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      showToast(t('auth.errors.networkError', language), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingCard}>
          <div style={styles.spinner}></div>
          <p>{t('common.loading', language)}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          ...styles.toast,
          backgroundColor: toast.type === 'error' ? '#FEF2F2' : '#F0FDF4',
          borderColor: toast.type === 'error' ? '#FECACA' : '#BBF7D0',
          color: toast.type === 'error' ? '#DC2626' : '#16A34A'
        }}>
          {toast.message}
        </div>
      )}

      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>{t('profile.title', language)}</h1>
        <p style={styles.pageSubtitle}>{t('profile.subtitle', language)}</p>
      </div>

      <div style={styles.profileLayout}>
        {/* Sidebar Navigation */}
        <div style={styles.sidebar}>
          <div style={styles.avatarSection}>
            <div style={styles.avatar}>
              {getInitials(user?.fullName)}
            </div>
            <h3 style={styles.userName}>{user?.fullName || 'User'}</h3>
            <p style={styles.userEmail}>{user?.email}</p>
            <span style={styles.roleBadge}>{user?.role}</span>
          </div>

          <nav style={styles.navMenu}>
            <button
              style={{
                ...styles.navItem,
                ...(activeTab === 'general' ? styles.navItemActive : {})
              }}
              onClick={() => setActiveTab('general')}
            >
              <span style={styles.navIcon}>👤</span>
              {t('profile.tabGeneral', language)}
            </button>
            <button
              style={{
                ...styles.navItem,
                ...(activeTab === 'security' ? styles.navItemActive : {})
              }}
              onClick={() => setActiveTab('security')}
            >
              <span style={styles.navIcon}>🔒</span>
              {t('profile.tabSecurity', language)}
            </button>
            <button
              style={{
                ...styles.navItem,
                ...(activeTab === 'preferences' ? styles.navItemActive : {})
              }}
              onClick={() => setActiveTab('preferences')}
            >
              <span style={styles.navIcon}>⚙️</span>
              {t('profile.tabPreferences', language)}
            </button>
          </nav>

          <div style={styles.sidebarFooter}>
            <Link href="/" style={styles.homeLink}>
              ← {t('profile.backToHome', language)}
            </Link>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={styles.mainContent}>
          {/* General Profile Tab */}
          {activeTab === 'general' && (
            <div style={styles.tabContent}>
              <h2 style={styles.tabTitle}>{t('profile.generalTitle', language)}</h2>
              <p style={styles.tabSubtitle}>{t('profile.generalSubtitle', language)}</p>

              {errors.general && (
                <div style={styles.errorAlert}>{errors.general}</div>
              )}

              <div style={styles.formSection}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>{t('auth.register.fullName', language)} *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={generalForm.fullName}
                    onChange={handleGeneralChange}
                    style={{
                      ...styles.input,
                      ...(errors.fullName ? styles.inputError : {})
                    }}
                    placeholder={t('auth.register.fullNamePlaceholder', language)}
                  />
                  {errors.fullName && <span style={styles.errorText}>{errors.fullName}</span>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>{t('auth.register.phone', language)}</label>
                  <span style={styles.optionalLabel}>({t('common.optional', language)})</span>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={generalForm.phoneNumber}
                    onChange={handleGeneralChange}
                    style={{
                      ...styles.input,
                      ...(errors.phoneNumber ? styles.inputError : {})
                    }}
                    placeholder={t('auth.register.phonePlaceholder', language)}
                  />
                  {errors.phoneNumber && <span style={styles.errorText}>{errors.phoneNumber}</span>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>{t('profile.emailLabel', language)}</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    style={{ ...styles.input, backgroundColor: '#F1F5F9', cursor: 'not-allowed' }}
                    disabled
                  />
                  <span style={styles.helperText}>{t('profile.emailHelper', language)}</span>
                </div>

                <div style={styles.formActions}>
                  <button
                    style={styles.saveButton}
                    onClick={saveGeneralProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? t('common.loading', language) : t('common.save', language)}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div style={styles.tabContent}>
              <h2 style={styles.tabTitle}>{t('profile.securityTitle', language)}</h2>
              <p style={styles.tabSubtitle}>{t('profile.securitySubtitle', language)}</p>

              {securityErrors.general && (
                <div style={styles.errorAlert}>{securityErrors.general}</div>
              )}

              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>{t('profile.changePassword', language)}</h3>

                <div style={styles.formGroup}>
                  <label style={styles.label}>{t('profile.currentPassword', language)}</label>
                  <div style={styles.passwordInputContainer}>
                    <input
                      type={showPasswords.current ? 'text' : 'password'}
                      name="currentPassword"
                      value={securityForm.currentPassword}
                      onChange={handleSecurityChange}
                      style={{
                        ...styles.input,
                        ...(securityErrors.currentPassword ? styles.inputError : {})
                      }}
                      placeholder={t('profile.currentPasswordPlaceholder', language)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      style={styles.togglePassword}
                    >
                      {showPasswords.current ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {securityErrors.currentPassword && (
                    <span style={styles.errorText}>{securityErrors.currentPassword}</span>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>{t('profile.newPassword', language)}</label>
                  <div style={styles.passwordInputContainer}>
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      name="newPassword"
                      value={securityForm.newPassword}
                      onChange={handleSecurityChange}
                      style={{
                        ...styles.input,
                        ...(securityErrors.newPassword ? styles.inputError : {})
                      }}
                      placeholder={t('profile.newPasswordPlaceholder', language)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      style={styles.togglePassword}
                    >
                      {showPasswords.new ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {securityErrors.newPassword && (
                    <span style={styles.errorText}>{securityErrors.newPassword}</span>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>{t('profile.confirmPassword', language)}</label>
                  <div style={styles.passwordInputContainer}>
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={securityForm.confirmPassword}
                      onChange={handleSecurityChange}
                      style={{
                        ...styles.input,
                        ...(securityErrors.confirmPassword ? styles.inputError : {})
                      }}
                      placeholder={t('profile.confirmPasswordPlaceholder', language)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      style={styles.togglePassword}
                    >
                      {showPasswords.confirm ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {securityErrors.confirmPassword && (
                    <span style={styles.errorText}>{securityErrors.confirmPassword}</span>
                  )}
                </div>

                <div style={styles.formActions}>
                  <button
                    style={styles.saveButton}
                    onClick={changePassword}
                    disabled={isSaving}
                  >
                    {isSaving ? t('common.loading', language) : t('profile.updatePassword', language)}
                  </button>
                </div>
              </div>

              <div style={styles.dangerSection}>
                <h3 style={{ ...styles.sectionTitle, color: '#EF4444' }}>
                  {t('profile.sessionManagement', language)}
                </h3>
                <p style={styles.dangerDescription}>
                  {t('profile.sessionDescription', language)}
                </p>
                <button
                  style={styles.dangerButton}
                  onClick={logoutAllDevices}
                  disabled={isSaving}
                >
                  🔒 {t('profile.logoutAllDevices', language)}
                </button>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div style={styles.tabContent}>
              <h2 style={styles.tabTitle}>{t('profile.preferencesTitle', language)}</h2>
              <p style={styles.tabSubtitle}>{t('profile.preferencesSubtitle', language)}</p>

              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>{t('profile.languageSection', language)}</h3>
                <div style={styles.formGroup}>
                  <label style={styles.label}>{t('profile.preferredLanguage', language)}</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    style={styles.select}
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                    <option value="bn">বাংলা (Bengali)</option>
                    <option value="mr">मराठी (Marathi)</option>
                  </select>
                  <span style={styles.helperText}>{t('profile.languageHelper', language)}</span>
                </div>
              </div>

              <div style={styles.formSection}>
                <h3 style={styles.sectionTitle}>{t('profile.notificationsSection', language)}</h3>

                <div style={styles.toggleGroup}>
                  <div style={styles.toggleItem}>
                    <div style={styles.toggleInfo}>
                      <label style={styles.toggleLabel}>{t('profile.emailNotifications', language)}</label>
                      <span style={styles.toggleDescription}>
                        {t('profile.emailNotificationsDesc', language)}
                      </span>
                    </div>
                    <button
                      style={{
                        ...styles.toggle,
                        backgroundColor: preferences.emailNotifications ? '#3B82F6' : '#E2E8F0'
                      }}
                      onClick={() => handlePreferenceChange('emailNotifications', !preferences.emailNotifications)}
                    >
                      <span style={{
                        ...styles.toggleKnob,
                        transform: preferences.emailNotifications ? 'translateX(20px)' : 'translateX(0)'
                      }} />
                    </button>
                  </div>

                  <div style={styles.toggleItem}>
                    <div style={styles.toggleInfo}>
                      <label style={styles.toggleLabel}>{t('profile.caseUpdates', language)}</label>
                      <span style={styles.toggleDescription}>
                        {t('profile.caseUpdatesDesc', language)}
                      </span>
                    </div>
                    <button
                      style={{
                        ...styles.toggle,
                        backgroundColor: preferences.caseUpdates ? '#3B82F6' : '#E2E8F0'
                      }}
                      onClick={() => handlePreferenceChange('caseUpdates', !preferences.caseUpdates)}
                    >
                      <span style={{
                        ...styles.toggleKnob,
                        transform: preferences.caseUpdates ? 'translateX(20px)' : 'translateX(0)'
                      }} />
                    </button>
                  </div>

                  <div style={styles.toggleItem}>
                    <div style={styles.toggleInfo}>
                      <label style={styles.toggleLabel}>{t('profile.smsNotifications', language)}</label>
                      <span style={styles.toggleDescription}>
                        {t('profile.smsNotificationsDesc', language)}
                      </span>
                    </div>
                    <button
                      style={{
                        ...styles.toggle,
                        backgroundColor: preferences.smsNotifications ? '#3B82F6' : '#E2E8F0'
                      }}
                      onClick={() => handlePreferenceChange('smsNotifications', !preferences.smsNotifications)}
                    >
                      <span style={{
                        ...styles.toggleKnob,
                        transform: preferences.smsNotifications ? 'translateX(20px)' : 'translateX(0)'
                      }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#F8FAFC',
    padding: '32px 20px'
  },
  loadingCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '16px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #E2E8F0',
    borderTopColor: '#3B82F6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  pageHeader: {
    maxWidth: '1200px',
    margin: '0 auto 32px'
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: '8px'
  },
  pageSubtitle: {
    fontSize: '14px',
    color: '#64748B'
  },
  profileLayout: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr',
    gap: '32px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  sidebar: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    height: 'fit-content',
    position: 'sticky',
    top: '32px'
  },
  avatarSection: {
    textAlign: 'center',
    paddingBottom: '24px',
    borderBottom: '1px solid #E2E8F0',
    marginBottom: '24px'
  },
  avatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: '600',
    margin: '0 auto 16px'
  },
  userName: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '4px'
  },
  userEmail: {
    fontSize: '13px',
    color: '#64748B',
    marginBottom: '12px'
  },
  roleBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    backgroundColor: '#F1F5F9',
    color: '#475569',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500'
  },
  navMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#64748B',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s'
  },
  navItemActive: {
    backgroundColor: '#EFF6FF',
    color: '#3B82F6'
  },
  navIcon: {
    fontSize: '18px'
  },
  sidebarFooter: {
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid #E2E8F0'
  },
  homeLink: {
    display: 'block',
    textAlign: 'center',
    color: '#3B82F6',
    textDecoration: 'none',
    fontSize: '14px'
  },
  mainContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    padding: '32px'
  },
  tabContent: {
    maxWidth: '600px'
  },
  tabTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '8px'
  },
  tabSubtitle: {
    fontSize: '14px',
    color: '#64748B',
    marginBottom: '32px'
  },
  formSection: {
    marginBottom: '40px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '20px'
  },
  formGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '6px'
  },
  optionalLabel: {
    fontSize: '12px',
    color: '#9CA3AF',
    marginLeft: '4px'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    fontSize: '14px',
    transition: 'border-color 0.2s',
    outline: 'none',
    boxSizing: 'border-box'
  },
  inputError: {
    borderColor: '#EF4444'
  },
  errorText: {
    display: 'block',
    fontSize: '12px',
    color: '#EF4444',
    marginTop: '4px'
  },
  errorAlert: {
    padding: '12px 16px',
    backgroundColor: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '8px',
    color: '#DC2626',
    fontSize: '14px',
    marginBottom: '20px'
  },
  helperText: {
    display: 'block',
    fontSize: '12px',
    color: '#9CA3AF',
    marginTop: '4px'
  },
  passwordInputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  togglePassword: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px'
  },
  formActions: {
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #E2E8F0'
  },
  saveButton: {
    padding: '12px 32px',
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  dangerSection: {
    padding: '24px',
    backgroundColor: '#FEF2F2',
    borderRadius: '8px',
    border: '1px solid #FECACA'
  },
  dangerDescription: {
    fontSize: '14px',
    color: '#64748B',
    marginBottom: '16px'
  },
  dangerButton: {
    padding: '12px 24px',
    backgroundColor: '#FFFFFF',
    color: '#EF4444',
    border: '1px solid #EF4444',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    fontSize: '14px',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    outline: 'none'
  },
  toggleGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  toggleItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  toggleInfo: {
    flex: 1
  },
  toggleLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '4px'
  },
  toggleDescription: {
    fontSize: '12px',
    color: '#9CA3AF'
  },
  toggle: {
    position: 'relative',
    width: '44px',
    height: '24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  toggleKnob: {
    position: 'absolute',
    top: '2px',
    left: '2px',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: '#FFFFFF',
    transition: 'transform 0.2s',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  toast: {
    position: 'fixed',
    top: '24px',
    right: '24px',
    padding: '16px 24px',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '14px',
    fontWeight: '500',
    zIndex: 1000,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  }
};
