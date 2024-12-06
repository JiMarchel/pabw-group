from flask import Flask, jsonify, request
import sqlite3
from flask import g, render_template
 
app = Flask(__name__)
 
def default_response(status: int, message: str, response):
    return {
	 "status" : status,
	 "message" : message,
	 "response" : response
	}

@app.route('/')
def index():
    return "Tidak ada konten"

def query_db(query, args=(), one=False):
    conn = sqlite3.connect('/Users/putramac/Documents/Web/microservice/src/db/database.db')
    cursor = conn.cursor()
    cursor.execute(query, args)
    rv = cursor.fetchall()
    conn.commit()
    conn.close()
    return (rv[0] if rv else None) if one else rv

@app.route("/api/v1/users", methods=['GET'])
def getUser():
    users = query_db('SELECT * FROM users')
    if not users:
        return jsonify(default_response(message="User tidak ditemukan", response=[], status=404)), 404
    return jsonify(default_response(status=200, message="Data ditemukan", response=[{'id': u[0], 'name': u[1], 'email': u[2]} for u in users]))

@app.route('/api/v1/users/<int:user_id>', methods=['GET'])
def getUserByID(user_id):
    user = query_db('SELECT * FROM users WHERE id = ?', (user_id,), one=True)
    if not user: 
        return jsonify(default_response(message="User tidak ditemukan", response=[], status=404)), 404
    return jsonify(default_response(status=200, message="User ditemukan", response={'id': user[0], 'name': user[1], 'email': user[2]}))

@app.route('/api/v1/users', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    if not name or not email:
        return jsonify(default_response(response=[], message="Nama atau email harus diisi", status=401)), 401
    try:
        query_db('INSERT INTO users (emial, password, name) VALUES (?, ?, ?)', (email, password, name))
        return jsonify(default_response(response=[], message="Berhasil register akun", status=200)), 200
    except sqlite3.IntegrityError:
        return jsonify(default_response(response=[], message="Gagal register akun, Email sudah terdaftar", status=401)), 401

 
if __name__ == "__main__":
    app.run(port=8000)
