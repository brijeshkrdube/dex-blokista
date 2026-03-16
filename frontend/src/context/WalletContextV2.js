import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, useAccount, useDisconnect, useBalance, useChainId, useSwitchChain } from 'wagmi';
import { wagmiConfig, projectId, piogoldChain } from '../config/walletconnect';
import { web3Service, PIOGOLD_NETWORK } from '../services/web3';
import { ethers } from 'ethers';

// Create QueryClient
const queryClient = new QueryClient();

// Create Web3Modal
createWeb3Modal({
  wagmiConfig,
  projectId,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#f59e0b',
    '--w3m-color-mix': '#f59e0b',
    '--w3m-color-mix-strength': 20,
  },
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
  ],
  enableAnalytics: false,
});

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

// Inner provider that uses wagmi hooks
const WalletProviderInner = ({ children }) => {
  const { address, isConnected: wagmiConnected, connector } = useAccount();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  
  const [balances, setBalances] = useState({});
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  
  const isCorrectNetwork = chainId === PIOGOLD_NETWORK.chainId;

  // Initialize provider and signer when connected
  useEffect(() => {
    const initProvider = async () => {
      if (wagmiConnected && window.ethereum) {
        try {
          const newProvider = new ethers.providers.Web3Provider(window.ethereum);
          const newSigner = newProvider.getSigner();
          setProvider(newProvider);
          setSigner(newSigner);
          
          // Also update web3Service
          web3Service.provider = newProvider;
          web3Service.signer = newSigner;
          web3Service.address = address;
          web3Service.chainId = chainId;
          web3Service.isConnected = true;
          web3Service.initContracts();
        } catch (err) {
          console.error('Error initializing provider:', err);
        }
      }
    };
    initProvider();
  }, [wagmiConnected, address, chainId]);

  // Load balances when connected
  const loadBalances = useCallback(async (walletAddress) => {
    if (!walletAddress) return;

    try {
      const nativeBalance = await web3Service.getNativeBalance(walletAddress);
      
      const realBalances = {
        'pio': parseFloat(nativeBalance)
      };
      
      const tokenAddresses = {
        'wpio': '0x9Da12b8CF8B94f2E0eedD9841E268631aF03aDb1',
        'usdt': '0x75C681D7d00b6cDa3778535Bba87E433cA369C96'
      };
      
      for (const [tokenId, tokenAddress] of Object.entries(tokenAddresses)) {
        try {
          const balance = await web3Service.getTokenBalance(tokenAddress, walletAddress);
          realBalances[tokenId] = parseFloat(balance) || 0;
        } catch (err) {
          console.error(`Error fetching ${tokenId} balance:`, err);
          realBalances[tokenId] = 0;
        }
      }
      
      setBalances(realBalances);
    } catch (err) {
      console.error('Error loading balances:', err);
      setBalances({ 'pio': 0, 'wpio': 0, 'usdt': 0 });
    }
  }, []);

  // Load balances when address changes
  useEffect(() => {
    if (address && wagmiConnected) {
      loadBalances(address);
    }
  }, [address, wagmiConnected, loadBalances]);

  const connectWallet = useCallback(async () => {
    // Web3Modal handles connection via its button
    // This is kept for backward compatibility
    setIsConnecting(true);
    try {
      // Open Web3Modal
      const { open } = await import('@web3modal/wagmi/react');
      open();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    wagmiDisconnect();
    web3Service.disconnect();
    setBalances({});
    setProvider(null);
    setSigner(null);
  }, [wagmiDisconnect]);

  const getBalance = useCallback((tokenId) => {
    return balances[tokenId] || 0;
  }, [balances]);

  const switchNetwork = useCallback(async () => {
    try {
      if (switchChain) {
        await switchChain({ chainId: PIOGOLD_NETWORK.chainId });
      } else {
        await web3Service.switchNetwork();
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [switchChain]);

  const value = {
    isConnected: wagmiConnected,
    address,
    balances,
    isConnecting,
    chainId,
    isCorrectNetwork,
    error,
    connectWallet,
    disconnectWallet,
    getBalance,
    switchNetwork,
    loadBalances,
    networkConfig: PIOGOLD_NETWORK,
    web3Service,
    provider,
    signer,
    connector,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

// Main provider with Wagmi and QueryClient
export const WalletProvider = ({ children }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WalletProviderInner>
          {children}
        </WalletProviderInner>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
