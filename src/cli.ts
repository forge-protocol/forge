#!/usr/bin/env node

import { Command } from 'commander';
import { logo } from './ascii.js';
import { initCommand } from './commands/init.js';
import { deployCommand } from './commands/deploy.js';
import { statusCommand } from './commands/status.js';

const program = new Command();

program
  .name('forge')
  .description('FORGE - Intent-driven app assembly on Solana')
  .version('2.0.0');

program
  .command('init [projectName]')
  .description('Initialize a new FORGE project')
  .option('-i, --intent <intent>', 'Describe what the program should do (enables CPI generation)')
  .action(async (projectName, options) => {
    await initCommand(projectName, options.intent);
  });

program
  .command('deploy')
  .description('Deploy program to Solana')
  .action(async () => {
    await deployCommand();
  });

program
  .command('status')
  .description('Check FORGE status and environment')
  .action(async () => {
    await statusCommand();
  });

// Show logo on help
program.on('--help', () => {
  console.log(logo);
  console.log('\nFORGE does not:');
  console.log('- host your code');
  console.log('- manage your keys');
  console.log('- abstract blockchain risks\n');
});

// Parse arguments
program.parse();