/**
 * Card Forge Pro Mini-App
 * AI-powered card creation on Base blockchain
 * Cards can be minted as NFTs, shared, or used as digital business cards
 */

import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

interface CardCreationRequest {
  cardType: 'business' | 'trading' | 'digital' | 'nft' | 'custom';
  title?: string;
  description: string;
  design?: {
    style?: string;
    colorScheme?: string;
  };
  content?: {
    name?: string;
    subtitle?: string;
    contactInfo?: {
      email?: string;
      phone?: string;
      website?: string;
    };
    imageUrl?: string;
  };
}

interface CardCreationResult {
  success: boolean;
  cardId?: string;
  cardUrl?: string;
  imageUrl?: string;
  nftTokenId?: string;
  error?: string;
}

export function CardForgeProMini() {
  const { address, isConnected } = useAccount();
  const [cardType, setCardType] = useState<CardCreationRequest['cardType']>('business');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [style, setStyle] = useState('');
  const [colorScheme, setColorScheme] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<CardCreationResult | null>(null);

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const createCard = async () => {
    if (!description.trim()) {
      setResult({ success: false, error: 'Description is required' });
      return;
    }

    setIsCreating(true);
    setResult(null);

    try {
      const request = {
        cardType,
        title: title || undefined,
        description,
        design: {
          style: style || undefined,
          colorScheme: colorScheme || undefined,
        },
        content: {
          name: name || undefined,
          subtitle: subtitle || undefined,
          contactInfo: {
            email: email || undefined,
            phone: phone || undefined,
            website: website || undefined,
          },
        },
      };

      // Call Card Forge Pro API
      const API_BASE = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${API_BASE}/api/card-forge/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      const cardResult = data.result || data;

      if (cardResult.success) {
        setResult(cardResult);

        // If cardType is 'nft', mint as NFT on Base
        if (cardType === 'nft' && isConnected && address) {
          // TODO: Deploy CardForgeNFT contract and mint here
          // For now, just log that NFT minting would happen
          console.log('[CardForgePro] Would mint NFT for card:', cardResult.cardId);
        }
      } else {
        setResult({ success: false, error: cardResult.error || 'Failed to create card' });
      }
    } catch (error: any) {
      setResult({ success: false, error: error.message || 'Failed to create card' });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center text-2xl">
              🎴
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Card Forge Pro
              </h1>
              <p className="text-gray-400">AI-powered card creation on Base</p>
            </div>
          </div>

          {!isConnected && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
              <p className="text-yellow-400 text-sm">
                Connect your wallet to mint cards as NFTs on Base blockchain
              </p>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <form onSubmit={(e) => { e.preventDefault(); createCard(); }} className="space-y-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-300">Card Type</label>
              <select
                value={cardType}
                onChange={(e) => setCardType(e.target.value as CardCreationRequest['cardType'])}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="business">Business Card</option>
                <option value="trading">Trading Card</option>
                <option value="digital">Digital Card</option>
                <option value="nft">NFT Card (Mint on Base)</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-300">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the card you want to create..."
                required
                rows={4}
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium text-gray-300">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Card title"
                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {(cardType === 'business' || cardType === 'custom') && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-300">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full name"
                      className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-300">Subtitle</label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      placeholder="Job title or role"
                      className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-300">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-300">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-gray-300">Website</label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://example.com"
                      className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-300">Style</label>
                <input
                  type="text"
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  placeholder="e.g., Modern, Classic, Minimalist"
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-gray-300">Color Scheme</label>
                <input
                  type="text"
                  value={colorScheme}
                  onChange={(e) => setColorScheme(e.target.value)}
                  placeholder="e.g., Blue & White, Dark Mode"
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isCreating || isPending || !description.trim()}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              {isCreating || isPending ? 'Creating Card...' : 'Create Card'}
            </button>
          </form>

          {result && (
            <div className={`mt-6 p-4 rounded-lg border ${
              result.success 
                ? 'bg-green-500/10 border-green-500/20' 
                : 'bg-red-500/10 border-red-500/20'
            }`}>
              {result.success ? (
                <div className="space-y-2">
                  <p className="text-green-400 font-semibold">✅ Card created successfully!</p>
                  {result.cardUrl && (
                    <a
                      href={result.cardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline block"
                    >
                      View Card →
                    </a>
                  )}
                  {result.imageUrl && (
                    <div className="mt-4">
                      <img
                        src={result.imageUrl}
                        alt="Generated card"
                        className="max-w-md rounded-lg border border-gray-600"
                      />
                    </div>
                  )}
                  {result.nftTokenId && (
                    <p className="text-sm text-gray-400">
                      NFT Token ID: {result.nftTokenId}
                    </p>
                  )}
                  {cardType === 'nft' && isConnected && (
                    <p className="text-sm text-cyan-400">
                      💡 Card can be minted as NFT on Base blockchain
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-red-400">❌ Error: {result.error}</p>
              )}
            </div>
          )}

          {isConfirmed && hash && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 text-sm">
                ✅ Transaction confirmed! Hash: {hash.substring(0, 10)}...
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h2 className="text-xl font-bold mb-4">About Card Forge Pro</h2>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>✨ AI-powered card design using Card Forge Pro GPT</li>
            <li>🎴 Create business cards, trading cards, digital cards, and NFTs</li>
            <li>🔗 Mint cards as NFTs on Base blockchain</li>
            <li>📱 Share cards digitally or download for printing</li>
            <li>🎨 Customizable styles, colors, and layouts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

