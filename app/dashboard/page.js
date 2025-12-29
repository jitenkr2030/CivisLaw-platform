'use client';

import { useState, useEffect } from 'react';

const translations = {
  en: {
    dashboard: 'Dashboard',
    overview: 'Your Overview',
    myDocuments: 'My Documents',
    myStatements: 'My Statements',
    pendingConsents: 'Pending Consents',
    recentActivity: 'Recent Activity',
    quickActions: 'Quick Actions',
    uploadDocument: 'Upload Document',
    recordStatement: 'Record Statement',
    manageConsents: 'Manage Consents',
    viewProfile: 'View Profile',
    totalDocuments: 'Total Documents',
    processedDocuments: 'Processed Documents',
    totalStatements: 'Total Statements',
    transcribedStatements: 'Transcribed Statements',
    grantedConsents: 'Granted Consents',
    noDocuments: 'No documents yet',
    noStatements: 'No statements yet',
    noActivity: 'No recent activity',
    loading: 'Loading dashboard...',
    uploadNew: 'Upload New Document',
    startRecording: 'Start Recording',
    viewAll: 'View All',
    documentsSubtitle: 'Manage and track your legal documents',
    statementsSubtitle: 'Record and manage victim statements',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    overview: 'आपका अवलोकन',
    myDocuments: 'मेरे दस्तावेज़',
    myStatements: 'मेरे बयान',
    pendingConsents: 'लंबित सहमतियाँ',
    recentActivity: 'हाल की गतिविधि',
    quickActions: 'त्वरित कार्रवाई',
    uploadDocument: 'दस्तावेज़ अपलोड करें',
    recordStatement: 'बयान रिकॉर्ड करें',
    manageConsents: 'सहमतियाँ प्रबंधित करें',
    viewProfile: 'प्रोफ़ाइल देखें',
    totalDocuments: 'कुल दस्तावेज़',
    processedDocuments: 'संसाधित दस्तावेज़',
    totalStatements: 'कुल बयान',
    transcribedStatements: 'ट्रांसक्राइब्ड बयान',
    grantedConsents: 'दी गई सहमतियाँ',
    noDocuments: 'अभी तक कोई दस्तावेज़ नहीं',
    noStatements: 'अभी तक कोई बयान नहीं',
    noActivity: 'कोई हाल की गतिविधि नहीं',
    loading: 'डैशबोर्ड लोड हो रहा है...',
    uploadNew: 'नया दस्तावेज़ अपलोड करें',
    startRecording: 'रिकॉर्डिंग शुरू करें',
    viewAll: 'सभी देखें',
    documentsSubtitle: 'अपने कानूनी दस्तावेज़ों को प्रबंधित करें और ट्रैक करें',
    statementsSubtitle: 'पीड़ित के बयान रिकॉर्ड और प्रबंधित करें',
  },
  ta: {
    dashboard: 'டாஷ்போர்டு',
    overview: 'உங்கள் கண்ணோட்டம்',
    myDocuments: 'என்னுடைய ஆவணங்கள்',
    myStatements: 'என்னுடைய அறிக்கைகள்',
    pendingConsents: 'நிலுவையில் உள்ள சம்மதங்கள்',
    recentActivity: 'அண்மை நடவடிக்கைகள்',
    quickActions: 'விரைந்த நடவடிக்கைகள்',
    uploadDocument: 'ஆவணம் பதிவேற்று',
    recordStatement: 'அறிக்கை பதிவு செய்',
    manageConsents: 'சம்மதங்களை நிர்வகிக்கவும்',
    viewProfile: 'சுயவிவரம் பார்க்கவும்',
    totalDocuments: 'மொத்த ஆவணங்கள்',
    processedDocuments: 'செயலாக்கப்பட்ட ஆவணங்கள்',
    totalStatements: 'மொத்த அறிக்கைகள்',
    transcribedStatements: 'பதிவு செய்யப்பட்ட அறிக்கைகள்',
    grantedConsents: 'வழங்கப்பட்ட சம்மதங்கள்',
    noDocuments: 'ஆவணம் இல்லை',
    noStatements: 'அறிக்கை இல்லை',
    noActivity: 'அண்மை நடவடிக்கை இல்லை',
    loading: 'டாஷ்போர்டு ஏற்றப்படுகிறது...',
    uploadNew: 'புதிய ஆவணம் பதிவேற்று',
    startRecording: 'பதிவு செய்யத் தொடங்கு',
    viewAll: 'அனைத்தும் காண்க',
    documentsSubtitle: 'உங்கள் சட்ட ஆவணங்களை நிர்வகித்து கண்காணிக்கவும்',
    statementsSubtitle: 'பாதிக்கப்பட்டவரின் அறிக்கையைப் பதிவு செய்து நிர்வகிக்கவும்',
  },
};

export default function UserDashboard() {
  const [language, setLanguage] = useState('en');
  const [stats, setStats] = useState({
    totalDocuments: 0,
    processedDocuments: 0,
    totalStatements: 0,
    transcribedStatements: 0,
    grantedConsents: 0,
  });
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [recentStatements, setRecentStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const t = translations[language] || translations.en;

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data for demonstration
      setStats({
        totalDocuments: 12,
        processedDocuments: 8,
        totalStatements: 5,
        transcribedStatements: 3,
        grantedConsents: 4,
      });
      
      setRecentDocuments([
        { id: '1', fileName: 'legal_notice.pdf', fileType: 'pdf', status: 'READY', createdAt: '2024-01-19', size: '2.5 MB' },
        { id: '2', fileName: 'court_order.docx', fileType: 'docx', status: 'PROCESSING', createdAt: '2024-01-18', size: '1.8 MB' },
        { id: '3', fileName: 'contract_agreement.pdf', fileType: 'pdf', status: 'READY', createdAt: '2024-01-17', size: '3.2 MB' },
      ]);
      
      setRecentStatements([
        { id: '1', title: 'Incident Statement', status: 'FINAL', createdAt: '2024-01-19', duration: '5:32' },
        { id: '2', title: 'Witness Testimony', status: 'REVIEW', createdAt: '2024-01-18', duration: '8:15' },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: '📄', label: t.uploadNew, href: '/documents', color: '#3b82f6' },
    { icon: '🎤', label: t.startRecording, href: '/statements', color: '#10b981' },
    { icon: '✅', label: t.manageConsents, href: '/consent', color: '#8b5cf6' },
    { icon: '👤', label: t.viewProfile, href: '/profile', color: '#f59e0b' },
  ];

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loading}>{t.loading}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Stats Cards */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>{t.overview}</h2>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📄</div>
            <div style={styles.statContent}>
              <p style={styles.statLabel}>{t.totalDocuments}</p>
              <p style={styles.statValue}>{stats.totalDocuments}</p>
              <p style={styles.statSubtext}>{stats.processedDocuments} processed</p>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🎤</div>
            <div style={styles.statContent}>
              <p style={styles.statLabel}>{t.totalStatements}</p>
              <p style={styles.statValue}>{stats.totalStatements}</p>
              <p style={styles.statSubtext}>{stats.transcribedStatements} transcribed</p>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statIcon}>✅</div>
            <div style={styles.statContent}>
              <p style={styles.statLabel}>{t.grantedConsents}</p>
              <p style={styles.statValue}>{stats.grantedConsents}</p>
              <p style={styles.statSubtext}>consents granted</p>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statIcon}>⏳</div>
            <div style={styles.statContent}>
              <p style={styles.statLabel}>{t.pendingConsents}</p>
              <p style={styles.statValue}>2</p>
              <p style={styles.statSubtext}>pending requests</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>{t.quickActions}</h2>
        <div style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <a
              key={index}
              href={action.href}
              style={{...styles.actionCard, backgroundColor: action.color}}
            >
              <span style={styles.actionIcon}>{action.icon}</span>
              <span style={styles.actionLabel}>{action.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Recent Documents */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>{t.myDocuments}</h2>
          <a href="/documents" style={styles.viewAllLink}>{t.viewAll}</a>
        </div>
        <p style={styles.sectionSubtitle}>{t.documentsSubtitle}</p>
        
        <div style={styles.tableContainer}>
          {recentDocuments.length === 0 ? (
            <div style={styles.noData}>{t.noDocuments}</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>File Name</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Size</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentDocuments.map((doc) => (
                  <tr key={doc.id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <span style={styles.fileName}>📄 {doc.fileName}</span>
                    </td>
                    <td style={styles.td}>{doc.fileType.toUpperCase()}</td>
                    <td style={styles.td}>{doc.size}</td>
                    <td style={styles.td}>
                      <span style={styles.statusBadge(doc.status)}>
                        {doc.status}
                      </span>
                    </td>
                    <td style={styles.td}>{new Date(doc.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Recent Statements */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>{t.myStatements}</h2>
          <a href="/statements" style={styles.viewAllLink}>{t.viewAll}</a>
        </div>
        <p style={styles.sectionSubtitle}>{t.statementsSubtitle}</p>
        
        <div style={styles.tableContainer}>
          {recentStatements.length === 0 ? (
            <div style={styles.noData}>{t.noStatements}</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Duration</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentStatements.map((statement) => (
                  <tr key={statement.id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <span style={styles.fileName}>🎤 {statement.title}</span>
                    </td>
                    <td style={styles.td}>{statement.duration}</td>
                    <td style={styles.td}>
                      <span style={styles.statusBadge(statement.status)}>
                        {statement.status}
                      </span>
                    </td>
                    <td style={styles.td}>{new Date(statement.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  section: {
    marginBottom: '30px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  sectionSubtitle: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '15px',
  },
  viewAllLink: {
    fontSize: '14px',
    color: '#3b82f6',
    textDecoration: 'none',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  statIcon: {
    fontSize: '32px',
    marginRight: '15px',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: '12px',
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#111827',
    margin: '5px 0 0 0',
  },
  statSubtext: {
    fontSize: '12px',
    color: '#10b981',
    margin: '3px 0 0 0',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '15px',
  },
  actionCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '25px 20px',
    borderRadius: '12px',
    textDecoration: 'none',
    color: 'white',
    transition: 'transform 0.2s',
    cursor: 'pointer',
  },
  actionIcon: {
    fontSize: '28px',
    marginBottom: '10px',
  },
  actionLabel: {
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'center',
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
    padding: '12px 20px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  tableRow: {
    borderTop: '1px solid #e5e7eb',
  },
  td: {
    padding: '15px 20px',
    fontSize: '14px',
    color: '#374151',
  },
  fileName: {
    fontWeight: '500',
    color: '#111827',
  },
  statusBadge: (status) => {
    const colors = {
      READY: { bg: '#d1fae5', text: '#059669' },
      PROCESSING: { bg: '#fef3c7', text: '#d97706' },
      PENDING: { bg: '#dbeafe', text: '#1d4ed8' },
      FINAL: { bg: '#d1fae5', text: '#059669' },
      REVIEW: { bg: '#fef3c7', text: '#d97706' },
      DRAFT: { bg: '#f3f4f6', text: '#6b7280' },
    };
    const color = colors[status] || { bg: '#f3f4f6', text: '#6b7280' };
    return {
      backgroundColor: color.bg,
      color: color.text,
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
    };
  },
  noData: {
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
};
