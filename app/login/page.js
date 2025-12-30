'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/utils/LanguageContext';
import { t } from '@/utils/i18n';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, setLanguage } = useLanguage();
  
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  const registered = searchParams.get('registered');

  const fillCredentials = (email, password) => {
    setFormData(prev => ({
      ...prev,
      emailOrPhone: email,
      password: password
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setGeneralError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = t('auth.errors.emailOrPhoneRequired', language);
    }

    if (!formData.password) {
      newErrors.password = t('auth.errors.passwordRequired', language);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          emailOrPhone: formData.emailOrPhone.trim(),
          password: formData.password,
          rememberMe: formData.rememberMe
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setGeneralError(data.error || t('auth.errors.loginFailed', language));
        return;
      }

      // Login successful, redirect to dashboard
      router.push('/dashboard');
      router.refresh();

    } catch (error) {
      console.error('Login error:', error);
      setGeneralError(t('auth.errors.networkError', language));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>{t('auth.login.title', language)}</h1>
          <p style={styles.subtitle}>{t('auth.login.subtitle', language)}</p>
        </div>

        {/* Success Message for Registration */}
        {registered && (
          <div style={styles.successAlert}>
            {t('auth.login.registrationSuccess', language)}
          </div>
        )}

        {/* Language Selector */}
        <div style={styles.languageSelector}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={styles.languageSelect}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="ta">தமிழ்</option>
            <option value="te">తెలుగు</option>
            <option value="bn">বাংলা</option>
            <option value="mr">मराठी</option>
          </select>
        </div>

        {/* Error Message */}
        {generalError && (
          <div style={styles.errorAlert}>
            {generalError}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email/Phone */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              {t('auth.login.emailOrPhone', language)}
            </label>
            <input
              type="text"
              name="emailOrPhone"
              value={formData.emailOrPhone}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.emailOrPhone ? styles.inputError : {})
              }}
              placeholder={t('auth.login.emailOrPhonePlaceholder', language)}
              disabled={isLoading}
              autoComplete="username"
            />
            {errors.emailOrPhone && (
              <span style={styles.errorText}>{errors.emailOrPhone}</span>
            )}
          </div>

          {/* Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              {t('auth.login.password', language)}
            </label>
            <div style={styles.passwordInputContainer}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  ...styles.passwordInput,
                  ...(errors.password ? styles.inputError : {})
                }}
                placeholder={t('auth.login.passwordPlaceholder', language)}
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.togglePassword}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && (
              <span style={styles.errorText}>{errors.password}</span>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div style={styles.formOptions}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                style={styles.checkbox}
              />
              <span>{t('auth.login.rememberMe', language)}</span>
            </label>
            <Link href="/forgot-password" style={styles.forgotPasswordLink}>
              {t('auth.login.forgotPassword', language)}
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              ...styles.submitButton,
              ...(isLoading ? styles.submitButtonDisabled : {})
            }}
            disabled={isLoading}
          >
            {isLoading ? t('auth.login.loggingIn', language) : t('auth.login.loginButton', language)}
          </button>
        </form>

        {/* Register Link */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            {t('auth.login.dontHaveAccount', language)}{' '}
            <Link href="/register" style={styles.footerLink}>
              {t('auth.login.registerHere', language)}
            </Link>
          </p>
        </div>

        {/* Privacy Notice */}
        <div style={styles.privacyNotice}>
          <p style={styles.privacyText}>
            {t('auth.privacyNotice', language)}
          </p>
        </div>

        {/* Demo Accounts Section */}
        <div style={styles.demoSection}>
          <div style={styles.demoHeader} onClick={() => setShowDemoAccounts(!showDemoAccounts)}>
            <span style={styles.demoIcon}>🧪</span>
            <span style={styles.demoTitle}>
              {language === 'hi' ? 'डेमो खाते (परीक्षण के लिए)' : 'Demo Accounts (for testing)'}
            </span>
            <span style={styles.demoToggle}>{showDemoAccounts ? '▲' : '▼'}</span>
          </div>
          
          {showDemoAccounts && (
            <div style={styles.demoAccounts}>
              <p style={styles.demoSubtitle}>
                {language === 'hi' 
                  ? 'इन खातों का उपयोग करें विभिन्न सुविधाओं का परीक्षण करने के लिए:' 
                  : 'Use these accounts to test different platform features:'}
              </p>
              
              <table style={styles.demoTable}>
                <thead>
                  <tr style={styles.demoTableHeader}>
                    <th style={styles.demoTh}>{language === 'hi' ? 'भूमिका' : 'Role'}</th>
                    <th style={styles.demoTh}>{language === 'hi' ? 'ईमेल' : 'Email'}</th>
                    <th style={styles.demoTh}>{language === 'hi' ? 'पासवर्ड' : 'Password'}</th>
                    <th style={styles.demoTh}>{language === 'hi' ? 'क्लिक' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={styles.demoRow} onClick={() => fillCredentials('citizen@test.com', 'Citizen@123!')}>
                    <td style={styles.demoTd}><span style={styles.roleBadgeCitizen}>👤 Citizen</span></td>
                    <td style={styles.demoTd}>citizen@test.com</td>
                    <td style={styles.demoTd}>Citizen@123!</td>
                    <td style={styles.demoTd}><button style={styles.copyButton}>Use</button></td>
                  </tr>
                  <tr style={styles.demoRow} onClick={() => fillCredentials('victim@test.com', 'Victim@123!')}>
                    <td style={styles.demoTd}><span style={styles.roleBadgeVictim}>🎗️ Victim</span></td>
                    <td style={styles.demoTd}>victim@test.com</td>
                    <td style={styles.demoTd}>Victim@123!</td>
                    <td style={styles.demoTd}><button style={styles.copyButton}>Use</button></td>
                  </tr>
                  <tr style={styles.demoRow} onClick={() => fillCredentials('ngo@test.com', 'NGO@123!')}>
                    <td style={styles.demoTd}><span style={styles.roleBadgeNGO}>🤝 NGO</span></td>
                    <td style={styles.demoTd}>ngo@test.com</td>
                    <td style={styles.demoTd}>NGO@123!</td>
                    <td style={styles.demoTd}><button style={styles.copyButton}>Use</button></td>
                  </tr>
                  <tr style={styles.demoRow} onClick={() => fillCredentials('legalaid@test.com', 'LegalAid@123!')}>
                    <td style={styles.demoTd}><span style={styles.roleBadgeLegalAid}>⚖️ Legal Aid</span></td>
                    <td style={styles.demoTd}>legalaid@test.com</td>
                    <td style={styles.demoTd}>LegalAid@123!</td>
                    <td style={styles.demoTd}><button style={styles.copyButton}>Use</button></td>
                  </tr>
                  <tr style={styles.demoRow} onClick={() => fillCredentials('admin@civislaw.in', 'Admin@123!')}>
                    <td style={styles.demoTd}><span style={styles.roleBadgeAdmin}>🛡️ Admin</span></td>
                    <td style={styles.demoTd}>admin@civislaw.in</td>
                    <td style={styles.demoTd}>Admin@123!</td>
                    <td style={styles.demoTd}><button style={styles.copyButton}>Use</button></td>
                  </tr>
                </tbody>
              </table>
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#F8FAFC'
  },
  card: {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    padding: '32px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '24px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748B'
  },
  languageSelector: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '20px'
  },
  languageSelect: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #E2E8F0',
    backgroundColor: '#FFFFFF',
    fontSize: '14px',
    cursor: 'pointer'
  },
  successAlert: {
    padding: '12px 16px',
    backgroundColor: '#F0FDF4',
    border: '1px solid #BBF7D0',
    borderRadius: '8px',
    color: '#16A34A',
    fontSize: '14px',
    marginBottom: '20px'
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    fontSize: '14px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none'
  },
  inputError: {
    borderColor: '#EF4444'
  },
  passwordInputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  passwordInput: {
    padding: '12px 40px 12px 16px',
    borderRadius: '8px',
    border: '1px solid #E2E8F0',
    fontSize: '14px',
    width: '100%',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    outline: 'none'
  },
  togglePassword: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px'
  },
  errorText: {
    fontSize: '12px',
    color: '#EF4444'
  },
  formOptions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#64748B',
    cursor: 'pointer'
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer'
  },
  forgotPasswordLink: {
    fontSize: '14px',
    color: '#3B82F6',
    textDecoration: 'none'
  },
  submitButton: {
    padding: '14px 24px',
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    marginTop: '8px'
  },
  submitButtonDisabled: {
    backgroundColor: '#94A3B8',
    cursor: 'not-allowed'
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center'
  },
  footerText: {
    fontSize: '14px',
    color: '#64748B'
  },
  footerLink: {
    color: '#3B82F6',
    textDecoration: 'none',
    fontWeight: '500'
  },
  privacyNotice: {
    marginTop: '20px',
    padding: '12px',
    backgroundColor: '#F1F5F9',
    borderRadius: '8px'
  },
  privacyText: {
    fontSize: '12px',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: '1.5'
  },
  demoSection: {
    marginTop: '24px',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    overflow: 'hidden'
  },
  demoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#F8FAFC',
    cursor: 'pointer',
    userSelect: 'none'
  },
  demoIcon: {
    fontSize: '16px'
  },
  demoTitle: {
    flex: 1,
    fontSize: '14px',
    fontWeight: '600',
    color: '#0F172A'
  },
  demoToggle: {
    fontSize: '12px',
    color: '#64748B'
  },
  demoAccounts: {
    padding: '16px',
    backgroundColor: '#FFFFFF'
  },
  demoSubtitle: {
    fontSize: '13px',
    color: '#64748B',
    marginBottom: '12px'
  },
  demoTable: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12px'
  },
  demoTableHeader: {
    backgroundColor: '#F1F5F9'
  },
  demoTh: {
    padding: '8px 12px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#374151',
    borderBottom: '2px solid #E2E8F0'
  },
  demoRow: {
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  demoTd: {
    padding: '8px 12px',
    borderBottom: '1px solid #E2E8F0',
    color: '#374151'
  },
  copyButton: {
    padding: '4px 8px',
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '4px',
    fontSize: '11px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  roleBadgeCitizen: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    backgroundColor: '#DBEAFE',
    color: '#1D4ED8',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '500'
  },
  roleBadgeVictim: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    backgroundColor: '#FCE7F3',
    color: '#BE185D',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '500'
  },
  roleBadgeNGO: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    backgroundColor: '#D1FAE5',
    color: '#047857',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '500'
  },
  roleBadgeLegalAid: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    backgroundColor: '#FEF3C7',
    color: '#B45309',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '500'
  },
  roleBadgeAdmin: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '500'
  }
};
