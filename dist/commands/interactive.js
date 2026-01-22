"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interactiveCommand = interactiveCommand;
const readline_1 = require("readline");
const init_js_1 = require("./init.js");
async function interactiveCommand() {
    console.log('🎯 FORGE Interactive Setup\n');
    console.log('Answer a few questions to set up your project:\n');
    const rl = (0, readline_1.createInterface)({
        input: process.stdin,
        output: process.stdout
    });
    const question = (query) => {
        return new Promise((resolve) => {
            rl.question(query, resolve);
        });
    };
    try {
        const projectName = await question('📦 Project name: ');
        const useTemplate = await question('📚 Use a template? (y/n): ');
        let template;
        if (useTemplate.toLowerCase() === 'y') {
            console.log('\nAvailable templates:');
            console.log('  1. token-program - SPL Token Program');
            console.log('  2. nft-marketplace - NFT Marketplace');
            console.log('  3. dao-governance - DAO Governance');
            console.log('  4. staking-rewards - Staking & Rewards');
            console.log('  5. escrow-swap - Escrow Swap');
            console.log('  6. token-vesting - Token Vesting\n');
            const templateChoice = await question('Select template (1-6): ');
            const templates = ['token-program', 'nft-marketplace', 'dao-governance', 'staking-rewards', 'escrow-swap', 'token-vesting'];
            template = templates[parseInt(templateChoice) - 1];
        }
        const useIntent = await question('\n💡 Use intent-driven generation? (y/n): ');
        let intent;
        if (useIntent.toLowerCase() === 'y') {
            intent = await question('Describe what your program should do: ');
        }
        const anchorVersion = await question('\n🔧 Anchor version (default: 0.32.1): ') || '0.32.1';
        rl.close();
        console.log('\n🚀 Creating project...\n');
        await (0, init_js_1.initCommand)(projectName || undefined, intent, anchorVersion, template);
    }
    catch (error) {
        rl.close();
        console.error('❌ Interactive setup failed');
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}
//# sourceMappingURL=interactive.js.map