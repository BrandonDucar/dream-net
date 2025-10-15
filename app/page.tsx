"use client";

export default function Page() {
  return (
    <main className="min-h-screen p-8 flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">DreamNet is booting…</h1>
      <p>Health: <a className="underline" href="/api/health">/api/health</a></p>
      <p>Status: <a className="underline" href="/api/status">/api/status</a></p>
      <nav className="flex gap-4">
        <a className="underline" href="/admin">/admin</a>
        <a className="underline" href="/status">/status</a>
      </nav>
    </main>
  );
}
