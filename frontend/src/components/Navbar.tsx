import React from 'react';
import { RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { SystemStatus } from '../services/api';

interface NavbarProps {
  title: string;
  subtitle: string;
  systemStatus: SystemStatus;
  lastUpdated: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  autoRefreshInterval: number;
  setAutoRefreshInterval: (sec: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  title,
  subtitle,
  systemStatus,
  lastUpdated,
  isRefreshing,
  onRefresh,
  autoRefreshInterval,
  setAutoRefreshInterval,
}) => {
  return (
    <header className="top-bar">
      <div className="top-bar-title">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Connection Status Badge */}
        {systemStatus.db_connected ? (
          <div className="status-badge live" title={`Connected to SQL Server: ${systemStatus.server || 'SQLEXPRESS'}`}>
            <CheckCircle2 size={14} />
            <span>SQL Server Live ({systemStatus.superstore_count || 10194} records)</span>
          </div>
        ) : (
          <div className="status-badge sample" title="Backend not yet running. Using built-in Superstore sample data.">
            <AlertTriangle size={14} />
            <span>Sample Preview Mode</span>
          </div>
        )}

        {/* Auto Refresh Config */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#64748b' }}>
          <span>Auto-refresh:</span>
          <select
            className="select-input"
            style={{ padding: '0.25rem 0.5rem', fontSize: '0.78rem' }}
            value={autoRefreshInterval}
            onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
          >
            <option value={0}>Off</option>
            <option value={15}>15s</option>
            <option value={30}>30s</option>
            <option value={60}>60s</option>
            <option value={300}>5m</option>
          </select>
        </div>

        {/* Last updated and Manual Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Updated: <strong>{lastUpdated || 'Just now'}</strong>
          </span>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Fetch latest data from SQL Server"
          >
            <RefreshCw size={14} className={isRefreshing ? 'spin-animation' : ''} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
};

