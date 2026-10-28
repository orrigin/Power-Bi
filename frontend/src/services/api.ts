import { Sale, DashboardSummary, FilterState } from '../types/sales';
import { INITIAL_SAMPLE_SALES, calculateSummaryFromSales } from './sampleData';

const API_BASE = 'http://127.0.0.1:5000/api';

// In-memory store for sample mode mutations
let localSalesStore: Sale[] = [...INITIAL_SAMPLE_SALES];

export interface SystemStatus {
  backend_online: boolean;
  db_connected: boolean;
  db_name?: string;
  server?: string;
  superstore_table_exists?: boolean;
  sales_entry_table_exists?: boolean;
  superstore_count?: number;
  sales_entry_count?: number;
  message?: string;
}

export const apiService = {
  // Check health and connection status of Flask backend & SQL Server
  async checkHealth(): Promise<SystemStatus> {
    try {
      const res = await fetch(`${API_BASE}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          backend_online: true,
          db_connected: data.db_connected || false,
          db_name: data.db_name,
          server: data.server,
          superstore_table_exists: data.superstore_table_exists,
          sales_entry_table_exists: data.sales_entry_table_exists,
          superstore_count: data.superstore_count,
          sales_entry_count: data.sales_entry_count,
          message: data.message
        };
      }
      return {
        backend_online: false,
        db_connected: false,
        message: `Backend returned status ${res.status}`
      };
    } catch {
      return {
        backend_online: false,
        db_connected: false,
        message: 'Backend API is currently offline. Running in Sample Data Mode.'
      };
    }
  },

  // Get Dashboard KPI & Chart Aggregations
  async getDashboardSummary(filters?: Partial<FilterState>): Promise<{ summary: DashboardSummary; isLive: boolean }> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.startDate) queryParams.append('start_date', filters.startDate);
      if (filters?.endDate) queryParams.append('end_date', filters.endDate);
      if (filters?.region && filters.region !== 'All') queryParams.append('region', filters.region);
      if (filters?.category && filters.category !== 'All') queryParams.append('category', filters.category);
      if (filters?.sourceFilter && filters.sourceFilter !== 'all') queryParams.append('source', filters.sourceFilter);

      const res = await fetch(`${API_BASE}/dashboard/summary?${queryParams.toString()}`, {
        signal: AbortSignal.timeout(3500)
      });
      if (res.ok) {
        const data = await res.json();
        return { summary: data, isLive: true };
      }
    } catch {
      // Backend offline or error -> fall back to sample dataset calculations
    }

    // Filter local sample data
    let filtered = [...localSalesStore];
    if (filters?.region && filters.region !== 'All') {
      filtered = filtered.filter(s => s.region === filters.region);
    }
    if (filters?.category && filters.category !== 'All') {
      filtered = filtered.filter(s => s.category === filters.category);
    }
    if (filters?.startDate) {
      filtered = filtered.filter(s => s.order_date >= (filters.startDate || ''));
    }
    if (filters?.endDate) {
      filtered = filtered.filter(s => s.order_date <= (filters.endDate || ''));
    }
    if (filters?.sourceFilter && filters.sourceFilter !== 'all') {
      filtered = filtered.filter(s => s.source === filters.sourceFilter);
    }

    return { summary: calculateSummaryFromSales(filtered), isLive: false };
  },

  // Get Paginated Sales Records with Search and Filters
  async getSales(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    region?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    source?: string;
  }): Promise<{ sales: Sale[]; total: number; isLive: boolean }> {
    try {
      const q = new URLSearchParams();
      if (params.page) q.append('page', params.page.toString());
      if (params.pageSize) q.append('page_size', params.pageSize.toString());
      if (params.search) q.append('search', params.search);
      if (params.region && params.region !== 'All') q.append('region', params.region);
      if (params.category && params.category !== 'All') q.append('category', params.category);
      if (params.startDate) q.append('start_date', params.startDate);
      if (params.endDate) q.append('end_date', params.endDate);
      if (params.source && params.source !== 'all') q.append('source', params.source);

      const res = await fetch(`${API_BASE}/sales?${q.toString()}`, {
        signal: AbortSignal.timeout(3500)
      });
      if (res.ok) {
        const data = await res.json();
        return { sales: data.sales, total: data.total, isLive: true };
      }
    } catch {
      // Fallback to sample data
    }

    let records = [...localSalesStore];
    if (params.search) {
      const term = params.search.toLowerCase();
      records = records.filter(s =>
        s.order_id.toLowerCase().includes(term) ||
        s.customer_name.toLowerCase().includes(term) ||
        s.product_name.toLowerCase().includes(term)
      );
    }
    if (params.region && params.region !== 'All') {
      records = records.filter(s => s.region === params.region);
    }
    if (params.category && params.category !== 'All') {
      records = records.filter(s => s.category === params.category);
    }
    if (params.startDate) {
      records = records.filter(s => s.order_date >= params.startDate!);
    }
    if (params.endDate) {
      records = records.filter(s => s.order_date <= params.endDate!);
    }
    if (params.source && params.source !== 'all') {
      records = records.filter(s => s.source === params.source);
    }

    const total = records.length;
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const startIdx = (page - 1) * pageSize;
    const paged = records.slice(startIdx, startIdx + pageSize);

    return { sales: paged, total, isLive: false };
  },

  // Create a New Sale (always targets SalesEntry table)
  async createSale(saleData: Omit<Sale, 'id' | 'entry_id' | 'source' | 'created_at'>): Promise<{ success: boolean; sale?: Sale; message: string; isLive: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/sales`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData),
        signal: AbortSignal.timeout(4000)
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, sale: data.sale, message: data.message, isLive: true };
      } else {
        const err = await res.json();
        return { success: false, message: err.error || 'Failed to create sale', isLive: true };
      }
    } catch {
      // Offline fallback: save to local memory store
      const newSale: Sale = {
        ...saleData,
        id: localSalesStore.length + 1,
        entry_id: localSalesStore.filter(s => s.source === 'manual_entry').length + 1,
        source: 'manual_entry',
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      localSalesStore = [newSale, ...localSalesStore];
      return {
        success: true,
        sale: newSale,
        message: 'Sale added successfully in Sample Preview Mode. Start Flask backend to save into SQL Server.',
        isLive: false
      };
    }
  },

  // Update Sale (only allowed for SalesEntry records)
  async updateSale(id: number | string, saleData: Partial<Sale>): Promise<{ success: boolean; message: string; isLive: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/sales/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleData),
        signal: AbortSignal.timeout(4000)
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, message: data.message, isLive: true };
      } else {
        const err = await res.json();
        return { success: false, message: err.error || 'Failed to update sale', isLive: true };
      }
    } catch {
      const index = localSalesStore.findIndex(s => s.id === id || s.entry_id === id);
      if (index !== -1) {
        localSalesStore[index] = { ...localSalesStore[index], ...saleData };
        return { success: true, message: 'Record updated locally (Sample Mode)', isLive: false };
      }
      return { success: false, message: 'Record not found', isLive: false };
    }
  },

  // Delete Sale (only allowed for SalesEntry records)
  async deleteSale(id: number | string): Promise<{ success: boolean; message: string; isLive: boolean }> {
    try {
      const res = await fetch(`${API_BASE}/sales/${id}`, {
        method: 'DELETE',
        signal: AbortSignal.timeout(4000)
      });
      if (res.ok) {
        const data = await res.json();
        return { success: true, message: data.message, isLive: true };
      } else {
        const err = await res.json();
        return { success: false, message: err.error || 'Failed to delete sale', isLive: true };
      }
    } catch {
      localSalesStore = localSalesStore.filter(s => s.id !== id && s.entry_id !== id);
      return { success: true, message: 'Record deleted locally (Sample Mode)', isLive: false };
    }
  }
};

