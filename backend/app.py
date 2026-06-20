# backend/app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
import os
from datetime import date

app = Flask(__name__)
CORS(app)


def get_db():
    return psycopg2.connect(
        host=os.getenv("DB_HOST", "db"),
        database=os.getenv("DB_NAME", "sportsle"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "postgres"),
    )


# ============================================================
# GET /api/v1/athletes
# Retorna lista de atletas para o autocomplete
# ============================================================

@app.get("/api/v1/athletes")
def list_athletes():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT id, name FROM athletes ORDER BY name")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify([{"id": r[0], "name": r[1]} for r in rows])


# ============================================================
# POST /api/v1/guess
# Recebe athlete_id, compara com atleta do dia
# ============================================================

@app.post("/api/v1/guess")
def make_guess():
    data = request.get_json()
    athlete_id = data.get("athlete_id")

    if not athlete_id:
        return jsonify({"error": "athlete_id é obrigatório"}), 400

    conn = get_db()
    cur = conn.cursor()

    # Busca atleta do dia
    cur.execute(
        "SELECT athlete_id FROM daily_games WHERE game_date = %s",
        (date.today(),)
    )
    row = cur.fetchone()

    if not row:
        cur.close()
        conn.close()
        return jsonify({"error": "Nenhum jogo configurado para hoje"}), 404

    secret_athlete_id = row[0]

    # Se acertou direto, nem precisa comparar atributo
    if athlete_id == secret_athlete_id:
        cur.execute(
            "SELECT name, country, sport, birth_year, is_retired "
            "FROM athletes WHERE id = %s",
            (athlete_id,)
        )
        a = cur.fetchone()
        cur.close()
        conn.close()
        return jsonify({
            "correct": True,
            "guess": {
                "name": a[0],
                "country": a[1],
                "sport": a[2],
                "birth_year": a[3],
                "is_retired": a[4],
            },
            "comparison": {
                "country": True,
                "sport": True,
                "birth_year": True,
                "is_retired": True,
            },
        })

    # Busca dados do palpite e do secreto
    cur.execute(
        "SELECT name, country, sport, birth_year, is_retired "
        "FROM athletes WHERE id = %s",
        (athlete_id,)
    )
    guess = cur.fetchone()

    cur.execute(
        "SELECT name, country, sport, birth_year, is_retired "
        "FROM athletes WHERE id = %s",
        (secret_athlete_id,)
    )
    secret = cur.fetchone()

    cur.close()
    conn.close()

    comparison = {
        "country": guess[1] == secret[1],
        "sport": guess[2] == secret[2],
        "birth_year": guess[3] == secret[3],
        "is_retired": guess[4] == secret[4],
    }

    return jsonify({
        "correct": False,
        "guess": {
            "name": guess[0],
            "country": guess[1],
            "sport": guess[2],
            "birth_year": guess[3],
            "is_retired": guess[4],
        },
        "comparison": comparison,
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)