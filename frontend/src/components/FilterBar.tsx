import React from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { FilterState } from '../types/sales';
import { REGIONS } from '../services/sampleData';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  categories?: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onReset,
  categories = ['Furniture', 'Office Supplies', 'Technology'],
}) => {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1e293b', fontWeight: 600, fontSize: '0.85rem' }}>
          <Filter size={16} />
          <span>Filters:</span>
        </div>

        {/* Date Range */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span className="filter-label">From:</span>
          <input
            type="date"
            className="date-input"
            value={filters.startDate}
            onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span className="filter-label">To:</span>
          <input
            type="date"
            className="date-input"
            value={filters.endDate}
            onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
          />
        </div>

        {/* Region */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span className="filter-label">Region:</span>
          <select
            className="select-input"
            value={filters.region}
            onChange={(e) => onFilterChange({ ...filters, region: e.target.value })}
          >
            <option value="All">All Regions</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span className="filter-label">Category:</span>
          <select
            className="select-input"
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Data Source Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span className="filter-label">Source:</span>
          <select
            className="select-input"
            value={filters.sourceFilter}
            onChange={(e) => onFilterChange({ ...filters, sourceFilter: e.target.value as any })}
          >
            <option value="all">All Combined</option>
            <option value="superstore">Superstore Dataset Only</option>
            <option value="manual_entry">Website Entries (SalesEntry)</option>
          </select>
        </div>
      </div>

      <button className="btn btn-secondary btn-sm" onClick={onReset} title="Reset all filters">
        <RotateCcw size={13} />
        <span>Reset</span>
      </button>
    </div>
  );
};

