# Retail Sales Management & Business Intelligence System

An enterprise-grade **Retail Sales Management & BI Web Application** built on top of Microsoft SQL Server and Power BI. Designed as a portfolio-ready project demonstrating full-stack engineering, real-time analytics, database isolation, and BI dashboard integration.

---

## 🌟 System Architecture Overview

```
                          ┌─────────────────────────────┐
                          │   React + TypeScript UI     │
                          │  (Vite, Recharts, Lucide)   │
                          │   http://127.0.0.1:3000     │
                          └──────────────┬──────────────┘
                                         │ REST API
                                         ▼
                          ┌─────────────────────────────┐
                          │     Flask Backend API       │
                          │  (Python, pyodbc, CORS)     │
                          │   http://127.0.0.1:5000     │
                          └──────────────┬──────────────┘
                                         │ Parameterized SQL
                                         ▼
                 ┌───────────────────────────────────────────────┐
                 │       SQL Server Express (`Sales` DB)        │
                 │          DESKTOP-S3IGL87\SQLEXPRESS           │
                 ├───────────────────────┬───────────────────────┤
                 │ dbo.[sample_-_superstore] │    dbo.SalesEntry     │
                 │   (10,194 records)    │   (New web entries)   │
                 │  *Read-Only Baseline* │  *Mutations Allowed*  │
                 └───────────────────────┴───────────────────────┘
```

---

## 🛡️ Database Safety & Architecture

1. **Original Baseline Preserved (`dbo.[sample_-_superstore]`):**
   - 10,194 historical retail records.
   - Strictly read-only; no UPDATE or DELETE statements are ever executed against this table.
2. **Isolated Mutation Store (`dbo.SalesEntry`):**
   - Separate table created automatically in the existing `Sales` database.
   - Stores all sales added through the website with auto-incrementing `EntryID`, timestamps, and full transactional columns.
3. **No Double-Counting:**
   - Aggregations dynamically union the baseline and entry tables using parameterized queries, with an explicit `SourceType` column.
4. **Security:**
   - Database credentials and connection parameters are kept strictly in backend `.env` files and never exposed to the frontend browser.

---

## 🚀 Quick Start Guide

### 1. Start the Flask Backend API
```powershell
cd c:\Users\shapa\OneDrive\Desktop\PowerBi\Antigravity\backend
python app.py
```
*Runs on `http://127.0.0.1:5000` and automatically connects to `DESKTOP-S3IGL87\SQLEXPRESS`.*

### 2. Start the React Frontend
```powershell
cd c:\Users\shapa\OneDrive\Desktop\PowerBi\Antigravity\frontend
npm run dev
```
*Access the portal at `http://127.0.0.1:3000`.*

---

## 📊 Application Features

### 1. Executive Dashboard (`/`)
- **Key Performance Indicators:** Total Sales ($2.3M+), Total Profit ($292K+), Total Orders (5,111+), and Total Quantity Sold (38,654+).
- **Interactive Visualizations:**
  - Area Chart: Monthly Sales & Profit Trend over time.
  - Donut Chart: Sales by Product Category (Technology, Furniture, Office Supplies).
  - Bar Chart: Profit by Geographic Region (Central, East, South, West).
  - Horizontal Bar Chart: Sub-Category Sales & Profit Performance.
- **Dynamic Filters:** Filter by Start Date, End Date, Region, Category, and Data Source.
- **Auto-Refresh:** Configurable interval (15s, 30s, 60s, 5m) or 1-click manual refresh with timestamp.

### 2. Add New Sale (`/add-sale`)
- Form fields: Order ID, Order Date, Ship Date, Customer Name, Region, Category, Sub-Category, Product Name, Sales, Quantity, Discount, Profit.
- Features **Auto-Generate Order ID** and **Cascading Sub-Categories**.
- Input validation with instant visual feedback.
- Updates dashboard KPIs and database immediately upon submission.

### 3. Sales Records Management (`/sales-records`)
- Paginated table supporting 10, 25, or 50 rows per page.
- Real-time search across Order ID, Customer Name, and Product Name.
- Source filter to distinguish baseline Superstore data from website entries.
- Edit and Delete modals with safety guards preventing accidental modification of baseline records.

### 4. In-Depth Analytics (`/analytics`)
- Deep-dive charts for Average Order Value (AOV), overall profit margins, and category order distributions.

### 5. Power BI Integration (`/powerbi`)
- Dedicated section referencing your existing `sales.pbix` report.
- In-app embed URL loader with responsive iframe view and fullscreen toggle.
- Clear step-by-step instructions for publishing to Power BI Service.

---

## 📁 Folder Structure

```
Antigravity/
├── backend/
│   ├── app.py                     # Flask application routes and API endpoints
│   ├── config.py                  # Database connection configuration & .env loader
│   ├── db.py                      # SQL Server connection manager & schema initializer
│   ├── requirements.txt           # Python package dependencies
│   ├── .env                       # Local environment variables (server, db name)
│   ├── .env.example               # Template environment configuration
│   └── services/
│       ├── sales_service.py       # CRUD operations for SalesEntry & queries
│       └── analytics_service.py   # SQL aggregation queries for KPIs & charts
│
├── frontend/
│   ├── package.json               # Node.js dependencies
│   ├── vite.config.ts             # Vite build & proxy settings
│   ├── tsconfig.json              # TypeScript configuration
│   ├── index.html                 # HTML shell
│   └── src/
│       ├── App.tsx                # Main application component & layout state
│       ├── main.tsx               # Entry point
│       ├── index.css              # Custom BI theme styles (Navy/Blue/Clean cards)
│       ├── components/
│       │   ├── Navbar.tsx         # Header with status badge & refresh controls
│       │   ├── Sidebar.tsx        # Responsive navigation sidebar
│       │   ├── KpiCard.tsx        # KPI metrics display card
│       │   ├── FilterBar.tsx      # Multi-dimensional filter bar
│       │   └── ConfirmModal.tsx   # Modal for confirmation dialogs
│       ├── pages/
│       │   ├── Dashboard.tsx      # Main executive dashboard
│       │   ├── AddSale.tsx        # Sales creation form
│       │   ├── SalesRecords.tsx   # Paginated records table
│       │   ├── Analytics.tsx      # Advanced analytical charts
│       │   └── PowerBi.tsx        # Power BI dashboard integration
│       ├── services/
│       │   ├── api.ts             # API client with health checking & fallback
│       │   └── sampleData.ts      # Sample data schema & calculations
│       └── types/
│           └── sales.ts           # TypeScript type definitions
└── README.md
```

