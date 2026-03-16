import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { defineChain } from 'viem';

// Define Blokista custom chain
export const blokistaChain = defineChain({
  id: 639054,
  name: 'Blokista Mainnet',
  nativeCurrency: {
    name: 'BCC',
    symbol: 'BCC',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://mainnet-rpc.bccscan.com'] },
    public: { http: ['https://mainnet-rpc.bccscan.com'] },
  },
  blockExplorers: {
    default: { name: 'BCCScan', url: 'https://bccscan.com' },
  },
});

// WalletConnect Project ID
export const projectId = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '513721ec1e707504b869630941a98578';

// App metadata for WalletConnect
export const metadata = {
  name: 'BlokSwap',
  description: 'The Institutional-Grade Blockchain Exchange Platform on Blokista Network',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://blokswap.io',
  icons: [typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : 'https://blokswap.io/logo.png'],
};

// Wagmi config for WalletConnect
export const wagmiConfig = defaultWagmiConfig({
  chains: [blokistaChain],
  projectId,
  metadata,
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: false,
});
