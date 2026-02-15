# FORGE

![npm](https://img.shields.io/npm/v/forge-solana-sdk)
![npm](https://img.shields.io/npm/dm/forge-solana-sdk)
![License](https://img.shields.io/npm/l/forge-solana-sdk)

**Intent-driven Solana program assembly.** Generate production-ready Anchor programs from natural language. Modern CPI helpers included.

> ⚡ **FORGE generates code, not excuses.**

## ⚡ Install

```bash
npm install -g forge-solana-sdk
```

## 🚀 Usage

### Initialize a project
```bash
# Basic project
forge init my-project

# With intent-driven CPI generation
forge init my-project --intent "transfer 100 tokens safely"

# With program template
forge init my-token --template token-program

# With specific Anchor version
forge init my-project --anchor-version 0.31.0

# Interactive setup wizard
forge interactive

# List available templates
forge list-templates

cd my-project
```

### Check status
```bash
forge status
```

Enhanced status checks include:
- ✅ Version compatibility warnings
- ✅ Rust edition 2024 requirements
- ✅ Anchor CLI vs project version matching
- ✅ Network configuration

### Generate TypeScript SDK
```bash
forge generate-sdk

# Or specify custom output directory
forge generate-sdk ./my-sdk

# Generate modern Web3.js v2 SDK (functional, piped API)
forge generate-sdk --v2
```

### Deploy to Solana
```bash
# Deploy to devnet (default)
forge deploy

# Deploy to specific environment
forge deploy --env devnet
forge deploy --env mainnet-beta

# Deploy to local validator
forge deploy --env localnet
```

**Environment Support:**
- ✅ **devnet**: Development network (default)
- ✅ **mainnet-beta**: Production network with safety checks
- ✅ **localnet**: Local Solana validator
- ✅ Auto-updates Anchor.toml with environment RPC URLs
- ✅ Mainnet deployment requires explicit confirmation

### Security Hardening
```bash
forge harden
```

**Safeguards include:**
- 🛡️ **Macro Integration**: Injects `require_signer!`, `assert_owned_by!`, and `checked_math!`
- 📋 **Config Hardening**: Enforces strict Anchor linting and PDA safety in `Anchor.toml`
- 🔒 **Security Modules**: Generates a local `security.rs` for project-specific rules
- 📦 **Runtime Safety**: Automatically adds `forge-runtime` to program dependencies

### Security Audit
```bash
forge audit
```

**Comprehensive Security Checks:**
- 🔍 **Critical Issues**: Missing ownership validation, unsafe code
- ⚠️ **High Priority**: Improper PDA derivation, missing constraints
- 📊 **Performance**: Expensive operations, large account data
- 🛡️ **Access Control**: Signer constraints, PDA bumps
- 📋 **Configuration**: Wallet paths, cluster settings

### Testing Framework
```bash
forge test
```

**Automated Test Generation:**
- 🧪 **Comprehensive Coverage**: Program initialization, all instructions, edge cases
- 🔐 **Security Testing**: Access control validation, error condition handling
- 💰 **Token Operations**: SPL token transfer, mint, burn functionality
- 🎯 **PDA Validation**: Proper derived address generation and validation
- ⚡ **Performance Tests**: Gas usage analysis, large data handling

**Generated Test Suite Includes:**
- ✅ Program initialization and IDL validation
- ✅ All instruction handlers with sensible defaults
- ✅ Token program integration tests
- ✅ PDA derivation correctness
- ✅ Error condition testing
- ✅ Access control enforcement

### Contract Verification
```bash
forge verify
```

**Source Code Transparency:**
- 📤 **Solana Explorer Upload**: Source code and IDL verification
- 🔍 **Trust Building**: Prove deployed code matches published source
- 🏷️ **Metadata Publishing**: Program name, version, description, repository
- 🔗 **Explorer Links**: Direct links to verified contract pages

**Verification Process:**
- ✅ Build program and generate IDL
- ✅ Collect all source files and metadata
- ✅ Prepare verification bundle
- ✅ Generate Solana Explorer verification links
- ✅ Save local verification record

### Program Templates
```bash
# List all available templates
forge list-templates

# Create project from template
forge init my-token --template token-program
forge init my-nft --template nft-marketplace
forge init my-dao --template dao-governance
```

**Available Templates:**
- 🪙 **token-program**: Complete SPL token with mint/transfer/burn
- 🖼️ **nft-marketplace**: NFT marketplace with royalties
- 🗳️ **dao-governance**: DAO with proposals and voting
- 💎 **staking-rewards**: Token staking with rewards
- 🔄 **escrow-swap**: Trustless token swap
- ⏰ **token-vesting**: Time-based vesting schedules
- 🚀 **moonshot-fair-launch**: Moonshot-compatible bonding curve
- 💊 **pumpfun-launch**: Standard Pump.fun meme token

### Program Upgrade & Migration
```bash
# Upgrade to latest Anchor version
forge upgrade

# Upgrade to specific version
forge upgrade 0.32.1

# Migration assistant (with additional checks)
forge migrate 0.32.1
```

### Performance Analysis
```bash
forge profile
```

**Performance Insights:**
- ⚡ Compute unit usage analysis
- 💰 Cost estimation per transaction
- 🎯 Optimization suggestions
- 📊 Gas usage reports

### Program Monitoring
```bash
forge monitor
```

**Monitoring Features:**
- 📈 Real-time transaction volume
- 🔍 Error rate tracking
- 👥 Active user analytics
- 📊 Account growth metrics

### Interactive Setup
```bash
forge interactive
```

**Guided Wizard:**
- 📦 Project name selection
- 📚 Template selection
- 💡 Intent-driven generation
- 🔧 Anchor version configuration

### Documentation Generation
```bash
forge docs
```

**Auto-Generated Docs:**
- 📖 API documentation from IDL
- 📋 Instruction reference
- 🏗️ Account structure docs
- 🔗 Integration examples

### Code Quality Analysis
```bash
forge quality
```

**Quality Metrics:**
- 📊 Code complexity scoring
- 📏 Function/struct counts
- ✅ Maintainability assessment
- 💡 Refactoring recommendations

### Cost Calculator
```bash
forge cost
```

**Cost Analysis:**
- 💾 Deployment costs (~2.5 SOL)
- ⚡ Per-transaction fees
- 📈 Monthly operation estimates
- 💡 Optimization tips

### Keypair Management
```bash
# Generate new keypair
forge keypair generate

# Generate to specific path
forge keypair generate ./my-keypair.json

# Import keypair
forge keypair import ./keypair.json

# Show keypair info
forge keypair info
```

### Network Management
```bash
# Switch network
forge network switch devnet
forge network switch mainnet-beta

# Check network status
forge network status

# Test RPC connection
forge network test
```

### Program Search
```bash
# Search for programs
forge search token program
forge search nft marketplace
```

### Analytics Dashboard
```bash
forge analytics
```

**Analytics Links:**
- 🔗 Solana Explorer integration
- 📊 Transaction volume tracking
- 📈 User activity metrics

### CI/CD Integration
```bash
# Generate GitHub Actions workflow
forge ci github
```

**Generated Workflow:**
- ✅ Auto-test on push/PR
- ✅ Security audit checks
- ✅ Code quality validation
- ✅ Auto-deploy to devnet

### Update FORGE
```bash
forge update
```

**Smart Update System:**
- ✅ Checks current vs latest version
- ✅ Auto-updates via npm when needed
- ✅ Shows clear progress feedback
- ✅ No manual version management required

## 📋 Prerequisites

- **Node.js** 18+
- **Rust** 1.85.0+ (required for edition 2024 compatibility)
- **Solana CLI** (latest)
- **Anchor CLI** 0.29.0+

⚠️ **Important**: Rust 1.85.0+ is required for modern Anchor dependencies. Update with: `rustup update stable`

## 🎯 What FORGE Does

FORGE transforms natural language intents into production-ready Solana programs. Modern, safe, and future-proof code generation.

### Core Features
- ✅ **Intent-Driven Generation**: `"transfer 100 tokens safely"` → Modern CPI code
- ✅ **Program Templates Library**: 6 battle-tested templates (Token, NFT, DAO, Staking, Escrow, Vesting)
- ✅ **Automated Testing Framework**: Comprehensive test suites with security validation
- ✅ **Contract Verification**: Source code transparency on Solana Explorer
- ✅ **Multi-Environment Deployment**: Deploy to devnet/mainnet/localnet with safety checks
- ✅ **Security Audit Tools**: Automated security analysis (--deep for advanced checks)
- ✅ **Program Upgrade System**: Version management and migration assistance
- ✅ **Performance Profiler**: Compute unit analysis and optimization suggestions
- ✅ **Program Monitoring**: Real-time analytics and activity tracking
- ✅ **Interactive CLI**: Guided project setup wizard
- ✅ **Documentation Generator**: Auto-generate API docs from IDL
- ✅ **Code Quality Metrics**: Complexity analysis and maintainability scoring
- ✅ **Cost Calculator**: Deployment and operation cost estimation
- ✅ **Keypair Management**: Secure keypair generation and import utilities
- ✅ **Network Utilities**: Switch between networks, test connections
- ✅ **Program Search**: Find verified programs and best practices
- ✅ **CI/CD Integration**: GitHub Actions workflow generation
- ✅ **Fair-Launch Support**: Integrated Moonshot & Pump.fun launching
- ✅ **Security Hardening**: Auto-inject safeguards with `forge harden`
- ✅ **Complete Anchor Workspace**: Ready-to-build projects with proper structure
- ✅ **Client SDK Generation**: Auto-generated Legacy & **Web3.js v2** SDKs
- ✅ **Modern CPI Helpers**: `transfer_checked`, `mint_to`, PDA signers with `ctx.bumps`
- ✅ **Version Compatibility**: Auto-aligns Anchor versions (CLI vs project)
- ✅ **Production Ready**: IDL features, proper dependencies, deployment configs

### Generated Code Quality
- 🔒 **Safe Operations**: Uses `anchor_spl::token_interface` for Token & Token-2022
- 🎯 **Modern Patterns**: `InterfaceAccount`, `Interface` types (Anchor 0.31+ compatible)
- ⚡ **Optimized**: Minimal boilerplate, maximum functionality
- 🚀 **Future-Proof**: Edition 2024 compatible, latest Anchor best practices

### Supported CPI Intents
- 💸 **Token Transfers**: `"transfer 100 tokens safely"` → `transfer_checked`
- 🪙 **Token Minting**: `"mint 500 tokens to user"` → `mint_to` with PDA authority
- 🎫 **ATA Creation**: `"create associated token account"` → `create_associated_token_account`
- 📊 **Token Metadata**: `"create metadata for token"` → MPL Token Metadata CPIs

**Example Generated Code:**
```rust
// From: forge init --intent "transfer 100 tokens safely"
token_interface::transfer_checked(
    CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        TransferChecked {
            from: ctx.accounts.from.to_account_info(),
            to: ctx.accounts.to.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
        },
    ),
    100, // amount
    decimals, // automatic decimals lookup
)?;
```

**Client SDK Generated:**
```typescript
// Auto-generated TypeScript client
const client = new TokenTransferClient(connection, wallet);
await client.transferTokens(amount, from, to, mint, authority);
```

## 🚀 SDK Generation

FORGE can automatically generate production-ready TypeScript SDKs from your Anchor programs. The generated SDK includes:

- **Type-Safe Client**: Full TypeScript client with proper types for all instructions and accounts
- **PDA Helpers**: Utility functions to find program-derived addresses
- **Package Template**: Ready-to-publish npm package with proper dependencies
- **Modern Standards**: Uses latest Anchor patterns and best practices
- **Web3.js v2 Support**: Functional, piped API for better performance and tree-shaking

### SDK Styles
- **Legacy (default)**: Anchor-based class-based client
- **Web3.js v2 (`--v2`)**: Functional client using the latest Solana standards

### SDK Features

- ✅ **Zero-config generation** from Anchor IDL
- ✅ **Type-safe method calls** with full IntelliSense
- ✅ **PDA finder utilities** for program addresses
- ✅ **Production-ready package** structure
- ✅ **Anchor integration** with latest patterns

### Generated SDK Structure

```
my-program-sdk/
├── package.json      # Ready-to-publish npm package
├── types.ts          # Auto-generated TypeScript types
├── client.ts         # Program interaction client
├── pdas.ts           # PDA finder utilities
├── index.ts          # Main exports
└── tsconfig.json     # TypeScript configuration
```

### Using Generated SDKs

```typescript
import { MyProgramClient } from 'my-program-sdk';
import { Connection, Keypair } from '@solana/web3.js';

// Initialize client
const connection = new Connection('https://api.mainnet-beta.solana.com');
const client = new MyProgramClient(connection);

// Call program methods with full type safety
const txId = await client.myInstruction({
  accounts: {
    user: userPublicKey,
    // ... other accounts
  },
  args: {
    amount: 1000,
    // ... other args
  }
});
```

## 🛠️ Troubleshooting

### Version Compatibility Issues
If you encounter build errors:

1. **Update Rust**: `rustup update stable` (requires 1.85.0+)
2. **Check versions**: `forge status` (shows mismatches)
3. **Specify version**: `forge init --anchor-version 0.32.1`

### Common Errors
- `edition2024` errors → Update Rust to 1.85.0+
- Version mismatches → Use `forge status` to check alignment
- Build failures → Ensure Anchor CLI matches project versions

## 🚫 What FORGE Does NOT Do

FORGE does not:
- Host your code
- Manage your keys
- Abstract blockchain risks
- Hold your hand

If you want magic, look elsewhere.

## 📚 Requirements

You must have:
- Basic Rust knowledge
- Understanding of Solana concepts
- Your own wallet and keys
- Test SOL for deployment

## 🔧 Commands

| Command | Description |
|---------|-------------|
| `forge init <name>` | Create new Anchor project with optional intent |
| `forge init <name> --intent "transfer tokens"` | Generate CPI code from natural language |
| `forge init <name> --anchor-version 0.31.0` | Specify Anchor version for project |
| `forge generate-sdk [dir]` | Generate TypeScript SDK from Anchor program |
| `forge status` | Check environment, versions, and compatibility |
| `forge update` | Update FORGE to latest version |
| `forge deploy` | Deploy program to Solana network |
| `forge harden` | Apply security safeguards to your project |

## 📖 Examples

### Basic Project Creation
```bash
# Simple Anchor project
forge init my-project
cd my-project
forge status
```

### Intent-Driven CPI Generation
```bash
# Generate token transfer program
forge init token-transfer --intent "transfer 100 tokens safely"
cd token-transfer

# Modern CPI code is automatically generated:
# - transfer_checked with decimals validation
# - InterfaceAccount<TokenAccount> types
# - Proper error handling

anchor build  # ✅ Works immediately
anchor test   # ✅ Ready for testing
```

### Client SDK Generation
```bash
# Generate program with auto-generated TypeScript SDK
forge init token-transfer --intent "transfer tokens safely"

# Project structure includes:
# ├── programs/token-transfer/src/lib.rs  # Anchor program
# └── client/                             # Auto-generated SDK
#     ├── index.ts                        # Client class
#     ├── idl.ts                          # Program IDL
#     ├── package.json                    # SDK package
#     └── tsconfig.json                   # TypeScript config

# Build and use the SDK
cd client && npm install && npm run build

# Use in your frontend/dApp:
import { TokenTransferClient } from './client';
const client = new TokenTransferClient(connection, wallet);
await client.transferTokens(amount, from, to, mint, authority);
```

### SDK Generation
```bash
# Generate SDK after building your program
cd my-project
anchor build
forge generate-sdk

# SDK appears in ./sdk/ directory
cd sdk
npm install
npm run build

# Publish your SDK
npm publish
```

### Advanced Usage
```bash
# Mint tokens with PDA authority
forge init token-minter --intent "mint 500 tokens to user"

# Custom Anchor version
forge init legacy-project --anchor-version 0.30.1

# Stay updated
forge update
```

## 🏗️ Architecture

```
FORGE Ecosystem
├── forge-solana-sdk (npm) - Node.js CLI tool
│   ├── Intent parsing & code generation
│   ├── Version compatibility management
│   ├── Project scaffolding
│   └── Deployment orchestration
│
└── forge-runtime (crates.io) - Rust runtime library
    └── Future: Enhanced runtime capabilities
```

**Current Focus**: CLI-first approach with intent-driven generation. Runtime library for future enhancements.

## 🐛 Support

**FORGE is infrastructure, not a tutorial.** If you need help:

### Getting Help
1. **Run diagnostics first**: `forge status` (includes version compatibility checks)
2. **Check prerequisites**: Ensure Rust 1.85.0+, Node 18+, Anchor CLI installed
3. **File an issue**: Include `forge status` output and error details
4. **Describe expected vs actual**: What did you expect? What happened instead?

### Before Asking
- ✅ Have you run `forge status`?
- ✅ Is your Rust version 1.85.0+?
- ✅ Are you in an Anchor project directory?
- ✅ Have you tried `forge update`?

**If you don't understand Solana concepts, learn Solana first.** FORGE assumes basic blockchain knowledge.

## 📄 License

MIT - [https://github.com/forge-protocol/forge/blob/main/LICENSE](https://github.com/forge-protocol/forge/blob/main/LICENSE)

## 🔗 Links

- **Homepage**: [https://github.com/forge-protocol/forge](https://github.com/forge-protocol/forge)
- **NPM Package**: [https://www.npmjs.com/package/forge-solana-sdk](https://www.npmjs.com/package/forge-solana-sdk)
- **Issues**: [https://github.com/forge-protocol/forge/issues](https://github.com/forge-protocol/forge/issues)

---

**FORGE: Intent → Code. No magic, just infrastructure.** ⚡
