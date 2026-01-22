"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCommand = initCommand;
exports.listTemplatesCommand = listTemplatesCommand;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path_1 = require("path");
const ascii_js_1 = require("../ascii.js");
const cpi_js_1 = require("../cpi.js");
const sdk_generator_js_1 = require("../sdk-generator.js");
const index_js_1 = require("../templates/index.js");
const token_program_js_1 = require("../templates/token-program.js");
async function initCommand(projectName, intent, anchorVersion, templateId) {
    console.log(ascii_js_1.logo);
    console.log('FORGE - Solana Development Platform\n');
    const name = projectName || 'forge-project';
    // Detect CPI patterns from intent
    let cpiCode = null;
    let detections = [];
    if (intent) {
        console.log(`Analyzing intent: "${intent}"`);
        detections = (0, cpi_js_1.detectCPI)(intent);
        if (detections.length > 0) {
            console.log(`Detected CPI patterns: ${detections.map(d => d.type).join(', ')}`);
            cpiCode = (0, cpi_js_1.generateCPICode)(detections);
        }
    }
    // Check if Anchor is installed
    try {
        (0, child_process_1.execSync)('anchor --version', { stdio: 'pipe' });
    }
    catch (error) {
        console.error('❌ Anchor CLI not found. Install with:');
        console.error('cargo install --git https://github.com/coral-xyz/anchor anchor-cli --tag v0.29.0');
        process.exit(1);
    }
    // Check Rust version for edition 2024 compatibility
    try {
        const rustVersionOutput = (0, child_process_1.execSync)('rustc --version', { encoding: 'utf-8' });
        const rustVersionMatch = rustVersionOutput.match(/rustc (\d+)\.(\d+)\.(\d+)/);
        if (rustVersionMatch) {
            const major = parseInt(rustVersionMatch[1]);
            const minor = parseInt(rustVersionMatch[2]);
            const patch = parseInt(rustVersionMatch[3]);
            // Rust 1.85.0+ required for edition 2024 (stabilized Feb 2025)
            if (major < 1 || (major === 1 && minor < 85)) {
                console.warn('⚠️  WARNING: Rust version too old for modern Anchor dependencies');
                console.warn(`   Current: ${major}.${minor}.${patch}, Required: 1.85.0+ (for edition 2024)`);
                console.warn('   Update with: rustup update stable');
                console.warn('   This may cause build failures with "edition2024" errors.\n');
            }
        }
    }
    catch (error) {
        console.warn('⚠️  Could not check Rust version. Ensure Rust 1.85.0+ is installed.');
    }
    // Handle template if provided
    if (templateId) {
        const template = (0, index_js_1.getTemplate)(templateId);
        if (!template) {
            console.error(`❌ Template "${templateId}" not found`);
            console.error(`Available templates: ${index_js_1.templates.map(t => t.id).join(', ')}`);
            process.exit(1);
        }
        console.log(`📚 Using template: ${template.name}`);
        console.log(`   ${template.description}\n`);
        return await initFromTemplate(name, template, anchorVersion || '0.32.1');
    }
    console.log(`Initializing ${name}...\n`);
    // Create project directory
    const projectPath = (0, path_1.join)(process.cwd(), name);
    if ((0, fs_1.existsSync)(projectPath)) {
        console.error(`❌ Directory ${name} already exists`);
        process.exit(1);
    }
    (0, fs_1.mkdirSync)(projectPath, { recursive: true });
    (0, fs_1.mkdirSync)((0, path_1.join)(projectPath, 'programs', name, 'src'), { recursive: true });
    // Generate program ID (simplified for demo)
    const programId = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS";
    // Create Cargo.toml with specified Anchor version
    const anchorVer = anchorVersion || '0.32.1';
    // Create Anchor.toml with matching CLI version
    const anchorToml = `[toolchain]
anchor_version = "${anchorVer}"

[features]
seeds = false
skip-lint = false

[programs.localnet]
${name} = "${programId}"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "Localnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
`;
    let dependencies = `anchor-lang = "${anchorVer}"
anchor-spl = "${anchorVer}"`;
    // Add CPI-specific dependencies
    if (cpiCode) {
        if (cpiCode.imports.some(imp => imp.includes('mpl_token_metadata'))) {
            dependencies += `
mpl-token-metadata = { version = "5", features = ["no-entrypoint"] }`;
        }
    }
    const cargoToml = `[package]
name = "${name}"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]
name = "${name.replace(/-/g, '_')}"

[features]
no-entrypoint = []
no-idl = []
no-log-ix-name = []
cpi = ["no-entrypoint"]
idl-build = ["anchor-lang/idl-build", "anchor-spl/idl-build"]
default = []

[dependencies]
${dependencies}
`;
    // Generate imports and CPI code
    let imports = `use anchor_lang::prelude::*;`;
    let cpiImports = '';
    let cpiCodeBlock = '';
    let extraAccounts = '';
    if (cpiCode) {
        cpiImports = '\n' + cpiCode.imports.join('\n');
        cpiCodeBlock = `\n\n    ${cpiCode.code}`;
        extraAccounts = '\n' + cpiCode.accounts.accounts.map(acc => `    ${acc},`).join('\n');
    }
    // Create lib.rs with CPI support
    const libRs = `${imports}${cpiImports}

declare_id!("${programId}");

#[program]
pub mod ${name.replace(/-/g, '_')} {
    use super::*;

    pub fn process_intent(ctx: Context<ProcessIntent>) -> Result<()> {
        msg!("Processing intent...");${cpiCodeBlock}

        msg!("Intent processed successfully!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct ProcessIntent {${extraAccounts}
}
`;
    // Write files
    (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'Anchor.toml'), anchorToml);
    (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'programs', name, 'Cargo.toml'), cargoToml);
    (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'programs', name, 'src', 'lib.rs'), libRs);
    // Generate Client SDK if CPI code was created
    if (cpiCode) {
        console.log('🔧 Generating TypeScript client SDK...');
        const primaryDetection = detections[0];
        const sdkConfig = {
            programName: name.replace(/-/g, '_'),
            programId: programId,
            instructions: [{
                    name: 'processIntent',
                    accounts: [], // Will be populated based on CPI type
                    args: [],
                    cpiType: primaryDetection?.type
                }],
            accounts: [],
            events: []
        };
        // Add accounts based on CPI type
        if (primaryDetection?.type === 'token_transfer') {
            sdkConfig.instructions[0].accounts = [
                { name: 'from', type: 'InterfaceAccount<TokenAccount>', isMut: true, isSigner: false },
                { name: 'to', type: 'InterfaceAccount<TokenAccount>', isMut: true, isSigner: false },
                { name: 'mint', type: 'InterfaceAccount<Mint>', isMut: false, isSigner: false },
                { name: 'authority', type: 'Signer', isMut: false, isSigner: true }
            ];
            sdkConfig.instructions[0].args = [{ name: 'amount', type: 'u64' }];
        }
        else if (primaryDetection?.type === 'token_mint') {
            sdkConfig.instructions[0].accounts = [
                { name: 'mint', type: 'InterfaceAccount<Mint>', isMut: true, isSigner: false },
                { name: 'to', type: 'InterfaceAccount<TokenAccount>', isMut: true, isSigner: false },
                { name: 'mintAuthority', type: 'Signer', isMut: false, isSigner: true }
            ];
            sdkConfig.instructions[0].args = [{ name: 'amount', type: 'u64' }];
        }
        else if (primaryDetection?.type === 'create_ata') {
            sdkConfig.instructions[0].accounts = [
                { name: 'ata', type: 'InterfaceAccount<TokenAccount>', isMut: true, isSigner: false },
                { name: 'mint', type: 'InterfaceAccount<Mint>', isMut: false, isSigner: false },
                { name: 'authority', type: 'UncheckedAccount', isMut: false, isSigner: false },
                { name: 'payer', type: 'Signer', isMut: true, isSigner: true }
            ];
        }
        else if (primaryDetection?.type === 'create_metadata') {
            sdkConfig.instructions[0].accounts = [
                { name: 'metadata', type: 'UncheckedAccount', isMut: true, isSigner: false },
                { name: 'mint', type: 'InterfaceAccount<Mint>', isMut: false, isSigner: false },
                { name: 'mintAuthority', type: 'Signer', isMut: false, isSigner: true },
                { name: 'updateAuthority', type: 'UncheckedAccount', isMut: false, isSigner: false },
                { name: 'payer', type: 'Signer', isMut: true, isSigner: true }
            ];
            sdkConfig.instructions[0].args = [
                { name: 'name', type: 'String' },
                { name: 'symbol', type: 'String' },
                { name: 'uri', type: 'String' }
            ];
        }
        (0, sdk_generator_js_1.saveSDK)(sdkConfig, projectPath);
        console.log('✅ Client SDK generated!');
    }
    console.log('✅ Project created successfully!');
    console.log(`\nNext steps:`);
    console.log(`  cd ${name}`);
    console.log(`  anchor build`);
    console.log(`  anchor test`);
    if (cpiCode) {
        console.log(`  cd client && npm install && npm run build  # Build the client SDK`);
    }
}
async function initFromTemplate(projectName, template, anchorVersion) {
    const projectPath = (0, path_1.join)(process.cwd(), projectName);
    if ((0, fs_1.existsSync)(projectPath)) {
        console.error(`❌ Directory ${projectName} already exists`);
        process.exit(1);
    }
    (0, fs_1.mkdirSync)(projectPath, { recursive: true });
    (0, fs_1.mkdirSync)((0, path_1.join)(projectPath, 'programs', projectName, 'src'), { recursive: true });
    const programId = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS";
    // Generate template files based on template ID
    let templateFiles = [];
    switch (template.id) {
        case 'token-program':
            templateFiles = (0, token_program_js_1.generateTokenProgramTemplate)(projectName, anchorVersion);
            break;
        default:
            console.error(`❌ Template "${template.id}" generator not yet implemented`);
            process.exit(1);
    }
    // Create Anchor.toml
    const anchorToml = `[toolchain]
anchor_version = "${anchorVersion}"

[features]
seeds = false
skip-lint = false

[programs.localnet]
${projectName} = "${programId}"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "Localnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
`;
    (0, fs_1.writeFileSync)((0, path_1.join)(projectPath, 'Anchor.toml'), anchorToml);
    // Write template files
    for (const file of templateFiles) {
        const filePath = (0, path_1.join)(projectPath, file.path);
        const dir = (0, path_1.join)(filePath, '..');
        (0, fs_1.mkdirSync)(dir, { recursive: true });
        (0, fs_1.writeFileSync)(filePath, file.content);
    }
    console.log('✅ Template project created successfully!');
    console.log(`\nNext steps:`);
    console.log(`  cd ${projectName}`);
    console.log(`  anchor build`);
    console.log(`  anchor test`);
    console.log(`\n📚 Template features: ${template.features.join(', ')}`);
}
async function listTemplatesCommand() {
    console.log('📚 Available FORGE Templates\n');
    const categories = ['token', 'nft', 'dao', 'defi', 'utility'];
    for (const category of categories) {
        const categoryTemplates = index_js_1.templates.filter(t => t.category === category);
        if (categoryTemplates.length > 0) {
            console.log(`📦 ${category.toUpperCase()}:`);
            for (const template of categoryTemplates) {
                console.log(`   ${template.id.padEnd(20)} - ${template.name}`);
                console.log(`   ${' '.repeat(22)}${template.description}`);
                console.log(`   ${' '.repeat(22)}Features: ${template.features.join(', ')}\n`);
            }
        }
    }
    console.log('💡 Usage: forge init <project-name> --template <template-id>');
    console.log('   Example: forge init my-token --template token-program');
}
//# sourceMappingURL=init.js.map