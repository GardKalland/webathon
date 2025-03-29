import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// RapidAPI F1 configuration
const RAPIDAPI_BASE_URL = 'https://api-formula-1.p.rapidapi.com';
const RAPIDAPI_KEY = 'a1ac4046abmsh57faebb0e18b899p119ae5jsnb2d846a7b87b';
const RAPIDAPI_HOST = 'api-formula-1.p.rapidapi.com';

// Find the database file
function findDatabasePath(): string {
  const directPath = '/home/larsh/Documents/webathon/src/database/f1.db';
  
  if (fs.existsSync(directPath)) {
    console.log('Found database at:', directPath);
    return directPath;
  }
  
  const possiblePaths = [
    path.join(process.cwd(), 'src/database/f1.db'),
    path.join(process.cwd(), './src/database/f1.db'),
    path.join(process.cwd(), '../src/database/f1.db'),
    path.resolve('./src/database/f1.db'),
    path.resolve('../src/database/f1.db')
  ];
  
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      console.log('Found database at:', testPath);
      return testPath;
    }
  }
  
  throw new Error('Database file not found in any of the expected locations. Current working directory: ' + process.cwd());
}

// Initialize database connection (in read-write mode)
function initDatabase(): Database.Database {
  try {
    const dbPath = findDatabasePath();
    console.log('Connecting to database at:', dbPath);
    const db = new Database(dbPath);
    console.log('Database connection established successfully');
    return db;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
}

// Fetch driver standings from RapidAPI
async function fetchDriverStandings(season: number): Promise<any[]> {
  try {
    const url = `${RAPIDAPI_BASE_URL}/rankings/drivers?season=${season}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
      }
    };
    
    console.log(`Fetching driver standings for season ${season}...`);
    const response = await fetch(url, options);
    
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const data = await response.json();
    return data.response || [];
  } catch (err) {
    console.error('Error fetching driver standings:', err);
    return [];
  }
}

// Fetch constructor standings from RapidAPI
async function fetchConstructorStandings(season: number): Promise<any[]> {
  try {
    const url = `${RAPIDAPI_BASE_URL}/rankings/teams?season=${season}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
      }
    };
    
    console.log(`Fetching constructor standings for season ${season}...`);
    const response = await fetch(url, options);
    
    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const data = await response.json();
    return data.response || [];
  } catch (err) {
    console.error('Error fetching constructor standings:', err);
    return [];
  }
}

// Generate mock driver standings for 2025 (since real data isn't available yet)
function generateMockDriverStandings(): any[] {
  const drivers = [
    { name: "Max Verstappen", team: "Red Bull Racing", wins: 6 },
    { name: "Lando Norris", team: "McLaren", wins: 2 },
    { name: "Charles Leclerc", team: "Ferrari", wins: 2 },
    { name: "Lewis Hamilton", team: "Mercedes", wins: 1 },
    { name: "Carlos Sainz", team: "Ferrari", wins: 1 },
    { name: "Oscar Piastri", team: "McLaren", wins: 0 },
    { name: "George Russell", team: "Mercedes", wins: 0 },
    { name: "Sergio Perez", team: "Red Bull Racing", wins: 0 },
    { name: "Fernando Alonso", team: "Aston Martin", wins: 0 },
    { name: "Lance Stroll", team: "Aston Martin", wins: 0 },
    { name: "Pierre Gasly", team: "Alpine", wins: 0 },
    { name: "Esteban Ocon", team: "Alpine", wins: 0 },
    { name: "Alex Albon", team: "Williams", wins: 0 },
    { name: "Valtteri Bottas", team: "Sauber", wins: 0 },
    { name: "Yuki Tsunoda", team: "RB", wins: 0 },
    { name: "Daniel Ricciardo", team: "RB", wins: 0 },
    { name: "Nico Hulkenberg", team: "Haas F1 Team", wins: 0 },
    { name: "Kevin Magnussen", team: "Haas F1 Team", wins: 0 },
    { name: "Logan Sargeant", team: "Williams", wins: 0 },
    { name: "Zhou Guanyu", team: "Sauber", wins: 0 }
  ];
  
  return drivers.map((driver, index) => {
    const position = index + 1;
    const points = Math.max(0, 400 - (index * (15 + Math.floor(Math.random() * 10))));
    
    return {
      position,
      points,
      wins: driver.wins,
      driver: {
        id: position,
        name: driver.name
      },
      team: {
        id: Math.floor(index / 2) + 1,
        name: driver.team
      }
    };
  });
}

// Generate mock constructor standings for 2025
function generateMockConstructorStandings(): any[] {
  const teams = [
    { name: "Red Bull Racing", wins: 6 },
    { name: "McLaren", wins: 2 },
    { name: "Ferrari", wins: 3 },
    { name: "Mercedes", wins: 1 },
    { name: "Aston Martin", wins: 0 },
    { name: "Alpine", wins: 0 },
    { name: "RB", wins: 0 },
    { name: "Haas F1 Team", wins: 0 },
    { name: "Williams", wins: 0 },
    { name: "Sauber", wins: 0 }
  ];
  
  return teams.map((team, index) => {
    const position = index + 1;
    const points = Math.max(0, 700 - (index * (50 + Math.floor(Math.random() * 30))));
    
    return {
      position,
      points,
      wins: team.wins,
      team: {
        id: position,
        name: team.name
      }
    };
  });
}

// Store driver standings in the database
function storeDriverStandings(db: Database.Database, driverStandings: any[], season: number): void {
  try {
    console.log(`Storing ${driverStandings.length} driver standings for season ${season}...`);
    
    // Start a transaction
    db.prepare('BEGIN TRANSACTION').run();
    
    // Get the most recent raceId for the given season (to associate with the standings)
    const raceQuery = db.prepare('SELECT raceId FROM races WHERE year = ? ORDER BY round DESC LIMIT 1');
    let race = raceQuery.get(season);
    
    if (!race) {
      console.log(`No races found for season ${season}, creating mock race entry`);
      // Insert a mock race entry if no race exists for this season
      const circuitQuery = db.prepare('SELECT circuitId FROM circuits LIMIT 1');
      const circuit = circuitQuery.get();
      const circuitId = circuit ? circuit.circuitId : 1;
      
      console.log(`Using circuit ID: ${circuitId} for mock race entry`);
      
      try {
        const insertRaceStmt = db.prepare(`
          INSERT INTO races (year, round, circuitId, name, date, time)
          VALUES (?, 1, ?, 'Season Standings', DATE('now'), TIME('now'))
        `);
        const raceResult = insertRaceStmt.run(season, circuitId);
        race = { raceId: raceResult.lastInsertRowid };
        console.log(`Created mock race entry with ID: ${race.raceId}`);
      } catch (e) {
        console.error('Error creating mock race entry:', e);
        db.prepare('ROLLBACK').run();
        throw e;
      }
    }
    
    // Clear existing driver standings for this race
    const clearStmt = db.prepare('DELETE FROM driver_standings WHERE raceId = ?');
    clearStmt.run(race.raceId);
    
    // Prepare statement for inserting driver standings
    const insertStmt = db.prepare(`
      INSERT INTO driver_standings 
      (raceId, driverId, points, position, positionText, wins)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    // Process each driver
    for (const driver of driverStandings) {
      // First check if the driver exists, if not add them
      const driverQuery = db.prepare('SELECT driverId FROM drivers WHERE driverRef = ? OR LOWER(surname) = ?');
      const driverName = driver.driver ? driver.driver.name.split(' ') : ['Unknown', 'Driver']; 
      const surname = driverName.length > 1 ? driverName[driverName.length - 1] : driverName[0];
      const forename = driverName.length > 1 ? driverName.slice(0, -1).join(' ') : '';
      const driverRef = surname.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      let driverResult = driverQuery.get(driverRef, surname.toLowerCase());
      let driverId: number;
      
      // If driver doesn't exist, add them
      if (!driverResult) {
        console.log(`Adding new driver: ${forename} ${surname}`);
        const insertDriverStmt = db.prepare(`
          INSERT INTO drivers (driverRef, forename, surname, nationality)
          VALUES (?, ?, ?, ?)
        `);
        const team = driver.team ? driver.team.name : 'Unknown';
        const result = insertDriverStmt.run(driverRef, forename, surname, team);
        driverId = Number(result.lastInsertRowid);
      } else {
        driverId = driverResult.driverId;
      }
      
      // Insert standing
      const position = driver.position || 0;
      const points = driver.points || 0;
      const wins = driver.wins || 0;
      insertStmt.run(
        race.raceId, 
        driverId, 
        points, 
        position, 
        position.toString(), 
        wins
      );
    }
    
    // Commit transaction
    db.prepare('COMMIT').run();
    console.log(`Successfully stored ${driverStandings.length} driver standings`);
  } catch (err) {
    // Rollback on error
    db.prepare('ROLLBACK').run();
    console.error('Error storing driver standings:', err);
  }
}

// Store constructor standings in the database
function storeConstructorStandings(db: Database.Database, constructorStandings: any[], season: number): void {
  try {
    console.log(`Storing ${constructorStandings.length} constructor standings for season ${season}...`);
    
    // Start a transaction
    db.prepare('BEGIN TRANSACTION').run();
    
    // Get the most recent raceId for the given season (to associate with the standings)
    const raceQuery = db.prepare('SELECT raceId FROM races WHERE year = ? ORDER BY round DESC LIMIT 1');
    let race = raceQuery.get(season);
    
    if (!race) {
      console.error(`No races found for season ${season}, skipping constructor standings`);
      db.prepare('ROLLBACK').run();
      return;
    }
    
    // Clear existing constructor standings for this race
    const clearStmt = db.prepare('DELETE FROM constructor_standings WHERE raceId = ?');
    clearStmt.run(race.raceId);
    
    // Prepare statement for inserting constructor standings
    const insertStmt = db.prepare(`
      INSERT INTO constructor_standings 
      (raceId, constructorId, points, position, positionText, wins)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    // Process each constructor
    for (const constructor of constructorStandings) {
      // First check if the constructor exists, if not add them
      const constructorName = constructor.team ? constructor.team.name : 'Unknown Team';
      const constructorRef = constructorName.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      const constructorQuery = db.prepare('SELECT constructorId FROM constructors WHERE constructorRef = ? OR name = ?');
      let constructorResult = constructorQuery.get(constructorRef, constructorName);
      let constructorId: number;
      
      // If constructor doesn't exist, add them
      if (!constructorResult) {
        console.log(`Adding new constructor: ${constructorName}`);
        const insertConstructorStmt = db.prepare(`
          INSERT INTO constructors (constructorRef, name, nationality)
          VALUES (?, ?, ?)
        `);
        const result = insertConstructorStmt.run(constructorRef, constructorName, 'Unknown');
        constructorId = Number(result.lastInsertRowid);
      } else {
        constructorId = constructorResult.constructorId;
      }
      
      // Insert standing
      const position = constructor.position || 0;
      const points = constructor.points || 0;
      const wins = constructor.wins || 0;
      insertStmt.run(
        race.raceId, 
        constructorId, 
        points, 
        position, 
        position.toString(), 
        wins
      );
    }
    
    // Commit transaction
    db.prepare('COMMIT').run();
    console.log(`Successfully stored ${constructorStandings.length} constructor standings`);
  } catch (err) {
    // Rollback on error
    db.prepare('ROLLBACK').run();
    console.error('Error storing constructor standings:', err);
  }
}

// Main function to update all standings
async function updateStandings() {
  const SEASONS = [2021, 2022, 2023, 2024, 2025]; // Seasons to update including 2025
  
  try {
    const db = initDatabase();
    
    for (const season of SEASONS) {
      console.log(`\n=== Processing season ${season} ===\n`);
      
      if (season === 2025) {
        // Use mock data for 2025
        console.log('Using mock data for 2025 season');
        const mockDriverStandings = generateMockDriverStandings();
        storeDriverStandings(db, mockDriverStandings, season);
        
        const mockConstructorStandings = generateMockConstructorStandings();
        storeConstructorStandings(db, mockConstructorStandings, season);
      } else {
        // Fetch and store driver standings
        const driverStandings = await fetchDriverStandings(season);
        if (driverStandings.length > 0) {
          storeDriverStandings(db, driverStandings, season);
        } else {
          console.warn(`No driver standings data available for season ${season}`);
        }
        
        // Fetch and store constructor standings
        const constructorStandings = await fetchConstructorStandings(season);
        if (constructorStandings.length > 0) {
          storeConstructorStandings(db, constructorStandings, season);
        } else {
          console.warn(`No constructor standings data available for season ${season}`);
        }
      }
    }
    
    // Close database connection
    db.close();
    console.log('\n=== Standings update completed successfully ===');
  } catch (err) {
    console.error('Error updating standings:', err);
  }
}

// Run the update
updateStandings();