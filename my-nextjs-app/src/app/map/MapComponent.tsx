'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

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

// Component to recenter map when selected race changes
function FlyToMarker({ race }: { race: RaceLocation | null }) {
  const map = useMap();
  
  useEffect(() => {
    if (race) {
      map.flyTo([race.lat, race.lng], 6, {
        animate: true,
        duration: 1.5
      });
    }
  }, [map, race]);
  
  return null;
}

export default function MapComponent({ races, selectedRace }: MapComponentProps) {
  // Custom icon for map markers
  const customIcon = new Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/1769/1769039.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38]
  });

  return (
    <MapContainer 
      center={[20, 0]} 
      zoom={2} 
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {races.map(race => (
        <Marker 
          key={race.id} 
          position={[race.lat, race.lng]} 
          icon={customIcon}
        >
          <Popup>
            <div className="popup">
              <h3>{race.country} - {race.city}</h3>
              <p>{race.circuit}</p>
              <p>
                {new Date(race.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className={`status ${race.status}`}>
                {race.status === 'upcoming' ? 'Upcoming' : 'Completed'}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
      
      <FlyToMarker race={selectedRace} />
    </MapContainer>
  );
}