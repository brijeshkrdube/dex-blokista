import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { defineChain } from 'viem';

// Define PIOGOLD custom chain
export const piogoldChain = defineChain({
  id: 42357,
  name: 'PIOGOLD Mainnet',
  nativeCurrency: {
    name: 'PIO',
    symbol: 'PIO',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://datasheed.pioscan.com'] },
    public: { http: ['https://datasheed.pioscan.com'] },
  },
  blockExplorers: {
    default: { name: 'PIOScan', url: 'https://pioscan.com' },
  },
});

// WalletConnect Project ID
export const projectId = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '513721ec1e707504b869630941a98578';

// App metadata for WalletConnect
export const metadata = {
  name: 'PioSwap',
  description: 'Decentralized Exchange on PIOGOLD Network',
  url: typeof window !== 'undefined' ? window.location.origin : 'https://pioswap.ai',
  icons: [typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : 'https://pioswap.ai/logo.png'],
};

// Wagmi config for WalletConnect
export const wagmiConfig = defaultWagmiConfig({
  chains: [piogoldChain],
  projectId,
  metadata,
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: false,
});
