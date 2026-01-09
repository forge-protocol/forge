"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployCommand = deployCommand;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const inquirer_1 = __importDefault(require("inquirer"));
const execAsync = (0, util_1.promisify)(child_process_1.exec);
async function deployCommand() {
    console.log(chalk_1.default.blue.bold('🚀 Deploying to Solana'));
    const answers = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'cluster',
            message: 'Select deployment cluster:',
            choices: [
                { name: 'Devnet', value: 'devnet' },
                { name: 'Mainnet', value: 'mainnet-beta' },
                { name: 'Localnet', value: 'localnet' }
            ],
            default: 'devnet'
        },
        {
            type: 'confirm',
            name: 'confirm',
            message: 'This will deploy to the selected cluster. Continue?',
            default: false
        }
    ]);
    if (!answers.confirm) {
        console.log(chalk_1.default.yellow('Deployment cancelled.'));
        return;
    }
    const spinner = (0, ora_1.default)(`Deploying to ${answers.cluster}...`).start();
    try {
        // Set the cluster
        await execAsync(`solana config set --url ${answers.cluster}`);
        // Deploy using Anchor
        const { stdout, stderr } = await execAsync('anchor deploy');
        if (stderr) {
            console.log(chalk_1.default.yellow('Deployment warnings:'), stderr);
        }
        spinner.succeed(chalk_1.default.green(`Successfully deployed to ${answers.cluster}!`));
        // Show deployment output
        if (stdout) {
            console.log(chalk_1.default.gray('Deployment details:'));
            console.log(stdout);
        }
        console.log(chalk_1.default.blue('\n✅ Deployment complete!'));
        console.log(chalk_1.default.white('Your program is now live on Solana!'));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red('Deployment failed'));
        console.error(chalk_1.default.red('Deployment error:'), error.message);
        if (error.message.includes('insufficient funds')) {
            console.log(chalk_1.default.yellow('\n💰 You may need to fund your wallet:'));
            console.log(chalk_1.default.white('  Devnet: https://faucet.solana.com/'));
        }
        process.exit(1);
    }
}
//# sourceMappingURL=deploy.js.map