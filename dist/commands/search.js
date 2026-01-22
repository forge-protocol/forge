"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchCommand = searchCommand;
async function searchCommand(query) {
    console.log('🔍 FORGE Program Search\n');
    if (!query) {
        console.log('💡 Search for verified Solana programs\n');
        console.log('Usage: forge search <query>');
        console.log('Example: forge search token program');
        console.log('\n🔗 Search on:');
        console.log('   • Solana Explorer: https://explorer.solana.com');
        console.log('   • Solscan: https://solscan.io');
        console.log('   • GitHub: https://github.com/search?q=solana+program');
        return;
    }
    console.log(`Searching for: "${query}"\n`);
    console.log('🔗 Search Results:');
    console.log(`   Solana Explorer: https://explorer.solana.com/search?q=${encodeURIComponent(query)}`);
    console.log(`   Solscan: https://solscan.io/search?q=${encodeURIComponent(query)}`);
    console.log(`   GitHub: https://github.com/search?q=solana+${encodeURIComponent(query)}`);
    console.log('\n💡 Tips:');
    console.log('   • Use program IDs to find specific programs');
    console.log('   • Search by category (token, nft, dao)');
    console.log('   • Check verified programs for best practices');
}
//# sourceMappingURL=search.js.map