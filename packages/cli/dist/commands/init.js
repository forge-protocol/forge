"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCommand = initCommand;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
// Generate a program ID for local development
function generateProgramId() {
    // Use a fixed program ID for local development that works with Anchor
    // In production, users should generate their own keypair
    return "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS";
}
async function initCommand(projectName, options) {
    console.log(chalk_1.default.blue.bold('🚀 FORGE Project Initializer'));
    console.log(chalk_1.default.gray('Setting up a new Solana project with FORGE...\n'));
    let answers;
    if (projectName) {
        // Use command line arguments
        answers = {
            projectName: projectName,
            template: options?.template || 'basic',
            includeTests: !options?.skipTests
        };
    }
    else {
        // Use interactive prompts
        answers = await inquirer_1.default.prompt([
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
    const spinner = (0, ora_1.default)('Creating project structure...').start();
    try {
        const projectPath = path_1.default.join(process.cwd(), answers.projectName);
        const crateName = answers.projectName.replace(/-/g, '_');
        // Create project directory
        await fs_extra_1.default.ensureDir(projectPath);
        // Create basic Anchor program structure
        const programDir = path_1.default.join(projectPath, 'programs', `${answers.projectName}`);
        const programSrcDir = path_1.default.join(programDir, 'src');
        await fs_extra_1.default.ensureDir(programSrcDir);
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
        await fs_extra_1.default.writeFile(path_1.default.join(programDir, 'Cargo.toml'), cargoToml);
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
        await fs_extra_1.default.writeFile(path_1.default.join(programDir, 'src', 'lib.rs'), libRs);
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
        await fs_extra_1.default.writeFile(path_1.default.join(projectPath, 'Anchor.toml'), anchorToml);
        spinner.succeed(chalk_1.default.green('Project created successfully!'));
        console.log(chalk_1.default.blue('\n📝 Next steps:'));
        console.log(chalk_1.default.white('1. cd ' + answers.projectName));
        console.log(chalk_1.default.white('2. Run "anchor build" to compile'));
        console.log(chalk_1.default.white('3. Run "anchor test" to test'));
        console.log(chalk_1.default.white('4. For production: Generate your own program keypair and update the program ID'));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red('Failed to create project'));
        console.error(error);
        process.exit(1);
    }
}
//# sourceMappingURL=init.js.map