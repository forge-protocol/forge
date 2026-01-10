#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const ascii_js_1 = require("./ascii.js");
const init_js_1 = require("./commands/init.js");
const deploy_js_1 = require("./commands/deploy.js");
const status_js_1 = require("./commands/status.js");
const program = new commander_1.Command();
program
    .name('forge')
    .description('FORGE - Intent-driven app assembly on Solana')
    .version('0.1.0');
program
    .command('init [projectName]')
    .description('Initialize a new FORGE project')
    .action(async (projectName) => {
    await (0, init_js_1.initCommand)(projectName);
});
program
    .command('deploy')
    .description('Deploy program to Solana')
    .action(async () => {
    await (0, deploy_js_1.deployCommand)();
});
program
    .command('status')
    .description('Check FORGE status and environment')
    .action(async () => {
    await (0, status_js_1.statusCommand)();
});
// Show logo on help
program.on('--help', () => {
    console.log(ascii_js_1.logo);
    console.log('\nFORGE does not:');
    console.log('- host your code');
    console.log('- manage your keys');
    console.log('- abstract blockchain risks\n');
});
// Parse arguments
program.parse();
//# sourceMappingURL=cli.js.map