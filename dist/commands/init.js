"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCommand = initCommand;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path_1 = require("path");
const ascii_js_1 = require("../ascii.js");
async function initCommand(projectName) {
    console.log(ascii_js_1.logo);
    console.log('FORGE - Solana Development Platform\n');
    const name = projectName || 'forge-project';
    // Check if Anchor is installed
    try {
        (0, child_process_1.execSync)('anchor --version', { stdio: 'pipe' });
    }
    catch (error) {
        console.error('❌ Anchor CLI not found. Install with:');
        console.error('cargo install --git https://github.com/coral-xyz/anchor anchor-cli --tag v0.29.0');
        process.exit(1);
    }
    console.log(`Initializing ${name}...\n`);
    // Create project directory
    const projectPath = (0, path_1.join)(process.cwd(), name);
    if ((0, fs_1.existsSync)(projectPath)) {
        console.error(`❌ Directory ${name} already exists`);
        process.exit(1);
    }
    (0, fs_1.mkdirSync)(projectPath, { recursive: true });
    (0, fs_1.mkdirSync)((0, path_1.join)(projectPath, 'programs', name, 'src'), { recursive: true });
    // Generate program ID (simplified for demo)
    const programId = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS";
    // Create Anchor.toml
    const anchorToml = `[toolchain]
anchor_version = "0.29.0"

[features]
seeds = false
skip-lint = false

[programs.localnet]
${name} = "${programId}"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "Localnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
`;
    // Create Cargo.toml
    const cargoToml = `[package]
name = "${name}"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]
name = "${name.replace(/-/g, '_')}"

[features]
no-entrypoint = []
no-idl = []
no-log-ix-name = []
cpi = ["no-entrypoint"]
default = []

[dependencies]
anchor-lang = "0.29.0"
anchor-spl = "0.29.0"
`;
    // Create lib.rs
    const libRs = `use anchor_lang::prelude::*;

declare_id!("${programId}");

#[program]
pub mod ${name.replace(/-/g, '_')} {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Program initialized!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
`;
    // Write files
    (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'Anchor.toml'), anchorToml);
    (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'programs', name, 'Cargo.toml'), cargoToml);
    (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'programs', name, 'src', 'lib.rs'), libRs);
    console.log('✅ Project created successfully!');
    console.log(`\nNext steps:`);
    console.log(`  cd ${name}`);
    console.log(`  anchor build`);
    console.log(`  anchor test`);
}
//# sourceMappingURL=init.js.map