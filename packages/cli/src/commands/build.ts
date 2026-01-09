import chalk from 'chalk';
import ora from 'ora';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs-extra';
import path from 'path';

const execAsync = promisify(exec);

export async function buildCommand() {
  console.log(chalk.blue.bold('🔨 Building Anchor Programs'));

  const spinner = ora('Checking project structure...').start();

  try {
    // Check if Anchor is installed
    await execAsync('anchor --version');

    // Check if we're in an Anchor workspace
    const anchorTomlPath = path.join(process.cwd(), 'Anchor.toml');
    const hasAnchorToml = await fs.pathExists(anchorTomlPath);

    let buildDir = process.cwd();

    if (!hasAnchorToml) {
      // Look for Anchor projects in subdirectories
      const entries = await fs.readdir(process.cwd());
      const anchorProjects: string[] = [];

      for (const entry of entries) {
        const entryPath = path.join(process.cwd(), entry);
        const stat = await fs.stat(entryPath);

        if (stat.isDirectory()) {
          const anchorTomlInSubdir = path.join(entryPath, 'Anchor.toml');
          if (await fs.pathExists(anchorTomlInSubdir)) {
            anchorProjects.push(entry);
          }
        }
      }

      if (anchorProjects.length === 0) {
        spinner.fail(chalk.red('No Anchor workspace found'));
        console.error(chalk.red('❌ No Anchor.toml found in current directory or subdirectories.'));
        console.log(chalk.yellow('Make sure you\'re in a FORGE project directory or run:'));
        console.log(chalk.white('  forge init <project-name>  # to create a new project'));
        console.log(chalk.white('  cd <project-name>         # to enter the project'));
        process.exit(1);
      } else if (anchorProjects.length === 1) {
        buildDir = path.join(process.cwd(), anchorProjects[0]);
        console.log(chalk.blue(`Found Anchor project: ${anchorProjects[0]}`));
      } else {
        spinner.fail(chalk.red('Multiple Anchor projects found'));
        console.error(chalk.red('❌ Multiple Anchor projects found. Please specify which one to build:'));
        anchorProjects.forEach(project => {
          console.log(chalk.white(`  cd ${project} && forge build`));
        });
        process.exit(1);
      }
    }

    spinner.text = 'Building programs...';

    // Build the programs from the correct directory
    const { stdout, stderr } = await execAsync('anchor build', { cwd: buildDir });

    if (stderr) {
      console.log(chalk.yellow('Build warnings:'), stderr);
    }

    spinner.succeed(chalk.green('Programs built successfully!'));

    // Show build output
    if (stdout) {
      console.log(chalk.gray('Build output:'));
      console.log(stdout);
    }

    console.log(chalk.blue('\n📁 Build artifacts created in:'));
    console.log(chalk.white(`  - ${path.relative(process.cwd(), buildDir)}/target/deploy/ (deployment binaries)`));
    console.log(chalk.white(`  - ${path.relative(process.cwd(), buildDir)}/target/idl/ (program interfaces)`));
    console.log(chalk.white(`  - ${path.relative(process.cwd(), buildDir)}/target/types/ (TypeScript types)`));

  } catch (error: any) {
    spinner.fail(chalk.red('Build failed'));

    if (error.code === 'ENOENT') {
      console.error(chalk.red('❌ Anchor CLI not found. Please install Anchor:'));
      console.log(chalk.white('cargo install --git https://github.com/coral-xyz/anchor anchor-cli'));
    } else if (error.message.includes('edition2024')) {
      console.error(chalk.red('❌ Rust toolchain version issue.'));
      console.log(chalk.yellow('Your Rust version is too old. Try updating to a newer nightly:'));
      console.log(chalk.white('rustup update nightly'));
      console.log(chalk.white('rustup default nightly'));
    } else if (error.message.includes('anchor-lang') && error.message.includes('CLI version')) {
      console.error(chalk.red('❌ Anchor version mismatch.'));
      console.log(chalk.yellow('Consider updating Anchor.toml with the recommended version, or:'));
      console.log(chalk.white('cargo install --git https://github.com/coral-xyz/anchor anchor-cli --tag v0.29.0'));
    } else {
      console.error(chalk.red('Build error:'), error.message);
    }

    process.exit(1);
  }
}