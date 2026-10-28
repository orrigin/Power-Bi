import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  Edit3, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  ShieldAlert,
  Plus
} from 'lucide-react';
import { Sale, FilterState } from '../types/sales';
import { apiService } from '../services/api';
import { ConfirmModal } from '../components/ConfirmModal';
import { CATEGORIES_WITH_SUBCATEGORIES, REGIONS } from '../services/sampleData';

interface SalesRecordsProps {
  onSaleModified: () => void;
  onNavigateAddSale: () => void;
  isLive: boolean;
}

export const SalesRecords: React.FC<SalesRecordsProps> = ({
  onSaleModified,
  onNavigateAddSale,
}) => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<FilterState>({
    startDate: '',
    endDate: '',
    region: 'All',
    category: 'All',
    sourceFilter: 'all',
  });

  // Modal States
  const [deleteTarget, setDeleteTarget] = useState<Sale | null>(null);
  const [editTarget, setEditTarget] = useState<Sale | null>(null);
  const [readOnlyWarning, setReadOnlyWarning] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Fetch data
  const loadSales = async () => {
    setLoading(true);
    try {
      const res = await apiService.getSales({
        page,
        pageSize,
        search: searchTerm,
        region: filters.region,
        category: filters.category,
        startDate: filters.startDate,
        endDate: filters.endDate,
        source: filters.sourceFilter,
      });
      setSales(res.sales);
      setTotalRecords(res.total);
    } catch (err: any) {
      console.error('Failed to load sales records', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales();
  }, [page, pageSize, filters]);

  // Trigger search on debounce or Enter
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadSales();
  };

  const handleAttemptDelete = (record: Sale) => {
    if (record.source === 'superstore') {
      setReadOnlyWarning(`Protected Record: Order ${record.order_id} belongs to the immutable Superstore baseline dataset (dbo.[sample_-_superstore]) and cannot be deleted.`);
      return;
    }
    setDeleteTarget(record);
  };

  const handleAttemptEdit = (record: Sale) => {
    if (record.source === 'superstore') {
      setReadOnlyWarning(`Protected Record: Order ${record.order_id} belongs to the immutable Superstore baseline dataset (dbo.[sample_-_superstore]) and cannot be modified.`);
      return;
    }
    setEditTarget(record);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.entry_id || deleteTarget.id!;
    const res = await apiService.deleteSale(targetId);
    if (res.success) {
      setSuccessBanner(`Deleted order ${deleteTarget.order_id} successfully.`);
      setDeleteTarget(null);
      loadSales();
      onSaleModified();
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    const targetId = editTarget.entry_id || editTarget.id!;
    const res = await apiService.updateSale(targetId, editTarget);
    if (res.success) {
      setSuccessBanner(`Order ${editTarget.order_id} updated successfully.`);
      setEditTarget(null);
      loadSales();
      onSaleModified();
    }
  };

  const totalPages = Math.ceil(totalRecords / pageSize) || 1;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(val);
  };

  return (
    <div>
      {/* Notifications */}
      {successBanner && (
        <div className="alert alert-success" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CheckCircle2 size={18} />
            <span>{successBanner}</span>
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }} onClick={() => setSuccessBanner(null)}>✕</button>
        </div>
      )}

      {readOnlyWarning && (
        <div className="alert alert-danger" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldAlert size={18} />
            <span>{readOnlyWarning}</span>
          </div>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }} onClick={() => setReadOnlyWarning(null)}>✕</button>
        </div>
      )}

      {/* Header Bar */}
      <div className="table-container">
        <div className="table-header-bar">
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: 420 }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type="text"
                className="text-input"
                style={{ width: '100%', paddingLeft: '2.2rem' }}
                placeholder="Search by Order ID, Customer, or Product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            </div>
            <button type="submit" className="btn btn-secondary btn-sm">Search</button>
          </form>

          {/* Quick Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <select
              className="select-input"
              value={filters.sourceFilter}
              onChange={(e) => { setFilters({ ...filters, sourceFilter: e.target.value as any }); setPage(1); }}
            >
              <option value="all">All Sources</option>
              <option value="superstore">Superstore Baseline Only</option>
              <option value="manual_entry">SalesEntry (Website) Only</option>
            </select>

            <select
              className="select-input"
              value={filters.region}
              onChange={(e) => { setFilters({ ...filters, region: e.target.value }); setPage(1); }}
            >
              <option value="All">All Regions</option>
              {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>

            <button className="btn btn-primary btn-sm" onClick={onNavigateAddSale}>
              <Plus size={14} /> New Sale
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div style={{ overflowX: 'auto' }}>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Customer</th>
                <th>Region</th>
                <th>Category</th>
                <th>Product Name</th>
                <th style={{ textAlign: 'right' }}>Sales</th>
                <th style={{ textAlign: 'right' }}>Qty</th>
                <th style={{ textAlign: 'right' }}>Profit</th>
                <th>Source</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
                    Loading records...
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
                    No sales records found matching your query.
                  </td>
                </tr>
              ) : (
                sales.map((item) => (
                  <tr key={item.id || item.order_id}>
                    <td style={{ fontWeight: 600, color: '#1e293b' }}>{item.order_id}</td>
                    <td>{item.order_date}</td>
                    <td>{item.customer_name}</td>
                    <td>{item.region}</td>
                    <td>
                      <span style={{ fontSize: '0.78rem', color: '#475569' }}>
                        {item.category} <span style={{ color: '#94a3b8' }}>/</span> {item.sub_category}
                      </span>
                    </td>
                    <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.product_name}>
                      {item.product_name}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.sales)}</td>
                    <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: item.profit >= 0 ? '#10b981' : '#ef4444' }}>
                      {formatCurrency(item.profit)}
                    </td>
                    <td>
                      {item.source === 'superstore' ? (
                        <span className="badge badge-superstore" title="Protected baseline data in dbo.[sample_-_superstore]">
                          Superstore
                        </span>
                      ) : (
                        <span className="badge badge-entry" title="Entered through website in dbo.SalesEntry">
                          SalesEntry
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.2rem 0.45rem', opacity: item.source === 'superstore' ? 0.45 : 1 }}
                          onClick={() => handleAttemptEdit(item)}
                          title={item.source === 'superstore' ? 'Superstore dataset is protected (read-only)' : 'Edit sales entry'}
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.2rem 0.45rem', opacity: item.source === 'superstore' ? 0.45 : 1, color: '#ef4444' }}
                          onClick={() => handleAttemptDelete(item)}
                          title={item.source === 'superstore' ? 'Superstore dataset is protected (read-only)' : 'Delete sales entry'}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div style={{
          padding: '0.85rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #e2e8f0',
          fontSize: '0.82rem',
          color: '#64748b'
        }}>
          <div>
            Showing <strong>{sales.length}</strong> of <strong>{totalRecords}</strong> records
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>Rows per page:</span>
              <select
                className="select-input"
                style={{ padding: '0.2rem 0.4rem', fontSize: '0.78rem' }}
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>Page {page} of {totalPages}</span>
              <button
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.2rem 0.4rem' }}
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft size={14} />
              </button>
              <button
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.2rem 0.4rem' }}
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        title="Confirm Record Deletion"
        message={`Are you sure you want to delete order "${deleteTarget?.order_id}" (${deleteTarget?.customer_name})? This action will permanently remove it from the SalesEntry table.`}
        confirmLabel="Yes, Delete Record"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Edit Modal */}
      {editTarget && (
        <div className="modal-overlay" onClick={() => setEditTarget(null)}>
          <div className="modal-content" style={{ maxWidth: 650 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: '#0f172a' }}>
              Edit Sales Entry: {editTarget.order_id}
            </h3>

            <form onSubmit={handleSaveEdit}>
              <div className="form-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Customer Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editTarget.customer_name}
                    onChange={(e) => setEditTarget({ ...editTarget, customer_name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Region</label>
                  <select
                    className="form-input"
                    value={editTarget.region}
                    onChange={(e) => setEditTarget({ ...editTarget, region: e.target.value })}
                  >
                    {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editTarget.product_name}
                    onChange={(e) => setEditTarget({ ...editTarget, product_name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Sales Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={editTarget.sales}
                    onChange={(e) => setEditTarget({ ...editTarget, sales: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editTarget.quantity}
                    onChange={(e) => setEditTarget({ ...editTarget, quantity: parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Discount (0 to 1)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={editTarget.discount}
                    onChange={(e) => setEditTarget({ ...editTarget, discount: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Profit ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={editTarget.profit}
                    onChange={(e) => setEditTarget({ ...editTarget, profit: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditTarget(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

