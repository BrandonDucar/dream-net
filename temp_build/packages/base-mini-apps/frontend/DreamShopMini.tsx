import React, { useState } from 'react';

interface ShopItem {
  id: string;
  name: string;
  price: number;
  currency: string;
  tag: string;
  emoji: string;
}

interface CartItem extends ShopItem {
  quantity: number;
}

export function DreamShopMini() {
  const [items] = useState<ShopItem[]>([
    { id: '1', name: 'Jaggy NFT', price: 0.1, currency: 'ETH', tag: 'NFT', emoji: '🐱' },
    { id: '2', name: 'Access Pass', price: 0.05, currency: 'ETH', tag: 'Pass', emoji: '🎫' },
    { id: '3', name: 'Dream Badge', price: 0.02, currency: 'ETH', tag: 'Badge', emoji: '🏅' },
    { id: '4', name: 'Premium Tier', price: 0.15, currency: 'ETH', tag: 'Tier', emoji: '⭐' },
    { id: '5', name: 'Agent Unlock', price: 0.08, currency: 'ETH', tag: 'Unlock', emoji: '🤖' },
    { id: '6', name: 'Cloud Storage', price: 0.03, currency: 'ETH', tag: 'Storage', emoji: '☁️' },
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (item: ShopItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(i => (i.id === itemId ? { ...i, quantity } : i))
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    // TODO: Integrate with payment processing
    alert(`Checkout: ${total.toFixed(4)} ETH\n\nTODO: Connect to payment gateway`);
    setCart([]);
    setShowCart(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                🛒 Dream Shop Mini
              </h1>
              <p className="text-gray-400">Browse and purchase DreamNet items</p>
            </div>
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Cart ({cart.length})
            </button>
          </div>

          {showCart && (
            <div className="mb-6 p-4 bg-gray-700/50 rounded-lg border border-gray-600">
              <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
              {cart.length === 0 ? (
                <p className="text-gray-400">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-2 mb-4">
                    {cart.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-2 bg-gray-600 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{item.emoji}</span>
                          <span>{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 bg-gray-500 rounded text-sm"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 bg-gray-500 rounded text-sm"
                          >
                            +
                          </button>
                          <span className="w-20 text-right">
                            {(item.price * item.quantity).toFixed(4)} {item.currency}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-400 hover:text-red-300 ml-2"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-600">
                    <span className="text-xl font-bold">Total: {total.toFixed(4)} ETH</span>
                    <button
                      onClick={handleCheckout}
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(item => (
              <div
                key={item.id}
                className="p-4 bg-gray-700/50 rounded-lg border border-gray-600 hover:border-cyan-500/50 transition-colors"
              >
                <div className="text-4xl mb-2">{item.emoji}</div>
                <h3 className="text-lg font-bold mb-1">{item.name}</h3>
                <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded">
                  {item.tag}
                </span>
                <div className="mt-3 flex justify-between items-center">
                  <span className="text-xl font-bold">
                    {item.price} {item.currency}
                  </span>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-1 rounded text-sm font-semibold transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
            <p className="text-sm text-gray-400">
              📝 TODO: Connect to on-chain payment processing (Base payment SDK)
            </p>
            <p className="text-sm text-gray-400 mt-1">
              📝 TODO: Integrate with NFT minting contracts for item delivery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

