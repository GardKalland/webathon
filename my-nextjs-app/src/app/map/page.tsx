'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import dynamic from 'next/dynamic';

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

// Dynamically import the Map component with no SSR
const MapComponent = dynamic(
  () => import('./MapComponent'),
  { 
    ssr: false,
    loading: () => (
      <div className={styles.mapPlaceholder}>
        <p>Loading map...</p>
      </div>
    ) 
  }
);

export default function MapPage() {
  const [selectedSeason, setSelectedSeason] = useState<string>('2023');
  const [selectedRace, setSelectedRace] = useState<RaceLocation | null>(null);
  
  // This data would normally come from your API service
  // Replace with actual data from OpenF1 API
  const seasons = ['2021', '2022', '2023', '2024'];
  
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
    '2022': [],
    '2021': []
  };

  const handleRaceCardClick = (race: RaceLocation) => {
    setSelectedRace(race);
  };

  return (
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
  );
}