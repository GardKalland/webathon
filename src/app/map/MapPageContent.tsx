'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Box, Container, CircularProgress, Typography } from '@mui/material';
import styles from './page.module.css';

// Define the race location type
interface RaceLocation {
  id: number;
  country: string;
  city: string;
  date: string;
  circuit: string;
  lat: number;
  lng: number;
  status: 'completed' | 'upcoming';
  raceId?: number; // For linking to race details
}

// F1DB API response type for races
interface F1DBRace {
  name: string;
  date: string;
  year: number;
  round: number;
  raceId: number;
  circuit: string; 
  location: string;
  country: string;
  lat: number;
  lng: number;
}

// Load the map component with no SSR
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className={styles.mapPlaceholder}>
      <p>Loading map...</p>
    </div>
  )
});

export interface MapPageContentProps {
  fullHeight?: boolean; // If true, map takes up more space (for dedicated page)
  showFilters?: boolean; // If true, show year selector
  showRacesList?: boolean; // If true, show the races list below the map
  defaultYear?: string; // Default year to load
  sectionTitle?: string; // Custom section title
}

export default function MapPageContent({
  fullHeight = true,
  showFilters = true,
  showRacesList = true,
  defaultYear = '2025',
  sectionTitle = 'F1 Race Calendar'
}: MapPageContentProps) {
  // We'll load years dynamically from the DB 
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>(defaultYear);
  const [selectedRace, setSelectedRace] = useState<RaceLocation | null>(null);
  const [raceLocations, setRaceLocations] = useState<Record<string, RaceLocation[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch years available in the database
  useEffect(() => {
    const fetchYears = async () => {
      try {
        // Use the API to get years from the database
        const response = await fetch('/api/f1db?endpoint=years');
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          // Extract years and convert to strings
          const years = data.data.map((item: { year: number }) => item.year.toString());
          console.log(`Loaded ${years.length} years from database`);
          setAvailableYears(years);
          
          // Set default to selected or most recent year
          setSelectedYear(defaultYear);
        } else {
          // Fallback if no years found
          console.warn('No years found in database, using fallback');
          const fallbackYears = [];
          for (let i = 2025; i >= 1950; i--) {
            fallbackYears.push(i.toString());
          }
          setAvailableYears(fallbackYears);
          setSelectedYear(defaultYear || '2025');
        }
      } catch (err) {
        console.error('Error fetching years:', err);
        setError('Failed to load available seasons');
        
        // Fallback to static years
        const fallbackYears = [];
        for (let i = 2025; i >= 1950; i--) {
          fallbackYears.push(i.toString());
        }
        setAvailableYears(fallbackYears);
        setSelectedYear(defaultYear || '2025');
      }
    };
    
    fetchYears();
  }, [defaultYear]);
  
  // Fetch race data for the selected year
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    const fetchRacesForYear = async (year: string) => {
      if (!year || !isMounted) return;
      
      // Check if we already have data for this year - don't refetch
      if (raceLocations[year] && raceLocations[year].length > 0) {
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching races for ${year}...`);
        
        // First try approach - simple API call without any extra parameters
        const racesUrl = `/api/f1db?endpoint=races-by-year&year=${year}`;
        const racesResponse = await fetch(racesUrl, { 
          signal: controller.signal,
          // Ensure we're not using any cached results
          headers: { 'Cache-Control': 'no-cache' }
        });
        
        // Handle HTTP errors
        if (!racesResponse.ok) {
          throw new Error(`HTTP error ${racesResponse.status}: ${racesResponse.statusText}`);
        }
        
        const racesData = await racesResponse.json();
        console.log('API Response:', racesData);
        
        if (!isMounted) {
          console.log('Component unmounted during fetch, aborting state update');
          return;
        }
        
        if (!racesData.data || racesData.data.length === 0) {
          console.log(`No races found for year ${year}`);
          
          // Show a more specific error message to the user
          setError(`No race data available for ${year}. Please try another year.`);
          
          setRaceLocations(prev => ({
            ...prev,
            [year]: []
          }));
          setLoading(false);
          return;
        }
        
        // Transform the data to match our RaceLocation interface
        const today = new Date();
        const races = racesData.data.map((race: any, index: number) => {
          const raceDate = race.date ? new Date(race.date) : new Date(`${year}-01-01`);
          
          return {
            id: index + 1,
            raceId: race.raceId,
            country: race.country || 'Unknown',
            city: race.location || 'Unknown',
            date: race.date || `${year}-01-01`,
            circuit: race.circuit || race.name || 'Unknown Circuit',
            lat: parseFloat(race.lat) || 0,
            lng: parseFloat(race.lng) || 0,
            status: raceDate < today ? 'completed' : 'upcoming'
          };
        });
        
        console.log(`Successfully loaded ${races.length} races for ${year}`);
        
        if (isMounted) {
          // Update state with the fetched races
          setRaceLocations(prev => ({
            ...prev,
            [year]: races
          }));
          setLoading(false);
        }
      } catch (err: any) {
        // Don't show errors if the fetch was aborted or component unmounted
        if (err.name === 'AbortError' || !isMounted) {
          console.log('Fetch aborted or component unmounted');
          return;
        }
        
        console.error(`Error fetching races for ${year}:`, err);
        
        if (isMounted) {
          setError(`Failed to load race data for ${year}. Please try again later.`);
          // Don't set an empty array for errors - this allows retrying
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    if (selectedYear) {
      fetchRacesForYear(selectedYear);
    }
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [selectedYear]);
  
  const handleRaceCardClick = (race: RaceLocation) => {
    // Check that race has valid coordinates before selecting it
    if (race && !isNaN(race.lat) && !isNaN(race.lng) && race.lat !== 0 && race.lng !== 0) {
      setSelectedRace(race);
    } else {
      console.warn('Attempted to select race with invalid coordinates:', race);
      // Optionally show an error message
      setError('This race location cannot be displayed on the map. Please select another race.');
    }
  };
  
  const handleViewDetails = (race: RaceLocation) => {
    console.log('View details for race:', race);
    
    // Check that race has valid coordinates
    if (race && !isNaN(race.lat) && !isNaN(race.lng) && race.lat !== 0 && race.lng !== 0) {
      // Select the race to zoom to it on the map
      setSelectedRace(race);
      
      // Scroll to the map container
      const mapContainer = document.querySelector(`.${styles.mapContainer}`);
      if (mapContainer) {
        mapContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      setError(`Cannot display location for ${race.circuit || race.name} - coordinates not available.`);
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Container 
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '1200px' }}>
          {sectionTitle && (
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                textAlign: 'center', 
                mb: 3,
                color: '#E10600',
                fontWeight: 700
              }}
            >
              {sectionTitle}
            </Typography>
          )}
          
          {showFilters && (
            <div className={styles.filterContainer}>
              <label htmlFor="season-select">Select Season:</label>
              <select 
                id="season-select"
                className={styles.seasonSelect}
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                disabled={loading || availableYears.length === 0}
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}

          <Box 
            id="map-wrapper" 
            sx={{ 
              width: "100%", 
              height: fullHeight ? "600px" : "500px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              mb: 4
            }}
          >
            {loading && !raceLocations[selectedYear] ? (
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center", 
                height: "100%",
                width: "100%",
                bgcolor: "#f5f5f5"
              }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Loading race locations...</Typography>
              </Box>
            ) : (
              <MapComponent 
                races={raceLocations[selectedYear] || []}
                selectedRace={selectedRace}
              />
            )}
          </Box>
          
          {showRacesList && (
            <Box sx={{ width: '100%', mt: 4 }}>
              <Typography 
                variant="h4" 
                component="h2" 
                sx={{ 
                  textAlign: 'center', 
                  mb: 3,
                  fontWeight: 600,
                  borderBottom: '2px solid #E10600',
                  pb: 1,
                  maxWidth: 300,
                  mx: 'auto'
                }}
              >
                Race Locations
              </Typography>
              
              {loading && !raceLocations[selectedYear] && (
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 4,
                  gap: 2
                }}>
                  <CircularProgress size={30} />
                  <Typography>Loading race data...</Typography>
                </Box>
              )}
              
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    maxWidth: 600,
                    mx: 'auto',
                    mb: 4 
                  }}
                  action={
                    <Button 
                      color="error" 
                      size="small"
                      onClick={() => {
                        setError(null);
                        setRaceLocations(prev => ({...prev, [selectedYear]: undefined}));
                      }}
                    >
                      Retry
                    </Button>
                  }
                >
                  {error}
                </Alert>
              )}
              
              <Grid container spacing={3}>
                {raceLocations[selectedYear]?.map(race => (
                  <Grid item xs={12} sm={6} md={4} key={race.id}>
                    <Card 
                      elevation={3}
                      sx={{
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                        },
                        borderLeft: '4px solid #E10600',
                        borderColor: selectedRace === race ? '#E10600' : 'transparent',
                        borderWidth: selectedRace === race ? '4px' : '1px',
                        borderStyle: 'solid',
                        bgcolor: selectedRace === race ? 'rgba(225,6,0,0.05)' : 'background.paper'
                      }}
                      onClick={() => handleRaceCardClick(race)}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {race.country !== 'Unknown' ? race.country : race.name?.split(' ')[0] || 'Unknown'}
                        </Typography>
                        
                        {race.city !== 'Unknown' && (
                          <Typography variant="subtitle1" gutterBottom>
                            {race.city}
                          </Typography>
                        )}
                        
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                          {race.circuit !== 'Unknown Circuit' ? race.circuit : race.name || 'Unknown Circuit'}
                        </Typography>
                        
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {new Date(race.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </Typography>
                        
                        <Chip 
                          size="small"
                          label={race.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                          color={race.status === 'upcoming' ? 'primary' : 'error'}
                          sx={{ mb: 2 }}
                        />
                        
                        <Button
                          variant="outlined"
                          color="primary"
                          fullWidth
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(race);
                          }}
                        >
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
                
                {raceLocations[selectedYear]?.length === 0 && !loading && (
                  <Grid item xs={12}>
                    <Box sx={{ 
                      textAlign: 'center',
                      py: 4,
                      opacity: 0.7
                    }}>
                      <Typography variant="h6">
                        No race data available for {selectedYear}.
                      </Typography>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}