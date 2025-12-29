'use client';

import { useState, useEffect } from 'react';

// Admin Dashboard Component
export default function AdminDashboard({ adminId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, [period, adminId]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/dashboard?period=${period}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  if (loading) {
    return (
      <div className="admin-dashboard loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>Admin Dashboard</h1>
          <p>System overview and management</p>
        </div>
        <div className="header-right">
          <select 
            className="period-selector"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* System Health Banner */}
      {stats?.systemHealth && (
        <div className={`health-banner ${stats.systemHealth.status}`}>
          <span className="health-icon">
            {stats.systemHealth.status === 'healthy' ? '✓' : '!'}
          </span>
          <span>System Status: {stats.systemHealth.status}</span>
          <span className="uptime">
            Uptime: {Math.floor(stats.systemHealth.uptime / 3600)}h 
            {Math.floor((stats.systemHealth.uptime % 3600) / 60)}m
          </span>
        </div>
      )}

      {/* Overview Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <span className="stat-value">{formatNumber(stats?.overview?.totalUsers)}</span>
            <span className="stat-label">Total Users</span>
            <span className="stat-change positive">
              +{formatNumber(stats?.overview?.activeUsers)} active
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <span className="stat-value">{formatNumber(stats?.documents?.total)}</span>
            <span className="stat-label">Documents</span>
            <span className="stat-change positive">
              +{formatNumber(stats?.documents?.newThisPeriod)} new
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎤</div>
          <div className="stat-content">
            <span className="stat-value">{formatNumber(stats?.statements?.total)}</span>
            <span className="stat-label">Statements</span>
            <span className="stat-change positive">
              +{formatNumber(stats?.statements?.newThisPeriod)} new
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔒</div>
          <div className="stat-content">
            <span className="stat-value">{formatNumber(stats?.consents?.granted)}</span>
            <span className="stat-label">Active Consents</span>
            <span className="stat-change neutral">
              {stats?.consents?.activeRate}% consent rate
            </span>
          </div>
        </div>
      </div>

      {/* Role Distribution */}
      <div className="content-section">
        <h2>User Distribution by Role</h2>
        <div className="role-distribution">
          {stats?.roleDistribution && Object.entries(stats.roleDistribution).map(([role, count]) => (
            <div key={role} className="role-bar">
              <div className="role-info">
                <span className="role-name">{role.replace('_', ' ')}</span>
                <span className="role-count">{count}</span>
              </div>
              <div className="role-progress">
                <div 
                  className="role-fill"
                  style={{ 
                    width: `${(count / stats.overview.totalUsers) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="content-section">
        <div className="section-header">
          <h2>Recent Registrations</h2>
          <a href="/admin/users" className="view-all">View All →</a>
        </div>
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentUsers?.map((user) => (
                <tr key={user.id}>
                  <td className="user-cell">
                    <span className="user-email">{user.email}</span>
                  </td>
                  <td>
                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="date-cell">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="date-cell">
                    {user.lastLoginAt 
                      ? new Date(user.lastLoginAt).toLocaleDateString() 
                      : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts Section */}
      {stats?.alerts?.length > 0 && (
        <div className="content-section alerts-section">
          <h2>System Alerts</h2>
          <div className="alerts-list">
            {stats.alerts.map((alert) => (
              <div key={alert.id} className={`alert-item ${alert.severity.toLowerCase()}`}>
                <span className="alert-time">
                  {new Date(alert.timestamp).toLocaleString()}
                </span>
                <span className="alert-action">{alert.action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-dashboard {
          padding: var(--spacing-xl);
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--spacing-xl);
        }
        
        .header-left h1 {
          font-size: var(--font-size-2xl);
          margin-bottom: var(--spacing-xs);
        }
        
        .header-left p {
          color: var(--color-text-secondary);
          margin: 0;
        }
        
        .period-selector {
          padding: var(--spacing-sm) var(--spacing-md);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: var(--color-surface);
        }
        
        .health-banner {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          border-radius: var(--radius-md);
          margin-bottom: var(--spacing-xl);
        }
        
        .health-banner.healthy {
          background: var(--color-success-light);
          color: var(--color-success);
        }
        
        .health-banner.warning {
          background: var(--color-warning-light);
          color: var(--color-warning);
        }
        
        .uptime {
          margin-left: auto;
          font-size: var(--font-size-sm);
          opacity: 0.8;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }
        
        .stat-card {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-lg);
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
        }
        
        .stat-icon {
          font-size: 2rem;
        }
        
        .stat-value {
          display: block;
          font-size: var(--font-size-2xl);
          font-weight: 700;
          color: var(--color-primary);
        }
        
        .stat-label {
          display: block;
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
        }
        
        .stat-change {
          display: block;
          font-size: var(--font-size-xs);
          margin-top: var(--spacing-xs);
        }
        
        .stat-change.positive {
          color: var(--color-success);
        }
        
        .stat-change.neutral {
          color: var(--color-text-muted);
        }
        
        .content-section {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: var(--spacing-lg);
          margin-bottom: var(--spacing-lg);
        }
        
        .content-section h2 {
          font-size: var(--font-size-lg);
          margin-bottom: var(--spacing-md);
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }
        
        .section-header h2 {
          margin: 0;
        }
        
        .view-all {
          color: var(--color-primary);
          text-decoration: none;
          font-size: var(--font-size-sm);
        }
        
        .view-all:hover {
          text-decoration: underline;
        }
        
        .role-distribution {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }
        
        .role-bar {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }
        
        .role-info {
          display: flex;
          justify-content: space-between;
        }
        
        .role-name {
          font-weight: 500;
          text-transform: capitalize;
        }
        
        .role-count {
          color: var(--color-text-secondary);
        }
        
        .role-progress {
          height: 8px;
          background: var(--color-secondary);
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        
        .role-fill {
          height: 100%;
          background: var(--color-primary);
          border-radius: var(--radius-full);
          transition: width 0.3s ease;
        }
        
        .users-table {
          overflow-x: auto;
        }
        
        .users-table table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .users-table th,
        .users-table td {
          padding: var(--spacing-sm) var(--spacing-md);
          text-align: left;
          border-bottom: 1px solid var(--color-border);
        }
        
        .users-table th {
          font-weight: 600;
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
        }
        
        .user-email {
          font-family: monospace;
        }
        
        .role-badge,
        .status-badge {
          display: inline-block;
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--radius-full);
          font-size: var(--font-size-xs);
          font-weight: 500;
        }
        
        .role-badge.admin { background: #fee2e2; color: #991b1b; }
        .role-badge.ngo { background: #dbeafe; color: #1e40af; }
        .role-badge.citizen { background: #dcfce7; color: #166534; }
        .role-badge.victim { background: #fef3c7; color: #92400e; }
        
        .status-badge.active { background: var(--color-success-light); color: var(--color-success); }
        .status-badge.inactive { background: var(--color-secondary); color: var(--color-text-secondary); }
        
        .date-cell {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
        }
        
        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }
        
        .alert-item {
          display: flex;
          justify-content: space-between;
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
        }
        
        .alert-item.warn {
          background: var(--color-warning-light);
          color: var(--color-warning);
        }
        
        .alert-item.critical {
          background: var(--color-error-light);
          color: var(--color-error);
        }
        
        .alert-time {
          opacity: 0.7;
        }
        
        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: var(--spacing-md);
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
