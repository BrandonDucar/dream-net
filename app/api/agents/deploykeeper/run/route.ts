export const runtime = 'edge';

export async function POST() {
  return new Response(JSON.stringify({ status: 'queued' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
