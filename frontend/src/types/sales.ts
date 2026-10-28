export interface Sale {
  id?: number | string;
  order_id: string;
  order_date: string;
  ship_date: string;
  ship_mode?: string;
  customer_id?: string;
  customer_name: string;
  segment?: string;
  country_region?: string;
  city?: string;
  state_province?: string;
  postal_code?: string;
  region: string;
  product_id?: string;
  category: string;
  sub_category: string;
  product_name: string;
  sales: number;
  quantity: number;
  discount: number;
  profit: number;
  source: 'superstore' | 'manual_entry';
  entry_id?: number;
  created_at?: string;
}

export interface DashboardSummary {
  total_sales: number;
  total_profit: number;
  total_orders: number;
  total_quantity: number;
  avg_discount: number;
  profit_margin: number;
  sales_by_category: {
    category: string;
    sales: number;
    profit: number;
    orders: number;
  }[];
  monthly_trend: {
    month: string;
    yearMonth: string;
    sales: number;
    profit: number;
    orders: number;
  }[];
  profit_by_region: {
    region: string;
    sales: number;
    profit: number;
    margin: number;
  }[];
  sales_by_subcategory: {
    sub_category: string;
    category: string;
    sales: number;
    profit: number;
  }[];
  source_breakdown: {
    superstore_count: number;
    sales_entry_count: number;
  };
  last_updated: string;
}

export interface FilterState {
  startDate: string;
  endDate: string;
  region: string;
  category: string;
  sourceFilter: 'all' | 'superstore' | 'manual_entry';
}

export interface PaginationState {
  page: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

