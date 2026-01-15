import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

interface AuditResult {
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  location?: string;
  recommendation: string;
}

export async function auditCommand(): Promise<void> {
  console.log('🔍 Running FORGE Security Audit...\n');

  const results: AuditResult[] = [];

  try {
    // Check if we're in an Anchor project
    if (!existsSync('Anchor.toml')) {
      console.error('❌ Not in an Anchor project directory');
      console.error('Run "forge init" first or cd into your project');
      process.exit(1);
    }

    // Check if program exists
    if (!existsSync('programs')) {
      console.error('❌ No programs directory found');
      process.exit(1);
    }

    console.log('📋 Checking program structure...');
    results.push(...await checkProgramStructure());

    console.log('🔐 Analyzing security patterns...');
    results.push(...await checkSecurityPatterns());

    console.log('⚡ Checking performance optimizations...');
    results.push(...await checkPerformanceIssues());

    console.log('🛡️  Checking access control...');
    results.push(...await checkAccessControl());

    // Display results
    displayResults(results);

  } catch (error: any) {
    console.error('❌ Audit failed');
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

async function checkProgramStructure(): Promise<AuditResult[]> {
  const results: AuditResult[] = [];

  try {
    // Check Anchor.toml configuration
    const anchorToml = readFileSync('Anchor.toml', 'utf8');

    // Check for wallet configuration
    if (!anchorToml.includes('wallet')) {
      results.push({
        severity: 'medium',
        title: 'Wallet Configuration Missing',
        description: 'No wallet path specified in Anchor.toml',
        recommendation: 'Add wallet = "~/.config/solana/id.json" to [provider] section'
      });
    }

    // Check for proper cluster configuration
    if (!anchorToml.includes('cluster =')) {
      results.push({
        severity: 'low',
        title: 'Cluster Not Specified',
        description: 'No cluster specified in Anchor.toml',
        recommendation: 'Specify cluster = "devnet" or "mainnet-beta"'
      });
    }

  } catch (error) {
    results.push({
      severity: 'medium',
      title: 'Anchor.toml Read Error',
      description: 'Could not read Anchor.toml configuration',
      recommendation: 'Ensure Anchor.toml exists and is properly formatted'
    });
  }

  return results;
}

async function checkSecurityPatterns(): Promise<AuditResult[]> {
  const results: AuditResult[] = [];

  try {
    // Find Rust program files
    const { glob } = require('glob');
    const rustFiles = await glob('programs/**/*.rs');

    for (const file of rustFiles) {
      const content = readFileSync(file, 'utf8');

      // Check for unsafe code
      if (content.includes('unsafe')) {
        results.push({
          severity: 'high',
          title: 'Unsafe Code Detected',
          description: 'Program contains unsafe Rust code',
          location: file,
          recommendation: 'Review all unsafe blocks for security implications'
        });
      }

      // Check for missing ownership checks
      if (content.includes('ctx.accounts.') && !content.includes('assert_eq!') && !content.includes('require!')) {
        results.push({
          severity: 'critical',
          title: 'Missing Ownership Validation',
          description: 'Account ownership not validated before use',
          location: file,
          recommendation: 'Add ownership checks: require!(account.owner == expected_owner)'
        });
      }

      // Check for PDA derivation without seeds
      if (content.includes('find_program_address') && !content.includes('&[')) {
        results.push({
          severity: 'high',
          title: 'Improper PDA Derivation',
          description: 'PDA derivation may be insecure',
          location: file,
          recommendation: 'Use proper seed arrays for PDA derivation'
        });
      }

      // Check for integer overflow/underflow
      if (content.includes('checked_') === false && (content.includes('+') || content.includes('-') || content.includes('*'))) {
        results.push({
          severity: 'medium',
          title: 'Potential Integer Overflow',
          description: 'Arithmetic operations without overflow checks',
          location: file,
          recommendation: 'Use checked_add, checked_sub, checked_mul for safe arithmetic'
        });
      }
    }

  } catch (error) {
    results.push({
      severity: 'low',
      title: 'Code Analysis Error',
      description: 'Could not analyze program source code',
      recommendation: 'Ensure programs directory contains valid Rust files'
    });
  }

  return results;
}

async function checkPerformanceIssues(): Promise<AuditResult[]> {
  const results: AuditResult[] = [];

  try {
    const { glob } = require('glob');
    const rustFiles = await glob('programs/**/*.rs');

    for (const file of rustFiles) {
      const content = readFileSync(file, 'utf8');

      // Check for expensive operations in instruction handlers
      if (content.includes('vec![') && content.includes('#[instruction]')) {
        results.push({
          severity: 'medium',
          title: 'Vector Allocation in Instruction',
          description: 'Vector allocation in instruction handler may be expensive',
          location: file,
          recommendation: 'Consider pre-allocating vectors or using arrays for fixed-size data'
        });
      }

      // Check for large account data loads
      if (content.includes('Account<') && content.includes('Vec<')) {
        results.push({
          severity: 'low',
          title: 'Large Account Data',
          description: 'Account contains large vector data that may impact performance',
          location: file,
          recommendation: 'Consider pagination or separate accounts for large datasets'
        });
      }
    }

  } catch (error) {
    // Ignore glob errors
  }

  return results;
}

async function checkAccessControl(): Promise<AuditResult[]> {
  const results: AuditResult[] = [];

  try {
    const { glob } = require('glob');
    const rustFiles = await glob('programs/**/*.rs');

    for (const file of rustFiles) {
      const content = readFileSync(file, 'utf8');

      // Check for signer constraints
      if (content.includes('#[account(') && !content.includes('signer') && !content.includes('mut')) {
        results.push({
          severity: 'medium',
          title: 'Missing Signer Constraints',
          description: 'Account constraint may allow unauthorized access',
          location: file,
          recommendation: 'Add signer constraints: #[account(signer)] for authorization accounts'
        });
      }

      // Check for proper PDA constraints
      if (content.includes('seeds') && !content.includes('bump')) {
        results.push({
          severity: 'high',
          title: 'Missing PDA Bump',
          description: 'PDA account missing bump field for validation',
          location: file,
          recommendation: 'Add bump field to PDA account constraints'
        });
      }
    }

  } catch (error) {
    // Ignore glob errors
  }

  return results;
}

function displayResults(results: AuditResult[]): void {
  if (results.length === 0) {
    console.log('\n✅ No security issues found!');
    console.log('Your program appears to follow security best practices.');
    return;
  }

  console.log(`\n📊 Audit Results: ${results.length} issue(s) found\n`);

  // Group by severity
  const grouped = results.reduce((acc, result) => {
    if (!acc[result.severity]) acc[result.severity] = [];
    acc[result.severity].push(result);
    return acc;
  }, {} as Record<string, AuditResult[]>);

  const severityOrder = ['critical', 'high', 'medium', 'low'];
  const severityColors: Record<string, string> = {
    critical: '🔴',
    high: '🟠',
    medium: '🟡',
    low: '🟢'
  };

  for (const severity of severityOrder) {
    if (grouped[severity]) {
      console.log(`${severityColors[severity]} ${severity.toUpperCase()} (${grouped[severity].length}):`);

      grouped[severity].forEach((result, index) => {
        console.log(`  ${index + 1}. ${result.title}`);
        console.log(`     ${result.description}`);
        if (result.location) {
          console.log(`     Location: ${result.location}`);
        }
        console.log(`     💡 ${result.recommendation}\n`);
      });
    }
  }

  // Summary
  const criticalCount = grouped.critical?.length || 0;
  const highCount = grouped.high?.length || 0;

  if (criticalCount > 0 || highCount > 0) {
    console.log('⚠️  CRITICAL/HIGH severity issues found. Address immediately before deployment!');
  } else {
    console.log('✅ No critical security issues found. Review medium/low issues for best practices.');
  }
}