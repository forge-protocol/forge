import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Update command for self-updating FORGE
export async function updateCommand(): Promise<void> {
  console.log('FORGE Update Check\n');

  try {
    // Get current version
    const packageJson = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf8'));
    const currentVersion = packageJson.version;
    console.log(`Current version: ${currentVersion}`);

    // Get latest version from npm
    const latestVersion = execSync('npm view forge-solana-sdk version', { encoding: 'utf8' }).trim();
    console.log(`Latest version: ${latestVersion}`);

    if (currentVersion === latestVersion) {
      console.log('✅ FORGE is up to date!');
      return;
    }

    console.log('\n📦 Updating FORGE...');
    execSync('npm install -g forge-solana-sdk@latest', { stdio: 'inherit' });

    console.log('\n✅ FORGE updated successfully!');
    console.log(`Updated from ${currentVersion} to ${latestVersion}`);
    console.log('\nRestart your terminal or run: source ~/.bashrc (or equivalent)');

  } catch (error) {
    console.error('❌ Update failed. Try manually: npm install -g forge-solana-sdk@latest');
    console.error('Error:', error instanceof Error ? error.message : String(error));
  }
}

export async function statusCommand(): Promise<void> {
  console.log('FORGE Status\n');

  // Check Anchor
  try {
    const anchorVersion = execSync('anchor --version', { encoding: 'utf8' }).trim();
    console.log(`✅ Anchor CLI: ${anchorVersion}`);
  } catch (error) {
    console.log('❌ Anchor CLI: Not found');
  }

  // Check Solana CLI
  try {
    const solanaVersion = execSync('solana --version', { encoding: 'utf8' }).trim().split('\n')[0];
    console.log(`✅ Solana CLI: ${solanaVersion}`);
  } catch (error) {
    console.log('❌ Solana CLI: Not found');
  }

  // Check Rust
  try {
    const rustVersionOutput = execSync('rustc --version', { encoding: 'utf8' }).trim();
    const rustVersion = rustVersionOutput.split(' ')[1];
    console.log(`✅ Rust: ${rustVersion}`);

    // Check for edition 2024 compatibility
    const versionMatch = rustVersionOutput.match(/rustc (\d+)\.(\d+)\.(\d+)/);
    if (versionMatch) {
      const major = parseInt(versionMatch[1]);
      const minor = parseInt(versionMatch[2]);
      if (major < 1 || (major === 1 && minor < 85)) {
        console.log('⚠️  WARNING: Rust 1.85.0+ required for edition 2024 (update: rustup update stable)');
      }
    }
  } catch (error) {
    console.log('❌ Rust: Not found');
  }

  // Check if in project
  const anchorToml = join(process.cwd(), 'Anchor.toml');
  if (existsSync(anchorToml)) {
    console.log('✅ In Anchor project');
    try {
      const config = readFileSync(anchorToml, 'utf8');
      const network = config.includes('devnet') ? 'devnet' : 'localnet';
      console.log(`📡 Network: ${network}`);

      // Check version compatibility
      const anchorTomlMatch = config.match(/anchor_version\s*=\s*"([^"]+)"/);
      if (anchorTomlMatch) {
        const projectAnchorVersion = anchorTomlMatch[1];
        console.log(`🔗 Project Anchor version: ${projectAnchorVersion}`);

        // Check if it matches CLI
        try {
          const cliVersionOutput = execSync('anchor --version', { encoding: 'utf8' });
          const cliVersionMatch = cliVersionOutput.match(/anchor-cli (\d+\.\d+\.\d+)/);
          if (cliVersionMatch && cliVersionMatch[1] !== projectAnchorVersion) {
            console.log(`⚠️  Version mismatch: CLI ${cliVersionMatch[1]} vs Project ${projectAnchorVersion}`);
          }
        } catch (error) {
          // CLI check already handled above
        }
      }

      // Check Cargo.toml versions
      const cargoToml = join(process.cwd(), 'programs', 'Cargo.toml');
      if (existsSync(cargoToml)) {
        try {
          const cargoContent = readFileSync(cargoToml, 'utf8');
          const anchorLangMatch = cargoContent.match(/anchor-lang\s*=\s*"([^"]+)"/);
          if (anchorLangMatch) {
            console.log(`📦 anchor-lang: ${anchorLangMatch[1]}`);
          }
        } catch (error) {
          // Ignore read errors
        }
      }

    } catch (error) {
      console.log('📡 Network: Unknown');
    }
  } else {
    console.log('❌ Not in Anchor project');
  }

  console.log('\nReady to build on Solana.');
}