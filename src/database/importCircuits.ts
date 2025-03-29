import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { getDatabase } from './db';

/**
 * Imports circuit data from CSV file into the database
 */
function importCircuits() {
  try {
    // Get database connection
    const db = getDatabase();
    
    // Read the CSV file
    const csvFilePath = path.join(process.cwd(), 'src/database/circuits.csv');
    const csvData = fs.readFileSync(csvFilePath, 'utf8');
    
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
    
    return {
      success: true,
      message: `Successfully imported ${insertedCount} circuits into the database`,
      count: insertedCount
    };
  } catch (error) {
    console.error('Error importing circuits:', error);
    return {
      success: false,
      message: `Error importing circuits: ${error.message}`,
      error
    };
  }
}

// Export the function
export { importCircuits };