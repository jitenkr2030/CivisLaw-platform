'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/utils/LanguageContext';
import { t } from '@/utils/i18n';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError(t('auth.errors.emailRequired', language));
      return;
    }

    if (!validateEmail(email)) {
      setError(t('auth.errors.invalidEmail', language));
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t('auth.errors.requestFailed', language));
        return;
      }

      setSuccess(true);

    } catch (err) {
      console.error('Forgot password error:', err);
      setError(t('auth.errors.networkError', language));
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
            <h1 style={styles.title}>{t('auth.forgot.successTitle', language)}</h1>
            <p style={styles.subtitle}>
              {t('auth.forgot.successMessage', language)}
            </p>
            <p style={styles.emailSent}>{email}</p>
          </div>

          {/* Instructions */}
          <div style={styles.instructions}>
            <h3 style={styles.instructionsTitle}>
              {t('auth.forgot.instructionsTitle', language)}
            </h3>
            <ul style={styles.instructionsList}>
              <li>{t('auth.forgot.instruction1', language)}</li>
              <li>{t('auth.forgot.instruction2', language)}</li>
              <li>{t('auth.forgot.instruction3', language)}</li>
            </ul>
          </div>

          {/* Back to Login */}
          <div style={styles.footer}>
            <Link href="/login" style={styles.backLink}>
              ← {t('auth.forgot.backToLogin', language)}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>{t('auth.forgot.title', language)}</h1>
          <p style={styles.subtitle}>{t('auth.forgot.subtitle', language)}</p>
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
        {error && (
          <div style={styles.errorAlert}>
            {error}
          </div>
        )}

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              {t('auth.forgot.emailLabel', language)}
            </label>
            <input
              type="email"
              value={email}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(error ? styles.inputError : {})
              }}
              placeholder={t('auth.forgot.emailPlaceholder', language)}
              disabled={isLoading}
              autoComplete="email"
            />
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
            {isLoading ? t('auth.forgot.sending', language) : t('auth.forgot.sendLink', language)}
          </button>
        </form>

        {/* Back to Login */}
        <div style={styles.footer}>
          <Link href="/login" style={styles.backLink}>
            ← {t('auth.forgot.backToLogin', language)}
          </Link>
        </div>

        {/* Privacy Notice */}
        <div style={styles.privacyNotice}>
          <p style={styles.privacyText}>
            {t('auth.forgot.privacyNote', language)}
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
  emailSent: {
    fontSize: '14px',
    color: '#3B82F6',
    fontWeight: '500',
    marginTop: '8px'
  },
  instructions: {
    backgroundColor: '#F1F5F9',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px'
  },
  instructionsTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '12px'
  },
  instructionsList: {
    margin: '0',
    paddingLeft: '20px',
    fontSize: '13px',
    color: '#64748B',
    lineHeight: '1.8'
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
