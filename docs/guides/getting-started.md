# Getting Started with FORGE

Welcome to FORGE! This guide will help you get up and running with the FORGE development platform.

## Prerequisites

Before you begin, ensure you have the following installed:

### System Requirements

- **Node.js**: Version 18 or higher
- **Rust**: Version 1.70 or higher
- **Solana CLI**: Latest stable version
- **Anchor CLI**: Version 0.29.0 or higher

### Installation Commands

```bash
# Install Node.js (using nvm recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"

# Install Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --tag v0.29.0
```

## 🚀 Quick Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd forge-protocol

# Install all dependencies
npm install

# Install workspace dependencies
npm run install:all
```

### 2. Environment Setup

Create environment files:

```bash
# Root .env.local
cp .env.example .env.local

# Backend environment
cp packages/backend/.env.example packages/backend/.env.local
```

Edit the environment files with your configuration:

```bash
# .env.local
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# packages/backend/.env.local
TREASURY_PUBKEY=your_treasury_wallet_address
HELIUS_RPC_URL=https://devnet.helius-rpc.com/?api-key=your_helius_key
PORT=3001
```

### 3. Build Everything

```bash
# Build all packages
npm run build:all

# Build smart contracts
cd programs && anchor build
```

### 4. Start Development

```bash
# Terminal 1: Start the website
npm run dev

# Terminal 2: Start the backend
cd packages/backend && npm run dev

# Terminal 3: Build and link CLI
cd packages/cli && npm run build && npm link
```

### 5. Test the Setup

```bash
# Test CLI
forge --version

# Test backend health
curl http://localhost:3001/api/health

# Open website
open http://localhost:3000
```

## 🛠️ Development Workflow

### Creating a New Program

```bash
# Use the CLI to create a new project
forge init my-awesome-program

cd my-awesome-program

# Build and test
anchor build
anchor test

# Deploy to devnet
anchor deploy
```

### Using the SDK

```typescript
import { ForgeSDK } from '@forge/sdk';

// Initialize SDK
const sdk = new ForgeSDK({
  network: 'devnet'
});

// Validate a program configuration
const result = sdk.validateProgram(programConfig);
if (!result.isValid) {
  console.error('Validation errors:', result.errors);
}
```

### Payment Integration

```typescript
// Create a payment request
const payment = await fetch('/api/payments/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 1.0,
    currency: 'SOL',
    recipient: 'treasury_address'
  })
});
```

## 🔧 Troubleshooting

### Common Issues

**Anchor build fails**
```bash
# Update Rust
rustup update

# Check Anchor version
anchor --version

# Clean and rebuild
anchor clean
anchor build
```

**CLI not found**
```bash
# Rebuild and relink
cd packages/cli
npm run build
npm link
```

**Backend connection issues**
```bash
# Check environment variables
cat packages/backend/.env.local

# Check Solana connection
solana config get
```

### Getting Help

- Check the [API Documentation](./api/index.md)
- Join our [Discord Community](https://discord.gg/forge)
- Open an [issue](https://github.com/forge-protocol/issues)

## 🎯 Next Steps

Now that you have FORGE set up, you can:

1. [Create your first program](./first-program.md)
2. [Explore the CLI commands](./cli-commands.md)
3. [Learn about payment integration](./payments.md)
4. [Contribute to the project](./contributing.md)

Happy building! 🚀