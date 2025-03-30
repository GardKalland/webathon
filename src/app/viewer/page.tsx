'use client';
import React, { useState, useEffect, useRef } from 'react';

import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  useTheme,
  Paper,
  LinearProgress,
  Chip,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  Alert,
  AlertTitle,
  Fade,
  Grow
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FlagIcon from '@mui/icons-material/Flag';
import TimerIcon from '@mui/icons-material/Timer';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { PhaseCard } from '@/app/components/PhaseCard';

interface Driver {
  driver_number: string;
  name: string;
  team_name: string;
  position: number;
  qualifying_position: number;
  current_lap: number;
  current_sector: number;
  sector1_time: number | null;
  sector2_time: number | null;
  sector3_time: number | null;
  last_lap_time: string | null;
  best_lap_time: string | null;
  gap_to_leader: string;
  interval: string;
  status: string;
  tire_compound: string;
  tire_age: number;
  tire_wear: number;
  fuel_load: number;
  pit_stops: number;
  speed: number;
  image?: string;
  dnf: boolean;
}

interface RaceIncident {
  lap: number;
  sector: number;
  time: number;
  type: string;
  description: string;
}

interface RaceData {
  session_id: string;
  race_name: string;
  location: string;
  current_lap: number;
  total_laps: number;
  race_completion: string;
  race_started: boolean;
  race_finished: boolean;
  safety_car: boolean;
  yellow_flag_sectors: number[];
  timestamp: string;
  drivers: Driver[];
  incidents: RaceIncident[];
}

// Type for driver position change status
type PositionChange = 'up' | 'down' | 'same';

export default function RaceViewerPage() {
  // Main state
  const [raceData, setRaceData] = useState<RaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [autoAdvance, setAutoAdvance] = useState(false);

  // Transition state
  const [previousDrivers, setPreviousDrivers] = useState<Driver[]>([]);
  const [positionChanges, setPositionChanges] = useState<Record<string, PositionChange>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  const theme = useTheme();
  const autoAdvanceRef = useRef(autoAdvance);

  // Fixed card height
  const cardHeight = "420px"; // Adjust this value as needed

  // Update the autoAdvanceRef when autoAdvance changes
  useEffect(() => {
    autoAdvanceRef.current = autoAdvance;
  }, [autoAdvance]);

  // Sort drivers by position
  const getSortedDrivers = (drivers: Driver[]) => {
    return [...drivers].sort((a, b) => a.position - b.position);
  };

  // Detect position changes between previous and current drivers
  const detectPositionChanges = (prevDrivers: Driver[], newDrivers: Driver[]) => {
    const changes: Record<string, PositionChange> = {};

    newDrivers.forEach(driver => {
      const prevDriver = prevDrivers.find(d => d.driver_number === driver.driver_number);
      if (prevDriver) {
        if (prevDriver.position > driver.position) {
          changes[driver.driver_number] = 'up';
        } else if (prevDriver.position < driver.position) {
          changes[driver.driver_number] = 'down';
        } else {
          changes[driver.driver_number] = 'same';
        }
      } else {
        changes[driver.driver_number] = 'same';
      }
    });

    return changes;
  };

  // Fetch race data from the API
  const fetchRaceData = async (advanceLaps = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/simulation?laps=${advanceLaps}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch race data: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Store previous drivers and detect position changes
      if (raceData) {
        setPreviousDrivers(raceData.drivers);

        // Calculate position changes
        const changes = detectPositionChanges(raceData.drivers, data.drivers);
        setPositionChanges(changes);

        // Set transition flag to trigger animation
        setIsTransitioning(true);

        // Reset transition flag after animation duration
        setTimeout(() => {
          setIsTransitioning(false);
        }, 1000); // Match this with your CSS transition duration
      }

      setRaceData(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch race data:', err);
      setError(`Failed to load race data: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  // Reset the race
  const resetRace = async () => {
    try {
      setLoading(true);
      setPreviousDrivers([]);
      setPositionChanges({});
      setIsTransitioning(false);

      if (autoAdvanceRef.current) {
        setAutoAdvance(false);
      }

      const response = await fetch('/api/simulation?reset=true');

      if (!response.ok) {
        throw new Error(`Failed to reset race: ${response.status}`);
      }

      const data = await response.json();
      setRaceData(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to reset race:', err);
      setError(`Failed to reset race: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setLoading(false);
    }
  };

  // Auto-advance the race
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (autoAdvance && raceData && !raceData.race_finished) {
      intervalId = setInterval(() => {
        fetchRaceData(1);
      }, 5000); // Advance every 5 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoAdvance, raceData?.race_finished]);

  // Initial data load
  useEffect(() => {
    fetchRaceData(0); // Initial fetch without advancing laps
  }, []);

  // Get team colors for each driver
  const getTeamColor = (teamName: string) => {
    const teamColors: { [key: string]: string } = {
      'Red Bull Racing': '#0600EF',
      'Mercedes': '#00D2BE',
      'Ferrari': '#DC0000',
      'McLaren': '#FF8700',
      'Aston Martin': '#006F62',
      'Alpine': '#0090FF',
      'Williams': '#005AFF',
      'AlphaTauri': '#2B4562',
      'Alfa Romeo': '#900000',
      'Haas F1 Team': '#FFFFFF'
    };

    return teamColors[teamName] || theme.palette.primary.main;
  };

  // Get tire compound color
  const getTireColor = (compound: string) => {
    switch (compound) {
      case 'Soft': return '#FF0000';
      case 'Medium': return '#FFCC00';
      case 'Hard': return '#FFFFFF';
      case 'Intermediate': return '#00FF00';
      case 'Wet': return '#0000FF';
      default: return '#CCCCCC';
    }
  };

  // Get status indicator
  const getStatusIndicator = (driver: Driver) => {
    // First, check for position changes
    const posChange = positionChanges[driver.driver_number];
    if (posChange === 'up') {
      return (
        <Grow in timeout={800}>
          <Chip
            size="small"
            icon={<ArrowUpwardIcon fontSize="small" />}
            label="UP"
            sx={{
              bgcolor: 'success.main',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </Grow>
      );
    } else if (posChange === 'down') {
      return (
        <Grow in timeout={800}>
          <Chip
            size="small"
            icon={<ArrowDownwardIcon fontSize="small" />}
            label="DOWN"
            sx={{
              bgcolor: 'error.main',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </Grow>
      );
    }

    // Then check for race conditions
    if (driver.dnf) {
      return <Chip size="small" label="DNF" sx={{ bgcolor: 'error.main', color: 'white' }} />;
    }

    if (raceData?.safety_car) {
      return <Chip size="small" label="SC" sx={{ bgcolor: 'warning.main', color: 'black' }} />;
    }

    if (driver.status === 'PIT') {
      return <Chip size="small" label="PIT" sx={{ bgcolor: 'info.main', color: 'white' }} />;
    }

    // Check if driver is in a yellow flag sector
    const inYellowSector = raceData?.yellow_flag_sectors.includes(driver.current_sector);
    if (inYellowSector) {
      return <Chip size="small" label="YEL" sx={{ bgcolor: 'warning.main', color: 'black' }} />;
    }

    return null;
  };

  // Loading state
  if (loading && !raceData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error && !raceData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error" variant="h5">{error}</Typography>
      </Box>
    );
  }

  // No data state
  if (!raceData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h5">No race data available</Typography>
      </Box>
    );
  }

  // Sort drivers by position for display
  const sortedDrivers = getSortedDrivers(raceData.drivers);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Race Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
          {raceData.race_name}
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
          {raceData.location}
        </Typography>

        {/* Race Status Panel */}
        <Paper sx={{ p: 3, mb: 4, bgcolor: 'rgba(0,0,0,0.7)', color: 'white' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h4">
                Lap {raceData.current_lap} / {raceData.total_laps}
              </Typography>
              {loading && <CircularProgress size={20} sx={{ ml: 2 }} />}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FlagIcon sx={{ mr: 1 }} />
              <Typography>
                Race Progress: {raceData.race_completion}%
              </Typography>
            </Box>
          </Box>

          {/* Race Progress Bar */}
          <LinearProgress
            variant="determinate"
            value={parseFloat(raceData.race_completion)}
            sx={{ height: 10, borderRadius: 5, mb: 2 }}
          />

          <Divider sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.2)' }} />

          {/* Race Controls */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => fetchRaceData(1)}
                disabled={raceData.race_finished || loading || isTransitioning}
                startIcon={<KeyboardArrowRightIcon />}
              >
                Next Lap
              </Button>
              <Button
                variant="outlined"
                onClick={() => setAutoAdvance(!autoAdvance)}
                disabled={raceData.race_finished || loading}
                color={autoAdvance ? "error" : "primary"}
              >
                {autoAdvance ? "Stop Auto" : "Auto Play"}
              </Button>
            </Box>
            <Button
              variant="outlined"
              color="warning"
              onClick={resetRace}
              disabled={loading}
            >
              Reset Race
            </Button>
          </Box>

          {/* Special Race Conditions */}
          {raceData.safety_car && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <AlertTitle>Safety Car Deployed</AlertTitle>
              Safety car is currently on track. Drivers must maintain position and reduce speed.
            </Alert>
          )}

          {raceData.yellow_flag_sectors.length > 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <AlertTitle>Yellow Flag</AlertTitle>
              Yellow flag in {raceData.yellow_flag_sectors.map(s => `Sector ${s}`).join(', ')}.
              Drivers must reduce speed and no overtaking in these sectors.
            </Alert>
          )}

          {raceData.race_finished && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <AlertTitle>Race Complete</AlertTitle>
              The race has finished! {sortedDrivers[0]?.name} is the winner!
            </Alert>
          )}

          {/* Top 3 Drivers */}
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Current Podium
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {sortedDrivers.slice(0, 3).map((driver, index) => (
              <Chip
                key={driver.driver_number}
                avatar={
                  <Box
                    component="span"
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: getTeamColor(driver.team_name),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.75rem'
                    }}
                  >
                    {index + 1}
                  </Box>
                }
                label={driver.name}
                sx={{
                  bgcolor: index === 0 ? 'gold' : index === 1 ? 'silver' : '#CD7F32',
                  color: 'black',
                  fontWeight: 'bold',
                  px: 1
                }}
              />
            ))}
          </Box>
        </Paper>

        {/* Recent Incidents */}
        <Paper sx={{ p: 3, mb: 4, bgcolor: 'rgba(0,0,0,0.6)', color: 'white' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Race Incidents
          </Typography>
          <List dense>
            {raceData.incidents.map((incident, index) => (
              <ListItem key={index} sx={{
                mb: 1,
                bgcolor: 'rgba(0,0,0,0.3)',
                borderRadius: 1,
                borderLeft: `4px solid ${incident.type === 'Safety Car' ? 'orange' :
                  incident.type === 'Yellow Flag' ? 'yellow' :
                    incident.type === 'Pit Stop' ? 'cyan' :
                      incident.type === 'Fastest Lap' ? 'lime' :
                        incident.type === 'Race Start' ? 'green' :
                          incident.type === 'Race Finish' ? 'gold' :
                            incident.type === 'Overtake' ? 'magenta' :
                              'white'
                  }`
              }}>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip size="small" label={`Lap ${incident.lap}`} sx={{ mr: 1 }} />
                      <Typography variant="subtitle2" fontWeight="bold">
                        {incident.type}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" color="rgba(255,255,255,0.7)">
                      {incident.description}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
            {raceData.incidents.length === 0 && (
              <ListItem>
                <ListItemText primary="No incidents yet" />
              </ListItem>
            )}
          </List>
        </Paper>
      </Box>

      {/* Driver Grid with transitions */}
      <Box sx={{ position: 'relative' }}>
        <Box 
          sx={{ 
            display: 'grid',
            gap: 2,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            '& > *': {
              transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1)`
            }
          }}
        >
          {sortedDrivers.map((driver) => {
            // Generate driver card description with race information
            const description = `Position: ${driver.position} (Q${driver.qualifying_position})
Last Lap: ${driver.last_lap_time || 'N/A'}
Best Lap: ${driver.best_lap_time || 'N/A'}
Gap to Leader: ${driver.gap_to_leader}
Interval: ${driver.interval}
Speed: ${driver.speed} km/h
Tires: ${driver.tire_compound} (${driver.tire_age.toFixed(0)} laps)
Pit Stops: ${driver.pit_stops}
Fuel: ${driver.fuel_load.toFixed(0)}%
${driver.dnf ? 'Status: DNF' : ''}`;

            // Generate driver card title with position
            const driverTitle = `P${driver.position} ${driver.name}`;

            const posChange = positionChanges[driver.driver_number];
            const bgColor = posChange === 'up'
              ? 'rgba(46, 125, 50, 0.2)'
              : posChange === 'down'
                ? 'rgba(211, 47, 47, 0.2)'
                : 'transparent';

            // Calculate the number of positions moved
            const prevDriver = previousDrivers.find(d => d.driver_number === driver.driver_number);
            const positionsMoved = prevDriver ? prevDriver.position - driver.position : 0;

            return (
              <Fade
                key={driver.driver_number}
                in={true}
                style={{
                  transitionDuration: '0.8s',
                  backgroundColor: bgColor,
                  borderRadius: '8px',
                }}
              >
                <Box sx={{
                  position: 'relative',
                  height: cardHeight,
                  transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1)`,
                  transform: isTransitioning ?
                    (posChange === 'up' ? 'translateY(-20px) scale(1.03)' :
                      posChange === 'down' ? 'translateY(20px) scale(0.97)' :
                        'scale(1)') : 'scale(1)',
                  opacity: isTransitioning ?
                    (posChange === 'up' || posChange === 'down' ? 0.95 : 1) : 1,
                  '&:hover': {
                    transform: 'scale(1.02)',
                    zIndex: 1
                  }
                }}>
                  {/* Status indicator with enhanced transitions */}
                  {getStatusIndicator(driver) && (
                    <Box sx={{ 
                      position: 'absolute', 
                      top: -10, 
                      right: -10, 
                      zIndex: 10,
                      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                      transform: isTransitioning ?
                        (posChange === 'up' ? 'scale(1.2) rotate(10deg)' :
                          posChange === 'down' ? 'scale(0.8) rotate(-10deg)' :
                            'scale(1) rotate(0deg)') : 'scale(1) rotate(0deg)'
                    }}>
                      {getStatusIndicator(driver)}
                    </Box>
                  )}

                  {/* Position number badge with enhanced transitions */}
                  <Box sx={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    zIndex: 10,
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    bgcolor: 'black',
                    border: `2px solid ${posChange === 'up' ? '#4caf50' : posChange === 'down' ? '#f44336' : 'white'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                    color: 'white',
                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isTransitioning ?
                      (posChange === 'up' ? 'scale(1.2) rotate(10deg)' :
                        posChange === 'down' ? 'scale(0.8) rotate(-10deg)' :
                          'scale(1) rotate(0deg)') : 'scale(1) rotate(0deg)',
                    boxShadow: isTransitioning ?
                      (posChange === 'up' ? '0 4px 8px rgba(76, 175, 80, 0.3)' :
                        posChange === 'down' ? '0 4px 8px rgba(244, 67, 54, 0.3)' :
                          'none') : 'none'
                  }}>
                    {driver.position}
                  </Box>

                  {/* Tire compound indicator with enhanced transitions */}
                  <Box sx={{
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    zIndex: 10,
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    bgcolor: getTireColor(driver.tire_compound),
                    border: '2px solid white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    color: driver.tire_compound === 'Medium' ? 'black' : 'white',
                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isTransitioning ?
                      (posChange === 'up' ? 'scale(1.1)' :
                        posChange === 'down' ? 'scale(0.9)' :
                          'scale(1)') : 'scale(1)'
                  }}>
                    {driver.tire_compound.charAt(0)}
                  </Box>

                  <PhaseCard
                    id={parseInt(driver.driver_number)}
                    title={driverTitle}
                    subtitle={driver.team_name}
                    description={description}
                    icon={<DirectionsCarIcon />}
                    color={getTeamColor(driver.team_name)}
                    link={`/driver/${driver.driver_number}`}
                    hoveredCard={hoveredCard}
                    setHoveredCard={setHoveredCard}
                    image={driver.image}
                    compact={true}
                    height={cardHeight}
                  />
                </Box>
              </Fade>
            );
          })}
        </Box>
      </Box>
    </Container>
  );
}
