import { NextRequest } from 'next/server';
import { f1Service } from '../../../database/f1Service';


/**
 * Format API data to our application format
 */
function formatDriverStandings(data: any[]) {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map(driver => ({
    position: driver.position || 0,
    driverId: driver.driver?.id || 0,
    name: driver.driver?.name || 'Unknown Driver',
    team: driver.team?.name || 'Unknown Team',
    points: driver.points || 0
  }));
}

function formatConstructorStandings(data: any[]) {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map(team => ({
    position: team.position || 0,
    name: team.team?.name || 'Unknown Team',
    points: team.points || 0
  }));
}

function formatRaceResults(data: any[]) {
  if (!data || !Array.isArray(data)) return [];
  
  return data.map(race => {
    const podium = {
      first: null,
      second: null,
      third: null
    };
    
    // Extract top 3 positions if available
    if (race.results && Array.isArray(race.results)) {
      race.results.forEach(result => {
        if (result.position === 1) {
          podium.first = { 
            driver: result.driver?.name || 'Unknown', 
            team: result.team?.name || 'Unknown'
          };
        } else if (result.position === 2) {
          podium.second = { 
            driver: result.driver?.name || 'Unknown', 
            team: result.team?.name || 'Unknown'
          };
        } else if (result.position === 3) {
          podium.third = { 
            driver: result.driver?.name || 'Unknown', 
            team: result.team?.name || 'Unknown'
          };
        }
      });
    }
    
    return {
      raceId: race.id || 0,
      year: race.season || 0,
      round: race.round || 0,
      name: race.name || 'Unknown Race',
      circuit: race.circuit?.name || 'Unknown Circuit',
      date: race.date || '',
      country: race.circuit?.location?.country || 'Unknown',
      location: race.circuit?.location?.city || 'Unknown',
      podium
    };
  });
}



/**
 * Generate mock data when API doesn't have what we need
 */
function generateMockDriverStandings(year: number) {
  // Actual 2025 driver standings you provided
  const drivers = [
    { position: 1, name: "Lando Norris", team: "McLaren Racing", points: 44 },
    { position: 2, name: "Max Verstappen", team: "Red Bull Racing", points: 36 },
    { position: 3, name: "George Russell", team: "Mercedes-AMG Petronas", points: 35 },
    { position: 4, name: "Oscar Piastri", team: "McLaren Racing", points: 34 },
    { position: 5, name: "Andrea Kimi Antonelli", team: "Mercedes-AMG Petronas", points: 22 },
    { position: 6, name: "Alexander Albon", team: "Williams F1 Team", points: 16 },
    { position: 7, name: "Esteban Ocon", team: "Haas F1 Team", points: 10 },
    { position: 8, name: "Lance Stroll", team: "Aston Martin F1 Team", points: 10 },
    { position: 9, name: "Lewis Hamilton", team: "Scuderia Ferrari", points: 9 },
    { position: 10, name: "Charles Leclerc", team: "Scuderia Ferrari", points: 8 },
    { position: 11, name: "Nico Hulkenberg", team: "Stake F1 Team Kick Sauber", points: 6 },
    { position: 12, name: "Oliver Bearman", team: "Haas F1 Team", points: 4 },
    { position: 13, name: "Yuki Tsunoda", team: "Racing Bulls", points: 3 },
    { position: 14, name: "Carlos Sainz Jr", team: "Williams F1 Team", points: 1 },
    { position: 15, name: "Isack Hadjar", team: "Racing Bulls", points: 0 },
    { position: 16, name: "Pierre Gasly", team: "Alpine F1 Team", points: 0 },
    { position: 17, name: "Liam Lawson", team: "Red Bull Racing", points: 0 },
    { position: 18, name: "Jack Doohan", team: "Alpine F1 Team", points: 0 },
    { position: 19, name: "Gabriel Bortoleto", team: "Stake F1 Team Kick Sauber", points: 0 },
    { position: 20, name: "Fernando Alonso", team: "Aston Martin F1 Team", points: 0 }
  ];
  
  return drivers.map(driver => ({
    position: driver.position,
    driverId: driver.position,
    name: driver.name,
    team: driver.team,
    points: driver.points
  }));
}

function generateMockConstructorStandings(year: number) {
  // Generated constructor standings based on driver data
  const teams = [
    { position: 1, name: "McLaren Racing", points: 78 },        // Norris + Piastri
    { position: 2, name: "Mercedes-AMG Petronas", points: 57 }, // Russell + Antonelli
    { position: 3, name: "Red Bull Racing", points: 36 },       // Verstappen + Lawson
    { position: 4, name: "Williams F1 Team", points: 17 },      // Albon + Sainz
    { position: 5, name: "Scuderia Ferrari", points: 17 },      // Hamilton + Leclerc
    { position: 6, name: "Haas F1 Team", points: 14 },          // Ocon + Bearman
    { position: 7, name: "Aston Martin F1 Team", points: 10 },  // Stroll + Alonso
    { position: 8, name: "Stake F1 Team Kick Sauber", points: 6 }, // Hulkenberg + Bortoleto
    { position: 9, name: "Racing Bulls", points: 3 },           // Tsunoda + Hadjar
    { position: 10, name: "Alpine F1 Team", points: 0 }         // Gasly + Doohan
  ];
  
  return teams.map(team => ({
    position: team.position,
    name: team.name,
    points: team.points
  }));
}

function generateMockRaceResults(year: number) {
  // Return the exact races you provided for 2025
  if (year === 2025) {
    return [
      // Chinese Grand Prix (Most recent, so it appears first)
      {
        raceId: 2,
        year: 2025,
        round: 2,
        name: "Chinese Grand Prix",
        circuit: "Shanghai International Circuit",
        date: "2025-03-23",
        country: "China",
        location: "Shanghai",
        podium: {
          first: { driver: "Oscar Piastri", team: "McLaren Mercedes" },
          second: { driver: "Lando Norris", team: "McLaren Mercedes" },
          third: { driver: "George Russell", team: "Mercedes" }
        },
        results: [
          { position: 1, number: 81, driver: "Oscar Piastri", car: "McLaren Mercedes", laps: 56, time: "1:30:55.026", points: 25 },
          { position: 2, number: 4, driver: "Lando Norris", car: "McLaren Mercedes", laps: 56, time: "+9.748s", points: 18 },
          { position: 3, number: 63, driver: "George Russell", car: "Mercedes", laps: 56, time: "+11.097s", points: 15 },
          { position: 4, number: 1, driver: "Max Verstappen", car: "Red Bull Racing Honda RBPT", laps: 56, time: "+16.656s", points: 12 },
          { position: 5, number: 31, driver: "Esteban Ocon", car: "Haas Ferrari", laps: 56, time: "+49.969s", points: 10 },
          { position: 6, number: 12, driver: "Kimi Antonelli", car: "Mercedes", laps: 56, time: "+53.748s", points: 8 },
          { position: 7, number: 23, driver: "Alexander Albon", car: "Williams Mercedes", laps: 56, time: "+56.321s", points: 6 },
          { position: 8, number: 87, driver: "Oliver Bearman", car: "Haas Ferrari", laps: 56, time: "+61.303s", points: 4 },
          { position: 9, number: 18, driver: "Lance Stroll", car: "Aston Martin Aramco Mercedes", laps: 56, time: "+70.204s", points: 2 },
          { position: 10, number: 55, driver: "Carlos Sainz", car: "Williams Mercedes", laps: 56, time: "+76.387s", points: 1 },
          { position: 11, number: 6, driver: "Isack Hadjar", car: "Racing Bulls Honda RBPT", laps: 56, time: "+78.875s", points: 0 },
          { position: 12, number: 30, driver: "Liam Lawson", car: "Red Bull Racing Honda RBPT", laps: 56, time: "+81.147s", points: 0 },
          { position: 13, number: 7, driver: "Jack Doohan", car: "Alpine Renault", laps: 56, time: "+88.401s", points: 0 },
          { position: 14, number: 5, driver: "Gabriel Bortoleto", car: "Kick Sauber Ferrari", laps: 55, time: "+1 lap", points: 0 },
          { position: 15, number: 27, driver: "Nico Hulkenberg", car: "Kick Sauber Ferrari", laps: 55, time: "+1 lap", points: 0 },
          { position: 16, number: 22, driver: "Yuki Tsunoda", car: "Racing Bulls Honda RBPT", laps: 55, time: "+1 lap", points: 0 },
          { position: 17, number: 14, driver: "Fernando Alonso", car: "Aston Martin Aramco Mercedes", laps: 4, time: "DNF", points: 0 },
          { position: 18, number: 16, driver: "Charles Leclerc", car: "Ferrari", laps: 0, time: "DSQ", points: 0 },
          { position: 19, number: 44, driver: "Lewis Hamilton", car: "Ferrari", laps: 0, time: "DSQ", points: 0 },
          { position: 20, number: 10, driver: "Pierre Gasly", car: "Alpine Renault", laps: 0, time: "DSQ", points: 0 }
        ]
      },
      // Australian Grand Prix
      {
        raceId: 1,
        year: 2025,
        round: 1,
        name: "Australian Grand Prix",
        circuit: "Albert Park Circuit",
        date: "2025-03-16",
        country: "Australia",
        location: "Melbourne",
        podium: {
          first: { driver: "Lando Norris", team: "McLaren Mercedes" },
          second: { driver: "Max Verstappen", team: "Red Bull Racing Honda RBPT" },
          third: { driver: "George Russell", team: "Mercedes" }
        }
      }
    ].reverse();
  }
  
  // For any other year just return an empty array
  return [];
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const endpoint = searchParams.get('endpoint');
    const yearParam = searchParams.get('year') || '2025';
    const year = Number(yearParam);
    
    if (!endpoint) {
      return new Response(JSON.stringify({ error: 'Missing endpoint parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    let data;
    let usedMockData = false;
    
    switch (endpoint) {
      case 'driver-standings':
        // Get data directly from the database
        data = f1Service.getDriverStandings(year);
        // Not using mock data anymore
        usedMockData = false;
        break;
        
      case 'constructor-standings':
        // Get data directly from the database
        data = f1Service.getConstructorStandings(year);
        // Not using mock data anymore
        usedMockData = false;
        break;
        
      case 'race-results':
        // For race results, still use the mock data for now
        data = generateMockRaceResults(year);
        usedMockData = true;
        break;
        
      default:
        return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }
    
    return Response.json({
      endpoint,
      year,
      usedMockData,
      count: data.length,
      data
    });
  } catch (err) {
    console.error('API error:', err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : 'Internal server error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
