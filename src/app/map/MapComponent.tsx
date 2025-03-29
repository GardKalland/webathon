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
    
    // Create custom F1-themed markers
    const completedIcon = new L.Icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3085/3085336.png', // Checkered flag
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
      className: 'map-marker completed'
    });
    
    const upcomingIcon = new L.Icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/3097/3097145.png', // Racing flag
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
      className: 'map-marker upcoming'
    });
    
    // Create custom marker divIcon function
    const createCircleMarker = (race: RaceLocation) => {
      const isCompleted = race.status === 'completed';
      const bgColor = isCompleted ? '#E10600' : '#0040FF';
      
      return L.divIcon({
        className: `custom-div-icon ${isCompleted ? 'completed' : 'upcoming'}`,
        html: `<div style="background-color: ${bgColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
        popupAnchor: [0, -8]
      });
    };
    
    // Add markers for each race
    racesToAdd.forEach(race => {
      // Use the circle marker instead of the icon
      const marker = L.marker([race.lat, race.lng], {
        icon: createCircleMarker(race)
      }).addTo(mapInstanceRef.current);
      
      // Format title and add popup
      const cityDisplay = race.city !== 'Unknown' ? ` - ${race.city}` : '';
      const title = `${race.country}${cityDisplay}`;
      const circuitDisplay = race.circuit !== 'Unknown Circuit' ? race.circuit : race.name || 'Unknown';
      
      // Create a more visually appealing popup
      marker.bindPopup(`
        <div>
          <div style="background-color: #E10600; color: white; padding: 10px; margin: -10px -10px 10px -10px; border-radius: 8px 8px 0 0;">
            <h3 style="margin: 0; font-size: 16px; font-weight: bold;">${title}</h3>
          </div>
          <div style="padding: 0 5px;">
            <p style="margin: 8px 0; font-weight: bold;">${circuitDisplay}</p>
            <p style="margin: 8px 0; color: #666;">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 5px;">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              ${new Date(race.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p style="display: inline-block; padding: 3px 10px; border-radius: 99px; font-size: 12px; font-weight: bold; margin: 5px 0; 
              background-color: ${race.status === 'completed' ? 'rgba(225, 6, 0, 0.1)' : 'rgba(0, 64, 255, 0.1)'};
              color: ${race.status === 'completed' ? '#E10600' : '#0040FF'};">
              ${race.status === 'upcoming' ? 'Upcoming' : 'Completed'}
            </p>
          </div>
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

        // Create new map with a wider view
        const map = L.default.map(mapRef.current!).setView([25, 10], 2);
        
        // Add a simpler, less detailed tile layer
        L.default.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19
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
    if (!mapInstanceRef.current) {
      console.log('Map not initialized yet');
      return;
    }
    
    if (!races || races.length === 0) {
      console.log('No races to display on map');
      return;
    }

    console.log(`Adding ${races.length} race markers to map`);
    console.log('First race data:', races[0]);
    
    // Check for valid coordinates
    const validRaces = races.filter(race => 
      race && !isNaN(race.lat) && !isNaN(race.lng) && 
      race.lat !== 0 && race.lng !== 0
    );
    
    console.log(`Found ${validRaces.length} races with valid coordinates`);
    
    if (validRaces.length === 0) {
      console.warn('No races have valid coordinates!');
      return;
    }

    // Import Leaflet
    import('leaflet').then((L) => {
      addMarkersToMap(L.default, validRaces);
    });
  }, [races]);

  // Handle selected race changes
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedRace) return;
    
    import('leaflet').then(() => {
      // Fly to the selected race with a closer zoom level
      mapInstanceRef.current.flyTo([selectedRace.lat, selectedRace.lng], 9, {
        animate: true,
        duration: 1
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
    <>
      {/* Add custom styles for map elements */}
      <style jsx global>{`
        /* Custom marker styles */
        .custom-div-icon.completed {
          filter: drop-shadow(0 0 5px rgba(225, 6, 0, 0.5));
        }

        .custom-div-icon.upcoming {
          filter: drop-shadow(0 0 5px rgba(0, 64, 255, 0.5));
        }

        /* Popup styles */
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 3px 14px rgba(0,0,0,0.2);
        }

        .leaflet-popup-content {
          margin: 0;
          padding: 10px;
          line-height: 1.5;
        }

        .leaflet-popup-tip {
          background-color: white;
        }

        /* Add hover effect to markers */
        .custom-div-icon:hover {
          transform: scale(1.2);
          transition: transform 0.2s;
        }
      `}</style>
      <div ref={mapRef} className={styles.mapContainer} />
    </>
  );
}
