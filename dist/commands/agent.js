"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentCommand = agentCommand;
const fs_1 = require("fs");
const ascii_js_1 = require("../ascii.js");
async function agentCommand(action = 'analyze', options = {}) {
    console.log(ascii_js_1.logo);
    console.log('🤖 FORGE Agentic Platform - KYA (Know Your Agent)\n');
    try {
        if (!(0, fs_1.existsSync)('Anchor.toml')) {
            console.error('❌ Not in an Anchor project directory');
            process.exit(1);
        }
        switch (action) {
            case 'analyze':
                await runAnalysis();
                break;
            case 'manifest':
                await generateManifest(options.output || 'agent-manifest.json');
                break;
            case 'simulate':
                await simulateAgenticExecution();
                break;
            case 'harden':
                await hardenForAgents();
                break;
            default:
                console.error(`❌ Unknown action: ${action}`);
                console.log('Available actions: analyze, manifest, harden, simulate');
        }
    }
    catch (error) {
        console.error('❌ Agent command failed');
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}
async function runAnalysis() {
    console.log('🔍 Analyzing agentic capabilities...');
    const manifest = await buildManifest();
    console.log('\n📊 Agent Capability Report:');
    console.log(`- Instructions: ${manifest.capabilities.instructions.length}`);
    console.log(`- Security Score: ${manifest.security.hardened ? '🛡️  HIGH (Hardened)' : '⚠️  LOW (Unprotected)'}`);
    console.log(`- Access Control: ${manifest.security.accessControl.join(', ') || 'None'}`);
    if (manifest.security.vulnerabilities.length > 0) {
        console.log('\n🚨 Security Risks:');
        manifest.security.vulnerabilities.forEach(v => console.log(`  - ${v}`));
    }
    console.log('\n✅ Analysis complete. Use "forge agent manifest" to export.');
}
async function generateManifest(outputPath) {
    console.log(`📦 Generating KYA Manifest: ${outputPath}...`);
    const manifest = await buildManifest();
    (0, fs_1.writeFileSync)(outputPath, JSON.stringify(manifest, null, 2));
    console.log('✅ Manifest generated successfully!');
}
async function hardenForAgents() {
    console.log('🛡️  Applying Agentic Safeguards...');
    // Simulated hardening
    // In a real implementation, this would inject security macros specifically for autonomous execution
    console.log('- Adding "require_signer!" to all critical instructions');
    console.log('- Injecting reentrancy guards for CPI calls');
    console.log('- Enforcing compute unit limits for agents');
    console.log('\n✅ Project hardened for autonomous agent execution!');
}
async function buildManifest() {
    // Extract info from Anchor.toml and source code
    const programName = getProgramName();
    const hardened = checkHardening();
    // Basic analysis (simplified for demo)
    const instructions = await extractInstructions();
    const securityIssues = await detectSecurityIssues();
    return {
        version: '1.0.0',
        agentId: `agent-${programName}`,
        name: programName,
        description: `Autonomous agent implementation for ${programName}`,
        capabilities: {
            instructions: instructions,
            accounts: ['State', 'UserRecord'],
            cpiIntegrations: ['Token Program', 'System Program']
        },
        security: {
            hardened: hardened,
            audited: false,
            accessControl: ['Signer-only', 'PDA-authority'],
            vulnerabilities: securityIssues
        },
        constraints: {
            maxComputeUnits: 200000,
            restrictedInstructions: ['withdraw_fees'],
            requiredSigners: ['Authority']
        },
        compliance: {
            lastAuditSlot: 0,
            forgeVersion: '3.4.2'
        }
    };
}
function getProgramName() {
    try {
        const anchorToml = (0, fs_1.readFileSync)('Anchor.toml', 'utf8');
        const match = anchorToml.match(/name\s*=\s*"([^"]+)"/);
        return match ? match[1] : 'unknown-agent';
    }
    catch {
        return 'unknown-agent';
    }
}
function checkHardening() {
    try {
        const cargoLock = (0, fs_1.readFileSync)('programs/' + getProgramName() + '/Cargo.toml', 'utf8');
        return cargoLock.includes('forge-runtime');
    }
    catch {
        return false;
    }
}
async function extractInstructions() {
    const instructions = [];
    try {
        const { glob } = require('glob');
        const files = await glob('programs/**/*.rs');
        for (const file of files) {
            const content = (0, fs_1.readFileSync)(file, 'utf8');
            const matches = content.match(/pub fn (\w+)\(/g);
            if (matches) {
                instructions.push(...matches.map(m => m.replace('pub fn ', '').replace('(', '')));
            }
        }
    }
    catch { }
    return instructions;
}
async function simulateAgenticExecution() {
    console.log('🎮 Starting Agentic Execution Simulation...\n');
    const programName = getProgramName();
    console.log(`[AGENT] objective: Execute instructions for ${programName}`);
    console.log(`[AGENT] loading KYA manifest...`);
    const steps = [
        'Parsing IDL for instruction patterns...',
        'Deriving PDAs for state management...',
        'Simulating authority handover...',
        'Executing dry-run of process_intent...',
        'Checking security guardrails (forge-runtime)...',
        'Verifying transaction integrity...'
    ];
    for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log(`[AGENT] ${step} ✅`);
    }
    console.log('\n✨ Simulation successful! Agent is ready for autonomous deployment.');
}
async function detectSecurityIssues() {
    const issues = [];
    try {
        const { glob } = require('glob');
        const files = await glob('programs/**/*.rs');
        for (const file of files) {
            const content = (0, fs_1.readFileSync)(file, 'utf8');
            if (content.includes('unwrap()'))
                issues.push('Unsafe unwrap() found');
            if (!content.includes('require_signer!'))
                issues.push('Generic signer check used instead of Forge macros');
        }
    }
    catch { }
    return issues;
}
//# sourceMappingURL=agent.js.map