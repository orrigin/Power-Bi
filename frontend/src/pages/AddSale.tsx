import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Sparkles, Send, ArrowLeft } from 'lucide-react';
import { CATEGORIES_WITH_SUBCATEGORIES, REGIONS } from '../services/sampleData';
import { apiService } from '../services/api';
import { Sale } from '../types/sales';

interface AddSaleProps {
  onSaleAdded: (sale: Sale) => void;
  onNavigateBack: () => void;
}

export const AddSale: React.FC<AddSaleProps> = ({ onSaleAdded, onNavigateBack }) => {
  const [formData, setFormData] = useState({
    order_id: `WEB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    order_date: new Date().toISOString().substring(0, 10),
    ship_date: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString().substring(0, 10),
    customer_name: '',
    region: 'Central',
    category: 'Technology',
    sub_category: 'Phones',
    product_name: '',
    sales: '',
    quantity: '1',
    discount: '0.00',
    profit: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Available sub-categories based on selected category
  const availableSubCategories = CATEGORIES_WITH_SUBCATEGORIES[formData.category] || [];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    const subCats = CATEGORIES_WITH_SUBCATEGORIES[newCategory] || [];
    setFormData({
      ...formData,
      category: newCategory,
      sub_category: subCats[0] || '',
    });
  };

  const handleGenerateId = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setFormData({ ...formData, order_id: `WEB-${new Date().getFullYear()}-${randomNum}` });
  };

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.order_id.trim()) errs.order_id = 'Order ID is required';
    if (!formData.order_date) errs.order_date = 'Order date is required';
    if (!formData.ship_date) errs.ship_date = 'Ship date is required';
    if (formData.ship_date < formData.order_date) {
      errs.ship_date = 'Ship date cannot be earlier than order date';
    }
    if (!formData.customer_name.trim()) errs.customer_name = 'Customer name is required';
    if (!formData.product_name.trim()) errs.product_name = 'Product name is required';

    const salesVal = parseFloat(formData.sales);
    if (isNaN(salesVal) || salesVal <= 0) errs.sales = 'Enter a valid sales amount greater than 0';

    const qtyVal = parseInt(formData.quantity);
    if (isNaN(qtyVal) || qtyVal < 1) errs.quantity = 'Quantity must be at least 1';

    const discVal = parseFloat(formData.discount);
    if (isNaN(discVal) || discVal < 0 || discVal > 1) {
      errs.discount = 'Discount must be between 0.00 (0%) and 1.00 (100%)';
    }

    const profitVal = parseFloat(formData.profit);
    if (isNaN(profitVal)) errs.profit = 'Profit value is required (can be negative or positive)';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        order_id: formData.order_id.trim(),
        order_date: formData.order_date,
        ship_date: formData.ship_date,
        customer_name: formData.customer_name.trim(),
        region: formData.region,
        category: formData.category,
        sub_category: formData.sub_category,
        product_name: formData.product_name.trim(),
        sales: parseFloat(formData.sales),
        quantity: parseInt(formData.quantity),
        discount: parseFloat(formData.discount),
        profit: parseFloat(formData.profit),
      };

      const result = await apiService.createSale(payload);

      if (result.success && result.sale) {
        setSuccessMessage(`Order ${payload.order_id} saved successfully! ${result.isLive ? 'Saved to SQL Server table SalesEntry.' : 'Saved in preview store.'}`);
        onSaleAdded(result.sale);
        
        // Prepare form for next entry with new generated Order ID
        setFormData({
          order_id: `WEB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          order_date: new Date().toISOString().substring(0, 10),
          ship_date: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString().substring(0, 10),
          customer_name: '',
          region: formData.region,
          category: formData.category,
          sub_category: formData.sub_category,
          product_name: '',
          sales: '',
          quantity: '1',
          discount: '0.00',
          profit: '',
        });
      } else {
        setErrorMessage(result.message || 'Failed to record sale.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a' }}>Add New Retail Sale</h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
            Data entered here is safely inserted into the <code>SalesEntry</code> table without altering original Superstore data.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={onNavigateBack}>
          <ArrowLeft size={15} /> Back to Dashboard
        </button>
      </div>

      {successMessage && (
        <div className="alert alert-success">
          <CheckCircle2 size={20} />
          <div>{successMessage}</div>
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger">
          <AlertCircle size={20} />
          <div>{errorMessage}</div>
        </div>
      )}

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Order ID with Auto-generator */}
            <div className="form-group">
              <label className="form-label">Order ID *</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. WEB-2024-10291"
                  value={formData.order_id}
                  onChange={(e) => setFormData({ ...formData, order_id: e.target.value })}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleGenerateId}
                  title="Generate a unique Order ID"
                >
                  <Sparkles size={14} /> Auto
                </button>
              </div>
              {errors.order_id && <span className="form-error">{errors.order_id}</span>}
            </div>

            {/* Customer Name */}
            <div className="form-group">
              <label className="form-label">Customer Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Johnathan Smith"
                value={formData.customer_name}
                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              />
              {errors.customer_name && <span className="form-error">{errors.customer_name}</span>}
            </div>

            {/* Order Date */}
            <div className="form-group">
              <label className="form-label">Order Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.order_date}
                onChange={(e) => setFormData({ ...formData, order_date: e.target.value })}
              />
              {errors.order_date && <span className="form-error">{errors.order_date}</span>}
            </div>

            {/* Ship Date */}
            <div className="form-group">
              <label className="form-label">Ship Date *</label>
              <input
                type="date"
                className="form-input"
                value={formData.ship_date}
                onChange={(e) => setFormData({ ...formData, ship_date: e.target.value })}
              />
              {errors.ship_date && <span className="form-error">{errors.ship_date}</span>}
            </div>

            {/* Region */}
            <div className="form-group">
              <label className="form-label">Region *</label>
              <select
                className="form-input"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-input"
                value={formData.category}
                onChange={handleCategoryChange}
              >
                {Object.keys(CATEGORIES_WITH_SUBCATEGORIES).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sub-Category */}
            <div className="form-group">
              <label className="form-label">Sub-Category *</label>
              <select
                className="form-input"
                value={formData.sub_category}
                onChange={(e) => setFormData({ ...formData, sub_category: e.target.value })}
              >
                {availableSubCategories.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* Product Name */}
            <div className="form-group full-width">
              <label className="form-label">Product Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Logitech MX Mechanical Wireless Keyboard"
                value={formData.product_name}
                onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
              />
              {errors.product_name && <span className="form-error">{errors.product_name}</span>}
            </div>

            {/* Sales Amount */}
            <div className="form-group">
              <label className="form-label">Sales Amount ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className="form-input"
                placeholder="0.00"
                value={formData.sales}
                onChange={(e) => setFormData({ ...formData, sales: e.target.value })}
              />
              {errors.sales && <span className="form-error">{errors.sales}</span>}
            </div>

            {/* Quantity */}
            <div className="form-group">
              <label className="form-label">Quantity *</label>
              <input
                type="number"
                min="1"
                className="form-input"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
              {errors.quantity && <span className="form-error">{errors.quantity}</span>}
            </div>

            {/* Discount (0 to 1.0) */}
            <div className="form-group">
              <label className="form-label">Discount Rate (0.00 to 1.00) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="1"
                className="form-input"
                placeholder="e.g. 0.15 for 15%"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              />
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Enter 0.20 for 20% discount</span>
              {errors.discount && <span className="form-error">{errors.discount}</span>}
            </div>

            {/* Profit */}
            <div className="form-group">
              <label className="form-label">Profit ($) *</label>
              <input
                type="number"
                step="0.01"
                className="form-input"
                placeholder="e.g. 45.50 or -10.20"
                value={formData.profit}
                onChange={(e) => setFormData({ ...formData, profit: e.target.value })}
              />
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Can be negative for a loss</span>
              {errors.profit && <span className="form-error">{errors.profit}</span>}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setFormData({
                order_id: `WEB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                order_date: new Date().toISOString().substring(0, 10),
                ship_date: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString().substring(0, 10),
                customer_name: '',
                region: 'Central',
                category: 'Technology',
                sub_category: 'Phones',
                product_name: '',
                sales: '',
                quantity: '1',
                discount: '0.00',
                profit: '',
              })}
            >
              Reset Form
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              <Send size={15} />
              <span>{isSubmitting ? 'Recording Sale...' : 'Save New Sale'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

