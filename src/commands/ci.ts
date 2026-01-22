import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export async function ciCommand(platform: string = 'github'): Promise<void> {
  console.log('🔄 FORGE CI/CD Integration\n');

  try {
    if (!existsSync('Anchor.toml')) {
      console.error('❌ Not in an Anchor project directory');
      process.exit(1);
    }

    if (platform === 'github') {
      await generateGitHubActions();
    } else {
      console.error(`❌ Platform "${platform}" not supported`);
      console.error('Supported platforms: github');
      process.exit(1);
    }

    console.log('\n✅ CI/CD workflow generated!');
    console.log('📝 Next steps:');
    console.log('   1. Review the generated workflow file');
    console.log('   2. Commit and push to GitHub');
    console.log('   3. Workflows will run automatically on push/PR');

  } catch (error: any) {
    console.error('❌ CI/CD setup failed');
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

async function generateGitHubActions(): Promise<void> {
  const workflowsDir = join('.github', 'workflows');
  mkdirSync(workflowsDir, { recursive: true });

  const workflow = `name: FORGE CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Install Rust
      uses: actions-rs/toolchain@v1
      with:
        toolchain: stable
        override: true
    
    - name: Install Solana CLI
      run: |
        sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
        echo "$HOME/.local/share/solana/install/active_release/bin" >> $GITHUB_PATH
    
    - name: Install Anchor
      run: |
        cargo install --git https://github.com/coral-xyz/anchor anchor-cli --tag v0.32.1 --locked
    
    - name: Cache Anchor build
      uses: actions/cache@v3
      with:
        path: |
          ~/.cargo/bin/
          target/
        key: \${{ runner.os }}-anchor-\${{ hashFiles('**/Cargo.lock') }}
    
    - name: Build program
      run: anchor build
    
    - name: Run tests
      run: anchor test --skip-local-validator
    
    - name: Run security audit
      run: forge audit
    
    - name: Check code quality
      run: forge quality

  deploy-devnet:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Install dependencies
      run: |
        sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
        cargo install --git https://github.com/coral-xyz/anchor anchor-cli --tag v0.32.1 --locked
    
    - name: Deploy to devnet
      run: forge deploy --env devnet
      env:
        SOLANA_NETWORK: devnet
`;

  writeFileSync(join(workflowsDir, 'forge-ci.yml'), workflow);
  console.log('✅ Generated: .github/workflows/forge-ci.yml');
}