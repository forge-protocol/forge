# FORGE Command Reference

This guide provides detailed information on all available FORGE commands.

## Core Commands

### `forge init <projectName>`
Initialize a new FORGE project.
- `-i, --intent <intent>`: Describe what the program should do (enables CPI generation).
- `-a, --anchor-version <version>`: Specify Anchor version (default: 0.32.1).
- `-t, --template <template>`: Use a program template (token-program, nft-marketplace, etc.).

### `forge interactive`
Launch the interactive setup wizard for guided project creation.

### `forge list-templates`
List all available program templates currently supported by FORGE.

---

## Development & Safety

### `forge harden`
Apply security best-practices and `forge-runtime` safeguards to your project.
- Enforces strict Anchor linting.
- Injects safety macros.
- Generates project-specific `security.rs`.

### `forge simulate [instructionName]`
Simulate a program instruction to preview logs and compute unit usage without spending SOL.

### `forge audit [--deep]`
Run security audit on Anchor program.
- `--deep`: Run deep security analysis with advanced checks.

### `forge test`
Generate and run a comprehensive test suite for your program.

### `forge quality`
Analyze code complexity and maintainability metrics.

### `forge profile`
Analyze program performance and compute unit usage.

---

## Deployment & Verification

### `forge deploy [--env <environment>]`
Deploy program to Solana.
- Environments: `localnet`, `devnet` (default), `mainnet-beta`.

### `forge verify`
Verify contract source code and metadata on Solana Explorer.

---

## Utilities

### `forge generate-sdk [outputDir] [--v2]`
Generate a TypeScript SDK from your Anchor program.
- `--v2`: Generate modern functional Web3.js v2 SDK.

### `forge status`
Check FORGE environment, version compatibility, and network settings.

### `forge update`
Update FORGE to the latest version via npm.

### `forge docs`
Generate API documentation directly from your program IDL.

### `forge keypair <action>`
Manage keypairs (`generate`, `import`, `info`).

### `forge network <action>`
Manage Solana network connections (`switch`, `status`, `test`).

---

## 🤖 Agentic Platform (KYA)

### `forge agent <action>`
Manage agentic capabilities and "Know Your Agent" (KYA) compliance.
- `analyze`: Analyze program for agentic capabilities and security.
- `manifest`: Generate KYA manifest for the agent.
- `brain`: Synthesize a "Knowledge Hub" (Markdown + Mermaid) for AI agents.
- `harden`: Apply specialized security guards for autonomous execution.
- `simulate`: Run a dry-run of agentic execution patterns.
- `link`: Generate a Neural Link (LLM context) for the program.
- `pulse`: Launch the Agent Pulse HUD for real-time monitoring.
- `doctor`: Run environment diagnostics for agentic operations.
- `policy`: Generate a safety boundary policy for autonomous agents.
