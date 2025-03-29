'use client';
import React, { useState, useEffect } from 'react';

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
  AlertTitle
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FlagIcon from '@mui/icons-material/Flag';
import TimerIcon from '@mui/icons-material/Timer';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import WarningIcon from '@mui/icons-material/Warning';
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

export default function RaceViewerPage() {
  const [raceData, setRaceData] = useState<RaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const theme = useTheme();

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
                disabled={raceData.race_finished || loading}
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
              The race has finished! {raceData.drivers[0]?.name} is the winner!
            </Alert>
          )}

          {/* Top 3 Drivers */}
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Current Podium
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {raceData.drivers.slice(0, 3).map((driver, index) => (
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

      {/* Driver Grid */}
      <Grid container spacing={2}>
        {raceData.drivers.map((driver) => {
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

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={driver.driver_number}>
              <Box sx={{ position: 'relative' }}>
                {/* Status indicator */}
                {getStatusIndicator(driver) && (
                  <Box sx={{ position: 'absolute', top: -10, right: -10, zIndex: 10 }}>
                    {getStatusIndicator(driver)}
                  </Box>
                )}

                {/* Tire compound indicator */}
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
                  color: driver.tire_compound === 'Medium' ? 'black' : 'white'
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
                />
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
