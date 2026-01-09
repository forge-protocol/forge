import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import { Command } from 'commander';

// Generate a program ID for local development
function generateProgramId(): string {
  // Use a fixed program ID for local development that works with Anchor
  // In production, users should generate their own keypair
  return "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS";
}

export async function initCommand(projectName?: string, options?: { template?: string, skipTests?: boolean }) {
  console.log(chalk.blue.bold('🚀 FORGE Project Initializer'));
  console.log(chalk.gray('Setting up a new Solana project with FORGE...\n'));

  let answers: any;

  if (projectName) {
    // Use command line arguments
    answers = {
      projectName: projectName,
      template: options?.template || 'basic',
      includeTests: !options?.skipTests
    };
  } else {
    // Use interactive prompts
    answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'What is your project name?',
        default: 'my-forge-project'
      },
      {
        type: 'list',
        name: 'template',
        message: 'Choose a template:',
        choices: [
          { name: 'Basic Program', value: 'basic' },
          { name: 'Token Program', value: 'token' },
          { name: 'NFT Program', value: 'nft' },
          { name: 'DAO Program', value: 'dao' }
        ]
      },
      {
        type: 'confirm',
        name: 'includeTests',
        message: 'Include test files?',
        default: true
      }
    ]);
  }

  const spinner = ora('Creating project structure...').start();

  try {
    const projectPath = path.join(process.cwd(), answers.projectName);
    const crateName = answers.projectName.replace(/-/g, '_');

    // Create project directory
    await fs.ensureDir(projectPath);

    // Create basic Anchor program structure
    const programDir = path.join(projectPath, 'programs', `${answers.projectName}`);
    const programSrcDir = path.join(programDir, 'src');
    await fs.ensureDir(programSrcDir);

    // Create basic Cargo.toml
    const cargoToml = `[package]
name = "${answers.projectName}"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]
name = "${crateName}"

[features]
no-entrypoint = []
no-idl = []
no-log-ix-name = []
cpi = ["no-entrypoint"]
default = []

[dependencies]
anchor-lang = "0.29.0"
anchor-spl = "0.29.0"`;

    await fs.writeFile(path.join(programDir, 'Cargo.toml'), cargoToml);

    // Generate a program ID for local development
    // For production, users should generate their own keypair
    const programId = generateProgramId();

    // Create basic lib.rs
    const libRs = `use anchor_lang::prelude::*;

declare_id!("${programId}");

#[program]
pub mod ${crateName} {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Program initialized!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}`;

    await fs.writeFile(path.join(programDir, 'src', 'lib.rs'), libRs);

    // Create Anchor.toml
    const anchorToml = `[toolchain]
anchor_version = "0.29.0"

[features]
seeds = false
skip-lint = false

[programs.localnet]
${answers.projectName} = "${programId}"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "Localnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"`;

    await fs.writeFile(path.join(projectPath, 'Anchor.toml'), anchorToml);

    spinner.succeed(chalk.green('Project created successfully!'));

    console.log(chalk.blue('\n📝 Next steps:'));
    console.log(chalk.white('1. cd ' + answers.projectName));
    console.log(chalk.white('2. Run "anchor build" to compile'));
    console.log(chalk.white('3. Run "anchor test" to test'));
    console.log(chalk.white('4. For production: Generate your own program keypair and update the program ID'));

  } catch (error) {
    spinner.fail(chalk.red('Failed to create project'));
    console.error(error);
    process.exit(1);
  }
}