package main

import (
	"encoding/csv"
	"fmt"
	"html/template"
	"net/http"
	"os"
)

// Data structure to hold CSV rows
type Row struct {
	Columns []string
}

func main() {
	// Define an HTTP route for the root URL
	http.HandleFunc("/", serveCSV)

	// Start the server
	fmt.Println("Server is running at http://localhost:8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println("Error starting server:", err)
	}
}

// Handler to serve the CSV data
func serveCSV(w http.ResponseWriter, r *http.Request) {
	// Open the CSV file
	file, err := os.Open("cars.csv")
	if err != nil {
		http.Error(w, "Failed to open CSV file", http.StatusInternalServerError)
		return
	}
	defer file.Close()

	// Read the CSV file
	reader := csv.NewReader(file)
	records, err := reader.ReadAll()
	if err != nil {
		http.Error(w, "Failed to read CSV file", http.StatusInternalServerError)
		return
	}

	// Prepare rows for rendering
	var rows []Row
	for _, record := range records {
		rows = append(rows, Row{Columns: record})
	}

	// Parse and render the HTML template
	tmpl := template.Must(template.New("table").Parse(`
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<title>CSV Data</title>
			<style>
				table { border-collapse: collapse; width: 80%; margin: 20px auto; }
				th, td { border: 1px solid black; padding: 8px; text-align: center; }
				th { background-color: #f2f2f2; }
			</style>
		</head>
		<body>
			<h1 style="text-align: center;">CSV Data Table</h1>
			<table>
				{{range $i, $row := .}}
					<tr>
						{{range $row.Columns}}
							<td>{{.}}</td>
						{{end}}
					</tr>
				{{end}}
			</table>
		</body>
		</html>
	`))

	tmpl.Execute(w, rows)
}
