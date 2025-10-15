export const runtime = "edge";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const [{ now }] = await sql`select now()`;
    return Response.json({ ok: true, now }, { status: 200 });
  } catch (e:any) {
    return Response.json({ ok: false, error: String(e?.message || e) }, { status: 500 });
  }
}
