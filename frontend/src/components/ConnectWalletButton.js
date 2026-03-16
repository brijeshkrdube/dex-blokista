import React from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useWallet } from '../context/WalletContextV2';
import { Button } from './ui/button';
import { Wallet, ChevronDown, LogOut, AlertTriangle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const ConnectWalletButton = () => {
  const { open } = useWeb3Modal();
  const { isConnected, address, isCorrectNetwork, disconnectWallet, switchNetwork, chainId } = useWallet();

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <Button
        onClick={() => open()}
        data-testid="connect-wallet-btn"
        className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-semibold rounded-xl gap-2"
      >
        <Wallet className="w-4 h-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {/* Network Warning */}
      {!isCorrectNetwork && (
        <Button
          onClick={switchNetwork}
          variant="outline"
          className="border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-xl gap-2"
        >
          <AlertTriangle className="w-4 h-4" />
          Wrong Network
        </Button>
      )}
      
      {/* Connected Address Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            data-testid="wallet-dropdown-btn"
            className="border-white/20 bg-white/5 text-white hover:bg-white/10 rounded-xl gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-green-400" />
            {formatAddress(address)}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-[#1a1a1a] border-white/10 text-white min-w-[200px]">
          <div className="px-3 py-2">
            <p className="text-xs text-gray-400">Connected</p>
            <p className="font-mono text-sm">{formatAddress(address)}</p>
          </div>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem
            onClick={() => open({ view: 'Account' })}
            className="cursor-pointer hover:bg-white/5"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Wallet Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => open({ view: 'Networks' })}
            className="cursor-pointer hover:bg-white/5"
          >
            <span className="w-4 h-4 mr-2 flex items-center justify-center">
              {isCorrectNetwork ? '✓' : '⚠'}
            </span>
            {isCorrectNetwork ? 'Blokista Network' : 'Switch Network'}
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem
            onClick={disconnectWallet}
            className="cursor-pointer hover:bg-white/5 text-red-400"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ConnectWalletButton;
