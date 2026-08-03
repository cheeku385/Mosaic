import React, { useState, useRef } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { 
  CloudUpload, 
  FileText, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle,
  LayoutDashboard,
  Lock,
  Settings,
  HelpCircle,
  Radio,
  FileCheck
} from 'lucide-react';
import { BackedUpFile, NavPage } from '../types';
import { backupToShelbyProtocol, formatBytes } from '../lib/shelby';
import { MosaicLogo } from '../components/Logo';
import { WalletDropdown } from '../components/WalletDropdown';

interface UploadPageProps {
  onFileBackedUp: (file: BackedUpFile) => void;
  onNavigate: (page: NavPage) => void;
}

export const UploadPage: React.FC<UploadPageProps> = ({
  onFileBackedUp,
  onNavigate
}) => {
  const { account, connected, connect, signAndSubmitTransaction } = useWallet();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [stageText, setStageText] = useState('Ready for encryption');
  const [isUploading, setIsUploading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    setError(null);
    setIsDone(false);
    setSelectedFile(file);
    setUploadProgress(15);
    setStageText('File loaded • Ready for encryption');
  };

  const formatAddress = (addr?: string | null) => {
    if (!addr) return '0x71C...4e2';
    const str = addr.toString();
    return `${str.substring(0, 6)}...${str.substring(str.length - 4)}`;
  };

  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleBackupToShelby = async () => {
    if (!selectedFile) {
      setError("Please select or drop a file to back up.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setIsDone(false);

    try {
      // Step 0: Ensure Petra Wallet connection
      if (!connected) {
        setStageText('Connecting Petra Wallet...');
        try {
          await connect('Petra');
        } catch (connErr) {
          console.warn("Wallet connect request:", connErr);
        }
      }

      // Step 1: Encrypt file & construct Shelby Protocol Blob
      const result = await backupToShelbyProtocol(selectedFile, (progress, stage) => {
        setUploadProgress(progress);
        setStageText(stage);
      });

      // Step 2: Trigger real Aptos Petra wallet transaction request
      setStageText('Awaiting Petra Wallet transaction signature...');
      setUploadProgress(90);

      const targetAddress = account?.address?.toString() || "0x1";

      // Payload for Aptos Wallet Adapter v2 & Petra provider
      const adapterTransaction = {
        data: {
          function: "0x1::aptos_account::transfer",
          typeArguments: [],
          functionArguments: [targetAddress, 0]
        }
      };

      const rawPetraPayload = {
        type: "entry_function_payload",
        function: "0x1::aptos_account::transfer",
        type_arguments: [],
        arguments: [targetAddress, 0]
      };

      let finalTxHash = result.transactionHash;
      let petraError: any = null;
      let txSubmitted = false;

      // 1. Try Aptos Wallet Adapter signAndSubmitTransaction
      if (signAndSubmitTransaction) {
        try {
          const res: any = await signAndSubmitTransaction(adapterTransaction as any);
          if (res && (res.hash || res.transactionHash)) {
            finalTxHash = res.hash || res.transactionHash;
            txSubmitted = true;
          }
        } catch (err: any) {
          petraError = err;
          console.warn("Wallet adapter signAndSubmitTransaction error:", err);
        }
      }

      // 2. Fallback to direct window.aptos / window.petra provider if needed
      if (!txSubmitted && (typeof window !== 'undefined')) {
        const aptosWindow = (window as any).aptos || (window as any).petra;
        if (aptosWindow?.signAndSubmitTransaction) {
          try {
            const res = await aptosWindow.signAndSubmitTransaction(rawPetraPayload);
            if (res && (res.hash || res.transactionHash)) {
              finalTxHash = res.hash || res.transactionHash;
              txSubmitted = true;
            }
          } catch (winErr: any) {
            petraError = winErr;
            console.warn("Direct Petra window transaction error:", winErr);
          }
        }
      }

      // Check if user rejected in Petra
      if (petraError) {
        const errMsg = petraError?.message || String(petraError);
        if (errMsg.toLowerCase().includes('reject') || petraError?.code === 4001) {
          throw new Error("Transaction signature was rejected in Petra Wallet.");
        }
      }

      // Read file data URL asynchronously
      const dataUrl = await readFileAsDataURL(selectedFile);

      // Create new BackedUpFile entry
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      const newFile: BackedUpFile = {
        id: `file_${Date.now()}`,
        name: selectedFile.name,
        type: selectedFile.name.endsWith('.pdf') ? 'PDF Document' : 
              selectedFile.name.endsWith('.zip') ? 'Archive' : 
              selectedFile.name.endsWith('.key') ? 'Key File' : 'Document',
        dateAdded: dateStr,
        size: formatBytes(selectedFile.size),
        hash: result.fileHash,
        shelbyBlobId: result.blobId,
        dataUrl,
        rawType: selectedFile.type,
        rawSizeNumber: selectedFile.size
      };

      // Notify parent component & finish upload
      onFileBackedUp(newFile);
      setTxHash(finalTxHash);
      setUploadProgress(100);
      setIsDone(true);
      setStageText('Successfully backed up to Shelby Protocol!');

    } catch (err: any) {
      console.error("Shelby backup error:", err);
      setError(err?.message || "Failed to complete transaction on Shelby Network.");
      setStageText("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#201000] text-[#FDFBD4] font-body flex flex-col md:flex-row antialiased">
      
      {/* Sidebar matching Image 4 */}
      <aside className="hidden md:flex bg-[#2E1C06] text-[#FFB786] docked left-0 h-screen w-64 border-r border-[#53443A]/20 flex-col p-4 space-y-4 shrink-0 z-20">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6 px-2 pt-2">
          <MosaicLogo size={36} subtitle="Secure & Decentralized" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-[#D9C2B5] hover:bg-[#3A260F] hover:text-[#FDFBD4] rounded-lg transition-all"
          >
            <LayoutDashboard className="w-4 h-4 text-[#D9C2B5]" />
            <span className="text-sm font-semibold">Dashboard</span>
          </button>

          <button
            onClick={() => onNavigate('all-files')}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-[#D9C2B5] hover:bg-[#3A260F] hover:text-[#FDFBD4] rounded-lg transition-all"
          >
            <FileText className="w-4 h-4 text-[#D9C2B5]" />
            <span className="text-sm font-semibold">All Files</span>
          </button>

          <button
            onClick={() => onNavigate('vaults')}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-[#D9C2B5] hover:bg-[#3A260F] hover:text-[#FDFBD4] rounded-lg transition-all"
          >
            <Lock className="w-4 h-4 text-[#D9C2B5]" />
            <span className="text-sm font-semibold">My Vault</span>
          </button>

          <button
            className="flex items-center gap-3 px-4 py-2.5 w-full bg-[#713600] text-[#FDFBD4] rounded-lg font-bold shadow-md"
          >
            <CloudUpload className="w-4 h-4 text-[#FFB786]" />
            <span className="text-sm">Upload</span>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-[#D9C2B5] hover:bg-[#3A260F] hover:text-[#FDFBD4] rounded-lg transition-all"
          >
            <Settings className="w-4 h-4 text-[#D9C2B5]" />
            <span className="text-sm font-semibold">Settings</span>
          </button>
        </nav>

        {/* CTA & Footer Info */}
        <div className="mt-auto space-y-3 pt-4 border-t border-[#53443A]/20">
          <button
            onClick={() => alert("Shelby Network Active • Aptos Storage Engine Ready")}
            className="w-full py-2 px-4 bg-[#3A260F] text-[#FFB786] border border-[#53443A]/40 rounded-lg text-xs font-semibold hover:bg-[#463018] transition-colors"
          >
            Upgrade Storage
          </button>

          <div className="space-y-1 text-xs text-[#D9C2B5]">
            <a href="https://docs.shelby.xyz" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-3 py-1.5 hover:text-[#FFB786]">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Support Docs</span>
            </a>
            <div className="flex items-center gap-2 px-3 py-1.5 text-[#D9C2B5]/80">
              <Radio className="w-3.5 h-3.5 text-green-400" />
              <span>Network: Shelby Active</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        
        {/* Top Bar */}
        <header className="bg-[#201000] border-b border-[#53443A]/20 flex justify-between items-center w-full px-6 md:px-12 h-20 shrink-0 z-10">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 text-xs font-semibold text-[#D9C2B5] hover:text-[#FDFBD4] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center gap-3">
            <WalletDropdown />
          </div>
        </header>

        {/* Scrollable Canvas */}
        <div className="flex-1 overflow-y-auto px-6 md:px-12 py-10 flex flex-col items-center">
          <div className="w-full max-w-2xl flex flex-col items-center space-y-8">
            
            {/* Header Text */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold text-[#FDFBD4] font-display">
                Secure Upload
              </h2>
              <p className="text-sm text-[#D9C2B5] max-w-md mx-auto leading-relaxed">
                Encrypt and fragment your files directly in the browser before sending them to the decentralized vault.
              </p>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {/* Drag & Drop Zone matching Image 4 */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full bg-[#463018]/50 rounded-2xl border-2 border-dashed ${
                dragActive ? 'border-[#C05800] bg-[#463018]' : 'border-[#53443A]/60 hover:border-[#C05800]'
              } transition-all duration-300 p-12 flex flex-col items-center justify-center cursor-pointer group shadow-xl`}
            >
              <div className="w-16 h-16 rounded-full bg-[#4A3216] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(192,88,0,0.2)]">
                <CloudUpload className="w-8 h-8 text-[#FFB786]" />
              </div>
              
              <p className="text-lg font-bold text-[#FDFBD4] mb-2 text-center font-display">
                {selectedFile ? selectedFile.name : "Drag & drop files here or click to browse"}
              </p>
              
              <p className="text-xs text-[#D9C2B5]">
                {selectedFile ? `${formatBytes(selectedFile.size)} • Click to replace` : "Supported: PDF, PNG, JPEG, Zip, Key (Max 50MB)"}
              </p>
            </div>

            {/* File Info & Upload Progress Card matching Image 4 */}
            {(selectedFile || isUploading || isDone) && (
              <div className="w-full bg-[#2E1C06] rounded-xl p-6 border border-[#53443A]/30 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded bg-[#713600]/30 flex items-center justify-center text-[#FFB786] shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#FDFBD4] truncate">
                        {selectedFile ? selectedFile.name : "whitepaper_v2_final.pdf"}
                      </p>
                      <p className="text-xs text-[#D9C2B5]">
                        {selectedFile ? formatBytes(selectedFile.size) : "2.4 MB"} • {stageText}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#FFB786]">
                    {isDone ? '100%' : `${uploadProgress}%`}
                  </span>
                </div>

                {/* Progress Bar with glowing edge */}
                <div className="w-full h-2.5 bg-[#201000] rounded-full overflow-hidden relative border border-[#53443A]/30">
                  <div
                    className="h-full bg-[#C05800] rounded-full transition-all duration-300 ease-out relative"
                    style={{ width: `${isDone ? 100 : uploadProgress}%` }}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-r from-transparent to-white/40 blur-[2px]" />
                  </div>
                </div>

                {/* Completion Details */}
                {isDone && (
                  <div className="pt-2 flex items-center justify-between text-xs text-green-400 bg-green-950/20 p-3 rounded-lg border border-green-900/40">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Shelby Decentralized Blob Created</span>
                    </div>
                    <button
                      onClick={() => onNavigate('dashboard')}
                      className="text-[#FFB786] underline hover:text-[#FDFBD4] font-semibold"
                    >
                      View in Dashboard →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Error banner */}
            {error && (
              <div className="w-full bg-red-950/40 border border-red-800 text-red-200 p-4 rounded-xl text-xs flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Primary Action Button matching Image 4 */}
            <button
              onClick={handleBackupToShelby}
              disabled={isUploading || !selectedFile}
              className="w-full max-w-md bg-[#713600] hover:bg-[#C05800] text-[#FDFBD4] font-bold text-sm py-4 rounded-xl shadow-[0_0_20px_rgba(192,88,0,0.4)] hover:shadow-[0_0_25px_rgba(192,88,0,0.6)] disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <ShieldCheck className="w-5 h-5 text-[#FFB786]" />
              <span>{isUploading ? "Encrypting & Storing..." : isDone ? "Backup Again" : "Backup to Shelby"}</span>
            </button>

          </div>
        </div>

        {/* Footer matching Image 4 */}
        <footer className="bg-[#201000] border-t border-[#53443A]/20 w-full py-6 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center text-xs text-[#D9C2B5] gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#FDFBD4] font-display">Mosaic</span>
            <span>© {new Date().getFullYear()} Protocol. Secured by Decentralized Storage.</span>
          </div>

          <div className="flex gap-6">
            <a href="https://docs.shelby.xyz" target="_blank" rel="noreferrer" className="hover:text-[#FDFBD4] transition-colors">Whitepaper</a>
            <a href="https://shelby.xyz" target="_blank" rel="noreferrer" className="hover:text-[#FDFBD4] transition-colors">Governance</a>
            <a href="https://docs.shelby.xyz" target="_blank" rel="noreferrer" className="hover:text-[#FDFBD4] transition-colors">API Docs</a>
            <a href="https://shelby.xyz" target="_blank" rel="noreferrer" className="hover:text-[#FDFBD4] transition-colors">Privacy</a>
          </div>
        </footer>

      </main>
    </div>
  );
};
