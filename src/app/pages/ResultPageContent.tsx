'use client';

import { useState, useEffect } from 'react';
import { Box, Container, CircularProgress, Typography } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import styles from './ResultPageContent.module.css';

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
}

export interface ResultPageContentProps {
  sectionTitle?: string;
}

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
  
  return (
    <Box sx={{ width: '100%' }}>
      <Container maxWidth="xl">
        <div className={styles.container}>
          {sectionTitle && (
            <Typography 
              variant="h3" 
              component="h1" 
              className={styles.title}
              sx={{ textAlign: 'center', mb: 3 }}
            >
              {sectionTitle}
            </Typography>
          )}
          
          {loading ? (
            <div className={styles.loadingContainer}>
              <CircularProgress size={30} />
              <p className={styles.loading}>Loading 2025 results data...</p>
            </div>
          ) : error ? (
            <div className={styles.error}>
              <p>{error}</p>
              <button 
                className={styles.retryButton} 
                onClick={() => {
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
                }}
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Championship Standings Cards */}
              <div className={styles.standingsGrid}>
                {/* Driver Championship Standings */}
                <div className={styles.standingsCard}>
                  <h2 className={styles.standingsTitle}>
                    <EmojiEventsIcon /> Driver Championship Standings
                  </h2>
                  <table className={styles.standingsTable}>
                    <thead>
                      <tr>
                        <th>Pos</th>
                        <th>Driver</th>
                        <th>Team</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {driverStandings.map((driver) => (
                        <tr key={driver.driverId}>
                          <td className={styles.position}>{driver.position}</td>
                          <td className={styles.name}>{driver.name}</td>
                          <td>{driver.team}</td>
                          <td className={styles.points}>{driver.points}</td>
                        </tr>
                      ))}
                      {driverStandings.length === 0 && (
                        <tr>
                          <td colSpan={4} className={styles.noData}>
                            No driver standings available for 2025.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Constructor Championship Standings */}
                <div className={styles.standingsCard}>
                  <h2 className={styles.standingsTitle}>
                    <GroupsIcon /> Constructor Championship Standings
                  </h2>
                  <table className={styles.standingsTable}>
                    <thead>
                      <tr>
                        <th>Pos</th>
                        <th>Team</th>
                        <th>Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {constructorStandings.map((team) => (
                        <tr key={team.name}>
                          <td className={styles.position}>{team.position}</td>
                          <td className={styles.name}>{team.name}</td>
                          <td className={styles.points}>{team.points}</td>
                        </tr>
                      ))}
                      {constructorStandings.length === 0 && (
                        <tr>
                          <td colSpan={3} className={styles.noData}>
                            No constructor standings available for 2025.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Race Results Cards */}
              <h2 className={styles.racesTitle}>Race Results</h2>
              
              <div className={styles.raceGrid}>
                {raceResults.map((race) => (
                  <div key={race.raceId} className={styles.raceCard}>
                    <div className={styles.raceHeader}>
                      <div className={styles.raceInfo}>
                        <h3 className={styles.raceTitle}>{race.name}</h3>
                        <p className={styles.raceSubtitle}>{race.circuit}</p>
                        <p className={styles.raceDate}>
                          {new Date(race.date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <div className={styles.round}>
                        {race.round}
                      </div>
                    </div>
                    
                    <div className={styles.podiumSection}>
                      <p className={styles.podiumTitle}>Podium Finishers</p>
                      <div className={styles.podium}>
                        {/* First Place */}
                        <div className={`${styles.podiumPosition} ${styles.first}`}>
                          {race.podium.first ? (
                            <>
                              <p className={styles.podiumDriver}>{race.podium.first.driver}</p>
                              <p className={styles.podiumTeam}>{race.podium.first.team}</p>
                            </>
                          ) : (
                            <p className={styles.podiumTeam}>TBD</p>
                          )}
                        </div>
                        
                        {/* Second Place */}
                        <div className={`${styles.podiumPosition} ${styles.second}`}>
                          {race.podium.second ? (
                            <>
                              <p className={styles.podiumDriver}>{race.podium.second.driver}</p>
                              <p className={styles.podiumTeam}>{race.podium.second.team}</p>
                            </>
                          ) : (
                            <p className={styles.podiumTeam}>TBD</p>
                          )}
                        </div>
                        
                        {/* Third Place */}
                        <div className={`${styles.podiumPosition} ${styles.third}`}>
                          {race.podium.third ? (
                            <>
                              <p className={styles.podiumDriver}>{race.podium.third.driver}</p>
                              <p className={styles.podiumTeam}>{race.podium.third.team}</p>
                            </>
                          ) : (
                            <p className={styles.podiumTeam}>TBD</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button className={styles.viewDetailsButton}>
                      View Full Results <ArrowForwardIcon />
                    </button>
                  </div>
                ))}
                
                {raceResults.length === 0 && !loading && !error && (
                  <p className={styles.noData}>No race results available for 2025.</p>
                )}
              </div>
            </>
          )}
        </div>
      </Container>
    </Box>
  );
}