# FORGE ⚡

[![npm](https://img.shields.io/npm/v/forge-solana-sdk)](https://www.npmjs.org/package/forge-solana-sdk)
[![License](https://img.shields.io/npm/l/forge-solana-sdk)](https://github.com/forge-protocol/forge/blob/main/LICENSE)

**Intent-driven Solana program assembly.** Generate production-ready Anchor programs from natural language. 

> ⚡ **Intent → Code. No magic, just infrastructure.**

## ⚡ Quick Start

### 1. Install
```bash
npm install -g forge-solana-sdk
```

### 2. Create your first project
```bash
# Generate a token transfer program from an intent
forge init my-project --intent "transfer 100 tokens safely"

cd my-project
forge status
```

### 3. Harden and Simulate
```bash
# Apply security safeguards
forge harden

# Preview performance and logs without spending SOL
forge simulate
```

### 4. Generate SDK
```bash
# Generate modern Web3.js v2 functional SDK
forge generate-sdk --v2
```

## 🎯 Key Features

- 💡 **Intent-Driven**: Transform natural language ("mint tokens", "create metadata") into optimized Anchor code.
- 🛡️ **Security-First**: Integrated `forge harden` system with battery-included macros (`require_signer!`, `assert_owned_by!`).
- 🚀 **Modern Standards**: Native support for **Web3.js v2**, Anchor 0.32+, and Rust Edition 2024.
- 🧪 **Complete Workflow**: Auto-generated tests, security audits, performance profiling, and one-command deployment.

## 📚 Documentation

Detailed guides and references:

- [**Command Reference**](./docs/COMMANDS.md) - Detailed guide for all CLI commands.
- [**SDK Generation**](./docs/SDK.md) - How to build and use auto-generated SDKs (v1 & v2).
- [**Troubleshooting**](./docs/COMMANDS.md#forge-status) - Common issues and how to fix them.

## 📋 Prerequisites

- **Node.js** 18+
- **Rust** 1.85.0+ (`rustup update stable`)
- **Solana & Anchor CLI**

## 📄 License
MIT

---
**FORGE generates code, not excuses.** 🔗 [GitHub](https://github.com/forge-protocol/forge)
