import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://api.openf1.org/v1/drivers');

    if (!res.ok) {
      throw new Error(`Failed to fetch drivers: ${res.status}`);
    }

    const data = await res.json();

    const uniqueDrivers = data.reduce((acc: any[], current: any) => {
      const x = acc.find(item => item.driver_number === current.driver_number);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    return NextResponse.json(uniqueDrivers);
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
