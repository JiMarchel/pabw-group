import sqlite3

connection = sqlite3.connect('database.db')


with open('users.sql') as f:
    connection.executescript(f.read())

cur = connection.cursor()

cur.execute("INSERT INTO posts (title, content) VALUES (?, ?)",
            ('First Post', 'Content for the first post')
            )

cur.execute("INSERT INTO posts (title, content) VALUES (?, ?)",
            ('Second Post', 'Content for the second post')
            )

cur.execute("INSERT INTO users (email, password, name) VALUES (?, ?, ?)", ("putrabudianto23@gmail.com", "HelloWorld23", "Saputra Budianto"))

connection.commit()
connection.close()