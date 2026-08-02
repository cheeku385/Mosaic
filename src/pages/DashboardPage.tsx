import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Lock, 
  Settings, 
  Upload, 
  Search, 
  Download, 
  ChevronRight,
  FileText, 
  Image as ImageIcon, 
  Key, 
  Folder,
  Shield,
  HelpCircle,
  Radio,
  LogOut,
  Menu,
  X,
  FileCheck
} from 'lucide-react';
import { BackedUpFile, NavPage } from '../types';
import { MosaicLogo } from '../components/Logo';

interface DashboardPageProps {
  files: BackedUpFile[];
  onNavigate: (page: NavPage) => void;
  onDownloadFile: (file: BackedUpFile) => void;
  onOpenUpload: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  files,
  onNavigate,
  onDownloadFile,
  onOpenUpload
}) => {
  const { account, disconnect } = useWallet();
  const [activeTab, setActiveTab] = useState<NavPage>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const formatAddress = (addr?: string | null) => {
    if (!addr) return '0x71C...4e2';
    const str = addr.toString();
    return `${str.substring(0, 6)}...${str.substring(str.length - 4)}`;
  };

  // Filter files based on search query
  const filteredFiles = files.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (fileType: string) => {
    const t = fileType.toLowerCase();
    if (t.includes('pdf') || t.includes('doc')) return <FileText className="w-5 h-5 text-[#E27122]" />;
    if (t.includes('archive') || t.includes('zip') || t.includes('image')) return <ImageIcon className="w-5 h-5 text-[#E27122]" />;
    if (t.includes('key')) return <Key className="w-5 h-5 text-[#E27122]" />;
    if (t.includes('directory') || t.includes('folder')) return <Folder className="w-5 h-5 text-[#E27122]" />;
    return <FileCheck className="w-5 h-5 text-[#E27122]" />;
  };

  return (
    <div className="min-h-screen bg-[#201000] text-[#FDFBD4] font-body flex flex-col md:flex-row antialiased">
      
      {/* Mobile Nav Header */}
      <header className="md:hidden w-full bg-[#2A1803] px-6 py-4 flex justify-between items-center z-50 sticky top-0 border-b border-[#53443A]/30">
        <MosaicLogo size={32} subtitle="Dashboard" />
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-[#FDFBD4] p-1.5 rounded-lg bg-[#2E1C06]"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#201000]/95 backdrop-blur-xl pt-20 p-6 space-y-4">
          <button
            onClick={() => { setActiveTab('dashboard'); onNavigate('dashboard'); setMobileMenuOpen(false); }}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold ${
              activeTab === 'dashboard' ? 'bg-[#713600] text-[#FDFBD4] border-r-4 border-[#E27122]' : 'text-[#D9C2B5]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => { onOpenUpload(); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold bg-[#C05800] text-[#FDFBD4]"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Document</span>
          </button>

          <button
            onClick={() => { setActiveTab('all-files'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-[#D9C2B5]"
          >
            <FolderOpen className="w-5 h-5" />
            <span>All Files</span>
          </button>

          <button
            onClick={() => { setActiveTab('vaults'); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-[#D9C2B5]"
          >
            <Lock className="w-5 h-5" />
            <span>Vaults</span>
          </button>

          <div className="pt-6 border-t border-[#C05800]/20 flex items-center justify-between text-xs text-[#D9C2B5]">
            <span>Wallet: {formatAddress(account?.address?.toString())}</span>
            <button 
              onClick={() => disconnect()}
              className="p-2 bg-[#2E1C06] rounded-lg text-red-400"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar matching Image 3 */}
      <aside className="hidden md:flex flex-col h-screen w-64 bg-[#2A1803] fixed left-0 py-8 px-4 z-40 border-r border-[#53443A]/20">
        
        {/* Brand Header */}
        <div className="mb-8 px-2 flex items-center gap-2">
          <MosaicLogo size={38} subtitle="Secure Vault" />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-2">
          <button
            onClick={() => { setActiveTab('dashboard'); onNavigate('dashboard'); }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
              activeTab === 'dashboard' 
                ? 'text-[#FDFBD4] bg-[#713600]/40 border-r-4 border-[#E27122] shadow-sm' 
                : 'text-[#D9C2B5] hover:bg-[#3A260F] hover:text-[#FDFBD4]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-[#FFB786]" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => onOpenUpload()}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-[#D9C2B5] hover:bg-[#3A260F] hover:text-[#FFB786] transition-all"
          >
            <Upload className="w-4 h-4 text-[#FFB786]" />
            <span>Upload File</span>
          </button>

          <button
            onClick={() => setActiveTab('all-files')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'all-files'
                ? 'text-[#FDFBD4] bg-[#713600]/40 border-r-4 border-[#E27122]'
                : 'text-[#D9C2B5] hover:bg-[#3A260F] hover:text-[#FDFBD4]'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span>All Files</span>
          </button>

          <button
            onClick={() => setActiveTab('vaults')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'vaults'
                ? 'text-[#FDFBD4] bg-[#713600]/40 border-r-4 border-[#E27122]'
                : 'text-[#D9C2B5] hover:bg-[#3A260F] hover:text-[#FDFBD4]'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Vaults</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'settings'
                ? 'text-[#FDFBD4] bg-[#713600]/40 border-r-4 border-[#E27122]'
                : 'text-[#D9C2B5] hover:bg-[#3A260F] hover:text-[#FDFBD4]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </nav>

        {/* User CTA Footer Area */}
        <div className="mt-auto border-t border-[#53443A]/30 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-[#463018] overflow-hidden border border-[#53443A] flex items-center justify-center text-[#FFB786]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#FDFBD4]">Secure Vault</div>
              <div className="text-[11px] text-[#D9C2B5]/80">Shelby Network Storage</div>
            </div>
          </div>

          <button 
            onClick={() => alert("Storage Plan: Free Shelby Community Vault (50MB / upload). Infinite Aptos blob support!")}
            className="w-full py-2 bg-[#713600] text-[#FDFBD4] font-semibold text-xs rounded-lg hover:shadow-[0_0_15px_rgba(192,88,0,0.4)] hover:bg-[#8F4D18] transition-all duration-300"
          >
            Upgrade Storage
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen bg-[#201000]">
        
        {/* Top Header Bar matching Image 3 */}
        <div className="hidden md:flex bg-[#201000] w-full z-30 sticky top-0 border-b border-[#C05800]/10">
          <div className="flex justify-between items-center w-full px-12 py-4 max-w-[1280px] mx-auto">
            <div className="text-xs text-[#D9C2B5]">
              Network: <span className="text-[#FFB786] font-semibold">Shelby / Aptos</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Wallet Address Pill */}
              <div className="px-3.5 py-1.5 rounded-full border border-[#53443A]/60 bg-[#2E1C06] text-xs text-[#D9C2B5] flex items-center gap-2 font-mono">
                <div className="w-2 h-2 rounded-full bg-[#E27122] animate-pulse"></div>
                <span>{formatAddress(account?.address?.toString())}</span>
              </div>

              {/* Upload Button */}
              <button
                onClick={onOpenUpload}
                className="bg-[#713600] text-[#FDFBD4] font-semibold text-xs px-4 py-2 rounded-lg hover:bg-[#C05800] hover:shadow-[0_0_15px_rgba(192,88,0,0.4)] transition-all duration-300 flex items-center gap-2 shadow-md"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Document</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Main Canvas Area */}
        <div className="flex-1 w-full max-w-[1280px] mx-auto px-6 md:px-12 py-8">
          
          {/* Section Header & Search Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#FDFBD4] mb-1 font-display">
                Overview
              </h1>
              <p className="text-sm text-[#D9C2B5]">
                Manage and secure your decentralized files on Shelby Protocol.
              </p>
            </div>

            {/* Search documents input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D9C2B5]/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="w-full bg-[#3A260F] border border-[#53443A]/50 rounded-lg py-2 pl-10 pr-4 text-xs text-[#FDFBD4] placeholder:text-[#D9C2B5]/50 focus:outline-none focus:border-[#C05800] focus:ring-1 focus:ring-[#C05800] transition-all font-body"
              />
            </div>
          </div>

          {/* Main Table Container matching Image 3 */}
          <div className="bg-[#4A3216] rounded-2xl border border-[#53443A]/30 overflow-hidden shadow-2xl">
            
            {/* Table Header Row */}
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#FDFBD4]/5 bg-[#3A260F] text-xs font-semibold text-[#D9C2B5] uppercase tracking-wider">
              <div className="col-span-5 pl-2">NAME</div>
              <div className="col-span-3 md:col-span-2">TYPE</div>
              <div className="hidden md:block md:col-span-2">DATE ADDED</div>
              <div className="col-span-2 md:col-span-2">SIZE</div>
              <div className="col-span-2 md:col-span-1 text-center">ACTION</div>
            </div>

            {/* Table Rows */}
            <div className="flex flex-col divide-y divide-[#FDFBD4]/5">
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    className="grid grid-cols-12 gap-4 p-4 items-center transition-all duration-200 mosaic-glow group cursor-pointer"
                  >
                    {/* Name Column */}
                    <div className="col-span-5 flex items-center gap-3 pl-2 min-w-0">
                      {getFileIcon(file.type)}
                      <span className="text-sm font-medium text-[#FDFBD4] truncate group-hover:text-[#FFB786] transition-colors">
                        {file.name}
                      </span>
                    </div>

                    {/* Type Column */}
                    <div className="col-span-3 md:col-span-2 text-xs text-[#D9C2B5] truncate">
                      {file.type}
                    </div>

                    {/* Date Added Column */}
                    <div className="hidden md:block md:col-span-2 text-xs text-[#D9C2B5]">
                      {file.dateAdded}
                    </div>

                    {/* Size Column */}
                    <div className="col-span-2 md:col-span-2 text-xs text-[#D9C2B5]">
                      {file.size}
                    </div>

                    {/* Action Column */}
                    <div className="col-span-2 md:col-span-1 flex justify-center">
                      {file.type.toLowerCase().includes('directory') ? (
                        <button className="text-[#D9C2B5] hover:text-[#FFB786] p-1.5 transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onDownloadFile(file)}
                          title="Download & Decrypt from Shelby"
                          className="text-[#D9C2B5] hover:text-[#FFB786] p-1.5 rounded-lg hover:bg-[#3A260F] transition-all"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-sm text-[#D9C2B5] space-y-3">
                  <p>No documents found matching "{searchQuery}"</p>
                  <button
                    onClick={onOpenUpload}
                    className="text-xs text-[#FFB786] underline font-semibold hover:text-[#FDFBD4]"
                  >
                    Upload a file to Shelby Network
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Quick Stats / Shelby Network Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-[#2E1C06] p-5 rounded-xl border border-[#C05800]/20 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#713600] flex items-center justify-center text-[#FFB786]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-[#FDFBD4]">{files.length} Files</div>
                <div className="text-xs text-[#D9C2B5]">Backed up on Shelby</div>
              </div>
            </div>

            <div className="bg-[#2E1C06] p-5 rounded-xl border border-[#C05800]/20 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#713600] flex items-center justify-center text-[#FFB786]">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-[#FDFBD4]">256-bit AES</div>
                <div className="text-xs text-[#D9C2B5]">Browser Encryption</div>
              </div>
            </div>

            <div className="bg-[#2E1C06] p-5 rounded-xl border border-[#C05800]/20 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#713600] flex items-center justify-center text-[#FFB786]">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold text-[#FDFBD4]">Aptos Network</div>
                <div className="text-xs text-[#D9C2B5]">Shelby Consensus Online</div>
              </div>
            </div>
          </div>

        </div>
      </main>

    </div>
  );
};
