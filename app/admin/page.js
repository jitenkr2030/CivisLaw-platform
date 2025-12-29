'use client';

import { useState, useEffect } from 'react';

const translations = {
  en: {
    dashboard: 'Dashboard',
    overview: 'System Overview',
    totalUsers: 'Total Users',
    activeUsers: 'Active Users',
    totalDocuments: 'Total Documents',
    totalStatements: 'Total Statements',
    recentRegistrations: 'Recent Registrations',
    systemStatus: 'System Status',
    healthy: 'Healthy',
    maintenance: 'Maintenance',
    quickActions: 'Quick Actions',
    viewAllUsers: 'View All Users',
    createAnnouncement: 'Create Announcement',
    viewAnalytics: 'View Analytics',
    systemHealth: 'System Health',
    database: 'Database',
    apiStatus: 'API Status',
    storage: 'Storage Used',
    lastBackup: 'Last Backup',
    userRoles: 'User Roles Distribution',
    activityTimeline: 'Activity Timeline',
    pendingApprovals: 'Pending Approvals',
    newUsers: 'New Users Today',
    documentsProcessed: 'Documents Processed',
    statementsRecorded: 'Statements Recorded',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    overview: 'सिस्टम अवलोकन',
    totalUsers: 'कुल उपयोगकर्ता',
    activeUsers: 'सक्रिय उपयोगकर्ता',
    totalDocuments: 'कुल दस्तावेज़',
    totalStatements: 'कुल बयान',
    recentRegistrations: 'हाल के पंजीकरण',
    systemStatus: 'सिस्टम स्थिति',
    healthy: 'स्वस्थ',
    maintenance: 'रखरखाव',
    quickActions: 'त्वरित कार्रवाई',
    viewAllUsers: 'सभी उपयोगकर्ता देखें',
    createAnnouncement: 'घोषणा बनाएं',
    viewAnalytics: 'विश्लेषण देखें',
    systemHealth: 'सिस्टम स्वास्थ्य',
    database: 'डेटाबेस',
    apiStatus: 'API स्थिति',
    storage: 'उपयोग किया गया संग्रहण',
    lastBackup: 'अंतिम बैकअप',
    userRoles: 'उपयोगकर्ता भूमिका वितरण',
    activityTimeline: 'गतिविधि समयरेखा',
    pendingApprovals: 'लंबित अनुमोदन',
    newUsers: 'आज नए उपयोगकर्ता',
    documentsProcessed: 'संसाधित दस्तावेज़',
    statementsRecorded: 'रिकॉर्ड किए गए बयान',
  },
  ta: {
    dashboard: 'டாஷ்போர்டு',
    overview: 'கணினி கண்ணோட்டம்',
    totalUsers: 'மொத்த பயனர்கள்',
    activeUsers: 'செயல் பயனர்கள்',
    totalDocuments: 'மொத்த ஆவணங்கள்',
    totalStatements: 'மொத்த அறிக்கைகள்',
    recentRegistrations: 'அண்மை பதிவுகள்',
    systemStatus: 'கணினி நிலை',
    healthy: 'ஆரோக்கியமான',
    maintenance: 'பராமரிப்பு',
    quickActions: 'விரைந்த நடவடிக்கைகள்',
    viewAllUsers: 'அனைத்து பயனர்களைக் காண்க',
    createAnnouncement: 'அறிவிப்பு உருவாக்கு',
    viewAnalytics: 'பகுப்பாய்வைக் காண்க',
    systemHealth: 'கணினி ஆரோக்கியம்',
    database: 'தரவுத்தளம்',
    apiStatus: 'API நிலை',
    storage: 'பயன்படுத்தப்பட்ட சேமிப்பு',
    lastBackup: 'கடைசி காப்புப்பிரதி',
    userRoles: 'பயனர் பாத்திரங்கள் விநியோகம்',
    activityTimeline: 'நடவடிக்கை காலவரிசை',
    pendingApprovals: 'நிலுவையில் உள்ள ஒப்புதல்கள்',
    newUsers: 'இன்றைய புதிய பயனர்கள்',
    documentsProcessed: 'செயலாக்கப்பட்ட ஆவணங்கள்',
    statementsRecorded: 'பதிவு செய்யப்பட்ட அறிக்கைகள்',
  },
};

export default function AdminDashboard() {
  const [language, setLanguage] = useState('en');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalDocuments: 0,
    totalStatements: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const t = translations[language] || translations.en;

  useEffect(() => {
    // Load language preference
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
    
    // Fetch dashboard data
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || {});
        setRecentUsers(data.recentUsers || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use mock data for demo
      setStats({
        totalUsers: 156,
        activeUsers: 42,
        totalDocuments: 89,
        totalStatements: 23,
      });
      setRecentUsers([
        { id: '1', fullName: 'John Doe', email: 'john@example.com', role: 'CITIZEN', createdAt: new Date().toISOString() },
        { id: '2', fullName: 'Jane Smith', email: 'jane@example.com', role: 'VICTIM', createdAt: new Date().toISOString() },
        { id: '3', fullName: 'Legal Aid NGO', email: 'ngo@example.com', role: 'NGO', createdAt: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: '👥', label: t.viewAllUsers, href: '/admin/users', color: '#3b82f6' },
    { icon: '📢', label: t.createAnnouncement, href: '/admin/announcements', color: '#10b981' },
    { icon: '📈', label: t.viewAnalytics, href: '/admin/analytics', color: '#8b5cf6' },
    { icon: '⚙️', label: 'Settings', href: '/admin/settings', color: '#f59e0b' },
  ];

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loading}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Overview Cards */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>{t.overview}</h2>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>👥</div>
            <div style={styles.statContent}>
              <p style={styles.statLabel}>{t.totalUsers}</p>
              <p style={styles.statValue}>{stats.totalUsers}</p>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statIcon}>✅</div>
            <div style={styles.statContent}>
              <p style={styles.statLabel}>{t.activeUsers}</p>
              <p style={styles.statValue}>{stats.activeUsers}</p>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statIcon}>📄</div>
            <div style={styles.statContent}>
              <p style={styles.statLabel}>{t.totalDocuments}</p>
              <p style={styles.statValue}>{stats.totalDocuments}</p>
            </div>
          </div>
          
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🎤</div>
            <div style={styles.statContent}>
              <p style={styles.statLabel}>{t.totalStatements}</p>
              <p style={styles.statValue}>{stats.totalStatements}</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>{t.systemHealth}</h2>
        <div style={styles.healthGrid}>
          <div style={styles.healthCard}>
            <div style={styles.healthIndicator('healthy')}></div>
            <div>
              <p style={styles.healthLabel}>{t.database}</p>
              <p style={styles.healthStatus}>{t.healthy}</p>
            </div>
          </div>
          
          <div style={styles.healthCard}>
            <div style={styles.healthIndicator('healthy')}></div>
            <div>
              <p style={styles.healthLabel}>{t.apiStatus}</p>
              <p style={styles.healthStatus}>{t.online}</p>
            </div>
          </div>
          
          <div style={styles.healthCard}>
            <div style={styles.healthIndicator('healthy')}></div>
            <div>
              <p style={styles.healthLabel}>{t.storage}</p>
              <p style={styles.healthStatus}>2.3 GB / 10 GB</p>
            </div>
          </div>
          
          <div style={styles.healthCard}>
            <div style={styles.healthIndicator('healthy')}></div>
            <div>
              <p style={styles.healthLabel}>{t.lastBackup}</p>
              <p style={styles.healthStatus}>2 hours ago</p>
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

      {/* Recent Users */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>{t.recentRegistrations}</h2>
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.id} style={styles.tableRow}>
                  <td style={styles.td}>{user.fullName || 'N/A'}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>
                    <span style={styles.roleBadge(user.role)}>
                      {user.role}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Roles Distribution */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>{t.userRoles}</h2>
        <div style={styles.rolesChart}>
          {[
            { role: 'CITIZEN', count: 89, color: '#3b82f6', percentage: 57 },
            { role: 'VICTIM', count: 34, color: '#10b981', percentage: 22 },
            { role: 'NGO', count: 21, color: '#8b5cf6', percentage: 13 },
            { role: 'LEGAL_AID', count: 8, color: '#f59e0b', percentage: 5 },
            { role: 'ADMIN', count: 4, color: '#ef4444', percentage: 3 },
          ].map((item) => (
            <div key={item.role} style={styles.roleItem}>
              <div style={styles.roleHeader}>
                <span style={styles.roleName}>{item.role}</span>
                <span style={styles.roleCount}>{item.count}</span>
              </div>
              <div style={styles.roleBarBg}>
                <div
                  style={{
                    ...styles.roleBarFill,
                    width: `${item.percentage}%`,
                    backgroundColor: item.color,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '15px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
  healthGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  },
  healthCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '15px 20px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  healthIndicator: (status) => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: status === 'healthy' ? '#10b981' : '#f59e0b',
    marginRight: '12px',
  }),
  healthLabel: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  healthStatus: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
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
  roleBadge: (role) => {
    const colors = {
      ADMIN: '#fee2e2',
      NGO: '#ede9fe',
      LEGAL_AID: '#fef3c7',
      VICTIM: '#d1fae5',
      CITIZEN: '#dbeafe',
    };
    const textColors = {
      ADMIN: '#b91c1c',
      NGO: '#7c3aed',
      LEGAL_AID: '#d97706',
      VICTIM: '#059669',
      CITIZEN: '#1d4ed8',
    };
    return {
      backgroundColor: colors[role] || '#f3f4f6',
      color: textColors[role] || '#374151',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
    };
  },
  rolesChart: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  roleItem: {
    marginBottom: '15px',
  },
  roleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  roleName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  },
  roleCount: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
  },
  roleBarBg: {
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  roleBarFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s',
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
