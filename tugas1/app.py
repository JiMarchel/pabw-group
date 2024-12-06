
from flask import Flask, render_template, redirect, url_for, request, session, flash
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)

class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']

        # Save user to the database
        new_user = User(username=username, password=password, email=email)
        db.session.add(new_user)
        db.session.commit()
        flash('Registration successful!', 'success')
        return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = User.query.filter_by(username=username, password=password).first()

        if user:
            session['user_id'] = user.id
            session['username'] = user.username
            flash(f'Welcome, {user.username}!', 'success')
            return redirect(url_for('profile', username=user.username))
        else:
            flash('Invalid credentials, please try again.', 'danger')
    return render_template('login.html')

@app.route('/profile/<username>', methods=['GET', 'POST'])
def profile(username):
    if 'user_id' not in session or session['username'] != username:
        return redirect(url_for('login'))

    user = User.query.filter_by(username=username).first()
    posts = Post.query.filter_by(user_id=user.id).order_by(Post.timestamp.desc()).all()

    if request.method == 'POST':
        content = request.form['content']
        new_post = Post(user_id=user.id, content=content)
        db.session.add(new_post)
        db.session.commit()
        flash('Post created!', 'success')
        return redirect(url_for('profile', username=username))

    return render_template('profile.html', user=user, posts=posts)

@app.route('/admin/dashboard')
def dashboard():
    if 'user_id' not in session or session['username'] != 'admin':
        return redirect(url_for('login'))

    users = User.query.all()
    posts = Post.query.order_by(Post.timestamp.desc()).all()
    return render_template('dashboard.html', users=users, posts=posts)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
