import React from 'react';
import { 
  Globe, 
  FileText, 
  Github, 
  MessageSquare, 
  Twitter, 
  Code, 
  Radio
} from 'lucide-react';
import { MosaicLogo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#38240D] text-[#FDFBD4] py-12 border-t border-[#C05800]/20 mt-auto w-full">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10">
          
          {/* Brand Column */}
          <div className="space-y-3 max-w-sm">
            <MosaicLogo size={36} subtitle="Decentralized Storage" />
            <p className="text-xs text-[#D9C2B5] opacity-90 leading-relaxed pt-2">
              Securing your digital legacy with decentralized document and PDF backups on the Shelby Protocol (Aptos).
            </p>
            <p className="text-xs text-[#D9C2B5]/60 pt-2">
              © {new Date().getFullYear()} Mosaic. All rights reserved.
            </p>
          </div>

          {/* Credits & External Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
            
            {/* Built by Cheeku */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#FDFBD4]/90 font-mono">
                Built by Cheeku
              </h4>
              <div className="flex items-center gap-4">
                <a 
                  href="https://github.com/cheeku385" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#2E1C06] border border-[#C05800]/20 text-[#FDFBD4] hover:text-[#C05800] hover:border-[#C05800] transition-all duration-200"
                  title="Cheeku GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a 
                  href="https://x.com/Cheeku385" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#2E1C06] border border-[#C05800]/20 text-[#FDFBD4] hover:text-[#C05800] hover:border-[#C05800] transition-all duration-200"
                  title="Cheeku X / Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Built on Shelby Network */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#FDFBD4]/90 font-mono">
                Built on Shelby Network
              </h4>
              <div className="flex flex-wrap items-center gap-3">
                <a 
                  href="https://shelby.xyz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#2E1C06] border border-[#C05800]/20 text-[#FDFBD4] hover:text-[#C05800] hover:border-[#C05800] transition-all duration-200 flex items-center gap-1.5 text-xs"
                  title="Shelby Website"
                >
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">Website</span>
                </a>
                <a 
                  href="https://docs.shelby.xyz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#2E1C06] border border-[#C05800]/20 text-[#FDFBD4] hover:text-[#C05800] hover:border-[#C05800] transition-all duration-200 flex items-center gap-1.5 text-xs"
                  title="Shelby Docs"
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Docs</span>
                </a>
                <a 
                  href="https://github.com/shelby" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#2E1C06] border border-[#C05800]/20 text-[#FDFBD4] hover:text-[#C05800] hover:border-[#C05800] transition-all duration-200"
                  title="Shelby GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a 
                  href="https://discord.gg/shelbyserves" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#2E1C06] border border-[#C05800]/20 text-[#FDFBD4] hover:text-[#C05800] hover:border-[#C05800] transition-all duration-200"
                  title="Shelby Discord"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>
                <a 
                  href="https://x.com/shelbyserves" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-[#2E1C06] border border-[#C05800]/20 text-[#FDFBD4] hover:text-[#C05800] hover:border-[#C05800] transition-all duration-200"
                  title="Shelby X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};
