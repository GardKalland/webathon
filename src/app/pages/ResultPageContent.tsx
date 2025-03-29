'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  CircularProgress, 
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Button,
  Alert,
  Divider,
  Chip,
  styled
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RefreshIcon from '@mui/icons-material/Refresh';
import FlagIcon from '@mui/icons-material/Flag';
import PodiumCard from '../components/PodiumCard';

// Define types
interface DriverStanding {
  position: number;
  driverId: string | number;
  name: string;
  team: string;
  points: number;
}

interface ConstructorStanding {
  position: number;
  name: string;
  points: number;
}

interface RaceResult {
  raceId: number | string;
  year: number;
  round: number;
  name: string;
  circuit: string;
  date: string;
  country: string;
  location: string;
  podium: {
    first: { driver: string; team: string; } | null;
    second: { driver: string; team: string; } | null;
    third: { driver: string; team: string; } | null;
  };
  results?: Array<{
    position: number;
    number: number;
    driver: string;
    car: string;
    laps: number;
    time: string;
    points: number;
  }>;
}

export interface ResultPageContentProps {
  sectionTitle?: string;
}

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#fff' : '#000',
  fontWeight: 'bold',
}));

export default function ResultPageContent({
  sectionTitle = 'F1 2025 Results & Standings'
}: ResultPageContentProps) {
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [constructorStandings, setConstructorStandings] = useState<ConstructorStanding[]>([]);
  const [raceResults, setRaceResults] = useState<RaceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch 2025 results data
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    const fetchResultsData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Fetching 2025 results data...');
        
        // Fetch all data in parallel using our API
        const [driverResponse, constructorResponse, racesResponse] = await Promise.all([
          fetch('/api/results?endpoint=driver-standings&year=2025', { 
            signal: controller.signal,
            headers: { 'Cache-Control': 'no-cache' }
          }),
          fetch('/api/results?endpoint=constructor-standings&year=2025', { 
            signal: controller.signal,
            headers: { 'Cache-Control': 'no-cache' }
          }),
          fetch('/api/results?endpoint=race-results&year=2025', { 
            signal: controller.signal,
            headers: { 'Cache-Control': 'no-cache' }
          })
        ]);
        
        // Check for HTTP errors
        if (!driverResponse.ok || !constructorResponse.ok || !racesResponse.ok) {
          throw new Error(`HTTP error occurred while fetching data`);
        }
        
        // Parse all responses in parallel
        const [driverData, constructorData, racesData] = await Promise.all([
          driverResponse.json(),
          constructorResponse.json(),
          racesResponse.json()
        ]);
        
        if (!isMounted) {
          console.log('Component unmounted during fetch, aborting state update');
          return;
        }
        
        // Update state with fetched data
        setDriverStandings(driverData.data || []);
        setConstructorStandings(constructorData.data || []);
        setRaceResults(racesData.data || []);
        
        // Log if we used mock data (useful for debugging)
        if (driverData.usedMockData || constructorData.usedMockData || racesData.usedMockData) {
          console.log('Using some mock data from API endpoints');
        }
        
        setLoading(false);
      } catch (err: any) {
        if (err.name === 'AbortError' || !isMounted) {
          console.log('Fetch aborted or component unmounted');
          return;
        }
        
        console.error('Error fetching results:', err);
        
        if (isMounted) {
          setError('Failed to load data. Please try again later.');
          setLoading(false);
        }
      }
    };
    
    fetchResultsData();
    
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    
    // Trigger a refetch
    setTimeout(() => {
      const fetchData = async () => {
        try {
          const [driverResponse, constructorResponse, racesResponse] = await Promise.all([
            fetch('/api/results?endpoint=driver-standings&year=2025'),
            fetch('/api/results?endpoint=constructor-standings&year=2025'),
            fetch('/api/results?endpoint=race-results&year=2025')
          ]);
          
          const [driverData, constructorData, racesData] = await Promise.all([
            driverResponse.json(),
            constructorResponse.json(),
            racesResponse.json()
          ]);
          
          setDriverStandings(driverData.data || []);
          setConstructorStandings(constructorData.data || []);
          setRaceResults(racesData.data || []);
          setLoading(false);
        } catch (err) {
          console.error('Error refetching:', err);
          setError('Failed to load data. Please try again later.');
          setLoading(false);
        }
      };
      
      fetchData();
    }, 500);
  };
  
  return (
    <Box sx={{ 
      width: '100%', 
      py: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Container 
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {sectionTitle && (
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              textAlign: 'center', 
              mb: 4, 
              fontWeight: 700,
              color: '#E10600' // F1 red
            }}
          >
            {sectionTitle}
          </Typography>
        )}
        
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            p: 4, 
            gap: 2 
          }}>
            <CircularProgress size={40} />
            <Typography variant="body1">
              Loading 2025 results data...
            </Typography>
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            sx={{ 
              maxWidth: 600, 
              mx: 'auto', 
              mb: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 3
            }}
            action={
              <Button 
                color="error" 
                size="small" 
                startIcon={<RefreshIcon />}
                onClick={handleRetry}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        ) : (
          <>
            {/* Championship Standings Grid */}
            <Grid container spacing={4} sx={{ mb: 8, width: '100%', justifyContent: 'center' }}>
              {/* Driver Championship Standings */}
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={3} 
                  sx={{
                    borderLeft: '4px solid #E10600',
                    height: '100%',
                    overflow: 'hidden',
                    backgroundColor: 'rgba(21, 21, 30, 0.95)',
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5, 
                    p: 2.5, 
                    borderBottom: '2px solid #E10600',
                  }}>
                    <EmojiEventsIcon sx={{ color: '#E10600', fontSize: 28 }} />
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#E10600' }}>
                      Driver Championship Standings
                    </Typography>
                  </Box>
                  
                  <TableContainer sx={{ maxHeight: 600 }}>
                    <Table 
                      stickyHeader 
                      sx={{ 
                        '& .MuiTableCell-root': {
                          borderBottom: 'none', 
                          py: 1.5,
                          px: 2.5,
                        },
                        '& .MuiTableRow-root': { 
                          borderBottom: '1px solid rgba(81, 81, 81, 0.3)',
                          '&:last-child': {
                            borderBottom: 'none'
                          }
                        },
                        '& .MuiTableHead-root': {
                          '& .MuiTableRow-root': {
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            borderBottom: '2px solid rgba(81, 81, 81, 0.5)'
                          }
                        }
                      }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ width: '10%' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, opacity: 0.7 }}>POS</Typography>
                          </TableCell>
                          <TableCell sx={{ width: '40%' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, opacity: 0.7 }}>DRIVER</Typography>
                          </TableCell>
                          <TableCell sx={{ width: '30%' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, opacity: 0.7 }}>TEAM</Typography>
                          </TableCell>
                          <TableCell sx={{ width: '20%' }} align="right">
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, opacity: 0.7 }}>POINTS</Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {driverStandings.map((driver, index) => (
                          <TableRow 
                            key={driver.driverId} 
                            hover
                            sx={{ 
                              bgcolor: index % 2 === 0 ? 'rgba(0,0,0,0.1)' : 'transparent',
                              '&:hover': {
                                bgcolor: 'rgba(225, 6, 0, 0.05) !important'
                              }
                            }}
                          >
                            <TableCell sx={{ fontWeight: 700, fontSize: '1rem' }}>
                              {driver.position}
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '1rem' }}>
                              {driver.name}
                            </TableCell>
                            <TableCell sx={{ fontSize: '0.95rem', opacity: 0.9 }}>
                              {driver.team}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: '#E10600', fontSize: '1.1rem' }}>
                              {driver.points}
                            </TableCell>
                          </TableRow>
                        ))}
                        {driverStandings.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                              <Typography variant="body1">
                                No driver standings available for 2025.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
              
              {/* Constructor Championship Standings */}
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={3} 
                  sx={{
                    borderLeft: '4px solid #E10600',
                    height: '100%',
                    overflow: 'hidden',
                    backgroundColor: 'rgba(21, 21, 30, 0.95)',
                    borderRadius: 2
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5, 
                    p: 2.5, 
                    borderBottom: '2px solid #E10600',
                  }}>
                    <GroupsIcon sx={{ color: '#E10600', fontSize: 28 }} />
                    <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#E10600' }}>
                      Constructor Championship Standings
                    </Typography>
                  </Box>
                  
                  <TableContainer sx={{ maxHeight: 600 }}>
                    <Table 
                      stickyHeader 
                      sx={{ 
                        '& .MuiTableCell-root': {
                          borderBottom: 'none', 
                          py: 1.5,
                          px: 2.5,
                        },
                        '& .MuiTableRow-root': { 
                          borderBottom: '1px solid rgba(81, 81, 81, 0.3)',
                          '&:last-child': {
                            borderBottom: 'none'
                          }
                        },
                        '& .MuiTableHead-root': {
                          '& .MuiTableRow-root': {
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            borderBottom: '2px solid rgba(81, 81, 81, 0.5)'
                          }
                        }
                      }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ width: '10%' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, opacity: 0.7 }}>POS</Typography>
                          </TableCell>
                          <TableCell sx={{ width: '60%' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, opacity: 0.7 }}>TEAM</Typography>
                          </TableCell>
                          <TableCell sx={{ width: '30%' }} align="right">
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, opacity: 0.7 }}>POINTS</Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {constructorStandings.map((team, index) => (
                          <TableRow 
                            key={team.name} 
                            hover
                            sx={{ 
                              bgcolor: index % 2 === 0 ? 'rgba(0,0,0,0.1)' : 'transparent',
                              '&:hover': {
                                bgcolor: 'rgba(225, 6, 0, 0.05) !important'
                              }
                            }}
                          >
                            <TableCell sx={{ fontWeight: 700, fontSize: '1rem' }}>
                              {team.position}
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600, fontSize: '1rem' }}>
                              {team.name}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: '#E10600', fontSize: '1.1rem' }}>
                              {team.points}
                            </TableCell>
                          </TableRow>
                        ))}
                        {constructorStandings.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={3} align="center" sx={{ py: 5 }}>
                              <Typography variant="body1">
                                No constructor standings available for 2025.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
            
            {/* Race Results Section */}
            <Typography 
              variant="h4" 
              component="h2" 
              sx={{ 
                textAlign: 'center', 
                mb: 4,
                fontWeight: 700,
                borderBottom: '2px solid #E10600',
                pb: 1,
                maxWidth: 300,
                mx: 'auto'
              }}
            >
              Race Results
            </Typography>
            
            <Grid container spacing={4} sx={{ width: '100%', justifyContent: 'center' }}>
              {raceResults.map((race) => (
                <Grid item xs={12} sm={6} md={4} key={race.raceId}>
                  <Card 
                    elevation={4} 
                    sx={{
                      borderLeft: '4px solid #E10600',
                      height: '100%',
                      transition: 'transform 0.2s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 14px 28px rgba(0, 0, 0, 0.25)'
                      },
                      bgcolor: 'rgba(21, 21, 30, 0.95)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 2,
                      overflow: 'hidden'
                    }}
                  >
                    <Box sx={{ 
                      bgcolor: 'rgba(0, 0, 0, 0.15)',
                      borderBottom: '2px solid #E10600',
                      px: 2.5,
                      py: 2,
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="h5" component="h3" sx={{ fontWeight: 700 }}>
                          {race.name}
                        </Typography>
                        <Typography variant="h3" component="span" sx={{ 
                          fontWeight: 800, 
                          color: '#E10600',
                          lineHeight: 1,
                          opacity: 0.9
                        }}>
                          {race.round}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="subtitle1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                          {race.circuit}
                        </Typography>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          mt: 1.5 
                        }}>
                          <Typography variant="body2" sx={{ opacity: 0.7 }}>
                            {new Date(race.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </Typography>
                          
                          <Chip 
                            icon={<FlagIcon sx={{ fontSize: '1rem' }} />} 
                            label={race.country.toUpperCase()}
                            size="small" 
                            sx={{ 
                              fontWeight: 600,
                              color: '#E10600',
                              border: '1px solid rgba(225, 6, 0, 0.3)',
                              '& .MuiChip-icon': {
                                color: '#E10600'
                              }
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                    
                    <CardContent sx={{ p: 3 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 700, 
                          mb: 2,
                          display: 'inline-block',
                          borderBottom: '2px solid rgba(225, 6, 0, 0.3)',
                          pb: 0.5
                        }}
                      >
                        Podium Finishers
                      </Typography>
                      
                      <Grid container spacing={2}>
                        {/* First Place */}
                        <Grid item xs={4}>
                          {race.podium.first ? (
                            <PodiumCard 
                              position="first" 
                              driver={race.podium.first.driver} 
                              team={race.podium.first.team}
                            />
                          ) : (
                            <PodiumCard 
                              position="first" 
                              driver="" 
                              team=""
                            />
                          )}
                        </Grid>
                        
                        {/* Second Place */}
                        <Grid item xs={4}>
                          {race.podium.second ? (
                            <PodiumCard 
                              position="second" 
                              driver={race.podium.second.driver} 
                              team={race.podium.second.team}
                            />
                          ) : (
                            <PodiumCard 
                              position="second" 
                              driver="" 
                              team=""
                            />
                          )}
                        </Grid>
                        
                        {/* Third Place */}
                        <Grid item xs={4}>
                          {race.podium.third ? (
                            <PodiumCard 
                              position="third" 
                              driver={race.podium.third.driver} 
                              team={race.podium.third.team}
                            />
                          ) : (
                            <PodiumCard 
                              position="third" 
                              driver="" 
                              team=""
                            />
                          )}
                        </Grid>
                      </Grid>
                    </CardContent>
                    
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button 
                        fullWidth 
                        variant="contained" 
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          bgcolor: '#E10600',
                          color: 'white',
                          fontWeight: 700,
                          py: 1.2,
                          '&:hover': {
                            bgcolor: '#C00500',
                            transform: 'scale(1.03)'
                          },
                          transition: 'transform 0.2s'
                        }}
                      >
                        View Full Results
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
              
              {raceResults.length === 0 && !loading && !error && (
                <Grid item xs={12}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 6,
                    opacity: 0.7,
                    bgcolor: 'rgba(0,0,0,0.05)',
                    borderRadius: 2
                  }}>
                    <Typography variant="h6">
                      No race results available for 2025.
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
}
