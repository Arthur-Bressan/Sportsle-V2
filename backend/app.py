import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app) 

def get_db_connection():
    db_url = os.environ.get('DATABASE_URL')
    return psycopg2.connect(db_url)

# -------------------------------------------------------------
# 1. ROTA: Listar atletas com ID e Nome
# -------------------------------------------------------------
@app.route('/api/v1/athletes', methods=['GET'])
def get_athletes():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Buscamos apenas o necessário para preencher o input do autocomplete
        cursor.execute("SELECT id, name FROM athletes ORDER BY name ASC;")
        rows = cursor.fetchall()
        
        athletes = [{"id": row[0], "name": row[1]} for row in rows]
        
        cursor.close()
        conn.close()
        return jsonify(athletes), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------------------------------------
# 2. ROTA: Processar o Palpite do Usuário
# -------------------------------------------------------------
@app.route('/api/v1/guess', methods=['POST'])
def process_guess():
    try:
        data = request.get_json()
        guessed_id = data.get('athlete_id')
        
        if not guessed_id:
            return jsonify({"error": "O campo 'athlete_id' é obrigatório"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # PASSO 1: Descobrir quem é o atleta secreto do dia atual
        cursor.execute("""
            SELECT a.id, a.name, a.country, a.sport, a.birth_year, a.is_retired 
            FROM daily_games dg
            JOIN athletes a ON dg.athlete_id = a.id
            WHERE dg.game_date = CURRENT_DATE;
        """)
        secret_row = cursor.fetchone()

        if not secret_row:
            cursor.close()
            conn.close()
            return jsonify({"error": "Nenhum atleta configurado para o dia de hoje."}), 404

        # Mapeando o Atleta Secreto
        secret = {
            "id": secret_row[0], "name": secret_row[1], "country": secret_row[2],
            "sport": secret_row[3], "birth_year": secret_row[4], "is_retired": secret_row[5]
        }

        # PASSO 2: Buscar os dados do atleta que o usuário chutou
        cursor.execute("""
            SELECT id, name, country, sport, birth_year, is_retired 
            FROM athletes 
            WHERE id = %s;
        """, (guessed_id,))
        guess_row = cursor.fetchone()

        if not guess_row:
            cursor.close()
            conn.close()
            return jsonify({"error": "Atleta chutado não encontrado no banco de dados."}), 404

        # Mapeando o Chute do Usuário
        guess = {
            "id": guess_row[0], "name": guess_row[1], "country": guess_row[2],
            "sport": guess_row[3], "birth_year": guess_row[4], "is_retired": guess_row[5]
        }

        cursor.close()
        conn.close()

        # PASSO 3: Comparação de Atributos
        is_correct = (secret["id"] == guess["id"])
        
        comparison = {
            "country": (secret["country"] == guess["country"]),
            "sport": (secret["sport"] == guess["sport"]),
            "is_retired": (secret["is_retired"] == guess["is_retired"]),
            # Para o ano, podemos retornar "equal", "higher" ou "lower" para ajudar o usuário com setas!
            "birth_year": "equal" if secret["birth_year"] == guess["birth_year"] 
                           else "higher" if secret["birth_year"] > guess["birth_year"] 
                           else "lower"
        }

        # PASSO 4: Montar a resposta perfeita para o React renderizar
        response = {
            "correct": is_correct,
            "guess": {
                "id": guess["id"],
                "name": guess["name"],
                "country": guess["country"],
                "sport": guess["sport"],
                "birth_year": guess["birth_year"],
                "is_retired": guess["is_retired"]
            },
            "comparison": comparison
        }

        return jsonify(response), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)