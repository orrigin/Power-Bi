import pyodbc
from typing import Optional, Tuple, Dict, Any
from config import Config

def get_db_connection() -> pyodbc.Connection:
    """Creates and returns an active pyodbc connection to the SQL Server database."""
    conn_str = Config.get_connection_string()
    return pyodbc.connect(conn_str, timeout=5)

def init_db() -> Tuple[bool, str]:
    """
    Ensures the separate SalesEntry table exists in the Sales database.
    Does NOT alter, modify, rename, or delete the original dbo.[sample_-_superstore] table.
    """
    create_table_sql = """
    IF NOT EXISTS (
        SELECT 1 FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'SalesEntry'
    )
    BEGIN
        CREATE TABLE dbo.SalesEntry (
            EntryID INT IDENTITY(1,1) PRIMARY KEY,
            OrderID NVARCHAR(50) NOT NULL,
            OrderDate DATE NOT NULL,
            ShipDate DATE NOT NULL,
            CustomerName NVARCHAR(150) NOT NULL,
            Region NVARCHAR(50) NOT NULL,
            Category NVARCHAR(50) NOT NULL,
            SubCategory NVARCHAR(50) NOT NULL,
            ProductName NVARCHAR(255) NOT NULL,
            Sales DECIMAL(18, 2) NOT NULL,
            Quantity INT NOT NULL,
            Discount DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
            Profit DECIMAL(18, 2) NOT NULL,
            CreatedAt DATETIME DEFAULT GETDATE(),
            UpdatedAt DATETIME DEFAULT GETDATE()
        );
    END
    """
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(create_table_sql)
            conn.commit()
            return True, "SalesEntry table verified / initialized successfully."
    except Exception as e:
        return False, f"Database initialization error: {str(e)}"

def check_db_health() -> Dict[str, Any]:
    """
    Checks connection to SQL Server and verifies existence of
    dbo.[sample_-_superstore] and dbo.SalesEntry without modifying anything.
    """
    result = {
        "db_connected": False,
        "server": Config.DB_SERVER,
        "db_name": Config.DB_NAME,
        "superstore_table_exists": False,
        "sales_entry_table_exists": False,
        "superstore_count": 0,
        "sales_entry_count": 0,
        "message": ""
    }
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            result["db_connected"] = True

            # Check superstore table
            cursor.execute(
                "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'sample_-_superstore'"
            )
            if cursor.fetchone()[0] > 0:
                result["superstore_table_exists"] = True
                cursor.execute("SELECT COUNT(*) FROM dbo.[sample_-_superstore]")
                result["superstore_count"] = cursor.fetchone()[0]

            # Check SalesEntry table
            cursor.execute(
                "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'SalesEntry'"
            )
            if cursor.fetchone()[0] > 0:
                result["sales_entry_table_exists"] = True
                cursor.execute("SELECT COUNT(*) FROM dbo.SalesEntry")
                result["sales_entry_count"] = cursor.fetchone()[0]

            result["message"] = f"Connected successfully to {Config.DB_SERVER} ({Config.DB_NAME})"
    except Exception as e:
        result["message"] = f"Failed to connect: {str(e)}"

    return result

