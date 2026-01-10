import React, { useState } from 'react';
import { CONTRACT_ADDRESSES } from './config.js';

export function WhisperMessengerApp() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const sendWhisper = async () => {
    // Placeholder - would integrate with WhisperMessenger contract
    alert('Whisper sending coming soon! Contract: ' + CONTRACT_ADDRESSES.WhisperMessenger);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">Whisper Messenger</h1>
      
      <div className="mb-6">
        <button
          onClick={sendWhisper}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
        >
          Send Whisper
        </button>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-gray-400">No whispers yet. Send your first encrypted message!</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="bg-gray-800 rounded-lg p-4 border border-cyan-500/20">
              <p className="text-white">{msg.contentHash}</p>
              <p className="text-gray-400 text-sm">From: {msg.from}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

