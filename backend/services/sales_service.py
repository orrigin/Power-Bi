import pyodbc
from typing import Dict, Any, List, Tuple
from db import get_db_connection

def create_sale_entry(data: Dict[str, Any]) -> Tuple[bool, Dict[str, Any], str]:
    """
    Inserts a newly entered sale into the isolated dbo.SalesEntry table.
    Uses parameterized SQL to prevent SQL injection.
    """
    insert_sql = """
    INSERT INTO dbo.SalesEntry 
    (OrderID, OrderDate, ShipDate, CustomerName, Region, Category, SubCategory, ProductName, Sales, Quantity, Discount, Profit)
    OUTPUT INSERTED.EntryID, INSERTED.CreatedAt
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                insert_sql,
                (
                    data['order_id'],
                    data['order_date'],
                    data['ship_date'],
                    data['customer_name'],
                    data['region'],
                    data['category'],
                    data['sub_category'],
                    data['product_name'],
                    float(data['sales']),
                    int(data['quantity']),
                    float(data.get('discount', 0.0)),
                    float(data['profit'])
                )
            )
            row = cursor.fetchone()
            entry_id = row[0]
            created_at = str(row[1]) if row[1] else None
            conn.commit()

            created_record = {
                **data,
                "entry_id": entry_id,
                "id": f"entry_{entry_id}",
                "source": "manual_entry",
                "created_at": created_at
            }
            return True, created_record, "Sale recorded successfully in SalesEntry table."
    except Exception as e:
        return False, {}, f"Database insertion error: {str(e)}"

def update_sale_entry(entry_id: int, data: Dict[str, Any]) -> Tuple[bool, str]:
    """
    Updates an existing record in dbo.SalesEntry.
    Only allows modifications to SalesEntry; never touches dbo.[sample_-_superstore].
    """
    update_sql = """
    UPDATE dbo.SalesEntry
    SET CustomerName = ?,
        Region = ?,
        ProductName = ?,
        Sales = ?,
        Quantity = ?,
        Discount = ?,
        Profit = ?,
        UpdatedAt = GETDATE()
    WHERE EntryID = ?
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                update_sql,
                (
                    data['customer_name'],
                    data['region'],
                    data['product_name'],
                    float(data['sales']),
                    int(data['quantity']),
                    float(data.get('discount', 0.0)),
                    float(data['profit']),
                    int(entry_id)
                )
            )
            if cursor.rowcount == 0:
                return False, f"No record found in SalesEntry with EntryID {entry_id}."
            conn.commit()
            return True, "Record in SalesEntry updated successfully."
    except Exception as e:
        return False, f"Update error: {str(e)}"

def delete_sale_entry(entry_id: int) -> Tuple[bool, str]:
    """
    Deletes an existing record from dbo.SalesEntry.
    Only operates on SalesEntry; never deletes from dbo.[sample_-_superstore].
    """
    delete_sql = "DELETE FROM dbo.SalesEntry WHERE EntryID = ?"
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(delete_sql, (int(entry_id),))
            if cursor.rowcount == 0:
                return False, f"No record found in SalesEntry with EntryID {entry_id}."
            conn.commit()
            return True, "Record removed successfully from SalesEntry."
    except Exception as e:
        return False, f"Deletion error: {str(e)}"

def get_sales_records(
    page: int = 1,
    page_size: int = 10,
    search: str = "",
    region: str = "",
    category: str = "",
    start_date: str = "",
    end_date: str = "",
    source: str = "all"
) -> Dict[str, Any]:
    """
    Retrieves paginated, filtered, and searched sales records.
    Supports source filtering: 'all', 'superstore', or 'manual_entry'.
    Ensures clear separation and parameterized filtering.
    """
    # Base unified query
    superstore_part = """
    SELECT 
        CAST(Row_ID AS VARCHAR(50)) AS RecordID,
        Order_ID AS OrderID,
        CONVERT(VARCHAR(10), Order_Date, 120) AS OrderDate,
        CONVERT(VARCHAR(10), Ship_Date, 120) AS ShipDate,
        Customer_Name AS CustomerName,
        Region,
        Category,
        Sub_Category AS SubCategory,
        Product_Name AS ProductName,
        CAST(Sales AS FLOAT) AS Sales,
        CAST(Quantity AS INT) AS Quantity,
        CAST(Discount AS FLOAT) AS Discount,
        CAST(Profit AS FLOAT) AS Profit,
        'superstore' AS SourceType,
        NULL AS EntryID
    FROM dbo.[sample_-_superstore]
    """

    entry_part = """
    SELECT 
        CAST(EntryID AS VARCHAR(50)) AS RecordID,
        OrderID,
        CONVERT(VARCHAR(10), OrderDate, 120) AS OrderDate,
        CONVERT(VARCHAR(10), ShipDate, 120) AS ShipDate,
        CustomerName,
        Region,
        Category,
        SubCategory,
        ProductName,
        CAST(Sales AS FLOAT) AS Sales,
        CAST(Quantity AS INT) AS Quantity,
        CAST(Discount AS FLOAT) AS Discount,
        CAST(Profit AS FLOAT) AS Profit,
        'manual_entry' AS SourceType,
        EntryID
    FROM dbo.SalesEntry
    """

    if source == 'superstore':
        base_query = f"SELECT * FROM ({superstore_part}) AS UnifiedSales"
    elif source == 'manual_entry':
        base_query = f"SELECT * FROM ({entry_part}) AS UnifiedSales"
    else:
        base_query = f"SELECT * FROM ({superstore_part} UNION ALL {entry_part}) AS UnifiedSales"

    where_clauses = []
    params: List[Any] = []

    if search.strip():
        search_pattern = f"%{search.strip()}%"
        where_clauses.append("(OrderID LIKE ? OR CustomerName LIKE ? OR ProductName LIKE ?)")
        params.extend([search_pattern, search_pattern, search_pattern])

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

    # Count total
    count_sql = f"SELECT COUNT(*) FROM ({base_query}{where_sql}) AS TotalCount"

    # Paginated query
    offset = (page - 1) * page_size
    paged_sql = f"""
    SELECT * FROM ({base_query}{where_sql}) AS FinalRecords
    ORDER BY OrderDate DESC, RecordID DESC
    OFFSET ? ROWS FETCH NEXT ? ROWS ONLY
    """

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            # Execute count
            cursor.execute(count_sql, params)
            total = cursor.fetchone()[0]

            # Execute pagination
            paged_params = list(params) + [offset, page_size]
            cursor.execute(paged_sql, paged_params)
            rows = cursor.fetchall()

            records = []
            for r in rows:
                records.append({
                    "id": f"{r.SourceType}_{r.RecordID}",
                    "order_id": r.OrderID,
                    "order_date": r.OrderDate,
                    "ship_date": r.ShipDate,
                    "customer_name": r.CustomerName,
                    "region": r.Region,
                    "category": r.Category,
                    "sub_category": r.SubCategory,
                    "product_name": r.ProductName,
                    "sales": round(float(r.Sales or 0.0), 2),
                    "quantity": int(r.Quantity or 0),
                    "discount": round(float(r.Discount or 0.0), 2),
                    "profit": round(float(r.Profit or 0.0), 2),
                    "source": r.SourceType,
                    "entry_id": r.EntryID
                })

            return {"total": total, "sales": records, "page": page, "page_size": page_size}
    except Exception as e:
        print("SQL Error in get_sales_records:", e)
        return {"total": 0, "sales": [], "page": page, "page_size": page_size, "error": str(e)}

