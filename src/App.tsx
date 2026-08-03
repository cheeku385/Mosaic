import React, { useState, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { WalletProvider } from './components/WalletProvider';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { UploadPage } from './pages/UploadPage';
import { BackedUpFile, NavPage } from './types';

// Default initial backed-up files matching Stitch Prompt 3 & Image 3
const INITIAL_FILES: BackedUpFile[] = [
  {
    id: '1',
    name: 'Q3_Financial_Report_Final.pdf',
    type: 'PDF Document',
    dateAdded: 'Oct 24, 2023',
    size: '4.2 MB',
    hash: '0x8f4d18...a3b9',
    category: 'encrypted'
  },
  {
    id: '2',
    name: 'Brand_Assets_Pack_v2.zip',
    type: 'Archive',
    dateAdded: 'Oct 22, 2023',
    size: '156 MB',
    hash: '0x311400...c7d2',
    category: 'sync'
  },
  {
    id: '3',
    name: 'wallet_seed_encrypted.key',
    type: 'Key File',
    dateAdded: 'Oct 15, 2023',
    size: '2 KB',
    hash: '0x713600...e9f1',
    category: 'encrypted'
  },
  {
    id: '4',
    name: 'Client_Contracts_2023',
    type: 'Directory',
    dateAdded: 'Sep 30, 2023',
    size: '--',
    category: 'immutable'
  }
];

function MainAppContent() {
  const { connected } = useWallet();
  const [currentPage, setCurrentPage] = useState<NavPage>('landing');
  const [files, setFiles] = useState<BackedUpFile[]>(() => {
    const saved = localStorage.getItem('mosaic_shelby_files');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_FILES;
      }
    }
    return INITIAL_FILES;
  });

  // Automatically show dashboard when wallet connects
  useEffect(() => {
    if (connected && currentPage === 'landing') {
      setCurrentPage('dashboard');
    }
  }, [connected]);

  // Persist files in localStorage
  useEffect(() => {
    localStorage.setItem('mosaic_shelby_files', JSON.stringify(files));
  }, [files]);

  const handleAddFile = (newFile: BackedUpFile) => {
    setFiles(prev => [newFile, ...prev]);
  };

  const handleDownloadFile = (file: BackedUpFile) => {
    if (file.dataUrl) {
      const a = document.createElement('a');
      a.href = file.dataUrl;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Simulate downloading decrypted file payload
      const dummyContent = `Mosaic Shelby Protocol Encrypted Vault Document\nName: ${file.name}\nHash: ${file.hash || 'SHA256'}\nDecrypted on Aptos Network.`;
      const blob = new Blob([dummyContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.endsWith('.pdf') || file.name.endsWith('.zip') || file.name.endsWith('.key') ? file.name : `${file.name}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen bg-[#201000] text-[#FDFBD4]">
      {currentPage === 'landing' && (
        <LandingPage
          onGoToDashboard={() => setCurrentPage('dashboard')}
          onOpenUpload={() => setCurrentPage('upload')}
        />
      )}

      {(currentPage === 'dashboard' || currentPage === 'all-files' || currentPage === 'vaults' || currentPage === 'settings') && (
        <DashboardPage
          files={files}
          activeTab={currentPage}
          onNavigate={(page) => setCurrentPage(page)}
          onDownloadFile={handleDownloadFile}
          onOpenUpload={() => setCurrentPage('upload')}
        />
      )}

      {currentPage === 'upload' && (
        <UploadPage
          onFileBackedUp={(newFile) => {
            handleAddFile(newFile);
          }}
          onNavigate={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <WalletProvider>
      <MainAppContent />
    </WalletProvider>
  );
}
