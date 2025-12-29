'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/utils/LanguageContext';
import { t } from '@/utils/i18n';
import { validatePasswordStrength, isValidEmail, isValidPhone } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setGeneralError('');
  };

  const validateForm = () => {
    const newErrors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = t('auth.errors.nameRequired', language);
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = t('auth.errors.nameTooShort', language);
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = t('auth.errors.emailRequired', language);
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = t('auth.errors.invalidEmail', language);
    }

    // Phone validation (optional)
    if (formData.phoneNumber && !isValidPhone(formData.phoneNumber)) {
      newErrors.phoneNumber = t('auth.errors.invalidPhone', language);
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = t('auth.errors.passwordRequired', language);
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('auth.errors.passwordsNotMatch', language);
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
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          phoneNumber: formData.phoneNumber || null,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          language
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setGeneralError(data.error || t('auth.errors.registrationFailed', language));
        return;
      }

      // Registration successful, redirect to login
      router.push('/login?registered=true');

    } catch (error) {
      console.error('Registration error:', error);
      setGeneralError(t('auth.errors.networkError', language));
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = validatePasswordStrength(formData.password);

  const getPasswordStrengthColor = () => {
    const score = passwordStrength.score;
    if (score >= 4) return '#10B981'; // Green
    if (score >= 2) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>{t('auth.register.title', language)}</h1>
          <p style={styles.subtitle}>{t('auth.register.subtitle', language)}</p>
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

        {/* Registration Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Full Name */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              {t('auth.register.fullName', language)} *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.fullName ? styles.inputError : {})
              }}
              placeholder={t('auth.register.fullNamePlaceholder', language)}
              disabled={isLoading}
            />
            {errors.fullName && (
              <span style={styles.errorText}>{errors.fullName}</span>
            )}
          </div>

          {/* Email */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              {t('auth.register.email', language)} *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.email ? styles.inputError : {})
              }}
              placeholder={t('auth.register.emailPlaceholder', language)}
              disabled={isLoading}
            />
            {errors.email && (
              <span style={styles.errorText}>{errors.email}</span>
            )}
          </div>

          {/* Phone (Optional) */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              {t('auth.register.phone', language)}
              <span style={styles.optionalLabel}> ({t('auth.register.optional', language)})</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.phoneNumber ? styles.inputError : {})
              }}
              placeholder={t('auth.register.phonePlaceholder', language)}
              disabled={isLoading}
            />
            {errors.phoneNumber && (
              <span style={styles.errorText}>{errors.phoneNumber}</span>
            )}
          </div>

          {/* Password */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              {t('auth.register.password', language)} *
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
              placeholder={t('auth.register.passwordPlaceholder', language)}
              disabled={isLoading}
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
              {t('auth.register.confirmPassword', language)} *
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
              placeholder={t('auth.register.confirmPasswordPlaceholder', language)}
              disabled={isLoading}
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
            {isLoading ? t('auth.register.creatingAccount', language) : t('auth.register.createAccount', language)}
          </button>
        </form>

        {/* Login Link */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            {t('auth.register.alreadyHaveAccount', language)}{' '}
            <Link href="/login" style={styles.footerLink}>
              {t('auth.register.loginHere', language)}
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
  optionalLabel: {
    fontSize: '12px',
    fontWeight: '400',
    color: '#9CA3AF'
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
