import { getDatabase } from './db';

// Simple in-memory cache for database queries
type CacheEntry = {
  data: any;
  timestamp: number;
}

const cache: Record<string, CacheEntry> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * F1 Database Service
 * Provides specialized queries for F1 historical data with caching
 */
export const f1Service = {
  /**
   * Get a driver's complete history
   * @param driverId Driver ID or surname
   */
  getDriverHistory(driverId: string | number) {
    const db = getDatabase();
    const query = typeof driverId === 'number' 
      ? db.prepare(`
          SELECT r.year, r.name as race_name, r.round, c.name as circuit_name,
                 rs.position, rs.points, rs.status, 
                 c.country, c.location
          FROM results rs
          JOIN races r ON rs.raceId = r.raceId
          JOIN circuits c ON r.circuitId = c.circuitId
          JOIN drivers d ON rs.driverId = d.driverId
          WHERE d.driverId = ?
          ORDER BY r.year DESC, r.round ASC`)
      : db.prepare(`
          SELECT r.year, r.name as race_name, r.round, c.name as circuit_name,
                 rs.position, rs.points, rs.status,
                 c.country, c.location, d.driverId
          FROM results rs
          JOIN races r ON rs.raceId = r.raceId
          JOIN circuits c ON r.circuitId = c.circuitId
          JOIN drivers d ON rs.driverId = d.driverId
          WHERE d.surname LIKE ? OR d.forename LIKE ?
          ORDER BY r.year DESC, r.round ASC`);
    
    return typeof driverId === 'number'
      ? query.all(driverId)
      : query.all(`%${driverId}%`, `%${driverId}%`);
  },

  /**
   * Get results for a specific race
   * @param year Race year
   * @param round Race round number or name
   */
  getRaceResults(year: number, round: number | string) {
    // Create a cache key based on the function name and parameters
    const cacheKey = `getRaceResults_${year}_${round}`;
    
    // Check if we have a valid cached result
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) {
      console.log(`Cache hit for ${cacheKey}`);
      return cache[cacheKey].data;
    }
    
    // If no cache or expired, execute the query
    console.log(`Cache miss for ${cacheKey}, querying database`);
    const db = getDatabase();
    const query = typeof round === 'number'
      ? db.prepare(`
          SELECT d.forename, d.surname, t.name as team, rs.position, 
                 rs.points, rs.status, r.name as race_name, c.name as circuit,
                 r.date, r.time, r.raceId, r.year, r.round, c.lat, c.lng, c.location, c.country, c.circuitId
          FROM results rs
          JOIN races r ON rs.raceId = r.raceId
          JOIN drivers d ON rs.driverId = d.driverId
          JOIN constructors t ON rs.constructorId = t.constructorId
          JOIN circuits c ON r.circuitId = c.circuitId
          WHERE r.year = ? AND r.round = ?
          ORDER BY rs.position ASC`)
      : db.prepare(`
          SELECT d.forename, d.surname, t.name as team, rs.position, 
                 rs.points, rs.status, r.name as race_name, c.name as circuit,
                 r.date, r.time, r.raceId, r.year, r.round, c.lat, c.lng, c.location, c.country, c.circuitId
          FROM results rs
          JOIN races r ON rs.raceId = r.raceId
          JOIN drivers d ON rs.driverId = d.driverId
          JOIN constructors t ON rs.constructorId = t.constructorId
          JOIN circuits c ON r.circuitId = c.circuitId
          WHERE r.year = ? AND r.name LIKE ?
          ORDER BY rs.position ASC`);
    
    const result = typeof round === 'number'
      ? query.all(year, round)
      : query.all(year, `%${round}%`);
    
    // Cache the result
    cache[cacheKey] = {
      data: result,
      timestamp: Date.now()
    };
    
    return result;
  },

  /**
   * Get the history of races at a specific circuit
   * @param circuitId Circuit ID or name
   */
  getCircuitHistory(circuitId: string | number) {
    const db = getDatabase();
    const query = typeof circuitId === 'number'
      ? db.prepare(`
          SELECT r.year, r.name as race_name, r.date, r.time,
                 d.forename, d.surname, t.name as team, rs.position
          FROM races r
          JOIN circuits c ON r.circuitId = c.circuitId
          JOIN results rs ON r.raceId = rs.raceId
          JOIN drivers d ON rs.driverId = d.driverId
          JOIN constructors t ON rs.constructorId = t.constructorId
          WHERE c.circuitId = ? AND rs.position = 1
          ORDER BY r.year DESC`)
      : db.prepare(`
          SELECT r.year, r.name as race_name, r.date, r.time,
                 d.forename, d.surname, t.name as team, rs.position, c.name as circuit
          FROM races r
          JOIN circuits c ON r.circuitId = c.circuitId
          JOIN results rs ON r.raceId = rs.raceId
          JOIN drivers d ON rs.driverId = d.driverId
          JOIN constructors t ON rs.constructorId = t.constructorId
          WHERE (c.name LIKE ? OR c.country LIKE ? OR c.location LIKE ?) AND rs.position = 1
          ORDER BY r.year DESC`);
    
    return typeof circuitId === 'number'
      ? query.all(circuitId)
      : query.all(`%${circuitId}%`, `%${circuitId}%`, `%${circuitId}%`);
  },

  /**
   * Get a list of all drivers
   */
  getAllDrivers() {
    const db = getDatabase();
    return db.prepare(`
      SELECT d.driverId, d.forename, d.surname, d.nationality, d.dob
      FROM drivers d
      ORDER BY d.surname ASC`).all();
  },

  /**
   * Get a list of all circuits
   */
  getAllCircuits() {
    const cacheKey = 'getAllCircuits';
    
    // Check if we have a valid cached result
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) {
      console.log(`Cache hit for ${cacheKey}`);
      return cache[cacheKey].data;
    }
    
    // If no cache or expired, execute the query
    console.log(`Cache miss for ${cacheKey}, querying database`);
    const db = getDatabase();
    const result = db.prepare(`
      SELECT c.circuitId, c.name, c.location, c.country, c.lat, c.lng
      FROM circuits c
      ORDER BY c.country ASC, c.name ASC`).all();
    
    // Cache the result
    cache[cacheKey] = {
      data: result,
      timestamp: Date.now()
    };
    
    return result;
  },
  
  /**
   * Get a list of all years available in the database
   */
  getAllYears() {
    const cacheKey = 'getAllYears';
    
    // Check if we have a valid cached result
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL) {
      console.log(`Cache hit for ${cacheKey}`);
      return cache[cacheKey].data;
    }
    
    // If no cache or expired, execute the query
    console.log(`Cache miss for ${cacheKey}, querying database`);
    const db = getDatabase();
    const result = db.prepare(`
      SELECT DISTINCT(year) as year
      FROM races
      ORDER BY year DESC`).all();
    
    // Cache the result
    cache[cacheKey] = {
      data: result,
      timestamp: Date.now()
    };
    
    return result;
  },

  /**
   * Get all races for a specific year
   * @param year Race year
   */
  getRacesForYear(year: number) {
    // Simple error checking
    if (!year || isNaN(Number(year))) {
      console.error(`Invalid year parameter: ${year}`);
      return [];
    }
    
    // Normalize year to number
    const yearNum = Number(year);
    
    // Create a cache key based on the function name and parameters
    const cacheKey = `getRacesForYear_${yearNum}`;
    
    console.log(`Requesting races for year ${yearNum}`);
    
    try {
      // Get a database connection
      const db = getDatabase();
      
      // Execute a simpler query to reduce chances of error
      // First try to get just races for the year
      const races = db.prepare(`
        SELECT r.raceId, r.year, r.round, r.name, r.date, r.time
        FROM races r 
        WHERE r.year = ? 
        ORDER BY r.round ASC
      `).all(yearNum);
      
      console.log(`Found ${races.length} races for year ${yearNum}`);
      
      // If no races, return empty array
      if (races.length === 0) {
        return [];
      }
      
      // First, get all circuits data for reference
      const allCircuits = db.prepare(`
        SELECT circuitId, name as circuit, location, country, lat, lng
        FROM circuits
      `).all();
      
      console.log(`Loaded ${allCircuits.length} circuits for reference`);
      
      // Create a map for easy lookup by ID
      const circuitMap = new Map();
      allCircuits.forEach(circuit => {
        circuitMap.set(circuit.circuitId, circuit);
      });
      
      // Now get circuit data for each race
      const result = races.map(race => {
        try {
          // First attempt: get circuitId directly from race
          const circuitId = db.prepare('SELECT circuitId FROM races WHERE raceId = ?').get(race.raceId)?.circuitId;
          
          if (circuitId && circuitMap.has(circuitId)) {
            const circuitData = circuitMap.get(circuitId);
            return {
              ...race,
              ...circuitData,
              // Make sure we have a circuit name
              circuit: circuitData.circuit || race.name || 'Unknown Circuit'
            };
          }
          
          // Second attempt: try direct join query
          const directCircuitData = db.prepare(`
            SELECT c.name as circuit, c.location, c.country, c.lat, c.lng, c.circuitId
            FROM races r
            JOIN circuits c ON r.circuitId = c.circuitId
            WHERE r.raceId = ?
          `).get(race.raceId);
          
          if (directCircuitData) {
            return {
              ...race,
              ...directCircuitData,
              circuit: directCircuitData.circuit || race.name || 'Unknown Circuit'
            };
          }
          
          // If we're here, we couldn't find circuit data - use the race name
          return {
            ...race,
            circuit: race.name || 'Unknown Circuit',
            location: 'Unknown',
            country: race.name?.split(' ')[0] || 'Unknown',
            lat: 0,
            lng: 0,
            circuitId: 0
          };
        } catch (err) {
          console.error(`Error getting circuit data for race ${race.raceId}:`, err);
          // Return race without circuit data as last resort
          return {
            ...race,
            circuit: race.name || 'Unknown Circuit',
            location: 'Unknown',
            country: race.name?.split(' ')[0] || 'Unknown',
            lat: 0,
            lng: 0,
            circuitId: 0
          };
        }
      });
      
      return result;
    } catch (error) {
      console.error(`Error querying races for year ${yearNum}:`, error);
      return [];
    }
  }
};