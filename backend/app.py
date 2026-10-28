from flask import Flask, jsonify, request
from flask_cors import CORS
from config import Config
from db import init_db, check_db_health
from services.sales_service import (
    create_sale_entry,
    update_sale_entry,
    delete_sale_entry,
    get_sales_records
)
from services.analytics_service import get_dashboard_summary

def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)

    # Initialize database on startup (ensures SalesEntry table exists safely)
    init_ok, init_msg = init_db()
    print(f"[DB INIT] {init_msg}")

    @app.route('/api/health', methods=['GET'])
    def health():
        status = check_db_health()
        return jsonify(status), (200 if status["db_connected"] else 500)

    @app.route('/api/dashboard/summary', methods=['GET'])
    def dashboard_summary():
        try:
            start_date = request.args.get('start_date', '')
            end_date = request.args.get('end_date', '')
            region = request.args.get('region', '')
            category = request.args.get('category', '')
            source = request.args.get('source', 'all')

            summary = get_dashboard_summary(
                start_date=start_date,
                end_date=end_date,
                region=region,
                category=category,
                source=source
            )
            return jsonify(summary), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/api/sales', methods=['GET'])
    def list_sales():
        try:
            page = int(request.args.get('page', 1))
            page_size = int(request.args.get('page_size', 10))
            search = request.args.get('search', '')
            region = request.args.get('region', '')
            category = request.args.get('category', '')
            start_date = request.args.get('start_date', '')
            end_date = request.args.get('end_date', '')
            source = request.args.get('source', 'all')

            data = get_sales_records(
                page=page,
                page_size=page_size,
                search=search,
                region=region,
                category=category,
                start_date=start_date,
                end_date=end_date,
                source=source
            )
            return jsonify(data), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/api/sales', methods=['POST'])
    def add_sale():
        try:
            data = request.get_json()
            if not data:
                return jsonify({"error": "No JSON payload provided"}), 400

            # Validate mandatory fields
            required_fields = ['order_id', 'order_date', 'ship_date', 'customer_name', 'region', 'category', 'sub_category', 'product_name', 'sales', 'quantity', 'profit']
            missing = [f for f in required_fields if f not in data or str(data[f]).strip() == '']
            if missing:
                return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

            success, created_record, msg = create_sale_entry(data)
            if success:
                return jsonify({"success": True, "sale": created_record, "message": msg}), 201
            else:
                return jsonify({"error": msg}), 500
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/api/sales/<int:entry_id>', methods=['PUT'])
    def update_sale(entry_id):
        try:
            data = request.get_json()
            if not data:
                return jsonify({"error": "No data provided"}), 400

            success, msg = update_sale_entry(entry_id, data)
            if success:
                return jsonify({"success": True, "message": msg}), 200
            else:
                return jsonify({"error": msg}), 400
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/api/sales/<int:entry_id>', methods=['DELETE'])
    def delete_sale(entry_id):
        try:
            success, msg = delete_sale_entry(entry_id)
            if success:
                return jsonify({"success": True, "message": msg}), 200
            else:
                return jsonify({"error": msg}), 400
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return app

if __name__ == '__main__':
    app = create_app()
    print(f"[STARTING] Retail BI Flask API starting on port {Config.FLASK_PORT}...")
    app.run(host='127.0.0.1', port=Config.FLASK_PORT, debug=Config.FLASK_DEBUG)
