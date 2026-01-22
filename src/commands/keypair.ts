import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

export async function keypairCommand(action?: string, outputPath?: string): Promise<void> {
  console.log('🔑 FORGE Keypair Management\n');

  try {
    if (action === 'generate' || !action) {
      const path = outputPath || 'keypair.json';
      console.log(`Generating new keypair: ${path}...`);
      execSync(`solana-keygen new --outfile ${path} --no-bip39-passphrase`, { stdio: 'inherit' });
      console.log(`\n✅ Keypair generated: ${path}`);
      console.log('⚠️  Keep this file secure! Never commit it to version control.');
    } else if (action === 'import') {
      if (!outputPath) {
        console.error('❌ Please provide path to keypair file');
        process.exit(1);
      }
      if (!existsSync(outputPath)) {
        console.error(`❌ Keypair file not found: ${outputPath}`);
        process.exit(1);
      }
      console.log(`✅ Keypair imported from: ${outputPath}`);
      const pubkey = execSync(`solana-keygen pubkey ${outputPath}`, { encoding: 'utf8' }).trim();
      console.log(`   Public key: ${pubkey}`);
    } else if (action === 'info') {
      const defaultKeypair = join(process.env.HOME || '~', '.config', 'solana', 'id.json');
      if (existsSync(defaultKeypair)) {
        const pubkey = execSync(`solana-keygen pubkey ${defaultKeypair}`, { encoding: 'utf8' }).trim();
        console.log(`Default keypair: ${defaultKeypair}`);
        console.log(`Public key: ${pubkey}`);
      } else {
        console.log('No default keypair found.');
        console.log('Generate one with: forge keypair generate');
      }
    } else {
      console.error(`❌ Unknown action: ${action}`);
      console.error('Available actions: generate, import, info');
      process.exit(1);
    }
  } catch (error: any) {
    console.error('❌ Keypair operation failed');
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}
