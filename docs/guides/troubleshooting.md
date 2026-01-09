# Troubleshooting Guide

This guide helps you resolve common issues when setting up and using FORGE.

## 🔍 Health Check

First, always run the health check to identify issues:

```bash
npm run health
```

## 🛠️ Common Installation Issues

### Node.js Version Too Old

**Error:** `Node.js version X.X.X is too old`

**Solution:**
```bash
# Install Node.js 18+ using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
nvm alias default 18
```

### Rust Not Found

**Error:** `Rust is not installed`

**Solution:**
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Add to your shell profile
echo 'source ~/.cargo/env' >> ~/.bashrc
```

### Anchor CLI Issues

**Error:** `Anchor CLI not found` or version mismatch

**Solution:**
```bash
# Install specific version
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --tag v0.29.0

# Update PATH (add to ~/.bashrc)
export PATH="$HOME/.cargo/bin:$PATH"
```

### Solana CLI Issues

**Error:** `Solana CLI not found`

**Solution:**
```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"

# Add to PATH (add to ~/.bashrc)
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
```

## 🏗️ Build Issues

### TypeScript Compilation Errors

**Error:** `Cannot find module` or type errors

**Solution:**
```bash
# Clean and rebuild
npm run clean
npm install
npm run build:all
```

### Rust Compilation Errors

**Error:** `edition2024` or toolchain issues

**Solution:**
```bash
# Update Rust
rustup update
rustup default nightly

# Or use stable with specific components
rustup component add rustfmt
rustup component add clippy
```

### Anchor Build Fails

**Error:** `anchor build` fails with various errors

**Solution:**
```bash
# Check Anchor version
anchor --version

# Clean and rebuild
cd your-project
anchor clean
anchor build

# Check Solana config
solana config get
solana config set --url devnet
```

## 🚀 Runtime Issues

### Website Won't Start

**Error:** `npm run dev` fails

**Solution:**
```bash
# Check Node.js
node --version

# Clear cache
rm -rf .next node_modules/.cache
npm install
npm run dev
```

### CLI Not Found

**Error:** `forge: command not found`

**Solution:**
```bash
# Build and link CLI
cd packages/cli
npm run build
npm link

# Check PATH
which forge
forge --version
```

### Backend Won't Start

**Error:** Backend server fails to start

**Solution:**
```bash
# Check environment file
cat packages/backend/.env.local

# Install dependencies
cd packages/backend
npm install

# Start with verbose logging
npm run dev
```

## 🔧 Environment Issues

### Missing Environment Variables

**Error:** Features not working due to missing config

**Solution:**
```bash
# Create environment files
cp .env.example .env.local
cp packages/backend/.env.example packages/backend/.env.local

# Edit with your values
nano .env.local
```

### RPC Connection Issues

**Error:** Cannot connect to Solana RPC

**Solution:**
```bash
# Check network connectivity
curl https://api.devnet.solana.com -s

# Update RPC URL in environment
# Use Helius or other RPC providers for better reliability
```

## 📦 Dependency Issues

### Package Installation Fails

**Error:** `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules packages/*/node_modules

# Reinstall
npm install
```

### Workspace Issues

**Error:** Monorepo workspace problems

**Solution:**
```bash
# Clean everything
npm run clean

# Bootstrap workspaces
npm install

# Build in order
npm run build:sdk
npm run build:backend
npm run build:cli
```

## 🧪 Testing Issues

### Tests Failing

**Error:** `npm test` fails

**Solution:**
```bash
# Install test dependencies
npm install

# Run specific test suites
npm run test:cli
npm run test:sdk

# For Anchor tests
cd your-project
anchor test
```

## 🌐 Network Issues

### Devnet Connection Problems

**Error:** Cannot connect to Solana devnet

**Solution:**
```bash
# Check network
solana config set --url devnet
solana cluster-version

# Use alternative RPC
solana config set --url https://api.devnet.solana.com
```

### Wallet Connection Issues

**Error:** Cannot connect wallet

**Solution:**
```bash
# Check wallet installation
which solana

# Create wallet if needed
solana-keygen new --no-passphrase

# Check balance
solana balance
```

## 🆘 Getting Help

If these solutions don't work:

1. **Run health check**: `npm run health`
2. **Check logs**: Look for error messages in terminal output
3. **Update dependencies**: `npm update` and `rustup update`
4. **Check documentation**: See [docs/README.md](../README.md)
5. **Open an issue**: [GitHub Issues](https://github.com/forge-protocol/issues)

## 🔧 Advanced Troubleshooting

### Debug Mode

Enable verbose logging:
```bash
# For Next.js
DEBUG=* npm run dev

# For backend
cd packages/backend
NODE_ENV=development DEBUG=* npm run dev
```

### System Information

Get system info for bug reports:
```bash
# System info
uname -a
node --version
npm --version
rustc --version
cargo --version
anchor --version
solana --version

# Environment
env | grep -E "(PATH|NODE_ENV|SOLANA)"
```

### Reset Everything

Complete reset (use as last resort):
```bash
# Stop all processes
pkill -f "next\|node\|anchor"

# Clean everything
npm run clean
rm -rf ~/.cargo/registry ~/.npm

# Reinstall everything
./setup.sh
```