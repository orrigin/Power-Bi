import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';
import { FilterBar } from '../components/FilterBar';
import { DashboardSummary, FilterState } from '../types/sales';
import { TrendingUp, Target, Award, Percent } from 'lucide-react';

interface AnalyticsProps {
  summary: DashboardSummary | null;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onResetFilters: () => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({
  summary,
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  if (!summary) return null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const avgOrderValue = summary.total_orders > 0 ? summary.total_sales / summary.total_orders : 0;
  const topCategory = [...summary.sales_by_category].sort((a, b) => b.sales - a.sales)[0];

  return (
    <div>
      {/* Filters */}
      <FilterBar
        filters={filters}
        onFilterChange={onFilterChange}
        onReset={onResetFilters}
      />

      {/* Analytics Metric Highlights */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div>
            <div className="kpi-title">Avg Order Value (AOV)</div>
            <div className="kpi-value">{formatCurrency(avgOrderValue)}</div>
            <div className="kpi-subtext">Per transaction revenue</div>
          </div>
          <div className="kpi-icon-container kpi-icon-blue">
            <Target size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Overall Profit Ratio</div>
            <div className="kpi-value">{summary.profit_margin.toFixed(1)}%</div>
            <div className="kpi-subtext">Net margin efficiency</div>
          </div>
          <div className="kpi-icon-container kpi-icon-green">
            <Percent size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Top Revenue Category</div>
            <div className="kpi-value" style={{ fontSize: '1.3rem' }}>{topCategory?.category || 'N/A'}</div>
            <div className="kpi-subtext">{formatCurrency(topCategory?.sales || 0)} generated</div>
          </div>
          <div className="kpi-icon-container kpi-icon-purple">
            <Award size={22} />
          </div>
        </div>

        <div className="kpi-card">
          <div>
            <div className="kpi-title">Average Discount Given</div>
            <div className="kpi-value">{(summary.avg_discount * 100).toFixed(1)}%</div>
            <div className="kpi-subtext">Across all sales</div>
          </div>
          <div className="kpi-icon-container kpi-icon-amber">
            <TrendingUp size={22} />
          </div>
        </div>
      </div>

      {/* Deep-Dive Visualizations */}
      <div className="charts-grid">
        {/* Sub-Category Margin Analysis */}
        <div className="chart-card" style={{ gridColumn: 'span 2' }}>
          <div className="chart-header">
            <div>
              <div className="chart-title">Sub-Category Sales & Profit Comparison</div>
              <div className="chart-subtitle">Direct comparison between turnover and profit yield across sub-categories</div>
            </div>
          </div>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={summary.sales_by_subcategory} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="sub_category" stroke="#64748b" fontSize={11} angle={-35} textAnchor="end" interval={0} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `$${v >= 1000 ? (v/1000).toFixed(0) + 'k' : v}`} />
                <Tooltip 
                  formatter={(value: any, name: any) => [formatCurrency(Number(value)), name === 'sales' ? 'Total Sales' : 'Net Profit']} 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="sales" name="Sales Revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Net Profit" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Margin Efficiency */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Regional Profit Margin (%)</div>
              <div className="chart-subtitle">Profitability ratio by geographic market territory</div>
            </div>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={summary.profit_by_region} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="region" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v}%`} />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, 'Profit Margin']} 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="margin" name="Profit Margin (%)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Order Frequency */}
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <div className="chart-title">Orders by Category</div>
              <div className="chart-subtitle">Order volume across product categories</div>
            </div>
          </div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={summary.sales_by_category} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="category" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  formatter={(value: any) => [value, 'Orders Count']} 
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="orders" name="Order Volume" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

