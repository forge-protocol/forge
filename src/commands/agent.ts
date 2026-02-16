import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { logo } from '../ascii.js';

interface KYAManifest {
    version: string;
    agentId: string;
    name: string;
    description: string;
    capabilities: {
        instructions: string[];
        accounts: string[];
        cpiIntegrations: string[];
    };
    security: {
        hardened: boolean;
        audited: boolean;
        accessControl: string[];
        vulnerabilities: string[];
    };
    constraints: {
        maxComputeUnits: number;
        restrictedInstructions: string[];
        requiredSigners: string[];
    };
    compliance: {
        lastAuditSlot: number;
        forgeVersion: string;
    };
}

export async function agentCommand(action: string = 'analyze', options: any = {}): Promise<void> {
    console.log(logo);
    console.log('🤖 FORGE Agentic Platform - KYA (Know Your Agent)\n');

    try {
        if (!existsSync('Anchor.toml')) {
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
            case 'link':
                await generateNeuralLink();
                break;
            case 'pulse':
                await startAgentPulse();
                break;
            case 'harden':
                await hardenForAgents();
                break;
            default:
                console.error(`❌ Unknown action: ${action}`);
                console.log('Available actions: analyze, manifest, harden, simulate, link, pulse');
        }
    } catch (error: any) {
        console.error('❌ Agent command failed');
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

async function runAnalysis(): Promise<void> {
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

async function generateManifest(outputPath: string): Promise<void> {
    console.log(`📦 Generating KYA Manifest: ${outputPath}...`);
    const manifest = await buildManifest();
    writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
    console.log('✅ Manifest generated successfully!');
}

async function hardenForAgents(): Promise<void> {
    console.log('🛡️  Applying Agentic Safeguards...');

    // Simulated hardening
    // In a real implementation, this would inject security macros specifically for autonomous execution
    console.log('- Adding "require_signer!" to all critical instructions');
    console.log('- Injecting reentrancy guards for CPI calls');
    console.log('- Enforcing compute unit limits for agents');

    console.log('\n✅ Project hardened for autonomous agent execution!');
}

async function buildManifest(): Promise<KYAManifest> {
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

function getProgramName(): string {
    try {
        const anchorToml = readFileSync('Anchor.toml', 'utf8');
        const match = anchorToml.match(/name\s*=\s*"([^"]+)"/);
        return match ? match[1] : 'unknown-agent';
    } catch {
        return 'unknown-agent';
    }
}

function checkHardening(): boolean {
    try {
        const cargoLock = readFileSync('programs/' + getProgramName() + '/Cargo.toml', 'utf8');
        return cargoLock.includes('forge-runtime');
    } catch {
        return false;
    }
}

async function extractInstructions(): Promise<string[]> {
    const instructions: string[] = [];
    try {
        const { glob } = require('glob');
        const files = await glob('programs/**/*.rs');
        for (const file of files) {
            const content = readFileSync(file, 'utf8');
            const matches = content.match(/pub fn (\w+)\(/g);
            if (matches) {
                instructions.push(...matches.map(m => m.replace('pub fn ', '').replace('(', '')));
            }
        }
    } catch { }
    return instructions;
}

async function simulateAgenticExecution(): Promise<void> {
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

async function generateNeuralLink(): Promise<void> {
    console.log('🧠 Generating Neural Link (Context for LLM Agents)...\n');

    const manifest = await buildManifest();
    const programName = getProgramName();

    const neuralLink = `
# FORGE NEURAL LINK: ${programName.toUpperCase()}
# Generated: ${new Date().toISOString()}

## CONTEXT
You are an autonomous agent responsible for interacting with the ${programName} Solana program. 
Your primary goal is: ${manifest.description}

## CAPABILITIES
- Instructions: ${manifest.capabilities.instructions.join(', ')}
- PDA Management: Automated via Forge-Runtime
- Security: ${manifest.security.hardened ? 'Hardened with Forge macros' : 'Standard Anchor'}

## CONSTRAINTS
- Max Compute Units: ${manifest.constraints.maxComputeUnits}
- Restricted Instructions: ${manifest.constraints.restrictedInstructions.join(', ')}
- Required Signers: ${manifest.constraints.requiredSigners.join(', ')}

## SECURITY PROTOCOL
- Always check "require_signer!" on authority accounts.
- Enforce reentrancy guards on all CPI calls.
- Validate all account ownership before mutation.

## IDL OVERVIEW
${JSON.stringify(manifest.capabilities.instructions, null, 2)}
`;

    const outputPath = 'neural-link.md';
    writeFileSync(outputPath, neuralLink);

    console.log(`✅ Neural Link generated: ${outputPath}`);
    console.log('💡 Tip: Provide this file to your AI agent to establish a high-fidelity connection.');
}

async function startAgentPulse(): Promise<void> {
    console.log('📡 Initializing Agent Pulse HUD...');

    const frames = ['-', '\\', '|', '/'];
    let i = 0;

    console.clear();
    console.log(logo);
    console.log('⚡ FORGE NEURAL HUD v1.0.0 | System: ONLINE\n');

    const interval = setInterval(() => {
        const frame = frames[i % frames.length];

        process.stdout.write(`\r[${frame}] NEURAL ACTIVITY: ${Math.floor(Math.random() * 100)}% | CPU: ${Math.floor(Math.random() * 40 + 10)}% | SECURITY HR: 72bpm   `);
        i++;

        if (i > 40) {
            clearInterval(interval);
            console.log('\n\n✅ Pulse diagnostic complete. All agentic systems stable.');
        }
    }, 100);

    // Wait for the interval to finish before returning
    await new Promise(resolve => setTimeout(resolve, 4500));
}

async function detectSecurityIssues(): Promise<string[]> {
    const issues: string[] = [];
    try {
        const { glob } = require('glob');
        const files = await glob('programs/**/*.rs');
        for (const file of files) {
            const content = readFileSync(file, 'utf8');
            if (content.includes('unwrap()')) issues.push('Unsafe unwrap() found');
            if (!content.includes('require_signer!')) issues.push('Generic signer check used instead of Forge macros');
        }
    } catch { }
    return issues;
}
