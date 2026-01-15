import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

type Environment = 'localnet' | 'devnet' | 'mainnet-beta';

interface EnvironmentConfig {
  cluster: string;
  rpcUrl: string;
  faucet?: string;
}

const ENV_CONFIGS: Record<Environment, EnvironmentConfig> = {
  localnet: {
    cluster: 'Localnet',
    rpcUrl: 'http://127.0.0.1:8899',
  },
  devnet: {
    cluster: 'Devnet',
    rpcUrl: 'https://api.devnet.solana.com',
    faucet: 'https://faucet.solana.com',
  },
  'mainnet-beta': {
    cluster: 'Mainnet',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
  },
};

export async function deployCommand(env: Environment = 'devnet'): Promise<void> {
  console.log(`🚀 Deploying to Solana ${env}...\n`);

  // Validate environment
  if (!ENV_CONFIGS[env]) {
    console.error(`❌ Invalid environment: ${env}`);
    console.error('Valid options: localnet, devnet, mainnet-beta');
    process.exit(1);
  }

  // Safety check for mainnet
  if (env === 'mainnet-beta') {
    console.log('⚠️  WARNING: Deploying to MAINNET-BETA!');
    console.log('This will use real SOL and cannot be undone.');
    console.log('Make sure you have:');
    console.log('- Sufficient SOL for deployment (~2-5 SOL)');
    console.log('- Backed up your wallet keypair');
    console.log('- Tested thoroughly on devnet\n');

    // Simple confirmation (in production, might want more robust confirmation)
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    await new Promise((resolve) => {
      rl.question('Type "DEPLOY" to confirm: ', (answer: string) => {
        if (answer !== 'DEPLOY') {
          console.log('❌ Deployment cancelled');
          process.exit(0);
        }
        rl.close();
        resolve(null);
      });
    });
  }

  try {
    // Check if we're in an Anchor project
    execSync('ls Anchor.toml', { stdio: 'pipe' });
  } catch (error) {
    console.error('❌ Not in an Anchor project directory');
    console.error('Run "forge init" first or cd into your project');
    process.exit(1);
  }

  try {
    // Update Anchor.toml with environment-specific settings
    await updateAnchorConfig(env);

    console.log(`Building program for ${env}...`);
    execSync('anchor build', { stdio: 'inherit' });

    console.log(`\nDeploying to ${env}...`);
    execSync(`anchor deploy --provider.cluster ${env}`, { stdio: 'inherit' });

    console.log(`\n✅ Deployment to ${env} successful!`);
    console.log(`🌐 RPC: ${ENV_CONFIGS[env].rpcUrl}`);

  } catch (error: any) {
    console.error(`❌ Deployment to ${env} failed`);
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

async function updateAnchorConfig(env: Environment): Promise<void> {
  try {
    const anchorTomlPath = join(process.cwd(), 'Anchor.toml');
    let anchorToml = readFileSync(anchorTomlPath, 'utf8');

    const config = ENV_CONFIGS[env];

    // Update cluster setting
    anchorToml = anchorToml.replace(
      /\[provider\]\ncluster\s*=\s*".*"/,
      `[provider]\ncluster = "${env}"`
    );

    // Update RPC URL if present
    if (config.rpcUrl) {
      anchorToml = anchorToml.replace(
        /rpc_url\s*=\s*".*"/,
        `rpc_url = "${config.rpcUrl}"`
      );
    }

    writeFileSync(anchorTomlPath, anchorToml);
    console.log(`📝 Updated Anchor.toml for ${env} deployment`);
  } catch (error) {
    console.warn(`⚠️  Could not update Anchor.toml: ${error}`);
    console.log('Continuing with default configuration...');
  }
}