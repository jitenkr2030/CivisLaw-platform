'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const translations = {
  en: {
    dashboard: 'Dashboard',
    documents: 'Documents',
    statements: 'Statements',
    consent: 'Consent Management',
    activity: 'Activity Log',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    welcome: 'Welcome back',
    quickActions: 'Quick Actions',
    uploadDocument: 'Upload Document',
    recordStatement: 'Record Statement',
    viewDocuments: 'View Documents',
    recentDocuments: 'Recent Documents',
    recentStatements: 'Recent Statements',
    noDocuments: 'No documents yet',
    noStatements: 'No statements yet',
    loading: 'Loading...',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    documents: 'दस्तावेज़',
    statements: 'बयान',
    consent: 'सहमति प्रबंधन',
    activity: 'गतिविधि लॉग',
    profile: 'प्रोफ़ाइल',
    settings: 'सेटिंग्स',
    logout: 'लॉगआउट',
    welcome: 'वापसी पर स्वागत है',
    quickActions: 'त्वरित कार्रवाई',
    uploadDocument: 'दस्तावेज़ अपलोड करें',
    recordStatement: 'बयान रिकॉर्ड करें',
    viewDocuments: 'दस्तावेज़ देखें',
    recentDocuments: 'हाल के दस्तावेज़',
    recentStatements: 'हाल के बयान',
    noDocuments: 'अभी तक कोई दस्तावेज़ नहीं',
    noStatements: 'अभी तक कोई बयान नहीं',
    loading: 'लोड हो रहा है...',
  },
  ta: {
    dashboard: 'டாஷ்போர்டு',
    documents: 'ஆவணங்கள்',
    statements: 'அறிக்கைகள்',
    consent: 'சம்மத நிர்வாகம்',
    activity: 'நடவடிக்கை பதிவு',
    profile: 'சுயவிவரம்',
    settings: 'அமைப்புகள்',
    logout: 'வெளியேறு',
    welcome: 'மீண்டும் வருகிறீர்கள்',
    quickActions: 'விரைந்த நடவடிக்கைகள்',
    uploadDocument: 'ஆவணம் பதிவேற்று',
    recordStatement: 'அறிக்கை பதிவு செய்',
    viewDocuments: 'ஆவணங்களைக் காண்க',
    recentDocuments: 'அண்மை ஆவணங்கள்',
    recentStatements: 'அண்மை அறிக்கைகள்',
    noDocuments: 'ஆவணம் இல்லை',
    noStatements: 'அறிக்கை இல்லை',
    loading: 'ஏற்றப்படுகிறது...',
  },
};

export default function UserLayout({ children }) {
  const router = useRouter();
  const [language, setLanguage] = useState('en');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  
  const t = translations[language] || translations.en;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/profile');
        if (!response.ok) {
          router.push('/login');
          return;
        }
        const userData = await response.json();
        setUser(userData.user);
      } catch (error) {
        router.push('/login');
      }
    };
    
    checkAuth();
    
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
  }, [router]);

  const menuItems = [
    { id: 'dashboard', icon: '🏠', label: t.dashboard, href: '/dashboard' },
    { id: 'documents', icon: '📄', label: t.documents, href: '/documents' },
    { id: 'statements', icon: '🎤', label: t.statements, href: '/statements' },
    { id: 'consent', icon: '✅', label: t.consent, href: '/consent' },
    { id: 'activity', icon: '📋', label: t.activity, href: '/activity' },
    { id: 'profile', icon: '👤', label: t.profile, href: '/profile' },
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
        <div style={styles.loading}>{t.loading}</div>
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
          {collapsed ? 'CL' : 'CivisLaw'}
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
            <h1 style={styles.pageTitle}>
              {currentPage === 'dashboard' ? t.dashboard :
               currentPage === 'documents' ? t.documents :
               currentPage === 'statements' ? t.statements :
               currentPage === 'consent' ? t.consent :
               currentPage === 'activity' ? t.activity :
               currentPage === 'profile' ? t.profile : t.dashboard}
            </h1>
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
