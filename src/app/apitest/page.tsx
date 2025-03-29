'use client';

import { useState } from 'react';

type DriverData = {
  endpoint: string;
  data: any[];
};

export default function DriverDataPage() {
  const [driverName, setDriverName] = useState('');
  const [selectedData, setSelectedData] = useState<DriverData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const fetchDriverData = async (endpoint: string) => {
    if (!driverName) {
      setError('Please enter a driver name');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/driverinfo?driver_name=${encodeURIComponent(driverName)}`);
      if (!res.ok) throw new Error('Failed to fetch data');
      const data = await res.json();

      // Find the specific endpoint data we want
      const endpointData = data.data.find((item: DriverData) => item.endpoint.includes(endpoint));
      setSelectedData(endpointData);
    } catch (err) {
      console.error(err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">F1 Driver Data Explorer</h1>

      <div className="mb-4">
        <input
          type="text"
          value={driverName}
          onChange={(e) => setDriverName(e.target.value)}
          placeholder="Enter driver name"
          className="border p-2 rounded mr-2"
        />
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

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

      {loading && <p>Loading...</p>}

      {selectedData && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">{selectedData.endpoint}</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(selectedData.data, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
