'use client';

import { useState, useEffect } from 'react';

export default function TestSessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch('/api/test-sessions');
        if (!res.ok) throw new Error('Failed to fetch sessions');
        const data = await res.json();
        setSessions(data.valid_sessions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) return <div className="p-4">Testing session keys 9000-11000, this may take a while...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  // Group sessions by year
  const sessionsByYear = sessions.reduce((acc, session) => {
    const year = new Date(session.data.date_start).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(session);
    return acc;
  }, {});

  // Get the latest session key
  const latestSession = sessions.length > 0 ? 
    sessions.reduce((latest, current) => 
      current.session_key > latest.session_key ? current : latest
    ) : null;

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Valid F1 Sessions (9000-11000)</h1>
      <div className="mb-4 space-y-2">
        <p>Found {sessions.length} valid sessions</p>
        {latestSession && (
          <p className="text-blue-600">
            Latest session key: {latestSession.session_key} 
            ({latestSession.data.session_name} - {new Date(latestSession.data.date_start).toLocaleDateString()})
          </p>
        )}
      </div>
      
      {Object.entries(sessionsByYear)
        .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
        .map(([year, yearSessions]: [string, any[]]) => (
          <div key={year} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {year} Sessions ({yearSessions.length})
            </h2>
            <div className="space-y-4">
              {yearSessions
                .sort((a, b) => new Date(b.data.date_start).getTime() - new Date(a.data.date_start).getTime())
                .map((session) => (
                  <div key={session.session_key} className="border p-4 rounded">
                    <h2 className="font-bold">Session Key: {session.session_key}</h2>
                    <div className="mt-2">
                      <p><strong>Name:</strong> {session.data.session_name}</p>
                      <p><strong>Circuit:</strong> {session.data.circuit_short_name}</p>
                      <p><strong>Date:</strong> {new Date(session.data.date_start).toLocaleString()}</p>
                      <p><strong>Type:</strong> {session.data.session_type}</p>
                    </div>
                    <details className="mt-2">
                      <summary className="cursor-pointer text-blue-600">View full data</summary>
                      <pre className="mt-2 bg-gray-100 p-2 rounded overflow-auto text-xs">
                        {JSON.stringify(session.data, null, 2)}
                      </pre>
                    </details>
                  </div>
              ))}
            </div>
          </div>
        ))}
    </main>
  );
} 