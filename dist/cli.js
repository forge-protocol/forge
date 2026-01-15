#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const ascii_js_1 = require("./ascii.js");
const init_js_1 = require("./commands/init.js");
const deploy_js_1 = require("./commands/deploy.js");
const status_js_1 = require("./commands/status.js");
const generate_sdk_js_1 = require("./commands/generate-sdk.js");
const audit_js_1 = require("./commands/audit.js");
const program = new commander_1.Command();
program
    .name('forge')
    .description('FORGE - Intent-driven app assembly on Solana')
    .version('2.2.1');
program
    .command('init [projectName]')
    .description('Initialize a new FORGE project')
    .option('-i, --intent <intent>', 'Describe what the program should do (enables CPI generation)')
    .option('-a, --anchor-version <version>', 'Specify Anchor version (default: 0.32.1)', '0.32.1')
    .action(async (projectName, options) => {
    await (0, init_js_1.initCommand)(projectName, options.intent, options.anchorVersion);
});
program
    .command('deploy')
    .description('Deploy program to Solana')
    .option('-e, --env <environment>', 'Target environment: localnet, devnet, mainnet-beta (default: devnet)', 'devnet')
    .action(async (options) => {
    await (0, deploy_js_1.deployCommand)(options.env);
});
program
    .command('audit')
    .description('Run security audit on Anchor program')
    .action(async () => {
    await (0, audit_js_1.auditCommand)();
});
program
    .command('generate-sdk [outputDir]')
    .description('Generate TypeScript SDK from Anchor program')
    .action(async (outputDir) => {
    await (0, generate_sdk_js_1.generateSdkCommand)(outputDir);
});
program
    .command('status')
    .description('Check FORGE status and environment')
    .action(async () => {
    await (0, status_js_1.statusCommand)();
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
    console.log('\nCommands:');
    console.log('  init          Create new Anchor projects');
    console.log('  audit         Run security audit on program');
    console.log('  deploy        Deploy to Solana network');
    console.log('  generate-sdk  Generate TypeScript SDK from program');
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