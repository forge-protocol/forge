import chalk from 'chalk';
import ora from 'ora';
import { exec } from 'child_process';
import { promisify } from 'util';
import inquirer from 'inquirer';

const execAsync = promisify(exec);

export async function deployCommand() {
  console.log(chalk.blue.bold('🚀 Deploying to Solana'));

  const answers = await inquirer.prompt([
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
    console.log(chalk.yellow('Deployment cancelled.'));
    return;
  }

  const spinner = ora(`Deploying to ${answers.cluster}...`).start();

  try {
    // Set the cluster
    await execAsync(`solana config set --url ${answers.cluster}`);

    // Deploy using Anchor
    const { stdout, stderr } = await execAsync('anchor deploy');

    if (stderr) {
      console.log(chalk.yellow('Deployment warnings:'), stderr);
    }

    spinner.succeed(chalk.green(`Successfully deployed to ${answers.cluster}!`));

    // Show deployment output
    if (stdout) {
      console.log(chalk.gray('Deployment details:'));
      console.log(stdout);
    }

    console.log(chalk.blue('\n✅ Deployment complete!'));
    console.log(chalk.white('Your program is now live on Solana!'));

  } catch (error: any) {
    spinner.fail(chalk.red('Deployment failed'));

    console.error(chalk.red('Deployment error:'), error.message);

    if (error.message.includes('insufficient funds')) {
      console.log(chalk.yellow('\n💰 You may need to fund your wallet:'));
      console.log(chalk.white('  Devnet: https://faucet.solana.com/'));
    }

    process.exit(1);
  }
}