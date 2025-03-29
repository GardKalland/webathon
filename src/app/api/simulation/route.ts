// app/api/race/simulation/route.ts
import { NextResponse } from 'next/server';

// Race configuration
const RACE_NAME = "Monaco Grand Prix";
const RACE_LOCATION = "Monte Carlo, Monaco";
const TOTAL_LAPS = 78;
const TRACK_LENGTH_KM = 3.337;
const SECTOR_COUNT = 3;

// Track sector information (Monaco)
const SECTORS = [
  { name: "Sector 1", length_km: 1.15, base_time: 24.5 }, // S1: Start to Casino
  { name: "Sector 2", length_km: 1.20, base_time: 28.3 }, // S2: Casino to tunnel exit
  { name: "Sector 3", length_km: 0.99, base_time: 25.7 }  // S3: Tunnel exit to finish line
];

// In-memory race state
let raceState = {
  session_id: generateSessionId(),
  current_lap: 0,
  race_started: false,
  race_finished: false,
  race_start_time: null,
  current_time: null,
  last_update_time: Date.now(),
  safety_car: false,
  yellow_flag_sectors: [],
  drivers: [],
  lap_history: [],
  race_incidents: []
};

// Driver images from Formula 1 website
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
function generateSessionId() {
  return Math.random().toString(36).substring(2, 15);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3);
  return `${mins}:${secs.padStart(6, '0')}`;
}

function parseTime(timeString) {
  const [mins, secs] = timeString.split(':');
  return parseFloat(mins) * 60 + parseFloat(secs);
}

// Initialize the race
function initializeRace() {
  // Reset race state
  raceState = {
    session_id: generateSessionId(),
    current_lap: 0,
    race_started: false,
    race_finished: false,
    race_start_time: null,
    current_time: Date.now(),
    last_update_time: Date.now(),
    safety_car: false,
    yellow_flag_sectors: [],
    drivers: [],
    lap_history: [],
    race_incidents: []
  };

  // Initialize drivers with starting grid positions
  const baseDrivers = [
    { driver_number: "16", name: "Charles Leclerc", team_name: "Ferrari", grid: 1 }, // Leclerc on pole in Monaco
    { driver_number: "55", name: "Carlos Sainz", team_name: "Ferrari", grid: 2 },
    { driver_number: "1", name: "Max Verstappen", team_name: "Red Bull Racing", grid: 3 },
    { driver_number: "11", name: "Sergio Perez", team_name: "Red Bull Racing", grid: 4 },
    { driver_number: "4", name: "Lando Norris", team_name: "McLaren", grid: 5 },
    { driver_number: "63", name: "George Russell", team_name: "Mercedes", grid: 6 },
    { driver_number: "44", name: "Lewis Hamilton", team_name: "Mercedes", grid: 7 },
    { driver_number: "81", name: "Oscar Piastri", team_name: "McLaren", grid: 8 },
    { driver_number: "14", name: "Fernando Alonso", team_name: "Aston Martin", grid: 9 },
    { driver_number: "18", name: "Lance Stroll", team_name: "Aston Martin", grid: 10 },
    { driver_number: "10", name: "Pierre Gasly", team_name: "Alpine", grid: 11 },
    { driver_number: "31", name: "Esteban Ocon", team_name: "Alpine", grid: 12 },
    { driver_number: "23", name: "Alexander Albon", team_name: "Williams", grid: 13 },
    { driver_number: "2", name: "Logan Sargeant", team_name: "Williams", grid: 14 },
    { driver_number: "27", name: "Nico Hulkenberg", team_name: "Haas F1 Team", grid: 15 },
    { driver_number: "20", name: "Kevin Magnussen", team_name: "Haas F1 Team", grid: 16 },
    { driver_number: "22", name: "Yuki Tsunoda", team_name: "AlphaTauri", grid: 17 },
    { driver_number: "3", name: "Daniel Ricciardo", team_name: "AlphaTauri", grid: 18 },
    { driver_number: "77", name: "Valtteri Bottas", team_name: "Alfa Romeo", grid: 19 },
    { driver_number: "24", name: "Zhou Guanyu", team_name: "Alfa Romeo", grid: 20 }
  ];

  // Calculate qualifying times (in seconds)
  const poleTime = 72.25; // ~1:12.250 for Monaco pole

  // Generate driver race data
  raceState.drivers = baseDrivers.map(driver => {
    // Calculate qualifying time based on grid position
    const gridGap = (driver.grid - 1) * 0.15; // Each position is ~0.15s slower
    const randomVariation = (Math.random() * 0.1) - 0.05; // +/- 0.05s random variation
    const qualifyingTime = poleTime + gridGap + randomVariation;

    // Initial tire selection (Monaco typically starts on softs/mediums)
    const tireOptions = ['Soft', 'Medium'];
    const initialTire = tireOptions[Math.floor(Math.random() * tireOptions.length)];

    // Driver performance factor (skill rating from 0.95 to 1.05)
    const skillFactor = 0.95 + (Math.random() * 0.1);

    // Create driver object with full race data
    return {
      ...driver,
      position: driver.grid, // Start position same as grid
      qualifying_time: formatTime(qualifyingTime),
      qualifying_position: driver.grid,

      // Current state
      status: "Ready",
      current_lap: 0,
      current_sector: 0,
      sector1_time: null,
      sector2_time: null,
      sector3_time: null,
      last_lap_time: null,
      best_lap_time: null,
      gap_to_leader: "+0.000",
      interval: "+0.000",

      // Car state
      tire_compound: initialTire,
      tire_age: 0,
      tire_wear: 0,
      fuel_load: 100,
      drs_available: false,
      ers_mode: "Normal",

      // Race summary
      pit_stops: 0,
      pit_stop_total_time: 0,
      positions_gained: 0,
      positions_lost: 0,
      fastest_lap: false,
      dnf: false,

      // Temp work variables
      skill_factor: skillFactor,
      pit_this_lap: false,
      image: driverImages[driver.driver_number],

      // Telemetry
      speed: 0,
      rpm: 0,
      gear: 0,
      throttle: 0,
      brake: 0,
      lap_distance: 0
    };
  });

  // Start the race
  raceState.race_started = true;
  raceState.race_start_time = Date.now();
  raceState.current_time = Date.now();
  raceState.current_lap = 1; // Formation lap is lap 0, race starts at lap 1

  // Add race start event
  raceState.race_incidents.push({
    lap: 1,
    sector: 1,
    time: Date.now(),
    type: "Race Start",
    description: "Lights out and away we go!"
  });

  // Initialize lap history with formation lap
  raceState.lap_history.push({
    lap_number: 0,
    lap_name: "Formation Lap",
    lap_start_time: raceState.race_start_time - 120000, // 2 minutes before race start
    lap_end_time: raceState.race_start_time,
    yellow_flags: false,
    safety_car: false,
    virtual_safety_car: false,
    driver_positions: raceState.drivers.map(d => ({
      driver_number: d.driver_number,
      position: d.grid
    }))
  });
}

// Function to generate a sector time for a driver
function generateSectorTime(driver, sectorIndex, lapNumber) {
  // Base sector time
  const baseSectorTime = SECTORS[sectorIndex].base_time;

  // Factors affecting lap time
  const fuelFactor = (100 - driver.fuel_load) * 0.005; // Less fuel = faster (up to 0.5s)
  const tireFactor = driver.tire_wear * 0.01; // Tire wear slows down (up to 1s when tires are gone)
  const skillFactor = (driver.skill_factor - 1) * 5; // Driver skill affects time by +/- 0.25s

  // Tire compound factor
  let tireCompoundFactor = 0;
  if (driver.tire_compound === "Soft") tireCompoundFactor = -0.2;
  else if (driver.tire_compound === "Hard") tireCompoundFactor = 0.3;

  // Random variation
  const randomFactor = (Math.random() * 0.3) - 0.15; // +/- 0.15s random variation

  // Special situations
  let specialFactor = 0;

  // Yellow flag in sector
  if (raceState.yellow_flag_sectors.includes(sectorIndex)) {
    specialFactor += 0.5 + Math.random() * 1.5; // +0.5s to +2s slower under yellow
  }

  // Safety car
  if (raceState.safety_car) {
    specialFactor += 5 + Math.random() * 3; // +5s to +8s slower under safety car
  }

  // Driver pushing harder (random chance, especially when close to another car)
  if (Math.random() < 0.2) {
    specialFactor -= 0.1; // Push harder, -0.1s
  }

  // Out lap after pit stop is slower
  if (driver.pit_this_lap && sectorIndex > 0) {
    specialFactor += 1.5; // +1.5s slower on outlap
  }

  // First lap is usually more cautious
  if (lapNumber === 1 && !driver.pit_this_lap) {
    specialFactor += 0.8; // +0.8s slower on first lap
  }

  // Calculate final sector time
  const sectorTime = baseSectorTime - fuelFactor + tireFactor + tireCompoundFactor + skillFactor + randomFactor + specialFactor;

  // Ensure time is reasonable (not negative or unrealistically fast)
  return Math.max(baseSectorTime * 0.94, sectorTime);
}

// Function to generate telemetry data
function generateTelemetry(driver, sector, lapProgress) {
  // Different parts of track have different characteristics
  let baseSpeed, rpmFactor, gearRange, throttleRange, brakeChance;

  // Monaco sector characteristics
  if (sector === 0) { // S1: Start to Casino
    if (lapProgress < 0.3) {
      // Starting straight
      baseSpeed = 270;
      rpmFactor = 0.95;
      gearRange = [7, 8];
      throttleRange = [90, 100];
      brakeChance = 0.1;
    } else {
      // Tight corners to Casino
      baseSpeed = 140;
      rpmFactor = 0.7;
      gearRange = [2, 4];
      throttleRange = [20, 90];
      brakeChance = 0.5;
    }
  } else if (sector === 1) { // S2: Casino to tunnel exit
    if (lapProgress > 0.7) {
      // Tunnel section - highest speeds
      baseSpeed = 290;
      rpmFactor = 0.98;
      gearRange = [7, 8];
      throttleRange = [95, 100];
      brakeChance = 0.05;
    } else {
      // Casino to tunnel entrance
      baseSpeed = 130;
      rpmFactor = 0.65;
      gearRange = [2, 3];
      throttleRange = [30, 80];
      brakeChance = 0.6;
    }
  } else { // S3: Tunnel exit to finish line
    // Chicane and swimming pool section
    baseSpeed = 160;
    rpmFactor = 0.75;
    gearRange = [3, 5];
    throttleRange = [40, 90];
    brakeChance = 0.4;
  }

  // Add variation
  const speedVar = Math.random() * 30 - 15;
  const rpmVar = Math.random() * 0.1 - 0.05;

  // Calculate values
  const speed = Math.round(baseSpeed + speedVar);
  const rpm = Math.round((rpmFactor + rpmVar) * 10000);
  const gear = Math.floor(Math.random() * (gearRange[1] - gearRange[0] + 1)) + gearRange[0];
  const throttle = Math.floor(Math.random() * (throttleRange[1] - throttleRange[0] + 1)) + throttleRange[0];
  const brake = Math.random() < brakeChance ? Math.floor(Math.random() * 100) : 0;

  return {
    speed,
    rpm,
    gear,
    throttle,
    brake
  };
}

// Function to process a lap
function simulateFullLap() {
  // Check if race is over
  if (raceState.current_lap > TOTAL_LAPS || raceState.race_finished) {
    raceState.race_finished = true;
    return;
  }

  console.log(`Simulating lap ${raceState.current_lap}...`);

  // Track lap start time
  const lapStartTime = Date.now();

  // Random events
  handleRandomEvents();

  // Process each driver through the lap
  raceState.drivers.forEach(driver => {
    // Skip DNF drivers
    if (driver.dnf) return;

    // Reset lap data
    driver.sector1_time = null;
    driver.sector2_time = null;
    driver.sector3_time = null;
    driver.current_sector = 0;

    // Check if driver will pit this lap
    driver.pit_this_lap = shouldDriverPit(driver);

    // Simulate each sector
    let totalLapTime = 0;
    let lapDistance = 0;

    for (let sector = 0; sector < SECTORS.length; sector++) {
      // Set current sector
      driver.current_sector = sector + 1; // 1-indexed for display

      // Generate sector time
      const sectorTime = generateSectorTime(driver, sector, raceState.current_lap);
      totalLapTime += sectorTime;

      // Store sector time
      if (sector === 0) driver.sector1_time = sectorTime;
      else if (sector === 1) driver.sector2_time = sectorTime;
      else if (sector === 2) driver.sector3_time = sectorTime;

      // Update driver position on track
      lapDistance += SECTORS[sector].length_km;
      driver.lap_distance = lapDistance;

      // Generate telemetry for this sector
      const sectorProgress = (lapDistance / TRACK_LENGTH_KM);
      const telemetry = generateTelemetry(driver, sector, sectorProgress);
      driver.speed = telemetry.speed;
      driver.rpm = telemetry.rpm;
      driver.gear = telemetry.gear;
      driver.throttle = telemetry.throttle;
      driver.brake = telemetry.brake;

      // Process pit stop at the end of sector 3
      if (driver.pit_this_lap && sector === 2) {
        const pitStopTime = processPitStop(driver);
        totalLapTime += pitStopTime;
      }
    }

    // Update driver state at the end of the lap
    driver.current_lap = raceState.current_lap;
    driver.current_sector = 0; // Reset for next lap
    driver.last_lap_time = formatTime(totalLapTime);

    // Track best lap time
    if (!driver.best_lap_time || totalLapTime < parseTime(driver.best_lap_time)) {
      driver.best_lap_time = formatTime(totalLapTime);

      // Check if this is the fastest lap overall
      if (Math.random() < 0.1) { // 10% chance of announcing fastest lap
        raceState.race_incidents.push({
          lap: raceState.current_lap,
          sector: 3,
          time: Date.now(),
          type: "Fastest Lap",
          description: `${driver.name} sets the fastest lap of the race: ${driver.best_lap_time}`
        });
      }
    }

    // Update car state
    driver.fuel_load = Math.max(0, driver.fuel_load - (100 / TOTAL_LAPS)); // Consume fuel
    driver.tire_age += 1;
    driver.tire_wear += (Math.random() * 2) + (driver.tire_compound === "Soft" ? 0.6 : driver.tire_compound === "Hard" ? 0.3 : 0.4);
  });

  // Sort drivers by race position (their virtual position on track)
  calculateRacePositions();

  // Calculate gaps between drivers
  calculateGaps();

  // Record lap history
  raceState.lap_history.push({
    lap_number: raceState.current_lap,
    lap_name: `Lap ${raceState.current_lap}`,
    lap_start_time: lapStartTime,
    lap_end_time: Date.now(),
    yellow_flags: raceState.yellow_flag_sectors.length > 0,
    safety_car: raceState.safety_car,
    driver_positions: raceState.drivers.map(d => ({
      driver_number: d.driver_number,
      position: d.position
    }))
  });

  // Advance to next lap
  raceState.current_lap += 1;

  // Check if race is over
  if (raceState.current_lap > TOTAL_LAPS) {
    raceState.race_finished = true;
    raceState.race_incidents.push({
      lap: TOTAL_LAPS,
      sector: 3,
      time: Date.now(),
      type: "Race Finish",
      description: "Checkered flag! Race complete."
    });

    // Determine podium
    const podium = raceState.drivers
      .filter(d => !d.dnf)
      .sort((a, b) => a.position - b.position)
      .slice(0, 3);

    raceState.race_incidents.push({
      lap: TOTAL_LAPS,
      sector: 3,
      time: Date.now() + 1000,
      type: "Podium",
      description: `Podium: 1. ${podium[0]?.name || 'Unknown'}, 2. ${podium[1]?.name || 'Unknown'}, 3. ${podium[2]?.name || 'Unknown'}`
    });
  }
}

// Determine if a driver should pit
function shouldDriverPit(driver) {
  // No pitting in first few laps
  if (raceState.current_lap < 5) return false;

  // Factors that increase pit chance
  let pitChance = 0;

  // Tire wear is the main factor
  if (driver.tire_wear > 90) pitChance = 0.95; // Critical wear
  else if (driver.tire_wear > 75) pitChance = 0.7; // High wear
  else if (driver.tire_wear > 60) pitChance = 0.3; // Medium wear
  else if (driver.tire_wear > 45) pitChance = 0.1; // Some wear

  // Safety car increases pit chance
  if (raceState.safety_car) pitChance += 0.3;

  // Strategic decisions
  const lapsRemaining = TOTAL_LAPS - raceState.current_lap;
  if (lapsRemaining < TOTAL_LAPS * 0.3 && driver.pit_stops === 0) {
    pitChance += 0.2; // Encourage pit stop if no stops yet and in last third
  }

  // Execute pit decision
  return Math.random() < pitChance;
}

// Process a pit stop for a driver
function processPitStop(driver) {
  // Base pit time (in seconds)
  const basePitTime = 22; // Average F1 pit stop (entry to exit) is around 22 seconds

  // Random variation in pit stop execution
  const randomFactor = (Math.random() * 3) - 0.5; // Between -0.5s and +2.5s

  // Total pit stop time
  const pitStopTime = basePitTime + randomFactor;

  // Update driver state
  driver.pit_stops += 1;
  driver.pit_stop_total_time += pitStopTime;
  driver.pit_this_lap = false;

  // Change tires
  let newTireCompound;

  // Choose tire based on race situation
  const lapsRemaining = TOTAL_LAPS - raceState.current_lap;
  if (lapsRemaining < 20) {
    // Later in race - softer tires
    newTireCompound = Math.random() < 0.7 ? "Soft" : "Medium";
  } else if (lapsRemaining < 40) {
    // Mid race - medium likely
    newTireCompound = Math.random() < 0.7 ? "Medium" : (Math.random() < 0.5 ? "Soft" : "Hard");
  } else {
    // Early race - harder tires
    newTireCompound = Math.random() < 0.6 ? "Medium" : "Hard";
  }

  // Reset tire state
  driver.tire_compound = newTireCompound;
  driver.tire_age = 0;
  driver.tire_wear = 0;

  // Add pit stop incident
  raceState.race_incidents.push({
    lap: raceState.current_lap,
    sector: 3,
    time: Date.now(),
    type: "Pit Stop",
    description: `${driver.name} boxes for ${newTireCompound} tires. Stop time: ${pitStopTime.toFixed(2)}s`
  });

  return pitStopTime;
}

// Calculate race positions after a lap
function calculateRacePositions() {
  // Start by sorting drivers based on completed lap and virtual race time
  raceState.drivers.sort((a, b) => {
    // DNF drivers go to the back
    if (a.dnf && !b.dnf) return 1;
    if (!a.dnf && b.dnf) return -1;

    // Sort by completed laps
    if (a.current_lap !== b.current_lap) return b.current_lap - a.current_lap;

    // If on same lap, use last lap time as tiebreaker
    if (a.last_lap_time && b.last_lap_time) {
      return parseTime(a.last_lap_time) - parseTime(b.last_lap_time);
    }

    // If no lap times, maintain previous order
    return a.position - b.position;
  });

  // Update positions
  raceState.drivers.forEach((driver, index) => {
    // Track position changes
    const oldPosition = driver.position;
    const newPosition = index + 1;

    // Update positions_gained/lost stats
    if (oldPosition && newPosition < oldPosition) {
      driver.positions_gained += (oldPosition - newPosition);
    } else if (oldPosition && newPosition > oldPosition) {
      driver.positions_lost += (newPosition - oldPosition);
    }

    // Set new position
    driver.position = newPosition;
  });

  // Add position change incidents for significant moves
  raceState.drivers.forEach(driver => {
    // Check for significant overtakes (only report some)
    if (Math.random() < 0.3 && driver.positions_gained > 0) {
      raceState.race_incidents.push({
        lap: raceState.current_lap,
        sector: Math.floor(Math.random() * 3) + 1, // Random sector
        time: Date.now(),
        type: "Overtake",
        description: `${driver.name} gains position, now P${driver.position}`
      });
    }
  });
}


// Calculate interval to car ahead
function calculateGaps() {
  // Sort drivers by position
  const sortedDrivers = [...raceState.drivers].sort((a, b) => a.position - b.position);

  // Process each driver
  sortedDrivers.forEach((driver, index) => {
    if (index === 0) {
      // Race leader has no gap
      driver.gap_to_leader = "0.000";
      driver.interval = "0.000";
    } else {
      // Calculate gap to leader based on lap times
      const leaderTime = parseTime(sortedDrivers[0].last_lap_time) || 80; // fallback to 1:20.000
      const driverTime = parseTime(driver.last_lap_time) || leaderTime + index * 0.5;

      // If they're on the same lap, use time difference
      if (driver.current_lap === sortedDrivers[0].current_lap) {
        // Accumulate time difference based on position (simplified)
        const gapInSeconds = (driver.position - 1) * (0.8 + Math.random() * 0.4);
        driver.gap_to_leader = `+${gapInSeconds.toFixed(3)}`;
      } else {
        // They're a lap or more down
        const lapsDown = sortedDrivers[0].current_lap - driver.current_lap;
        driver.gap_to_leader = `+${lapsDown} lap${lapsDown > 1 ? 's' : ''}`;
      }

      // Calculate interval to car ahead
      if (index > 0 && driver.current_lap === sortedDrivers[index - 1].current_lap) {
        // On same lap
        const intervalSeconds = 0.6 + Math.random() * 0.8;
        driver.interval = `+${intervalSeconds.toFixed(3)}`;
      } else if (index > 0) {
        // Interval in laps
        const lapsDown = sortedDrivers[index - 1].current_lap - driver.current_lap;
        driver.interval = `+${lapsDown} lap${lapsDown > 1 ? 's' : ''}`;
      }
    }

    // Update driver status text
    if (driver.dnf) {
      driver.status = "DNF";
    } else if (driver.pit_this_lap) {
      driver.status = "PIT";
    } else if (raceState.safety_car) {
      driver.status = "SC";
    } else if (raceState.yellow_flag_sectors.includes(driver.current_sector)) {
      driver.status = "YEL";
    } else {
      driver.status = "Racing";
    }
  });
}

// Handle random race events
function handleRandomEvents() {
  // Clear previous yellow flags
  raceState.yellow_flag_sectors = [];

  // Check if safety car should end
  if (raceState.safety_car && Math.random() < 0.3) {
    raceState.safety_car = false;
    raceState.race_incidents.push({
      lap: raceState.current_lap,
      sector: 1,
      time: Date.now(),
      type: "Safety Car",
      description: "Safety car in this lap."
    });
  }

  // Random incidents based on lap number
  const incidentChance = 0.05 + (raceState.current_lap / TOTAL_LAPS * 0.1); // Higher chance later in race

  if (Math.random() < incidentChance && !raceState.safety_car) {
    // Pick a random driver
    const randomDriverIndex = Math.floor(Math.random() * raceState.drivers.length);
    const driver = raceState.drivers[randomDriverIndex];

    // Skip if already DNF
    if (driver.dnf) return;

    // Determine type of incident
    const incidentRoll = Math.random();
    const sector = Math.floor(Math.random() * 3) + 1;

    if (incidentRoll < 0.03) {
      // Major incident - DNF
      driver.dnf = true;
      driver.status = "DNF";

      // Add yellow flag in this sector
      raceState.yellow_flag_sectors.push(sector - 1);

      // 30% chance of safety car
      if (Math.random() < 0.3) {
        raceState.safety_car = true;
        raceState.race_incidents.push({
          lap: raceState.current_lap,
          sector,
          time: Date.now(),
          type: "Safety Car",
          description: `Safety car deployed after incident with ${driver.name}.`
        });
      } else {
        raceState.race_incidents.push({
          lap: raceState.current_lap,
          sector,
          time: Date.now(),
          type: "Yellow Flag",
          description: `Yellow flag in sector ${sector}. ${driver.name} has retired from the race.`
        });
      }
    } else if (incidentRoll < 0.1) {
      // Medium incident - car damage, continues but slower
      driver.skill_factor *= 0.95; // 5% performance penalty

      raceState.race_incidents.push({
        lap: raceState.current_lap,
        sector,
        time: Date.now(),
        type: "Incident",
        description: `${driver.name} reports car damage but continues.`
      });
    } else if (incidentRoll < 0.2) {
      // Minor incident - off track
      raceState.race_incidents.push({
        lap: raceState.current_lap,
        sector,
        time: Date.now(),
        type: "Off Track",
        description: `${driver.name} goes off track but rejoins.`
      });
    }
  }
}

// Advance race by specified number of laps
function advanceRace(laps = 1) {
  for (let i = 0; i < laps; i++) {
    if (!raceState.race_finished) {
      simulateFullLap();
    }
  }
}

// Get all race data
function getRaceData() {
  return {
    session_id: raceState.session_id,
    race_name: RACE_NAME,
    location: RACE_LOCATION,
    current_lap: raceState.current_lap,
    total_laps: TOTAL_LAPS,
    race_completion: ((raceState.current_lap - 1) / TOTAL_LAPS * 100).toFixed(1),
    race_started: raceState.race_started,
    race_finished: raceState.race_finished,
    safety_car: raceState.safety_car,
    yellow_flag_sectors: raceState.yellow_flag_sectors.map(s => s + 1), // Convert to 1-indexed
    timestamp: new Date().toISOString(),
    drivers: raceState.drivers.sort((a, b) => a.position - b.position),
    incidents: raceState.race_incidents.slice(-10), // Last 10 incidents
    last_update: raceState.last_update_time
  };
}

// API route handler
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Check if we should reset the race
    const reset = searchParams.get('reset');
    if (reset === 'true') {
      initializeRace();
      return NextResponse.json({
        message: "Race reset successfully",
        race: getRaceData()
      });
    }

    // Check if race has been initialized
    if (!raceState.race_started) {
      initializeRace();
    }

    // Get number of laps to advance
    const advanceLaps = parseInt(searchParams.get('laps') || '1');
    if (advanceLaps > 0) {
      advanceRace(Math.min(advanceLaps, 5)); // Cap at 5 laps per request
    }

    // Return current race state
    return NextResponse.json(getRaceData());
  } catch (error) {
    console.error('Race API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
