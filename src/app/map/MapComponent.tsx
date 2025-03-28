'use client';

import { useRef, useEffect } from 'react';
import styles from './map.module.css';

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

interface MapComponentProps {
  races: RaceLocation[];
  selectedRace: RaceLocation | null;
}

export default function MapComponent({ races, selectedRace }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  
  // Helper function to add markers to the map
  const addMarkersToMap = (L: any, racesToAdd: RaceLocation[]) => {
    // Clear previous markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
    // Create icons
    const completedIcon = new L.Icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3085/3085336.png', // Checkered flag
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
    
    const upcomingIcon = new L.Icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3097/3097145.png', // Racing flag
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
    
    // Add markers for each race
    racesToAdd.forEach(race => {
      const marker = L.marker([race.lat, race.lng], {
        icon: race.status === 'completed' ? completedIcon : upcomingIcon
      }).addTo(mapInstanceRef.current);
      
      // Add popup
      marker.bindPopup(`
        <div>
          <h3 style="margin-bottom: 5px; font-size: 16px; color: #E10600;">${race.country} - ${race.city}</h3>
          <p style="margin-bottom: 5px;">${race.circuit}</p>
          <p style="margin-bottom: 5px;">${new Date(race.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          <p style="display: inline-block; padding: 2px 8px; border-radius: 99px; font-size: 12px; font-weight: bold; margin-bottom: 5px; 
            background-color: ${race.status === 'completed' ? 'rgba(0, 128, 0, 0.1)' : 'rgba(0, 0, 255, 0.1)'};
            color: ${race.status === 'completed' ? '#006400' : '#00008B'};">
            ${race.status === 'upcoming' ? 'Upcoming' : 'Completed'}
          </p>
        </div>
      `);
      
      markersRef.current.push(marker);
    });
  };

  // Initialize map on mount
  useEffect(() => {
    // Only import and initialize Leaflet on the client-side
    if (typeof window !== 'undefined') {
      // Using a dynamic import for Leaflet
      Promise.all([
        import('leaflet'),
        import('leaflet/dist/leaflet.css')
      ]).then(([L]) => {
        // Clean up previous map instance if it exists
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
        }

        // Create new map
        const map = L.default.map(mapRef.current!).setView([20, 0], 2);
        
        // Add tile layer
        L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Save map instance to ref for later use
        mapInstanceRef.current = map;
        
        // Add initial markers right after map initialization
        if (races.length > 0) {
          addMarkersToMap(L.default, races);
        }
      });
    }
    
    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Add markers when races change
  useEffect(() => {
    if (!mapInstanceRef.current || !races.length) return;

    // Import Leaflet
    import('leaflet').then((L) => {
      addMarkersToMap(L.default, races);
    });
  }, [races]);

  // Handle selected race changes
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedRace) return;
    
    import('leaflet').then(() => {
      // Fly to the selected race
      mapInstanceRef.current.flyTo([selectedRace.lat, selectedRace.lng], 6, {
        animate: true,
        duration: 1.5
      });
      
      // Find and open the popup for the selected race
      markersRef.current.forEach(marker => {
        const position = marker.getLatLng();
        if (position.lat === selectedRace.lat && position.lng === selectedRace.lng) {
          marker.openPopup();
        }
      });
    });
  }, [selectedRace]);

  return (
    <div ref={mapRef} className={styles.mapContainer} />
  );
}
