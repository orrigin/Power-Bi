import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Table, 
  BarChart3, 
  PieChart, 
  Database,
  Layers
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  isLiveDb: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isLiveDb }) => {
  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'add-sale', label: 'Add New Sale', icon: PlusCircle },
    { id: 'sales-records', label: 'Sales Records', icon: Table },
    { id: 'analytics', label: 'In-Depth Analytics', icon: BarChart3 },
    { id: 'powerbi', label: 'Power BI Dashboard', icon: PieChart },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-icon-box">
          <Layers size={22} />
        </div>
        <div>
          <div className="brand-title">Retail BI Suite</div>
          <div className="brand-subtitle">Superstore Analytics</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <Icon size={19} />
              <span className="nav-text">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Database size={14} color={isLiveDb ? '#10b981' : '#f59e0b'} />
          <span style={{ fontWeight: 600, color: '#e2e8f0' }}>
            {isLiveDb ? 'SQL Server Live' : 'Sample Data Mode'}
          </span>
        </div>
        <div>Instance: SQLEXPRESS</div>
        <div>DB: Sales</div>
      </div>
    </aside>
  );
};

