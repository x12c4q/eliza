# ElizaConnectUC 🤖

<div align="center">
  <img src="https://gcdnb.pbrd.co/images/G2EAqMh6P5hs.png?o=1" alt="Eliza Banner" width="100%" />
</div>

# Specialized Agent Features

## Overview
ElizaConnectUC provides a secure and flexible system for managing access to specialized agent features through wallet-based authentication and Discord role management. This system allows developers to gate specific bot functionalities while maintaining security and user experience.

## Key Features

### 🔐 Wallet Authentication System
- Seamless integration with Solana wallets
- Secure message signing for verification
- Timestamp-based protection against replay attacks
- Public key verification and storage

### 👥 Discord Role Management
- Automated role assignment based on wallet verification
- Tiered access control for different agent features
- Role-based command permissions
- Discord username binding to wallet addresses

### 🤖 Tiered Agent Access
1. **Basic Tier** (No Authentication Required)
   - Basic chat functionality
   - Public commands
   - General information queries

2. **Verified Tier** (Wallet Connected)
   - Enhanced agent interactions
   - Access to specialized commands
   - Document interaction capabilities

3. **Premium Tier** (Verified + Special Roles)
   - Advanced AI model access
   - Custom agent configuration
   - Premium features and commands

## Implementation

### Quick Start
```typescript
// 1. Connect wallet
const { publicKey } = useWallet();

// 2. Verify Discord username
const messageText = `Verify Discord username: ${discordUsername}
  \nWallet: ${publicKey.toBase58()}
  \nTimestamp: ${Date.now()}`;

// 3. Sign message
const signature = await signMessage(messageText);

// 4. Claim role
await fetch("/api/claim-role", {
  method: "POST",
  body: JSON.stringify({
    walletAddress: publicKey.toBase58(),
    signature: signature,
    discordUsername: discordUsername
  })
});
