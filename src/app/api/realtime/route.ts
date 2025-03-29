// app/api/realtime/route.ts
import { NextResponse } from 'next/server';

// Mock race data for when no active session
const MOCK_RACE_DATA = {
  session_id: "mock_session",
  race_name: "Pre-Season Testing",
  location: "Bahrain International Circuit",
  current_lap: 0,
  total_laps: 57,
  race_completion: "0%",
  race_started: false,
  race_finished: false,
  safety_car: false,
  yellow_flag_sectors: [],
  timestamp: new Date().toISOString(),
  drivers: [
    {
      driver_number: "1",
      name: "Max Verstappen",
      team_name: "Red Bull Racing",
      position: 1,
      qualifying_position: 1,
      current_lap: 0,
      current_sector: 0,
      sector1_time: null,
      sector2_time: null,
      sector3_time: null,
      last_lap_time: "1:32.450",
      best_lap_time: "1:32.450",
      gap_to_leader: "+0.000",
      interval: "+0.000",
      status: "Ready",
      tire_compound: "Soft",
      tire_age: 0,
      tire_wear: 0,
      fuel_load: 100,
      pit_stops: 0,
      speed: 320,
      dnf: false,
      image: "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png"
    },
    {
      driver_number: "11",
      name: "Sergio Perez",
      team_name: "Red Bull Racing",
      position: 2,
      qualifying_position: 2,
      current_lap: 0,
      current_sector: 0,
      sector1_time: null,
      sector2_time: null,
      sector3_time: null,
      last_lap_time: "1:32.680",
      best_lap_time: "1:32.680",
      gap_to_leader: "+0.230",
      interval: "+0.230",
      status: "Ready",
      tire_compound: "Medium",
      tire_age: 0,
      tire_wear: 0,
      fuel_load: 100,
      pit_stops: 0,
      speed: 318,
      dnf: false,
      image: "https://www.formula1.com/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png"
    },
    {
      driver_number: "16",
      name: "Charles Leclerc",
      team_name: "Ferrari",
      position: 3,
      qualifying_position: 3,
      current_lap: 0,
      current_sector: 0,
      sector1_time: null,
      sector2_time: null,
      sector3_time: null,
      last_lap_time: "1:32.790",
      best_lap_time: "1:32.790",
      gap_to_leader: "+0.340",
      interval: "+0.110",
      status: "Ready",
      tire_compound: "Soft",
      tire_age: 0,
      tire_wear: 0,
      fuel_load: 100,
      pit_stops: 0,
      speed: 317,
      dnf: false,
      image: "https://www.formula1.com/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png"
    },
    {
      driver_number: "55",
      name: "Carlos Sainz",
      team_name: "Ferrari",
      position: 4,
      qualifying_position: 4,
      current_lap: 0,
      current_sector: 0,
      sector1_time: null,
      sector2_time: null,
      sector3_time: null,
      last_lap_time: "1:32.850",
      best_lap_time: "1:32.850",
      gap_to_leader: "+0.400",
      interval: "+0.060",
      status: "Ready",
      tire_compound: "Medium",
      tire_age: 0,
      tire_wear: 0,
      fuel_load: 100,
      pit_stops: 0,
      speed: 316,
      dnf: false,
      image: "https://www.formula1.com/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png"
    },
    {
      driver_number: "44",
      name: "Lewis Hamilton",
      team_name: "Mercedes",
      position: 5,
      qualifying_position: 5,
      current_lap: 0,
      current_sector: 0,
      sector1_time: null,
      sector2_time: null,
      sector3_time: null,
      last_lap_time: "1:32.960",
      best_lap_time: "1:32.960",
      gap_to_leader: "+0.510",
      interval: "+0.110",
      status: "Ready",
      tire_compound: "Soft",
      tire_age: 0,
      tire_wear: 0,
      fuel_load: 100,
      pit_stops: 0,
      speed: 315,
      dnf: false,
      image: "https://www.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png"
    }
  ],
  incidents: [],
  session_status: "Mock Data"
};

// Team colors for 2024 F1 season
const teamColors: Record<string, string> = {
  'Red Bull Racing': '#3671C6',
  'Mercedes': '#6CD3BF',
  'Ferrari': '#F91536',
  'McLaren': '#FF8700',
  'Aston Martin': '#358C75',
  'Alpine': '#2293D1',
  'Williams': '#37BEDD',
  'AlphaTauri': '#5E8FAA',
  'Alfa Romeo': '#C92D4B',
  'Haas F1 Team': '#B6BABD'
};

// Helper function to get team color
function getTeamColor(teamName: string): string {
  return teamColors[teamName] || '#FFFFFF';
}

const driverImages = {
  "1": "https://www.formula1.com/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png",
  "11": "https://www.formula1.com/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png",
  "44": "https://www.formula1.com/content/dam/fom-website/drivers/L/LEWHAM01_Lewis_Hamilton/lewham01.png",
  "63": "https://www.formula1.com/content/dam/fom-website/drivers/G/GEORUS01_George_Russell/georus01.png",
  "16": "https://www.formula1.com/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png",
  "55": "https://www.formula1.com/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png",
  "4": "https://www.formula1.com/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png",
  "81": "https://www.formula1.com/content/dam/fom-website/drivers/O/OSCPIA01_Oscar_Piastri/oscpia01.png",
  "14": "https://www.formula1.com/content/dam/fom-website/drivers/F/FERALO01_Fernando_Alonso/feralo01.png",
  "18": "https://www.formula1.com/content/dam/fom-website/drivers/L/LANSTR01_Lance_Stroll/lanstr01.png",
  "10": "https://www.formula1.com/content/dam/fom-website/drivers/P/PIEGAS01_Pierre_Gasly/piegas01.png",
  "31": "https://www.formula1.com/content/dam/fom-website/drivers/E/ESTOCO01_Esteban_Ocon/estoco01.png",
  "23": "https://www.formula1.com/content/dam/fom-website/drivers/A/ALEALB01_Alexander_Albon/alealb01.png",
  "2": "https://www.formula1.com/content/dam/fom-website/drivers/L/LOGSAR01_Logan_Sargeant/logsar01.png",
  "27": "https://www.formula1.com/content/dam/fom-website/drivers/N/NICHUL01_Nico_Hulkenberg/nichul01.png",
  "20": "https://www.formula1.com/content/dam/fom-website/drivers/K/KEVMAG01_Kevin_Magnussen/kevmag01.png",
  "22": "https://www.formula1.com/content/dam/fom-website/drivers/Y/YUKTSU01_Yuki_Tsunoda/yuktsu01.png",
  "3": "https://www.formula1.com/content/dam/fom-website/drivers/D/DANRIC01_Daniel_Ricciardo/danric01.png",
  "77": "https://www.formula1.com/content/dam/fom-website/drivers/V/VALBOT01_Valtteri_Bottas/valbot01.png",
  "24": "https://www.formula1.com/content/dam/fom-website/drivers/G/GUAZHO01_Guanyu_Zhou/guazho01.png"
};

// Helper functions
function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3);
  return `${mins}:${secs.padStart(6, '0')}`;
}

function parseTime(timeString: string) {
  const [mins, secs] = timeString.split(':');
  return parseFloat(mins) * 60 + parseFloat(secs);
}

// Function to check if there's an active race session
async function checkActiveSession(sessionKey: string) {
  try {
    const response = await fetch(`https://api.openf1.org/v1/sessions?session_key=${sessionKey}`);
    if (!response.ok) return null;
    
    const sessions = await response.json();
    if (!sessions || sessions.length === 0) return null;
    
    const session = sessions[0];
    return {
      session_id: session.session_key.toString(),
      race_name: session.meeting_name,
      location: session.circuit_short_name,
      total_laps: session.total_laps || 0,
      session_type: session.session_type,
      is_active: session.status === 'Active'
    };
  } catch (error) {
    console.error('Failed to check session:', error);
    return null;
  }
}

// Function to enhance driver data with PhaseCard info
function enhanceDriverData(driver: any, isRealData: boolean = false) {
  const description = isRealData ? [
    `Position: P${driver.position}`,
    `Last Lap: ${driver.last_lap_time || '-'}`,
    `Best Lap: ${driver.best_lap_time || '-'}`,
    `Speed: ${driver.speed || 0} km/h`,
    `Tire: ${driver.tire_compound || 'Unknown'} (${driver.tire_age} laps)`,
    driver.gap_to_leader ? `Gap: ${driver.gap_to_leader}` : '',
  ].filter(Boolean).join('\n') : [
    `Position: P${driver.position}`,
    `Last Lap: ${driver.last_lap_time}`,
    `Best Lap: ${driver.best_lap_time}`,
    `Gap: ${driver.gap_to_leader}`,
    `Interval: ${driver.interval}`,
    `Speed: ${driver.speed} km/h`,
    `Tires: ${driver.tire_compound} (${driver.tire_age} laps)`,
    driver.dnf ? 'Status: DNF' : ''
  ].filter(Boolean).join('\n');

  return {
    ...driver,
    phaseCard: {
      id: parseInt(driver.driver_number),
      title: `P${driver.position} ${driver.name}`,
      subtitle: `${driver.team_name} - #${driver.driver_number}`,
      description,
      image: driver.image,
      color: getTeamColor(driver.team_name),
      link: `/driver/${driver.driver_number}`
    }
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionKey = searchParams.get('session_key') || '9999';

    // Check if there's an active session
    const sessionInfo = await checkActiveSession(sessionKey);
    
    if (!sessionInfo || !sessionInfo.is_active) {
      // Return mock data when no active session
      const mockDataWithCards = {
        ...MOCK_RACE_DATA,
        drivers: MOCK_RACE_DATA.drivers.map(driver => enhanceDriverData(driver))
      };
      return NextResponse.json(mockDataWithCards);
    }

    // If there's an active session, fetch real data
    const [driversRes, positionsRes, lapsRes] = await Promise.all([
      fetch(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`),
      fetch(`https://api.openf1.org/v1/position?session_key=${sessionKey}`),
      fetch(`https://api.openf1.org/v1/laps?session_key=${sessionKey}`)
    ]);

    const [driversData, positionsData, lapsData] = await Promise.all([
      driversRes.json(),
      positionsRes.json(),
      lapsRes.json()
    ]);

    // Process real driver data
    const drivers = driversData.map((driver: any) => {
      const position = positionsData.find((pos: any) => pos.driver_number === driver.driver_number);
      const lastLap = lapsData
        .filter((lap: any) => lap.driver_number === driver.driver_number)
        .sort((a: any, b: any) => b.lap_number - a.lap_number)[0];

      const driverData = {
        driver_number: driver.driver_number,
        name: driver.full_name,
        team_name: driver.team_name,
        position: position?.position || 0,
        qualifying_position: position?.grid_position || 0,
        current_lap: lastLap?.lap_number || 0,
        current_sector: position?.sector || 0,
        sector1_time: null,
        sector2_time: null,
        sector3_time: null,
        last_lap_time: lastLap ? formatTime(lastLap.lap_time) : null,
        best_lap_time: null,
        gap_to_leader: position?.gap_to_leader?.toFixed(3) || "0.000",
        interval: position?.interval?.toFixed(3) || "0.000",
        status: position?.status || "Unknown",
        tire_compound: position?.compound || "Unknown",
        tire_age: position?.tyre_age || 0,
        tire_wear: 100,
        fuel_load: 100,
        pit_stops: 0,
        speed: position?.speed || 0,
        image: driver.headshot_url,
        dnf: position?.status === 'DNF'
      };

      return enhanceDriverData(driverData, true);
    });

    // Return real-time data
    return NextResponse.json({
      session_id: sessionInfo.session_id,
      race_name: sessionInfo.race_name,
      location: sessionInfo.location,
      current_lap: Math.max(...drivers.map(d => d.current_lap)),
      total_laps: sessionInfo.total_laps,
      race_completion: `${((Math.max(...drivers.map(d => d.current_lap)) / sessionInfo.total_laps) * 100).toFixed(1)}%`,
      race_started: true,
      race_finished: false,
      safety_car: false,
      yellow_flag_sectors: [],
      timestamp: new Date().toISOString(),
      drivers: drivers,
      incidents: [],
      session_status: "Active"
    });

  } catch (error) {
    console.error('API error:', error);
    // Return mock data on error
    const mockDataWithCards = {
      ...MOCK_RACE_DATA,
      drivers: MOCK_RACE_DATA.drivers.map(driver => enhanceDriverData(driver))
    };
    return NextResponse.json(mockDataWithCards);
  }
}
