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
  FileCheck,
  Filter,
  Plus,
  Database,
  Check,
  ExternalLink,
  RefreshCw,
  Grid,
  List,
  Sliders,
  ShieldAlert,
  Copy,
  CheckCircle2,
  HardDrive
} from 'lucide-react';
import { BackedUpFile, NavPage } from '../types';
import { MosaicLogo } from '../components/Logo';
import { WalletDropdown } from '../components/WalletDropdown';

interface DashboardPageProps {
  files: BackedUpFile[];
  activeTab?: NavPage;
  onNavigate: (page: NavPage) => void;
  onDownloadFile: (file: BackedUpFile) => void;
  onOpenUpload: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  files,
  activeTab = 'dashboard',
  onNavigate,
  onDownloadFile,
  onOpenUpload
}) => {
  const { account, disconnect } = useWallet();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fileCategoryFilter, setFileCategoryFilter] = useState<'all' | 'encrypted' | 'sync' | 'immutable'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedFileDetail, setSelectedFileDetail] = useState<BackedUpFile | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

  // Settings State
  const [network, setNetwork] = useState<'testnet' | 'mainnet'>('testnet');
  const [encryptionStandard, setEncryptionStandard] = useState<'AES-GCM-256' | 'ChaCha20-Poly1305'>('AES-GCM-256');
  const [autoSync, setAutoSync] = useState(true);
  const [copiedManifest, setCopiedManifest] = useState(false);

  // Vaults State
  const [vaultsList, setVaultsList] = useState([
    { id: 'v1', name: 'Personal Deeds & Documents', size: '24.8 MB', fileCount: 8, locked: false, color: '#C05800' },
    { id: 'v2', name: 'Family Archives Vault', size: '156 MB', fileCount: 14, locked: false, color: '#E27122' },
    { id: 'v3', name: 'High Security Keys & Seed Vault', size: '4.2 KB', fileCount: 3, locked: true, color: '#FFB786' },
    { id: 'v4', name: 'Research Papers & IP Storage', size: '45.1 MB', fileCount: 6, locked: false, color: '#713600' }
  ]);
  const [showCreateVaultModal, setShowCreateVaultModal] = useState(false);
  const [newVaultName, setNewVaultName] = useState('');

  const formatAddress = (addr?: string | null) => {
    if (!addr) return '0x71C...4e2';
    const str = addr.toString();
    return `${str.substring(0, 6)}...${str.substring(str.length - 4)}`;
  };

  // Filter files based on search query and category
  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.type.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (fileCategoryFilter === 'all') return true;
    if (fileCategoryFilter === 'encrypted') return f.type.toLowerCase().includes('pdf') || f.type.toLowerCase().includes('key') || f.category === 'encrypted';
    if (fileCategoryFilter === 'sync') return f.type.toLowerCase().includes('archive') || f.type.toLowerCase().includes('zip') || f.category === 'sync';
    if (fileCategoryFilter === 'immutable') return f.type.toLowerCase().includes('directory') || f.category === 'immutable';
    return true;
  });

  const getFileIcon = (fileType: string) => {
    const t = fileType.toLowerCase();
    if (t.includes('pdf') || t.includes('doc')) return <FileText className="w-5 h-5 text-[#E27122]" />;
    if (t.includes('archive') || t.includes('zip') || t.includes('image')) return <ImageIcon className="w-5 h-5 text-[#E27122]" />;
    if (t.includes('key')) return <Key className="w-5 h-5 text-[#E27122]" />;
    if (t.includes('directory') || t.includes('folder')) return <Folder className="w-5 h-5 text-[#E27122]" />;
    return <FileCheck className="w-5 h-5 text-[#E27122]" />;
  };

  const handleCopyHash = (hashStr: string) => {
    navigator.clipboard.writeText(hashStr);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleCreateVault = () => {
    if (!newVaultName.trim()) return;
    setVaultsList(prev => [
      ...prev,
      {
        id: `v_${Date.now()}`,
        name: newVaultName.trim(),
        size: '0 KB',
        fileCount: 0,
        locked: false,
        color: '#C05800'
      }
    ]);
    setNewVaultName('');
    setShowCreateVaultModal(false);
  };

  const toggleVaultLock = (id: string) => {
    setVaultsList(prev => prev.map(v => v.id === id ? { ...v, locked: !v.locked } : v));
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
            onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }}
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
            onClick={() => { onNavigate('all-files'); setMobileMenuOpen(false); }}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold ${
              activeTab === 'all-files' ? 'bg-[#713600] text-[#FDFBD4] border-r-4 border-[#E27122]' : 'text-[#D9C2B5]'
            }`}
          >
            <FolderOpen className="w-5 h-5" />
            <span>All Files</span>
          </button>

          <button
            onClick={() => { onNavigate('vaults'); setMobileMenuOpen(false); }}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold ${
              activeTab === 'vaults' ? 'bg-[#713600] text-[#FDFBD4] border-r-4 border-[#E27122]' : 'text-[#D9C2B5]'
            }`}
          >
            <Lock className="w-5 h-5" />
            <span>Vaults</span>
          </button>

          <button
            onClick={() => { onNavigate('settings'); setMobileMenuOpen(false); }}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold ${
              activeTab === 'settings' ? 'bg-[#713600] text-[#FDFBD4] border-r-4 border-[#E27122]' : 'text-[#D9C2B5]'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
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

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col h-screen w-64 bg-[#2A1803] fixed left-0 py-8 px-4 z-40 border-r border-[#53443A]/20">
        
        {/* Brand Header */}
        <div className="mb-8 px-2 flex items-center gap-2">
          <MosaicLogo size={38} subtitle="Secure Vault" />
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 flex flex-col gap-2">
          <button
            onClick={() => onNavigate('dashboard')}
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
            onClick={() => onNavigate('all-files')}
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
            onClick={() => onNavigate('vaults')}
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
            onClick={() => onNavigate('settings')}
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
        
        {/* Top Header Bar */}
        <div className="hidden md:flex bg-[#201000] w-full z-30 sticky top-0 border-b border-[#C05800]/10">
          <div className="flex justify-between items-center w-full px-12 py-4 max-w-[1280px] mx-auto">
            <div className="text-xs text-[#D9C2B5] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span>Network: <span className="text-[#FFB786] font-semibold uppercase">Aptos {network}</span></span>
            </div>

            <div className="flex items-center gap-4">
              {/* Wallet Address Dropdown */}
              <WalletDropdown />

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

        {/* Dynamic Main Body Content based on activeTab */}
        <div className="flex-1 w-full max-w-[1280px] mx-auto px-6 md:px-12 py-8">
          
          {/* TAB 1: DASHBOARD (OVERVIEW) */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
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

              {/* Main Table Container */}
              <div className="bg-[#4A3216] rounded-2xl border border-[#53443A]/30 overflow-hidden shadow-2xl">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#FDFBD4]/5 bg-[#3A260F] text-xs font-semibold text-[#D9C2B5] uppercase tracking-wider">
                  <div className="col-span-5 pl-2">NAME</div>
                  <div className="col-span-3 md:col-span-2">TYPE</div>
                  <div className="hidden md:block md:col-span-2">DATE ADDED</div>
                  <div className="col-span-2 md:col-span-2">SIZE</div>
                  <div className="col-span-2 md:col-span-1 text-center">ACTION</div>
                </div>

                <div className="flex flex-col divide-y divide-[#FDFBD4]/5">
                  {filteredFiles.length > 0 ? (
                    filteredFiles.map((file) => (
                      <div
                        key={file.id}
                        onClick={() => setSelectedFileDetail(file)}
                        className="grid grid-cols-12 gap-4 p-4 items-center transition-all duration-200 mosaic-glow group cursor-pointer"
                      >
                        <div className="col-span-5 flex items-center gap-3 pl-2 min-w-0">
                          {getFileIcon(file.type)}
                          <span className="text-sm font-medium text-[#FDFBD4] truncate group-hover:text-[#FFB786] transition-colors">
                            {file.name}
                          </span>
                        </div>
                        <div className="col-span-3 md:col-span-2 text-xs text-[#D9C2B5] truncate">
                          {file.type}
                        </div>
                        <div className="hidden md:block md:col-span-2 text-xs text-[#D9C2B5]">
                          {file.dateAdded}
                        </div>
                        <div className="col-span-2 md:col-span-2 text-xs text-[#D9C2B5]">
                          {file.size}
                        </div>
                        <div className="col-span-2 md:col-span-1 flex justify-center">
                          <button
                            onClick={(e) => { e.stopPropagation(); onDownloadFile(file); }}
                            title="Download & Decrypt from Shelby"
                            className="text-[#D9C2B5] hover:text-[#FFB786] p-1.5 rounded-lg hover:bg-[#3A260F] transition-all"
                          >
                            <Download className="w-4 h-4" />
                          </button>
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

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <div className="text-xl font-bold text-[#FDFBD4]">{encryptionStandard}</div>
                    <div className="text-xs text-[#D9C2B5]">Browser Encryption</div>
                  </div>
                </div>

                <div className="bg-[#2E1C06] p-5 rounded-xl border border-[#C05800]/20 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#713600] flex items-center justify-center text-[#FFB786]">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-[#FDFBD4]">Aptos Network</div>
                    <div className="text-xs text-[#D9C2B5]">Shelby Consensus Active</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALL FILES */}
          {activeTab === 'all-files' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-[#FDFBD4] mb-1 font-display">
                    All Files Explorer
                  </h1>
                  <p className="text-sm text-[#D9C2B5]">
                    Browse, filter, and verify your decentralized document vault.
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  {/* Grid vs List view toggle */}
                  <div className="flex bg-[#2E1C06] p-1 rounded-lg border border-[#53443A]/40">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-[#713600] text-[#FDFBD4]' : 'text-[#D9C2B5]'}`}
                      title="List View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-[#713600] text-[#FDFBD4]' : 'text-[#D9C2B5]'}`}
                      title="Grid View"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Search bar */}
                  <div className="relative flex-1 md:w-64">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D9C2B5]/60" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter by name..."
                      className="w-full bg-[#3A260F] border border-[#53443A]/50 rounded-lg py-2 pl-10 pr-4 text-xs text-[#FDFBD4] placeholder:text-[#D9C2B5]/50 focus:outline-none focus:border-[#C05800]"
                    />
                  </div>

                  <button
                    onClick={onOpenUpload}
                    className="bg-[#C05800] text-[#FDFBD4] font-semibold text-xs px-4 py-2.5 rounded-lg hover:bg-[#A64C00] transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex gap-2 overflow-x-auto pb-2 border-b border-[#C05800]/15">
                {[
                  { id: 'all', label: `All Files (${files.length})` },
                  { id: 'encrypted', label: 'Encrypted Vault' },
                  { id: 'sync', label: 'Shelby Sync' },
                  { id: 'immutable', label: 'Immutable Ledgers' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFileCategoryFilter(cat.id as any)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                      fileCategoryFilter === cat.id
                        ? 'bg-[#C05800] text-[#FDFBD4] shadow-md'
                        : 'bg-[#2E1C06] text-[#D9C2B5] hover:bg-[#3A260F] hover:text-[#FDFBD4]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Content Render: List or Grid */}
              {viewMode === 'list' ? (
                <div className="bg-[#4A3216] rounded-2xl border border-[#53443A]/30 overflow-hidden shadow-2xl">
                  <div className="grid grid-cols-12 gap-4 p-4 border-b border-[#FDFBD4]/5 bg-[#3A260F] text-xs font-semibold text-[#D9C2B5] uppercase tracking-wider">
                    <div className="col-span-5 pl-2">NAME</div>
                    <div className="col-span-3">TYPE</div>
                    <div className="col-span-2">SIZE</div>
                    <div className="col-span-2 text-center">ACTION</div>
                  </div>

                  <div className="flex flex-col divide-y divide-[#FDFBD4]/5">
                    {filteredFiles.map((file) => (
                      <div
                        key={file.id}
                        onClick={() => setSelectedFileDetail(file)}
                        className="grid grid-cols-12 gap-4 p-4 items-center mosaic-glow group cursor-pointer transition-all"
                      >
                        <div className="col-span-5 flex items-center gap-3 pl-2 min-w-0">
                          {getFileIcon(file.type)}
                          <div className="min-w-0">
                            <span className="text-sm font-semibold text-[#FDFBD4] block truncate group-hover:text-[#FFB786]">
                              {file.name}
                            </span>
                            <span className="text-[11px] text-[#D9C2B5]/70">Added {file.dateAdded}</span>
                          </div>
                        </div>

                        <div className="col-span-3 text-xs text-[#D9C2B5]">
                          {file.type}
                        </div>

                        <div className="col-span-2 text-xs text-[#D9C2B5]">
                          {file.size}
                        </div>

                        <div className="col-span-2 flex justify-center gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); onDownloadFile(file); }}
                            className="p-2 bg-[#2E1C06] border border-[#53443A]/40 rounded-lg text-[#FFB786] hover:bg-[#3A260F] hover:text-[#FDFBD4] text-xs flex items-center gap-1 transition-all"
                            title="Download File"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Download</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredFiles.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => setSelectedFileDetail(file)}
                      className="bg-[#2E1C06] border border-[#C05800]/20 rounded-2xl p-5 space-y-4 cursor-pointer hover:border-[#C05800] transition-all hover:shadow-xl group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-xl bg-[#713600] flex items-center justify-center text-[#FFB786]">
                          {getFileIcon(file.type)}
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-[#3A260F] text-[10px] text-[#FFB786] font-mono border border-[#53443A]/40">
                          {file.size}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-bold text-sm text-[#FDFBD4] truncate group-hover:text-[#FFB786] transition-colors">
                          {file.name}
                        </h3>
                        <p className="text-xs text-[#D9C2B5] mt-1">{file.type} • {file.dateAdded}</p>
                      </div>

                      <div className="pt-2 border-t border-[#53443A]/20 flex justify-between items-center text-xs">
                        <span className="text-[#D9C2B5]/70 font-mono text-[11px]">SHA-256 Verified</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); onDownloadFile(file); }}
                          className="text-[#FFB786] hover:text-[#FDFBD4] font-semibold flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VAULTS */}
          {activeTab === 'vaults' && (
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-[#FDFBD4] mb-1 font-display">
                    Shelby Vault Pools
                  </h1>
                  <p className="text-sm text-[#D9C2B5]">
                    Organize your documents into encrypted, isolated storage pools on Aptos.
                  </p>
                </div>

                <button
                  onClick={() => setShowCreateVaultModal(true)}
                  className="bg-[#C05800] text-[#FDFBD4] font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl hover:bg-[#A64C00] transition-all flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Vault</span>
                </button>
              </div>

              {/* Vault Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vaultsList.map((vault) => (
                  <div
                    key={vault.id}
                    className="bg-[#2E1C06] border border-[#C05800]/30 rounded-2xl p-6 space-y-5 shadow-xl hover:border-[#C05800] transition-all relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#713600] flex items-center justify-center text-[#FFB786]">
                          <Lock className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-[#FDFBD4] font-display">{vault.name}</h3>
                          <span className="text-xs text-[#D9C2B5]">{vault.fileCount} Documents • {vault.size}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleVaultLock(vault.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          vault.locked 
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60' 
                            : 'bg-green-950/80 text-green-300 border border-green-800/60'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>{vault.locked ? 'Encrypted & Locked' : 'Unlocked'}</span>
                      </button>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-xs text-[#D9C2B5]">
                        <span>Shelby Quota Used</span>
                        <span className="font-semibold text-[#FFB786]">24%</span>
                      </div>
                      <div className="w-full h-2 bg-[#201000] rounded-full overflow-hidden border border-[#53443A]/30">
                        <div className="h-full bg-[#C05800] rounded-full w-1/4"></div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#53443A]/20 flex justify-between items-center text-xs">
                      <span className="text-[#D9C2B5]/80 font-mono">Consensus: Aptos Shelby Protocol</span>
                      <button
                        onClick={() => onNavigate('all-files')}
                        className="text-[#FFB786] hover:text-[#FDFBD4] font-semibold flex items-center gap-1"
                      >
                        <span>Open Vault →</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-8 max-w-4xl">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#FDFBD4] mb-1 font-display">
                  Vault & Network Settings
                </h1>
                <p className="text-sm text-[#D9C2B5]">
                  Configure your encryption standard, Shelby Protocol nodes, and connected Aptos wallet.
                </p>
              </div>

              {/* Setting 1: Network Selection */}
              <div className="bg-[#2E1C06] border border-[#C05800]/20 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-[#FDFBD4] font-display">Aptos Shelby Network</h3>
                    <p className="text-xs text-[#D9C2B5]">Select target Aptos network for storing document hash commitments.</p>
                  </div>

                  <div className="flex bg-[#201000] p-1 rounded-xl border border-[#53443A]/40">
                    <button
                      onClick={() => setNetwork('testnet')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        network === 'testnet' ? 'bg-[#C05800] text-[#FDFBD4]' : 'text-[#D9C2B5]'
                      }`}
                    >
                      Shelby Testnet
                    </button>
                    <button
                      onClick={() => setNetwork('mainnet')}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        network === 'mainnet' ? 'bg-[#C05800] text-[#FDFBD4]' : 'text-[#D9C2B5]'
                      }`}
                    >
                      Aptos Mainnet
                    </button>
                  </div>
                </div>
              </div>

              {/* Setting 2: Client Encryption Standard */}
              <div className="bg-[#2E1C06] border border-[#C05800]/20 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-[#FDFBD4] font-display">Client Encryption Algorithm</h3>
                    <p className="text-xs text-[#D9C2B5]">All files are encrypted in-browser before being dispatched to Shelby nodes.</p>
                  </div>

                  <select
                    value={encryptionStandard}
                    onChange={(e) => setEncryptionStandard(e.target.value as any)}
                    className="bg-[#201000] border border-[#53443A] rounded-xl px-4 py-2 text-xs font-semibold text-[#FFB786] focus:outline-none focus:border-[#C05800]"
                  >
                    <option value="AES-GCM-256">AES-GCM-256 (Default)</option>
                    <option value="ChaCha20-Poly1305">ChaCha20-Poly1305</option>
                  </select>
                </div>
              </div>

              {/* Setting 3: Wallet Details & Export */}
              <div className="bg-[#2E1C06] border border-[#C05800]/20 rounded-2xl p-6 space-y-6 shadow-xl">
                <h3 className="font-bold text-base text-[#FDFBD4] font-display">Connected Petra Wallet & Manifest</h3>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#201000] p-4 rounded-xl border border-[#53443A]/30">
                  <div className="space-y-1 font-mono text-xs">
                    <div className="text-[#D9C2B5]/70">Account Address</div>
                    <div className="text-[#FFB786] font-bold break-all">
                      {account?.address?.toString() || '0x71c8932fa...4e2'}
                    </div>
                  </div>

                  <button
                    onClick={() => disconnect()}
                    className="px-4 py-2 bg-red-950/60 border border-red-800 text-red-200 text-xs font-semibold rounded-lg hover:bg-red-900/80 transition-colors shrink-0"
                  >
                    Disconnect Wallet
                  </button>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-[#53443A]/20">
                  <div>
                    <h4 className="font-semibold text-xs text-[#FDFBD4]">Export Mosaic Storage Manifest</h4>
                    <p className="text-[11px] text-[#D9C2B5]">Download cryptographically verifiable list of all your Shelby Blob IDs.</p>
                  </div>

                  <button
                    onClick={() => {
                      const manifest = JSON.stringify({
                        app: 'Mosaic',
                        network,
                        encryptionStandard,
                        account: account?.address?.toString(),
                        filesCount: files.length,
                        timestamp: Date.now()
                      }, null, 2);
                      navigator.clipboard.writeText(manifest);
                      setCopiedManifest(true);
                      setTimeout(() => setCopiedManifest(false), 2000);
                    }}
                    className="px-4 py-2.5 bg-[#713600] text-[#FDFBD4] text-xs font-semibold rounded-lg hover:bg-[#C05800] transition-all flex items-center gap-2"
                  >
                    {copiedManifest ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedManifest ? 'Manifest Copied!' : 'Copy Vault Manifest'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* File Details / Verification Modal */}
      {selectedFileDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-[#2E1C06] border border-[#C05800]/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-start border-b border-[#53443A]/20 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#713600] flex items-center justify-center text-[#FFB786]">
                  {getFileIcon(selectedFileDetail.type)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#FDFBD4] font-display">{selectedFileDetail.name}</h3>
                  <p className="text-xs text-[#D9C2B5]">{selectedFileDetail.type} • {selectedFileDetail.size}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFileDetail(null)}
                className="p-1 rounded-lg hover:bg-[#3A260F] text-[#D9C2B5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs bg-[#201000] p-4 rounded-xl border border-[#53443A]/30 font-mono">
              <div>
                <span className="text-[#D9C2B5]/60 block text-[10px]">SHA-256 Checksum</span>
                <span className="text-[#FFB786] break-all">{selectedFileDetail.hash || '0x8f4d183921...a3b9'}</span>
              </div>
              <div>
                <span className="text-[#D9C2B5]/60 block text-[10px]">Shelby Blob ID</span>
                <span className="text-[#FDFBD4] break-all">{selectedFileDetail.shelbyBlobId || `shelby_blob_${selectedFileDetail.id}`}</span>
              </div>
              <div>
                <span className="text-[#D9C2B5]/60 block text-[10px]">Blockchain Status</span>
                <span className="text-green-400 font-bold">Anchored on Aptos Consensus</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  handleCopyHash(selectedFileDetail.hash || '0x8f4d183921...a3b9');
                }}
                className="flex-1 py-3 bg-[#3A260F] border border-[#53443A] text-[#D9C2B5] hover:text-[#FDFBD4] rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5"
              >
                {copiedHash ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedHash ? 'Copied' : 'Copy Hash'}</span>
              </button>

              <button
                onClick={() => {
                  onDownloadFile(selectedFileDetail);
                  setSelectedFileDetail(null);
                }}
                className="flex-1 py-3 bg-[#C05800] text-[#FDFBD4] hover:bg-[#A64C00] rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>Decrypt & Download</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Vault Modal */}
      {showCreateVaultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="bg-[#2E1C06] border border-[#C05800]/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b border-[#53443A]/20 pb-3">
              <h3 className="font-bold text-lg text-[#FDFBD4] font-display">Create Encrypted Vault</h3>
              <button onClick={() => setShowCreateVaultModal(false)} className="text-[#D9C2B5]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#D9C2B5]">Vault Name</label>
              <input
                type="text"
                value={newVaultName}
                onChange={(e) => setNewVaultName(e.target.value)}
                placeholder="e.g. Legal Contracts Vault"
                className="w-full bg-[#201000] border border-[#53443A] rounded-xl p-3 text-xs text-[#FDFBD4] placeholder:text-[#D9C2B5]/50 focus:outline-none focus:border-[#C05800]"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowCreateVaultModal(false)}
                className="flex-1 py-3 bg-[#201000] text-[#D9C2B5] rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateVault}
                className="flex-1 py-3 bg-[#C05800] text-[#FDFBD4] hover:bg-[#A64C00] rounded-xl text-xs font-bold uppercase tracking-wider"
              >
                Create Vault
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
