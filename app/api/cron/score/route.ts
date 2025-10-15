export async function GET() {
  // TODO: add scoring logic
  return Response.json({ ok: true, job: "score", ts: new Date().toISOString() });
}
