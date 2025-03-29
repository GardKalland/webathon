import { getDatabase } from '@/database/db';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const db = getDatabase();
    const results = {
      connection: 'ok',
      timestamp: new Date().toISOString()
    };
    
    // Check database tables
    try {
      // Use parameterized query for better safety
      const tableCount = db.prepare('SELECT count(*) as count FROM sqlite_master WHERE type = ?').get('table');
      results['table_count'] = tableCount.count;
      
      const tables = db.prepare('SELECT name FROM sqlite_master WHERE type = ?').all('table');
      results['tables'] = tables.map(t => t.name);
      
      // Count races
      if (tables.some(t => t.name === 'races')) {
        const raceCount = db.prepare('SELECT COUNT(*) as count FROM races').get();
        results['races_count'] = raceCount.count;
        
        // Get race count by year
        const yearCounts = db.prepare('SELECT year, COUNT(*) as count FROM races GROUP BY year ORDER BY year DESC').all();
        results['years'] = yearCounts;
        
        // Check if 2023 has races
        const races2023Count = db.prepare('SELECT COUNT(*) as count FROM races WHERE year = ?').get(2023);
        results['races_2023_count'] = races2023Count.count;
        
        if (races2023Count.count > 0) {
          // Get sample 2023 races
          const races2023 = db.prepare('SELECT raceId, year, name, date, round FROM races WHERE year = ? ORDER BY round ASC').all(2023);
          results['races_2023'] = races2023;
          
          // Get a specific race with circuit join
          if (races2023.length > 0) {
            const firstRaceId = races2023[0].raceId;
            const raceWithCircuit = db.prepare(`
              SELECT r.raceId, r.year, r.round, r.name, r.date, r.time, 
                     c.name as circuit, c.location, c.country, c.lat, c.lng
              FROM races r
              JOIN circuits c ON r.circuitId = c.circuitId
              WHERE r.raceId = ?
            `).get(firstRaceId);
            
            results['sample_race_with_circuit'] = raceWithCircuit;
          }
        }
      }
      
      // Check circuits
      if (tables.some(t => t.name === 'circuits')) {
        const circuitCount = db.prepare('SELECT COUNT(*) as count FROM circuits').get();
        results['circuits_count'] = circuitCount.count;
        
        if (circuitCount.count > 0) {
          // Get a few sample circuits
          const sampleCircuits = db.prepare('SELECT circuitId, name, location, country, lat, lng FROM circuits LIMIT 3').all();
          results['sample_circuits'] = sampleCircuits;
        }
      }
      
      // Do a test query that should match our API call
      const testYear = 2023;
      const testQuery = db.prepare(`
        SELECT r.raceId, r.year, r.round, r.name, r.date, r.time,
              c.name as circuit, c.location, c.country, c.lat, c.lng, c.circuitId
        FROM races r
        JOIN circuits c ON r.circuitId = c.circuitId
        WHERE r.year = ?
        ORDER BY r.round ASC
      `).all(testYear);
      
      results['test_query_count'] = testQuery.length;
      if (testQuery.length > 0) {
        results['test_query_first_item'] = testQuery[0];
      }
      
    } catch (error) {
      results['error'] = error.message || 'Unknown error';
      results['error_name'] = error.name;
      results['error_stack'] = error.stack;
    }
    
    return Response.json(results);
  } catch (err) {
    return Response.json({
      error: err instanceof Error ? err.message : 'Unknown error occurred',
      error_name: err instanceof Error ? err.name : 'Unknown',
      status: 'error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}