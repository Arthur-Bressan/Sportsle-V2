from flask import Flask, jsonify
import psycopg2
import os

app = Flask(__name__)

@app.route('/api/v1/health', methods=['GET'])
def health_check():
    try:
        db_url = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()
        cursor.execute("SELECT 1;")
        cursor.close()
        conn.close()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return jsonify({
        "status": "healthy",
        "database": db_status,
        "message": "Cano Vazio do Backend funcionando!"
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)