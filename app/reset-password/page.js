'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/utils/LanguageContext';
import { t } from '@/utils/i18n';
import { validatePasswordStrength } from '@/lib/auth';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, setLanguage } = useLanguage();
  
  const [token, setToken] = useState('');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setGeneralError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = t('auth.errors.passwordRequired', language);
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.errors.passwordsNotMatch', language);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!token) {
      setGeneralError(t('auth.reset.invalidToken', language));
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          password: formData.password,
          confirmPassword: formData.confirmPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setGeneralError(data.error || t('auth.reset.resetFailed', language));
        return;
      }

      setSuccess(true);

    } catch (error) {
      console.error('Reset password error:', error);
      setGeneralError(t('auth.errors.networkError', language));
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          {/* Success Header */}
          <div style={styles.successHeader}>
            <div style={styles.successIcon}>✓</div>
            <h1 style={styles.title}>{t('auth.reset.successTitle', language)}</h1>
            <p style={styles.subtitle}>{t('auth.reset.successMessage', language)}</p>
          </div>

          {/* Login Button */}
          <Link href="/login" style={styles.loginButton}>
            {t('auth.reset.goToLogin', language)}
          </Link>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h1 style={styles.title}>{t('auth.reset.invalidTokenTitle', language)}</h1>
            <p style={styles.subtitle}>{t('auth.reset.invalidTokenMessage', language)}</p>
          </div>
          <Link href="/forgot-password" style={styles.forgotLink}>
            {t('auth.reset.requestNewLink', language)}
          </Link>
        </div>
      </div>
    );
  }

  const passwordStrength = validatePasswordStrength(formData.password);

  const getPasswordStrengthColor = () => {
    const score = passwordStrength.score;
    if (score >= 4) return '#10B981';
    if (score >= 2) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>{t('auth.reset.title', language)}</h1>
          <p style={styles.subtitle}>{t('auth.reset.subtitle', language)}</p>
        </div>

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

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* New Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              {t('auth.reset.newPassword', language)}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setShowPasswordStrength(true)}
              style={{
                ...styles.input,
                ...(errors.password ? styles.inputError : {})
              }}
              placeholder={t('auth.reset.newPasswordPlaceholder', language)}
              disabled={isLoading}
              autoComplete="new-password"
            />
            {errors.password && (
              <span style={styles.errorText}>{errors.password}</span>
            )}
            
            {/* Password Strength Indicator */}
            {showPasswordStrength && formData.password && (
              <div style={styles.passwordStrength}>
                <div style={styles.strengthBarContainer}>
                  <div
                    style={{
                      ...styles.strengthBar,
                      width: `${(passwordStrength.score / passwordStrength.maxScore) * 100}%`,
                      backgroundColor: getPasswordStrengthColor()
                    }}
                  />
                </div>
                <span style={{
                  ...styles.strengthText,
                  color: getPasswordStrengthColor()
                }}>
                  {passwordStrength.score}/{passwordStrength.maxScore} - {
                    passwordStrength.score >= 4 ? t('auth.strong', language) :
                    passwordStrength.score >= 2 ? t('auth.medium', language) :
                    t('auth.weak', language)
                  }
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              {t('auth.reset.confirmPassword', language)}
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.confirmPassword ? styles.inputError : {})
              }}
              placeholder={t('auth.reset.confirmPasswordPlaceholder', language)}
              disabled={isLoading}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <span style={styles.errorText}>{errors.confirmPassword}</span>
            )}
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
            {isLoading ? t('auth.reset.resetting', language) : t('auth.reset.resetButton', language)}
          </button>
        </form>

        {/* Back to Login */}
        <div style={styles.footer}>
          <Link href="/login" style={styles.backLink}>
            ← {t('auth.reset.backToLogin', language)}
          </Link>
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
  successHeader: {
    textAlign: 'center',
    marginBottom: '24px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748B'
  },
  successIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#10B981',
    color: '#FFFFFF',
    fontSize: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px'
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
  errorText: {
    fontSize: '12px',
    color: '#EF4444'
  },
  passwordStrength: {
    marginTop: '8px'
  },
  strengthBarContainer: {
    height: '4px',
    backgroundColor: '#E2E8F0',
    borderRadius: '2px',
    overflow: 'hidden',
    marginBottom: '4px'
  },
  strengthBar: {
    height: '100%',
    transition: 'width 0.3s, background-color 0.3s'
  },
  strengthText: {
    fontSize: '12px'
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
  backLink: {
    fontSize: '14px',
    color: '#3B82F6',
    textDecoration: 'none'
  },
  loginButton: {
    display: 'block',
    padding: '14px 24px',
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
    transition: 'background-color 0.2s'
  },
  forgotLink: {
    display: 'block',
    padding: '14px 24px',
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center',
    textDecoration: 'none',
    marginTop: '20px'
  }
};
