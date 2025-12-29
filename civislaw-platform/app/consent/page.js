'use client';

import { useState, useEffect } from 'react';

const translations = {
  en: {
    consent: 'Consent Management',
    title: 'Data Sharing Consents',
    description: 'Manage your data sharing preferences and permissions',
    grantedConsents: 'Granted Consents',
    pendingRequests: 'Pending Requests',
    consentHistory: 'Consent History',
    resourceType: 'Resource Type',
    grantedTo: 'Granted To',
    status: 'Status',
    grantedAt: 'Granted At',
    expiresAt: 'Expires At',
    actions: 'Actions',
    view: 'View',
    revoke: 'Revoke',
    noConsents: 'No consents found',
    pendingConsents: 'Pending Consent Requests',
    requestDate: 'Request Date',
    purpose: 'Purpose',
    approve: 'Approve',
    deny: 'Deny',
    document: 'Document',
    statement: 'Statement',
    audioRecording: 'Audio Recording',
    translation: 'Translation',
    caseFile: 'Case File',
    granted: 'Granted',
    revoked: 'Revoked',
    expired: 'Expired',
    pending: 'Pending',
    always: 'Always',
    loading: 'Loading consents...',
    confirmRevoke: 'Are you sure you want to revoke this consent?',
    consentRevoked: 'Consent revoked successfully',
    requestApproved: 'Request approved successfully',
    requestDenied: 'Request denied successfully',
  },
  hi: {
    consent: 'सहमति प्रबंधन',
    title: 'डेटा साझाकरण सहमतियाँ',
    description: 'अपनी डेटा साझाकरण प्राथमिकताओं और अनुमतियों को प्रबंधित करें',
    grantedConsents: 'दी गई सहमतियाँ',
    pendingRequests: 'लंबित अनुरोध',
    consentHistory: 'सहमति इतिहास',
    resourceType: 'संसाधन प्रकार',
    grantedTo: 'किसको दी गई',
    status: 'स्थिति',
    grantedAt: 'दी गई तिथि',
    expiresAt: 'समाप्ति तिथि',
    actions: 'क्रियाएं',
    view: 'देखें',
    revoke: 'रद्द करें',
    noConsents: 'कोई सहमति नहीं मिली',
    pendingConsents: 'लंबित सहमति अनुरोध',
    requestDate: 'अनुरोध तिथि',
    purpose: 'उद्देश्य',
    approve: 'अनुमोदित करें',
    deny: 'अस्वीकार करें',
    document: 'दस्तावेज़',
    statement: 'बयान',
    audioRecording: 'ऑडियो रिकॉर्डिंग',
    translation: 'अनुवाद',
    caseFile: 'केस फ़ाइल',
    granted: 'दी गई',
    revoked: 'रद्द की गई',
    expired: 'समाप्त',
    pending: 'लंबित',
    always: 'हमेशा',
    loading: 'सहमतियाँ लोड हो रही हैं...',
    confirmRevoke: 'क्या आप वाकई इस सहमति को रद्द करना चाहते हैं?',
    consentRevoked: 'सहमति सफलतापूर्वक रद्द कर दी गई',
    requestApproved: 'अनुरोध सफलतापूर्वक अनुमोदित किया गया',
    requestDenied: 'अनुरोध अस्वीकार किया गया',
  },
  ta: {
    consent: 'சம்மத நிர்வாகம்',
    title: 'தரவு பகிர்வு சம்மதங்கள்',
    description: 'உங்கள் தரவு பகிர்வு விருப்பங்கள் மற்றும் அனுமதிகளை நிர்வகிக்கவும்',
    grantedConsents: 'வழங்கப்பட்ட சம்மதங்கள்',
    pendingRequests: 'நிலுவையில் உள்ள கோரிக்கைகள்',
    consentHistory: 'சம்மத வரலாறு',
    resourceType: 'வள வகை',
    grantedTo: 'வழங்கப்பட்டவர்',
    status: 'நிலை',
    grantedAt: 'வழங்கப்பட்ட தேதி',
    expiresAt: 'காலாவதியாகும் தேதி',
    actions: 'செயல்கள்',
    view: 'காண்க',
    revoke: 'ரத்து செய்',
    noConsents: 'சம்மதம் இல்லை',
    pendingConsents: 'நிலுவையில் உள்ள சம்மதக் கோரிக்கைகள்',
    requestDate: 'கோரிக்கை தேதி',
    purpose: 'நோக்கம்',
    approve: 'ஒப்புதல்',
    deny: 'மறுத்தல்',
    document: 'ஆவணம்',
    statement: 'அறிக்கை',
    audioRecording: 'ஆடியோ பதிவு',
    translation: 'மொழிபெயர்ப்பு',
    caseFile: 'கேஸ் கோப்பு',
    granted: 'வழங்கப்பட்டது',
    revoked: 'ரத்து செய்யப்பட்டது',
    expired: 'காலாவதியானது',
    pending: 'நிலுவையில்',
    always: 'எப்பொழுதும்',
    loading: 'சம்மதங்கள் ஏற்றப்படுகிறது...',
    confirmRevoke: 'இந்தச் சம்மதத்தை நிச்சயமாக ரத்து செய்ய விரும்புகிறீர்களா?',
    consentRevoked: 'சம்மதம் வெற்றிகரமாக ரத்து செய்யப்பட்டது',
    requestApproved: 'கோரிக்கை வெற்றிகரமாக ஒப்புதல் அளிக்கப்பட்டது',
    requestDenied: 'கோரிக்கை மறுக்கப்பட்டது',
  },
};

export default function ConsentPage() {
  const [language, setLanguage] = useState('en');
  const [consents, setConsents] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('granted');
  
  const t = translations[language] || translations.en;

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
    fetchConsentData();
  }, []);

  const fetchConsentData = async () => {
    try {
      // Mock data for demonstration
      setConsents([
        { id: '1', resourceType: 'DOCUMENT', resourceId: 'doc123', grantedTo: 'Legal Aid NGO', grantedToName: 'Delhi Legal Aid Society', status: 'GRANTED', grantedAt: '2024-01-15T10:30:00Z', expiresAt: '2024-04-15T10:30:00Z', purpose: 'Legal consultation' },
        { id: '2', resourceType: 'STATEMENT', resourceId: 'stmt456', grantedTo: 'SYSTEM_AI', grantedToName: 'AI Analysis System', status: 'GRANTED', grantedAt: '2024-01-18T14:20:00Z', expiresAt: null, purpose: 'Automatic transcription and analysis' },
        { id: '3', resourceType: 'TRANSLATION', resourceId: 'trans789', grantedTo: 'NGO', grantedToName: 'Maharashtra Legal Aid', status: 'REVOKED', grantedAt: '2024-01-10T09:15:00Z', revokedAt: '2024-01-17T16:45:00Z', purpose: 'Translation to Hindi' },
        { id: '4', resourceType: 'DOCUMENT', resourceId: 'doc321', grantedTo: 'PARTNER', grantedToName: 'National Law University', status: 'EXPIRED', grantedAt: '2023-12-01T11:00:00Z', expiresAt: '2024-01-01T11:00:00Z', purpose: 'Research and analysis' },
      ]);
      
      setPendingRequests([
        { id: '1', resourceType: 'DOCUMENT', resourceId: 'doc999', requesterName: 'Human Rights NGO', requesterId: 'ngo123', purpose: 'Case study and research', duration: 30, requestedAt: '2024-01-19T10:00:00Z' },
        { id: '2', resourceType: 'STATEMENT', resourceId: 'stmt888', requesterName: 'Legal Aid Counsel', requesterId: 'lawyer456', purpose: 'Client representation', duration: 60, requestedAt: '2024-01-19T08:30:00Z' },
      ]);
    } catch (error) {
      console.error('Error fetching consent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResourceTypeLabel = (type) => {
    const labels = {
      DOCUMENT: t.document,
      STATEMENT: t.statement,
      AUDIO_RECORDING: t.audioRecording,
      TRANSLATION: t.translation,
      CASE_FILE: t.caseFile,
    };
    return labels[type] || type;
  };

  const getStatusColor = (status) => {
    const colors = {
      GRANTED: { bg: '#d1fae5', text: '#059669' },
      REVOKED: { bg: '#fee2e2', text: '#dc2626' },
      EXPIRED: { bg: '#fef3c7', text: '#d97706' },
      PENDING: { bg: '#dbeafe', text: '#1d4ed8' },
    };
    return colors[status] || { bg: '#f3f4f6', text: '#6b7280' };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return t.always;
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleApprove = async (id) => {
    try {
      setPendingRequests(pendingRequests.filter(r => r.id !== id));
      alert(t.requestApproved);
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleDeny = async (id) => {
    try {
      setPendingRequests(pendingRequests.filter(r => r.id !== id));
      alert(t.requestDenied);
    } catch (error) {
      console.error('Error denying request:', error);
    }
  };

  const handleRevoke = async (id) => {
    if (!confirm(t.confirmRevoke)) return;
    
    try {
      setConsents(consents.filter(c => c.id !== id));
      alert(t.consentRevoked);
    } catch (error) {
      console.error('Error revoking consent:', error);
    }
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
          <h1 style={styles.title}>{t.consent}</h1>
          <p style={styles.subtitle}>{t.description}</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            backgroundColor: activeTab === 'granted' ? '#3b82f6' : 'white',
            color: activeTab === 'granted' ? 'white' : '#374151',
          }}
          onClick={() => setActiveTab('granted')}
        >
          ✅ {t.grantedConsents} ({consents.length})
        </button>
        <button
          style={{
            ...styles.tab,
            backgroundColor: activeTab === 'pending' ? '#3b82f6' : 'white',
            color: activeTab === 'pending' ? 'white' : '#374151',
          }}
          onClick={() => setActiveTab('pending')}
        >
          ⏳ {t.pendingRequests} ({pendingRequests.length})
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        {activeTab === 'granted' && (
          <div style={styles.consentsSection}>
            {consents.length === 0 ? (
              <div style={styles.noConsents}>
                <p style={styles.noConsentsText}>{t.noConsents}</p>
              </div>
            ) : (
              <div style={styles.consentsList}>
                {consents.map((consent) => {
                  const statusColor = getStatusColor(consent.status);
                  return (
                    <div key={consent.id} style={styles.consentCard}>
                      <div style={styles.consentHeader}>
                        <div style={styles.consentIcon}>
                          {consent.resourceType === 'DOCUMENT' ? '📄' :
                           consent.resourceType === 'STATEMENT' ? '🎤' :
                           consent.resourceType === 'TRANSLATION' ? '🌐' : '📁'}
                        </div>
                        <div style={styles.consentInfo}>
                          <h3 style={styles.consentResource}>
                            {getResourceTypeLabel(consent.resourceType)}
                          </h3>
                          <p style={styles.consentTo}>
                            {t.grantedTo}: {consent.grantedToName || consent.grantedTo}
                          </p>
                          <p style={styles.consentPurpose}>{consent.purpose}</p>
                        </div>
                        <span style={{
                          ...styles.statusBadge,
                          backgroundColor: statusColor.bg,
                          color: statusColor.text,
                        }}>
                          {consent.status}
                        </span>
                      </div>
                      
                      <div style={styles.consentMeta}>
                        <span style={styles.metaItem}>
                          📅 {t.grantedAt}: {formatDate(consent.grantedAt)}
                        </span>
                        <span style={styles.metaItem}>
                          ⏰ {t.expiresAt}: {formatDate(consent.expiresAt)}
                        </span>
                      </div>
                      
                      <div style={styles.consentActions}>
                        <button style={styles.actionBtn}>👁️ {t.view}</button>
                        {consent.status === 'GRANTED' && (
                          <button
                            style={{...styles.actionBtn, color: '#ef4444'}}
                            onClick={() => handleRevoke(consent.id)}
                          >
                            🚫 {t.revoke}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'pending' && (
          <div style={styles.requestsSection}>
            {pendingRequests.length === 0 ? (
              <div style={styles.noConsents}>
                <p style={styles.noConsentsText}>{t.noConsents}</p>
              </div>
            ) : (
              <div style={styles.requestsList}>
                {pendingRequests.map((request) => (
                  <div key={request.id} style={styles.requestCard}>
                    <div style={styles.requestHeader}>
                      <div style={styles.requestIcon}>
                        {request.resourceType === 'DOCUMENT' ? '📄' :
                         request.resourceType === 'STATEMENT' ? '🎤' :
                         request.resourceType === 'TRANSLATION' ? '🌐' : '📁'}
                      </div>
                      <div style={styles.requestInfo}>
                        <h3 style={styles.requestResource}>
                          {getResourceTypeLabel(request.resourceType)} Request
                        </h3>
                        <p style={styles.requestFrom}>
                          From: {request.requesterName}
                        </p>
                        <p style={styles.requestPurpose}>
                          {t.purpose}: {request.purpose}
                        </p>
                        <p style={styles.requestDuration}>
                          Duration: {request.duration} days
                        </p>
                      </div>
                    </div>
                    
                    <div style={styles.requestMeta}>
                      <span style={styles.metaItem}>
                        📅 {t.requestDate}: {new Date(request.requestedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div style={styles.requestActions}>
                      <button
                        style={styles.approveBtn}
                        onClick={() => handleApprove(request.id)}
                      >
                        ✅ {t.approve}
                      </button>
                      <button
                        style={styles.denyBtn}
                        onClick={() => handleDeny(request.id)}
                      >
                        ❌ {t.deny}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    marginBottom: '25px',
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
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '25px',
    backgroundColor: '#f3f4f6',
    padding: '5px',
    borderRadius: '10px',
    width: 'fit-content',
  },
  tab: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '25px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  consentsSection: {
    minHeight: '200px',
  },
  consentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  consentCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '20px',
  },
  consentHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px',
    marginBottom: '15px',
  },
  consentIcon: {
    fontSize: '32px',
  },
  consentInfo: {
    flex: 1,
  },
  consentResource: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '5px',
  },
  consentTo: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '5px',
  },
  consentPurpose: {
    fontSize: '14px',
    color: '#374151',
    margin: 0,
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  consentMeta: {
    display: 'flex',
    gap: '20px',
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #e5e7eb',
  },
  metaItem: {
    fontSize: '13px',
    color: '#9ca3af',
  },
  consentActions: {
    display: 'flex',
    gap: '10px',
  },
  actionBtn: {
    padding: '8px 16px',
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  requestsSection: {
    minHeight: '200px',
  },
  requestsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  requestCard: {
    border: '1px solid #e5e7eb',
    borderRadius: '10px',
    padding: '20px',
    borderLeft: '4px solid #f59e0b',
  },
  requestHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px',
    marginBottom: '15px',
  },
  requestIcon: {
    fontSize: '32px',
  },
  requestInfo: {
    flex: 1,
  },
  requestResource: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '5px',
  },
  requestFrom: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '5px',
  },
  requestPurpose: {
    fontSize: '14px',
    color: '#374151',
    marginBottom: '5px',
  },
  requestDuration: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  requestMeta: {
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid #e5e7eb',
  },
  requestActions: {
    display: 'flex',
    gap: '10px',
  },
  approveBtn: {
    padding: '8px 20px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  denyBtn: {
    padding: '8px 20px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  noConsents: {
    padding: '40px',
    textAlign: 'center',
  },
  noConsentsText: {
    fontSize: '14px',
    color: '#6b7280',
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
};
