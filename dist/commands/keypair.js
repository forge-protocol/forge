"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keypairCommand = keypairCommand;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path_1 = require("path");
async function keypairCommand(action, outputPath) {
    console.log('🔑 FORGE Keypair Management\n');
    try {
        if (action === 'generate' || !action) {
            const path = outputPath || 'keypair.json';
            console.log(`Generating new keypair: ${path}...`);
            (0, child_process_1.execSync)(`solana-keygen new --outfile ${path} --no-bip39-passphrase`, { stdio: 'inherit' });
            console.log(`\n✅ Keypair generated: ${path}`);
            console.log('⚠️  Keep this file secure! Never commit it to version control.');
        }
        else if (action === 'import') {
            if (!outputPath) {
                console.error('❌ Please provide path to keypair file');
                process.exit(1);
            }
            if (!(0, fs_1.existsSync)(outputPath)) {
                console.error(`❌ Keypair file not found: ${outputPath}`);
                process.exit(1);
            }
            console.log(`✅ Keypair imported from: ${outputPath}`);
            const pubkey = (0, child_process_1.execSync)(`solana-keygen pubkey ${outputPath}`, { encoding: 'utf8' }).trim();
            console.log(`   Public key: ${pubkey}`);
        }
        else if (action === 'info') {
            const defaultKeypair = (0, path_1.join)(process.env.HOME || '~', '.config', 'solana', 'id.json');
            if ((0, fs_1.existsSync)(defaultKeypair)) {
                const pubkey = (0, child_process_1.execSync)(`solana-keygen pubkey ${defaultKeypair}`, { encoding: 'utf8' }).trim();
                console.log(`Default keypair: ${defaultKeypair}`);
                console.log(`Public key: ${pubkey}`);
            }
            else {
                console.log('No default keypair found.');
                console.log('Generate one with: forge keypair generate');
            }
        }
        else {
            console.error(`❌ Unknown action: ${action}`);
            console.error('Available actions: generate, import, info');
            process.exit(1);
        }
    }
    catch (error) {
        console.error('❌ Keypair operation failed');
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}
//# sourceMappingURL=keypair.js.map