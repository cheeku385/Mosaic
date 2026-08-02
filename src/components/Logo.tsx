import React from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  subtitle?: string;
}

export const MosaicLogo: React.FC<LogoProps> = ({
  className = '',
  size = 40,
  showText = true,
  subtitle
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Icon logo matching STITCH PROMPT 1 & Image 1 */}
      <div 
        className="relative rounded-xl flex items-center justify-center shrink-0 border border-[#C05800]/20 shadow-lg overflow-hidden group transition-all duration-300 hover:border-[#C05800]/50"
        style={{ width: size, height: size, backgroundColor: '#38240D' }}
      >
        <svg
          viewBox="0 0 512 512"
          className="w-3/4 h-3/4 transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Folder base body (#713600) */}
          <path
            d="M130 180 C130 162 142 150 160 150 L220 150 C232 150 242 158 248 170 L260 192 L350 192 C368 192 380 204 380 222 L380 348 C380 366 368 378 350 378 L160 378 C142 378 130 366 130 348 Z"
            fill="#713600"
          />
          {/* Top-Left Tile (Burnt Orange #C05800) */}
          <rect x="180" y="222" width="62" height="58" rx="12" fill="#C05800" />
          {/* Top-Right Tile (Cream #FDFBD4) */}
          <rect x="264" y="222" width="62" height="58" rx="12" fill="#FDFBD4" />
          {/* Bottom-Left Tile (Cream #FDFBD4) */}
          <rect x="180" y="296" width="62" height="58" rx="12" fill="#FDFBD4" />
          {/* Bottom-Right Tile (Burnt Orange #C05800) */}
          <rect x="264" y="296" width="62" height="58" rx="12" fill="#C05800" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-xl tracking-tight text-[#FDFBD4] font-display">
            Mosaic
          </span>
          {subtitle && (
            <span className="text-xs text-[#D9C2B5] font-medium -mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
