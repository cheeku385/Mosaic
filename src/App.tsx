import React, { useState, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { WalletProvider } from './components/WalletProvider';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { UploadPage } from './pages/UploadPage';
import { BackedUpFile, NavPage } from './types';

function MainAppContent() {
  const { account, connected } = useWallet();
  const walletAddress = account?.address?.toString().toLowerCase() || null;
  const [currentPage, setCurrentPage] = useState<NavPage>('landing');
  const [files, setFiles] = useState<BackedUpFile[]>([]);

  // Synchronize files for the connected wallet address
  useEffect(() => {
    if (walletAddress) {
      const storageKey = `mosaic_shelby_files_${walletAddress}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setFiles(parsed);
          } else {
            setFiles([]);
          }
        } catch (e) {
          setFiles([]);
        }
      } else {
        setFiles([]);
      }
    } else {
      setFiles([]);
    }
  }, [walletAddress]);

  // Automatically show dashboard when wallet connects
  useEffect(() => {
    if (connected && currentPage === 'landing') {
      setCurrentPage('dashboard');
    }
  }, [connected]);

  const handleAddFile = (newFile: BackedUpFile) => {
    const fileWithOwner: BackedUpFile = {
      ...newFile,
      ownerAddress: walletAddress || newFile.ownerAddress
    };
    setFiles(prev => {
      const updated = [fileWithOwner, ...prev];
      if (walletAddress) {
        localStorage.setItem(`mosaic_shelby_files_${walletAddress}`, JSON.stringify(updated));
      }
      return updated;
    });
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
