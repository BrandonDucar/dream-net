export const config = { runtime: "edge" };

export default async function handler() {
  const headers = new Headers();
  headers.set("Set-Cookie", [
    `dreamnet_admin=;`,
    `Path=/`,
    `Secure`,
    `HttpOnly`,
    `SameSite=Lax`,
    `Max-Age=0`
  ].join("; "));
  headers.set("Location", "/");
  return new Response(null, { status: 302, headers });
}
