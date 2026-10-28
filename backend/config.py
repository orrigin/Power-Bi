import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    DB_SERVER = os.getenv('DB_SERVER', r'DESKTOP-S3IGL87\SQLEXPRESS')
    DB_NAME = os.getenv('DB_NAME', 'Sales')
    DB_DRIVER = os.getenv('DB_DRIVER', 'ODBC Driver 17 for SQL Server')
    DB_TRUSTED_CONNECTION = os.getenv('DB_TRUSTED_CONNECTION', 'yes')
    DB_USER = os.getenv('DB_USER', '')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')

    FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))
    FLASK_DEBUG = os.getenv('FLASK_DEBUG', 'False').lower() in ('true', '1')

    @classmethod
    def get_connection_string(cls) -> str:
        """Construct a secure pyodbc connection string."""
        if cls.DB_TRUSTED_CONNECTION.lower() in ('yes', 'true'):
            return (
                f"Driver={{{cls.DB_DRIVER}}};"
                f"Server={cls.DB_SERVER};"
                f"Database={cls.DB_NAME};"
                f"Trusted_Connection=yes;"
                f"TrustServerCertificate=yes;"
            )
        else:
            return (
                f"Driver={{{cls.DB_DRIVER}}};"
                f"Server={cls.DB_SERVER};"
                f"Database={cls.DB_NAME};"
                f"UID={cls.DB_USER};"
                f"PWD={cls.DB_PASSWORD};"
                f"TrustServerCertificate=yes;"
            )

