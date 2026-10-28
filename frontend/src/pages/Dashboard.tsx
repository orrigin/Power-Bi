import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ShoppingBag, 
  Package, 
  Database, 
  Plus, 
  AlertCircle 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { KpiCard } from '../components/KpiCard';
import { FilterBar } from '../components/FilterBar';
import { DashboardSummary, FilterState } from '../types/sales';

interface DashboardProps {
  summary: DashboardSummary | null;
  loading: boolean;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onResetFilters: () => void;
  onNavigateAddSale: () => void;
  isLive: boolean;
  errorMessage?: string | null;
}

const CATEGORY_COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'];

export const Dashboard: React.FC<DashboardProps> = ({
  summary,
  loading,
  filters,
  onFilterChange,
  onResetFilters,
  onNavigateAddSale,
  isLive,
  errorMessage,
}) => {
  if (loading && !summary) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0', color: '#64748b' }}>
        <div className="spin-animation" style={{ display: 'inline-block', width: 36, height: 36, border: '3px solid #e2e8f0', borderTopColor: '#2563eb', borderRadius: '50%', marginBottom: '1rem' }} />
        <p style={{ fontWeight: 500 }}>Loading dashboard analytics...</p>
      </div>
    );
  }

  if (errorMessage && !summary) {
    return (
      <div className="alert alert-danger" style={{ margin: '2rem 0' }}>
        <AlertCircle size={20} />
        <div>
          <strong>Unable to load dashboard data:</strong> {errorMessage}
        </div>
      </div>
    );
  }

  if (!summary) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('en-US').format(val);
  };

  return (
    <div>
      {/* Notice Banner */}
      {!isLive && (
        <div className="alert alert-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Database size={18} />
            <span>
              <strong>Sample Data Mode Active:</strong> Showing interactive preview from sample Superstore records. Connect Flask backend to stream live from SQL Server.
            </span>
          </div>
          <button className="btn btn-primary btn-sm" onClick={onNavigateAddSale}>
            <Plus size={14} /> Add Test Sale
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onReset={onResetFilters}
      />

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KpiCard
          title="Total Sales"
          value={formatCurrency(summary.total_sales)}
          subtext={`Avg. Discount: ${(summary.avg_discount * 100).toFixed(1)}%`}
          icon={DollarSign}
          variant="blue"
          isPositive={true}
        />
        <KpiCard
          title="Total Profit"
          value={formatCurrency(summary.total_profit)}
          subtext={`Margin: ${summary.profit_margin.toFixed(1)}%`}
          icon={TrendingUp}
          variant="green"
          isPositive={summary.total_profit >= 0}
        />
        <KpiCard
          title="Total Orders"
          value={formatNumber(summary.total_orders)}
          subtext={`Unique transactions`}
          icon={ShoppingBag}
          variant="purple"
        />
        <KpiCard
          title="Total Quantity Sold"
          value={formatNumber(summary.total_quantity)}
          subtext={`Units distributed`}
          icon={Package}
          variant="amber"
        />
      </div>

      {/* Source Isolation Audit Widget */}
      <div style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '0.85rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.82rem',
        color: '#475569'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontWeight: 600, color: '#0f172a' }}>Data Source Integrity:</span>
          <span>Original Superstore: <strong>{formatNumber(summary.source_breakdown.superstore_count)}</strong> records</span>
          <span>•</span>
          <span>Website New Entries: <strong>{formatNumber(summary.source_breakdown.sales_entry_count)}</strong> records</span>
        </div>
        <span style={{ fontSize: '0.75rem', background: '#ecfdf5', color: '#065f46', padding: '0.2rem 0.6rem', borderRadius: '4px', fontWeight: 600 }}>
          ✓ Clean Table Isolation Guaranteed
        </span>
      </div>

      {/* Charts Section 1: Monthly Trend & Sales by Category */}
      <div className="charts-grid">
        {/* Monthly Sales & Profit Trend */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Monthly Sales & Profit Trend</div>
              <div className="chart-subtitle">Revenue and bottom-line margin over time</div>
            </div>
          </div>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={summary.monthly_trend} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v >= 1000 ? (v/1000).toFixed(0) + 'k' : v}`} />
                <Tooltip 
                  formatter={(value: any, name: any) => [formatCurrency(Number(value)), name === 'sales' ? 'Sales Amount' : 'Net Profit']} 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
                />
                <Legend />
                <Area type="monotone" dataKey="sales" name="Sales" stroke="#2563eb" fillOpacity={1} fill="url(#colorSales)" strokeWidth={2} />
                <Area type="monotone" dataKey="profit" name="Profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Sales by Category</div>
              <div className="chart-subtitle">Category contribution to total turnover</div>
            </div>
          </div>
          <div style={{ width: '100%', height: 300, display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="55%" height="100%">
              <PieChart>
                <Pie
                  data={summary.sales_by_category}
                  dataKey="sales"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={4}
                >
                  {summary.sales_by_category.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [formatCurrency(Number(value)), 'Sales']} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ width: '45%', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1rem' }}>
              {summary.sales_by_category.map((cat, idx) => (
                <div key={cat.category} style={{ fontSize: '0.82rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: CATEGORY_COLORS[idx % CATEGORY_COLORS.length] }} />
                    <span>{cat.category}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', paddingLeft: '1rem' }}>
                    <span>{formatCurrency(cat.sales)}</span>
                    <span style={{ color: cat.profit >= 0 ? '#10b981' : '#ef4444' }}>
                      Profit: {formatCurrency(cat.profit)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section 2: Regional Profitability & Sub-Category Performance */}
      <div className="charts-grid">
        {/* Profit by Region */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Profit by Region</div>
              <div className="chart-subtitle">Operating profit across geographic sales territories</div>
            </div>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={summary.profit_by_region} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="region" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v >= 1000 ? (v/1000).toFixed(0) + 'k' : v}`} />
                <Tooltip 
                  formatter={(value: any, name: any) => [formatCurrency(Number(value)), name === 'profit' ? 'Net Profit' : 'Sales']} 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="sales" name="Sales" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales & Profit by Sub-Category */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Sales and Profit by Sub-Category</div>
              <div className="chart-subtitle">Top product sub-categories sorted by revenue</div>
            </div>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart 
                data={summary.sales_by_subcategory.slice(0, 7)} 
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v >= 1000 ? (v/1000).toFixed(0) + 'k' : v}`} />
                <YAxis type="category" dataKey="sub_category" stroke="#64748b" fontSize={11} width={80} />
                <Tooltip 
                  formatter={(value: any, name: any) => [formatCurrency(Number(value)), name === 'sales' ? 'Sales' : 'Profit']} 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="sales" name="Sales" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                <Bar dataKey="profit" name="Profit" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

