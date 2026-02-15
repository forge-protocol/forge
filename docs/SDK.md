# FORGE SDK Generation

FORGE can automatically generate production-ready TypeScript SDKs from your Anchor programs.

## SDK Styles

### 1. Legacy (Default)
Anchor-based class-based client. Familiar for developers coming from Anchor.
```bash
forge generate-sdk
```

### 2. Web3.js v2 (`--v2`)
Functional, piped API using the latest Solana 2.0 standards.
- Optimized for tree-shaking and performance.
- Modern functional RPC helpers.
```bash
forge generate-sdk --v2
```

## Features
- ✅ **Zero-config generation** from Anchor IDL.
- ✅ **Type-safe method calls** with full IntelliSense.
- ✅ **PDA finder utilities** for program addresses.
- ✅ **Production-ready package** structure.

## Structure
The generated SDK includes its own `package.json` and `tsconfig.json`, making it ready to be published as a private or public npm package.

```text
my-program-sdk/
├── package.json      # Ready-to-publish npm package
├── src/
│   ├── types.ts          # Auto-generated TypeScript types
│   ├── client.ts         # Program interaction client
│   └── pdas.ts           # PDA finder utilities
└── tsconfig.json     # TypeScript configuration
```
