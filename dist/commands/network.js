"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.networkCommand = networkCommand;
const child_process_1 = require("child_process");
async function networkCommand(action, network) {
    console.log('🌐 FORGE Network Management\n');
    try {
        if (action === 'switch' || !action) {
            const targetNetwork = network || 'devnet';
            const validNetworks = ['localnet', 'devnet', 'mainnet-beta'];
            if (!validNetworks.includes(targetNetwork)) {
                console.error(`❌ Invalid network: ${targetNetwork}`);
                console.error(`Valid networks: ${validNetworks.join(', ')}`);
                process.exit(1);
            }
            console.log(`Switching to ${targetNetwork}...`);
            (0, child_process_1.execSync)(`solana config set --url ${getNetworkUrl(targetNetwork)}`, { stdio: 'inherit' });
            console.log(`\n✅ Switched to ${targetNetwork}`);
        }
        else if (action === 'status') {
            const config = (0, child_process_1.execSync)('solana config get', { encoding: 'utf8' });
            console.log(config);
            const balance = (0, child_process_1.execSync)('solana balance', { encoding: 'utf8' });
            console.log(`Balance: ${balance}`);
        }
        else if (action === 'test') {
            console.log('Testing RPC connection...');
            const version = (0, child_process_1.execSync)('solana --version', { encoding: 'utf8' });
            console.log(`✅ Solana CLI: ${version.trim()}`);
            try {
                const cluster = (0, child_process_1.execSync)('solana cluster-version', { encoding: 'utf8' });
                console.log(`✅ Cluster: ${cluster.trim()}`);
            }
            catch {
                console.log('⚠️  Could not connect to cluster');
            }
        }
        else {
            console.error(`❌ Unknown action: ${action}`);
            console.error('Available actions: switch, status, test');
            process.exit(1);
        }
    }
    catch (error) {
        console.error('❌ Network operation failed');
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}
function getNetworkUrl(network) {
    const urls = {
        'localnet': 'http://127.0.0.1:8899',
        'devnet': 'https://api.devnet.solana.com',
        'mainnet-beta': 'https://api.mainnet-beta.solana.com'
    };
    return urls[network] || urls.devnet;
}
//# sourceMappingURL=network.js.map