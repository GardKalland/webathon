const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch');

/**
 * Script to fetch F1 data from RapidAPI and update the local database
 * 
 * To use this script:
 * 1. Create a .env file with your RapidAPI key (RAPIDAPI_KEY=your_key_here)
 * 2. Run the script: node fetchAndUpdateF1Data.js
 */

// RapidAPI configuration
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || 'YOUR_RAPIDAPI_KEY'; // Add your key here or use env var
const RAPIDAPI_HOST = 'api-formula-1.p.rapidapi.com';
const RAPIDAPI_BASE_URL = 'https://api-formula-1.p.rapidapi.com';
const SEASON = 2025; // The season to fetch data for

// Get a writable database connection
function getWritableDatabase() {
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
  
  console.log('Connecting to database in writable mode at:', dbPath);
  return new Database(dbPath);
}

// Ensure the database tables exist
function ensureDatabaseTables(db) {
  console.log('Ensuring database tables exist...');
  
  // Create driver standings table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS driver_standings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      season INTEGER NOT NULL,
      position INTEGER NOT NULL,
      driver_id TEXT NOT NULL,
      driver_name TEXT NOT NULL,
      team TEXT NOT NULL,
      points REAL NOT NULL,
      fetch_time INTEGER NOT NULL
    );
  `);
  
  // Create constructor standings table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS constructor_standings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      season INTEGER NOT NULL,
      position INTEGER NOT NULL,
      team_name TEXT NOT NULL,
      points REAL NOT NULL,
      fetch_time INTEGER NOT NULL
    );
  `);
  
  console.log('Database tables ready');
}

// Format driver standings from API response
function formatDriverStandings(data) {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map(driver => ({
    position: driver.position || 0,
    driver_id: String(driver.driver?.id || `driver_${driver.position}`),
    driver_name: driver.driver?.name || 'Unknown Driver',
    team: driver.team?.name || 'Unknown Team',
    points: parseFloat(driver.points) || 0
  }));
}

// Format constructor standings from API response
function formatConstructorStandings(data) {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map(team => ({
    position: team.position || 0,
    team_name: team.team?.name || 'Unknown Team',
    points: parseFloat(team.points) || 0
  }));
}

// Fetch driver standings from RapidAPI
async function fetchDriverStandings(year) {
  try {
    console.log(`Fetching driver standings for season ${year} from RapidAPI...`);
    
    const url = `${RAPIDAPI_BASE_URL}/rankings/drivers?season=${year}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
      }
    };
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      console.log(`API error: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const data = await response.json();
    const driverStandings = formatDriverStandings(data.response || []);
    
    console.log(`Successfully fetched ${driverStandings.length} driver standings records`);
    return driverStandings;
  } catch (err) {
    console.error('Error fetching driver standings:', err);
    return [];
  }
}

// Fetch constructor standings from RapidAPI
async function fetchConstructorStandings(year) {
  try {
    console.log(`Fetching constructor standings for season ${year} from RapidAPI...`);
    
    const url = `${RAPIDAPI_BASE_URL}/rankings/teams?season=${year}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': RAPIDAPI_HOST
      }
    };
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      console.log(`API error: ${response.status} ${response.statusText}`);
      return [];
    }
    
    const data = await response.json();
    const constructorStandings = formatConstructorStandings(data.response || []);
    
    console.log(`Successfully fetched ${constructorStandings.length} constructor standings records`);
    return constructorStandings;
  } catch (err) {
    console.error('Error fetching constructor standings:', err);
    return [];
  }
}

// Store driver standings in the database
function storeDriverStandings(db, driverStandings, season) {
  console.log(`Storing ${driverStandings.length} driver standings records in database...`);
  
  // First clear any existing data for this season
  const clearStmt = db.prepare('DELETE FROM driver_standings WHERE season = ?');
  clearStmt.run(season);
  
  // Insert new data
  const insertStmt = db.prepare(`
    INSERT INTO driver_standings (season, position, driver_id, driver_name, team, points, fetch_time)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp
  
  // Use a transaction for better performance
  const insertMany = db.transaction((items) => {
    for (const driver of items) {
      insertStmt.run(
        season,
        driver.position,
        driver.driver_id,
        driver.driver_name,
        driver.team,
        driver.points,
        timestamp
      );
    }
  });
  
  insertMany(driverStandings);
  console.log(`Successfully stored ${driverStandings.length} driver standings records in database`);
}

// Store constructor standings in the database
function storeConstructorStandings(db, constructorStandings, season) {
  console.log(`Storing ${constructorStandings.length} constructor standings records in database...`);
  
  // First clear any existing data for this season
  const clearStmt = db.prepare('DELETE FROM constructor_standings WHERE season = ?');
  clearStmt.run(season);
  
  // Insert new data
  const insertStmt = db.prepare(`
    INSERT INTO constructor_standings (season, position, team_name, points, fetch_time)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp
  
  // Use a transaction for better performance
  const insertMany = db.transaction((items) => {
    for (const team of items) {
      insertStmt.run(
        season,
        team.position,
        team.team_name,
        team.points,
        timestamp
      );
    }
  });
  
  insertMany(constructorStandings);
  console.log(`Successfully stored ${constructorStandings.length} constructor standings records in database`);
}

// Main function to update data
async function updateF1Data() {
  let db = null;
  
  try {
    // Get database connection
    db = getWritableDatabase();
    
    // Ensure database tables exist
    ensureDatabaseTables(db);
    
    // Fetch driver standings from API
    const driverStandings = await fetchDriverStandings(SEASON);
    
    if (driverStandings.length > 0) {
      // Store driver standings in database
      storeDriverStandings(db, driverStandings, SEASON);
    } else {
      console.log('No driver standings data to store');
    }
    
    // Fetch constructor standings from API
    const constructorStandings = await fetchConstructorStandings(SEASON);
    
    if (constructorStandings.length > 0) {
      // Store constructor standings in database
      storeConstructorStandings(db, constructorStandings, SEASON);
    } else {
      console.log('No constructor standings data to store');
      
      // If constructor standings are empty but we have driver standings,
      // generate constructor standings from driver data
      if (driverStandings.length > 0) {
        console.log('Generating constructor standings from driver data...');
        
        // Group driver points by team
        const teamPoints = {};
        driverStandings.forEach(driver => {
          if (!teamPoints[driver.team]) {
            teamPoints[driver.team] = 0;
          }
          teamPoints[driver.team] += driver.points;
        });
        
        // Convert to array and sort
        const generatedConstructorStandings = Object.entries(teamPoints)
          .map(([team_name, points], index) => ({
            position: index + 1,
            team_name,
            points
          }))
          .sort((a, b) => b.points - a.points);
        
        // Store generated constructor standings
        storeConstructorStandings(db, generatedConstructorStandings, SEASON);
      }
    }
    
    console.log('F1 data update completed successfully');
  } catch (error) {
    console.error('Failed to update F1 data:', error);
  } finally {
    // Close the database connection
    if (db) {
      db.close();
      console.log('Database connection closed');
    }
  }
}

// Print instructions if API key is not set
if (RAPIDAPI_KEY === 'YOUR_RAPIDAPI_KEY') {
  console.log('WARNING: You need to set a valid RapidAPI key in the script or environment variable.');
  console.log('Options:');
  console.log('1. Edit this script and set RAPIDAPI_KEY directly.');
  console.log('2. Run the script with the key as an environment variable:');
  console.log('   RAPIDAPI_KEY=your_key_here node fetchAndUpdateF1Data.js');
} else {
  // Run the update function
  updateF1Data().catch(error => {
    console.error('Uncaught error:', error);
    process.exit(1);
  });
}