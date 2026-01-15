#!/usr/bin/env node

import { Command } from 'commander';
import { logo } from './ascii.js';
import { initCommand } from './commands/init.js';
import { deployCommand } from './commands/deploy.js';
import { statusCommand, updateCommand } from './commands/status.js';
import { generateSdkCommand } from './commands/generate-sdk.js';

const program = new Command();

program
  .name('forge')
  .description('FORGE - Intent-driven app assembly on Solana')
  .version('2.2.0');

program
  .command('init [projectName]')
  .description('Initialize a new FORGE project')
  .option('-i, --intent <intent>', 'Describe what the program should do (enables CPI generation)')
  .option('-a, --anchor-version <version>', 'Specify Anchor version (default: 0.32.1)', '0.32.1')
  .action(async (projectName, options) => {
    await initCommand(projectName, options.intent, options.anchorVersion);
  });

program
  .command('deploy')
  .description('Deploy program to Solana')
  .action(async () => {
    await deployCommand();
  });

program
  .command('generate-sdk [outputDir]')
  .description('Generate TypeScript SDK from Anchor program')
  .action(async (outputDir) => {
    await generateSdkCommand(outputDir);
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
  console.log('\nCommands:');
  console.log('  init          Create new Anchor projects');
  console.log('  generate-sdk  Generate TypeScript SDK from program');
  console.log('  status        Check environment & versions');
  console.log('  update        Update FORGE to latest version');
  console.log('  deploy        Deploy to Solana network');
  console.log('\nFORGE does not:');
  console.log('- host your code');
  console.log('- manage your keys');
  console.log('- abstract blockchain risks\n');
});

// Parse arguments
program.parse();