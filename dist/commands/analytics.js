"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsCommand = analyticsCommand;
const fs_1 = require("fs");
async function analyticsCommand() {
    console.log('📊 FORGE Program Analytics\n');
    try {
        if (!(0, fs_1.existsSync)('Anchor.toml')) {
            console.error('❌ Not in an Anchor project directory');
            process.exit(1);
        }
        const programId = getProgramId();
        if (!programId) {
            console.error('❌ Could not find program ID');
            process.exit(1);
        }
        console.log(`📈 Analytics for: ${programId}\n`);
        console.log('🔗 Analytics Dashboard:');
        console.log(`   Solana Explorer: https://explorer.solana.com/address/${programId}`);
        console.log(`   Solscan: https://solscan.io/account/${programId}`);
        console.log(`   Helius: https://helius.dev (requires API key)`);
        console.log('\n📊 Available Metrics:');
        console.log('   • Transaction volume');
        console.log('   • Unique users');
        console.log('   • Error rate');
        console.log('   • Compute unit usage');
        console.log('   • Account growth');
        console.log('\n💡 Integration Options:');
        console.log('   1. Use Solana Explorer for basic metrics');
        console.log('   2. Integrate Helius API for advanced analytics');
        console.log('   3. Use QuickNode for real-time monitoring');
        console.log('   4. Build custom dashboard with RPC calls');
    }
    catch (error) {
        console.error('❌ Analytics setup failed');
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}
function getProgramId() {
    try {
        const { readFileSync } = require('fs');
        const anchorToml = readFileSync('Anchor.toml', 'utf8');
        const match = anchorToml.match(/\[programs\.localnet\]\s*([^=]+)\s*=\s*"([^"]+)"/);
        return match ? match[2] : null;
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=analytics.js.map