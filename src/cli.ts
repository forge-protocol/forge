#!/usr/bin/env node

import { Command } from 'commander';
import { logo } from './ascii.js';
import { initCommand, listTemplatesCommand } from './commands/init.js';
import { deployCommand } from './commands/deploy.js';
import { hardenCommand } from './commands/harden.js';
import { statusCommand, updateCommand } from './commands/status.js';
import { generateSdkCommand } from './commands/generate-sdk.js';
import { auditCommand } from './commands/audit.js';
import { testCommand } from './commands/test.js';
import { verifyCommand } from './commands/verify.js';
import { upgradeCommand } from './commands/upgrade.js';
import { profileCommand } from './commands/profile.js';
import { monitorCommand } from './commands/monitor.js';
import { interactiveCommand } from './commands/interactive.js';
import { docsCommand } from './commands/docs.js';
import { migrateCommand } from './commands/migrate.js';
import { qualityCommand } from './commands/quality.js';
import { costCommand } from './commands/cost.js';
import { keypairCommand } from './commands/keypair.js';
import { networkCommand } from './commands/network.js';
import { searchCommand } from './commands/search.js';
import { analyticsCommand } from './commands/analytics.js';
import { ciCommand } from './commands/ci.js';

const program = new Command();

program
  .name('forge')
  .description('FORGE - Intent-driven app assembly on Solana')
  .version('3.3.0');

program
  .command('init [projectName]')
  .description('Initialize a new FORGE project')
  .option('-i, --intent <intent>', 'Describe what the program should do (enables CPI generation)')
  .option('-a, --anchor-version <version>', 'Specify Anchor version (default: 0.32.1)', '0.32.1')
  .option('-t, --template <template>', 'Use a program template (token-program, nft-marketplace, dao-governance, staking-rewards, escrow-swap, token-vesting)')
  .action(async (projectName, options) => {
    await initCommand(projectName, options.intent, options.anchorVersion, options.template);
  });

program
  .command('list-templates')
  .description('List available program templates')
  .action(async () => {
    await listTemplatesCommand();
  });

program
  .command('deploy')
  .description('Deploy program to Solana')
  .option('-e, --env <environment>', 'Target environment: localnet, devnet, mainnet-beta (default: devnet)', 'devnet')
  .action(async (options) => {
    await deployCommand(options.env);
  });

program
  .command('harden')
  .description('Apply security best-practices and forge-runtime safeguards')
  .action(async () => {
    await hardenCommand();
  });

program
  .command('audit')
  .command('test')
  .description('Generate and run comprehensive test suite')
  .action(async () => {
    await testCommand();
  });

program
  .command('verify')
  .description('Verify contract source code on Solana Explorer')
  .action(async () => {
    await verifyCommand();
  });

program
  .command('upgrade [version]')
  .description('Upgrade Anchor program to a new version')
  .action(async (version) => {
    await upgradeCommand(version);
  });

program
  .command('profile')
  .description('Analyze program performance and compute unit usage')
  .action(async () => {
    await profileCommand();
  });

program
  .command('monitor')
  .description('Monitor program activity and analytics')
  .action(async () => {
    await monitorCommand();
  });

program
  .command('interactive')
  .description('Interactive project setup wizard')
  .action(async () => {
    await interactiveCommand();
  });

program
  .command('docs')
  .description('Generate API documentation from IDL')
  .action(async () => {
    await docsCommand();
  });

program
  .command('migrate [version]')
  .description('Migrate program between Anchor versions')
  .action(async (version) => {
    await migrateCommand(version);
  });

program
  .command('quality')
  .description('Analyze code quality metrics')
  .action(async () => {
    await qualityCommand();
  });

program
  .command('cost')
  .description('Calculate deployment and operation costs')
  .action(async () => {
    await costCommand();
  });

program
  .command('keypair [action] [path]')
  .description('Manage keypairs (generate, import, info)')
  .action(async (action, path) => {
    await keypairCommand(action, path);
  });

program
  .command('network [action] [network]')
  .description('Manage Solana network connections (switch, status, test)')
  .action(async (action, network) => {
    await networkCommand(action, network);
  });

program
  .command('search [query]')
  .description('Search for verified Solana programs')
  .action(async (query) => {
    await searchCommand(query);
  });

program
  .command('analytics')
  .description('View program analytics and metrics')
  .action(async () => {
    await analyticsCommand();
  });

program
  .command('ci [platform]')
  .description('Generate CI/CD workflows (github)')
  .action(async (platform) => {
    await ciCommand(platform);
  });

program
  .command('generate-sdk [outputDir]')
  .description('Generate TypeScript SDK from Anchor program')
  .option('--v2', 'Generate modern Web3.js v2 functional SDK')
  .action(async (outputDir, options) => {
    await generateSdkCommand(outputDir, options.v2);
  });

program
  .command('status')
  .description('Check FORGE status and environment')
  .action(async () => {
    await statusCommand();
  });

program
  .command('update')
  .description('Update FORGE to the latest version')
  .action(async () => {
    await updateCommand();
  });

// Show logo on help
program.on('--help', () => {
  console.log(logo);
  console.log('\nCore Commands:');
  console.log('  init          Create new Anchor projects');
  console.log('  interactive   Interactive project setup wizard');
  console.log('  list-templates List available program templates');
  console.log('\nDevelopment:');
  console.log('  test          Generate and run comprehensive tests');
  console.log('  audit         Run security audit (--deep for advanced)');
  console.log('  harden        Apply security safeguards to your project');
  console.log('  quality       Analyze code quality metrics');
  console.log('  profile       Analyze performance and compute units');
  console.log('  docs          Generate API documentation');
  console.log('\nDeployment:');
  console.log('  deploy        Deploy to Solana (--env: devnet/mainnet)');
  console.log('  verify        Verify contract on Solana Explorer');
  console.log('  upgrade       Upgrade Anchor program version');
  console.log('  migrate       Migrate between Anchor versions');
  console.log('\nUtilities:');
  console.log('  generate-sdk  Generate TypeScript SDK from program');
  console.log('  monitor       Monitor program activity');
  console.log('  analytics     View program analytics');
  console.log('  cost          Calculate deployment costs');
  console.log('  keypair       Manage keypairs (generate/import/info)');
  console.log('  network       Manage network connections');
  console.log('  search        Search verified Solana programs');
  console.log('  ci            Generate CI/CD workflows');
  console.log('  status        Check environment & versions');
  console.log('  update        Update FORGE to latest version');
  console.log('\nFORGE does not:');
  console.log('- host your code');
  console.log('- manage your keys');
  console.log('- abstract blockchain risks\n');
});

// Parse arguments
program.parse();