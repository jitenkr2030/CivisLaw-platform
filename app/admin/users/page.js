'use client';

import { useState, useEffect } from 'react';

const translations = {
  en: {
    users: 'User Management',
    search: 'Search users...',
    filterByRole: 'Filter by Role',
    allRoles: 'All Roles',
    citizen: 'Citizen',
    victim: 'Victim',
    ngo: 'NGO',
    legalAid: 'Legal Aid',
    admin: 'Admin',
    addUser: 'Add User',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    role: 'Role',
    status: 'Status',
    joined: 'Joined',
    actions: 'Actions',
    active: 'Active',
    inactive: 'Inactive',
    verified: 'Verified',
    unverified: 'Unverified',
    edit: 'Edit',
    delete: 'Delete',
    view: 'View',
    noUsers: 'No users found',
    loading: 'Loading users...',
    confirmDelete: 'Are you sure you want to delete this user?',
    deleteUser: 'Delete User',
    cancel: 'Cancel',
    userDeleted: 'User deleted successfully',
    error: 'Error deleting user',
  },
  hi: {
    users: 'उपयोगकर्ता प्रबंधन',
    search: 'उपयोगकर्ता खोजें...',
    filterByRole: 'भूमिका के अनुसार फ़िल्टर करें',
    allRoles: 'सभी भूमिकाएं',
    citizen: 'नागरिक',
    victim: 'पीड़ित',
    ngo: 'जीवनसेवा संगठन',
    legalAid: 'कानूनी सहायता',
    admin: 'प्रशासक',
    addUser: 'उपयोगकर्ता जोड़ें',
    name: 'नाम',
    email: 'ईमेल',
    phone: 'फ़ोन',
    role: 'भूमिका',
    status: 'स्थिति',
    joined: 'शामिल हुए',
    actions: 'क्रियाएं',
    active: 'सक्रिय',
    inactive: 'निष्क्रिय',
    verified: 'सत्यापित',
    unverified: 'असत्यापित',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    view: 'देखें',
    noUsers: 'कोई उपयोगकर्ता नहीं मिला',
    loading: 'उपयोगकर्ता लोड हो रहे हैं...',
    confirmDelete: 'क्या आप वाकई इस उपयोगकर्ता को हटाना चाहते हैं?',
    deleteUser: 'उपयोगकर्ता हटाएं',
    cancel: 'रद्द करें',
    userDeleted: 'उपयोगकर्ता सफलतापूर्वक हटा दिया गया',
    error: 'उपयोगकर्ता हटाने में त्रुटि',
  },
  ta: {
    users: 'பயனர் நிர்வாகம்',
    search: 'பயனர்களைத் தேடு...',
    filterByRole: 'பாத்திரம் வாரியாக வடிகட்டு',
    allRoles: 'அனைத்து பாத்திரங்கள்',
    citizen: 'குடிமக்கள்',
    victim: 'பாதிக்கப்பட்டவர்',
    ngo: 'அரசு சார்பற்ற நிறுவனம்',
    legalAid: 'சட்ட உதவி',
    admin: 'நிர்வாகி',
    addUser: 'பயனர் சேர்',
    name: 'பெயர்',
    email: 'மின்னஞ்சல்',
    phone: 'தொலைபேசி',
    role: 'பாத்திரம்',
    status: 'நிலை',
    joined: 'சேர்ந்த தேதி',
    actions: 'செயல்கள்',
    active: 'செயலில்',
    inactive: 'செயலற்ற',
    verified: 'சரிபார்க்கப்பட்டது',
    unverified: 'சரிபார்க்கப்படவில்லை',
    edit: 'திருத்து',
    delete: 'நீக்கு',
    view: 'காண்க',
    noUsers: 'பயனர் எதுவும் இல்லை',
    loading: 'பயனர்கள் ஏற்றப்படுகிறார்கள்...',
    confirmDelete: 'இந்தப் பயனரை நிச்சயமாக நீக்க விரும்புகிறீர்களா?',
    deleteUser: 'பயனரை நீக்கு',
    cancel: 'ரத்து செய்',
    userDeleted: 'பயனர் வெற்றிகரமாக நீக்கப்பட்டார்',
    error: 'பயனரை நீக்குவதில் பிழை',
  },
};

export default function AdminUsersPage() {
  const [language, setLanguage] = useState('en');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const t = translations[language] || translations.en;

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang);
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        // Use mock data for demo
        setUsers([
          { id: '1', fullName: 'John Doe', email: 'john@example.com', phoneNumber: '9876543210', role: 'CITIZEN', isActive: true, isVerified: true, createdAt: '2024-01-15' },
          { id: '2', fullName: 'Jane Smith', email: 'jane@example.com', phoneNumber: '9876543211', role: 'VICTIM', isActive: true, isVerified: true, createdAt: '2024-01-16' },
          { id: '3', fullName: 'Legal Aid NGO', email: 'ngo@example.com', phoneNumber: '9876543212', role: 'NGO', isActive: true, isVerified: true, createdAt: '2024-01-17' },
          { id: '4', fullName: 'Advocate Sharma', email: 'sharma@example.com', phoneNumber: '9876543213', role: 'LEGAL_AID', isActive: true, isVerified: false, createdAt: '2024-01-18' },
          { id: '5', fullName: 'Admin User', email: 'admin@example.com', phoneNumber: '9876543214', role: 'ADMIN', isActive: true, isVerified: true, createdAt: '2024-01-10' },
          { id: '6', fullName: 'New User', email: 'new@example.com', phoneNumber: '9876543215', role: 'CITIZEN', isActive: false, isVerified: false, createdAt: '2024-01-19' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // Use mock data for demo
      setUsers([
        { id: '1', fullName: 'John Doe', email: 'john@example.com', phoneNumber: '9876543210', role: 'CITIZEN', isActive: true, isVerified: true, createdAt: '2024-01-15' },
        { id: '2', fullName: 'Jane Smith', email: 'jane@example.com', phoneNumber: '9876543211', role: 'VICTIM', isActive: true, isVerified: true, createdAt: '2024-01-16' },
        { id: '3', fullName: 'Legal Aid NGO', email: 'ngo@example.com', phoneNumber: '9876543212', role: 'NGO', isActive: true, isVerified: true, createdAt: '2024-01-17' },
        { id: '4', fullName: 'Advocate Sharma', email: 'sharma@example.com', phoneNumber: '9876543213', role: 'LEGAL_AID', isActive: true, isVerified: false, createdAt: '2024-01-18' },
        { id: '5', fullName: 'Admin User', email: 'admin@example.com', phoneNumber: '9876543214', role: 'ADMIN', isActive: true, isVerified: true, createdAt: '2024-01-10' },
        { id: '6', fullName: 'New User', email: 'new@example.com', phoneNumber: '9876543215', role: 'CITIZEN', isActive: false, isVerified: false, createdAt: '2024-01-19' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.fullName?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.phoneNumber?.includes(term)
      );
    }
    
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        filtered = filtered.filter(user => user.isActive);
      } else if (statusFilter === 'inactive') {
        filtered = filtered.filter(user => !user.isActive);
      } else if (statusFilter === 'verified') {
        filtered = filtered.filter(user => user.isVerified);
      } else if (statusFilter === 'unverified') {
        filtered = filtered.filter(user => !user.isVerified);
      }
    }
    
    setFilteredUsers(filtered);
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setUsers(users.filter(u => u.id !== selectedUser.id));
        setShowDeleteModal(false);
        setSelectedUser(null);
        alert(t.userDeleted);
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(t.error);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      ADMIN: { bg: '#fee2e2', text: '#b91c1c' },
      NGO: { bg: '#ede9fe', text: '#7c3aed' },
      LEGAL_AID: { bg: '#fef3c7', text: '#d97706' },
      VICTIM: { bg: '#d1fae5', text: '#059669' },
      CITIZEN: { bg: '#dbeafe', text: '#1d4ed8' },
    };
    return colors[role] || { bg: '#f3f4f6', text: '#374151' };
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
          <h1 style={styles.title}>{t.users}</h1>
          <p style={styles.subtitle}>{filteredUsers.length} users found</p>
        </div>
        <button style={styles.addButton}>
          + {t.addUser}
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
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={styles.select}
        >
          <option value="all">{t.allRoles}</option>
          <option value="CITIZEN">{t.citizen}</option>
          <option value="VICTIM">{t.victim}</option>
          <option value="NGO">{t.ngo}</option>
          <option value="LEGAL_AID">{t.legalAid}</option>
          <option value="ADMIN">{t.admin}</option>
        </select>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.select}
        >
          <option value="all">{t.allRoles} Status</option>
          <option value="active">{t.active}</option>
          <option value="inactive">{t.inactive}</option>
          <option value="verified">{t.verified}</option>
          <option value="unverified">{t.unverified}</option>
        </select>
      </div>

      {/* Users Table */}
      <div style={styles.tableContainer}>
        {filteredUsers.length === 0 ? (
          <div style={styles.noUsers}>{t.noUsers}</div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>{t.name}</th>
                <th style={styles.th}>{t.email}</th>
                <th style={styles.th}>{t.phone}</th>
                <th style={styles.th}>{t.role}</th>
                <th style={styles.th}>{t.status}</th>
                <th style={styles.th}>{t.joined}</th>
                <th style={styles.th}>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const roleColor = getRoleColor(user.role);
                return (
                  <tr key={user.id} style={styles.tableRow}>
                    <td style={styles.td}>
                      <div style={styles.userName}>{user.fullName || 'N/A'}</div>
                    </td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>{user.phoneNumber || 'N/A'}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.roleBadge,
                        backgroundColor: roleColor.bg,
                        color: roleColor.text,
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.statusContainer}>
                        <span style={{
                          ...styles.statusDot,
                          backgroundColor: user.isActive ? '#10b981' : '#ef4444',
                        }}></span>
                        <span>{user.isActive ? t.active : t.inactive}</span>
                        {user.isVerified && (
                          <span style={styles.verifiedBadge} title={t.verified}>✓</span>
                        )}
                      </div>
                    </td>
                    <td style={styles.td}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button style={styles.actionBtn} title={t.view}>👁️</button>
                        <button style={styles.actionBtn} title={t.edit}>✏️</button>
                        <button
                          style={{...styles.actionBtn, color: '#ef4444'}}
                          title={t.delete}
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteModal(true);
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>{t.deleteUser}</h3>
            <p style={styles.modalText}>{t.confirmDelete}</p>
            <div style={styles.modalActions}>
              <button
                style={styles.modalCancelBtn}
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                }}
              >
                {t.cancel}
              </button>
              <button style={styles.modalDeleteBtn} onClick={handleDelete}>
                {t.delete}
              </button>
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
  addButton: {
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
  userName: {
    fontWeight: '500',
    color: '#111827',
  },
  roleBadge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  statusContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  verifiedBadge: {
    color: '#3b82f6',
    fontWeight: 'bold',
    marginLeft: '5px',
  },
  actions: {
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
  noUsers: {
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
    padding: '25px',
    maxWidth: '400px',
    width: '90%',
  },
  modalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '10px',
  },
  modalText: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '20px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
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
  modalDeleteBtn: {
    padding: '10px 20px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};
