import { upgradeCommand } from './upgrade.js';

export async function migrateCommand(targetVersion?: string): Promise<void> {
  console.log('🔄 FORGE Migration Assistant\n');
  console.log('This command helps migrate between Anchor versions.\n');
  
  await upgradeCommand(targetVersion);
  
  console.log('\n📋 Additional Migration Steps:');
  console.log('   1. Review breaking changes in Anchor changelog');
  console.log('   2. Update any custom account serialization');
  console.log('   3. Test all instructions thoroughly');
  console.log('   4. Update client SDKs if needed');
}
