// Mock data for BlokSwap DEX

export const NETWORK_CONFIG = {
  name: 'Blokista Mainnet',
  rpc: 'https://mainnet-rpc.bccscan.com',
  chainId: 639054,
  symbol: 'BCC',
  explorer: 'https://bccscan.com'
};

export const TOKENS = [
  {
    id: 'bcc',
    symbol: 'BCC',
    name: 'Blokista',
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=bcc&backgroundColor=DAA520',
    price: 1.00,
    priceChange: 0.00,
    isNative: true
  },
  {
    id: 'wbcc',
    symbol: 'WBCC',
    name: 'Wrapped BCC',
    address: '0x0Ed138DaB3f9beEfeA779Af0b62fB3b2A220C4bc',
    decimals: 18,
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=wbcc&backgroundColor=B8860B',
    price: 1.00,
    priceChange: 0.00
  },
  {
    id: 'bcusd',
    symbol: 'BCUSD',
    name: 'BC USD Stablecoin',
    address: '0x3170cFa5B8cfD091ea15EB10f20307DB2FD9b7B8',
    decimals: 18,
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=bcusd&backgroundColor=2775CA',
    price: 1.00,
    priceChange: 0.00
  }
];

export const POOLS = [
  {
    id: 'pool1',
    token0: TOKENS[1], // WBCC
    token1: TOKENS[2], // BCUSD
    fee: 0.3,
    tvl: 0,
    volume24h: 0,
    apr: 0,
    userLiquidity: 0
  }
];

export const USER_POSITIONS = [];

export const RECENT_TRANSACTIONS = [];

export const PROTOCOL_STATS = {
  totalVolume: '0',
  tvl: '0',
  totalSwappers: '0',
  volume24h: '0'
};

export const FEE_TIERS = [
  { value: 0.01, label: '0.01%', description: 'Best for very stable pairs' },
  { value: 0.05, label: '0.05%', description: 'Best for stable pairs' },
  { value: 0.3, label: '0.3%', description: 'Best for most pairs' },
  { value: 1.0, label: '1%', description: 'Best for exotic pairs' }
];

// Helper functions
export const formatCurrency = (value, decimals = 2) => {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(decimals)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(decimals)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(decimals)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(decimals)}K`;
  return `$${value.toFixed(decimals)}`;
};

export const formatNumber = (value, decimals = 4) => {
  return parseFloat(value).toFixed(decimals);
};

export const shortenAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};
