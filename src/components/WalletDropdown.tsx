import React, { useState, useRef, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { 
  LogOut, 
  Copy, 
  Check, 
  ExternalLink, 
  ChevronDown, 
  Shield, 
  Wallet,
  Radio
} from 'lucide-react';

interface WalletDropdownProps {
  className?: string;
  align?: 'left' | 'right';
}

export const WalletDropdown: React.FC<WalletDropdownProps> = ({ 
  className = '', 
  align = 'right' 
}) => {
  const { account, connected, disconnect, connect } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formatAddress = (addr?: string | null) => {
    if (!addr) return '0x71C...4e2';
    const str = addr.toString();
    return `${str.substring(0, 6)}...${str.substring(str.length - 4)}`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (account?.address) {
      navigator.clipboard.writeText(account.address.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDisconnect = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    try {
      await disconnect();
    } catch (err) {
      console.warn("Wallet disconnect error:", err);
    }
  };

  if (!connected || !account) {
    return (
      <button
        onClick={() => connect("Petra")}
        className="bg-[#C05800] text-[#FDFBD4] px-5 py-2 rounded-lg hover:bg-[#A64C00] font-semibold text-xs tracking-wider uppercase transition-all outer-glow-hover active:scale-95 flex items-center gap-2 shadow-[0_0_15px_rgba(192,88,0,0.3)]"
      >
        <Wallet className="w-4 h-4" />
        <span>Connect Wallet</span>
      </button>
    );
  }

  const fullAddress = account.address?.toString() || '0x71c8932fa...4e2';

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Clickable Wallet Button Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3.5 py-1.5 rounded-full border border-[#C05800]/50 bg-[#2A1803] text-xs text-[#D9C2B5] hover:text-[#FDFBD4] hover:border-[#C05800] transition-all flex items-center gap-2 font-mono shadow-md cursor-pointer group"
        aria-expanded={isOpen}
      >
        <span className="w-2 h-2 rounded-full bg-[#E27122] animate-pulse"></span>
        <span>{formatAddress(fullAddress)}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#D9C2B5] group-hover:text-[#FDFBD4] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-2 w-72 rounded-2xl bg-[#2E1C06] border border-[#C05800]/40 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-50 overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150`}
        >
          {/* Header section */}
          <div className="p-4 bg-[#201000]/60 border-b border-[#53443A]/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#FDFBD4]">
                <Shield className="w-4 h-4 text-[#FFB786]" />
                <span>Petra Wallet</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-green-950/80 text-green-300 text-[10px] font-mono border border-green-800/40">
                Connected
              </span>
            </div>

            <div className="text-[11px] font-mono text-[#D9C2B5] bg-[#201000] p-2 rounded-lg border border-[#53443A]/40 flex justify-between items-center break-all">
              <span className="truncate max-w-[180px]">{fullAddress}</span>
              <button
                onClick={handleCopy}
                className="p-1 text-[#FFB786] hover:text-[#FDFBD4] rounded transition-colors shrink-0"
                title="Copy full address"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Network details */}
          <div className="px-4 py-2.5 border-b border-[#53443A]/20 flex items-center justify-between text-xs text-[#D9C2B5]">
            <span className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-green-400" />
              Network
            </span>
            <span className="font-semibold text-[#FFB786]">Aptos Testnet</span>
          </div>

          {/* Action Links */}
          <div className="p-2 space-y-1">
            <a
              href={`https://explorer.aptoslabs.com/account/${fullAddress}?network=testnet`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#D9C2B5] hover:bg-[#3A260F] hover:text-[#FDFBD4] transition-colors"
            >
              <span className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-[#FFB786]" />
                View on Aptos Explorer
              </span>
            </a>

            <button
              onClick={handleDisconnect}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold text-red-300 hover:bg-red-950/60 hover:text-red-100 transition-colors border border-transparent hover:border-red-800/50 mt-1"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>Disconnect Wallet</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
