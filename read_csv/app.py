from flask import Flask, render_template
import csv

app = Flask(__name__)

# Function to read CSV file
def read_csv(file_path):
    with open(file_path, "r") as file:
        csv_reader = csv.reader(file)
        headers = next(csv_reader)  # Get the first row as headers
        rows = [row for row in csv_reader]  # Remaining rows
    return headers, rows

@app.route("/")
def table_page():
    file_path = "cars.csv"  # Path to your CSV file
    headers, rows = read_csv(file_path)
    return render_template("table.html", headers=headers, rows=rows)

if __name__ == "__main__":
    app.run(debug=True)

