"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployCommand = deployCommand;
const child_process_1 = require("child_process");
async function deployCommand() {
    console.log('Deploying to Solana...\n');
    try {
        // Check if we're in an Anchor project
        (0, child_process_1.execSync)('ls Anchor.toml', { stdio: 'pipe' });
    }
    catch (error) {
        console.error('❌ Not in an Anchor project directory');
        console.error('Run "forge init" first or cd into your project');
        process.exit(1);
    }
    try {
        console.log('Building program...');
        (0, child_process_1.execSync)('anchor build', { stdio: 'inherit' });
        console.log('\nDeploying...');
        (0, child_process_1.execSync)('anchor deploy', { stdio: 'inherit' });
        console.log('\n✅ Deployment successful!');
    }
    catch (error) {
        console.error('❌ Deployment failed');
        process.exit(1);
    }
}
//# sourceMappingURL=deploy.js.map