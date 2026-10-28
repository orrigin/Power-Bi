import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { AddSale } from './pages/AddSale';
import { SalesRecords } from './pages/SalesRecords';
import { Analytics } from './pages/Analytics';
import { PowerBi } from './pages/PowerBi';
import { apiService, SystemStatus } from './services/api';
import { DashboardSummary, FilterState, Sale } from './types/sales';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    backend_online: false,
    db_connected: false,
  });

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(0); // 0 = off

  // Filter state for dashboard and analytics
  const [filters, setFilters] = useState<FilterState>({
    startDate: '',
    endDate: '',
    region: 'All',
    category: 'All',
    sourceFilter: 'all',
  });

  // Check backend health & SQL Server status
  const checkHealth = useCallback(async () => {
    const status = await apiService.checkHealth();
    setSystemStatus(status);
  }, []);

  // Fetch Dashboard Summary
  const fetchDashboardData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    else setLoading(true);

    try {
      const res = await apiService.getDashboardSummary(filters);
      setSummary(res.summary);
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error loading dashboard metrics');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [filters]);

  // Initial load
  useEffect(() => {
    checkHealth();
    fetchDashboardData();
  }, [fetchDashboardData, checkHealth]);

  // Periodic Auto-refresh
  useEffect(() => {
    if (autoRefreshInterval <= 0) return;
    const timer = setInterval(() => {
      fetchDashboardData(true);
      checkHealth();
    }, autoRefreshInterval * 1000);
    return () => clearInterval(timer);
  }, [autoRefreshInterval, fetchDashboardData, checkHealth]);

  // Handle addition of a new sale -> immediately update dashboard metrics
  const handleSaleAdded = (_newSale: Sale) => {
    fetchDashboardData();
  };

  // Handle edit/delete of an existing sale -> refresh dashboard
  const handleSaleModified = () => {
    fetchDashboardData();
  };

  const handleResetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      region: 'All',
      category: 'All',
      sourceFilter: 'all',
    });
  };

  const getPageTitleAndSubtitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return {
          title: 'Executive Sales & BI Dashboard',
          subtitle: 'Real-time performance indicators and multi-dimensional analysis'
        };
      case 'add-sale':
        return {
          title: 'Add New Sales Entry',
          subtitle: 'Create verified transactions stored into the isolated SalesEntry table'
        };
      case 'sales-records':
        return {
          title: 'Sales Record Management',
          subtitle: 'Search, filter, paginate, and manage baseline & user-entered records'
        };
      case 'analytics':
        return {
          title: 'Advanced Retail Analytics',
          subtitle: 'Cross-territorial margins, order distributions, and category performance'
        };
      case 'powerbi':
        return {
          title: 'Power BI Integration Portal',
          subtitle: 'Interactive embedded view connected with sales.pbix'
        };
      default:
        return { title: 'Retail BI Suite', subtitle: '' };
    }
  };

  const headerInfo = getPageTitleAndSubtitle();

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLiveDb={systemStatus.db_connected}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Navbar
          title={headerInfo.title}
          subtitle={headerInfo.subtitle}
          systemStatus={systemStatus}
          lastUpdated={summary?.last_updated || ''}
          isRefreshing={isRefreshing}
          onRefresh={() => {
            fetchDashboardData(true);
            checkHealth();
          }}
          autoRefreshInterval={autoRefreshInterval}
          setAutoRefreshInterval={setAutoRefreshInterval}
        />

        <main className="page-content">
          {currentPage === 'dashboard' && (
            <Dashboard
              summary={summary}
              loading={loading}
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={handleResetFilters}
              onNavigateAddSale={() => setCurrentPage('add-sale')}
              isLive={systemStatus.db_connected}
              errorMessage={errorMessage}
            />
          )}

          {currentPage === 'add-sale' && (
            <AddSale
              onSaleAdded={handleSaleAdded}
              onNavigateBack={() => setCurrentPage('dashboard')}
            />
          )}

          {currentPage === 'sales-records' && (
            <SalesRecords
              onSaleModified={handleSaleModified}
              onNavigateAddSale={() => setCurrentPage('add-sale')}
              isLive={systemStatus.db_connected}
            />
          )}

          {currentPage === 'analytics' && (
            <Analytics
              summary={summary}
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={handleResetFilters}
            />
          )}

          {currentPage === 'powerbi' && <PowerBi />}
        </main>
      </div>
    </div>
  );
};
export default App;

