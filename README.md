# FORGE - Solana Development Platform

![FORGE Logo](https://img.shields.io/badge/FORGE-Solana-black?style=for-the-badge&logo=solana)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat-square&logo=node.js)
![Rust](https://img.shields.io/badge/Rust-1.70+-orange?style=flat-square&logo=rust)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)

**FORGE is your complete CLI toolkit for building, testing, and deploying Solana programs with AI-powered assistance.**

## ✨ Features

- 🖥️ **CLI Tool** for project management and deployment
- 📚 **TypeScript SDK** with Zod validation and utilities
- 🔧 **Backend API** with x402 payment integration
- ⚡ **Anchor Programs** with smart contract templates
- 🤖 **AI-Powered** development assistance
- 🔧 **Automated Setup** with health checks and validation

## 🛠️ Quick Start

### 1. Automated Setup (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd forge-protocol

# Run the automated setup (installs all dependencies)
npm run setup
```

### 2. Manual Setup

If automated setup fails, follow these steps:

```bash
# Install system dependencies
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh  # Rust
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"  # Solana CLI
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --tag v0.29.0  # Anchor

# Install Node.js dependencies
npm install

# Setup environment
npm run setup

# Verify installation
npm run health
```

### 3. Start Development

```bash
# Build and link CLI
npm run build:cli
cd packages/cli && npm link

# In another terminal, start the backend
npm run dev:backend
```

### 4. Create Your First Project

```bash
# Create a new Solana program
forge init my-awesome-program

# Navigate to the project
cd my-awesome-program

# Build the program
forge build

# Test the program
anchor test
```

## 📋 Prerequisites

### System Requirements
- **Node.js**: 18.0.0 or higher
- **Rust**: 1.70.0 or higher
- **Solana CLI**: Latest stable
- **Anchor CLI**: 0.29.0

### Platform Support
- ✅ **Linux** (Ubuntu 20.04+, Fedora 33+)
- ✅ **macOS** (10.15+)
- ✅ **Windows** (WSL2 recommended)

## 🚀 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run setup` | Automated environment setup |
| `npm run health` | Check system health |
| `npm run build:all` | Build all packages (CLI, SDK, Backend) |
| `npm run dev:backend` | Start backend API server |
| `npm run install:all` | Install all dependencies |
| `npm run test` | Run all package tests |

## 📁 Project Structure

```
forge-protocol/
├── packages/
│   ├── cli/               # CLI tool (@forge/cli)
│   ├── sdk/               # TypeScript SDK (@forge/sdk)
│   └── backend/           # API server (@forge/backend)
├── programs/              # Anchor smart contracts
├── docs/                  # Documentation
├── setup.sh              # Automated setup script
├── health-check.js       # System validation
└── validate-installation.js # Comprehensive validation
```

## 🔧 Development Workflow

### Creating Programs
```bash
# Initialize a new project
forge init my-program

# Choose template (basic, token, nft, dao)
forge init my-program --template token

# Build the program
cd my-program && forge build

# Test locally
anchor test

# Deploy to devnet
anchor deploy
```

### Using the SDK
```typescript
import { ForgeSDK } from '@forge/sdk';

const sdk = new ForgeSDK({ network: 'devnet' });

// Validate program configuration
const result = sdk.validateProgram(config);
```

### Backend API
```bash
# Start the backend server
npm run dev:backend

# API will be available at http://localhost:3001
```

## 🔐 Environment Configuration

### Backend (packages/backend/.env.local)
```env
TREASURY_PUBKEY=your_treasury_wallet
HELIUS_RPC_URL=https://devnet.helius-rpc.com/?api-key=your_key
PORT=3001
NODE_ENV=development
```

## 🧪 Testing

```bash
# Test all packages
npm test

# Test individual packages
npm run test:cli
npm run test:sdk
npm run test:backend
```

## 📚 Documentation

- [Getting Started Guide](./docs/guides/getting-started.md)
- [Architecture Overview](./docs/architecture/overview.md)
- [API Reference](./docs/api/index.md)
- [CLI Commands](./docs/guides/cli-commands.md)
- [Troubleshooting](./docs/guides/troubleshooting.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Run tests: `npm test`
4. Submit a pull request

## 📄 License

FORGE is licensed under the MIT License. See [LICENSE](./LICENSE) for details.

## 🆘 Support

- 📖 [Documentation](./docs/)
- 💬 [Discord Community](https://discord.gg/forge)
- 🐛 [GitHub Issues](https://github.com/forge-protocol/issues)

---

**Built with ❤️ for the Solana ecosystem**
