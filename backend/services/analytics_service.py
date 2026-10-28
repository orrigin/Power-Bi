import pyodbc
from typing import Dict, Any, List
from datetime import datetime
from db import get_db_connection

def get_dashboard_summary(
    start_date: str = "",
    end_date: str = "",
    region: str = "",
    category: str = "",
    source: str = "all"
) -> Dict[str, Any]:
    """
    Computes live aggregations directly from SQL Server.
    Combines dbo.[sample_-_superstore] and dbo.SalesEntry without double counting.
    Applies filters dynamically.
    """
    superstore_part = """
    SELECT 
        Order_ID AS OrderID,
        CONVERT(VARCHAR(10), Order_Date, 120) AS OrderDate,
        Region,
        Category,
        Sub_Category AS SubCategory,
        CAST(Sales AS FLOAT) AS Sales,
        CAST(Quantity AS INT) AS Quantity,
        CAST(Discount AS FLOAT) AS Discount,
        CAST(Profit AS FLOAT) AS Profit,
        'superstore' AS SourceType
    FROM dbo.[sample_-_superstore]
    """

    entry_part = """
    SELECT 
        OrderID,
        CONVERT(VARCHAR(10), OrderDate, 120) AS OrderDate,
        Region,
        Category,
        SubCategory,
        CAST(Sales AS FLOAT) AS Sales,
        CAST(Quantity AS INT) AS Quantity,
        CAST(Discount AS FLOAT) AS Discount,
        CAST(Profit AS FLOAT) AS Profit,
        'manual_entry' AS SourceType
    FROM dbo.SalesEntry
    """

    if source == 'superstore':
        unified_sql = f"SELECT * FROM ({superstore_part}) AS U"
    elif source == 'manual_entry':
        unified_sql = f"SELECT * FROM ({entry_part}) AS U"
    else:
        unified_sql = f"SELECT * FROM ({superstore_part} UNION ALL {entry_part}) AS U"

    where_clauses = []
    params: List[Any] = []

    if region and region != 'All':
        where_clauses.append("Region = ?")
        params.append(region)

    if category and category != 'All':
        where_clauses.append("Category = ?")
        params.append(category)

    if start_date:
        where_clauses.append("OrderDate >= ?")
        params.append(start_date)

    if end_date:
        where_clauses.append("OrderDate <= ?")
        params.append(end_date)

    where_sql = (" WHERE " + " AND ".join(where_clauses)) if where_clauses else ""
    target_cte = f"WITH FilteredSales AS ({unified_sql}{where_sql})"

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            # 1. Total KPI Aggregates
            kpi_query = f"""
            {target_cte}
            SELECT 
                ISNULL(SUM(Sales), 0) AS TotalSales,
                ISNULL(SUM(Profit), 0) AS TotalProfit,
                COUNT(DISTINCT OrderID) AS TotalOrders,
                ISNULL(SUM(Quantity), 0) AS TotalQuantity,
                ISNULL(AVG(Discount), 0) AS AvgDiscount
            FROM FilteredSales
            """
            cursor.execute(kpi_query, params)
            kpi_row = cursor.fetchone()
            total_sales = round(float(kpi_row[0]), 2)
            total_profit = round(float(kpi_row[1]), 2)
            total_orders = int(kpi_row[2])
            total_quantity = int(kpi_row[3])
            avg_discount = round(float(kpi_row[4]), 4)
            profit_margin = round((total_profit / total_sales * 100), 1) if total_sales > 0 else 0.0

            # 2. Sales by Category
            cat_query = f"""
            {target_cte}
            SELECT 
                Category,
                ISNULL(SUM(Sales), 0) AS CatSales,
                ISNULL(SUM(Profit), 0) AS CatProfit,
                COUNT(DISTINCT OrderID) AS CatOrders
            FROM FilteredSales
            GROUP BY Category
            ORDER BY CatSales DESC
            """
            cursor.execute(cat_query, params)
            sales_by_category = [
                {
                    "category": row[0],
                    "sales": round(float(row[1]), 2),
                    "profit": round(float(row[2]), 2),
                    "orders": int(row[3])
                }
                for row in cursor.fetchall()
            ]

            # 3. Monthly Sales & Profit Trend
            month_query = f"""
            {target_cte}
            SELECT 
                SUBSTRING(OrderDate, 1, 7) AS YearMonth,
                ISNULL(SUM(Sales), 0) AS MonthSales,
                ISNULL(SUM(Profit), 0) AS MonthProfit,
                COUNT(DISTINCT OrderID) AS MonthOrders
            FROM FilteredSales
            GROUP BY SUBSTRING(OrderDate, 1, 7)
            ORDER BY YearMonth ASC
            """
            cursor.execute(month_query, params)
            monthly_trend = []
            for row in cursor.fetchall():
                ym = row[0]
                try:
                    dt = datetime.strptime(ym, "%Y-%m")
                    month_label = dt.strftime("%b '%y")
                except Exception:
                    month_label = ym
                monthly_trend.append({
                    "month": month_label,
                    "yearMonth": ym,
                    "sales": round(float(row[1]), 2),
                    "profit": round(float(row[2]), 2),
                    "orders": int(row[3])
                })

            # 4. Profit by Region
            region_query = f"""
            {target_cte}
            SELECT 
                Region,
                ISNULL(SUM(Sales), 0) AS RegSales,
                ISNULL(SUM(Profit), 0) AS RegProfit
            FROM FilteredSales
            GROUP BY Region
            ORDER BY RegProfit DESC
            """
            cursor.execute(region_query, params)
            profit_by_region = []
            for row in cursor.fetchall():
                r_sales = round(float(row[1]), 2)
                r_profit = round(float(row[2]), 2)
                r_margin = round((r_profit / r_sales * 100), 1) if r_sales > 0 else 0.0
                profit_by_region.append({
                    "region": row[0],
                    "sales": r_sales,
                    "profit": r_profit,
                    "margin": r_margin
                })

            # 5. Sales by Sub-Category
            sub_query = f"""
            {target_cte}
            SELECT 
                SubCategory,
                Category,
                ISNULL(SUM(Sales), 0) AS SubSales,
                ISNULL(SUM(Profit), 0) AS SubProfit
            FROM FilteredSales
            GROUP BY SubCategory, Category
            ORDER BY SubSales DESC
            """
            cursor.execute(sub_query, params)
            sales_by_subcategory = [
                {
                    "sub_category": row[0],
                    "category": row[1],
                    "sales": round(float(row[2]), 2),
                    "profit": round(float(row[3]), 2)
                }
                for row in cursor.fetchall()
            ]

            # 6. Source Breakdown Counts
            breakdown_query = f"""
            {target_cte}
            SELECT 
                SourceType,
                COUNT(*) AS RecordCount
            FROM FilteredSales
            GROUP BY SourceType
            """
            cursor.execute(breakdown_query, params)
            counts_map = {row[0]: row[1] for row in cursor.fetchall()}

            return {
                "total_sales": total_sales,
                "total_profit": total_profit,
                "total_orders": total_orders,
                "total_quantity": total_quantity,
                "avg_discount": avg_discount,
                "profit_margin": profit_margin,
                "sales_by_category": sales_by_category,
                "monthly_trend": monthly_trend,
                "profit_by_region": profit_by_region,
                "sales_by_subcategory": sales_by_subcategory,
                "source_breakdown": {
                    "superstore_count": counts_map.get("superstore", 0),
                    "sales_entry_count": counts_map.get("manual_entry", 0)
                },
                "last_updated": datetime.now().strftime("%I:%M:%S %p")
            }
    except Exception as e:
        print("SQL Error in get_dashboard_summary:", e)
        raise e

