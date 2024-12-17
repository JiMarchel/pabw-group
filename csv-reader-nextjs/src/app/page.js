"use client";
import { useState } from "react";
import Papa from "papaparse";

export default function CsvReader() {
  const [data, setData] = useState([]); // State to hold CSV data
  const [error, setError] = useState(null);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Use PapaParse to parse the CSV
    Papa.parse(file, {
      header: true, // Treat the first row as headers
      skipEmptyLines: true, // Skip empty lines
      complete: (result) => {
        setData(result.data); // Set the parsed data
        setError(null);
      },
      error: (err) => {
        setError("Error reading CSV file: " + err.message);
      },
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>CSV File Reader</h1>

      {/* File Input */}
      <input type="file" accept=".csv" onChange={handleFileUpload} />

      {/* Error Handling */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display CSV Data */}
      {data.length > 0 && (
        <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {data.length === 0 && <p>No data to display</p>}
    </div>
  );
}
