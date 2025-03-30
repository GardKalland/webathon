'use client';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  useTheme
} from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FlagIcon from '@mui/icons-material/Flag';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import {PhaseCard} from '@/app/components/PhaseCard';

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
  phaseCard?: {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    image?: string;
    color: string;
    link: string;
  };
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
  session_status: string;
}

export default function DuringRaceContent() {
  const [raceData, setRaceData] = useState<RaceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const theme = useTheme();

  // Fetch race data from the API
  const fetchRaceData = async () => {
    try {
      setLoading(true);
      let sessionKey = "9999"; // Default session key

      try {
        // Try to get the most recent session
        const sessionsRes = await fetch('/api/sessions');
        const sessions = await sessionsRes.json();
        if (sessions.data && sessions.data.length > 0) {
          sessionKey = sessions.data[0]?.session_key || sessionKey;
        }
      } catch (err) {
        console.log('Failed to fetch sessions, using default session key');
      }

      const response = await fetch(`/api/realtime?session_key=${sessionKey}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch race data: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setRaceData(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch race data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load race data');
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (autoRefresh && !loading) {
      intervalId = setInterval(() => {
        fetchRaceData();
      }, 5000); // Refresh every 5 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh, loading]);

  // Initial data load
  useEffect(() => {
    fetchRaceData();
  }, []);

  // Get team colors for each driver
  const getTeamColor = (teamName: string) => {
    const teamColors: { [key: string]: string } = {
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

    return teamColors[teamName] || theme.palette.primary.main;
  };

  // Get tire compound color
  const getTireColor = (compound: string) => {
    switch (compound.toLowerCase()) {
      case 'soft': return '#FF0000';
      case 'medium': return '#FFCC00';
      case 'hard': return '#FFFFFF';
      case 'intermediate': return '#00FF00';
      case 'wet': return '#0000FF';
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

    const inYellowSector = raceData?.yellow_flag_sectors.includes(driver.current_sector);
    if (inYellowSector) {
      return <Chip size="small" label="YEL" sx={{ bgcolor: 'warning.main', color: 'black' }} />;
    }

    return null;
  };

  if (loading && !raceData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !raceData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error" variant="h5">{error}</Typography>
      </Box>
    );
  }

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
                Race Progress: {raceData.race_completion}
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
                onClick={() => fetchRaceData()}
                disabled={loading}
                startIcon={<KeyboardArrowRightIcon />}
              >
                Refresh
              </Button>
              <Button
                variant="outlined"
                onClick={() => setAutoRefresh(!autoRefresh)}
                disabled={loading}
                color={autoRefresh ? "error" : "primary"}
              >
                {autoRefresh ? "Stop Auto-Refresh" : "Auto-Refresh"}
              </Button>
            </Box>
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

          {/* Top 3 Drivers */}
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Current Positions
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
                borderLeft: `4px solid ${
                  incident.type === 'Safety Car' ? 'orange' :
                  incident.type === 'Yellow Flag' ? 'yellow' :
                  incident.type === 'Pit Stop' ? 'cyan' :
                  incident.type === 'Fastest Lap' ? 'lime' :
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
            {(!raceData.incidents || raceData.incidents.length === 0) && (
              <ListItem>
                <ListItemText primary="No incidents reported" />
              </ListItem>
            )}
          </List>
        </Paper>
      </Box>

      {/* Driver Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: {
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)',
        lg: 'repeat(4, 1fr)',
        xl: 'repeat(5, 1fr)'
      }, gap: 3 }}>
        {raceData.drivers.map((driver) => (
          <Box key={driver.driver_number} sx={{ position: 'relative' }}>
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
              color: driver.tire_compound.toLowerCase() === 'medium' ? 'black' : 'white'
            }}>
              {driver.tire_compound.charAt(0)}
            </Box>

            {driver.phaseCard && (
              <PhaseCard
                id={driver.phaseCard.id}
                title={driver.phaseCard.title}
                subtitle={driver.phaseCard.subtitle}
                description={driver.phaseCard.description}
                color={driver.phaseCard.color}
                link={driver.phaseCard.link}
                image={driver.phaseCard.image}
                hoveredCard={hoveredCard}
                setHoveredCard={setHoveredCard}
                icon={<DirectionsCarIcon />}
                compact={true}
              />
            )}
          </Box>
        ))}
      </Box>
    </Container>
  );
}
