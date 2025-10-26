// src/components/WalletConnect.tsx

import { useState, useEffect } from 'react';
import { isConnected, getAddress, requestAccess } from '@stellar/freighter-api';

interface WalletConnectProps {
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}

export default function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkFreighterInstalled();
    checkConnection();
  }, []);

  const checkFreighterInstalled = async () => {
    const installed = await isConnected();
    setIsInstalled(installed);
  };

  const checkConnection = async () => {
    try {
      const result = await getAddress();
      const address = result?.address || result;
      if (address && typeof address === 'string') {
        setWalletAddress(address);
        onConnect(address);
      }
    } catch (error) {
      console.log('No wallet connected yet');
    }
  };

  const connectWallet = async () => {
    if (!isInstalled) {
      window.open('https://www.freighter.app/', '_blank');
      return;
    }

    setIsLoading(true);
    try {
      if (typeof window !== 'undefined') {
        await requestAccess();
      }
      
      const result = await getAddress();
      const address = result?.address || result;
      
      if (address && typeof address === 'string') {
        setWalletAddress(address);
        onConnect(address);
      } else {
        throw new Error('Could not get address');
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      if (error.message !== 'User declined access') {
        alert('Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    onDisconnect();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (!isInstalled) {
    return (
      <button
        onClick={connectWallet}
        className="btn-primary"
      >
        Install Freighter Wallet
      </button>
    );
  }

  if (walletAddress) {
    return (
      <div className="wallet-connected">
        <div className="wallet-address">
          <span className="connected-dot"></span>
          <span>{formatAddress(walletAddress)}</span>
        </div>
        <button
          onClick={disconnectWallet}
          className="btn-secondary"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isLoading}
      className="btn-primary"
    >
      {isLoading ? 'Connecting...' : 'Connect Wallet'}
    </button>
  );
}