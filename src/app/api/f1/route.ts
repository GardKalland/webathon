export async function GET() {
  const url = 'https://api.openf1.org/v1/sessions?year=2025';

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log('STATUS:', response.status);
    console.log('DATA:', data);

    return Response.json(data);
  } catch (err) {
    console.error('Fetch error:', err);
    return new Response(JSON.stringify({ error: 'Fetch failed' }), {
      status: 500,
    });
  }
}
