"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCommand = initCommand;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path_1 = require("path");
const ascii_js_1 = require("../ascii.js");
const cpi_js_1 = require("../cpi.js");
async function initCommand(projectName, intent) {
    console.log(ascii_js_1.logo);
    console.log('FORGE - Solana Development Platform\n');
    const name = projectName || 'forge-project';
    // Detect CPI patterns from intent
    let cpiCode = null;
    if (intent) {
        console.log(`Analyzing intent: "${intent}"`);
        const detections = (0, cpi_js_1.detectCPI)(intent);
        if (detections.length > 0) {
            console.log(`Detected CPI patterns: ${detections.map(d => d.type).join(', ')}`);
            cpiCode = (0, cpi_js_1.generateCPICode)(detections);
        }
    }
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
    // Create Anchor.toml with compatible version
    const anchorToml = `[toolchain]
anchor_version = "0.30.1"

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
    // Create Cargo.toml with compatible Anchor ecosystem versions
    let dependencies = `anchor-lang = "0.30.1"
anchor-spl = "0.30.1"`;
    // Add CPI-specific dependencies
    if (cpiCode) {
        if (cpiCode.imports.some(imp => imp.includes('mpl_token_metadata'))) {
            dependencies += `
mpl-token-metadata = { version = "5", features = ["no-entrypoint"] }`;
        }
    }
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
idl-build = ["anchor-lang/idl-build", "anchor-spl/idl-build"]
default = []

[dependencies]
${dependencies}
`;
    // Generate imports and CPI code
    let imports = `use anchor_lang::prelude::*;`;
    let cpiImports = '';
    let cpiCodeBlock = '';
    let extraAccounts = '';
    if (cpiCode) {
        cpiImports = '\n' + cpiCode.imports.join('\n');
        cpiCodeBlock = `\n\n    ${cpiCode.code}`;
        extraAccounts = '\n' + cpiCode.accounts.accounts.map(acc => `    ${acc},`).join('\n');
    }
    // Create lib.rs with CPI support
    const libRs = `${imports}${cpiImports}

declare_id!("${programId}");

#[program]
pub mod ${name.replace(/-/g, '_')} {
    use super::*;

    pub fn process_intent(ctx: Context<ProcessIntent>) -> Result<()> {
        msg!("Processing intent...");${cpiCodeBlock}

        msg!("Intent processed successfully!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct ProcessIntent {${extraAccounts}
}
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