#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const ascii_js_1 = require("./ascii.js");
const init_js_1 = require("./commands/init.js");
const deploy_js_1 = require("./commands/deploy.js");
const harden_js_1 = require("./commands/harden.js");
const status_js_1 = require("./commands/status.js");
const generate_sdk_js_1 = require("./commands/generate-sdk.js");
const test_js_1 = require("./commands/test.js");
const verify_js_1 = require("./commands/verify.js");
const upgrade_js_1 = require("./commands/upgrade.js");
const profile_js_1 = require("./commands/profile.js");
const monitor_js_1 = require("./commands/monitor.js");
const simulate_js_1 = require("./commands/simulate.js");
const interactive_js_1 = require("./commands/interactive.js");
const docs_js_1 = require("./commands/docs.js");
const migrate_js_1 = require("./commands/migrate.js");
const quality_js_1 = require("./commands/quality.js");
const cost_js_1 = require("./commands/cost.js");
const keypair_js_1 = require("./commands/keypair.js");
const network_js_1 = require("./commands/network.js");
const search_js_1 = require("./commands/search.js");
const analytics_js_1 = require("./commands/analytics.js");
const ci_js_1 = require("./commands/ci.js");
const agent_js_1 = require("./commands/agent.js");
const program = new commander_1.Command();
program
    .name('forge')
    .description('FORGE - Intent-driven app assembly on Solana')
    .version('3.4.2');
program
    .command('init [projectName]')
    .description('Initialize a new FORGE project')
    .option('-i, --intent <intent>', 'Describe what the program should do (enables CPI generation)')
    .option('-a, --anchor-version <version>', 'Specify Anchor version (default: 0.32.1)', '0.32.1')
    .option('-t, --template <template>', 'Use a program template (token-program, nft-marketplace, dao-governance, staking-rewards, escrow-swap, token-vesting)')
    .action(async (projectName, options) => {
    await (0, init_js_1.initCommand)(projectName, options.intent, options.anchorVersion, options.template);
});
program
    .command('list-templates')
    .description('List available program templates')
    .action(async () => {
    await (0, init_js_1.listTemplatesCommand)();
});
program
    .command('deploy')
    .description('Deploy program to Solana')
    .option('-e, --env <environment>', 'Target environment: localnet, devnet, mainnet-beta (default: devnet)', 'devnet')
    .action(async (options) => {
    await (0, deploy_js_1.deployCommand)(options.env);
});
program
    .command('harden')
    .description('Apply security best-practices and forge-runtime safeguards')
    .action(async () => {
    await (0, harden_js_1.hardenCommand)();
});
program
    .command('audit')
    .command('test')
    .description('Generate and run comprehensive test suite')
    .action(async () => {
    await (0, test_js_1.testCommand)();
});
program
    .command('verify')
    .description('Verify contract source code on Solana Explorer')
    .action(async () => {
    await (0, verify_js_1.verifyCommand)();
});
program
    .command('upgrade [version]')
    .description('Upgrade Anchor program to a new version')
    .action(async (version) => {
    await (0, upgrade_js_1.upgradeCommand)(version);
});
program
    .command('profile')
    .description('Analyze program performance and compute unit usage')
    .action(async () => {
    await (0, profile_js_1.profileCommand)();
});
program
    .command('simulate [instruction]')
    .description('Simulate a program instruction to preview logs and CU usage')
    .action(async (instruction) => {
    await (0, simulate_js_1.simulateCommand)(instruction);
});
program
    .command('monitor')
    .description('Monitor program activity and analytics')
    .action(async () => {
    await (0, monitor_js_1.monitorCommand)();
});
program
    .command('interactive')
    .description('Interactive project setup wizard')
    .action(async () => {
    await (0, interactive_js_1.interactiveCommand)();
});
program
    .command('docs')
    .description('Generate API documentation from IDL')
    .action(async () => {
    await (0, docs_js_1.docsCommand)();
});
program
    .command('migrate [version]')
    .description('Migrate program between Anchor versions')
    .action(async (version) => {
    await (0, migrate_js_1.migrateCommand)(version);
});
program
    .command('quality')
    .description('Analyze code quality metrics')
    .action(async () => {
    await (0, quality_js_1.qualityCommand)();
});
program
    .command('cost')
    .description('Calculate deployment and operation costs')
    .action(async () => {
    await (0, cost_js_1.costCommand)();
});
program
    .command('keypair [action] [path]')
    .description('Manage keypairs (generate, import, info)')
    .action(async (action, path) => {
    await (0, keypair_js_1.keypairCommand)(action, path);
});
program
    .command('network [action] [network]')
    .description('Manage Solana network connections (switch, status, test)')
    .action(async (action, network) => {
    await (0, network_js_1.networkCommand)(action, network);
});
program
    .command('search [query]')
    .description('Search for verified Solana programs')
    .action(async (query) => {
    await (0, search_js_1.searchCommand)(query);
});
program
    .command('analytics')
    .description('View program analytics and metrics')
    .action(async () => {
    await (0, analytics_js_1.analyticsCommand)();
});
program
    .command('ci [platform]')
    .description('Generate CI/CD workflows (github)')
    .action(async (platform) => {
    await (0, ci_js_1.ciCommand)(platform);
});
program
    .command('generate-sdk [outputDir]')
    .description('Generate TypeScript SDK from Anchor program')
    .option('--v2', 'Generate modern Web3.js v2 functional SDK')
    .action(async (outputDir, options) => {
    await (0, generate_sdk_js_1.generateSdkCommand)(outputDir, options.v2);
});
program
    .command('status')
    .description('Check FORGE status and environment')
    .action(async () => {
    await (0, status_js_1.statusCommand)();
});
program
    .command('agent [action]')
    .description('Manage agentic capabilities (analyze, manifest, harden)')
    .option('-o, --output <path>', 'Output path for manifest', 'agent-manifest.json')
    .action(async (action, options) => {
    await (0, agent_js_1.agentCommand)(action, options);
});
program
    .command('update')
    .description('Update FORGE to the latest version')
    .action(async () => {
    await (0, status_js_1.updateCommand)();
});
// Show logo on help
program.on('--help', () => {
    console.log(ascii_js_1.logo);
    console.log('\nCore Commands:');
    console.log('  init          Create new Anchor projects');
    console.log('  interactive   Interactive project setup wizard');
    console.log('  list-templates List available program templates');
    console.log('\nDevelopment:');
    console.log('  test          Generate and run comprehensive tests');
    console.log('  audit         Run security audit (--deep for advanced)');
    console.log('  harden        Apply security safeguards to your project');
    console.log('  simulate      Simulate instructions to preview logs and CUs');
    console.log('  quality       Analyze code quality metrics');
    console.log('  profile       Analyze performance and compute units');
    console.log('  docs          Generate API documentation');
    console.log('\nDeployment:');
    console.log('  deploy        Deploy to Solana (--env: devnet/mainnet)');
    console.log('  verify        Verify contract on Solana Explorer');
    console.log('  upgrade       Upgrade Anchor program version');
    console.log('  migrate       Migrate between Anchor versions');
    console.log('\nUtilities:');
    console.log('  generate-sdk  Generate TypeScript SDK from program');
    console.log('  monitor       Monitor program activity');
    console.log('  analytics     View program analytics');
    console.log('  cost          Calculate deployment costs');
    console.log('  keypair       Manage keypairs (generate/import/info)');
    console.log('  network       Manage network connections');
    console.log('  search        Search verified Solana programs');
    console.log('  ci            Generate CI/CD workflows');
    console.log('  status        Check environment & versions');
    console.log('  update        Update FORGE to latest version');
    console.log('\nFORGE does not:');
    console.log('- host your code');
    console.log('- manage your keys');
    console.log('- abstract blockchain risks\n');
});
// Parse arguments
program.parse();
//# sourceMappingURL=cli.js.map