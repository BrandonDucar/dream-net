import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function DreamCallOptIn() {
  const [phone, setPhone] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleOptIn = async () => {
    const res = await fetch('/api/opt-in-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    if (res.ok) setConfirmed(true);
  };

  return (
    <div className="bg-black border border-purple-700 p-6 rounded-xl max-w-md mx-auto text-white">
      <h3 className="text-xl font-bold mb-2">📞 Dream Call Alerts</h3>
      <p className="mb-4 text-sm text-purple-300">
        Get a text when your dream hits a milestone or needs your attention. Powered by Dream Network Agents.
      </p>
      {confirmed ? (
        <div className="text-green-400 font-semibold">✅ You're in. Your dream will call soon.</div>
      ) : (
        <>
          <Input
            type="tel"
            placeholder="+1 (555) 555-5555"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mb-2 bg-zinc-800 border-purple-600 text-white"
          />
          <Button onClick={handleOptIn} className="bg-purple-700 hover:bg-purple-800 w-full">
            Sign Me Up
          </Button>
        </>
      )}
    </div>
  );
}