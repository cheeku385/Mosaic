import React, { FC, ReactNode } from 'react';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: FC<WalletProviderProps> = ({ children }) => {
  return (
    <AptosWalletAdapterProvider plugins={[]} autoConnect={false}>
      {children}
    </AptosWalletAdapterProvider>
  );
};
