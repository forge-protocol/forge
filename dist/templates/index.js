"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templates = void 0;
exports.getTemplate = getTemplate;
exports.listTemplates = listTemplates;
exports.templates = [
    {
        id: 'token-program',
        name: 'SPL Token Program',
        description: 'Complete SPL token program with mint, transfer, and burn functionality',
        category: 'token',
        features: ['Mint tokens', 'Transfer tokens', 'Burn tokens', 'Freeze accounts', 'PDA authority'],
        files: []
    },
    {
        id: 'nft-marketplace',
        name: 'NFT Marketplace',
        description: 'NFT marketplace with listing, buying, selling, and royalty support',
        category: 'nft',
        features: ['List NFTs', 'Buy NFTs', 'Sell NFTs', 'Royalties', 'Auction support'],
        files: []
    },
    {
        id: 'dao-governance',
        name: 'DAO Governance',
        description: 'Decentralized autonomous organization with proposals and voting',
        category: 'dao',
        features: ['Create proposals', 'Vote on proposals', 'Execute proposals', 'Token-weighted voting'],
        files: []
    },
    {
        id: 'staking-rewards',
        name: 'Staking & Rewards',
        description: 'Token staking program with reward distribution',
        category: 'defi',
        features: ['Stake tokens', 'Unstake tokens', 'Claim rewards', 'Time-based rewards'],
        files: []
    },
    {
        id: 'escrow-swap',
        name: 'Escrow Swap',
        description: 'Trustless token swap using escrow accounts',
        category: 'defi',
        features: ['Create escrow', 'Deposit tokens', 'Cancel escrow', 'Complete swap'],
        files: []
    },
    {
        id: 'token-vesting',
        name: 'Token Vesting',
        description: 'Token vesting with time-based unlock schedules',
        category: 'utility',
        features: ['Create vesting schedule', 'Linear vesting', 'Cliff periods', 'Claim vested tokens'],
        files: []
    }
];
function getTemplate(id) {
    return exports.templates.find(t => t.id === id);
}
function listTemplates(category) {
    if (category) {
        return exports.templates.filter(t => t.category === category);
    }
    return exports.templates;
}
//# sourceMappingURL=index.js.map