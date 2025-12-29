'use client';

import { useState, useEffect } from 'react';

const translations = {
  en: {
    documents: 'Documents',
    title: 'My Documents',
    description: 'Upload and manage your legal documents',
    uploadDocument: 'Upload Document',
    search: 'Search documents...',
    filterByStatus: 'Filter by Status',
    allStatus: 'All Status',
    ready: 'Ready',
    processing: 'Processing',
    pending: 'Pending',
    error: 'Error',
    fileName: 'File Name',
    type: 'Type',
    size: 'Size',
    status: 'Status',
    uploaded: 'Uploaded',
    actions: 'Actions',
    view: 'View',
    download: 'Download',
    delete: 'Delete',
    noDocuments: 'No documents found',
    uploadNew: 'Upload New Document',
    dragDrop: 'Drag and drop files here, or click to select',
    supportedFormats: 'Supported formats: PDF, DOC, DOCX, TXT (Max 50MB)',
    cancel: 'Cancel',
    upload: 'Upload',
    loading: 'Loading documents...',
    confirmDelete: 'Are you sure you want to delete this document?',
    documentDeleted: 'Document deleted successfully',
    uploadSuccess: 'Document uploaded successfully',
  },
  hi: {
    documents: 'दस्तावेज़',
    title: 'मेरे दस्तावेज़',
    description: 'अपने कानूनी दस्तावेज़ अपलोड और प्रबंधित करें',
    uploadDocument: 'दस्तावेज़ अपलोड करें',
    search: 'दस्तावेज़ खोजें...',
    filterByStatus: 'स्थिति के अनुसार फ़िल्टर करें',
    allStatus: 'सभी स्थितियाँ',
    ready: 'तैयार',
    processing: 'प्रोसेसिंग',
    pending: 'लंबित',
    error: 'त्रुटि',
    fileName: 'फ़ाइल का नाम',
    type: 'प्रकार',
    size: 'आकार',
    status: 'स्थिति',
    uploaded: 'अपलोड किया गया',
    actions: 'क्रियाएं',
    view: 'देखें',
    download: 'डाउनलोड',
    delete: 'हटाएं',
    noDocuments: 'कोई दस्तावेज़ नहीं मिला',
    uploadNew: 'नया दस्तावेज़ अपलोड करें',
    dragDrop: 'फ़ाइलें यहाँ खींचें और छोड़ें, या चुनने के लिए क्लिक करें',
    supportedFormats: 'समर्थित प्रारूप: PDF, DOC, DOCX, TXT (अधिकतम 50MB)',
    cancel: 'रद्द करें',
    upload: 'अपलोड',
    loading: 'दस्तावेज़ लोड हो रहे हैं...',
    confirmDelete: 'क्या आप वाकई इस दस्तावेज़ को हटाना चाहते हैं?',
    documentDeleted: 'दस्तावेज़ सफलतापूर्वक हटा दिया गया',
    uploadSuccess: 'दस्तावेज़ सफलतापूर्वक अपलोड किया गया',
  },
  ta: {
    documents: 'ஆவணங்கள்',
    title: 'என்னுடைய ஆவணங்கள்',
    description: 'உங்கள் சட்ட ஆவணங்களை பதிவேற்று மற்றும் நிர்வகிக்கவும்',
    uploadDocument: 'ஆவணம் பதிவேற்று',
    search: 'ஆவணங்களைத் தேடு...',
    filterByStatus: 'நிலையை வாரியாக வடிகட்டு',
    allStatus: 'எல்லா நிலைகளும்',
    ready: 'தயார்',
    processing: 'செயலாக்கம்',
    pending: 'நிலுவையில்',
    error: 'பிழை',
    fileName: 'கோப்பின் பெயர்',
    type: 'வகை',
    size: 'அளவு',
    status: 'நிலை',
    uploaded: 'பதிவேற்றப்பட்டது',
    actions: 'செயல்கள்',
    view: 'காண்க',
    download: 'பதிவிறக்கு',
    delete: 'நீக்கு',
    noDocuments: 'ஆவணம் இல்லை',
    uploadNew: 'புதிய ஆவணம் பதிவேற்று',
    dragDrop: 'கோப்புகளை இங்கே இழுத்து விடவும் அல்லது தேர்ந்தெடுக்க கிளிக் செய்யவும்',
    supportedFormats: 'ஆதரிக்கப்படும் வடிவங்கள்: PDF, DOC, DOCX, TXT (அதிகபட்சம் 50MB)',
    cancel: 'ரத்து செய்',
    upload: 'பதிவேற்று',
    loading: 'ஆவணங்கள் ஏற்றப்படுகிறது...',
    confirmDelete: 'இந்த ஆவணத்தை நிச்சயமாக நீக்க விரும்புகிறீர்களா?',
    documentDeleted: 'ஆவணம் வெற்றிகரமாக நீக்கப்பட்டது',
    uploadSuccess: 'ஆவணம் வெற்றிகரமாக பதிவேற்றப்பட்டது',
  },
};

export default function DocumentsPage() {
  const [language, setLanguage] = useState('en');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  
  const t = translations[language] || translations.en;

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      // Mock data for demonstration
      setDocuments([
        { id: '1', fileName: 'legal_notice.pdf', fileType: 'pdf', fileSize: 2621440, status: 'READY', description: 'Legal notice for property dispute', createdAt: '2024-01-19T10:30:00Z' },
        { id: '2', fileName: 'court_order.docx', fileType: 'docx', fileSize: 1843200, status: 'PROCESSING', description: 'Court order copy', createdAt: '2024-01-18T14:20:00Z' },
        { id: '3', fileName: 'contract_agreement.pdf', fileType: 'pdf', fileSize: 3145728, status: 'READY', description: 'Contract agreement', createdAt: '2024-01-17T09:15:00Z' },
        { id: '4', fileName: 'witness_statement.txt', fileType: 'txt', fileSize: 8192, status: 'PENDING', description: 'Witness statement', createdAt: '2024-01-16T16:45:00Z' },
        { id: '5', fileName: 'invalid_file.doc', fileType: 'doc', fileSize: 5242880, status: 'ERROR', description: 'Corrupted file', createdAt: '2024-01-15T11:00:00Z' },
      ]);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getStatusColor = (status) => {
    const colors = {
      READY: { bg: '#d1fae5', text: '#059669' },
      PROCESSING: { bg: '#fef3c7', text: '#d97706' },
      PENDING: { bg: '#dbeafe', text: '#1d4ed8' },
      ERROR: { bg: '#fee2e2', text: '#dc2626' },
    };
    return colors[status] || { bg: '#f3f4f6', text: '#6b7280' };
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle file drop
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
          <h1 style={styles.title}>{t.documents}</h1>
          <p style={styles.subtitle}>{t.description}</p>
        </div>
        
        <button style={styles.uploadBtn} onClick={() => setShowUploadModal(true)}>
          📤 {t.uploadDocument}
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
          <option value="READY">{t.ready}</option>
          <option value="PROCESSING">{t.processing}</option>
          <option value="PENDING">{t.pending}</option>
          <option value="ERROR">{t.error}</option>
        </select>
      </div>

      {/* Documents Grid */}
      <div style={styles.documentsGrid}>
        {documents.length === 0 ? (
          <div style={styles.noDocuments}>
            <p style={styles.noDocumentsText}>{t.noDocuments}</p>
            <button style={styles.uploadEmptyBtn} onClick={() => setShowUploadModal(true)}>
              📤 {t.uploadNew}
            </button>
          </div>
        ) : (
          documents.map((doc) => {
            const statusColor = getStatusColor(doc.status);
            return (
              <div key={doc.id} style={styles.documentCard}>
                <div style={styles.documentIcon}>📄</div>
                <div style={styles.documentInfo}>
                  <h3 style={styles.documentName}>{doc.fileName}</h3>
                  <p style={styles.documentMeta}>
                    {formatFileSize(doc.fileSize)} • {doc.fileType.toUpperCase()}
                  </p>
                  <p style={styles.documentDesc}>{doc.description}</p>
                </div>
                <div style={styles.documentFooter}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: statusColor.bg,
                    color: statusColor.text,
                  }}>
                    {doc.status}
                  </span>
                  <div style={styles.documentActions}>
                    <button style={styles.actionBtn} title={t.view}>👁️</button>
                    <button style={styles.actionBtn} title={t.download}>📥</button>
                    <button style={styles.actionBtn} title={t.delete}>🗑️</button>
                  </div>
                </div>
                <p style={styles.uploadDate}>
                  {new Date(doc.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div style={styles.modalOverlay} onClick={() => setShowUploadModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{t.uploadNew}</h3>
              <button style={styles.modalClose} onClick={() => setShowUploadModal(false)}>
                ×
              </button>
            </div>
            
            <div style={styles.modalContent}>
              <div
                style={{
                  ...styles.dropZone,
                  borderColor: dragActive ? '#3b82f6' : '#d1d5db',
                  backgroundColor: dragActive ? '#eff6ff' : '#f9fafb',
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <span style={styles.dropIcon}>📁</span>
                <p style={styles.dropText}>{t.dragDrop}</p>
                <p style={styles.dropSubtext}>{t.supportedFormats}</p>
              </div>
              
              <div style={styles.modalActions}>
                <button style={styles.modalCancelBtn} onClick={() => setShowUploadModal(false)}>
                  {t.cancel}
                </button>
                <button style={styles.modalUploadBtn}>
                  📤 {t.upload}
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
  uploadBtn: {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
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
  documentsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  documentCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
  },
  documentIcon: {
    fontSize: '48px',
    marginBottom: '15px',
  },
  documentInfo: {
    marginBottom: '15px',
  },
  documentName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '5px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  documentMeta: {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '8px',
  },
  documentDesc: {
    fontSize: '14px',
    color: '#374151',
    margin: 0,
  },
  documentFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  documentActions: {
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
    transition: 'background-color 0.2s',
  },
  uploadDate: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0,
  },
  noDocuments: {
    gridColumn: '1 / -1',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '60px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  noDocumentsText: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '20px',
  },
  uploadEmptyBtn: {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
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
  dropZone: {
    border: '2px dashed',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  dropIcon: {
    fontSize: '48px',
    marginBottom: '15px',
  },
  dropText: {
    fontSize: '14px',
    color: '#374151',
    marginBottom: '8px',
  },
  dropSubtext: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0,
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
  modalUploadBtn: {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};
