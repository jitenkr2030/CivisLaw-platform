'use client';

import { useState, useEffect } from 'react';

const translations = {
  en: {
    auditLogs: 'Audit Logs',
    title: 'System Activity Log',
    description: 'Track all system activities and user actions',
    search: 'Search logs...',
    filterByAction: 'Filter by Action',
    filterByCategory: 'Filter by Category',
    allActions: 'All Actions',
    allCategories: 'All Categories',
    timestamp: 'Timestamp',
    user: 'User',
    action: 'Action',
    category: 'Category',
    severity: 'Severity',
    ipAddress: 'IP Address',
    details: 'Details',
    noLogs: 'No audit logs found',
    loading: 'Loading audit logs...',
    exportLogs: 'Export Logs',
    clearLogs: 'Clear Old Logs',
    info: 'Info',
    warning: 'Warning',
    critical: 'Critical',
    debug: 'Debug',
    login: 'Login',
    logout: 'Logout',
    documentUpload: 'Document Upload',
    profileUpdate: 'Profile Update',
    passwordChange: 'Password Change',
  },
  hi: {
    auditLogs: 'ऑडिट लॉग',
    title: 'सिस्टम गतिविधि लॉग',
    description: 'सभी सिस्टम गतिविधियों और उपयोगकर्ता कार्यों को ट्रैक करें',
    search: 'लॉग खोजें...',
    filterByAction: 'क्रिया के अनुसार फ़िल्टर करें',
    filterByCategory: 'श्रेणी के अनुसार फ़िल्टर करें',
    allActions: 'सभी क्रियाएं',
    allCategories: 'सभी श्रेणियां',
    timestamp: 'समय',
    user: 'उपयोगकर्ता',
    action: 'क्रिया',
    category: 'श्रेणी',
    severity: 'गंभीरता',
    ipAddress: 'IP पता',
    details: 'विवरण',
    noLogs: 'कोई ऑडिट लॉग नहीं मिला',
    loading: 'ऑडिट लॉग लोड हो रहे हैं...',
    exportLogs: 'लॉग निर्यात करें',
    clearLogs: 'पुराने लॉग साफ़ करें',
    info: 'जानकारी',
    warning: 'चेतावनी',
    critical: 'गंभीर',
    debug: 'डीबग',
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    documentUpload: 'दस्तावेज़ अपलोड',
    profileUpdate: 'प्रोफ़ाइल अपडेट',
    passwordChange: 'पासवर्ड बदलें',
  },
  ta: {
    auditLogs: 'தணிக்கை பதிவுகள்',
    title: 'கணினி நடவடிக்கை பதிவு',
    description: 'அனைத்து கணினி நடவடிக்கைகள் மற்றும் பயனர் செயல்களைக் கண்காணிக்கவும்',
    search: 'பதிவுகளைத் தேடு...',
    filterByAction: 'செயல் வாரியாக வடிகட்டு',
    filterByCategory: 'பகுதி வாரியாக வடிகட்டு',
    allActions: 'அனைத்து செயல்கள்',
    allCategories: 'அனைத்து பகுதிகள்',
    timestamp: 'நேரம்',
    user: 'பயனர்',
    action: 'செயல்',
    category: 'பகுதி',
    severity: 'தீவிரம்',
    ipAddress: 'IP முகவரி',
    details: 'விவரங்கள்',
    noLogs: 'தணிக்கை பதிவு எதுவும் இல்லை',
    loading: 'தணிக்கை பதிவுகள் ஏற்றப்படுகிறது...',
    exportLogs: 'பதிவுகள் ஏற்றுமதி',
    clearLogs: 'பழைய பதிவுகளை அழி',
    info: 'தகவல்',
    warning: 'எச்சரிக்கை',
    critical: 'மிக முக்கிய',
    debug: 'பிழைத்திருத்தம்',
    login: 'உள்நுழைவு',
    logout: 'வெளியேறு',
    documentUpload: 'ஆவணம் பதிவேற்றம்',
    profileUpdate: 'சுயவிவரம் புதுப்பிப்பு',
    passwordChange: 'கடவுச்சொல் மாற்றம்',
  },
};

export default function AdminAuditLogsPage() {
  const [language, setLanguage] = useState('en');
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState(null);
  
  const t = translations[language] || translations.en;

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
    fetchLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, actionFilter, categoryFilter, severityFilter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration
      const mockLogs = [
        { id: '1', timestamp: '2024-01-20T10:30:00Z', userId: 'user1', userName: 'John Doe', action: 'LOGIN', category: 'AUTH', severity: 'INFO', ipHash: 'abc123def', metadata: { method: 'password', device: 'Chrome' } },
        { id: '2', timestamp: '2024-01-20T10:35:00Z', userId: 'user1', userName: 'John Doe', action: 'DOCUMENT_UPLOAD', category: 'DOCUMENT', severity: 'INFO', ipHash: 'abc123def', metadata: { fileName: 'legal_doc.pdf', size: '2.5MB' } },
        { id: '3', timestamp: '2024-01-20T11:00:00Z', userId: 'user2', userName: 'Jane Smith', action: 'LOGIN_FAILED', category: 'AUTH', severity: 'WARN', ipHash: 'xyz789ghi', metadata: { reason: 'invalid_password' } },
        { id: '4', timestamp: '2024-01-20T11:15:00Z', userId: 'user3', userName: 'Admin User', action: 'ADMIN_ROLE_CHANGE', category: 'ADMIN', severity: 'CRITICAL', ipHash: 'jkl012mno', metadata: { targetUser: 'user5', oldRole: 'CITIZEN', newRole: 'NGO' } },
        { id: '5', timestamp: '2024-01-20T11:30:00Z', userId: 'user1', userName: 'John Doe', action: 'PROFILE_UPDATE', category: 'USER', severity: 'INFO', ipHash: 'abc123def', metadata: { fields: ['fullName', 'phone'] } },
        { id: '6', timestamp: '2024-01-20T12:00:00Z', userId: 'user4', userName: 'NGO User', action: 'CONSENT_GRANTED', category: 'CONSENT', severity: 'INFO', ipHash: 'pqr345stu', metadata: { resourceType: 'DOCUMENT', resourceId: 'doc123' } },
        { id: '7', timestamp: '2024-01-20T12:30:00Z', userId: 'user1', userName: 'John Doe', action: 'PASSWORD_CHANGE', category: 'AUTH', severity: 'INFO', ipHash: 'abc123def', metadata: { method: 'settings' } },
        { id: '8', timestamp: '2024-01-20T13:00:00Z', userId: 'user2', userName: 'Jane Smith', action: 'LOGOUT', category: 'AUTH', severity: 'INFO', ipHash: 'xyz789ghi', metadata: { duration: '1h 25m' } },
      ];
      setLogs(mockLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = [...logs];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(log =>
        log.userName?.toLowerCase().includes(term) ||
        log.action?.toLowerCase().includes(term) ||
        log.category?.toLowerCase().includes(term)
      );
    }
    
    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(log => log.category === categoryFilter);
    }
    
    if (severityFilter !== 'all') {
      filtered = filtered.filter(log => log.severity === severityFilter);
    }
    
    setFilteredLogs(filtered);
  };

  const getSeverityColor = (severity) => {
    const colors = {
      INFO: '#3b82f6',
      WARN: '#f59e0b',
      CRITICAL: '#ef4444',
      DEBUG: '#9ca3af',
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

  const getActionLabel = (action) => {
    const labels = {
      LOGIN: t.login,
      LOGOUT: t.logout,
      DOCUMENT_UPLOAD: t.documentUpload,
      PROFILE_UPDATE: t.profileUpdate,
      PASSWORD_CHANGE: t.passwordChange,
    };
    return labels[action] || action;
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
          <h1 style={styles.title}>{t.auditLogs}</h1>
          <p style={styles.subtitle}>{t.description}</p>
        </div>
        
        <div style={styles.headerActions}>
          <button style={styles.exportBtn}>
            📥 {t.exportLogs}
          </button>
        </div>
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
          <option value="LOGIN">Login</option>
          <option value="LOGOUT">Logout</option>
          <option value="LOGIN_FAILED">Login Failed</option>
          <option value="DOCUMENT_UPLOAD">Document Upload</option>
          <option value="PROFILE_UPDATE">Profile Update</option>
          <option value="PASSWORD_CHANGE">Password Change</option>
          <option value="ADMIN_ROLE_CHANGE">Role Change</option>
          <option value="CONSENT_GRANTED">Consent Granted</option>
        </select>
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={styles.select}
        >
          <option value="all">{t.allCategories}</option>
          <option value="AUTH">Authentication</option>
          <option value="DOCUMENT">Document</option>
          <option value="USER">User</option>
          <option value="CONSENT">Consent</option>
          <option value="ADMIN">Admin</option>
        </select>
        
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          style={styles.select}
        >
          <option value="all">All Severity</option>
          <option value="INFO">{t.info}</option>
          <option value="WARN">{t.warning}</option>
          <option value="CRITICAL">{t.critical}</option>
          <option value="DEBUG">{t.debug}</option>
        </select>
      </div>

      {/* Logs Table */}
      <div style={styles.tableContainer}>
        {filteredLogs.length === 0 ? (
          <div style={styles.noLogs}>{t.noLogs}</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>{t.timestamp}</th>
                <th style={styles.th}>{t.user}</th>
                <th style={styles.th}>{t.action}</th>
                <th style={styles.th}>{t.category}</th>
                <th style={styles.th}>{t.severity}</th>
                <th style={styles.th}>{t.details}</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <span style={styles.timestamp}>{formatTimestamp(log.timestamp)}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.userCell}>
                      <span style={styles.userName}>{log.userName}</span>
                      <span style={styles.userId}>{log.userId}</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.actionBadge}>
                      {getActionLabel(log.action)}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.categoryBadge}>{log.category}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.severityBadge,
                      backgroundColor: getSeverityColor(log.severity),
                    }}>
                      {log.severity}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button
                      style={styles.detailsBtn}
                      onClick={() => setSelectedLog(log)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Details Modal */}
      {selectedLog && (
        <div style={styles.modalOverlay} onClick={() => setSelectedLog(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Log Details</h3>
              <button
                style={styles.modalClose}
                onClick={() => setSelectedLog(null)}
              >
                ×
              </button>
            </div>
            
            <div style={styles.modalContent}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Timestamp:</span>
                <span style={styles.detailValue}>{formatTimestamp(selectedLog.timestamp)}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>User:</span>
                <span style={styles.detailValue}>{selectedLog.userName} ({selectedLog.userId})</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Action:</span>
                <span style={styles.detailValue}>{selectedLog.action}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Category:</span>
                <span style={styles.detailValue}>{selectedLog.category}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Severity:</span>
                <span style={{
                  ...styles.severityBadge,
                  backgroundColor: getSeverityColor(selectedLog.severity),
                  display: 'inline-block',
                }}>
                  {selectedLog.severity}
                </span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>IP Hash:</span>
                <span style={styles.detailValue}>{selectedLog.ipHash}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Metadata:</span>
                <pre style={styles.metadata}>
                  {JSON.stringify(selectedLog.metadata, null, 2)}
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
    maxWidth: '1400px',
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
  headerActions: {
    display: 'flex',
    gap: '10px',
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
    marginBottom: '20px',
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
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
    textAlign: 'left',
  },
  th: {
    padding: '14px 20px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    borderBottom: '1px solid #e5e7eb',
  },
  tableRow: {
    borderTop: '1px solid #e5e7eb',
  },
  td: {
    padding: '15px 20px',
    fontSize: '14px',
    color: '#374151',
    verticalAlign: 'middle',
  },
  timestamp: {
    fontSize: '13px',
    color: '#6b7280',
  },
  userCell: {
    display: 'flex',
    flexDirection: 'column',
  },
  userName: {
    fontWeight: '500',
    color: '#111827',
  },
  userId: {
    fontSize: '12px',
    color: '#9ca3af',
  },
  actionBadge: {
    backgroundColor: '#dbeafe',
    color: '#1d4ed8',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  categoryBadge: {
    backgroundColor: '#f3f4f6',
    color: '#374151',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  severityBadge: {
    color: 'white',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  detailsBtn: {
    padding: '6px 12px',
    backgroundColor: '#f3f4f6',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    color: '#374151',
  },
  noLogs: {
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
    maxHeight: '80vh',
    overflow: 'auto',
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
  metadata: {
    backgroundColor: '#f3f4f6',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '12px',
    overflow: 'auto',
    marginTop: '5px',
  },
};
