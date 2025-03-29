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
  // Add an extra ref to manually track if the map has been initialized
  const isMapInitialized = useRef<boolean>(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  
  // Helper function to add markers to the map
  const addMarkersToMap = (L: any, racesToAdd: RaceLocation[]) => {
    // Clear previous markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    
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

  // Function to initialize the map - separate from useEffect to make it cleaner
  const initializeMap = async () => {
    try {
      // Manually import Leaflet
      const L = (await import('leaflet')).default;
      
      // Import the CSS manually since we're in a client component
      await import('leaflet/dist/leaflet.css');
      
      // Validate the map container
      if (!mapRef.current) {
        console.error('Map container element not found!');
        return;
      }
      
      // Explicitly set dimensions to ensure the container is visible
      mapRef.current.style.width = '100%';
      mapRef.current.style.height = '100%';
      mapRef.current.style.minHeight = '400px';
      
      // Clean up any existing map instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
      
      // Create a new map instance with error handling
      const mapOptions = {
        minZoom: 2,
        maxBounds: [[-90, -180], [90, 180]],
        maxBoundsViscosity: 1.0,
        worldCopyJump: true
      };
      
      console.log('Creating map with container:', mapRef.current);
      const map = L.map(mapRef.current, mapOptions).setView([25, 10], 2);
      
      // Add the tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: 'abcd',
        maxZoom: 12,
        noWrap: true
      }).addTo(map);
      
      // Store the map instance and mark as initialized
      mapInstanceRef.current = map;
      isMapInitialized.current = true;
      
      // Add markers if we have them
      if (races && races.length > 0) {
        addMarkersToMap(L, races);
      }
      
      // Force a resize after a short delay to fix any sizing issues
      setTimeout(() => {
        if (map) map.invalidateSize();
      }, 300);
      
      console.log('Map initialized successfully');
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };
  
  // Initialize map on mount - with a delay to ensure DOM is ready
  useEffect(() => {
    if (typeof window === 'undefined') {
      return; // Skip on server
    }
    
    // Use setTimeout to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      if (!isMapInitialized.current) {
        initializeMap();
      }
    }, 500);
    
    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
          isMapInitialized.current = false;
        } catch (e) {
          console.error('Error cleaning up map:', e);
        }
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
      // Fly to the selected race with an appropriate zoom level
      mapInstanceRef.current.flyTo([selectedRace.lat, selectedRace.lng], 7, {
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
    <div 
      ref={mapRef} 
      className={styles.mapContainer} 
      style={{
        width: '100%',
        height: '100%',
        position: 'relative'
      }}
    />
  );
}