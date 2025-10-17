export const runtime = 'edge';

export async function POST(request: Request) {
  return new Response(JSON.stringify({ status: 'armed' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
