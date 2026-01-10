"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusCommand = statusCommand;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path_1 = require("path");
async function statusCommand() {
    console.log('FORGE Status\n');
    // Check Anchor
    try {
        const anchorVersion = (0, child_process_1.execSync)('anchor --version', { encoding: 'utf8' }).trim();
        console.log(`✅ Anchor CLI: ${anchorVersion}`);
    }
    catch (error) {
        console.log('❌ Anchor CLI: Not found');
    }
    // Check Solana CLI
    try {
        const solanaVersion = (0, child_process_1.execSync)('solana --version', { encoding: 'utf8' }).trim().split('\n')[0];
        console.log(`✅ Solana CLI: ${solanaVersion}`);
    }
    catch (error) {
        console.log('❌ Solana CLI: Not found');
    }
    // Check Rust
    try {
        const rustVersion = (0, child_process_1.execSync)('rustc --version', { encoding: 'utf8' }).trim().split(' ')[1];
        console.log(`✅ Rust: ${rustVersion}`);
    }
    catch (error) {
        console.log('❌ Rust: Not found');
    }
    // Check if in project
    const anchorToml = (0, path_1.join)(process.cwd(), 'Anchor.toml');
    if ((0, fs_1.existsSync)(anchorToml)) {
        console.log('✅ In Anchor project');
        try {
            const config = (0, fs_1.readFileSync)(anchorToml, 'utf8');
            const network = config.includes('devnet') ? 'devnet' : 'localnet';
            console.log(`📡 Network: ${network}`);
        }
        catch (error) {
            console.log('📡 Network: Unknown');
        }
    }
    else {
        console.log('❌ Not in Anchor project');
    }
    console.log('\nReady to build on Solana.');
}
//# sourceMappingURL=status.js.map