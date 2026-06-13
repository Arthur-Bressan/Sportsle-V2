from flask import Flask, jsonify
from flask_cors import CORS  # 1. Importa o CORS
import psycopg2
import os

app = Flask(__name__)
CORS(app)  # 2. Libera o acesso para o Frontend de forma segura

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

@app.route('/api/v1/athletes', methods=['GET'])
def get_athletes():
    try:
        db_url = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()
        
        # Busca os dados do banco
        cursor.execute("SELECT id, name FROM athletes;")
        rows = cursor.fetchall()
        
        # Transforma os dados em uma lista de dicionários (JSON)
        athletes = []
        for row in rows:
            athletes.append({
                "id": row[0],
                "name": row[1]
            })
            
        cursor.close()
        conn.close()
        return jsonify(athletes), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)