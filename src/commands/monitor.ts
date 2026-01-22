import { existsSync } from 'fs';

export async function monitorCommand(): Promise<void> {
  console.log('📊 FORGE Program Monitoring\n');

  try {
    if (!existsSync('Anchor.toml')) {
      console.error('❌ Not in an Anchor project directory');
      process.exit(1);
    }

    const programId = getProgramId();
    if (!programId) {
      console.error('❌ Could not find program ID');
      process.exit(1);
    }

    console.log(`🔍 Monitoring program: ${programId}\n`);

    console.log('📈 Real-time Analytics:');
    console.log('   • Transaction volume: Check Solana Explorer');
    console.log('   • Error rate: Monitor failed transactions');
    console.log('   • Active users: Track unique signers');
    console.log('   • Account growth: Monitor account creation');

    console.log('\n🔗 Monitoring Links:');
    console.log(`   Solana Explorer: https://explorer.solana.com/address/${programId}`);
    console.log(`   Solscan: https://solscan.io/account/${programId}`);

    console.log('\n💡 Setup Monitoring:');
    console.log('   1. Use Solana Explorer for basic metrics');
    console.log('   2. Integrate with monitoring services (Helius, QuickNode)');
    console.log('   3. Set up alerts for error rates');
    console.log('   4. Track compute unit usage trends');

  } catch (error: any) {
    console.error('❌ Monitoring setup failed');
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

function getProgramId(): string | null {
  try {
    const { readFileSync } = require('fs');
    const anchorToml = readFileSync('Anchor.toml', 'utf8');
    const match = anchorToml.match(/\[programs\.localnet\]\s*([^=]+)\s*=\s*"([^"]+)"/);
    return match ? match[2] : null;
  } catch {
    return null;
  }
}
