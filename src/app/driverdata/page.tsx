'use client';

import { useState, useEffect } from 'react';

type DriverData = {
  endpoint: string;
  data: any[];
};

type Session = {
  session_key: number;
  session_name: string;
  date_start: string;
  circuit_short_name: string;
  country_name: string;
};

export default function DriverDataPage() {
  const [driverNumber, setDriverNumber] = useState('');
  const [sessionKey, setSessionKey] = useState('');
  const [selectedData, setSelectedData] = useState<DriverData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const dataTypes = [
    { name: 'Driver Info', endpoint: 'drivers' },
    { name: 'Lap Times', endpoint: 'laps' },
    { name: 'Car Data', endpoint: 'car_data' },
    { name: 'Pit Stops', endpoint: 'pit' },
    { name: 'Position', endpoint: 'position' },
    { name: 'Team Radio', endpoint: 'team_radio' },
    { name: 'Stints', endpoint: 'stints' },
    { name: 'Speed Trap', endpoint: 'speed_trap' },
    { name: 'Race Control', endpoint: 'race_control' },
    { name: 'Weather', endpoint: 'weather' },
    { name: 'Track Status', endpoint: 'track_status' },
    { name: 'Sessions', endpoint: 'sessions' },
    { name: 'Circuits', endpoint: 'circuits' },
    { name: 'Teams', endpoint: 'teams' },
  ];

  useEffect(() => {
    const fetchRecentSessions = async () => {
      setLoadingSessions(true);
      try {
        const res = await fetch('https://api.openf1.org/v1/sessions?limit=10&order=desc');
        if (!res.ok) throw new Error('Failed to fetch sessions');
        const data = await res.json();
        setRecentSessions(data);
      } catch (err) {
        console.error('Error fetching sessions:', err);
      } finally {
        setLoadingSessions(false);
      }
    };

    fetchRecentSessions();
  }, []);

  const fetchDriverData = async (endpoint: string) => {
    if (!driverNumber) {
      setError('Please enter a driver number');
      return;
    }

    if (!sessionKey) {
      setError('Please enter a session key');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching data for driver number:', driverNumber, 'session:', sessionKey, 'endpoint:', endpoint);
      const res = await fetch(`/api/driverinfo?driver_number=${driverNumber}&session_key=${sessionKey}`);
      console.log('Response status:', res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch data: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      console.log('Received data:', data);

      const endpointData = data.data.find((item: DriverData) => item.endpoint.includes(endpoint));
      console.log('Found endpoint data:', endpointData);

      if (!endpointData) {
        throw new Error(`No data found for endpoint: ${endpoint}`);
      }

      setSelectedData(endpointData);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">F1 Driver Data Explorer</h1>

      <div className="mb-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Driver Number</label>
          <input
            type="text"
            value={driverNumber}
            onChange={(e) => setDriverNumber(e.target.value)}
            placeholder="Enter driver number (e.g., 55 for Carlos Sainz)"
            className="border p-2 rounded w-full md:w-auto"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Session Key</label>
          <input
            type="text"
            value={sessionKey}
            onChange={(e) => setSessionKey(e.target.value)}
            placeholder="Enter session key (e.g., 9159)"
            className="border p-2 rounded w-full md:w-auto"
          />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Recent Sessions</h2>
        {loadingSessions ? (
          <p>Loading sessions...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {recentSessions.map((session) => (
              <div
                key={session.session_key}
                className="border p-3 rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => setSessionKey(session.session_key.toString())}
              >
                <div className="font-medium">{session.session_name}</div>
                <div className="text-sm text-gray-600">{session.circuit_short_name}</div>
                <div className="text-sm text-gray-600">{session.country_name}</div>
                <div className="text-sm text-gray-500">
                  {new Date(session.date_start).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-400">Session Key: {session.session_key}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-6">
        {dataTypes.map((type) => (
          <button
            key={type.endpoint}
            onClick={() => fetchDriverData(type.endpoint)}
            disabled={loading}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {type.name}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-4">
          <p>Loading...</p>
        </div>
      )}

      {selectedData && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">{selectedData.endpoint}</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[600px]">
            {JSON.stringify(selectedData.data, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
} 
