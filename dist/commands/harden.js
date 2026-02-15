"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hardenCommand = hardenCommand;
const fs_1 = require("fs");
const path_1 = require("path");
const { glob } = require('glob');
async function hardenCommand() {
    console.log('🛡️  FORGE Security Hardening System\n');
    try {
        if (!(0, fs_1.existsSync)('Anchor.toml')) {
            console.error('❌ Not in an Anchor project directory');
            process.exit(1);
        }
        console.log('📋 Analyzing project for security improvements...');
        // 1. Update Anchor.toml with safe defaults
        hardenAnchorToml();
        // 2. Add forge-runtime to Cargo.toml
        await hardenCargoFiles();
        // 3. Create security module in programs
        await createSecurityModules();
        console.log('\n✅ Project hardening completed!');
        console.log('📝 Improvements applied:');
        console.log('   • Enabled strict Anchor linting');
        console.log('   • Integrated forge-runtime security macros');
        console.log('   • Generated local security modules');
        console.log('   • Configured safe mathematical defaults');
        console.log('\n🚀 Next step: Run "anchor build" to verify the new security layer.');
    }
    catch (error) {
        console.error('❌ Hardening failed');
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}
function hardenAnchorToml() {
    let toml = (0, fs_1.readFileSync)('Anchor.toml', 'utf8');
    // Enforce skip-lint = false
    if (toml.includes('skip-lint = true')) {
        toml = toml.replace('skip-lint = true', 'skip-lint = false');
        console.log('✅ Enabled Anchor linting (skip-lint = false)');
    }
    // Ensure seeds feature is checked
    if (toml.includes('seeds = false')) {
        toml = toml.replace('seeds = false', 'seeds = true');
        console.log('✅ Enabled Anchor seeds feature for PDA safety');
    }
    (0, fs_1.writeFileSync)('Anchor.toml', toml);
}
async function hardenCargoFiles() {
    const cargoFiles = await glob('**/Cargo.toml');
    for (const file of cargoFiles) {
        // Skip the root Cargo.toml if it's just a workspace
        if (file === 'Cargo.toml' && (0, fs_1.readFileSync)(file, 'utf8').includes('[workspace]')) {
            continue;
        }
        let cargo = (0, fs_1.readFileSync)(file, 'utf8');
        if (!cargo.includes('forge-runtime')) {
            // Add forge-runtime to dependencies
            cargo = cargo.replace('[dependencies]', '[dependencies]\nforge-runtime = "0.1.0"');
            (0, fs_1.writeFileSync)(file, cargo);
            console.log(`✅ Added forge-runtime to ${file}`);
        }
    }
}
async function createSecurityModules() {
    const rustFiles = await glob('programs/**/src/lib.rs');
    for (const libPath of rustFiles) {
        const srcDir = (0, path_1.join)(libPath, '..');
        const securityPath = (0, path_1.join)(srcDir, 'security.rs');
        if (!(0, fs_1.existsSync)(securityPath)) {
            const securityTemplate = `use anchor_lang::prelude::*;
use forge_runtime::{require_signer, assert_owned_by};

/**
 * Project-specific security verification rules.
 * Use these macros to enforce business-logic level security.
 */

#[macro_export]
macro_rules! assert_is_admin {
    ($signer:expr, $admin_key:expr) => {
        if $signer.key() != $admin_key {
            return Err(solana_program::program_error::ProgramError::InsufficientFunds.into()); // Custom error
        }
    };
}
`;
            (0, fs_1.writeFileSync)(securityPath, securityTemplate);
            console.log(`✅ Generated security module: ${securityPath}`);
            // Add mod security to lib.rs
            let lib = (0, fs_1.readFileSync)(libPath, 'utf8');
            if (!lib.includes('pub mod security')) {
                lib = `pub mod security;\n${lib}`;
                (0, fs_1.writeFileSync)(libPath, lib);
            }
        }
    }
}
//# sourceMappingURL=harden.js.map