export async function GET() {
  // TODO: add archive logic
  return Response.json({ ok: true, job: "archive", ts: new Date().toISOString() });
}
