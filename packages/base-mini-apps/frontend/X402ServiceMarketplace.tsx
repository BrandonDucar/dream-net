import React, { useState, useEffect } from 'react';

let useBase: any = null;
try {
  const baseProvider = require('../../../client/src/providers/BaseProvider');
  useBase = baseProvider.useBase;
} catch (e) {}

interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  provider: string;
  category: string;
}

export function X402ServiceMarketplace() {
  const baseHook = useBase ? useBase() : null;
  const address = baseHook?.address || null;
  const isConnected = baseHook?.isConnected || false;
  const connect = baseHook?.connect || (async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      window.location.reload();
    }
  });

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/marketplace/services');
      const data = await response.json();
      if (data.services) {
        setServices(data.services);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (service: Service) => {
    if (!isConnected || !address) {
      await connect();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/x402/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: address,
          to: service.provider,
          amount: service.price,
          chain: 'base',
          serviceId: service.id,
        }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else if (data.txHash) {
        alert(`Service purchased! Transaction: ${data.txHash}`);
        fetchServices();
      }
    } catch (err: any) {
      setError(err.message || 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(services.map(s => s.category))];
  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(s => s.category === selectedCategory);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">X402 Service Marketplace</h1>
      <p className="text-gray-400 mb-6">Discover and purchase X402-powered services</p>

      {error && (
        <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      <div className="mb-6 flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded ${
              selectedCategory === cat
                ? 'bg-cyan-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading && services.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">Loading services...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.length === 0 ? (
            <p className="text-gray-400 col-span-full">No services available</p>
          ) : (
            filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{service.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-cyan-400 font-bold text-lg">{service.price} X402</p>
                    <p className="text-gray-400 text-xs">{service.category}</p>
                  </div>
                  <button
                    onClick={() => handlePurchase(service)}
                    disabled={loading || !isConnected}
                    className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm"
                  >
                    {loading ? 'Processing...' : 'Purchase'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {!isConnected && (
        <div className="mt-6 bg-gray-800 rounded-lg p-4 border border-cyan-500/20 text-center">
          <p className="text-gray-300 mb-2">Connect your wallet to purchase services</p>
          <button
            onClick={connect}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded"
          >
            Connect Wallet
          </button>
        </div>
      )}
    </div>
  );
}

