// Wallet utility functions
export function getWallet(): string | null {
  // Check if wallet is connected from localStorage or context
  const savedWallet = localStorage.getItem('connectedWallet');
  if (savedWallet) {
    return savedWallet;
  }
  
  // Return default wallet for demo purposes
  return '0x742d35Cc6aF42344266F7Eb';
}

export function connectWallet(): Promise<string> {
  // Simulate wallet connection
  return new Promise((resolve) => {
    setTimeout(() => {
      const demoWallet = '0x742d35Cc6aF42344266F7Eb';
      localStorage.setItem('connectedWallet', demoWallet);
      resolve(demoWallet);
    }, 1000);
  });
}

export function disconnectWallet(): void {
  localStorage.removeItem('connectedWallet');
}