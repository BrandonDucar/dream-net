export const config = { runtime: "edge" };

function bad() { return new Response("unauthorized", { status: 401 }); }

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") || "";
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || token !== expected) return bad();
  const headers = new Headers();
  headers.set("Set-Cookie", [
    `dreamnet_admin=1`,
    `Path=/`,
    `Secure`,
    `HttpOnly`,
    `SameSite=Lax`,
    `Max-Age=${60 * 60 * 12}`
  ].join("; "));
  headers.set("Location", "/");
  return new Response(null, { status: 302, headers });
}
