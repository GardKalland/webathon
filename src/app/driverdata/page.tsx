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
  year: number;
  status: string;
};

// Current F1 drivers with their numbers
const F1_DRIVERS = [
  { number: '1', name: 'Max Verstappen' },
  { number: '11', name: 'Sergio Pérez' },
  { number: '44', name: 'Lewis Hamilton' },
  { number: '63', name: 'George Russell' },
  { number: '16', name: 'Charles Leclerc' },
  { number: '55', name: 'Carlos Sainz' },
  { number: '4', name: 'Lando Norris' },
  { number: '81', name: 'Oscar Piastri' },
  { number: '14', name: 'Fernando Alonso' },
  { number: '18', name: 'Lance Stroll' },
  { number: '10', name: 'Pierre Gasly' },
  { number: '31', name: 'Esteban Ocon' },
  { number: '23', name: 'Alexander Albon' },
  { number: '2', name: 'Logan Sargeant' },
  { number: '77', name: 'Valtteri Bottas' },
  { number: '24', name: 'Zhou Guanyu' },
  { number: '3', name: 'Daniel Ricciardo' },
  { number: '22', name: 'Yuki Tsunoda' },
  { number: '27', name: 'Nico Hülkenberg' },
  { number: '20', name: 'Kevin Magnussen' },
];

// Known session keys for different Grand Prix events
const KNOWN_SESSIONS = [
  // 2024 Sessions
  { key: '9259', name: 'Bahrain GP 2024', type: 'Race', year: 2024 },
  { key: '9258', name: 'Bahrain GP 2024', type: 'Qualifying', year: 2024 },
  { key: '9257', name: 'Bahrain GP 2024', type: 'Practice 3', year: 2024 },
  { key: '9256', name: 'Bahrain GP 2024', type: 'Practice 2', year: 2024 },
  { key: '9255', name: 'Bahrain GP 2024', type: 'Practice 1', year: 2024 },
  // 2023 Sessions
  { key: '9159', name: 'Belgian GP 2023', type: 'Race', year: 2023 },
  { key: '9158', name: 'Belgian GP 2023', type: 'Qualifying', year: 2023 },
  { key: '9157', name: 'Belgian GP 2023', type: 'Sprint', year: 2023 },
  { key: '9156', name: 'Belgian GP 2023', type: 'Sprint Shootout', year: 2023 },
  { key: '9155', name: 'Belgian GP 2023', type: 'Practice 2', year: 2023 },
  { key: '9154', name: 'Belgian GP 2023', type: 'Practice 1', year: 2023 },
  { key: '9149', name: 'Hungarian GP 2023', type: 'Race', year: 2023 },
  { key: '9148', name: 'Hungarian GP 2023', type: 'Qualifying', year: 2023 },
  { key: '9147', name: 'Hungarian GP 2023', type: 'Practice 3', year: 2023 },
  { key: '9146', name: 'Hungarian GP 2023', type: 'Practice 2', year: 2023 },
  { key: '9145', name: 'Hungarian GP 2023', type: 'Practice 1', year: 2023 },
  { key: '9139', name: 'British GP 2023', type: 'Race', year: 2023 },
  { key: '9138', name: 'British GP 2023', type: 'Qualifying', year: 2023 },
  { key: '9137', name: 'British GP 2023', type: 'Practice 3', year: 2023 },
  { key: '9136', name: 'British GP 2023', type: 'Practice 2', year: 2023 },
  { key: '9135', name: 'British GP 2023', type: 'Practice 1', year: 2023 },
  // 2022 Sessions
  { key: '8259', name: 'Abu Dhabi GP 2022', type: 'Race', year: 2022 },
  { key: '8258', name: 'Abu Dhabi GP 2022', type: 'Qualifying', year: 2022 },
  { key: '8257', name: 'Abu Dhabi GP 2022', type: 'Practice 3', year: 2022 },
  { key: '8256', name: 'Abu Dhabi GP 2022', type: 'Practice 2', year: 2022 },
  { key: '8255', name: 'Abu Dhabi GP 2022', type: 'Practice 1', year: 2022 },
  { key: '8249', name: 'Brazilian GP 2022', type: 'Race', year: 2022 },
  { key: '8248', name: 'Brazilian GP 2022', type: 'Qualifying', year: 2022 },
  { key: '8247', name: 'Brazilian GP 2022', type: 'Practice 3', year: 2022 },
  { key: '8246', name: 'Brazilian GP 2022', type: 'Practice 2', year: 2022 },
  { key: '8245', name: 'Brazilian GP 2022', type: 'Practice 1', year: 2022 },
  // 2021 Sessions
  { key: '7359', name: 'Abu Dhabi GP 2021', type: 'Race', year: 2021 },
  { key: '7358', name: 'Abu Dhabi GP 2021', type: 'Qualifying', year: 2021 },
  { key: '7357', name: 'Abu Dhabi GP 2021', type: 'Practice 3', year: 2021 },
  { key: '7356', name: 'Abu Dhabi GP 2021', type: 'Practice 2', year: 2021 },
  { key: '7355', name: 'Abu Dhabi GP 2021', type: 'Practice 1', year: 2021 },
];

export default function DriverDataPage() {
  const [activeTab, setActiveTab] = useState<'realtime' | 'historical'>('realtime');
  const [driverNumber, setDriverNumber] = useState('');
  const [sessionKey, setSessionKey] = useState('');
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedData, setSelectedData] = useState<DriverData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(false);

  const years = [2025, 2024, 2023, 2022, 2021];

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

  // Update current time every second only in real-time tab
  useEffect(() => {
    if (activeTab !== 'realtime') return;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTab]);

  // Fetch sessions initially and every minute
  useEffect(() => {
    const fetchSessions = async () => {
      setLoadingSessions(true);
      try {
        const res = await fetch(`https://api.openf1.org/v1/sessions?limit=100&order=desc`);
        if (!res.ok) throw new Error('Failed to fetch sessions');
        const data = await res.json();
        
        // Convert API sessions to our format
        const apiSessions = data.map((session: any) => ({
          session_key: session.session_key,
          session_name: session.session_name,
          date_start: session.date_start,
          circuit_short_name: session.circuit_short_name,
          country_name: session.country_name,
          year: new Date(session.date_start).getFullYear(),
          status: 'Completed' // Default status for historical sessions
        }));

        // Convert known sessions to our format
        const knownSessionsFormatted = KNOWN_SESSIONS.map(session => ({
          session_key: parseInt(session.key),
          session_name: session.name,
          date_start: new Date().toISOString(), // Placeholder date
          circuit_short_name: session.name.split(' ')[0], // Use first word as circuit
          country_name: session.name.split(' ')[0], // Use first word as country
          year: session.year,
          status: session.year >= 2024 ? 'Upcoming' : 'Completed'
        }));

        // Combine and deduplicate sessions
        const allSessions = [...apiSessions, ...knownSessionsFormatted];
        const uniqueSessions = Array.from(
          new Map(allSessions.map(session => [session.session_key, session])).values()
        );

        setRecentSessions(uniqueSessions);
      } catch (err) {
        console.error('Error fetching sessions:', err);
        // If API fails, still show known sessions
        const knownSessionsFormatted = KNOWN_SESSIONS.map(session => ({
          session_key: parseInt(session.key),
          session_name: session.name,
          date_start: new Date().toISOString(),
          circuit_short_name: session.name.split(' ')[0],
          country_name: session.name.split(' ')[0],
          year: session.year,
          status: session.year >= 2024 ? 'Upcoming' : 'Completed'
        }));
        setRecentSessions(knownSessionsFormatted);
      } finally {
        setLoadingSessions(false);
      }
    };

    fetchSessions();
    // Refresh sessions every minute
    const interval = setInterval(fetchSessions, 60000);
    return () => clearInterval(interval);
  }, []);

  // Update session statuses based on current time
  useEffect(() => {
    if (activeTab !== 'realtime') return;

    setRecentSessions(prevSessions => 
      prevSessions.map(session => {
        const sessionDate = new Date(session.date_start);
        const isFuture = sessionDate > currentTime;
        const isCurrent = sessionDate <= currentTime && 
          new Date(sessionDate.getTime() + 4 * 60 * 60 * 1000) > currentTime;

        return {
          ...session,
          status: isFuture ? 'Upcoming' : isCurrent ? 'Live' : 'Completed'
        };
      })
    );
  }, [currentTime, activeTab]);

  // Auto-refresh data for real-time tab
  useEffect(() => {
    if (activeTab === 'realtime' && autoRefresh && selectedData) {
      const interval = setInterval(() => {
        fetchDriverData(selectedData.endpoint);
      }, 5000); // Refresh every 5 seconds

      return () => clearInterval(interval);
    }
  }, [activeTab, autoRefresh, selectedData]);

  const filteredSessions = recentSessions.filter(session => 
    activeTab === 'realtime' 
      ? session.status === 'Live' || session.status === 'Upcoming'
      : session.year === selectedYear
  );

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
      {activeTab === 'realtime' && (
        <div className="text-sm text-gray-600 mb-4">
          Current time: {currentTime.toLocaleString()}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-6 border-b">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('realtime')}
            className={`${
              activeTab === 'realtime'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Real-time Data
          </button>
          <button
            onClick={() => setActiveTab('historical')}
            className={`${
              activeTab === 'historical'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Historical Data
          </button>
        </nav>
      </div>

      <div className="mb-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Driver Number</label>
          <select
            value={driverNumber}
            onChange={(e) => setDriverNumber(e.target.value)}
            className="border p-2 rounded w-full md:w-auto"
          >
            <option value="">Select a driver</option>
            {F1_DRIVERS.map((driver) => (
              <option key={driver.number} value={driver.number}>
                {driver.number} - {driver.name}
              </option>
            ))}
          </select>
        </div>
        {activeTab === 'historical' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border p-2 rounded w-full md:w-auto"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
          <select
            value={sessionKey}
            onChange={(e) => setSessionKey(e.target.value)}
            className="border p-2 rounded w-full md:w-auto"
          >
            <option value="">Select a session</option>
            {filteredSessions.map((session) => (
              <option key={session.session_key} value={session.session_key}>
                {session.session_name} - {session.circuit_short_name} ({session.status})
              </option>
            ))}
          </select>
        </div>
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

      {activeTab === 'realtime' && selectedData && (
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="ml-2 text-sm text-gray-700">Auto-refresh every 5 seconds</span>
          </label>
        </div>
      )}

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
