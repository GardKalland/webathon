import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: Database.Database | null = null;

// Singleton pattern to ensure we only create one database connection
export function getDatabase(): Database.Database {
  if (!db) {
    // Try to find the database file
    const possiblePaths = [
      path.join(process.cwd(), 'src/database/f1.db'),
      path.join(process.cwd(), './src/database/f1.db'),
      path.join(process.cwd(), '../src/database/f1.db'),
      path.resolve('./src/database/f1.db')
    ];
    
    let dbPath = '';
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        dbPath = testPath;
        console.log('Found database at:', dbPath);
        break;
      }
    }
    
    if (!dbPath) {
      throw new Error('Database file not found in any of the expected locations');
    }
    
    try {
      console.log('Connecting to database at:', dbPath);
      db = new Database(dbPath, { readonly: true });
      console.log('Database connection established successfully');
      
      // Verify tables exist
      try {
        const tableCount = db.prepare('SELECT count(*) as count FROM sqlite_master WHERE type = ?').get('table');
        console.log('Tables in database:', tableCount.count);
        
        // Get the list of tables
        const tables = db.prepare('SELECT name FROM sqlite_master WHERE type = ?').all('table');
        console.log('Table names:', tables.map(t => t.name).join(', '));
        
        // Check if races table exists and has data
        if (tables.some(t => t.name === 'races')) {
          const raceCount = db.prepare('SELECT count(*) as count FROM races').get();
          console.log('Races in database:', raceCount.count);
          
          // Check races by year
          const yearCounts = db.prepare('SELECT year, COUNT(*) as count FROM races GROUP BY year ORDER BY year DESC LIMIT 5').all();
          console.log('Recent years with race counts:', yearCounts);
        } else {
          console.error('Races table not found in database');
        }
      } catch (err) {
        console.error('Error verifying database content:', err);
      }
    } catch (error) {
      console.error('Failed to connect to database:', error);
      throw error;
    }
  }
  
  return db;
}

// Close the database connection when the app is shutting down
export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
    console.log('Database connection closed');
  }
}