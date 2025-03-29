const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

/**
 * Script to update F1 driver and constructor standings in the f1.db database
 * This script uses JavaScript instead of TypeScript for simplicity
 */

// Season to work with
const SEASON = 2025;

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

// Create the standings tables
function createStandingsTables(db) {
  console.log('Creating driver standings table...');
  
  // Create driver standings table
  db.exec(`
    DROP TABLE IF EXISTS driver_standings;
    CREATE TABLE driver_standings (
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
  
  console.log('Creating constructor standings table...');
  
  // Create constructor standings table
  db.exec(`
    DROP TABLE IF EXISTS constructor_standings;
    CREATE TABLE constructor_standings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      season INTEGER NOT NULL,
      position INTEGER NOT NULL,
      team_name TEXT NOT NULL,
      points REAL NOT NULL,
      fetch_time INTEGER NOT NULL
    );
  `);
  
  console.log('Standings tables created successfully');
}

// Mock data that would come from the API
const mockDriverStandings = [
  {
    position: 1,
    driver_id: "max_verstappen",
    driver_name: "Max Verstappen",
    team: "Red Bull Racing",
    points: 285
  },
  {
    position: 2,
    driver_id: "charles_leclerc",
    driver_name: "Charles Leclerc",
    team: "Ferrari",
    points: 246
  },
  {
    position: 3,
    driver_id: "lando_norris",
    driver_name: "Lando Norris",
    team: "McLaren",
    points: 232
  },
  {
    position: 4,
    driver_id: "lewis_hamilton",
    driver_name: "Lewis Hamilton",
    team: "Mercedes",
    points: 215
  },
  {
    position: 5,
    driver_id: "carlos_sainz",
    driver_name: "Carlos Sainz",
    team: "Ferrari",
    points: 210
  },
  {
    position: 6,
    driver_id: "oscar_piastri",
    driver_name: "Oscar Piastri",
    team: "McLaren",
    points: 185
  },
  {
    position: 7,
    driver_id: "george_russell",
    driver_name: "George Russell",
    team: "Mercedes",
    points: 175
  },
  {
    position: 8,
    driver_id: "sergio_perez",
    driver_name: "Sergio Perez",
    team: "Red Bull Racing",
    points: 152
  }
];

// Store driver standings in the database
function storeDriverStandings(db, driverStandings) {
  console.log('Storing driver standings in database...');
  
  // Insert new data
  const insertStmt = db.prepare(`
    INSERT INTO driver_standings (season, position, driver_id, driver_name, team, points, fetch_time)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp
  
  driverStandings.forEach(driver => {
    insertStmt.run(
      SEASON,
      driver.position,
      driver.driver_id,
      driver.driver_name,
      driver.team,
      driver.points,
      timestamp
    );
  });
  
  console.log(`Successfully stored ${driverStandings.length} driver standings records in database`);
}

// Generate constructor standings from driver standings
function generateConstructorStandings(driverStandings) {
  console.log(`Generating constructor standings for season ${SEASON}...`);
  
  // Group driver points by team
  const teamPoints = {};
  
  driverStandings.forEach(driver => {
    if (!teamPoints[driver.team]) {
      teamPoints[driver.team] = 0;
    }
    teamPoints[driver.team] += driver.points;
  });
  
  // Convert to array and sort
  const constructorStandings = Object.entries(teamPoints)
    .map(([team_name, points]) => ({ team_name, points }))
    .sort((a, b) => b.points - a.points)
    .map((item, index) => ({
      position: index + 1,
      team_name: item.team_name,
      points: item.points
    }));
  
  console.log(`Successfully generated ${constructorStandings.length} constructor standings records`);
  return constructorStandings;
}

// Store constructor standings in the database
function storeConstructorStandings(db, constructorStandings) {
  console.log('Storing constructor standings in database...');
  
  // Insert new data
  const insertStmt = db.prepare(`
    INSERT INTO constructor_standings (season, position, team_name, points, fetch_time)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp
  
  constructorStandings.forEach(team => {
    insertStmt.run(
      SEASON,
      team.position,
      team.team_name,
      team.points,
      timestamp
    );
  });
  
  console.log(`Successfully stored ${constructorStandings.length} constructor standings records in database`);
}

// Main function to update standings data
function updateStandingsData() {
  let db = null;
  
  try {
    // Get database connection
    db = getWritableDatabase();
    
    // Create the standings tables
    createStandingsTables(db);
    
    // Store driver standings in database
    storeDriverStandings(db, mockDriverStandings);
    
    // Generate constructor standings
    const constructorStandings = generateConstructorStandings(mockDriverStandings);
    
    // Store constructor standings in database
    storeConstructorStandings(db, constructorStandings);
    
    console.log('Standings data update completed successfully');
  } catch (error) {
    console.error('Failed to update standings data:', error);
  } finally {
    // Close the database connection
    if (db) {
      db.close();
      console.log('Database connection closed');
    }
  }
}

// Run the update function
updateStandingsData();