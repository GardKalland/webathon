'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Box, Container } from '@mui/material';
import { F1Header } from '@/app/components/Header/F1Header';
import { Footer } from '@/app/components/Footer/Footer';
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
}

// API response type
interface Session {
  session_key: number;
  country_name: string;
  circuit_short_name: string;
  session_name: string;
  date_start: string;
  location_lat?: number;
  location_long?: number;
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

export default function MapPage() {
  const [selectedSeason, setSelectedSeason] = useState<string>('2025');
  const [selectedRace, setSelectedRace] = useState<RaceLocation | null>(null);
  const [apiSessions, setApiSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch API data
  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/f1');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        
        console.log('Sessions from API:', data);
        setApiSessions(data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load sessions from API');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);
  
  // Static data for other seasons and as fallback
  const seasons = ['2021', '2022', '2023', '2024', '2025'];
  
  const raceLocations: Record<string, RaceLocation[]> = {
    '2023': [
      {
        id: 1,
        country: 'Bahrain',
        city: 'Sakhir',
        date: '2023-03-05',
        circuit: 'Bahrain International Circuit',
        lat: 26.0325,
        lng: 50.5106,
        status: 'completed'
      },
      {
        id: 2,
        country: 'Saudi Arabia',
        city: 'Jeddah',
        date: '2023-03-19',
        circuit: 'Jeddah Corniche Circuit',
        lat: 21.6319,
        lng: 39.1044,
        status: 'completed'
      },
      {
        id: 3,
        country: 'Australia',
        city: 'Melbourne',
        date: '2023-04-02',
        circuit: 'Albert Park Circuit',
        lat: -37.8497,
        lng: 144.9684,
        status: 'completed'
      },
    ],
    '2024': [
      {
        id: 1,
        country: 'Bahrain',
        city: 'Sakhir',
        date: '2024-03-02',
        circuit: 'Bahrain International Circuit',
        lat: 26.0325,
        lng: 50.5106,
        status: 'completed'
      },
      {
        id: 2,
        country: 'Saudi Arabia',
        city: 'Jeddah',
        date: '2024-03-09',
        circuit: 'Jeddah Corniche Circuit',
        lat: 21.6319,
        lng: 39.1044,
        status: 'completed'
      },
      {
        id: 3,
        country: 'Australia',
        city: 'Melbourne',
        date: '2024-03-24',
        circuit: 'Albert Park Circuit',
        lat: -37.8497,
        lng: 144.9684,
        status: 'upcoming'
      },
    ],
    '2025': [
      {
        id: 1,
        country: 'Australia',
        city: 'Melbourne',
        date: '2025-03-16',
        circuit: 'Albert Park Circuit',
        lat: -37.8497,
        lng: 144.9684,
        status: 'completed'
      },
      {
        id: 2,
        country: 'China',
        city: 'Shanghai',
        date: '2025-03-23',
        circuit: 'Shanghai International Circuit',
        lat: 31.3389,
        lng: 121.2222,
        status: 'completed'
      },
      {
        id: 3,
        country: 'Japan',
        city: 'Suzuka',
        date: '2025-04-06',
        circuit: 'Suzuka International Racing Course',
        lat: 34.8431,
        lng: 136.5407,
        status: 'upcoming'
      },
      {
        id: 4,
        country: 'Bahrain',
        city: 'Sakhir',
        date: '2025-04-13',
        circuit: 'Bahrain International Circuit',
        lat: 26.0325,
        lng: 50.5106,
        status: 'upcoming'
      },
      {
        id: 5,
        country: 'Saudi Arabia',
        city: 'Jeddah',
        date: '2025-04-20',
        circuit: 'Jeddah Corniche Circuit',
        lat: 21.6319,
        lng: 39.1044,
        status: 'upcoming'
      },
      {
        id: 6,
        country: 'United States',
        city: 'Miami',
        date: '2025-05-04',
        circuit: 'Miami International Autodrome',
        lat: 25.9581,
        lng: -80.2387,
        status: 'upcoming'
      },
      {
        id: 7,
        country: 'Italy',
        city: 'Imola',
        date: '2025-05-18',
        circuit: 'Autodromo Enzo e Dino Ferrari',
        lat: 44.3439,
        lng: 11.7167,
        status: 'upcoming'
      },
      {
        id: 8,
        country: 'Monaco',
        city: 'Monte Carlo',
        date: '2025-05-25',
        circuit: 'Circuit de Monaco',
        lat: 43.7347,
        lng: 7.4206,
        status: 'upcoming'
      },
      {
        id: 9,
        country: 'Spain',
        city: 'Barcelona',
        date: '2025-06-01',
        circuit: 'Circuit de Barcelona-Catalunya',
        lat: 41.5689,
        lng: 2.2611,
        status: 'upcoming'
      },
      {
        id: 10,
        country: 'Canada',
        city: 'Montreal',
        date: '2025-06-15',
        circuit: 'Circuit Gilles Villeneuve',
        lat: 45.5017,
        lng: -73.5673,
        status: 'upcoming'
      },
      {
        id: 11,
        country: 'Austria',
        city: 'Spielberg',
        date: '2025-06-29',
        circuit: 'Red Bull Ring',
        lat: 47.2197,
        lng: 14.7647,
        status: 'upcoming'
      },
      {
        id: 12,
        country: 'Great Britain',
        city: 'Silverstone',
        date: '2025-07-06',
        circuit: 'Silverstone Circuit',
        lat: 52.0786,
        lng: -1.0161,
        status: 'upcoming'
      },
      {
        id: 13,
        country: 'Belgium',
        city: 'Spa',
        date: '2025-07-27',
        circuit: 'Circuit de Spa-Francorchamps',
        lat: 50.4372,
        lng: 5.9714,
        status: 'upcoming'
      },
      {
        id: 14,
        country: 'Hungary',
        city: 'Budapest',
        date: '2025-08-03',
        circuit: 'Hungaroring',
        lat: 47.5830,
        lng: 19.2526,
        status: 'upcoming'
      },
      {
        id: 15,
        country: 'Netherlands',
        city: 'Zandvoort',
        date: '2025-08-31',
        circuit: 'Circuit Zandvoort',
        lat: 52.3888,
        lng: 4.5459,
        status: 'upcoming'
      },
      {
        id: 16,
        country: 'Italy',
        city: 'Monza',
        date: '2025-09-07',
        circuit: 'Autodromo Nazionale Monza',
        lat: 45.6156,
        lng: 9.2811,
        status: 'upcoming'
      },
      {
        id: 17,
        country: 'Azerbaijan',
        city: 'Baku',
        date: '2025-09-21',
        circuit: 'Baku City Circuit',
        lat: 40.3725,
        lng: 49.8533,
        status: 'upcoming'
      },
      {
        id: 18,
        country: 'Singapore',
        city: 'Singapore',
        date: '2025-10-05',
        circuit: 'Marina Bay Street Circuit',
        lat: 1.2914,
        lng: 103.8640,
        status: 'upcoming'
      },
      {
        id: 19,
        country: 'United States',
        city: 'Austin',
        date: '2025-10-19',
        circuit: 'Circuit of the Americas',
        lat: 30.1328,
        lng: -97.6411,
        status: 'upcoming'
      },
      {
        id: 20,
        country: 'Mexico',
        city: 'Mexico City',
        date: '2025-10-26',
        circuit: 'Autódromo Hermanos Rodríguez',
        lat: 19.4042,
        lng: -99.0907,
        status: 'upcoming'
      },
      {
        id: 21,
        country: 'Brazil',
        city: 'São Paulo',
        date: '2025-11-09',
        circuit: 'Autódromo José Carlos Pace',
        lat: -23.7036,
        lng: -46.6997,
        status: 'upcoming'
      },
      {
        id: 22,
        country: 'United States',
        city: 'Las Vegas',
        date: '2025-11-22',
        circuit: 'Las Vegas Strip Circuit',
        lat: 36.1699,
        lng: -115.1398,
        status: 'upcoming'
      },
      {
        id: 23,
        country: 'Qatar',
        city: 'Lusail',
        date: '2025-11-30',
        circuit: 'Lusail International Circuit',
        lat: 25.4719,
        lng: 51.4244,
        status: 'upcoming'
      },
      {
        id: 24,
        country: 'UAE',
        city: 'Abu Dhabi',
        date: '2025-12-07',
        circuit: 'Yas Marina Circuit',
        lat: 24.4672,
        lng: 54.6031,
        status: 'upcoming'
      }
    ],
    '2022': [],
    '2021': []
  };

  // Process API sessions to merge with static data
  useEffect(() => {
    if (apiSessions.length > 0) {
      console.log('Processing API sessions for UI');
      // In a real implementation, we would merge the API data with our static data
      // or replace entirely, depending on requirements
    }
  }, [apiSessions]);

  const handleRaceCardClick = (race: RaceLocation) => {
    setSelectedRace(race);
  };

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Teams', href: '/teams' },
    { label: 'Drivers', href: '/drivers' },
    { label: 'Calendar', href: '/map', isActive: true },
    { label: 'Results', href: '/results' },
  ];

  return (
    <>
      <F1Header navItems={navItems} />
      <Box sx={{ pt: 12, pb: 8 }}>
        <Container maxWidth="xl">
          <div className={styles.container}>
            <h1 className={styles.title}>F1 Race Calendar</h1>
            
            <div className={styles.filterContainer}>
              <label htmlFor="season-select">Select Season:</label>
              <select 
                id="season-select"
                className={styles.seasonSelect}
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
              >
                {seasons.map(season => (
                  <option key={season} value={season}>{season}</option>
                ))}
              </select>
            </div>

            <div className={styles.mapContainer}>
              <MapComponent 
                races={raceLocations[selectedSeason] || []}
                selectedRace={selectedRace}
              />
            </div>
            
            <h2 className={styles.racesTitle}>Race Locations</h2>
            
            {loading && <p className={styles.loading}>Loading race data...</p>}
            {error && <p className={styles.error}>{error}</p>}
            
            <div className={styles.raceGrid}>
              {raceLocations[selectedSeason]?.map(race => (
                <div 
                  key={race.id} 
                  className={`${styles.raceCard} ${selectedRace === race ? styles.selectedCard : ''}`}
                  onClick={() => handleRaceCardClick(race)}
                >
                  <h2>{race.country}</h2>
                  <h3>{race.city}</h3>
                  <p className={styles.circuit}>{race.circuit}</p>
                  <p className={styles.date}>
                    {new Date(race.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className={`${styles.status} ${styles[race.status]}`}>
                    {race.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                  </p>
                  <button className={styles.detailsButton}>View Details</button>
                </div>
              ))}
              
              {raceLocations[selectedSeason]?.length === 0 && (
                <p className={styles.noData}>No race data available for this season.</p>
              )}
            </div>
          </div>
        </Container>
      </Box>
      <Footer />
    </>
  );
}