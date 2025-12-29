'use client';

import { useState, useEffect } from 'react';

const translations = {
  en: {
    analytics: 'Analytics Dashboard',
    overview: 'Platform Overview',
    userGrowth: 'User Growth',
    documentActivity: 'Document Activity',
    languageDistribution: 'Language Distribution',
    registrationTrend: 'Registration Trend',
    dailyActiveUsers: 'Daily Active Users',
    documentsUploaded: 'Documents Uploaded',
    statementsRecorded: 'Statements Recorded',
    translations: 'Translations Generated',
    topLanguages: 'Top Languages',
    engagementMetrics: 'Engagement Metrics',
    avgSessionDuration: 'Avg. Session Duration',
    documentsPerUser: 'Documents per User',
    statementsPerUser: 'Statements per User',
    conversionRate: 'Verification Rate',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    allTime: 'All Time',
    exportData: 'Export Data',
    refresh: 'Refresh',
    users: 'Users',
    documents: 'Documents',
    statements: 'Statements',
    noData: 'No data available',
  },
  hi: {
    analytics: 'विश्लेषण डैशबोर्ड',
    overview: 'प्लेटफ़ॉर्म अवलोकन',
    userGrowth: 'उपयोगकर्ता वृद्धि',
    documentActivity: 'दस्तावेज़ गतिविधि',
    languageDistribution: 'भाषा वितरण',
    registrationTrend: 'पंजीकरण प्रवृत्ति',
    dailyActiveUsers: 'दैनिक सक्रिय उपयोगकर्ता',
    documentsUploaded: 'अपलोड किए गए दस्तावेज़',
    statementsRecorded: 'रिकॉर्ड किए गए बयान',
    translations: 'उत्पादित अनुवाद',
    topLanguages: 'शीर्ष भाषाएं',
    engagementMetrics: 'सहभागिता मेट्रिक्स',
    avgSessionDuration: 'औसत सत्र अवधि',
    documentsPerUser: 'प्रति उपयोगकर्ता दस्तावेज़',
    statementsPerUser: 'प्रति उपयोगकर्ता बयान',
    conversionRate: 'सत्यापन दर',
    thisWeek: 'इस सप्ताह',
    thisMonth: 'इस महीने',
    allTime: 'सभी समय',
    exportData: 'डेटा निर्यात करें',
    refresh: 'रिफ्रेश',
    users: 'उपयोगकर्ता',
    documents: 'दस्तावेज़',
    statements: 'बयान',
    noData: 'कोई डेटा उपलब्ध नहीं',
  },
  ta: {
    analytics: 'பகுப்பாய்வு டாஷ்போர்டு',
    overview: 'தள கண்ணோட்டம்',
    userGrowth: 'பயனர் வளர்ச்சி',
    documentActivity: 'ஆவண நடவடிக்கை',
    languageDistribution: 'மொழி விநியோகம்',
    registrationTrend: 'பதிவு போக்கு',
    dailyActiveUsers: 'தினசரி செயல் பயனர்கள்',
    documentsUploaded: 'பதிவேற்றப்பட்ட ஆவணங்கள்',
    statementsRecorded: 'பதிவு செய்யப்பட்ட அறிக்கைகள்',
    translations: 'உருவாக்கப்பட்ட மொழிபெயர்ப்புகள்',
    topLanguages: 'முதன்மை மொழிகள்',
    engagementMetrics: 'ஈடுபாடு அளவீடுகள்',
    avgSessionDuration: 'சராசரி அமர்வு நேரம்',
    documentsPerUser: 'பயனர்க்கு ஆவணங்கள்',
    statementsPerUser: 'பயனர்க்கு அறிக்கைகள்',
    conversionRate: 'மாற்றும் விகிதம்',
    thisWeek: 'இந்த வாரம்',
    thisMonth: 'இந்த மாதம்',
    allTime: 'எல்லா நேரமும்',
    exportData: 'தரவு ஏற்றுமதி',
    refresh: 'புதுப்பிப்பு',
    users: 'பயனர்கள்',
    documents: 'ஆவணங்கள்',
    statements: 'அறிக்கைகள்',
    noData: 'தரவு இல்லை',
  },
};

export default function AdminAnalyticsPage() {
  const [language, setLanguage] = useState('en');
  const [timeRange, setTimeRange] = useState('thisMonth');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 156,
    totalDocuments: 89,
    totalStatements: 23,
    totalTranslations: 45,
    dailyActiveUsers: [],
    documentsUploaded: [],
    languageDistribution: [
      { language: 'English', count: 89, percentage: 57 },
      { language: 'Hindi', count: 34, percentage: 22 },
      { language: 'Tamil', count: 21, percentage: 13 },
      { language: 'Bengali', count: 8, percentage: 5 },
      { language: 'Marathi', count: 4, percentage: 3 },
    ],
    engagementMetrics: {
      avgSessionDuration: '12 min',
      documentsPerUser: 0.57,
      statementsPerUser: 0.15,
      verificationRate: 78,
    },
  });
  
  const t = translations[language] || translations.en;

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = () => {
    // Generate mock chart data for visualization
    const days = [];
    const users = [];
    const documents = [];
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      users.push(Math.floor(Math.random() * 20) + 5);
      documents.push(Math.floor(Math.random() * 10) + 2);
    }
    
    return { days, users, documents };
  };

  const chartData = getChartData();

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>{t.analytics}</h1>
          <p style={styles.subtitle}>{t.overview}</p>
        </div>
        
        <div style={styles.headerActions}>
          <div style={styles.timeFilter}>
            {['thisWeek', 'thisMonth', 'allTime'].map((range) => (
              <button
                key={range}
                style={{
                  ...styles.timeButton,
                  backgroundColor: timeRange === range ? '#3b82f6' : 'white',
                  color: timeRange === range ? 'white' : '#374151',
                }}
                onClick={() => setTimeRange(range)}
              >
                {t[range]}
              </button>
            ))}
          </div>
          
          <button style={styles.exportBtn} onClick={fetchAnalytics}>
            🔄 {t.refresh}
          </button>
          
          <button style={styles.exportBtn}>
            📥 {t.exportData}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>👥</div>
          <div style={styles.summaryContent}>
            <p style={styles.summaryLabel}>{t.users}</p>
            <p style={styles.summaryValue}>{analyticsData.totalUsers}</p>
            <p style={styles.summaryTrend}>↑ 12% from last month</p>
          </div>
        </div>
        
        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>📄</div>
          <div style={styles.summaryContent}>
            <p style={styles.summaryLabel}>{t.documents}</p>
            <p style={styles.summaryValue}>{analyticsData.totalDocuments}</p>
            <p style={styles.summaryTrend}>↑ 8% from last month</p>
          </div>
        </div>
        
        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>🎤</div>
          <div style={styles.summaryContent}>
            <p style={styles.summaryLabel}>{t.statements}</p>
            <p style={styles.summaryValue}>{analyticsData.totalStatements}</p>
            <p style={styles.summaryTrend}>↑ 15% from last month</p>
          </div>
        </div>
        
        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>🌐</div>
          <div style={styles.summaryContent}>
            <p style={styles.summaryLabel}>Translations</p>
            <p style={styles.summaryValue}>{analyticsData.totalTranslations}</p>
            <p style={styles.summaryTrend}>↑ 25% from last month</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={styles.chartsRow}>
        {/* User Growth Chart */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>{t.userGrowth}</h3>
          <div style={styles.chartContainer}>
            <div style={styles.barChart}>
              {chartData.users.slice(-14).map((value, index) => (
                <div key={index} style={styles.barContainer}>
                  <div
                    style={{
                      ...styles.bar,
                      height: `${(value / 25) * 100}%`,
                      backgroundColor: '#3b82f6',
                    }}
                  ></div>
                  <span style={styles.barLabel}>{index % 2 === 0 ? chartData.days.slice(-14)[index] : ''}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Document Activity Chart */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>{t.documentActivity}</h3>
          <div style={styles.chartContainer}>
            <div style={styles.barChart}>
              {chartData.documents.slice(-14).map((value, index) => (
                <div key={index} style={styles.barContainer}>
                  <div
                    style={{
                      ...styles.bar,
                      height: `${(value / 15) * 100}%`,
                      backgroundColor: '#10b981',
                    }}
                  ></div>
                  <span style={styles.barLabel}>{index % 2 === 0 ? chartData.days.slice(-14)[index] : ''}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={styles.bottomRow}>
        {/* Language Distribution */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>{t.topLanguages}</h3>
          <div style={styles.languageList}>
            {analyticsData.languageDistribution.map((lang, index) => (
              <div key={index} style={styles.languageItem}>
                <div style={styles.languageHeader}>
                  <span style={styles.languageName}>{lang.language}</span>
                  <span style={styles.languageCount}>{lang.count} ({lang.percentage}%)</span>
                </div>
                <div style={styles.languageBarBg}>
                  <div
                    style={{
                      ...styles.languageBarFill,
                      width: `${lang.percentage}%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Metrics */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>{t.engagementMetrics}</h3>
          <div style={styles.metricsGrid}>
            <div style={styles.metricItem}>
              <span style={styles.metricIcon}>⏱️</span>
              <div>
                <p style={styles.metricLabel}>{t.avgSessionDuration}</p>
                <p style={styles.metricValue}>{analyticsData.engagementMetrics.avgSessionDuration}</p>
              </div>
            </div>
            
            <div style={styles.metricItem}>
              <span style={styles.metricIcon}>📄</span>
              <div>
                <p style={styles.metricLabel}>{t.documentsPerUser}</p>
                <p style={styles.metricValue}>{analyticsData.engagementMetrics.documentsPerUser}</p>
              </div>
            </div>
            
            <div style={styles.metricItem}>
              <span style={styles.metricIcon}>🎤</span>
              <div>
                <p style={styles.metricLabel}>{t.statementsPerUser}</p>
                <p style={styles.metricValue}>{analyticsData.engagementMetrics.statementsPerUser}</p>
              </div>
            </div>
            
            <div style={styles.metricItem}>
              <span style={styles.metricIcon}>✅</span>
              <div>
                <p style={styles.metricLabel}>{t.conversionRate}</p>
                <p style={styles.metricValue}>{analyticsData.engagementMetrics.verificationRate}%</p>
              </div>
            </div>
          </div>
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
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  timeFilter: {
    display: 'flex',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    padding: '4px',
  },
  timeButton: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  exportBtn: {
    padding: '8px 16px',
    backgroundColor: 'white',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '13px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '25px',
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  summaryIcon: {
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
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
  },
  summaryValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#111827',
    margin: '5px 0',
  },
  summaryTrend: {
    fontSize: '12px',
    color: '#10b981',
    fontWeight: '500',
  },
  chartsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px',
    marginBottom: '25px',
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  chartTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '20px',
  },
  chartContainer: {
    height: '200px',
  },
  barChart: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    gap: '8px',
  },
  barContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
  },
  bar: {
    width: '100%',
    borderRadius: '4px 4px 0 0',
    transition: 'height 0.3s',
    minHeight: '4px',
  },
  barLabel: {
    fontSize: '10px',
    color: '#9ca3af',
    marginTop: '5px',
    transform: 'rotate(-45deg)',
    whiteSpace: 'nowrap',
  },
  bottomRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '20px',
  },
  languageList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  languageItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  languageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  languageName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  },
  languageCount: {
    fontSize: '14px',
    color: '#6b7280',
  },
  languageBarBg: {
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  languageBarFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: '4px',
    transition: 'width 0.3s',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
  },
  metricItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  metricIcon: {
    fontSize: '24px',
  },
  metricLabel: {
    fontSize: '12px',
    color: '#6b7280',
    margin: 0,
  },
  metricValue: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    margin: '2px 0 0 0',
  },
};
