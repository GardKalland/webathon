'use client';

import { useEffect, useState } from 'react';

type Session = {
  session_key: number;
  country_name: string;
  circuit_short_name: string;
  session_name: string;
  date_start: string;
};

export default function HomePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch('/api/f1');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();

        console.log('Sessions:', data); // 👈 Check your browser console

        setSessions(data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">2023 Belgium Sprint Sessions</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && sessions.length === 0 && !error && <p>No sessions found.</p>}

      <ul className="space-y-2">
        {sessions.map((session) => (
          <li key={session.session_key} className="border p-2 rounded">
            <div><strong>{session.session_name}</strong> at {session.circuit_short_name}</div>
            <div>{session.country_name} – {new Date(session.date_start).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
