'use client';

import { useState, useEffect } from 'react';

const translations = {
  en: {
    announcements: 'Announcements',
    title: 'System Announcements',
    description: 'Manage platform announcements and notifications',
    createAnnouncement: 'Create Announcement',
    editAnnouncement: 'Edit Announcement',
    titleLabel: 'Title',
    messageLabel: 'Message',
    typeLabel: 'Type',
    priorityLabel: 'Priority',
    rolesLabel: 'Target Roles',
    startDateLabel: 'Start Date',
    endDateLabel: 'End Date',
    announcementTitle: 'Announcement Title',
    announcementMessage: 'Announcement Message',
    selectType: 'Select Type',
    selectPriority: 'Select Priority',
    selectRoles: 'Select Target Roles',
    feature: 'Feature',
    maintenance: 'Maintenance',
    security: 'Security',
    general: 'General',
    active: 'Active',
    inactive: 'Inactive',
    view: 'View',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    noAnnouncements: 'No announcements found',
    loading: 'Loading announcements...',
    confirmDelete: 'Are you sure you want to delete this announcement?',
    saved: 'Announcement saved successfully',
    deleted: 'Announcement deleted successfully',
    alwaysVisible: 'Always Visible',
  },
  hi: {
    announcements: 'घोषणाएं',
    title: 'सिस्टम घोषणाएं',
    description: 'प्लेटफ़ॉर्म घोषणाओं और सूचनाओं का प्रबंधन करें',
    createAnnouncement: 'घोषणा बनाएं',
    editAnnouncement: 'घोषणा संपादित करें',
    titleLabel: 'शीर्षक',
    messageLabel: 'संदेश',
    typeLabel: 'प्रकार',
    priorityLabel: 'प्राथमिकता',
    rolesLabel: 'लक्षित भूमिकाएं',
    startDateLabel: 'प्रारंभ तिथि',
    endDateLabel: 'समाप्ति तिथि',
    announcementTitle: 'घोषणा शीर्षक',
    announcementMessage: 'घोषणा संदेश',
    selectType: 'प्रकार चुनें',
    selectPriority: 'प्राथमिकता चुनें',
    selectRoles: 'लक्षित भूमिकाएं चुनें',
    feature: 'फ़ीचर',
    maintenance: 'रखरखाव',
    security: 'सुरक्षा',
    general: 'सामान्य',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    view: 'देखें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    noAnnouncements: 'कोई घोषणा नहीं मिली',
    loading: 'घोषणाएं लोड हो रही हैं...',
    confirmDelete: 'क्या आप वाकई इस घोषणा को हटाना चाहते हैं?',
    saved: 'घोषणा सफलतापूर्वक सहेजी गई',
    deleted: 'घोषणा सफलतापूर्वक हटाई गई',
    alwaysVisible: 'हमेशा दिखाई देने वाला',
  },
  ta: {
    announcements: 'அறிவிப்புகள்',
    title: 'கணினி அறிவிப்புகள்',
    description: 'தள அறிவிப்புகள் மற்றும் அறிவிப்புகளை நிர்வகிக்கவும்',
    createAnnouncement: 'அறிவிப்பு உருவாக்கு',
    editAnnouncement: 'அறிவிப்பு திருத்து',
    titleLabel: 'தலைப்பு',
    messageLabel: 'செய்தி',
    typeLabel: 'வகை',
    priorityLabel: 'முன்னுரிமை',
    rolesLabel: 'இலக்கு பாத்திரங்கள்',
    startDateLabel: 'தொடக்க தேதி',
    endDateLabel: 'முடிவு தேதி',
    announcementTitle: 'அறிவிப்பு தலைப்பு',
    announcementMessage: 'அறிவிப்பு செய்தி',
    selectType: 'வகையைத் தேர்ந்தெடு',
    selectPriority: 'முன்னுரிமையைத் தேர்ந்தெடு',
    selectRoles: 'இலக்கு பாத்திரங்களைத் தேர்ந்தெடு',
    feature: 'அம்சம்',
    maintenance: 'பராமரிப்பு',
    security: 'பாதுகாப்பு',
    general: 'பொதுவான',
    active: 'செயலில்',
    inactive: 'செயலற்ற',
    view: 'காண்க',
    edit: 'திருத்து',
    delete: 'நீக்கு',
    save: 'சேமி',
    cancel: 'ரத்து செய்',
    noAnnouncements: 'அறிவிப்பு இல்லை',
    loading: 'அறிவிப்புகள் ஏற்றப்படுகிறது...',
    confirmDelete: 'இந்த அறிவிப்பை நிச்சயமாக நீக்க விரும்புகிறீர்களா?',
    saved: 'அறிவிப்பு வெற்றிகரமாக சேமிக்கப்பட்டது',
    deleted: 'அறிவிப்பு வெற்றிகரமாக நீக்கப்பட்டது',
    alwaysVisible: 'எப்பொழுதும் தெரியும்',
  },
};

export default function AdminAnnouncementsPage() {
  const [language, setLanguage] = useState('en');
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'GENERAL',
    priority: 0,
    targetRoles: ['CITIZEN'],
    startsAt: new Date().toISOString().split('T')[0],
    expiresAt: '',
    isActive: true,
  });
  
  const t = translations[language] || translations.en;

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration
      const mockAnnouncements = [
        {
          id: '1',
          title: 'Welcome to CivisLaw',
          message: 'Welcome to CivisLaw - Your citizen-first judicial understanding platform. Start exploring legal documents, recording statements, and connecting with legal aid organizations.',
          type: 'FEATURE',
          priority: 1,
          targetRoles: ['CITIZEN', 'VICTIM', 'NGO', 'LEGAL_AID'],
          startsAt: '2024-01-01',
          expiresAt: '',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
        },
        {
          id: '2',
          title: 'Scheduled Maintenance',
          message: 'We will be performing scheduled maintenance on January 25th, 2024, from 2:00 AM to 4:00 AM UTC. During this time, the platform may be temporarily unavailable.',
          type: 'MAINTENANCE',
          priority: 2,
          targetRoles: ['CITIZEN', 'VICTIM', 'NGO', 'LEGAL_AID', 'ADMIN'],
          startsAt: '2024-01-20',
          expiresAt: '2024-01-26',
          isActive: true,
          createdAt: '2024-01-18T00:00:00Z',
        },
        {
          id: '3',
          title: 'Security Update',
          message: 'We have recently updated our security protocols. Please ensure you are using a strong password and enable two-factor authentication for enhanced security.',
          type: 'SECURITY',
          priority: 3,
          targetRoles: ['CITIZEN', 'VICTIM', 'NGO', 'LEGAL_AID'],
          startsAt: '2024-01-15',
          expiresAt: '2024-02-15',
          isActive: true,
          createdAt: '2024-01-15T00:00:00Z',
        },
      ];
      setAnnouncements(mockAnnouncements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (editingAnnouncement) {
        // Update existing announcement
        setAnnouncements(announcements.map(a =>
          a.id === editingAnnouncement.id ? { ...a, ...formData } : a
        ));
      } else {
        // Create new announcement
        const newAnnouncement = {
          id: Date.now().toString(),
          ...formData,
          createdAt: new Date().toISOString(),
        };
        setAnnouncements([newAnnouncement, ...announcements]);
      }
      
      setShowModal(false);
      resetForm();
      alert(t.saved);
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Error saving announcement');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm(t.confirmDelete)) return;
    
    try {
      setAnnouncements(announcements.filter(a => a.id !== id));
      alert(t.deleted);
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'GENERAL',
      priority: 0,
      targetRoles: ['CITIZEN'],
      startsAt: new Date().toISOString().split('T')[0],
      expiresAt: '',
      isActive: true,
    });
    setEditingAnnouncement(null);
  };

  const openEditModal = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      message: announcement.message,
      type: announcement.type,
      priority: announcement.priority,
      targetRoles: announcement.targetRoles,
      startsAt: announcement.startsAt,
      expiresAt: announcement.expiresAt || '',
      isActive: announcement.isActive,
    });
    setShowModal(true);
  };

  const getTypeColor = (type) => {
    const colors = {
      FEATURE: '#8b5cf6',
      MAINTENANCE: '#f59e0b',
      SECURITY: '#ef4444',
      GENERAL: '#3b82f6',
    };
    return colors[type] || '#3b82f6';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return t.alwaysVisible;
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
          <h1 style={styles.title}>{t.announcements}</h1>
          <p style={styles.subtitle}>{t.description}</p>
        </div>
        
        <button
          style={styles.createBtn}
          onClick={() => setShowModal(true)}
        >
          + {t.createAnnouncement}
        </button>
      </div>

      {/* Announcements Grid */}
      <div style={styles.grid}>
        {announcements.length === 0 ? (
          <div style={styles.noAnnouncements}>{t.noAnnouncements}</div>
        ) : (
          announcements.map((announcement) => (
            <div key={announcement.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div style={styles.cardType}>
                  <span
                    style={{
                      ...styles.typeBadge,
                      backgroundColor: getTypeColor(announcement.type),
                    }}
                  >
                    {announcement.type}
                  </span>
                  {announcement.priority > 1 && (
                    <span style={styles.priorityBadge}>
                      ⭐ Priority {announcement.priority}
                    </span>
                  )}
                </div>
                <div style={styles.cardActions}>
                  <button
                    style={styles.actionBtn}
                    onClick={() => setSelectedAnnouncement(announcement)}
                  >
                    👁️
                  </button>
                  <button
                    style={styles.actionBtn}
                    onClick={() => openEditModal(announcement)}
                  >
                    ✏️
                  </button>
                  <button
                    style={{...styles.actionBtn, color: '#ef4444'}}
                    onClick={() => handleDelete(announcement.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <h3 style={styles.cardTitle}>{announcement.title}</h3>
              <p style={styles.cardMessage}>{announcement.message}</p>
              
              <div style={styles.cardFooter}>
                <div style={styles.cardMeta}>
                  <span style={styles.metaItem}>
                    📅 {formatDate(announcement.startsAt)} - {formatDate(announcement.expiresAt)}
                  </span>
                  <span style={styles.metaItem}>
                    👥 {announcement.targetRoles.join(', ')}
                  </span>
                </div>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: announcement.isActive ? '#d1fae5' : '#f3f4f6',
                  color: announcement.isActive ? '#059669' : '#6b7280',
                }}>
                  {announcement.isActive ? t.active : t.inactive}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {editingAnnouncement ? t.editAnnouncement : t.createAnnouncement}
              </h3>
              <button
                style={styles.modalClose}
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                ×
              </button>
            </div>
            
            <div style={styles.modalContent}>
              <div style={styles.formGroup}>
                <label style={styles.label}>{t.titleLabel}</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder={t.announcementTitle}
                  style={styles.input}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>{t.messageLabel}</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder={t.announcementMessage}
                  style={{...styles.input, minHeight: '100px', resize: 'vertical'}}
                />
              </div>
              
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>{t.typeLabel}</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    style={styles.select}
                  >
                    <option value="GENERAL">{t.general}</option>
                    <option value="FEATURE">{t.feature}</option>
                    <option value="MAINTENANCE">{t.maintenance}</option>
                    <option value="SECURITY">{t.security}</option>
                  </select>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>{t.priorityLabel}</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                    style={styles.select}
                  >
                    <option value="0">Normal</option>
                    <option value="1">Important</option>
                    <option value="2">Urgent</option>
                    <option value="3">Critical</option>
                  </select>
                </div>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>{t.rolesLabel}</label>
                <div style={styles.checkboxGroup}>
                  {['CITIZEN', 'VICTIM', 'NGO', 'LEGAL_AID', 'ADMIN'].map((role) => (
                    <label key={role} style={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={formData.targetRoles.includes(role)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              targetRoles: [...formData.targetRoles, role],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              targetRoles: formData.targetRoles.filter((r) => r !== role),
                            });
                          }
                        }}
                      />
                      {role}
                    </label>
                  ))}
                </div>
              </div>
              
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>{t.startDateLabel}</label>
                  <input
                    type="date"
                    value={formData.startsAt}
                    onChange={(e) => setFormData({...formData, startsAt: e.target.value})}
                    style={styles.input}
                  />
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label}>{t.endDateLabel}</label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => setFormData({...formData, expiresAt: e.target.value})}
                    style={styles.input}
                  />
                </div>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  />
                  Active
                </label>
              </div>
            </div>
            
            <div style={styles.modalFooter}>
              <button
                style={styles.modalCancelBtn}
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                {t.cancel}
              </button>
              <button style={styles.modalSaveBtn} onClick={handleSave}>
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedAnnouncement && (
        <div style={styles.modalOverlay} onClick={() => setSelectedAnnouncement(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{selectedAnnouncement.title}</h3>
              <button
                style={styles.modalClose}
                onClick={() => setSelectedAnnouncement(null)}
              >
                ×
              </button>
            </div>
            
            <div style={styles.modalContent}>
              <span
                style={{
                  ...styles.typeBadge,
                  backgroundColor: getTypeColor(selectedAnnouncement.type),
                  marginBottom: '15px',
                  display: 'inline-block',
                }}
              >
                {selectedAnnouncement.type}
              </span>
              
              <p style={styles.viewMessage}>{selectedAnnouncement.message}</p>
              
              <div style={styles.viewMeta}>
                <p><strong>Start Date:</strong> {formatDate(selectedAnnouncement.startsAt)}</p>
                <p><strong>End Date:</strong> {formatDate(selectedAnnouncement.expiresAt)}</p>
                <p><strong>Target Roles:</strong> {selectedAnnouncement.targetRoles.join(', ')}</p>
                <p><strong>Status:</strong> {selectedAnnouncement.isActive ? t.active : t.inactive}</p>
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
  createBtn: {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  cardType: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  typeBadge: {
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  },
  priorityBadge: {
    fontSize: '12px',
    color: '#f59e0b',
  },
  cardActions: {
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
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '10px',
  },
  cardMessage: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '15px',
    lineHeight: '1.5',
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '15px',
    borderTop: '1px solid #e5e7eb',
  },
  cardMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  metaItem: {
    fontSize: '12px',
    color: '#9ca3af',
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  noAnnouncements: {
    gridColumn: '1 / -1',
    padding: '60px',
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
    padding: '20px',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    borderRadius: '12px 12px 0 0',
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
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    padding: '20px',
    borderTop: '1px solid #e5e7eb',
    position: 'sticky',
    bottom: 0,
    backgroundColor: 'white',
    borderRadius: '0 0 12px 12px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
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
  select: {
    width: '100%',
    padding: '10px 15px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  checkboxGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
  },
  checkbox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#374151',
    cursor: 'pointer',
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
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  viewMessage: {
    fontSize: '14px',
    color: '#374151',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  viewMeta: {
    fontSize: '14px',
    color: '#6b7280',
  },
};
