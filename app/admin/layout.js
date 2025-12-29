'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const translations = {
  en: {
    dashboard: 'Dashboard',
    users: 'Users',
    analytics: 'Analytics',
    auditLogs: 'Audit Logs',
    announcements: 'Announcements',
    settings: 'Settings',
    logout: 'Logout',
    welcome: 'Welcome back',
    overview: 'System Overview',
    totalUsers: 'Total Users',
    activeUsers: 'Active Users',
    documents: 'Documents',
    statements: 'Statements',
    recentActivity: 'Recent Activity',
    quickActions: 'Quick Actions',
    manageUsers: 'Manage Users',
    viewAnalytics: 'View Analytics',
    createAnnouncement: 'Create Announcement',
    systemStatus: 'System Status',
    healthy: 'Healthy',
    pending: 'Pending',
    online: 'Online',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    users: 'उपयोगकर्ता',
    analytics: 'विश्लेषण',
    auditLogs: 'ऑडिट लॉग',
    announcements: 'घोषणाएं',
    settings: 'सेटिंग्स',
    logout: 'लॉगआउट',
    welcome: 'वापसी पर स्वागत है',
    overview: 'सिस्टम अवलोकन',
    totalUsers: 'कुल उपयोगकर्ता',
    activeUsers: 'सक्रिय उपयोगकर्ता',
    documents: 'दस्तावेज़',
    statements: 'बयान',
    recentActivity: 'हाल की गतिविधि',
    quickActions: 'त्वरित कार्रवाई',
    manageUsers: 'उपयोगकर्ताओं को प्रबंधित करें',
    viewAnalytics: 'विश्लेषण देखें',
    createAnnouncement: 'घोषणा बनाएं',
    systemStatus: 'सिस्टम स्थिति',
    healthy: 'स्वस्थ',
    pending: 'लंबित',
    online: 'ऑनलाइन',
  },
  ta: {
    dashboard: 'டैஷ்போர்டு',
    users: 'பயனர்கள்',
    analytics: 'பகுப்பாய்வு',
    auditLogs: 'தணிக்கை பதிவுகள்',
    announcements: ' அறிவிப்புகள்',
    settings: 'அமைப்புகள்',
    logout: 'வெளியேறு',
    welcome: 'மீண்டும் வருகிறீர்கள்',
    overview: 'கணினி கண்ணோட்டம்',
    totalUsers: 'மொத்த பயனர்கள்',
    activeUsers: 'செயல் பயனர்கள்',
    documents: 'ஆவணங்கள்',
    statements: 'அறிக்கைகள்',
    recentActivity: 'அண்மை நடவடிக்கைகள்',
    quickActions: 'விரைந்த நடவடிக்கைகள்',
    manageUsers: 'பயனர்களை நிர்வகிக்கவும்',
    viewAnalytics: 'பகுப்பாய்வைக் காண்க',
    createAnnouncement: 'அறிவிப்பு உருவாக்கு',
    systemStatus: 'கணினி நிலை',
    healthy: 'ஆரோக்கியமான',
    pending: 'நிலுவையில்',
    online: 'ஆன்லைன்',
  },
};

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [language, setLanguage] = useState('en');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  
  const t = translations[language] || translations.en;

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/profile');
        if (!response.ok) {
          router.push('/login');
          return;
        }
        const userData = await response.json();
        if (userData.user?.role !== 'ADMIN') {
          router.push('/');
          return;
        }
        setUser(userData.user);
      } catch (error) {
        router.push('/login');
      }
    };
    
    checkAuth();
    
    // Load language preference
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
  }, [router]);

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: t.dashboard, href: '/admin' },
    { id: 'users', icon: '👥', label: t.users, href: '/admin/users' },
    { id: 'analytics', icon: '📈', label: t.analytics, href: '/admin/analytics' },
    { id: 'auditLogs', icon: '📋', label: t.auditLogs, href: '/admin/audit-logs' },
    { id: 'announcements', icon: '📢', label: t.announcements, href: '/admin/announcements' },
    { id: 'settings', icon: '⚙️', label: t.settings, href: '/admin/settings' },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={{
        ...styles.sidebar,
        width: collapsed ? '70px' : '260px',
      }}>
        <div style={styles.logo}>
          {collapsed ? 'CL' : 'CivisLaw Admin'}
        </div>
        
        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              style={{
                ...styles.navItem,
                backgroundColor: currentPage === item.id ? '#3b82f6' : 'transparent',
              }}
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage(item.id);
                router.push(item.href);
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {!collapsed && <span style={styles.navLabel}>{item.label}</span>}
            </a>
          ))}
        </nav>
        
        <button style={styles.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '→' : '←'}
        </button>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Header */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>{t.dashboard}</h1>
            <p style={styles.subtitle}>{t.welcome}, {user.fullName || user.email}</p>
          </div>
          
          <div style={styles.headerActions}>
            <select
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                localStorage.setItem('language', e.target.value);
              }}
              style={styles.langSelect}
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="ta">தமிழ்</option>
            </select>
            
            <button style={styles.logoutBtn} onClick={handleLogout}>
              {t.logout}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div style={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
  },
  sidebar: {
    backgroundColor: '#1f2937',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    transition: 'width 0.3s',
    position: 'fixed',
    height: '100vh',
    zIndex: 100,
  },
  logo: {
    padding: '20px',
    fontSize: '20px',
    fontWeight: 'bold',
    borderBottom: '1px solid #374151',
    textAlign: 'center',
  },
  nav: {
    flex: 1,
    padding: '10px 0',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    color: 'white',
    textDecoration: 'none',
    transition: 'background-color 0.2s',
    margin: '4px 8px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  navIcon: {
    fontSize: '18px',
    marginRight: '12px',
  },
  navLabel: {
    fontSize: '14px',
  },
  collapseBtn: {
    padding: '15px',
    backgroundColor: '#374151',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
  },
  main: {
    flex: 1,
    marginLeft: '260px',
    transition: 'margin-left 0.3s',
  },
  header: {
    backgroundColor: 'white',
    padding: '20px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111827',
    margin: 0,
  },
  subtitle: {
    color: '#6b7280',
    marginTop: '4px',
  },
  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  langSelect: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  content: {
    padding: '30px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  loading: {
    fontSize: '18px',
    color: '#6b7280',
  },
};
