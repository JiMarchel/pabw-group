from flask import Flask, jsonify, request
import sqlite3
from flask import g, render_template
from cryptography.fernet import Fernet

key = Fernet.generate_key()
cipher = Fernet(key)
 
app = Flask(__name__)
 
def default_response(status: int, message: str, response):
    return {
	 "status" : status,
	 "message" : message,
	 "response" : response
	}

# Encrypt a password
def encrypt_password(password):
    password_bytes = password.encode()  # Convert to bytes
    encrypted_password = cipher.encrypt(password_bytes)
    return encrypted_password

# Decrypt a password
def decrypt_password(encrypted_password):
    decrypted_password = cipher.decrypt(encrypted_password)
    return decrypted_password.decode()  # Convert bytes back to string


@app.route('/')
def index():
    return "Tidak ada konten"

def query_db(query, args=(), one=False):
    conn = sqlite3.connect('/Users/putramac/Documents/Web/pabw-group/microservice/src/db/database.db')
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

@app.route('/api/v1/users/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify(default_response(response=[], message="Email atau password harus diisi", status=401)), 401
    password = encrypt_password(password=password)
    user = query_db('SELECT * FROM users WHERE email = ? AND password = ?', (email, password))
    if not user: 
        return jsonify(default_response(message="User tidak ditemukan", response=[], status=404)), 404
    return jsonify(default_response(status=200, message="Login berhasil", response={'id': user[0], 'name': user[1], 'email': user[2]}))

@app.route('/api/v1/users/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    print(name)
    print(email)
    print(password)

    if not name or not email:
        return jsonify(default_response(response=[], message="Nama atau email harus diisi", status=401)), 401
    try:
        password = encrypt_password(password=password)
        print(password)
        query_db('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', (email, password, name))
        return jsonify(default_response(response=[], message="Berhasil register akun", status=200))
    except sqlite3.IntegrityError:
        return jsonify(default_response(response=[], message="Gagal register akun, Email sudah terdaftar", status=401)), 401

@app.route('/api/v1/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.get_json()
    name = data.get('name')
    password = data.get("password")

    if not name or not password:
        return jsonify(default_response(response=[], message="Nama atau email harus diisi", status=401)), 401
    
    try:
        if not query_db('SELECT * FROM users WHERE id = ?', (user_id,), one=True):
            return jsonify(default_response(response=[], message="User tidak ditemukan", status=404)), 404
        
        if query_db('UPDATE users SET name = ?, password = ? WHERE id = ?', (name, password, user_id)):
            return jsonify(default_response(response=[], message="Berhasil mengupdate akun", status=200)), 200
        else:
            return jsonify(default_response(response=[], message="Gagal mengupdate akun", status=401)), 401
    except sqlite3.IntegrityError as e:
        return jsonify(default_response(response=[], message="Gagal mengupdate user", status=401)), 401

@app.route('/api/v1/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        if not query_db('SELECT * FROM users WHERE id = ?', (user_id,), one=True):
            return jsonify(default_response(response=[], message="User tidak ditemukan", status=404)), 404
        
        if query_db('UPDATE users SET deleted = ? WHERE id = ?', (True, user_id)):
            return jsonify(default_response(response=[], message="Berhasil menghapus akun", status=200)), 200
        else:
            return jsonify(default_response(response=[], message="Gagal menghapus akun", status=401)), 401
    except sqlite3.IntegrityError as e:
        return jsonify(default_response(response=[], message="Gagal menghapus data", status=401)), 401


if __name__ == "__main__":
    app.run(port=8000, debug=True)
