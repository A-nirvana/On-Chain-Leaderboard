'use client';

import {PrivyProvider} from '@privy-io/react-auth';

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? '';
const privyClientId = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID;

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
      appId={privyAppId}
      clientId={privyClientId}
      config={{
      appearance: { walletChainType: 'ethereum-only' },
      embeddedWallets: {
        ethereum: {
        createOnLogin: 'users-without-wallets'
        }
      },
      defaultChain: {
        id: 11155111,
        name: 'sepolia',
        rpcUrls: {
        default: {
          http: [
          `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
          ]
        }
        },
        nativeCurrency: {
        name: 'Sepolia Ether',
        symbol: 'ETH',
        decimals: 18
        },
        blockExplorers: {
        default: {
          name: 'Etherscan',
          url: 'https://sepolia.etherscan.io'
        }
        },
        testnet: true
      }
      }}
    >
      {children}
    </PrivyProvider>
  );
}