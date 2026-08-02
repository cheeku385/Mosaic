import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { 
  FileText, 
  FlaskConical, 
  FolderGit2, 
  ShieldCheck, 
  Lock, 
  Zap, 
  ArrowRight,
  Database,
  Key,
  Layers
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

interface LandingPageProps {
  onGoToDashboard: () => void;
  onOpenUpload: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onGoToDashboard,
  onOpenUpload
}) => {
  const { connect, connected } = useWallet();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    if (connected) {
      onGoToDashboard();
      return;
    }
    setConnecting(true);
    try {
      await connect("Petra");
      onGoToDashboard();
    } catch (e) {
      console.warn('Petra connect prompt:', e);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#201000] text-[#FDFBD4] mosaic-bg">
      <Navbar onGoToDashboard={onGoToDashboard} currentView="landing" />

      <main className="flex-grow">
        
        {/* HERO SECTION matching STITCH PROMPT 2 & Image 2 */}
        <section className="py-16 md:py-24 px-6 md:px-12 max-w-[1200px] mx-auto flex flex-col items-center text-center gap-8">
          
          {/* Logo Card with Inner Glow */}
          <div className="w-36 h-36 md:w-48 md:h-48 rounded-2xl bg-[#38240D] flex items-center justify-center shadow-2xl inner-glow border border-[#713600]/80 transition-transform hover:scale-105 duration-300">
            <svg
              viewBox="0 0 512 512"
              className="w-3/4 h-3/4"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M130 180 C130 162 142 150 160 150 L220 150 C232 150 242 158 248 170 L260 192 L350 192 C368 192 380 204 380 222 L380 348 C380 366 368 378 350 378 L160 378 C142 378 130 366 130 348 Z"
                fill="#713600"
              />
              <rect x="180" y="222" width="62" height="58" rx="12" fill="#C05800" />
              <rect x="264" y="222" width="62" height="58" rx="12" fill="#FDFBD4" />
              <rect x="180" y="296" width="62" height="58" rx="12" fill="#FDFBD4" />
              <rect x="264" y="296" width="62" height="58" rx="12" fill="#C05800" />
            </svg>
          </div>

          {/* Headline & Tagline */}
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#FDFBD4] font-display leading-tight">
              Secure Your Digital Legacy.
            </h1>
            <p className="text-lg md:text-xl text-[#D9C2B5] max-w-2xl mx-auto font-normal leading-relaxed">
              Decentralized document and PDF backups powered by the Shelby Protocol on Aptos.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-2 justify-center">
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="bg-[#C05800] text-[#FDFBD4] px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-[#A64C00] transition-all shadow-[0_0_20px_rgba(192,88,0,0.4)] outer-glow-hover flex items-center gap-2"
            >
              <span>{connected ? "Open Dashboard" : connecting ? "Connecting..." : "Connect Wallet"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <a
              href="#features"
              className="border border-[#713600] text-[#FFB786] px-8 py-3.5 rounded-xl hover:bg-[#2E1C06] transition-colors font-semibold text-sm flex items-center gap-2"
            >
              <span>Learn More</span>
            </a>
          </div>
        </section>


        {/* YOUR DIGITAL VAULT SECTION matching Image 2 */}
        <section id="vault-preview" className="py-16 px-6 md:px-12 max-w-[1200px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#FDFBD4] mb-12 text-center font-display">
            Your Digital Vault
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Property Deeds.pdf */}
            <div className="aspect-[4/5] bg-[#713600] rounded-xl border border-[#C05800]/20 relative overflow-hidden group transition-all duration-300 hover:inner-glow flex flex-col p-6 shadow-xl">
              <div className="absolute inset-0 bg-[#FDFBD4]/0 group-hover:bg-[#FDFBD4]/5 transition-colors pointer-events-none z-10" />
              <div className="flex-grow flex items-center justify-center">
                <FileText className="w-20 h-20 text-[#F5A165]/50 group-hover:text-[#FFB786] transition-colors z-20" />
              </div>
              <div className="mt-auto border-t border-[#C05800]/20 pt-4 z-20">
                <h3 className="font-semibold text-base text-[#FDFBD4]">Property Deeds.pdf</h3>
                <p className="text-xs text-[#D9C2B5] mt-1">Encrypted • 2.4 MB</p>
              </div>
            </div>

            {/* Card 2: Research Paper.pdf */}
            <div className="aspect-[4/5] bg-[#713600] rounded-xl border border-[#C05800]/20 relative overflow-hidden group transition-all duration-300 hover:inner-glow flex flex-col p-6 shadow-xl">
              <div className="absolute inset-0 bg-[#FDFBD4]/0 group-hover:bg-[#FDFBD4]/5 transition-colors pointer-events-none z-10" />
              <div className="flex-grow flex items-center justify-center">
                <FlaskConical className="w-20 h-20 text-[#F5A165]/50 group-hover:text-[#FFB786] transition-colors z-20" />
              </div>
              <div className="mt-auto border-t border-[#C05800]/20 pt-4 z-20">
                <h3 className="font-semibold text-base text-[#FDFBD4]">Research Paper.pdf</h3>
                <p className="text-xs text-[#D9C2B5] mt-1">Shelby Sync • 5.1 MB</p>
              </div>
            </div>

            {/* Card 3: Family Archives.pdf */}
            <div className="aspect-[4/5] bg-[#713600] rounded-xl border border-[#C05800]/20 relative overflow-hidden group transition-all duration-300 hover:inner-glow flex flex-col p-6 shadow-xl">
              <div className="absolute inset-0 bg-[#FDFBD4]/0 group-hover:bg-[#FDFBD4]/5 transition-colors pointer-events-none z-10" />
              <div className="flex-grow flex items-center justify-center">
                <FolderGit2 className="w-20 h-20 text-[#F5A165]/50 group-hover:text-[#FFB786] transition-colors z-20" />
              </div>
              <div className="mt-auto border-t border-[#C05800]/20 pt-4 z-20">
                <h3 className="font-semibold text-base text-[#FDFBD4]">Family Archives.pdf</h3>
                <p className="text-xs text-[#D9C2B5] mt-1">Immutable • 12.8 MB</p>
              </div>
            </div>

          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-20 px-6 md:px-12 max-w-[1200px] mx-auto border-t border-[#C05800]/10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl font-bold text-[#FDFBD4] font-display">
              Built for Absolute Permanence
            </h2>
            <p className="text-sm text-[#D9C2B5]">
              Mosaic leverages Aptos blockchain speed and Shelby Protocol's decentralized blob fragmentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#2E1C06] p-8 rounded-2xl border border-[#C05800]/20 space-y-4 hover:border-[#C05800]/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#713600] flex items-center justify-center text-[#FFB786]">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#FDFBD4] font-display">Browser-Side Encryption</h3>
              <p className="text-xs text-[#D9C2B5] leading-relaxed">
                Your documents are sliced and encrypted locally before leaving your browser. Only your key can restore them.
              </p>
            </div>

            <div className="bg-[#2E1C06] p-8 rounded-2xl border border-[#C05800]/20 space-y-4 hover:border-[#C05800]/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#713600] flex items-center justify-center text-[#FFB786]">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#FDFBD4] font-display">Shelby Blob Storage</h3>
              <p className="text-xs text-[#D9C2B5] leading-relaxed">
                Shelby Protocol fragments data across decentralized nodes on Aptos, ensuring zero single point of failure.
              </p>
            </div>

            <div className="bg-[#2E1C06] p-8 rounded-2xl border border-[#C05800]/20 space-y-4 hover:border-[#C05800]/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#713600] flex items-center justify-center text-[#FFB786]">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#FDFBD4] font-display">Instant Verification</h3>
              <p className="text-xs text-[#D9C2B5] leading-relaxed">
                 cryptographic SHA-256 proofs recorded directly on Aptos sub-second consensus.
              </p>
            </div>
          </div>
        </section>

        {/* SECURITY SECTION */}
        <section id="security" className="py-16 px-6 md:px-12 max-w-[1200px] mx-auto border-t border-[#C05800]/10">
          <div className="bg-[#2A1803] rounded-3xl p-8 md:p-12 border border-[#C05800]/30 flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="space-y-4 max-w-xl">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#C05800]/20 text-[#FFB786] border border-[#C05800]/30">
                Aptos Mainnet & Testnet
              </span>
              <h2 className="text-3xl font-bold text-[#FDFBD4] font-display">
                Zero-Knowledge Document Ownership
              </h2>
              <p className="text-sm text-[#D9C2B5] leading-relaxed">
                Mosaic never reads your files or stores raw data on centralized servers. Your Aptos key pair derived from Petra Wallet grants full sovereign access.
              </p>
            </div>
            <button
              onClick={handleConnect}
              className="bg-[#C05800] text-[#FDFBD4] px-8 py-4 rounded-xl font-bold text-sm hover:bg-[#A64C00] transition-all outer-glow-hover shrink-0"
            >
              Start Backing Up Now
            </button>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="py-20 px-6 md:px-12 max-w-[1200px] mx-auto border-t border-[#C05800]/10">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-[#FDFBD4] font-display">Transparent Storage</h2>
            <p className="text-sm text-[#D9C2B5] mt-2">Pay per blob on Shelby Network with Aptos micro-fees.</p>
          </div>

          <div className="max-w-md mx-auto bg-[#2E1C06] rounded-3xl p-8 border border-[#C05800]/40 space-y-6 text-center shadow-2xl relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C05800] text-[#FDFBD4] text-[10px] uppercase tracking-widest font-bold px-4 py-1 rounded-full">
              Community Tier
            </div>
            <h3 className="text-2xl font-bold text-[#FDFBD4] font-display">Shelby Vault Free</h3>
            <div className="text-4xl font-extrabold text-[#FFB786]">
              0.00 <span className="text-sm font-normal text-[#D9C2B5]">APT / Month</span>
            </div>
            <ul className="text-xs text-[#D9C2B5] space-y-3 text-left border-t border-[#C05800]/20 pt-6">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C05800]" />
                <span>Up to 50MB per file upload</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C05800]" />
                <span>Immutable Shelby Storage on Aptos</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C05800]" />
                <span>Encrypted PDF, Zip, Key, & Doc backups</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C05800]" />
                <span>One-click decryption & instant download</span>
              </li>
            </ul>
            <button
              onClick={handleConnect}
              className="w-full bg-[#C05800] text-[#FDFBD4] py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#A64C00] transition-all outer-glow-hover"
            >
              Connect Petra Wallet
            </button>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};
