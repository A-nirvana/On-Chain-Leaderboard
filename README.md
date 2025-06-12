# 🏆 On-Chain Leaderboard
A decentralized leaderboard app powered by wallets and NFTs — no emails, no passwords, just Web3. Users can join, play, and compete with others using their crypto wallets. Built with Next.js, Privy, and an on-chain mindset, this project demonstrates how user data and scores can live transparently on the blockchain.

## 🚀 Features
### 🔐 Wallet-based login with Privy

### 🎮 Score tracking with real-time leaderboard

### 🧠 Custom user metadata (display names, stored securely)

### 🏅 NFT-style rank rewards

### 💾 Optional score update flow: save only when the user confirms

### 🌐 Built with Next.js App Router, TailwindCSS, and TypeScript
## Overall working
### Smart Contract:
Deployed using Hardhat, the smart contract stores user scores on-chain. It acts as the source of truth for leaderboard data and ensures transparency and immutability.

### Backend Relayer:
Instead of letting the frontend directly interact with the blockchain, a server-side relayer securely signs and sends transactions to the contract. This keeps private keys safe and simplifies the user experience.

### Next.js Frontend:
The frontend interacts with the backend via API routes to submit and fetch scores. It uses Privy for authentication and stores user metadata like names. Once users play the game and achieve a new score, the frontend notifies the backend, which updates the contract via the relayer if the score qualifies.
