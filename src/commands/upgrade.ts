import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

interface UpgradeInfo {
  currentVersion: string;
  targetVersion: string;
  breakingChanges: string[];
  migrationSteps: string[];
}

export async function upgradeCommand(targetVersion?: string): Promise<void> {
  console.log('🔄 FORGE Program Upgrade System\n');

  try {
    if (!existsSync('Anchor.toml')) {
      console.error('❌ Not in an Anchor project directory');
      process.exit(1);
    }

    // Get current version
    const currentVersion = getCurrentAnchorVersion();
    const upgradeVersion = targetVersion || getLatestAnchorVersion();

    if (currentVersion === upgradeVersion) {
      console.log(`✅ Program already using Anchor ${currentVersion}`);
      console.log('No upgrade needed.');
      return;
    }

    console.log(`📊 Current version: ${currentVersion}`);
    console.log(`🎯 Target version: ${upgradeVersion}\n`);

    // Analyze upgrade path
    const upgradeInfo = analyzeUpgrade(currentVersion, upgradeVersion);

    // Show upgrade plan
    displayUpgradePlan(upgradeInfo);

    // Perform upgrade
    await performUpgrade(upgradeInfo);

    console.log('\n✅ Upgrade completed successfully!');
    console.log('📝 Next steps:');
    console.log('   1. Review the changes');
    console.log('   2. Run: anchor build');
    console.log('   3. Run: forge test');
    console.log('   4. Fix any breaking changes');

  } catch (error: any) {
    console.error('❌ Upgrade failed');
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

function getCurrentAnchorVersion(): string {
  try {
    const anchorToml = readFileSync('Anchor.toml', 'utf8');
    const match = anchorToml.match(/anchor_version\s*=\s*"([^"]+)"/);
    return match ? match[1] : '0.29.0';
  } catch {
    return '0.29.0';
  }
}

function getLatestAnchorVersion(): string {
  try {
    const output = execSync('anchor --version', { encoding: 'utf8' });
    const match = output.match(/anchor-cli\s+(\d+\.\d+\.\d+)/);
    return match ? match[1] : '0.32.1';
  } catch {
    return '0.32.1';
  }
}

function analyzeUpgrade(current: string, target: string): UpgradeInfo {
  const breakingChanges: string[] = [];
  const migrationSteps: string[] = [];

  // Detect major version changes
  const currentMajor = parseInt(current.split('.')[0]);
  const targetMajor = parseInt(target.split('.')[0]);

  if (targetMajor > currentMajor) {
    breakingChanges.push(`Major version upgrade: ${currentMajor} → ${targetMajor}`);
    migrationSteps.push('Review Anchor migration guide for breaking changes');
    migrationSteps.push('Update all Anchor dependencies to match new version');
  }

  // Version-specific migration steps
  if (currentMajor < 0.30 && targetMajor >= 0.30) {
    breakingChanges.push('Account interface changes in Anchor 0.30+');
    migrationSteps.push('Update account types to use InterfaceAccount where applicable');
    migrationSteps.push('Review token program usage for Token-2022 compatibility');
  }

  if (currentMajor < 0.31 && targetMajor >= 0.31) {
    breakingChanges.push('IDL format changes in Anchor 0.31+');
    migrationSteps.push('Regenerate IDL files');
    migrationSteps.push('Update client SDKs if using generated code');
  }

  return {
    currentVersion: current,
    targetVersion: target,
    breakingChanges,
    migrationSteps
  };
}

function displayUpgradePlan(info: UpgradeInfo): void {
  console.log('📋 Upgrade Plan:\n');

  if (info.breakingChanges.length > 0) {
    console.log('⚠️  Breaking Changes:');
    info.breakingChanges.forEach(change => {
      console.log(`   • ${change}`);
    });
    console.log();
  }

  console.log('📝 Migration Steps:');
  info.migrationSteps.forEach((step, index) => {
    console.log(`   ${index + 1}. ${step}`);
  });
  console.log();
}

async function performUpgrade(info: UpgradeInfo): Promise<void> {
  console.log('🔧 Performing upgrade...\n');

  // Update Anchor.toml
  let anchorToml = readFileSync('Anchor.toml', 'utf8');
  anchorToml = anchorToml.replace(
    /anchor_version\s*=\s*"[^"]+"/,
    `anchor_version = "${info.targetVersion}"`
  );
  writeFileSync('Anchor.toml', anchorToml);
  console.log('✅ Updated Anchor.toml');

  // Update Cargo.toml files
  const { glob } = require('glob');
  const cargoFiles = await glob('**/Cargo.toml');

  for (const file of cargoFiles) {
    let cargoToml = readFileSync(file, 'utf8');
    const oldVersion = info.currentVersion;
    const newVersion = info.targetVersion;

    // Update anchor-lang
    cargoToml = cargoToml.replace(
      new RegExp(`anchor-lang\\s*=\\s*"${oldVersion.replace(/\./g, '\\.')}"`, 'g'),
      `anchor-lang = "${newVersion}"`
    );

    // Update anchor-spl
    cargoToml = cargoToml.replace(
      new RegExp(`anchor-spl\\s*=\\s*"${oldVersion.replace(/\./g, '\\.')}"`, 'g'),
      `anchor-spl = "${newVersion}"`
    );

    writeFileSync(file, cargoToml);
    console.log(`✅ Updated ${file}`);
  }

  // Run cargo update
  console.log('\n📦 Updating dependencies...');
  try {
    execSync('cargo update', { stdio: 'inherit' });
  } catch (error) {
    console.warn('⚠️  Cargo update had issues - you may need to run it manually');
  }
}