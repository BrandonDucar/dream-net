export const runtime = 'edge';

export async function POST(request: Request) {
  return new Response(JSON.stringify({ status: 'queued' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
