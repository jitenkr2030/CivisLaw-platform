'use client';

import { useState, useEffect } from 'react';

const translations = {
  en: {
    statements: 'Statements',
    title: 'Victim Statements',
    description: 'Record and manage your victim statements',
    recordStatement: 'Record Statement',
    search: 'Search statements...',
    filterByStatus: 'Filter by Status',
    allStatus: 'All Status',
    draft: 'Draft',
    review: 'Review',
    final: 'Final',
    shared: 'Shared',
    archived: 'Archived',
    titleLabel: 'Title',
    descriptionLabel: 'Description',
    duration: 'Duration',
    status: 'Status',
    created: 'Created',
    actions: 'Actions',
    play: 'Play',
    edit: 'Edit',
    delete: 'Delete',
    noStatements: 'No statements found',
    recording: 'Recording',
    stopRecording: 'Stop Recording',
    saveDraft: 'Save as Draft',
    submit: 'Submit for Review',
    cancel: 'Cancel',
    titlePlaceholder: 'Enter statement title',
    descriptionPlaceholder: 'Enter statement description',
    recordingInProgress: 'Recording in progress...',
    recordingComplete: 'Recording complete',
    newStatement: 'New Statement',
    microphonePermission: 'Microphone access required for recording',
    startRecording: 'Start Recording',
    loading: 'Loading statements...',
    confirmDelete: 'Are you sure you want to delete this statement?',
    statementDeleted: 'Statement deleted successfully',
  },
  hi: {
    statements: 'बयान',
    title: 'पीड़ित बयान',
    description: 'अपने पीड़ित बयान रिकॉर्ड और प्रबंधित करें',
    recordStatement: 'बयान रिकॉर्ड करें',
    search: 'बयान खोजें...',
    filterByStatus: 'स्थिति के अनुसार फ़िल्टर करें',
    allStatus: 'सभी स्थितियाँ',
    draft: 'ड्राफ्ट',
    review: 'समीक्षा',
    final: 'अंतिम',
    shared: 'साझा',
    archived: 'संग्रहीत',
    titleLabel: 'शीर्षक',
    descriptionLabel: 'विवरण',
    duration: 'अवधि',
    status: 'स्थिति',
    created: 'बनाया गया',
    actions: 'क्रियाएं',
    play: 'चलाएं',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    noStatements: 'कोई बयान नहीं मिला',
    recording: 'रिकॉर्डिंग',
    stopRecording: 'रिकॉर्डिंग बंद करें',
    saveDraft: 'ड्राफ्ट के रूप में सहेजें',
    submit: 'समीक्षा के लिए सबमिट करें',
    cancel: 'रद्द करें',
    titlePlaceholder: 'बयान शीर्षक दर्ज करें',
    descriptionPlaceholder: 'बयान विवरण दर्ज करें',
    recordingInProgress: 'रिकॉर्डिंग जारी है...',
    recordingComplete: 'रिकॉर्डिंग पूर्ण',
    newStatement: 'नया बयान',
    microphonePermission: 'रिकॉर्डिंग के लिए माइक्रोफ़ोन एक्सेस आवश्यक है',
    startRecording: 'रिकॉर्डिंग शुरू करें',
    loading: 'बयान लोड हो रहे हैं...',
    confirmDelete: 'क्या आप वाकई इस बयान को हटाना चाहते हैं?',
    statementDeleted: 'बयान सफलतापूर्वक हटा दिया गया',
  },
  ta: {
    statements: 'அறிக்கைகள்',
    title: 'பாதிக்கப்பட்டவரின் அறிக்கைகள்',
    description: 'பாதிக்கப்பட்டவரின் அறிக்கையைப் பதிவு செய்து நிர்வகிக்கவும்',
    recordStatement: 'அறிக்கை பதிவு செய்',
    search: 'அறிக்கைகளைத் தேடு...',
    filterByStatus: 'நிலையை வாரியாக வடிகட்டு',
    allStatus: 'எல்லா நிலைகளும்',
    draft: 'வரைவு',
    review: 'மதிப்பாய்வு',
    final: 'இறுதி',
    shared: 'பகிரப்பட்டது',
    archived: 'காப்பகப்படுத்தப்பட்டது',
    titleLabel: 'தலைப்பு',
    descriptionLabel: 'விளக்கம்',
    duration: 'காலம்',
    status: 'நிலை',
    created: 'உருவாக்கப்பட்டது',
    actions: 'செயல்கள்',
    play: 'இயக்கு',
    edit: 'திருத்து',
    delete: 'நீக்கு',
    noStatements: 'அறிக்கை இல்லை',
    recording: 'பதிவு செய்கிறது',
    stopRecording: 'பதிவு நிறுத்து',
    saveDraft: 'வரைவாக சேமி',
    submit: 'மதிப்பாய்விற்கு சமர்ப்பி',
    cancel: 'ரத்து செய்',
    titlePlaceholder: 'அறிக்கை தலைப்பை உள்ளிடவும்',
    descriptionPlaceholder: 'அறிக்கை விளக்கத்தை உள்ளிடவும்',
    recordingInProgress: 'பதிவு செய்யப்படுகிறது...',
    recordingComplete: 'பதிவு முடிந்தது',
    newStatement: 'புதிய அறிக்கை',
    microphonePermission: 'பதிவு செய்ய மைக்ரோஃபோன் அணுகல் தேவை',
    startRecording: 'பதிவு செய்யத் தொடங்கு',
    loading: 'அறிக்கைகள் ஏற்றப்படுகிறது...',
    confirmDelete: 'இந்த அறிக்கையை நிச்சயமாக நீக்க விரும்புகிறீர்களா?',
    statementDeleted: 'அறிக்கை வெற்றிகரமாக நீக்கப்பட்டது',
  },
};

export default function StatementsPage() {
  const [language, setLanguage] = useState('en');
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [newStatement, setNewStatement] = useState({
    title: '',
    description: '',
  });
  
  const t = translations[language] || translations.en;

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
    fetchStatements();
  }, []);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const fetchStatements = async () => {
    try {
      // Mock data for demonstration
      setStatements([
        { id: '1', title: 'Incident Statement', description: 'Detailed description of the incident', audioDuration: 332, status: 'FINAL', audioSize: 5242880, createdAt: '2024-01-19T10:30:00Z' },
        { id: '2', title: 'Witness Testimony', description: 'Eyewitness account of events', audioDuration: 495, status: 'REVIEW', audioSize: 7340032, createdAt: '2024-01-18T14:20:00Z' },
        { id: '3', title: 'Follow-up Statement', description: 'Additional information about the case', audioDuration: 180, status: 'DRAFT', audioSize: 3145728, createdAt: '2024-01-17T09:15:00Z' },
        { id: '4', title: 'Initial Complaint', description: 'First formal complaint submission', audioDuration: 420, status: 'SHARED', audioSize: 6291456, createdAt: '2024-01-16T16:45:00Z' },
      ]);
    } catch (error) {
      console.error('Error fetching statements:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: { bg: '#f3f4f6', text: '#6b7280' },
      REVIEW: { bg: '#fef3c7', text: '#d97706' },
      FINAL: { bg: '#d1fae5', text: '#059669' },
      SHARED: { bg: '#dbeafe', text: '#1d4ed8' },
      ARCHIVED: { bg: '#fee2e2', text: '#dc2626' },
    };
    return colors[status] || { bg: '#f3f4f6', text: '#6b7280' };
  };

  const handleStartRecording = async () => {
    try {
      // Request microphone permission and start recording
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
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
          <h1 style={styles.title}>{t.statements}</h1>
          <p style={styles.subtitle}>{t.description}</p>
        </div>
        
        <button style={styles.recordBtn} onClick={() => setShowRecordModal(true)}>
          🎤 {t.recordStatement}
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
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.select}
        >
          <option value="all">{t.allStatus}</option>
          <option value="DRAFT">{t.draft}</option>
          <option value="REVIEW">{t.review}</option>
          <option value="FINAL">{t.final}</option>
          <option value="SHARED">{t.shared}</option>
          <option value="ARCHIVED">{t.archived}</option>
        </select>
      </div>

      {/* Statements Grid */}
      <div style={styles.statementsGrid}>
        {statements.length === 0 ? (
          <div style={styles.noStatements}>
            <p style={styles.noStatementsText}>{t.noStatements}</p>
            <button style={styles.recordEmptyBtn} onClick={() => setShowRecordModal(true)}>
              🎤 {t.startRecording}
            </button>
          </div>
        ) : (
          statements.map((statement) => {
            const statusColor = getStatusColor(statement.status);
            return (
              <div key={statement.id} style={styles.statementCard}>
                <div style={styles.statementHeader}>
                  <div style={styles.statementIcon}>🎤</div>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: statusColor.bg,
                    color: statusColor.text,
                  }}>
                    {statement.status}
                  </span>
                </div>
                
                <h3 style={styles.statementTitle}>{statement.title}</h3>
                <p style={styles.statementDesc}>{statement.description}</p>
                
                <div style={styles.statementMeta}>
                  <span style={styles.metaItem}>
                    ⏱️ {formatDuration(statement.audioDuration)}
                  </span>
                  <span style={styles.metaItem}>
                    💾 {formatFileSize(statement.audioSize)}
                  </span>
                </div>
                
                <div style={styles.statementFooter}>
                  <span style={styles.createdDate}>
                    {new Date(statement.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <div style={styles.statementActions}>
                    <button style={styles.actionBtn} title={t.play}>▶️</button>
                    <button style={styles.actionBtn} title={t.edit}>✏️</button>
                    <button style={styles.actionBtn} title={t.delete}>🗑️</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Record Modal */}
      {showRecordModal && (
        <div style={styles.modalOverlay} onClick={() => setShowRecordModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{t.newStatement}</h3>
              <button style={styles.modalClose} onClick={() => setShowRecordModal(false)}>
                ×
              </button>
            </div>
            
            <div style={styles.modalContent}>
              <div style={styles.formGroup}>
                <label style={styles.label}>{t.titleLabel}</label>
                <input
                  type="text"
                  placeholder={t.titlePlaceholder}
                  value={newStatement.title}
                  onChange={(e) => setNewStatement({...newStatement, title: e.target.value})}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>{t.descriptionLabel}</label>
                <textarea
                  placeholder={t.descriptionPlaceholder}
                  value={newStatement.description}
                  onChange={(e) => setNewStatement({...newStatement, description: e.target.value})}
                  style={{...styles.input, minHeight: '80px', resize: 'vertical'}}
                />
              </div>
              
              <div style={styles.recordingSection}>
                <div style={{
                  ...styles.recordingArea,
                  borderColor: isRecording ? '#ef4444' : '#d1d5db',
                  backgroundColor: isRecording ? '#fef2f2' : '#f9fafb',
                }}>
                  <div style={styles.recordingIcon}>
                    {isRecording ? '🎙️' : '🎤'}
                  </div>
                  
                  {isRecording ? (
                    <div style={styles.recordingActive}>
                      <p style={styles.recordingText}>{t.recordingInProgress}</p>
                      <p style={styles.recordingTimer}>{formatDuration(recordingTime)}</p>
                      <div style={styles.recordingWave}>🔊🔊🔊</div>
                    </div>
                  ) : (
                    <p style={styles.recordingPlaceholder}>{t.startRecording}</p>
                  )}
                </div>
                
                <div style={styles.recordingControls}>
                  {!isRecording ? (
                    <button style={styles.startRecordBtn} onClick={handleStartRecording}>
                      🎙️ {t.startRecording}
                    </button>
                  ) : (
                    <button style={styles.stopRecordBtn} onClick={handleStopRecording}>
                      ⏹️ {t.stopRecording}
                    </button>
                  )}
                </div>
              </div>
              
              <div style={styles.modalActions}>
                <button style={styles.modalCancelBtn} onClick={() => setShowRecordModal(false)}>
                  {t.cancel}
                </button>
                <button style={styles.modalSaveBtn}>
                  💾 {t.saveDraft}
                </button>
                <button style={styles.modalSubmitBtn}>
                  📤 {t.submit}
                </button>
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
  recordBtn: {
    padding: '10px 20px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
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
  statementsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
  },
  statementCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  statementHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  statementIcon: {
    fontSize: '32px',
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  statementTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px',
  },
  statementDesc: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '15px',
    lineHeight: '1.5',
  },
  statementMeta: {
    display: 'flex',
    gap: '15px',
    marginBottom: '15px',
  },
  metaItem: {
    fontSize: '13px',
    color: '#9ca3af',
  },
  statementFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '15px',
    borderTop: '1px solid #e5e7eb',
  },
  createdDate: {
    fontSize: '12px',
    color: '#9ca3af',
  },
  statementActions: {
    display: 'flex',
    gap: '8px',
  },
  actionBtn: {
    padding: '6px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    borderRadius: '4px',
  },
  noStatements: {
    gridColumn: '1 / -1',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '60px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  noStatementsText: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '20px',
  },
  recordEmptyBtn: {
    padding: '10px 20px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
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
    maxWidth: '550px',
    width: '90%',
    maxHeight: '90vh',
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
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '10px 15px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
  },
  recordingSection: {
    marginTop: '20px',
  },
  recordingArea: {
    border: '2px dashed',
    borderRadius: '12px',
    padding: '30px',
    textAlign: 'center',
    marginBottom: '15px',
  },
  recordingIcon: {
    fontSize: '48px',
    marginBottom: '15px',
  },
  recordingActive: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  recordingText: {
    fontSize: '14px',
    color: '#ef4444',
    fontWeight: '500',
    marginBottom: '5px',
  },
  recordingTimer: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '10px',
  },
  recordingWave: {
    fontSize: '24px',
    letterSpacing: '10px',
  },
  recordingPlaceholder: {
    fontSize: '14px',
    color: '#6b7280',
  },
  recordingControls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
  },
  startRecordBtn: {
    padding: '12px 24px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  stopRecordBtn: {
    padding: '12px 24px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
  },
  modalCancelBtn: {
    padding: '10px 20px',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  modalSaveBtn: {
    padding: '10px 20px',
    backgroundColor: '#6b7280',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  modalSubmitBtn: {
    padding: '10px 20px',
    backgroundColor: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};
