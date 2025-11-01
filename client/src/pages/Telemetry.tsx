
import React, { useState, useEffect } from 'react';
import { getHealth, pingNeon, pingUpstash } from '../services/telemetry';

const Telemetry: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [neon, setNeon] = useState<any>(null);
  const [upstash, setUpstash] = useState<any>(null);

  useEffect(() => {
    getHealth().then(setHealth);
    pingNeon().then(setNeon);
    pingUpstash().then(setUpstash);
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Telemetry</h1>
      <div>
        <h2 className="text-xl">API Health:</h2>
        <pre>{JSON.stringify(health, null, 2)}</pre>
      </div>
      <div>
        <h2 className="text-xl">Neon DB Status:</h2>
        <pre>{JSON.stringify(neon, null, 2)}</pre>
      </div>
      <div>
        <h2 className="text-xl">Upstash Redis Status:</h2>
        <pre>{JSON.stringify(upstash, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Telemetry;
