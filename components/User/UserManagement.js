'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../../utils/LanguageContext';

// User Profile Component
export function UserProfile({ userId }) {
  const { language, t } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/user/${userId}`);
      const data = await response.json();
      if (data.user) {
        setProfile(data.user);
        setFormData({
          fullName: data.user.fullName || '',
          phoneNumber: data.user.phoneNumber || '',
          language: data.user.language || 'en',
          timezone: data.user.timezone || 'UTC',
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setMessage(null);
    try {
      const response = await fetch(`/api/user/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.user) {
        setProfile(data.user);
        setEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    }
  };

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  return (
    <div className="profile-section">
      <div className="profile-header">
        <h2>{t('nav.profile') || 'My Profile'}</h2>
        {!editing && (
          <button 
            className="btn btn-outline"
            onClick={() => setEditing(true)}
          >
            {t('common.edit') || 'Edit'}
          </button>
        )}
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="profile-form">
        <div className="form-group">
          <label>{t('auth.email') || 'Email'}</label>
          <input
            type="email"
            value={profile?.email || ''}
            disabled
            className="form-input"
          />
          <span className="help-text">{t('profile.emailHelp') || 'Email cannot be changed'}</span>
        </div>

        <div className="form-group">
          <label>{t('auth.fullName') || 'Full Name'}</label>
          <input
            type="text"
            value={editing ? formData.fullName : profile?.fullName || ''}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            disabled={!editing}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>{t('auth.phone') || 'Phone Number'}</label>
          <input
            type="tel"
            value={editing ? formData.phoneNumber : profile?.phoneNumber || ''}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            disabled={!editing}
            className="form-input"
            placeholder="10-digit mobile number"
          />
        </div>

        <div className="form-group">
          <label>{t('nav.selectLanguage') || 'Language'}</label>
          <select
            value={editing ? formData.language : profile?.language || 'en'}
            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
            disabled={!editing}
            className="form-input"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="bn">বাংলা (Bengali)</option>
            <option value="mr">मराठी (Marathi)</option>
          </select>
        </div>

        {editing && (
          <div className="form-actions">
            <button 
              className="btn btn-outline"
              onClick={() => {
                setEditing(false);
                setFormData({
                  fullName: profile?.fullName || '',
                  phoneNumber: profile?.phoneNumber || '',
                  language: profile?.language || 'en',
                });
              }}
            >
              {t('common.cancel')}
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleSave}
            >
              {t('common.save')}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .profile-section {
          padding: var(--spacing-lg);
        }
        
        .profile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }
        
        .profile-form {
          max-width: 500px;
        }
        
        .form-group {
          margin-bottom: var(--spacing-md);
        }
        
        .form-group label {
          display: block;
          margin-bottom: var(--spacing-xs);
          font-weight: 500;
        }
        
        .help-text {
          font-size: var(--font-size-xs);
          color: var(--color-text-muted);
        }
        
        .form-actions {
          display: flex;
          gap: var(--spacing-md);
          margin-top: var(--spacing-lg);
        }
        
        .message {
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          margin-bottom: var(--spacing-md);
        }
        
        .message.success {
          background: var(--color-success-light);
          color: var(--color-success);
        }
        
        .message.error {
          background: var(--color-error-light);
          color: var(--color-error);
        }
      `}</style>
    </div>
  );
}

// Privacy Settings Component
export function PrivacySettings({ userId }) {
  const { language, t } = useLanguage();
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConsents();
  }, [userId]);

  const fetchConsents = async () => {
    try {
      const response = await fetch(`/api/user/${userId}/consent`);
      const data = await response.json();
      setConsents(data.consents || []);
    } catch (error) {
      console.error('Failed to fetch consents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeConsent = async (resourceId, grantedTo) => {
    if (!confirm(t('consent.revokeConfirm') || 'Are you sure you want to revoke access?')) {
      return;
    }

    try {
      const params = new URLSearchParams({
        resourceId,
        grantedTo,
        reason: 'User revoked access via privacy settings',
      });

      const response = await fetch(`/api/user/${userId}/consent?${params}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchConsents();
      }
    } catch (error) {
      console.error('Failed to revoke consent:', error);
    }
  };

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  return (
    <div className="privacy-section">
      <div className="section-header">
        <h2>{t('privacy.title') || 'Privacy & Data Sharing'}</h2>
        <p className="section-description">
          {t('privacy.description') || 'Control who can access your data and for how long.'}
        </p>
      </div>

      {consents.length === 0 ? (
        <div className="empty-state">
          <p>{t('privacy.noConsents') || 'No data sharing permissions granted'}</p>
        </div>
      ) : (
        <div className="consents-list">
          {consents.map((consent, index) => (
            <div key={index} className="consent-card">
              <div className="consent-header">
                <span className="consent-type">{consent.resourceType}</span>
                <span className={`consent-status ${consent.accessList[0]?.status?.toLowerCase()}`}>
                  {consent.accessList[0]?.status || 'Unknown'}
                </span>
              </div>
              <div className="access-list">
                {consent.accessList.map((access) => (
                  <div key={access.id} className="access-item">
                    <div className="access-info">
                      <span className="access-name">{access.grantedToName || access.grantedTo}</span>
                      <span className="access-date">
                        {new Date(access.grantedAt).toLocaleDateString()}
                      </span>
                    </div>
                    {access.status === 'GRANTED' && (
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => handleRevokeConsent(consent.resourceId, access.grantedTo)}
                      >
                        {t('consent.revoke') || 'Revoke'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .privacy-section {
          padding: var(--spacing-lg);
        }
        
        .section-header {
          margin-bottom: var(--spacing-lg);
        }
        
        .section-description {
          color: var(--color-text-secondary);
          margin-top: var(--spacing-xs);
        }
        
        .consent-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }
        
        .consent-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-sm);
        }
        
        .consent-type {
          font-weight: 600;
          color: var(--color-primary);
        }
        
        .consent-status {
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-full);
          font-size: var(--font-size-xs);
          font-weight: 500;
        }
        
        .consent-status.granted {
          background: var(--color-success-light);
          color: var(--color-success);
        }
        
        .consent-status.revoked {
          background: var(--color-error-light);
          color: var(--color-error);
        }
        
        .access-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-sm) 0;
          border-top: 1px solid var(--color-border);
        }
        
        .access-name {
          font-weight: 500;
        }
        
        .access-date {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
        }
      `}</style>
    </div>
  );
}

// Activity Log Component
export function ActivityLog({ userId }) {
  const { language, t } = useLanguage();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLogs();
  }, [userId, page]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/user/${userId}/audit?page=${page}&limit=20`);
      const data = await response.json();
      setLogs(data.logs || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionLabel = (action) => {
    const labels = {
      LOGIN: 'Logged in',
      LOGOUT: 'Logged out',
      DOCUMENT_UPLOAD: 'Uploaded document',
      DOCUMENT_VIEW: 'Viewed document',
      STATEMENT_RECORD: 'Recorded statement',
      CONSENT_GRANTED: 'Granted data access',
      CONSENT_REVOKED: 'Revoked data access',
      PROFILE_UPDATE: 'Updated profile',
    };
    return labels[action] || action;
  };

  const getActionIcon = (action) => {
    if (action.includes('LOGIN')) return '🔑';
    if (action.includes('DOCUMENT')) return '📄';
    if (action.includes('STATEMENT')) return '🎤';
    if (action.includes('CONSENT')) return '🔒';
    if (action.includes('PROFILE')) return '👤';
    return '📋';
  };

  if (loading) {
    return <div className="loading">{t('common.loading')}</div>;
  }

  return (
    <div className="activity-section">
      <div className="section-header">
        <h2>{t('activity.title') || 'Activity Log'}</h2>
        <p className="section-description">
          {t('activity.description') || 'Track all your account activity and data access.'}
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="empty-state">
          <p>{t('activity.noLogs') || 'No activity recorded yet'}</p>
        </div>
      ) : (
        <>
          <div className="activity-list">
            {logs.map((log) => (
              <div key={log.id} className="activity-item">
                <span className="activity-icon">{getActionIcon(log.action)}</span>
                <div className="activity-details">
                  <span className="activity-action">{getActionLabel(log.action)}</span>
                  <span className="activity-time">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="page-info">
                Page {page} of {totalPages}
              </span>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      <style jsx>{`
        .activity-section {
          padding: var(--spacing-lg);
        }
        
        .section-header {
          margin-bottom: var(--spacing-lg);
        }
        
        .section-description {
          color: var(--color-text-secondary);
          margin-top: var(--spacing-xs);
        }
        
        .activity-list {
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        
        .activity-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          border-bottom: 1px solid var(--color-border);
        }
        
        .activity-item:last-child {
          border-bottom: none;
        }
        
        .activity-icon {
          font-size: 1.5rem;
        }
        
        .activity-details {
          flex: 1;
        }
        
        .activity-action {
          display: block;
          font-weight: 500;
        }
        
        .activity-time {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
        }
        
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: var(--spacing-md);
          margin-top: var(--spacing-lg);
        }
      `}</style>
    </div>
  );
}
