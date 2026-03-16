import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useWallet } from '../../context/WalletContextV2';
import { shortenAddress, NETWORK_CONFIG } from '../../data/mock';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../ui/dropdown-menu';
import {
  Wallet,
  ChevronDown,
  ExternalLink,
  Copy,
  LogOut,
  Settings,
  BarChart3,
  Droplets,
  ArrowLeftRight,
  Menu,
  X
} from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const { open } = useWeb3Modal();
  const { isConnected, address, disconnectWallet, isConnecting, networkConfig } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const navItems = [
    { path: '/swap', label: 'Swap', icon: ArrowLeftRight },
    { path: '/pools', label: 'Pools', icon: Droplets },
    { path: '/explore', label: 'Explore', icon: BarChart3 }
  ];

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = async () => {
    open();
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src="/logo.png" 
              alt="BlokSwap" 
              className="h-8 sm:h-10 w-auto object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
              <span className="text-yellow-400 text-sm font-medium">{networkConfig.name}</span>
            </div>

            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-xl gap-2"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500" />
                    {shortenAddress(address)}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-[#1a1a1a] border-white/10" align="end">
                  <DropdownMenuItem
                    onClick={handleCopyAddress}
                    className="text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copied ? 'Copied!' : 'Copy Address'}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => open({ view: 'Account' })}
                    className="text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Wallet Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => window.open(`${networkConfig.explorer}/address/${address}`, '_blank')}
                    className="text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Explorer
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem
                    onClick={disconnectWallet}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={handleConnect}
                className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black font-semibold rounded-xl gap-2"
              >
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline">Connect Wallet</span>
                <span className="sm:hidden">Connect</span>
              </Button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#0d0d0d]">
          <nav className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
