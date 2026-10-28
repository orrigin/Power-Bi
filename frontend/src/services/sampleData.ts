import { Sale, DashboardSummary } from '../types/sales';

export const INITIAL_SAMPLE_SALES: Sale[] = [
  {
    id: 1,
    order_id: 'US-2024-103800',
    order_date: '2024-01-03',
    ship_date: '2024-01-07',
    customer_name: 'Darren Powers',
    region: 'Central',
    category: 'Office Supplies',
    sub_category: 'Paper',
    product_name: 'Message Book, Wirebound, Four 5 1/2 X 4 Forms',
    sales: 16.45,
    quantity: 2,
    discount: 0.2,
    profit: 5.55,
    source: 'superstore'
  },
  {
    id: 2,
    order_id: 'US-2024-112326',
    order_date: '2024-01-04',
    ship_date: '2024-01-08',
    customer_name: 'Phillina Ober',
    region: 'Central',
    category: 'Office Supplies',
    sub_category: 'Binders',
    product_name: 'GBC Standard Plastic Binding Systems Combs',
    sales: 3.54,
    quantity: 2,
    discount: 0.8,
    profit: -5.49,
    source: 'superstore'
  },
  {
    id: 3,
    order_id: 'US-2024-112327',
    order_date: '2024-01-04',
    ship_date: '2024-01-08',
    customer_name: 'Phillina Ober',
    region: 'Central',
    category: 'Office Supplies',
    sub_category: 'Labels',
    product_name: 'Avery 508 Address Labels',
    sales: 11.78,
    quantity: 3,
    discount: 0.2,
    profit: 4.27,
    source: 'superstore'
  },
  {
    id: 4,
    order_id: 'US-2024-112328',
    order_date: '2024-01-04',
    ship_date: '2024-01-08',
    customer_name: 'Phillina Ober',
    region: 'Central',
    category: 'Office Supplies',
    sub_category: 'Storage',
    product_name: 'SAFCO Boltless Steel Shelving Unit',
    sales: 272.74,
    quantity: 3,
    discount: 0.2,
    profit: -64.77,
    source: 'superstore'
  },
  {
    id: 5,
    order_id: 'CA-2024-141817',
    order_date: '2024-01-05',
    ship_date: '2024-01-12',
    customer_name: 'Mick Brown',
    region: 'East',
    category: 'Technology',
    sub_category: 'Phones',
    product_name: 'Apple iPhone 13 128GB Midnight',
    sales: 899.99,
    quantity: 1,
    discount: 0.1,
    profit: 220.50,
    source: 'superstore'
  },
  {
    id: 6,
    order_id: 'CA-2024-105417',
    order_date: '2024-01-07',
    ship_date: '2024-01-10',
    customer_name: 'Jane Waco',
    region: 'West',
    category: 'Furniture',
    sub_category: 'Chairs',
    product_name: 'HON 5400 Series High-Back Executive Leather Chair',
    sales: 731.94,
    quantity: 3,
    discount: 0.15,
    profit: 146.38,
    source: 'superstore'
  },
  {
    id: 7,
    order_id: 'US-2024-108966',
    order_date: '2024-02-11',
    ship_date: '2024-02-15',
    customer_name: 'Sanjit Chand',
    region: 'South',
    category: 'Technology',
    sub_category: 'Accessories',
    product_name: 'Logitech MX Master 3S Wireless Mouse',
    sales: 199.98,
    quantity: 2,
    discount: 0.05,
    profit: 62.40,
    source: 'superstore'
  },
  {
    id: 8,
    order_id: 'CA-2024-135905',
    order_date: '2024-02-18',
    ship_date: '2024-02-22',
    customer_name: 'Shirley Daniels',
    region: 'East',
    category: 'Furniture',
    sub_category: 'Tables',
    product_name: 'Bevis Conference Table 8-Foot Oval',
    sales: 1240.50,
    quantity: 1,
    discount: 0.3,
    profit: -180.20,
    source: 'superstore'
  },
  {
    id: 9,
    order_id: 'US-2024-168116',
    order_date: '2024-03-02',
    ship_date: '2024-03-06',
    customer_name: 'Ken Black',
    region: 'West',
    category: 'Technology',
    sub_category: 'Machines',
    product_name: 'Epson WorkForce Pro All-in-One Inkjet Printer',
    sales: 649.95,
    quantity: 1,
    discount: 0.0,
    profit: 185.00,
    source: 'superstore'
  },
  {
    id: 10,
    order_id: 'CA-2024-121755',
    order_date: '2024-03-14',
    ship_date: '2024-03-19',
    customer_name: 'Ellis Ballard',
    region: 'Central',
    category: 'Office Supplies',
    sub_category: 'Storage',
    product_name: 'Fellowes Bankers Box SmoothMove Moving Boxes',
    sales: 84.60,
    quantity: 4,
    discount: 0.1,
    profit: 12.80,
    source: 'superstore'
  },
  {
    id: 11,
    order_id: 'US-2024-145317',
    order_date: '2024-03-22',
    ship_date: '2024-03-26',
    customer_name: 'Craig Carreira',
    region: 'South',
    category: 'Furniture',
    sub_category: 'Bookcases',
    product_name: 'Bush Somerset 4-Shelf Bookcase in Hansen Cherry',
    sales: 419.40,
    quantity: 2,
    discount: 0.2,
    profit: 45.10,
    source: 'superstore'
  },
  {
    id: 12,
    order_id: 'WEB-2024-0001',
    order_date: '2024-04-01',
    ship_date: '2024-04-05',
    customer_name: 'Elena Rostova',
    region: 'East',
    category: 'Technology',
    sub_category: 'Copiers',
    product_name: 'Canon imageCLASS Multifunction Laser Copier',
    sales: 1399.99,
    quantity: 1,
    discount: 0.05,
    profit: 460.00,
    source: 'manual_entry',
    entry_id: 1,
    created_at: '2024-04-01 10:15:00'
  }
];

export const CATEGORIES_WITH_SUBCATEGORIES: Record<string, string[]> = {
  'Furniture': ['Bookcases', 'Chairs', 'Furnishings', 'Tables'],
  'Office Supplies': ['Appliances', 'Art', 'Binders', 'Envelopes', 'Fasteners', 'Labels', 'Paper', 'Storage', 'Supplies'],
  'Technology': ['Accessories', 'Copiers', 'Machines', 'Phones']
};

export const REGIONS = ['Central', 'East', 'South', 'West'];

export function calculateSummaryFromSales(sales: Sale[]): DashboardSummary {
  const total_sales = sales.reduce((sum, s) => sum + s.sales, 0);
  const total_profit = sales.reduce((sum, s) => sum + s.profit, 0);
  const total_quantity = sales.reduce((sum, s) => sum + s.quantity, 0);
  const uniqueOrders = new Set(sales.map(s => s.order_id));
  const total_orders = uniqueOrders.size;
  const avg_discount = sales.length ? (sales.reduce((sum, s) => sum + s.discount, 0) / sales.length) : 0;
  const profit_margin = total_sales > 0 ? (total_profit / total_sales) * 100 : 0;

  // Sales by Category
  const catMap: Record<string, { sales: number; profit: number; orders: Set<string> }> = {};
  sales.forEach(s => {
    if (!catMap[s.category]) {
      catMap[s.category] = { sales: 0, profit: 0, orders: new Set() };
    }
    catMap[s.category].sales += s.sales;
    catMap[s.category].profit += s.profit;
    catMap[s.category].orders.add(s.order_id);
  });
  const sales_by_category = Object.entries(catMap).map(([category, val]) => ({
    category,
    sales: Math.round(val.sales * 100) / 100,
    profit: Math.round(val.profit * 100) / 100,
    orders: val.orders.size
  }));

  // Monthly Trend
  const monthMap: Record<string, { sales: number; profit: number; orders: Set<string> }> = {};
  sales.forEach(s => {
    const ym = s.order_date.substring(0, 7); // 'YYYY-MM'
    if (!monthMap[ym]) {
      monthMap[ym] = { sales: 0, profit: 0, orders: new Set() };
    }
    monthMap[ym].sales += s.sales;
    monthMap[ym].profit += s.profit;
    monthMap[ym].orders.add(s.order_id);
  });
  const monthly_trend = Object.keys(monthMap).sort().map(ym => {
    const [year, monthNum] = ym.split('-');
    const dateObj = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
    const monthName = dateObj.toLocaleString('default', { month: 'short', year: '2-digit' });
    return {
      month: monthName,
      yearMonth: ym,
      sales: Math.round(monthMap[ym].sales * 100) / 100,
      profit: Math.round(monthMap[ym].profit * 100) / 100,
      orders: monthMap[ym].orders.size
    };
  });

  // Profit by Region
  const regMap: Record<string, { sales: number; profit: number }> = {};
  sales.forEach(s => {
    if (!regMap[s.region]) {
      regMap[s.region] = { sales: 0, profit: 0 };
    }
    regMap[s.region].sales += s.sales;
    regMap[s.region].profit += s.profit;
  });
  const profit_by_region = Object.entries(regMap).map(([region, val]) => ({
    region,
    sales: Math.round(val.sales * 100) / 100,
    profit: Math.round(val.profit * 100) / 100,
    margin: val.sales > 0 ? Math.round((val.profit / val.sales) * 1000) / 10 : 0
  }));

  // Sub-Category Sales & Profit
  const subMap: Record<string, { category: string; sales: number; profit: number }> = {};
  sales.forEach(s => {
    if (!subMap[s.sub_category]) {
      subMap[s.sub_category] = { category: s.category, sales: 0, profit: 0 };
    }
    subMap[s.sub_category].sales += s.sales;
    subMap[s.sub_category].profit += s.profit;
  });
  const sales_by_subcategory = Object.entries(subMap).map(([sub_category, val]) => ({
    sub_category,
    category: val.category,
    sales: Math.round(val.sales * 100) / 100,
    profit: Math.round(val.profit * 100) / 100
  })).sort((a, b) => b.sales - a.sales);

  const superstore_count = sales.filter(s => s.source === 'superstore').length;
  const sales_entry_count = sales.filter(s => s.source === 'manual_entry').length;

  return {
    total_sales: Math.round(total_sales * 100) / 100,
    total_profit: Math.round(total_profit * 100) / 100,
    total_orders,
    total_quantity,
    avg_discount: Math.round(avg_discount * 100) / 100,
    profit_margin: Math.round(profit_margin * 10) / 10,
    sales_by_category,
    monthly_trend,
    profit_by_region,
    sales_by_subcategory,
    source_breakdown: {
      superstore_count,
      sales_entry_count
    },
    last_updated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };
}

