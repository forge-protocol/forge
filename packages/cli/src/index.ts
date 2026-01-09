#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { buildCommand } from './commands/build';
import { deployCommand } from './commands/deploy';

const program = new Command();

program
  .name('forge')
  .description('FORGE - Solana Development Platform CLI')
  .version('0.1.0');

program
  .command('init [projectName]')
  .description('Initialize a new FORGE project')
  .option('-t, --template <template>', 'Project template (basic, token, nft, dao)', 'basic')
  .option('--skip-tests', 'Skip test files')
  .action((projectName, options) => initCommand(projectName, options));

program
  .command('build')
  .description('Build Anchor programs')
  .action(buildCommand);

program
  .command('deploy')
  .description('Deploy programs to Solana')
  .action(deployCommand);

program
  .command('help')
  .description('Display help information')
  .action(() => {
    program.help();
  });

// Handle unknown commands
program.on('command:*', (unknownCommand) => {
  console.error(chalk.red(`Unknown command: ${unknownCommand[0]}`));
  console.log(chalk.yellow('Run "forge help" for available commands'));
  process.exit(1);
});

// Parse arguments
program.parse();