export interface BackedUpFile {
  id: string;
  name: string;
  type: string;
  dateAdded: string;
  size: string;
  hash?: string;
  shelbyBlobId?: string;
  dataUrl?: string;
  category?: 'encrypted' | 'sync' | 'immutable';
  rawType?: string;
  rawSizeNumber?: number;
  ownerAddress?: string;
}

export type NavPage = 'landing' | 'dashboard' | 'upload' | 'all-files' | 'vaults' | 'settings';

export interface ShelbyBackupResult {
  blobId: string;
  transactionHash: string;
  fileHash: string;
  timestamp: number;
}
