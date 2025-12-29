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

  const registered = searchParams.get('registered');

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
      router.push('/');
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
    maxWidth: '450px',
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
  }
};
