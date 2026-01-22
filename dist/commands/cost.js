"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.costCommand = costCommand;
const fs_1 = require("fs");
async function costCommand() {
    console.log('💰 FORGE Cost Calculator\n');
    try {
        if (!(0, fs_1.existsSync)('Anchor.toml')) {
            console.error('❌ Not in an Anchor project directory');
            process.exit(1);
        }
        const programId = getProgramId();
        console.log('📊 Deployment Costs:\n');
        console.log('💾 Program Deployment:');
        console.log('   • Rent (program account): ~2.5 SOL');
        console.log('   • Transaction fee: ~0.000005 SOL');
        console.log('   • Total: ~2.5 SOL');
        console.log('\n⚡ Per-Transaction Costs:');
        console.log('   • Basic instruction: ~0.000005 SOL');
        console.log('   • Token transfer: ~0.00001 SOL');
        console.log('   • Account creation: ~0.002 SOL (rent)');
        console.log('   • PDA creation: ~0.002 SOL (rent)');
        console.log('\n📈 Monthly Estimates (1000 transactions/day):');
        console.log('   • Transaction fees: ~0.15 SOL/month');
        console.log('   • Account creation (10/day): ~6 SOL/month');
        console.log('   • Total: ~6.15 SOL/month');
        console.log('\n💡 Cost Optimization Tips:');
        console.log('   • Reuse accounts when possible');
        console.log('   • Use PDAs instead of creating new accounts');
        console.log('   • Batch operations to reduce transaction count');
        console.log('   • Close unused accounts to reclaim rent');
        if (programId) {
            console.log(`\n🔗 Check current rent: https://explorer.solana.com/address/${programId}`);
        }
    }
    catch (error) {
        console.error('❌ Cost calculation failed');
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
//# sourceMappingURL=cost.js.map