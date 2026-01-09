"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCommand = buildCommand;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
async function buildCommand() {
    console.log(chalk_1.default.blue.bold('🔨 Building Anchor Programs'));
    const spinner = (0, ora_1.default)('Checking project structure...').start();
    try {
        // Check if Anchor is installed
        await execAsync('anchor --version');
        // Check if we're in an Anchor workspace
        const anchorTomlPath = path_1.default.join(process.cwd(), 'Anchor.toml');
        const hasAnchorToml = await fs_extra_1.default.pathExists(anchorTomlPath);
        let buildDir = process.cwd();
        if (!hasAnchorToml) {
            // Look for Anchor projects in subdirectories
            const entries = await fs_extra_1.default.readdir(process.cwd());
            const anchorProjects = [];
            for (const entry of entries) {
                const entryPath = path_1.default.join(process.cwd(), entry);
                const stat = await fs_extra_1.default.stat(entryPath);
                if (stat.isDirectory()) {
                    const anchorTomlInSubdir = path_1.default.join(entryPath, 'Anchor.toml');
                    if (await fs_extra_1.default.pathExists(anchorTomlInSubdir)) {
                        anchorProjects.push(entry);
                    }
                }
            }
            if (anchorProjects.length === 0) {
                spinner.fail(chalk_1.default.red('No Anchor workspace found'));
                console.error(chalk_1.default.red('❌ No Anchor.toml found in current directory or subdirectories.'));
                console.log(chalk_1.default.yellow('Make sure you\'re in a FORGE project directory or run:'));
                console.log(chalk_1.default.white('  forge init <project-name>  # to create a new project'));
                console.log(chalk_1.default.white('  cd <project-name>         # to enter the project'));
                process.exit(1);
            }
            else if (anchorProjects.length === 1) {
                buildDir = path_1.default.join(process.cwd(), anchorProjects[0]);
                console.log(chalk_1.default.blue(`Found Anchor project: ${anchorProjects[0]}`));
            }
            else {
                spinner.fail(chalk_1.default.red('Multiple Anchor projects found'));
                console.error(chalk_1.default.red('❌ Multiple Anchor projects found. Please specify which one to build:'));
                anchorProjects.forEach(project => {
                    console.log(chalk_1.default.white(`  cd ${project} && forge build`));
                });
                process.exit(1);
            }
        }
        spinner.text = 'Building programs...';
        // Build the programs from the correct directory
        const { stdout, stderr } = await execAsync('anchor build', { cwd: buildDir });
        if (stderr) {
            console.log(chalk_1.default.yellow('Build warnings:'), stderr);
        }
        spinner.succeed(chalk_1.default.green('Programs built successfully!'));
        // Show build output
        if (stdout) {
            console.log(chalk_1.default.gray('Build output:'));
            console.log(stdout);
        }
        console.log(chalk_1.default.blue('\n📁 Build artifacts created in:'));
        console.log(chalk_1.default.white(`  - ${path_1.default.relative(process.cwd(), buildDir)}/target/deploy/ (deployment binaries)`));
        console.log(chalk_1.default.white(`  - ${path_1.default.relative(process.cwd(), buildDir)}/target/idl/ (program interfaces)`));
        console.log(chalk_1.default.white(`  - ${path_1.default.relative(process.cwd(), buildDir)}/target/types/ (TypeScript types)`));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red('Build failed'));
        if (error.code === 'ENOENT') {
            console.error(chalk_1.default.red('❌ Anchor CLI not found. Please install Anchor:'));
            console.log(chalk_1.default.white('cargo install --git https://github.com/coral-xyz/anchor anchor-cli'));
        }
        else if (error.message.includes('edition2024')) {
            console.error(chalk_1.default.red('❌ Rust toolchain version issue.'));
            console.log(chalk_1.default.yellow('Your Rust version is too old. Try updating to a newer nightly:'));
            console.log(chalk_1.default.white('rustup update nightly'));
            console.log(chalk_1.default.white('rustup default nightly'));
        }
        else if (error.message.includes('anchor-lang') && error.message.includes('CLI version')) {
            console.error(chalk_1.default.red('❌ Anchor version mismatch.'));
            console.log(chalk_1.default.yellow('Consider updating Anchor.toml with the recommended version, or:'));
            console.log(chalk_1.default.white('cargo install --git https://github.com/coral-xyz/anchor anchor-cli --tag v0.29.0'));
        }
        else {
            console.error(chalk_1.default.red('Build error:'), error.message);
        }
        process.exit(1);
    }
}
//# sourceMappingURL=build.js.map