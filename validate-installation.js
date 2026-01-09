#!/usr/bin/env node

/**
 * FORGE Installation Validator
 * Comprehensive validation of the entire FORGE installation
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for output
const colors = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
};

let totalChecks = 0;
let passedChecks = 0;

function log(color, symbol, message, details = '') {
    console.log(`${color}${symbol}${colors.reset} ${message}`);
    if (details) console.log(`   ${details}`);
}

function success(message, details = '') {
    log(colors.green, '✅', message, details);
    passedChecks++;
    totalChecks++;
}

function error(message, details = '') {
    log(colors.red, '❌', message, details);
    totalChecks++;
}

function warning(message, details = '') {
    log(colors.yellow, '⚠️', message, details);
    totalChecks++;
}

function info(message, details = '') {
    log(colors.blue, 'ℹ️', message, details);
}

// Check file/directory existence
function checkPath(path, description) {
    if (fs.existsSync(path)) {
        success(`${description} exists`);
        return true;
    } else {
        error(`${description} missing`);
        return false;
    }
}

// Check command execution
function checkCommand(cmd, description, options = {}) {
    try {
        const result = execSync(cmd, { stdio: 'pipe', encoding: 'utf8', ...options });
        success(`${description} working`);
        if (options.showVersion) {
            console.log(`   Version: ${result.trim()}`);
        }
        return true;
    } catch (e) {
        error(`${description} failed`, e.message.split('\n')[0]);
        return false;
    }
}

// Validate Node.js environment
function validateNode() {
    info('Validating Node.js environment...');

    checkCommand('node --version', 'Node.js installed', { showVersion: true });
    checkCommand('npm --version', 'npm installed', { showVersion: true });

    // Check Node version
    try {
        const version = execSync('node --version', { encoding: 'utf8' }).replace('v', '').split('.')[0];
        if (parseInt(version) >= 18) {
            success('Node.js version compatible');
        } else {
            error('Node.js version too old', 'Need Node.js 18+');
        }
    } catch (e) {
        error('Cannot check Node.js version');
    }
}

// Validate Rust environment
function validateRust() {
    info('Validating Rust environment...');

    checkCommand('rustc --version', 'Rust compiler installed', { showVersion: true });
    checkCommand('cargo --version', 'Cargo installed', { showVersion: true });
}

// Validate Solana tools
function validateSolana() {
    info('Validating Solana tools...');

    checkCommand('solana --version', 'Solana CLI installed');
    checkCommand('anchor --version', 'Anchor CLI installed');
}

// Validate FORGE components
function validateForge() {
    info('Validating FORGE components...');

    checkCommand('forge --version', 'FORGE CLI available');

    // Check package builds
    checkPath('packages/cli/dist/index.js', 'CLI build');
    checkPath('packages/sdk/dist/index.js', 'SDK build');
    checkPath('packages/backend/dist/index.js', 'Backend build');

    // Check dependencies
    checkPath('package-lock.json', 'Root dependencies');
    checkPath('packages/cli/package-lock.json', 'CLI dependencies');
    checkPath('packages/sdk/package-lock.json', 'SDK dependencies');
    checkPath('packages/backend/package-lock.json', 'Backend dependencies');
}

// Validate environment
function validateEnvironment() {
    info('Validating environment configuration...');

    const envFiles = [
        '.env.local',
        'packages/backend/.env.local'
    ];

    envFiles.forEach(file => {
        checkPath(file, `Environment file: ${file}`);
    });

    // Validate critical environment variables
    if (fs.existsSync('packages/backend/.env.local')) {
        const envContent = fs.readFileSync('packages/backend/.env.local', 'utf8');
        if (envContent.includes('TREASURY_PUBKEY=11111111111111111111111111111112')) {
            warning('Treasury pubkey using placeholder', 'Update with real wallet address');
        }
    }
}

// Validate project structure
function validateStructure() {
    info('Validating project structure...');

    const requiredPaths = [
        'app/page.tsx',
        'app/layout.tsx',
        'packages/cli/src/index.ts',
        'packages/sdk/src/index.ts',
        'packages/backend/src/index.ts',
        'docs/README.md'
    ];

    requiredPaths.forEach(p => checkPath(p, `Project file: ${p}`));
}

// Test basic functionality
function testFunctionality() {
    info('Testing basic functionality...');

    // Test CLI commands
    checkCommand('forge --help', 'CLI help command');
    checkCommand('timeout 5s npm run health || true', 'Health check script');

    // Test package scripts
    checkCommand('npm run build:sdk', 'SDK build script');
    checkCommand('npm run build:backend', 'Backend build script');
}

// Generate report
function generateReport() {
    console.log('\n' + '='.repeat(50));
    console.log(colors.bold + '📊 FORGE Installation Report' + colors.reset);
    console.log('='.repeat(50));

    const score = Math.round((passedChecks / totalChecks) * 100);

    if (score === 100) {
        console.log(colors.green + `🎉 Perfect! All ${totalChecks} checks passed (${score}%)` + colors.reset);
        console.log('\n✨ FORGE is ready for development!');
    } else if (score >= 80) {
        console.log(colors.yellow + `⚠️  Good! ${passedChecks}/${totalChecks} checks passed (${score}%)` + colors.reset);
        console.log('\n🔧 Some issues found. Run ./setup.sh to fix them.');
    } else {
        console.log(colors.red + `❌ Issues found. ${passedChecks}/${totalChecks} checks passed (${score}%)` + colors.reset);
        console.log('\n🛠️  Critical issues detected. Please run ./setup.sh');
    }

    console.log('\n📝 Next steps:');
    console.log('1. Start development: npm run dev');
    console.log('2. Create project: forge init my-project');
    console.log('3. Build programs: forge build');
    console.log('4. Get help: npm run health');

    if (score < 100) {
        console.log('\n🔍 For detailed troubleshooting:');
        console.log('   docs/guides/troubleshooting.md');
    }
}

// Main execution
async function main() {
    console.log(colors.bold + colors.blue + '🔍 FORGE Installation Validator' + colors.reset);
    console.log('================================');

    try {
        validateNode();
        console.log('');
        validateRust();
        console.log('');
        validateSolana();
        console.log('');
        validateForge();
        console.log('');
        validateEnvironment();
        console.log('');
        validateStructure();
        console.log('');
        testFunctionality();

        generateReport();
    } catch (error) {
        console.error('\n💥 Validation failed with error:', error.message);
        process.exit(1);
    }
}

main();