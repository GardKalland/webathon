export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const driverName = searchParams.get('driver_name');

  if (!driverName) {
    return new Response(JSON.stringify({ error: 'Missing driver_name' }), { status: 400 });
  }

  const endpoints = [
    `drivers?broadcast_name=${encodeURIComponent(driverName)}`,
    `laps?driver_name=${encodeURIComponent(driverName)}`,
    `car_data?driver_name=${encodeURIComponent(driverName)}`,
    `pit?driver_name=${encodeURIComponent(driverName)}`,
    `position?driver_name=${encodeURIComponent(driverName)}`,
    `team_radio?driver_name=${encodeURIComponent(driverName)}`,
    `stints?driver_name=${encodeURIComponent(driverName)}`,
  ];

  try {
    const responses = await Promise.all(
      endpoints.map(async (endpoint) => {
        const res = await fetch(`https://api.openf1.org/v1/${endpoint}`);
        const data = await res.json();
        return { endpoint, data };
      })
    );

    return Response.json({ driver: driverName, data: responses });
  } catch (err) {
    console.error('Fetch error:', err);
    return new Response(JSON.stringify({ error: 'Fetch failed' }), { status: 500 });
  }
}
