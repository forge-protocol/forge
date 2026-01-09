# FORGE Documentation

Welcome to FORGE - Your complete Solana development platform!

## 📖 Table of Contents

- [Getting Started](./guides/getting-started.md)
- [Architecture Overview](./architecture/overview.md)
- [API Reference](./api/index.md)
- [CLI Commands](./guides/cli-commands.md)
- [Smart Contracts](./guides/smart-contracts.md)
- [Payment Integration](./guides/payments.md)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Rust 1.70+
- Anchor CLI
- Solana CLI

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd forge-protocol

# Install dependencies
npm install

# Build all packages
npm run build:all
```

### Development Setup

```bash
# Start the website
npm run dev

# Start the backend (separate terminal)
cd packages/backend && npm run dev

# Build CLI
cd packages/cli && npm run build && npm link
```

## 🏗️ Architecture

FORGE consists of several key components:

- **Website**: Next.js frontend for the user interface
- **CLI**: Command-line tool for project management
- **SDK**: TypeScript SDK with validation and types
- **Backend**: API server handling payments and webhooks
- **Programs**: Anchor smart contracts

## 📚 Guides

### For Developers

- [Creating Your First Program](./guides/first-program.md)
- [Using the CLI](./guides/cli-usage.md)
- [Payment Integration](./guides/payments.md)
- [Testing Programs](./guides/testing.md)

### For Contributors

- [Contributing Guide](./guides/contributing.md)
- [Code Style](./guides/code-style.md)
- [Release Process](./guides/releases.md)

## 🤝 Support

- [Discord Community](https://discord.gg/forge)
- [GitHub Issues](https://github.com/forge-protocol/issues)
- [Documentation Issues](https://github.com/forge-protocol/docs/issues)

## 📄 License

FORGE is licensed under the MIT License. See [LICENSE](../LICENSE) for details.