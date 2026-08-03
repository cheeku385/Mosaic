import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Wallet, ArrowRight, ExternalLink } from 'lucide-react';
import { MosaicLogo } from './Logo';
import { WalletDropdown } from './WalletDropdown';

interface NavbarProps {
  onGoToDashboard?: () => void;
  currentView?: string;
  onNavigateLanding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onGoToDashboard, 
  currentView = 'landing',
  onNavigateLanding 
}) => {
  const { connect, disconnect, connected, account } = useWallet();
  const [connecting, setConnecting] = useState(false);
  const [showPetraModal, setShowPetraModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formatAddress = (addr?: string | null) => {
    if (!addr) return '0x71C...4e2';
    const str = addr.toString();
    return `${str.substring(0, 6)}...${str.substring(str.length - 4)}`;
  };

  const handleConnectPetra = async () => {
    setConnecting(true);
    setErrorMessage(null);
    try {
      // Trigger real Petra wallet popup via Aptos Wallet Adapter as instructed
      await connect("Petra");
    } catch (err: any) {
      console.warn('Petra wallet connection trigger:', err);
      // Check if window.aptos or window.petra is available
      const hasPetraExtension = typeof window !== 'undefined' && ((window as any).aptos || (window as any).petra);
      if (!hasPetraExtension) {
        setErrorMessage("Petra Wallet extension is not detected in your browser. Install Petra to sign live Aptos transactions.");
        setShowPetraModal(true);
      } else {
        setErrorMessage(err?.message || "Failed to connect Petra Wallet. Please approve the prompt in Petra.");
      }
    } finally {
      setConnecting(false);
    }
  };

  return (
    <>
      <nav className="bg-[#201000]/90 backdrop-blur-xl sticky top-0 z-50 border-b border-[#C05800]/15 transition-all">
        <div className="flex justify-between items-center h-20 px-6 md:px-12 max-w-[1200px] mx-auto">
          
          {/* Logo */}
          <button 
            onClick={onNavigateLanding} 
            className="flex items-center text-left hover:opacity-90 transition-opacity"
          >
            <MosaicLogo size={42} showText={true} />
          </button>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-8 items-center text-sm font-medium">
            <a 
              href="#features" 
              onClick={(e) => {
                if (currentView !== 'landing') {
                  e.preventDefault();
                  onNavigateLanding?.();
                }
              }}
              className="text-[#D9C2B5] hover:text-[#FDFBD4] transition-colors"
            >
              Features
            </a>
            <a 
              href="#security" 
              onClick={(e) => {
                if (currentView !== 'landing') {
                  e.preventDefault();
                  onNavigateLanding?.();
                }
              }}
              className="text-[#D9C2B5] hover:text-[#FDFBD4] transition-colors"
            >
              Security
            </a>
            <a 
              href="#pricing" 
              onClick={(e) => {
                if (currentView !== 'landing') {
                  e.preventDefault();
                  onNavigateLanding?.();
                }
              }}
              className="text-[#D9C2B5] hover:text-[#FDFBD4] transition-colors"
            >
              Pricing
            </a>
          </div>

          {/* Wallet Connection / Status */}
          <div className="flex items-center gap-3">
            <WalletDropdown />
            {connected && currentView === 'landing' && (
              <button
                onClick={onGoToDashboard}
                className="bg-[#C05800] text-[#FDFBD4] px-4 py-2 rounded-lg hover:bg-[#A64C00] font-semibold text-xs transition-all outer-glow-hover flex items-center gap-1.5 shadow-lg"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Petra Wallet Installation / Detection Dialog */}
      {showPetraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#2E1C06] border border-[#C05800]/40 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#C05800]/20 text-[#C05800] mx-auto flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#FDFBD4] font-display">
              Connect Petra Wallet
            </h3>
            <p className="text-xs text-[#D9C2B5] leading-relaxed">
              {errorMessage || "Petra Wallet (Aptos) is required to sign transactions and back up files to the Shelby Network."}
            </p>
            <div className="pt-2 space-y-2">
              <a
                href="https://petra.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#C05800] text-[#FDFBD4] py-2.5 px-4 rounded-xl font-semibold text-xs tracking-wider uppercase hover:bg-[#A64C00] flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <span>Install Petra Wallet Extension</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={async () => {
                  setShowPetraModal(false);
                  // Retry connecting directly
                  try {
                    await connect("Petra");
                  } catch (e) {
                    console.warn(e);
                  }
                }}
                className="w-full bg-[#201000] border border-[#C05800]/30 text-[#D9C2B5] py-2 px-4 rounded-xl text-xs hover:text-[#FDFBD4] hover:border-[#C05800] transition-colors"
              >
                Retry Petra Connect
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
