#!/usr/bin/env node

/**
 * FORGE Health Check Script
 * Verifies that all components are properly installed and configured
 */

const { execSync, spawn } = require('child_process');
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

function log(color, symbol, message) {
    console.log(`${color}${symbol}${colors.reset} ${message}`);
}

function success(message) {
    log(colors.green, '✅', message);
}

function error(message) {
    log(colors.red, '❌', message);
}

function warning(message) {
    log(colors.yellow, '⚠️', message);
}

function info(message) {
    log(colors.blue, 'ℹ️', message);
}

// Check if command exists
function commandExists(cmd) {
    try {
        execSync(`${cmd} --version`, { stdio: 'pipe' });
        return true;
    } catch {
        return false;
    }
}

// Check Node.js
function checkNode() {
    info('Checking Node.js...');
    if (!commandExists('node')) {
        error('Node.js is not installed');
        return false;
    }

    const version = execSync('node --version', { encoding: 'utf8' }).trim();
    const versionNum = version.replace('v', '').split('.')[0];

    if (parseInt(versionNum) < 18) {
        error(`Node.js version ${version} is too old. Need 18+`);
        return false;
    }

    success(`Node.js ${version} is installed`);
    return true;
}

// Check npm
function checkNpm() {
    info('Checking npm...');
    if (!commandExists('npm')) {
        error('npm is not installed');
        return false;
    }

    const version = execSync('npm --version', { encoding: 'utf8' }).trim();
    success(`npm ${version} is installed`);
    return true;
}

// Check Rust
function checkRust() {
    info('Checking Rust...');
    if (!commandExists('rustc')) {
        error('Rust is not installed');
        return false;
    }

    const version = execSync('rustc --version', { encoding: 'utf8' }).trim().split(' ')[1];
    success(`Rust ${version} is installed`);
    return true;
}

// Check Anchor CLI
function checkAnchor() {
    info('Checking Anchor CLI...');
    if (!commandExists('anchor')) {
        error('Anchor CLI is not installed');
        return false;
    }

    try {
        const version = execSync('anchor --version', { encoding: 'utf8' }).trim();
        success(`Anchor CLI is installed`);
        return true;
    } catch (e) {
        error('Anchor CLI is not working properly');
        return false;
    }
}

// Check Solana CLI
function checkSolana() {
    info('Checking Solana CLI...');
    if (!commandExists('solana')) {
        error('Solana CLI is not installed');
        return false;
    }

    try {
        const version = execSync('solana --version', { encoding: 'utf8' }).trim().split('\n')[0];
        success(`Solana CLI is installed`);
        return true;
    } catch (e) {
        error('Solana CLI is not working properly');
        return false;
    }
}

// Check FORGE CLI
function checkForgeCLI() {
    info('Checking FORGE CLI...');
    if (!commandExists('forge')) {
        error('FORGE CLI is not installed. Run: cd packages/cli && npm run build && npm link');
        return false;
    }

    try {
        const version = execSync('forge --version', { encoding: 'utf8' }).trim();
        success(`FORGE CLI ${version} is installed`);
        return true;
    } catch (e) {
        error('FORGE CLI is not working properly');
        return false;
    }
}

// Check dependencies
function checkDependencies() {
    info('Checking dependencies...');

    const checks = [
        { file: 'package-lock.json', name: 'Root dependencies' },
        { file: 'packages/cli/package-lock.json', name: 'CLI dependencies' },
        { file: 'packages/sdk/package-lock.json', name: 'SDK dependencies' },
        { file: 'packages/backend/package-lock.json', name: 'Backend dependencies' }
    ];

    let allGood = true;

    for (const check of checks) {
        if (fs.existsSync(check.file)) {
            success(`${check.name} installed`);
        } else {
            error(`${check.name} not installed. Run: npm install`);
            allGood = false;
        }
    }

    return allGood;
}

// Check builds
function checkBuilds() {
    info('Checking builds...');

    const builds = [
        { dir: 'packages/cli', file: 'dist/index.js', name: 'CLI' },
        { dir: 'packages/sdk', file: 'dist/index.js', name: 'SDK' },
        { dir: 'packages/backend', file: 'dist/index.js', name: 'Backend' }
    ];

    let allGood = true;

    for (const build of checks) {
        const filePath = path.join(build.dir, build.file);
        if (fs.existsSync(filePath)) {
            success(`${build.name} is built`);
        } else {
            error(`${build.name} is not built. Run: npm run build`);
            allGood = false;
        }
    }

    return allGood;
}

// Check environment files
function checkEnvironment() {
    info('Checking environment files...');

    const envFiles = [
        '.env.local',
        'packages/backend/.env.local'
    ];

    let allGood = true;

    for (const file of envFiles) {
        if (fs.existsSync(file)) {
            success(`${file} exists`);
        } else {
            warning(`${file} not found. Some features may not work.`);
            allGood = false;
        }
    }

    return allGood;
}

// Main function
async function main() {
    console.log(colors.bold + colors.blue + '🔍 FORGE Health Check' + colors.reset);
    console.log('====================');

    const checks = [
        checkNode,
        checkNpm,
        checkRust,
        checkAnchor,
        checkSolana,
        checkForgeCLI,
        checkDependencies,
        checkBuilds,
        checkEnvironment
    ];

    let passed = 0;
    let total = checks.length;

    for (const check of checks) {
        if (await check()) {
            passed++;
        }
        console.log('');
    }

    console.log(`Results: ${passed}/${total} checks passed`);

    if (passed === total) {
        success('All systems operational! 🎉');
        console.log('');
        console.log('Ready to start developing with FORGE!');
        console.log('Run: npm run dev');
    } else {
        error('Some issues found. Please run ./setup.sh to fix them.');
        process.exit(1);
    }
}

main().catch(err => {
    error('Health check failed: ' + err.message);
    process.exit(1);
});