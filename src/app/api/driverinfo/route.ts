export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const driverNumber = searchParams.get('driver_number');
    const sessionKey = searchParams.get('session_key');

    if (!driverNumber) {
      return new Response(JSON.stringify({ error: 'Missing driver_number' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Fetching data for driver number:', driverNumber);

    const endpoints = [
      `drivers?driver_number=${driverNumber}`,
      `laps?driver_number=${driverNumber}&session_key=${sessionKey}`,
      `car_data?driver_number=${driverNumber}&session_key=${sessionKey}`,
      `pit?driver_number=${driverNumber}&session_key=${sessionKey}`,
      `position?driver_number=${driverNumber}&session_key=${sessionKey}`,
      `team_radio?driver_number=${driverNumber}&session_key=${sessionKey}`,
      `stints?driver_number=${driverNumber}&session_key=${sessionKey}`,
      `speed_trap?driver_number=${driverNumber}&session_key=${sessionKey}`,
      `race_control?session_key=${sessionKey}`,
      `weather?session_key=${sessionKey}`,
      `track_status?session_key=${sessionKey}`,
      `sessions?session_key=${sessionKey}`,
      `circuits?session_key=${sessionKey}`,
      `teams?session_key=${sessionKey}`,
    ];

    const responses = await Promise.all(
      endpoints.map(async (endpoint) => {
        try {
          console.log('Fetching endpoint:', endpoint);
          const res = await fetch(`https://api.openf1.org/v1/${endpoint}`);
          if (!res.ok) {
            console.error(`Failed to fetch ${endpoint}:`, res.status);
            return { endpoint, data: null, error: `Failed to fetch: ${res.status}` };
          }
          const data = await res.json();
          return { endpoint, data };
        } catch (err) {
          console.error(`Error fetching ${endpoint}:`, err);
          return { endpoint, data: null, error: err instanceof Error ? err.message : 'Unknown error' };
        }
      })
    );

    return Response.json({ 
      driverNumber, 
      sessionKey,
      data: responses.filter(r => r.data !== null) // Only include successful responses
    });
  } catch (err) {
    console.error('API error:', err);
    return new Response(
      JSON.stringify({ 
        error: err instanceof Error ? err.message : 'Internal server error' 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
