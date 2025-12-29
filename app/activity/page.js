'use client';

import { useState, useEffect } from 'react';

const translations = {
  en: {
    activity: 'Activity Log',
    title: 'Your Activity History',
    description: 'Track all your actions and system events',
    search: 'Search activities...',
    filterByAction: 'Filter by Action',
    filterByCategory: 'Filter by Category',
    allActions: 'All Actions',
    allCategories: 'All Categories',
    timestamp: 'Timestamp',
    action: 'Action',
    category: 'Category',
    details: 'Details',
    noActivity: 'No activity found',
    loading: 'Loading activity...',
    login: 'Login',
    logout: 'Logout',
    documentUpload: 'Document Upload',
    documentView: 'Document View',
    statementRecord: 'Statement Recording',
    consentGranted: 'Consent Granted',
    consentRevoked: 'Consent Revoked',
    profileUpdate: 'Profile Update',
    passwordChange: 'Password Change',
    translationRequest: 'Translation Request',
    info: 'Info',
    warning: 'Warning',
    critical: 'Critical',
    auth: 'Authentication',
    document: 'Documents',
    statement: 'Statements',
    consent: 'Consent',
    profile: 'Profile',
    exportData: 'Export Data',
  },
  hi: {
    activity: 'गतिविधि लॉग',
    title: 'आपका गतिविधि इतिहास',
    description: 'अपने सभी कार्यों और सिस्टम घटनाओं को ट्रैक करें',
    search: 'गतिविधियाँ खोजें...',
    filterByAction: 'क्रिया के अनुसार फ़िल्टर करें',
    filterByCategory: 'श्रेणी के अनुसार फ़िल्टर करें',
    allActions: 'सभी क्रियाएं',
    allCategories: 'सभी श्रेणियां',
    timestamp: 'समय',
    action: 'क्रिया',
    category: 'श्रेणी',
    details: 'विवरण',
    noActivity: 'कोई गतिविधि नहीं मिली',
    loading: 'गतिविधि लोड हो रही है...',
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    documentUpload: 'दस्तावेज़ अपलोड',
    documentView: 'दस्तावेज़ देखना',
    statementRecord: 'बयान रिकॉर्डिंग',
    consentGranted: 'सहमति दी गई',
    consentRevoked: 'सहमति रद्द',
    profileUpdate: 'प्रोफ़ाइल अपडेट',
    passwordChange: 'पासवर्ड बदलें',
    translationRequest: 'अनुवाद अनुरोध',
    info: 'जानकारी',
    warning: 'चेतावनी',
    critical: 'गंभीर',
    auth: 'प्रमाणीकरण',
    document: 'दस्तावेज़',
    statement: 'बयान',
    consent: 'सहमति',
    profile: 'प्रोफ़ाइल',
    exportData: 'डेटा निर्यात',
  },
  ta: {
    activity: 'நடவடிக்கை பதிவு',
    title: 'உங்கள் நடவடிக்கை வரலாறு',
    description: 'உங்கள் அனைத்து செயல்கள் மற்றும் கணினி நிகழ்வுகளைக் கண்காணிக்கவும்',
    search: 'நடவடிக்கைகளைத் தேடு...',
    filterByAction: 'செயல் வாரியாக வடிகட்டு',
    filterByCategory: 'பகுதி வாரியாக வடிகட்டு',
    allActions: 'அனைத்து செயல்கள்',
    allCategories: 'அனைத்து பகுதிகள்',
    timestamp: 'நேரம்',
    action: 'செயல்',
    category: 'பகுதி',
    details: 'விவரங்கள்',
    noActivity: 'நடவடிக்கை இல்லை',
    loading: 'நடவடிக்கைகள் ஏற்றப்படுகிறது...',
    login: 'உள்நுழைவு',
    logout: 'வெளியேறு',
    documentUpload: 'ஆவணம் பதிவேற்றம்',
    documentView: 'ஆவணம் பார்வை',
    statementRecord: 'அறிக்கை பதிவு',
    consentGranted: 'சம்மதம் வழங்கப்பட்டது',
    consentRevoked: 'சம்மதம் ரத்து செய்யப்பட்டது',
    profileUpdate: 'சுயவிவரம் புதுப்பிப்பு',
    passwordChange: 'கடவுச்சொல் மாற்றம்',
    translationRequest: 'மொழிபெயர்ப்பு கோரிக்கை',
    info: 'தகவல்',
    warning: 'எச்சரிக்கை',
    critical: 'மிக முக்கிய',
    auth: 'அங்கீகாரம்',
    document: 'ஆவணங்கள்',
    statement: 'அறிக்கை',
    consent: 'சம்மதம்',
    profile: 'சுயவிவரம்',
    exportData: 'தரவு ஏற்றுமதி',
  },
};

export default function ActivityPage() {
  const [language, setLanguage] = useState('en');
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedActivity, setSelectedActivity] = useState(null);
  
  const t = translations[language] || translations.en;

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
    fetchActivities();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, searchTerm, actionFilter, categoryFilter]);

  const fetchActivities = async () => {
    try {
      // Mock data for demonstration
      const mockActivities = [
        { id: '1', timestamp: '2024-01-20T10:30:00Z', action: 'LOGIN', category: 'AUTH', severity: 'INFO', metadata: { method: 'password', device: 'Chrome' } },
        { id: '2', timestamp: '2024-01-20T10:35:00Z', action: 'DOCUMENT_UPLOAD', category: 'DOCUMENT', severity: 'INFO', metadata: { fileName: 'legal_notice.pdf', size: '2.5MB' } },
        { id: '3', timestamp: '2024-01-20T11:00:00Z', action: 'STATEMENT_RECORD', category: 'STATEMENT', severity: 'INFO', metadata: { title: 'Incident Statement', duration: '5:32' } },
        { id: '4', timestamp: '2024-01-20T11:30:00Z', action: 'PROFILE_UPDATE', category: 'PROFILE', severity: 'INFO', metadata: { fields: ['fullName', 'phone'] } },
        { id: '5', timestamp: '2024-01-20T12:00:00Z', action: 'CONSENT_GRANTED', category: 'CONSENT', severity: 'INFO', metadata: { resourceType: 'DOCUMENT', grantedTo: 'Legal Aid NGO' } },
        { id: '6', timestamp: '2024-01-20T12:30:00Z', action: 'DOCUMENT_VIEW', category: 'DOCUMENT', severity: 'INFO', metadata: { fileName: 'court_order.docx' } },
        { id: '7', timestamp: '2024-01-20T13:00:00Z', action: 'TRANSLATION_REQUEST', category: 'DOCUMENT', severity: 'INFO', metadata: { sourceLang: 'en', targetLang: 'hi' } },
        { id: '8', timestamp: '2024-01-20T14:00:00Z', action: 'LOGOUT', category: 'AUTH', severity: 'INFO', metadata: { duration: '3h 30m' } },
      ];
      setActivities(mockActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = () => {
    let filtered = [...activities];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(activity =>
        activity.action?.toLowerCase().includes(term) ||
        activity.category?.toLowerCase().includes(term)
      );
    }
    
    if (actionFilter !== 'all') {
      filtered = filtered.filter(activity => activity.action === actionFilter);
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(activity => activity.category === categoryFilter);
    }
    
    setFilteredActivities(filtered);
  };

  const getActionLabel = (action) => {
    const labels = {
      LOGIN: t.login,
      LOGOUT: t.logout,
      DOCUMENT_UPLOAD: t.documentUpload,
      DOCUMENT_VIEW: t.documentView,
      STATEMENT_RECORD: t.statementRecord,
      CONSENT_GRANTED: t.consentGranted,
      CONSENT_REVOKED: t.consentRevoked,
      PROFILE_UPDATE: t.profileUpdate,
      PASSWORD_CHANGE: t.passwordChange,
      TRANSLATION_REQUEST: t.translationRequest,
    };
    return labels[action] || action;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      AUTH: '🔐',
      DOCUMENT: '📄',
      STATEMENT: '🎤',
      CONSENT: '✅',
      PROFILE: '👤',
    };
    return icons[category] || '📋';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      INFO: '#3b82f6',
      WARN: '#f59e0b',
      CRITICAL: '#ef4444',
    };
    return colors[severity] || '#9ca3af';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loading}>{t.loading}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>{t.activity}</h1>
          <p style={styles.subtitle}>{t.description}</p>
        </div>
        
        <button style={styles.exportBtn}>
          📥 {t.exportData}
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filterBar}>
        <div style={styles.searchContainer}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder={t.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          style={styles.select}
        >
          <option value="all">{t.allActions}</option>
          <option value="LOGIN">{t.login}</option>
          <option value="LOGOUT">{t.logout}</option>
          <option value="DOCUMENT_UPLOAD">{t.documentUpload}</option>
          <option value="DOCUMENT_VIEW">{t.documentView}</option>
          <option value="STATEMENT_RECORD">{t.statementRecord}</option>
          <option value="CONSENT_GRANTED">{t.consentGranted}</option>
          <option value="PROFILE_UPDATE">{t.profileUpdate}</option>
        </select>
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={styles.select}
        >
          <option value="all">{t.allCategories}</option>
          <option value="AUTH">{t.auth}</option>
          <option value="DOCUMENT">{t.document}</option>
          <option value="STATEMENT">{t.statement}</option>
          <option value="CONSENT">{t.consent}</option>
          <option value="PROFILE">{t.profile}</option>
        </select>
      </div>

      {/* Activity Timeline */}
      <div style={styles.timelineContainer}>
        {filteredActivities.length === 0 ? (
          <div style={styles.noActivity}>{t.noActivity}</div>
        ) : (
          <div style={styles.timeline}>
            {filteredActivities.map((activity, index) => (
              <div key={activity.id} style={styles.timelineItem}>
                <div style={styles.timelineLine}>
                  <div style={styles.timelineDot}>
                    {getCategoryIcon(activity.category)}
                  </div>
                  {index < filteredActivities.length - 1 && (
                    <div style={styles.timelineConnection}></div>
                  )}
                </div>
                
                <div
                  style={styles.activityCard}
                  onClick={() => setSelectedActivity(activity)}
                >
                  <div style={styles.activityHeader}>
                    <div style={styles.activityInfo}>
                      <span style={styles.activityAction}>
                        {getActionLabel(activity.action)}
                      </span>
                      <span style={styles.activityCategory}>
                        {activity.category}
                      </span>
                    </div>
                    <span style={{
                      ...styles.severityDot,
                      backgroundColor: getSeverityColor(activity.severity),
                    }}></span>
                  </div>
                  
                  <div style={styles.activityTimestamp}>
                    📅 {formatTimestamp(activity.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedActivity && (
        <div style={styles.modalOverlay} onClick={() => setSelectedActivity(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{t.details}</h3>
              <button style={styles.modalClose} onClick={() => setSelectedActivity(null)}>
                ×
              </button>
            </div>
            
            <div style={styles.modalContent}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>{t.action}:</span>
                <span style={styles.detailValue}>{getActionLabel(selectedActivity.action)}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>{t.category}:</span>
                <span style={styles.detailValue}>{selectedActivity.category}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>{t.timestamp}:</span>
                <span style={styles.detailValue}>{formatTimestamp(selectedActivity.timestamp)}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Severity:</span>
                <span style={{
                  ...styles.severityBadge,
                  backgroundColor: getSeverityColor(selectedActivity.severity),
                }}>
                  {selectedActivity.severity}
                </span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Metadata:</span>
                <pre style={styles.metadata}>
                  {JSON.stringify(selectedActivity.metadata, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    flexWrap: 'wrap',
    gap: '15px',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111827',
    margin: 0,
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    marginTop: '4px',
  },
  exportBtn: {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  filterBar: {
    display: 'flex',
    gap: '15px',
    marginBottom: '25px',
    flexWrap: 'wrap',
  },
  searchContainer: {
    position: 'relative',
    flex: 1,
    minWidth: '250px',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '14px',
  },
  searchInput: {
    width: '100%',
    padding: '10px 10px 10px 40px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
  },
  select: {
    padding: '10px 15px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'white',
    cursor: 'pointer',
    minWidth: '150px',
  },
  timelineContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  timeline: {
    display: 'flex',
    flexDirection: 'column',
  },
  timelineItem: {
    display: 'flex',
    gap: '20px',
  },
  timelineLine: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '40px',
  },
  timelineDot: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    zIndex: 1,
  },
  timelineConnection: {
    width: '2px',
    flex: 1,
    backgroundColor: '#e5e7eb',
    minHeight: '20px',
    marginTop: '-5px',
  },
  activityCard: {
    flex: 1,
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '15px',
    marginBottom: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  activityHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  activityInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  activityAction: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
  },
  activityCategory: {
    fontSize: '12px',
    color: '#6b7280',
  },
  severityDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  activityTimestamp: {
    fontSize: '13px',
    color: '#9ca3af',
  },
  noActivity: {
    padding: '40px',
    textAlign: 'center',
    color: '#6b7280',
    fontSize: '14px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
  },
  loading: {
    fontSize: '16px',
    color: '#6b7280',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    maxWidth: '500px',
    width: '90%',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #e5e7eb',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  modalClose: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#6b7280',
  },
  modalContent: {
    padding: '20px',
  },
  detailRow: {
    marginBottom: '15px',
  },
  detailLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#6b7280',
    display: 'block',
    marginBottom: '4px',
  },
  detailValue: {
    fontSize: '14px',
    color: '#111827',
  },
  severityBadge: {
    color: 'white',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block',
    textTransform: 'uppercase',
  },
  metadata: {
    backgroundColor: '#f3f4f6',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '12px',
    overflow: 'auto',
    marginTop: '5px',
  },
};
