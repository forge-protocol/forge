# FORGE SDK

![npm](https://img.shields.io/npm/v/forge-solana-sdk)
![npm](https://img.shields.io/npm/dm/forge-solana-sdk)
![License](https://img.shields.io/npm/l/forge-solana-sdk)

Intent-driven app assembly on Solana. Infrastructure that survives.

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

# With specific Anchor version
forge init my-project --anchor-version 0.31.0

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

### Deploy to Solana
```bash
forge deploy
```

## 📋 Prerequisites

- **Node.js** 18+
- **Rust** 1.85.0+ (required for edition 2024 compatibility)
- **Solana CLI** (latest)
- **Anchor CLI** 0.29.0+

⚠️ **Important**: Rust 1.85.0+ is required for modern Anchor dependencies. Update with: `rustup update stable`

## 🎯 What FORGE Does

FORGE generates production-ready Anchor programs from intent. It creates the boilerplate so you focus on business logic.

- ✅ Generates complete Anchor workspace
- ✅ Creates Cargo.toml with proper dependencies
- ✅ Sets up lib.rs with Anchor framework
- ✅ Configures Anchor.toml for deployment
- ✅ Works with real Solana networks

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
| `forge init <name>` | Create new Anchor project |
| `forge status` | Check environment and tools |
| `forge deploy` | Deploy program to Solana |

## 📖 Examples

```bash
# Create a token program
forge init my-token

# Check everything is ready
forge status

# Deploy to devnet
forge deploy
```

## 🏗️ Architecture

```
FORGE CLI (npm)
├── forge-sdk-solana - Node.js CLI tool
└── forge-runtime - Rust runtime (crates.io)

Both work together for complete Solana development
```

## 🐛 Support

This is infrastructure. If it breaks:
1. File an issue on GitHub
2. Include your `forge status` output
3. Describe what you expected vs what happened

If you don't understand Solana, learn Solana first.

## 📄 License

MIT - [https://github.com/forge-protocol/forge/blob/main/LICENSE](https://github.com/forge-protocol/forge/blob/main/LICENSE)

## 🔗 Links

- **Homepage**: [https://github.com/forge-protocol/forge](https://github.com/forge-protocol/forge)
- **NPM Package**: [https://www.npmjs.com/package/forge-solana-sdk](https://www.npmjs.com/package/forge-solana-sdk)
- **Issues**: [https://github.com/forge-protocol/forge/issues](https://github.com/forge-protocol/forge/issues)

---

**FORGE: Infrastructure, not cosplay.** ⚡
