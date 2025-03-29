import { f1Service } from '@/database/f1Service';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const endpoint = searchParams.get('endpoint');
    
    if (!endpoint) {
      return new Response(JSON.stringify({ error: 'Missing endpoint parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    let data;
    
    switch (endpoint) {
      case 'drivers':
        data = f1Service.getAllDrivers();
        break;
        
      case 'years':
        data = f1Service.getAllYears();
        break;
        
      case 'circuits':
        data = f1Service.getAllCircuits();
        break;
        
      case 'races-by-year':
        const yearForRaces = searchParams.get('year');
        if (!yearForRaces) {
          return new Response(JSON.stringify({ error: 'Missing year parameter' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        console.log(`API: Fetching races for year ${yearForRaces}`);
        data = f1Service.getRacesForYear(Number(yearForRaces));
        console.log(`API: Found ${data.length} races for year ${yearForRaces}`);
        
        // Enhanced response for debugging
        if (data.length === 0) {
          console.log(`API: No races found for year ${yearForRaces}`);
        } else {
          console.log(`API: First race for ${yearForRaces}:`, data[0]);
        }
        break;
        
      case 'driver-history':
        const driverId = searchParams.get('id') || searchParams.get('name');
        if (!driverId) {
          return new Response(JSON.stringify({ error: 'Missing driver id or name' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        data = f1Service.getDriverHistory(
          !isNaN(Number(driverId)) ? Number(driverId) : driverId
        );
        break;
        
      case 'race-results':
        const year = searchParams.get('year');
        const round = searchParams.get('round') || searchParams.get('name');
        
        if (!year || !round) {
          return new Response(JSON.stringify({ error: 'Missing year or round/name' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        data = f1Service.getRaceResults(
          Number(year),
          !isNaN(Number(round)) ? Number(round) : round
        );
        break;
        
      case 'circuit-history':
        const circuitId = searchParams.get('id') || searchParams.get('name');
        if (!circuitId) {
          return new Response(JSON.stringify({ error: 'Missing circuit id or name' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        data = f1Service.getCircuitHistory(
          !isNaN(Number(circuitId)) ? Number(circuitId) : circuitId
        );
        break;
        
      default:
        return new Response(JSON.stringify({ error: 'Invalid endpoint' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
    }
    
    return Response.json({
      endpoint,
      count: data.length,
      data
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