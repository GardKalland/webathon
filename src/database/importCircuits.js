const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

// Path to database and CSV file
const dbPath = path.join(__dirname, 'f1.db');
const csvPath = path.join(__dirname, 'circuits.csv');

function importCircuits() {
  try {
    // Connect to the database directly
    console.log(`Connecting to database at ${dbPath}`);
    const db = new Database(dbPath, { readonly: false });
    
    // Read the CSV file
    console.log(`Reading CSV file from ${csvPath}`);
    const csvData = fs.readFileSync(csvPath, 'utf8');
    
    // Parse CSV data
    const circuits = parse(csvData, {
      columns: true,
      skip_empty_lines: true
    });
    
    console.log(`Parsed ${circuits.length} circuits from CSV file`);
    
    // Create a transaction to insert all circuits
    const insertCircuit = db.prepare(`
      INSERT OR REPLACE INTO circuits
      (circuitId, circuitRef, name, location, country, lat, lng, alt, url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    // Start a transaction
    const transaction = db.transaction((circuits) => {
      for (const circuit of circuits) {
        // Convert string values to appropriate types
        const lat = parseFloat(circuit.lat);
        const lng = parseFloat(circuit.lng);
        const alt = circuit.alt ? parseInt(circuit.alt) : null;
        
        insertCircuit.run(
          parseInt(circuit.circuitId),
          circuit.circuitRef,
          circuit.name,
          circuit.location,
          circuit.country,
          lat,
          lng,
          alt,
          circuit.url
        );
      }
      
      return circuits.length;
    });
    
    // Execute the transaction
    const insertedCount = transaction(circuits);
    console.log(`Successfully imported ${insertedCount} circuits into the database`);
    
    // Verify the data was inserted
    const count = db.prepare('SELECT COUNT(*) as count FROM circuits').get();
    console.log(`Total circuits in database: ${count.count}`);
    
    // Verify some data with coordinates
    const withCoords = db.prepare('SELECT COUNT(*) as count FROM circuits WHERE lat IS NOT NULL AND lng IS NOT NULL').get();
    console.log(`Circuits with coordinates: ${withCoords.count}`);
    
    // Show a sample
    const sample = db.prepare('SELECT circuitId, name, country, lat, lng FROM circuits LIMIT 3').all();
    console.log('Sample circuits:');
    console.log(sample);
    
    // Close the database
    db.close();
    
    console.log('Database connection closed');
    
    return {
      success: true,
      count: insertedCount
    };
  } catch (error) {
    console.error('Error importing circuits:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the import
importCircuits();